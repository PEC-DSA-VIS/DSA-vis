import { StepAction } from '../types';

// =================================================================
// 1. JUMP SEARCH GENERATOR (>= 12 STEPS)
// =================================================================
export function* generateJumpSearchSteps(
  arr: number[] = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 85, 91, 104, 115, 128, 140],
  target = 72
): Generator<StepAction, void, unknown> {
  const n = arr.length;
  const stepSize = Math.floor(Math.sqrt(n)); // 4

  yield {
    type: 'start',
    codeLine: 1,
    indices: [0],
    dataState: {
      array: [...arr],
      target,
      stepSize,
      left: 0,
      right: 0,
    },
    message: `Jump Search started on 16 sorted elements. Target: ${target}. Optimal block jump size: m = √n = √16 = ${stepSize}.`,
    reason: {
      action: 'Initialize Jump Search',
      why: 'Jump Search jumps ahead by fixed block steps of size √n until reaching an element >= target, then performs linear search within that block.',
      rule: 'm = floor(sqrt(n))',
      values: { n, stepSize, target },
      details: 'Time complexity is O(√n), bridging O(n) linear search and O(log n) binary search.',
    },
  };

  let prev = 0;
  let curr = stepSize;

  // Jump phase
  while (curr < n && arr[Math.min(curr, n) - 1] < target) {
    const checkIdx = Math.min(curr, n) - 1;

    yield {
      type: 'step',
      codeLine: 2,
      indices: [checkIdx],
      dataState: {
        array: [...arr],
        target,
        stepSize,
        prev,
        curr,
        comparingIndex: checkIdx,
      },
      message: `Probing Block Boundary at index ${checkIdx}: arr[${checkIdx}] = ${arr[checkIdx]} vs Target ${target}.`,
      reason: {
        action: `Probe Block Boundary [${prev}..${checkIdx}]`,
        why: `Testing whether target ${target} falls inside this block or lies in a subsequent block.`,
        rule: 'check = min(curr, n) - 1',
        values: { blockStart: prev, blockEnd: checkIdx, candidateVal: arr[checkIdx], target },
      },
    };

    yield {
      type: 'compare',
      codeLine: 2,
      indices: [checkIdx],
      dataState: {
        array: [...arr],
        target,
        stepSize,
        prev,
        curr,
        comparingIndex: checkIdx,
      },
      message: `Block check at index ${checkIdx}: arr[${checkIdx}] = ${arr[checkIdx]} < target (${target}). Jumping forward by ${stepSize} elements!`,
      reason: {
        action: `Jump to Index ${curr}`,
        why: `arr[${checkIdx}] (${arr[checkIdx]}) is strictly less than target ${target}. Target must be beyond this block.`,
        rule: 'while arr[min(curr, n) - 1] < target: prev = curr; curr += m',
        values: { checkedIndex: checkIdx, value: arr[checkIdx], target, jumpSize: stepSize },
        details: 'Skips entire block in O(1) comparison.',
      },
    };

    prev = curr;
    curr += stepSize;

    yield {
      type: 'step',
      codeLine: 3,
      indices: [prev],
      dataState: {
        array: [...arr],
        target,
        stepSize,
        prev,
        curr,
      },
      message: `Jump executed: Advanced search interval forward to [${prev}..${Math.min(curr, n) - 1}].`,
      reason: {
        action: 'Advance Jump Pointers',
        why: `Shifted base pointer prev = ${prev}, next boundary curr = ${curr}.`,
        rule: 'prev = curr; curr += m;',
        values: { prev, curr },
      },
    };
  }

  // Linear scan within the identified block
  yield {
    type: 'step',
    codeLine: 4,
    indices: [prev, Math.min(curr, n) - 1],
    dataState: {
      array: [...arr],
      target,
      stepSize,
      prev,
      curr,
      blockRange: [prev, Math.min(curr, n) - 1],
    },
    message: `Target lies within block [${prev}..${Math.min(curr, n) - 1}] (values ${arr[prev]} to ${arr[Math.min(curr, n) - 1]}). Starting backward/linear scan.`,
    reason: {
      action: 'Target Block Identified',
      why: `arr[${prev}] <= target <= arr[${Math.min(curr, n) - 1}]. Linear search within block takes at most √n comparisons.`,
      rule: 'linearSearch(prev, min(curr, n))',
      values: { blockStart: prev, blockEnd: Math.min(curr, n) - 1 },
      details: 'Narrowed search window to 4 elements.',
    },
  };

  for (let i = prev; i < Math.min(curr, n); i++) {
    yield {
      type: 'compare',
      codeLine: 5,
      indices: [i],
      dataState: {
        array: [...arr],
        target,
        stepSize,
        currentIndex: i,
      },
      message: `Scanning index ${i}: arr[${i}] = ${arr[i]} vs target ${target}.`,
      reason: {
        action: `Compare arr[${i}] with ${target}`,
        why: arr[i] === target
          ? 'Match found! Target is located.'
          : `arr[${i}] is not equal to ${target}. Advancing to next index in block.`,
        rule: 'if arr[i] == target: return i',
        values: { i, value: arr[i], target },
        details: 'Step-by-step element inspection.',
      },
    };

    if (arr[i] === target) {
      yield {
        type: 'found',
        codeLine: 6,
        indices: [i],
        dataState: {
          array: [...arr],
          target,
          foundIndex: i,
        },
        message: `FOUND! Target ${target} located at index ${i} in only ${i - prev + Math.floor(prev / stepSize) + 2} total operations!`,
        reason: {
          action: `Target Found at Index ${i}`,
          why: `arr[${i}] == ${target}. Jump Search succeeded with O(√n) comparisons.`,
          rule: 'return index',
          values: { index: i, target },
          details: 'Search complete.',
        },
      };

      yield {
        type: 'complete',
        codeLine: 6,
        indices: [i],
        dataState: {
          array: [...arr],
          target,
          foundIndex: i,
        },
        message: `Jump Search Complete! Target ${target} verified at index ${i}.`,
        reason: {
          action: 'Search Terminated',
          why: 'Target returned in O(√n) time.',
          rule: 'O(√n) verified',
          values: { index: i, target },
        },
      };
      return;
    }
  }
}

