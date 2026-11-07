import { StepAction } from '../types';

export interface ArrayPatternData {
  array: number[];
  target?: number;
  low?: number;
  mid?: number;
  high?: number;
  left?: number;
  right?: number;
  currentSum?: number;
  runningValue?: number | string;
  maxSoFar?: number;
  bestSubarray?: [number, number];
  windowStart?: number;
  windowEnd?: number;
  windowSum?: number;
  prefixArray?: (number | null)[];
  queryResult?: number;
  queryRange?: [number, number];
  discarded?: number[];
  foundIndex?: number | null;
  phase?: 'build' | 'query' | 'expand' | 'shrink' | 'complete';
}

/**
 * 1. Kadane's Algorithm: Max Subarray Sum with live window boundaries & extend vs reset decision
 */
export function* generateKadaneSteps(
  customArr?: number[]
): Generator<StepAction<ArrayPatternData>, void, unknown> {
  const arr = customArr || [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const n = arr.length;

  let currentSum = arr[0];
  let maxSum = arr[0];
  let curStart = 0;
  let bestStart = 0;
  let bestEnd = 0;

  // Step 0: Initial state
  yield {
    type: 'start',
    codeLine: 2,
    indices: [0],
    pointers: { i: 0, start: 0 },
    dataState: {
      array: [...arr],
      target: maxSum,
      low: 0,
      mid: 0,
      high: 0,
      currentSum,
      maxSoFar: maxSum,
      bestSubarray: [0, 0],
      runningValue: currentSum,
      phase: 'build',
    },
    message: `Kadane initialized: Start at index 0 (val: ${arr[0]}). currentSum = ${currentSum}, maxSoFar = ${maxSum}.`,
    reason: {
      action: 'Init Kadane DP',
      why: `Base subproblem initialized at index 0: currentSum=${currentSum}, maxSoFar=${maxSum}.`,
      rule: 'currentSum = arr[0], maxSoFar = arr[0]',
      values: { element: arr[0], currentSum, maxSoFar: maxSum },
      details: 'Single-element base subarray initialized.',
    },
  };

  for (let i = 1; i < n; i++) {
    const prevSum = currentSum;
    const val = arr[i];

    // Decide whether to extend previous subarray or start new from current element
    if (prevSum + val > val) {
      currentSum = prevSum + val;
    } else {
      currentSum = val;
      curStart = i;
    }

    const isNewGlobalMax = currentSum > maxSum;
    if (isNewGlobalMax) {
      maxSum = currentSum;
      bestStart = curStart;
      bestEnd = i;
    }

    yield {
      type: isNewGlobalMax ? 'found' : 'compare',
      codeLine: 4,
      indices: Array.from({ length: i - curStart + 1 }, (_, k) => curStart + k),
      pointers: { i, start: curStart, end: i },
      dataState: {
        array: [...arr],
        target: maxSum,
        low: curStart,
        mid: i,
        high: i,
        currentSum,
        maxSoFar: maxSum,
        bestSubarray: [bestStart, bestEnd],
        runningValue: `Window [${curStart}..${i}] sum = ${currentSum}`,
        phase: 'build',
      },
      message: `Index ${i} (${val}): max(Extend: ${prevSum}+${val}=${prevSum + val}, Reset: ${val}) = ${currentSum}.${
        isNewGlobalMax ? ` NEW PEAK maxSoFar = ${maxSum}!` : ''
      }`,
      reason: {
        action: prevSum + val > val ? `Extend Subarray to ${i}` : `Reset Subarray at ${i}`,
        why:
          prevSum + val > val
            ? `Extending previous subarray (${prevSum} + ${val} = ${prevSum + val}) is greater than starting fresh (${val}).`
            : `Previous sum was negative (${prevSum}); better to start a new subarray at index ${i} with value ${val}.`,
        rule: 'currentSum = max(arr[i], currentSum + arr[i])',
        values: { i, val, prevSum, newCurrentSum: currentSum, maxSoFar: maxSum },
        details: isNewGlobalMax
          ? `Global maximum updated to ${maxSum} on interval [${bestStart}..${bestEnd}].`
          : 'Preserving running contiguous subarray.',
      },
    };
  }

  // Complete
  yield {
    type: 'complete',
    codeLine: 6,
    indices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
    pointers: { start: bestStart, end: bestEnd },
    dataState: {
      array: [...arr],
      target: maxSum,
      low: bestStart,
      mid: Math.floor((bestStart + bestEnd) / 2),
      high: bestEnd,
      currentSum: maxSum,
      maxSoFar: maxSum,
      bestSubarray: [bestStart, bestEnd],
      runningValue: `Max Subarray [${bestStart}..${bestEnd}] = ${maxSum}`,
      phase: 'complete',
    },
    message: `Kadane Complete! Maximum contiguous subarray sum is ${maxSum} on interval [${bestStart}..${bestEnd}] (${arr
      .slice(bestStart, bestEnd + 1)
      .join(', ')}).`,
    reason: {
      action: 'Kadane Max Found',
      why: `Linear scan evaluated all ${n} elements in O(n) time. Optimal subarray sum is ${maxSum}.`,
      rule: 'return maxSoFar',
      values: { maxSubarraySum: maxSum, subarrayRange: `[${bestStart}..${bestEnd}]` },
      details: 'One of the most famous dynamic programming array patterns.',
    },
  };
}

/**
 * 2. Two Pointers: Target Sum on sorted array
 */
export function* generateTwoPointersSteps(
  customArr?: number[],
  customTarget?: number
): Generator<StepAction<ArrayPatternData>, void, unknown> {
  const arr = (customArr || [2, 5, 8, 11, 15, 19, 23, 28, 34, 40, 49]).sort((a, b) => a - b);
  const target = customTarget ?? 47;

  let left = 0;
  let right = arr.length - 1;

  yield {
    type: 'start',
    codeLine: 1,
    indices: [left, right],
    pointers: { left, right },
    dataState: {
      array: [...arr],
      target,
      left,
      right,
      runningValue: `Left: ${arr[left]}, Right: ${arr[right]}`,
      phase: 'build',
    },
    message: `Two Pointers initialized on sorted array of ${arr.length} elements. Target sum = ${target}. Left pointer at index 0 (${arr[0]}), Right pointer at index ${right} (${arr[right]}).`,
    reason: {
      action: 'Init Two Pointers',
      why: 'Sorted array enables two inward pointers: moving left pointer right increases the sum; moving right pointer left decreases the sum.',
      rule: 'left = 0, right = arr.length - 1',
      values: { target, leftVal: arr[left], rightVal: arr[right] },
      details: 'Eliminates need for O(n^2) nested loops, running in O(n) linear time with O(1) space.',
    },
  };

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) {
      yield {
        type: 'found',
        codeLine: 4,
        indices: [left, right],
        pointers: { left, right },
        dataState: {
          array: [...arr],
          target,
          left,
          right,
          currentSum: sum,
          runningValue: `MATCH: ${arr[left]} + ${arr[right]} = ${target}`,
          phase: 'complete',
        },
        message: `TARGET PAIR FOUND! arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${target}!`,
        reason: {
          action: `Found Pair [${left}, ${right}]`,
          why: `Exact sum match: ${arr[left]} + ${arr[right]} = ${target}. Target achieved!`,
          rule: 'sum == target => return [left, right]',
          values: { leftIndex: left, leftVal: arr[left], rightIndex: right, rightVal: arr[right], target },
          details: 'Optimal two-pointer convergence.',
        },
      };

      yield {
        type: 'complete',
        codeLine: 4,
        indices: [left, right],
        pointers: { left, right },
        dataState: {
          array: [...arr],
          target,
          left,
          right,
          currentSum: sum,
          runningValue: `SOLVED: indices [${left}, ${right}]`,
          phase: 'complete',
        },
        message: `Two Pointers completed successfully. Indices [${left}, ${right}] yield values ${arr[left]} + ${arr[right]} = ${target}.`,
        reason: {
          action: 'Two Pointers Complete',
          why: 'Found target pair in single linear sweep.',
          rule: 'O(n) time, O(1) space',
          values: { index1: left, val1: arr[left], index2: right, val2: arr[right] },
        },
      };
      return;
    } else if (sum < target) {
      yield {
        type: 'compare',
        codeLine: 5,
        indices: [left, right],
        pointers: { left, right },
        dataState: {
          array: [...arr],
          target,
          left,
          right,
          currentSum: sum,
          runningValue: `Sum: ${sum} < Target: ${target}`,
          phase: 'build',
        },
        message: `Sum (${arr[left]} + ${arr[right]} = ${sum}) < Target (${target}). Sum is too small.`,
        reason: {
          action: `Compare Sum: ${sum} < ${target}`,
          why: `Because array is sorted in ascending order, we must advance the left pointer rightward to consider larger candidate values.`,
          rule: 'sum < target => left++',
          values: { currentSum: sum, target, leftVal: arr[left], rightVal: arr[right] },
          details: `Discarding arr[${left}]=${arr[left]} because it cannot sum to ${target} with any element <= arr[${right}].`,
        },
      };

      left++;

      yield {
        type: 'step',
        codeLine: 5,
        indices: [left, right],
        pointers: { left, right },
        dataState: {
          array: [...arr],
          target,
          left,
          right,
          runningValue: `Shifted Left -> index ${left} (${arr[left]})`,
          phase: 'build',
        },
        message: `Advanced Left pointer to index ${left} (value ${arr[left]}). Right pointer remains at index ${right} (${arr[right]}).`,
        reason: {
          action: `Advance Left to ${left}`,
          why: `Shift left pointer inward. Next candidate sum will be larger.`,
          rule: 'left = left + 1',
          values: { newLeft: left, newLeftVal: arr[left] },
        },
      };
    } else {
      yield {
        type: 'compare',
        codeLine: 6,
        indices: [left, right],
        pointers: { left, right },
        dataState: {
          array: [...arr],
          target,
          left,
          right,
          currentSum: sum,
          runningValue: `Sum: ${sum} > Target: ${target}`,
          phase: 'build',
        },
        message: `Sum (${arr[left]} + ${arr[right]} = ${sum}) > Target (${target}). Sum is too large.`,
        reason: {
          action: `Compare Sum: ${sum} > ${target}`,
          why: `Current sum exceeds target. To decrease the sum in a sorted array, we must move the right pointer leftward.`,
          rule: 'sum > target => right--',
          values: { currentSum: sum, target, leftVal: arr[left], rightVal: arr[right] },
          details: `Discarding arr[${right}]=${arr[right]} because it cannot sum to ${target} with any element >= arr[${left}].`,
        },
      };

      right--;

      yield {
        type: 'step',
        codeLine: 6,
        indices: [left, right],
        pointers: { left, right },
        dataState: {
          array: [...arr],
          target,
          left,
          right,
          runningValue: `Shifted Right -> index ${right} (${arr[right]})`,
          phase: 'build',
        },
        message: `Decremented Right pointer to index ${right} (value ${arr[right]}). Left pointer remains at index ${left} (${arr[left]}).`,
        reason: {
          action: `Shift Right to ${right}`,
          why: `Shift right pointer inward. Next candidate sum will be smaller.`,
          rule: 'right = right - 1',
          values: { newRight: right, newRightVal: arr[right] },
        },
      };
    }
  }

  yield {
    type: 'complete',
    codeLine: 7,
    indices: [],
    dataState: {
      array: [...arr],
      target,
      left,
      right,
      runningValue: 'No Pair Found',
      phase: 'complete',
    },
    message: `Search finished: No pair in array sums to ${target}. Pointers crossed.`,
    reason: {
      action: 'Search Finished',
      why: 'Checked all viable pairs in O(n) steps. Target sum cannot be formed.',
      rule: 'left >= right => return null',
      values: { target },
      details: 'Two pointers met without match.',
    },
  };
}