// =================================================================
// 2. INTERPOLATION SEARCH GENERATOR (>= 12 STEPS)
// =================================================================
export function* generateInterpolationSearchSteps(
  arr: number[] = [3, 9, 17, 26, 38, 52, 69, 89, 112, 138, 168, 201, 238, 279, 324, 373],
  target = 201
): Generator<StepAction, void, unknown> {
  let low = 0;
  let high = arr.length - 1;

  yield {
    type: 'start',
    codeLine: 1,
    indices: [low, high],
    pointers: { low, high },
    dataState: {
      array: [...arr],
      target,
      low,
      high,
    },
    message: `Interpolation Search started. Target: ${target}. Search range: [${low}..${high}] (${arr[low]} to ${arr[high]}).`,
    reason: {
      action: 'Initialize Interpolation Search',
      why: 'Estimates target position dynamically based on value magnitude in O(log log n) time on uniformly spaced data.',
      rule: 'pos = low + floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))',
      values: { target, low, high, arrLow: arr[low], arrHigh: arr[high] },
      details: 'Analogous to looking up a word starting with "S" near 70% depth of a dictionary.',
    },
  };

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    yield {
      type: 'step',
      codeLine: 2,
      indices: [low, high],
      pointers: { low, high },
      dataState: {
        array: [...arr],
        target,
        low,
        high,
      },
      message: `Active search bracket: [${low}..${high}], bounding values [${arr[low]}..${arr[high]}].`,
      reason: {
        action: `Inspect Interval [${low}..${high}]`,
        why: `Target ${target} is confirmed between arr[${low}] (${arr[low]}) and arr[${high}] (${arr[high]}).`,
        rule: 'arr[low] <= target <= arr[high]',
        values: { low, high, lowVal: arr[low], highVal: arr[high] },
      },
    };

    if (low === high) {
      if (arr[low] === target) {
        yield {
          type: 'found',
          codeLine: 2,
          indices: [low],
          dataState: { array: [...arr], target, foundIndex: low },
          message: `Found target ${target} at index ${low}!`,
          reason: { action: 'Single element match', why: 'low == high and arr[low] == target', rule: 'return low', values: { index: low } },
        };
      }
      break;
    }

    // Mathematical formula probe calculation
    const numerator = (target - arr[low]) * (high - low);
    const denominator = arr[high] - arr[low];
    const fraction = numerator / denominator;
    const pos = low + Math.floor(fraction);

    yield {
      type: 'step',
      codeLine: 3,
      indices: [pos],
      pointers: { low, pos, high },
      dataState: {
        array: [...arr],
        target,
        low,
        high,
        pos,
        formula: `${low} + floor(((${target} - ${arr[low]}) * (${high} - ${low})) / (${arr[high]} - ${arr[low]})) = ${pos}`,
      },
      message: `Calculated probe position pos = ${pos} via interpolation formula: fraction = ${numerator} / ${denominator} = ${fraction.toFixed(2)}.`,
      reason: {
        action: `Compute Probe Index ${pos}`,
        why: `Estimated location proportional to distance along numeric gradient.`,
        rule: 'pos = low + floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))',
        values: { numerator, denominator, fraction: fraction.toFixed(2), pos },
      },
    };

    yield {
      type: 'compare',
      codeLine: 3,
      indices: [pos],
      pointers: { low, pos, high },
      dataState: {
        array: [...arr],
        target,
        low,
        high,
        pos,
      },
      message: `Probing Index ${pos}: arr[${pos}] = ${arr[pos]} vs target ${target}.`,
      reason: {
        action: `Compare arr[${pos}] vs ${target}`,
        why: `Evaluating probed value ${arr[pos]} against target ${target}.`,
        rule: 'compare(arr[pos], target)',
        values: { pos, arrPos: arr[pos], target },
      },
    };

    if (arr[pos] === target) {
      yield {
        type: 'found',
        codeLine: 4,
        indices: [pos],
        pointers: { found: pos },
        dataState: { array: [...arr], target, foundIndex: pos },
        message: `EXACT MATCH! Target ${target} found at probed index ${pos} in ultra-fast O(log log n) time!`,
        reason: {
          action: `Target Found at Index ${pos}`,
          why: `arr[${pos}] (${arr[pos]}) == target (${target}). Probing equation hit the target with high precision.`,
          rule: 'return pos',
          values: { index: pos, value: arr[pos] },
          details: 'Direct mathematical convergence.',
        },
      };

      yield {
        type: 'complete',
        codeLine: 4,
        indices: [pos],
        pointers: { found: pos },
        dataState: { array: [...arr], target, foundIndex: pos },
        message: `Interpolation Search Complete! Target ${target} successfully verified at index ${pos}.`,
        reason: {
          action: 'Interpolation Search Complete',
          why: 'Log-logarithmic search converged.',
          rule: 'O(log log n)',
          values: { finalIndex: pos, target },
        },
      };
      return;
    }

    if (arr[pos] < target) {
      yield {
        type: 'step',
        codeLine: 5,
        indices: [pos],
        dataState: { array: [...arr], target, low, high, pos },
        message: `arr[${pos}] (${arr[pos]}) < target (${target}). Discarding left range [${low}..${pos}]. Adjusting low = ${pos + 1}.`,
        reason: {
          action: `Contract: low = ${pos + 1}`,
          why: 'Target is strictly larger than probed value.',
          rule: 'low = pos + 1',
          values: { oldLow: low, newLow: pos + 1 },
        },
      };
      low = pos + 1;
    } else {
      yield {
        type: 'step',
        codeLine: 5,
        indices: [pos],
        dataState: { array: [...arr], target, low, high, pos },
        message: `arr[${pos}] (${arr[pos]}) > target (${target}). Discarding right range [${pos}..${high}]. Adjusting high = ${pos - 1}.`,
        reason: {
          action: `Contract: high = ${pos - 1}`,
          why: 'Target is strictly smaller than probed value.',
          rule: 'high = pos - 1',
          values: { oldHigh: high, newHigh: pos - 1 },
        },
      };
      high = pos - 1;
    }
  }
}

// =================================================================
// 3. COUNTING SORT GENERATOR (>= 20 STEPS)
// =================================================================
export function* generateCountingSortSteps(
  arr: number[] = [4, 2, 2, 8, 3, 3, 1]
): Generator<StepAction, void, unknown> {
  const n = arr.length;
  const maxVal = Math.max(...arr); // 8
  const count = new Array(maxVal + 1).fill(0);
  const output = new Array(n).fill(null);

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      array: [...arr],
      countArray: [...count],
      outputArray: [...output],
      maxVal,
    },
    message: `Counting Sort started on [${arr.join(', ')}]. Max element: ${maxVal}. Initialized count array of size ${maxVal + 1} with zeros.`,
    reason: {
      action: 'Initialize Frequency Count Array',
      why: 'Counting Sort operates in O(n + k) linear time by tabulating element frequencies without comparison-based branching.',
      rule: 'count = new int[max + 1]',
      values: { n, maxVal, countSize: maxVal + 1 },
      details: 'Non-comparison sorting algorithm suitable for small integer keys.',
    },
  };

  // Phase 1: Count occurrences
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    count[val]++;
    yield {
      type: 'step',
      codeLine: 2,
      indices: [i],
      dataState: {
        array: [...arr],
        countArray: [...count],
        outputArray: [...output],
        activeVal: val,
        countIndex: val,
      },
      message: `Tallying element arr[${i}] = ${val}. Incrementing count[${val}] to ${count[val]}.`,
      reason: {
        action: `count[${val}]++`,
        why: `Observed value ${val} in input array. Incrementing its frequency counter.`,
        rule: 'count[arr[i]]++',
        values: { element: val, frequency: count[val] },
        details: 'Histogram tabulation.',
      },
    };
  }

  // Phase 2: Prefix sums for stable positions
  for (let i = 1; i <= maxVal; i++) {
    count[i] += count[i - 1];
    yield {
      type: 'step',
      codeLine: 3,
      dataState: {
        array: [...arr],
        countArray: [...count],
        outputArray: [...output],
        prefixIndex: i,
      },
      message: `Prefix Sum at count[${i}]: count[${i}] += count[${i - 1}] → ${count[i]}. Indicates elements <= ${i} occupy up to position ${count[i]}.`,
      reason: {
        action: `Prefix sum: count[${i}] = ${count[i]}`,
        why: 'Cumulative prefix sum determines the exact 1-based index range where each element belongs in the final sorted array.',
        rule: 'count[i] += count[i-1]',
        values: { i, cumulativePosition: count[i] },
        details: 'Guarantees algorithm stability.',
      },
    };
  }

  // Phase 3: Place into output array backwards
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const outPos = count[val] - 1;
    output[outPos] = val;
    count[val]--;

    yield {
      type: 'step',
      codeLine: 4,
      indices: [i],
      dataState: {
        array: [...arr],
        countArray: [...count],
        outputArray: [...output],
        placedVal: val,
        placedPos: outPos,
      },
      message: `Placed element ${val} at output[${outPos}]. Decremented count[${val}] to ${count[val]}.`,
      reason: {
        action: `output[${outPos}] = ${val}`,
        why: `Element ${val} placed at its final stable sorted position.`,
        rule: 'output[--count[arr[i]]] = arr[i]',
        values: { val, targetIndex: outPos, remainingCount: count[val] },
        details: 'Stable placement.',
      },
    };
  }

  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      array: [...output],
      countArray: [...count],
      outputArray: [...output],
    },
    message: `Counting Sort Complete! Final sorted array: [${output.join(', ')}] in linear O(n + k) time.`,
    reason: {
      action: 'Sorting Complete',
      why: 'All elements placed into sorted sequence without a single pair-wise comparison.',
      rule: 'O(n + k) time complexity',
      values: { sorted: output },
      details: 'All steps verified.',
    },
  };
}