/**
 * 3. Sliding Window: Fixed (k=3) & Variable (sum >= S)
 */
export function* generateSlidingWindowSteps(
  customArr?: number[],
  customK?: number,
  mode: 'fixed' | 'variable' = 'fixed'
): Generator<StepAction<ArrayPatternData>, void, unknown> {
  const arr = customArr || [2, 1, 5, 1, 3, 2, 7, 4];
  const n = arr.length;

  if (mode === 'fixed') {
    const k = customK || 3;
    let windowSum = 0;
    let maxSum = -Infinity;
    let bestStart = 0;

    // Step-by-step initial window accumulation
    for (let i = 0; i < k; i++) {
      windowSum += arr[i];
      const isInitialComplete = i === k - 1;
      if (isInitialComplete) {
        maxSum = windowSum;
        bestStart = 0;
      }

      yield {
        type: isInitialComplete ? 'found' : 'step',
        codeLine: 1,
        indices: Array.from({ length: i + 1 }, (_, idx) => idx),
        pointers: { start: 0, end: i },
        dataState: {
          array: [...arr],
          target: isInitialComplete ? maxSum : undefined,
          windowStart: 0,
          windowEnd: i,
          windowSum,
          maxSoFar: isInitialComplete ? maxSum : undefined,
          runningValue: `Building initial window [0..${i}]: sum = ${windowSum}`,
          phase: 'build',
        },
        message: isInitialComplete
          ? `Fixed Sliding Window (k=${k}): Initial window [0..${k - 1}] sum = ${windowSum}. Initial peak = ${maxSum}.`
          : `Building initial window: Add arr[${i}] (${arr[i]}). Running window sum = ${windowSum}.`,
        reason: {
          action: isInitialComplete ? `Init Window [0..${k - 1}] Complete` : `Add arr[${i}] to Initial Window`,
          why: isInitialComplete
            ? `Computed sum of first ${k} elements: ${arr.slice(0, k).join(' + ')} = ${windowSum}. Peak initialized to ${maxSum}.`
            : `Adding element at index ${i} (${arr[i]}) into the window of size ${k}. Current sum is ${windowSum}.`,
          rule: isInitialComplete ? 'maxSum = windowSum' : 'windowSum += arr[i]',
          values: { k, index: i, val: arr[i], windowSum, ...(isInitialComplete ? { maxSum } : {}) },
          details: isInitialComplete ? 'Baseline established before sliding shifts begin.' : 'Accumulating initial window.',
        },
      };
    }

    for (let i = k; i < n; i++) {
      const outgoing = arr[i - k];
      const incoming = arr[i];
      windowSum += incoming - outgoing;
      const isNewPeak = windowSum > maxSum;
      if (isNewPeak) {
        maxSum = windowSum;
        bestStart = i - k + 1;
      }

      yield {
        type: isNewPeak ? 'found' : 'step',
        codeLine: 4,
        indices: Array.from({ length: k }, (_, idx) => i - k + 1 + idx),
        pointers: { start: i - k + 1, end: i },
        dataState: {
          array: [...arr],
          target: maxSum,
          windowStart: i - k + 1,
          windowEnd: i,
          windowSum,
          maxSoFar: maxSum,
          runningValue: `Sub -${outgoing}, Add +${incoming} => Sum = ${windowSum}`,
          phase: 'build',
        },
        message: `Shift right: Subtract outgoing ${outgoing} (idx ${i - k}), Add incoming ${incoming} (idx ${i}). Window sum = ${windowSum}.${
          isNewPeak ? ` NEW PEAK = ${maxSum}!` : ''
        }`,
        reason: {
          action: `Slide: -${outgoing}, +${incoming}`,
          why: `O(1) transition: ${windowSum - incoming + outgoing} - ${outgoing} + ${incoming} = ${windowSum}. Peak is ${maxSum}.`,
          rule: 'windowSum += arr[i] - arr[i - k]',
          values: { outgoing, incoming, newSum: windowSum, maxSoFar: maxSum },
          details: 'Fixed window slides in constant O(1) time without looping over k elements.',
        },
      };
    }

    yield {
      type: 'complete',
      codeLine: 6,
      indices: Array.from({ length: k }, (_, idx) => bestStart + idx),
      pointers: { start: bestStart, end: bestStart + k - 1 },
      dataState: {
        array: [...arr],
        target: maxSum,
        windowStart: bestStart,
        windowEnd: bestStart + k - 1,
        windowSum: maxSum,
        maxSoFar: maxSum,
        runningValue: `Max Window [${bestStart}..${bestStart + k - 1}] = ${maxSum}`,
        phase: 'complete',
      },
      message: `Fixed Sliding Window complete! Maximum subarray sum of size ${k} is ${maxSum} at window [${bestStart}..${bestStart + k - 1}].`,
      reason: {
        action: 'Sliding Window Complete',
        why: `Scanned all ${n - k + 1} windows in linear O(n) time. Optimal sum is ${maxSum}.`,
        rule: 'return maxSum',
        values: { windowSize: k, maxSum, bestWindow: `[${bestStart}..${bestStart + k - 1}]` },
        details: 'Linear time complexity achieved.',
      },
    };
  } else {
    // Variable Window: Smallest subarray with sum >= S (e.g. S = 7)
    const S = 7;
    let minLen = Infinity;
    let windowSum = 0;
    let left = 0;
    let bestRange: [number, number] = [0, 0];

    yield {
      type: 'start',
      codeLine: 1,
      indices: [0],
      pointers: { left: 0, right: 0 },
      dataState: {
        array: [...arr],
        target: S,
        windowStart: 0,
        windowEnd: 0,
        windowSum: 0,
        runningValue: `Target Sum >= ${S}`,
        phase: 'expand',
      },
      message: `Variable Sliding Window: Find smallest subarray with sum >= ${S}. Pointers start at 0.`,
      reason: {
        action: 'Init Variable Window',
        why: `Expand right pointer until sum >= ${S}, then shrink left pointer to minimize window length.`,
        rule: 'while sum < S: right++; while sum >= S: shrink left',
        values: { targetSum: S },
        details: 'Dynamic variable window size.',
      },
    };

    for (let right = 0; right < n; right++) {
      windowSum += arr[right];

      yield {
        type: 'step',
        codeLine: 2,
        indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        pointers: { left, right },
        dataState: {
          array: [...arr],
          target: S,
          windowStart: left,
          windowEnd: right,
          windowSum,
          runningValue: `Expand: Added ${arr[right]} => Sum = ${windowSum}`,
          phase: 'expand',
        },
        message: `Expanded right to index ${right} (+${arr[right]}). Window [${left}..${right}] sum = ${windowSum} (${
          windowSum >= S ? `Target >= ${S} met!` : `Still < ${S}`
        }).`,
        reason: {
          action: `Expand Right to ${right}`,
          why: `Added arr[${right}] (${arr[right]}); current window sum is ${windowSum}.`,
          rule: 'windowSum += arr[right]',
          values: { right, added: arr[right], windowSum, targetSum: S },
          details: 'Growing window to satisfy condition.',
        },
      };

      while (windowSum >= S) {
        const curLen = right - left + 1;
        if (curLen < minLen) {
          minLen = curLen;
          bestRange = [left, right];
        }

        yield {
          type: 'found',
          codeLine: 3,
          indices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          pointers: { left, right },
          dataState: {
            array: [...arr],
            target: S,
            windowStart: left,
            windowEnd: right,
            windowSum,
            runningValue: `Condition Met: Len = ${curLen}, Sum = ${windowSum}`,
            phase: 'shrink',
          },
          message: `Window [${left}..${right}] (len: ${curLen}, sum: ${windowSum} >= ${S}): Valid! Try shrinking left to minimize.`,
          reason: {
            action: `Valid Window of Len ${curLen}`,
            why: `Sum ${windowSum} satisfies >= ${S}. Current minimum length = ${minLen}.`,
            rule: 'sum >= S => update minLen & shrink left',
            values: { windowRange: `[${left}..${right}]`, length: curLen, minLen },
            details: 'Shrinking left pointer to find strictly minimal window.',
          },
        };

        windowSum -= arr[left];
        left++;
      }
    }

    yield {
      type: 'complete',
      codeLine: 5,
      indices: Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, idx) => bestRange[0] + idx),
      pointers: { left: bestRange[0], right: bestRange[1] },
      dataState: {
        array: [...arr],
        target: S,
        windowStart: bestRange[0],
        windowEnd: bestRange[1],
        runningValue: `Min Length = ${minLen}`,
        phase: 'complete',
      },
      message: `Variable Sliding Window complete! Smallest subarray with sum >= ${S} has length ${minLen} (interval [${bestRange[0]}..${bestRange[1]}]).`,
      reason: {
        action: 'Variable Window Complete',
        why: `Optimal minimum window length is ${minLen} (${arr.slice(bestRange[0], bestRange[1] + 1).join(', ')}).`,
        rule: 'return minLen',
        values: { minLength: minLen, range: `[${bestRange[0]}..${bestRange[1]}]` },
        details: 'Variable window completed in O(2n) = O(n) total pointer steps.',
      },
    };
  }
}