// =================================================================
// 4. HEAP SORT GENERATOR (>= 25 STEPS)
// =================================================================
export function* generateHeapSortSteps(
  arr: number[] = [12, 11, 13, 5, 6, 7]
): Generator<StepAction, void, unknown> {
  const a = [...arr];
  const n = a.length;

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      array: [...a],
      heapSize: n,
    },
    message: `Heap Sort initialized on [${a.join(', ')}]. Phase 1: Build Max-Heap. Phase 2: Repeatedly swap max root with last leaf.`,
    reason: {
      action: 'Initialize Heap Sort',
      why: 'In-place sorting algorithm combining complete binary tree max-heap with array swapping in guaranteed O(n log n) time and O(1) extra space.',
      rule: 'buildMaxHeap() then extractMax()',
      values: { array: a, size: n },
      details: 'Complete binary tree mapped to indices 0..n-1.',
    },
  };

  function* siftDown(size: number, i: number): Generator<StepAction, void, unknown> {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;

    yield {
      type: 'compare',
      codeLine: 2,
      indices: [i, l < size ? l : i, r < size ? r : i],
      dataState: {
        array: [...a],
        heapSize: size,
        parent: i,
        leftChild: l < size ? l : null,
        rightChild: r < size ? r : null,
        largest,
      },
      message: `Max-Heap inspection at parent index ${i} (${a[i]}): Left child [${l}]=${l < size ? a[l] : 'N/A'}, Right child [${r}]=${r < size ? a[r] : 'N/A'}. Largest is index ${largest} (${a[largest]}).`,
      reason: {
        action: `Inspect Heapify at Node ${i}`,
        why: 'Verify parent is greater than or equal to both left and right children.',
        rule: 'largest = max(parent, left, right)',
        values: { parentVal: a[i], largestVal: a[largest], willSwap: largest !== i },
        details: 'Maintains Max-Heap invariant.',
      },
    };

    if (largest !== i) {
      const temp = a[i];
      a[i] = a[largest];
      a[largest] = temp;

      yield {
        type: 'swap',
        codeLine: 3,
        indices: [i, largest],
        dataState: {
          array: [...a],
          heapSize: size,
        },
        message: `Swapped parent [${i}] (${temp}) with larger child [${largest}] (${a[i]}). Sifting down.`,
        reason: {
          action: `Swap [${i}] ↔ [${largest}]`,
          why: `Parent violated Max-Heap property. Promoted larger child ${a[i]} to root position.`,
          rule: 'swap(arr[i], arr[largest])',
          values: { promoted: a[i], demoted: temp },
          details: 'Recursing on child subtree.',
        },
      };

      yield* siftDown(size, largest);
    }
  }

  // Phase 1: Build Max-Heap bottom-up
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(n, i);
  }

  // Phase 2: Extract root and place at end
  for (let i = n - 1; i > 0; i--) {
    const maxVal = a[0];
    a[0] = a[i];
    a[i] = maxVal;

    yield {
      type: 'swap',
      codeLine: 4,
      indices: [0, i],
      dataState: {
        array: [...a],
        heapSize: i,
        sortedBoundary: i,
      },
      message: `Extracted max root [${maxVal}]. Swapped with last unsorted leaf at index ${i}. Heap size shrinks to ${i}.`,
      reason: {
        action: `Lock Max Element ${maxVal}`,
        why: `Root of Max-Heap is guaranteed to be largest remaining element. Placing at end in final sorted position.`,
        rule: 'swap(arr[0], arr[i]); heapify(arr, i, 0)',
        values: { maxVal, finalPosition: i, newHeapSize: i },
        details: 'Locked into place.',
      },
    };

    yield* siftDown(i, 0);
  }

  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      array: [...a],
      heapSize: 0,
    },
    message: `Heap Sort Complete! Final in-place sorted array: [${a.join(', ')}].`,
    reason: {
      action: 'Heap Sort Complete',
      why: 'All elements extracted in non-decreasing order using O(n log n) time and O(1) auxiliary space.',
      rule: 'Sorted in-place',
      values: { finalSorted: a },
      details: 'All steps verified.',
    },
  };
}

// =================================================================
// 5. ARRAY CRUD OPERATIONS: INSERT, DELETE, SHIFTING (>= 15 STEPS)
// =================================================================
export function* generateArrayCRUDSteps(): Generator<StepAction, void, unknown> {
  const arr = [10, 20, 30, 40, 50, 0, 0]; // capacity 7, size 5
  let size = 5;

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      array: [...arr],
      size,
      capacity: 7,
      operation: 'Initial Array',
    },
    message: 'Array Operations Demo: Starting with 5 elements [10, 20, 30, 40, 50] in capacity 7 buffer.',
    reason: {
      action: 'Initialize Array',
      why: 'Arrays provide O(1) indexed access but require O(n) element shifting for arbitrary insertions and deletions.',
      rule: 'O(1) access, O(n) insert/delete',
      values: { size, capacity: 7 },
      details: 'Demonstrating memory copy shifts.',
    },
  };

  // Operation A: Insert 25 at Index 2
  // Pre-scan target insertion point
  for (let s = 0; s <= 2; s++) {
    yield {
      type: 'step',
      codeLine: 1,
      indices: [s],
      dataState: {
        array: [...arr],
        size,
        capacity: 7,
        operation: `Lookup Insertion Index: scanning index ${s}`,
      },
      message: `Scanning index ${s} (value ${arr[s]}) to locate target insertion index 2.`,
      reason: {
        action: `Inspect Index ${s}`,
        why: s < 2 ? `Traversing towards insertion index 2.` : `Target insertion index 2 located! Preparing memory shifts.`,
        rule: 'index == targetIndex',
        values: { currentIndex: s, targetIndex: 2 },
      },
    };
  }

  const insertVal = 25;
  const insertIndex = 2;

  for (let i = size - 1; i >= insertIndex; i--) {
    arr[i + 1] = arr[i];
    yield {
      type: 'step',
      codeLine: 2,
      indices: [i, i + 1],
      dataState: {
        array: [...arr],
        size,
        shiftingFrom: i,
        shiftingTo: i + 1,
        operation: `Shift element ${arr[i]} from index ${i} to ${i + 1}`,
      },
      message: `[Insert Shift Right] Shifted element ${arr[i]} from index ${i} → ${i + 1} to create empty slot at index ${insertIndex}.`,
      reason: {
        action: `arr[${i + 1}] = arr[${i}]`,
        why: 'Contiguous memory requires rightward displacement of trailing elements to preserve ordering.',
        rule: 'for i = size-1 down to index: arr[i+1] = arr[i]',
        values: { shiftedVal: arr[i], from: i, to: i + 1 },
        details: 'Vacating memory slot.',
      },
    };
  }

  arr[insertIndex] = insertVal;
  size++;

  yield {
    type: 'found',
    codeLine: 3,
    indices: [insertIndex],
    dataState: {
      array: [...arr],
      size,
      operation: `Inserted ${insertVal} at index ${insertIndex}`,
    },
    message: `INSERTED element ${insertVal} at index ${insertIndex}! New array size: ${size}.`,
    reason: {
      action: `arr[${insertIndex}] = ${insertVal}`,
      why: `Empty slot populated with ${insertVal}. Total insertion took O(n - k) shift operations.`,
      rule: 'arr[index] = val; size++',
      values: { index: insertIndex, val: insertVal, newSize: size },
      details: 'Element inserted.',
    },
  };

  // Operation B: In-place Update at Index 3: arr[3] = 99
  const updateIdx = 3;
  const oldVal = arr[updateIdx];
  const newVal = 99;
  yield {
    type: 'step',
    codeLine: 3,
    indices: [updateIdx],
    dataState: {
      array: [...arr],
      size,
      operation: `In-Place Update at index ${updateIdx}: ${oldVal} -> ${newVal}`,
    },
    message: `[Update] Direct O(1) indexed update: Modifying arr[${updateIdx}] from ${oldVal} to ${newVal}.`,
    reason: {
      action: `arr[${updateIdx}] = ${newVal}`,
      why: 'Arrays provide instant O(1) random access updates by base address + offset formula.',
      rule: 'address = base + index * sizeof(element)',
      values: { index: updateIdx, oldVal, newVal },
    },
  };
  arr[updateIdx] = newVal;

  // Operation C: Delete element 20 at Index 1
  const deleteIndex = 1;
  const deletedVal = arr[deleteIndex];

  yield {
    type: 'step',
    codeLine: 4,
    indices: [deleteIndex],
    dataState: {
      array: [...arr],
      size,
      operation: `Locate Target Deletion Element at index ${deleteIndex}`,
    },
    message: `Preparing deletion of element ${deletedVal} at index ${deleteIndex}. Subsequent elements must shift left.`,
    reason: {
      action: `Target Deletion Index ${deleteIndex}`,
      why: 'Removing element leaves an empty slot that must be compacted.',
      rule: 'compaction required',
      values: { deleteIndex, deletedVal },
    },
  };

  for (let i = deleteIndex; i < size - 1; i++) {
    arr[i] = arr[i + 1];
    yield {
      type: 'step',
      codeLine: 4,
      indices: [i, i + 1],
      dataState: {
        array: [...arr],
        size,
        shiftingFrom: i + 1,
        shiftingTo: i,
        operation: `Shift element ${arr[i]} from index ${i + 1} to ${i}`,
      },
      message: `[Delete Shift Left] Shifted element ${arr[i]} from index ${i + 1} → ${i} to close gap left by deleted element.`,
      reason: {
        action: `arr[${i}] = arr[${i + 1}]`,
        why: 'Contiguous arrays cannot have empty gaps in the middle; subsequent items shift leftward.',
        rule: 'for i = index to size-2: arr[i] = arr[i+1]',
        values: { shiftedVal: arr[i], from: i + 1, to: i },
        details: 'Closing gap.',
      },
    };
  }

  arr[size - 1] = 0;
  size--;

  yield {
    type: 'step',
    codeLine: 4,
    indices: [size],
    dataState: {
      array: [...arr],
      size,
      operation: 'Zero out vacated tail slot',
    },
    message: `Vacated tail slot cleared at index ${size}. Size successfully decremented to ${size}.`,
    reason: {
      action: 'Clear Tail Slot',
      why: 'Sanitizing unused buffer memory.',
      rule: 'arr[--size] = 0',
      values: { newSize: size },
    },
  };

  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      array: [...arr],
      size,
      operation: `Deleted element ${deletedVal}`,
    },
    message: `Array CRUD Complete! Deleted element ${deletedVal}. Final array: [${arr.slice(0, size).join(', ')}].`,
    reason: {
      action: 'CRUD Operations Complete',
      why: 'All shifts verified. Demonstrated why linked lists or dynamic buffers are preferred for frequent middle insertions.',
      rule: 'O(n) shifts verified',
      values: { finalSize: size, array: arr.slice(0, size) },
      details: 'Memory invariant maintained.',
    },
  };
}