/**
 * 4. Prefix Sum: Live cumulative prefix construction + O(1) range queries
 */
export function* generatePrefixSumSteps(
  customArr?: number[]
): Generator<StepAction<ArrayPatternData>, void, unknown> {
  const arr = customArr || [3, 1, 4, 1, 5, 9, 2, 6];
  const n = arr.length;

  const prefix: (number | null)[] = new Array(n).fill(null);

  // Phase 1: Live Prefix Table Build
  yield {
    type: 'start',
    codeLine: 1,
    indices: [0],
    dataState: {
      array: [...arr],
      prefixArray: [...prefix],
      runningValue: 'Building Prefix Array...',
      phase: 'build',
    },
    message: `Phase 1: Build Prefix Sum Array for [${arr.join(', ')}]. Prefix table starts blank.`,
    reason: {
      action: 'Init Prefix Build',
      why: 'Cumulative sum array enables O(1) range sum queries after O(n) precomputation.',
      rule: 'prefix[0] = arr[0]',
      values: { firstElement: arr[0] },
      details: 'Precomputation amortizes query cost.',
    },
  };

  prefix[0] = arr[0];

  yield {
    type: 'set',
    codeLine: 1,
    indices: [0],
    dataState: {
      array: [...arr],
      prefixArray: [...prefix],
      runningValue: `pref[0] = ${prefix[0]}`,
      phase: 'build',
    },
    message: `pref[0] = arr[0] = ${arr[0]}.`,
    reason: {
      action: 'Set pref[0]',
      why: 'Base cumulative sum for first element.',
      rule: 'prefix[0] = arr[0]',
      values: { val: arr[0] },
      details: 'Base prefix established.',
    },
  };

  for (let i = 1; i < n; i++) {
    const prev = prefix[i - 1] as number;
    const curr = prev + arr[i];
    prefix[i] = curr;

    yield {
      type: 'set',
      codeLine: 3,
      indices: [i],
      pointers: { i },
      dataState: {
        array: [...arr],
        prefixArray: [...prefix],
        runningValue: `pref[${i}] = pref[${i - 1}] (${prev}) + arr[${i}] (${arr[i]}) = ${curr}`,
        phase: 'build',
      },
      message: `pref[${i}] = pref[${i - 1}] (${prev}) + arr[${i}] (${arr[i]}) = ${curr}.`,
      reason: {
        action: `Set pref[${i}] = ${curr}`,
        why: `Cumulative sum up to index ${i} is ${prev} + ${arr[i]} = ${curr}.`,
        rule: 'prefix[i] = prefix[i-1] + arr[i]',
        values: { i, prevPrefix: prev, arrayElement: arr[i], newPrefix: curr },
        details: 'Adding current element to previous cumulative sum.',
      },
    };
  }

  // Phase 2: Live Range Sum Queries
  const queries: [number, number][] = [
    [1, 4], // arr[1..4] = 1 + 4 + 1 + 5 = 11
    [2, 6], // arr[2..6] = 4 + 1 + 5 + 9 + 2 = 21
  ];

  for (const [L, R] of queries) {
    const prefR = prefix[R] as number;
    const prefL1 = L > 0 ? (prefix[L - 1] as number) : 0;
    const querySum = prefR - prefL1;

    yield {
      type: 'step',
      codeLine: 5,
      indices: Array.from({ length: R - L + 1 }, (_, idx) => L + idx),
      pointers: { L, R },
      dataState: {
        array: [...arr],
        prefixArray: [...prefix],
        queryRange: [L, R],
        queryResult: querySum,
        runningValue: `Query [${L}..${R}]: pref[${R}](${prefR}) - pref[${L - 1}](${prefL1}) = ${querySum}`,
        phase: 'query',
      },
      message: `Range Query Sum [${L}..${R}]: pref[${R}] (${prefR}) - pref[${L - 1}] (${prefL1}) = ${querySum} in O(1) time!`,
      reason: {
        action: `Query Range [${L}..${R}]`,
        why: `O(1) calculation: prefix[${R}] (${prefR}) minus prefix[${L - 1}] (${prefL1}) = ${querySum}.`,
        rule: 'sum(L, R) = prefix[R] - prefix[L - 1]',
        values: { L, R, prefixR: prefR, prefixLMinus1: prefL1, rangeSum: querySum },
        details: 'Zero loop iterations required! Instantaneous query response.',
      },
    };
  }

  yield {
    type: 'complete',
    codeLine: 5,
    indices: [],
    dataState: {
      array: [...arr],
      prefixArray: [...prefix],
      runningValue: 'Prefix Precomputation & Queries Verified',
      phase: 'complete',
    },
    message: `Prefix Sum complete! Verified O(n) construction and O(1) range queries.`,
    reason: {
      action: 'Prefix Sum Complete',
      why: 'Demonstrated cumulative array build and constant-time interval subtraction.',
      rule: 'O(1) query time complexity',
      values: { arraySize: n },
      details: 'All queries successfully resolved.',
    },
  };
}