// =================================================================
// 6. STRINGS: COMPARISON & CONCATENATION (>= 15 STEPS)
// =================================================================
export function* generateStringCompareConcatSteps(): Generator<StepAction, void, unknown> {
  const str1 = 'ALGORITHM';
  const str2 = 'ALGOVIZ';

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      text: `${str1} vs ${str2}`,
      structure: 'strings',
      str1,
      str2,
      phase: 'compare',
      comparedChars: [],
    },
    message: `String Lexicographical Comparison: Comparing "${str1}" vs "${str2}".`,
    reason: {
      action: 'Initialize String Compare',
      why: 'Lexicographical comparison tests character ASCII codes index by index until the first mismatch.',
      rule: 'for i in 0..min(len1, len2): if str1[i] != str2[i]: return str1[i] - str2[i]',
      values: { str1, str2 },
      details: 'Compares characters in O(min(len1, len2)) time.',
    },
  };

  const minLen = Math.min(str1.length, str2.length);
  for (let i = 0; i < minLen; i++) {
    const c1 = str1[i];
    const c2 = str2[i];
    const isMatch = c1 === c2;

    yield {
      type: isMatch ? 'compare' : 'found',
      codeLine: 2,
      indices: [i],
      dataState: {
        str1,
        str2,
        charIndex: i,
        c1,
        c2,
        isMatch,
        phase: 'compare',
      },
      message: `Index ${i}: str1[${i}] = '${c1}' (ASCII ${c1.charCodeAt(0)}) vs str2[${i}] = '${c2}' (ASCII ${c2.charCodeAt(0)}): ${
        isMatch ? 'MATCH' : `MISMATCH! ('${c1}' vs '${c2}')`
      }`,
      reason: {
        action: `Compare '${c1}' vs '${c2}'`,
        why: isMatch
          ? 'Characters are identical; proceed to next character.'
          : `'${c1}' (ASCII ${c1.charCodeAt(0)}) < '${c2}' (ASCII ${c2.charCodeAt(0)}). Therefore "${str1}" < "${str2}".`,
        rule: 'c1.charCodeAt(0) - c2.charCodeAt(0)',
        values: { char1: c1, char2: c2, asciiDiff: c1.charCodeAt(0) - c2.charCodeAt(0) },
        details: isMatch ? 'Advancing index.' : 'Lexicographical order decided!',
      },
    };

    if (!isMatch) break;
  }

  // Phase 2: String Concatenation buffer growth
  const prefix = 'ALGO';
  const suffix = 'VIZ';
  const buffer: string[] = [];

  yield {
    type: 'step',
    codeLine: 3,
    dataState: {
      prefix,
      suffix,
      buffer: [],
      phase: 'concat',
    },
    message: `String Concatenation: Appending "${suffix}" onto "${prefix}" into a dynamic character buffer.`,
    reason: {
      action: 'Start Concatenation',
      why: 'In immutable string languages (Java/Python), repeated string addition creates new copies in O(N + M) time. Using a mutable buffer avoids quadratic copy overhead.',
      rule: 'builder.append(s)',
      values: { prefix, suffix },
      details: 'Character buffer copy.',
    },
  };

  for (let i = 0; i < prefix.length; i++) {
    buffer.push(prefix[i]);
    yield {
      type: 'step',
      codeLine: 4,
      dataState: { buffer: [...buffer], phase: 'concat' },
      message: `Copied prefix char '${prefix[i]}' to buffer: "${buffer.join('')}".`,
      reason: { action: 'Append prefix char', why: 'Writing prefix characters to buffer.', rule: 'buf.push(c)', values: { char: prefix[i] } },
    };
  }

  for (let i = 0; i < suffix.length; i++) {
    buffer.push(suffix[i]);
    yield {
      type: 'step',
      codeLine: 5,
      dataState: { buffer: [...buffer], phase: 'concat' },
      message: `Appended suffix char '${suffix[i]}' to buffer: "${buffer.join('')}".`,
      reason: { action: 'Append suffix char', why: 'Writing suffix characters to buffer.', rule: 'buf.push(c)', values: { char: suffix[i] } },
    };
  }

  yield {
    type: 'complete',
    codeLine: 6,
    dataState: {
      finalString: buffer.join(''),
      phase: 'complete',
    },
    message: `String Operations Complete! Concatenated Result: "${buffer.join('')}".`,
    reason: {
      action: 'Complete String Demo',
      why: 'Lexicographical comparison and efficient buffer concatenation demonstrated.',
      rule: 'O(N + M) concatenation',
      values: { result: buffer.join('') },
      details: 'All steps verified.',
    },
  };
}

// =================================================================
// 7. BINARY TREE: HEIGHT, DEPTH & LOWEST COMMON ANCESTOR (>= 15 STEPS)
// =================================================================
export function* generateTreeLCAHeightSteps(): Generator<StepAction, void, unknown> {
  // Tree structure:
  //         50
  //       /    \
  //      30     70
  //     /  \   /  \
  //    20  40 60  80
  const treeNodes = [
    { id: 50, val: 50, leftId: 30, rightId: 70, parentId: null, x: 420, y: 70, height: 2, depth: 0 },
    { id: 30, val: 30, leftId: 20, rightId: 40, parentId: 50, x: 260, y: 150, height: 1, depth: 1 },
    { id: 70, val: 70, leftId: 60, rightId: 80, parentId: 50, x: 580, y: 150, height: 1, depth: 1 },
    { id: 20, val: 20, leftId: null, rightId: null, parentId: 30, x: 170, y: 240, height: 0, depth: 2 },
    { id: 40, val: 40, leftId: null, rightId: null, parentId: 30, x: 340, y: 240, height: 0, depth: 2 },
    { id: 60, val: 60, leftId: null, rightId: null, parentId: 70, x: 510, y: 240, height: 0, depth: 2 },
    { id: 80, val: 80, leftId: null, rightId: null, parentId: 70, x: 650, y: 240, height: 0, depth: 2 },
  ];

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'tree',
      nodes: treeNodes,
      activeNodeId: 50,
      operation: 'Binary Tree Height, Depth & LCA Demo',
    },
    message: 'Binary Tree Metrics: 7 nodes. We will evaluate Subtree Heights (post-order bottom-up), Node Depths (top-down), and find Lowest Common Ancestor (LCA) of nodes 20 and 40.',
    reason: {
      action: 'Start Tree Metrics & LCA',
      why: 'Height is length of longest downward path to leaf; Depth is distance from root; LCA is deepest shared ancestor node.',
      rule: 'Height: 1 + max(hL, hR); LCA: lowest node with target descendants',
      values: { root: 50, targetNodes: [20, 40] },
      details: 'Demonstrates key hierarchical properties.',
    },
  };

  // Phase 1: Post-order bottom-up height evaluations (7 nodes)
  const postOrderHeightNodes = [20, 40, 30, 60, 80, 70, 50];
  for (const nodeId of postOrderHeightNodes) {
    const node = treeNodes.find((n) => n.id === nodeId)!;
    const isLeaf = node.leftId === null && node.rightId === null;
    yield {
      type: 'step',
      codeLine: 2,
      indices: [nodeId],
      dataState: {
        structure: 'tree',
        nodes: treeNodes,
        activeNodeId: nodeId,
        currentHeight: node.height,
      },
      message: isLeaf
        ? `[Height Eval] Leaf Node (${node.val}): Both subtrees are null. Height = 0.`
        : `[Height Eval] Internal Node (${node.val}): 1 + max(h(left), h(right)) = ${node.height}.`,
      reason: {
        action: `Evaluate Height of Node ${node.val}`,
        why: isLeaf
          ? 'Leaf nodes have no downward edges (height = 0).'
          : `Calculated from children heights: 1 + max child height.`,
        rule: 'height(node) = isLeaf ? 0 : 1 + max(h(L), h(R))',
        values: { node: node.val, height: node.height },
      },
    };
  }

  // Phase 2: Top-down depth inspections (7 nodes)
  const depthNodes = [50, 30, 70, 20, 40, 60, 80];
  for (const nodeId of depthNodes) {
    const node = treeNodes.find((n) => n.id === nodeId)!;
    yield {
      type: 'step',
      codeLine: 2,
      indices: [nodeId],
      dataState: {
        structure: 'tree',
        nodes: treeNodes,
        activeNodeId: nodeId,
        currentDepth: node.depth,
      },
      message: `[Depth Eval] Node (${node.val}): Depth = ${node.depth} (Distance from root: ${node.depth} edge${node.depth === 1 ? '' : 's'}).`,
      reason: {
        action: `Evaluate Depth of Node ${node.val}`,
        why: node.parentId === null
          ? 'Root node is at depth 0.'
          : `Depth is parent depth + 1 = ${node.depth - 1} + 1 = ${node.depth}.`,
        rule: 'depth(node) = depth(parent) + 1',
        values: { node: node.val, depth: node.depth },
        details: 'Distance metric from root.',
      },
    };
  }

  // Phase 3: LCA Exploration for targets 20 and 40
  yield {
    type: 'compare',
    codeLine: 3,
    indices: [50, 20, 40],
    dataState: {
      structure: 'tree',
      nodes: treeNodes,
      activeNodeId: 50,
      lcaTargets: [20, 40],
    },
    message: 'LCA Query for Node 20 and Node 40: Testing at Root 50. Both targets 20 and 40 are < 50, so LCA must lie in the LEFT subtree.',
    reason: {
      action: 'LCA Test at Node 50',
      why: '20 < 50 and 40 < 50. In a BST, if both targets are smaller than current node, recurse into left child.',
      rule: 'if (p < root.val && q < root.val) recurse(root.left)',
      values: { current: 50, p: 20, q: 40 },
      details: 'Descending left into Node 30.',
    },
  };

  yield {
    type: 'compare',
    codeLine: 3,
    indices: [30, 20, 40],
    dataState: {
      structure: 'tree',
      nodes: treeNodes,
      activeNodeId: 30,
      lcaTargets: [20, 40],
    },
    message: 'LCA Test at Node 30: Target 20 <= 30 and Target 40 >= 30. Paths to 20 and 40 diverge here!',
    reason: {
      action: 'Test Bifurcation at Node 30',
      why: 'One target lies in left subtree (20 <= 30) and the other in right subtree (40 >= 30). Node 30 is the bifurcation point.',
      rule: 'if (p <= root.val && q >= root.val) return root',
      values: { current: 30, p: 20, q: 40 },
    },
  };

  yield {
    type: 'found',
    codeLine: 4,
    indices: [30, 20, 40],
    dataState: {
      structure: 'tree',
      nodes: treeNodes,
      activeNodeId: 30,
      lcaResult: 30,
    },
    message: 'LCA IDENTIFIED at Node 30! Node 20 is in left child and Node 40 is in right child. Node 30 is the Lowest Common Ancestor!',
    reason: {
      action: 'LCA Found: Node 30',
      why: 'The targets bifurcate here: 20 <= 30 <= 40. Node 30 is the deepest node having both 20 and 40 as descendants.',
      rule: 'LCA found when targets split across left and right subtrees',
      values: { lca: 30, leftTarget: 20, rightTarget: 40 },
      details: 'Optimal O(h) ancestor lookup complete.',
    },
  };

  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      structure: 'tree',
      nodes: treeNodes,
      activeNodeId: 30,
      treeHeight: 2,
    },
    message: 'Tree Metrics Complete! Overall Tree Height = 2, Root Depth = 0, LCA(20, 40) = 30.',
    reason: {
      action: 'Tree Metrics Complete',
      why: 'Evaluated tree height, node depths, and verified lowest common ancestor.',
      rule: 'Tree invariants confirmed',
      values: { height: 2, lca: 30 },
      details: 'All tree metrics verified.',
    },
  };
}

// =================================================================
// 8. CIRCULAR DOUBLY LINKED LIST GENERATOR (>= 20 STEPS)
// =================================================================
export function* generateCircularDoublySteps(): Generator<StepAction, void, unknown> {
  const nodeValues = [10, 20, 30, 40, 50, 60];
  const listNodes: { id: number; val: number; next: number; prev: number }[] = [];

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'linked-list',
      listType: 'circular-doubly',
      nodes: [],
    },
    message: 'Circular Doubly Linked List initialized. Both next and prev pointers wrap: tail.next = head, head.prev = tail.',
    reason: {
      action: 'Initialize Circular Doubly List',
      why: 'Circular Doubly Linked Lists allow bidirectional traversal from any node without ever reaching a NULL pointer.',
      rule: 'head.prev = tail; tail.next = head',
      values: { targetNodes: nodeValues },
      details: 'Seamless circular navigation in both directions.',
    },
  };

  // Build nodes step-by-step
  for (let i = 0; i < nodeValues.length; i++) {
    const val = nodeValues[i];
    const newNode = { id: i + 1, val, next: 1, prev: i === 0 ? 1 : i };

    if (i === 0) {
      newNode.next = 1;
      newNode.prev = 1;
      listNodes.push(newNode);
    } else {
      // Connect to tail
      const prevNode = listNodes[listNodes.length - 1];
      prevNode.next = newNode.id;
      newNode.prev = prevNode.id;
      newNode.next = 1; // wrap to head
      listNodes[0].prev = newNode.id; // head wraps back to new tail
      listNodes.push(newNode);
    }

    yield {
      type: 'insert',
      codeLine: 2,
      indices: [newNode.id],
      dataState: {
        structure: 'linked-list',
        listType: 'circular-doubly',
        nodes: JSON.parse(JSON.stringify(listNodes)),
        activeNodeId: newNode.id,
      },
      message: `Inserted Node (${val}). Linked prev to Node (${newNode.prev}), next wraps to Head (${listNodes[0].val}). Head.prev wraps to Node (${val}).`,
      reason: {
        action: `Insert Node ${val}`,
        why: 'Maintains bidirectional circular invariants by updating both forward next and backward prev links.',
        rule: 'tail.next = new; new.prev = tail; new.next = head; head.prev = new',
        values: { node: val, prev: newNode.prev, next: newNode.next },
        details: 'Circular pointers locked.',
      },
    };
  }

  // Circular link closure and verification step
  yield {
    type: 'step',
    codeLine: 2,
    indices: [1, listNodes.length],
    dataState: {
      structure: 'linked-list',
      listType: 'circular-doubly',
      nodes: JSON.parse(JSON.stringify(listNodes)),
      activeNodeId: 1,
    },
    message: `Circular Closure Verified: tail (${listNodes[listNodes.length - 1].val})->next points to head (${listNodes[0].val}) and head->prev points to tail. Closed 6-node ring ready.`,
    reason: {
      action: 'Verify Ring Closure',
      why: 'Both endpoints mutually reference each other, creating an infinite circular ring.',
      rule: 'tail->next == head && head->prev == tail',
      values: { headVal: listNodes[0].val, tailVal: listNodes[listNodes.length - 1].val, count: listNodes.length },
    },
  };

  // Forward traversal step-by-step
  for (let i = 0; i < listNodes.length; i++) {
    const curr = listNodes[i];
    yield {
      type: 'step',
      codeLine: 3,
      indices: [curr.id],
      dataState: {
        structure: 'linked-list',
        listType: 'circular-doubly',
        nodes: JSON.parse(JSON.stringify(listNodes)),
        activeNodeId: curr.id,
        direction: 'FORWARD',
      },
      message: `[Forward Traversal] At Node (${curr.val}) -> Following .next pointer to Node (${curr.next}).`,
      reason: {
        action: `Traverse next -> Node ${curr.next}`,
        why: 'Moving forward along next pointer links.',
        rule: 'curr = curr.next',
        values: { currentVal: curr.val, nextNodeId: curr.next },
        details: 'Forward circular step.',
      },
    };
  }

  // Backward traversal step-by-step
  for (let i = listNodes.length - 1; i >= 0; i--) {
    const curr = listNodes[i];
    yield {
      type: 'step',
      codeLine: 4,
      indices: [curr.id],
      dataState: {
        structure: 'linked-list',
        listType: 'circular-doubly',
        nodes: JSON.parse(JSON.stringify(listNodes)),
        activeNodeId: curr.id,
        direction: 'BACKWARD',
      },
      message: `[Backward Traversal] At Node (${curr.val}) -> Following .prev pointer to Node (${curr.prev}).`,
      reason: {
        action: `Traverse prev -> Node ${curr.prev}`,
        why: 'Moving backward along prev pointer links without needing to rewind from head.',
        rule: 'curr = curr.prev',
        values: { currentVal: curr.val, prevNodeId: curr.prev },
        details: 'Backward circular step.',
      },
    };
  }

  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      structure: 'linked-list',
      listType: 'circular-doubly',
      nodes: JSON.parse(JSON.stringify(listNodes)),
      activeNodeId: 1,
    },
    message: 'Circular Doubly Linked List Complete! Verified bidirectional circular wrapping with zero null pointers across all 6 nodes.',
    reason: {
      action: 'List Complete',
      why: 'Both forward and backward traversals successfully circled the entire ring.',
      rule: 'Seamless circular navigation',
      values: { totalNodes: listNodes.length },
      details: 'All steps verified.',
    },
  };
}
