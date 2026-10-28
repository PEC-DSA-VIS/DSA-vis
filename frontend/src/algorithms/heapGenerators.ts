import { StepAction } from '../types';

export interface HeapDataState {
  heapArray: number[];
  heapType: 'Min-Heap' | 'Max-Heap';
  activeIndices: number[];
  swapPair?: [number, number] | null;
  heapSize: number;
  operation: string;
  runningMetric: string;
}

/**
 * Binary Heap: Synchronized Array & Tree Views, Bubble-Up, Bubble-Down, Heapify, and Heap Sort
 */
export function* generateHeapSteps(
  mode: 'all' | 'heapify' | 'heapsort' | 'insert' = 'all'
): Generator<StepAction<HeapDataState>, void, unknown> {
  // Initial arbitrary array to heapify and sort
  const arr = [40, 10, 30, 50, 60, 15, 25];
  let heap = [...arr];
  let heapSize = heap.length;

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      heapArray: [...heap],
      heapType: 'Max-Heap',
      activeIndices: [],
      heapSize,
      operation: 'Unsorted Array Initialized',
      runningMetric: `Array: [${heap.join(', ')}] (Not yet a heap)`,
    },
    message: `Binary Max-Heap initialized with array [${heap.join(', ')}]. Complete binary tree relationships: Parent(i) = floor((i-1)/2), Left(i) = 2i+1, Right(i) = 2i+2.`,
    reason: {
      action: 'Init Array & Tree View',
      why: 'Array representation of binary heap allows random access without node pointer overhead.',
      rule: 'parent = (i - 1) / 2',
      values: { size: heap.length },
    },
  };

  // Phase 1: Build Heap (Heapify in O(n) time)
  yield {
    type: 'step',
    codeLine: 2,
    indices: [],
    dataState: {
      heapArray: [...heap],
      heapType: 'Max-Heap',
      activeIndices: [],
      heapSize,
      operation: 'Start Bottom-Up Heapify',
      runningMetric: 'Running Sift-Down from last non-leaf node down to root',
    },
    message: 'Starting bottom-up HEAPIFY: Sifting down from index floor(n/2)-1 down to root 0 in O(n) time.',
    reason: {
      action: 'Start Heapify',
      why: 'Leaves at floor(n/2)..n-1 already satisfy heap invariant trivially. Only internal nodes need sifting.',
      rule: 'for i = floor(n/2) - 1 down to 0: siftDown(i)',
      values: { startIdx: Math.floor(heap.length / 2) - 1 },
    },
  };

  function* siftDown(idx: number, currentSize: number): Generator<StepAction<HeapDataState>, void, unknown> {
    let cur = idx;
    while (true) {
      let largest = cur;
      const left = 2 * cur + 1;
      const right = 2 * cur + 2;

      if (left < currentSize && heap[left] > heap[largest]) {
        largest = left;
      }
      if (right < currentSize && heap[right] > heap[largest]) {
        largest = right;
      }

      if (largest !== cur) {
        // Step comparing
        yield {
          type: 'compare',
          codeLine: 3,
          indices: [cur, largest],
          dataState: {
            heapArray: [...heap],
            heapType: 'Max-Heap',
            activeIndices: [cur, largest],
            heapSize: currentSize,
            operation: `Sift-Down: Compare parent [${cur}] (${heap[cur]}) with larger child [${largest}] (${heap[largest]})`,
            runningMetric: `Parent ${heap[cur]} < Child ${heap[largest]} -> VIOLATION!`,
          },
          message: `Heap Invariant Violation: Parent at index [${cur}] (${heap[cur]}) is smaller than child at index [${largest}] (${heap[largest]}). SWAP required!`,
          reason: {
            action: `Compare: ${heap[cur]} < ${heap[largest]}`,
            why: 'Max-heap requires parent >= both children.',
            rule: 'if heap[child] > heap[parent]: swap',
            values: { parentIdx: cur, parentVal: heap[cur], childIdx: largest, childVal: heap[largest] },
          },
        };

        // Swap
        const temp = heap[cur];
        heap[cur] = heap[largest];
        heap[largest] = temp;

        yield {
          type: 'swap',
          codeLine: 4,
          indices: [cur, largest],
          dataState: {
            heapArray: [...heap],
            heapType: 'Max-Heap',
            activeIndices: [cur, largest],
            swapPair: [cur, largest],
            heapSize: currentSize,
            operation: `Swapped [${cur}] <-> [${largest}]`,
            runningMetric: `Heap updated: [${heap.join(', ')}]`,
          },
          message: `Swapped index [${cur}] (${heap[largest]}) with [${largest}] (${heap[cur]}). Continuing sift-down on child.`,
          reason: {
            action: `Swap [${cur}] <-> [${largest}]`,
            why: 'Restores max-heap property at current level.',
            rule: 'swap(heap[cur], heap[largest])',
            values: { cur, largest },
          },
        };

        cur = largest;
      } else {
        break;
      }
    }
  }

  // Sift down all non-leaves
  const startNonLeaf = Math.floor(heap.length / 2) - 1;
  for (let i = startNonLeaf; i >= 0; i--) {
    yield* siftDown(i, heapSize);
  }

  yield {
    type: 'step',
    codeLine: 5,
    indices: [0],
    dataState: {
      heapArray: [...heap],
      heapType: 'Max-Heap',
      activeIndices: [0],
      heapSize,
      operation: 'Valid Max-Heap Built',
      runningMetric: `Max-Heap: [${heap.join(', ')}]. Root is max: ${heap[0]}`,
    },
    message: `Heapify Complete! Array is now a valid Max-Heap: [${heap.join(', ')}]. Root [0] holds maximum element ${heap[0]}.`,
    reason: {
      action: 'Heapify Finished',
      why: 'Max-heap invariant satisfied for every node in O(n) total time.',
      rule: 'heap[parent] >= heap[children]',
      values: { maxElement: heap[0] },
    },
  };

  // Phase 2: Heap Sort (Extract root to end repeatedly)
  yield {
    type: 'step',
    codeLine: 6,
    indices: [],
    dataState: {
      heapArray: [...heap],
      heapType: 'Max-Heap',
      activeIndices: [],
      heapSize,
      operation: 'Start Heap Sort',
      runningMetric: 'Repeatedly swap root (max) with last element and shrink heap',
    },
    message: 'Starting HEAP SORT: Repeatedly swapping root (max) with last element of active heap, shrinking heap boundary by 1, and sifting down.',
    reason: {
      action: 'Begin Heap Sort',
      why: 'Root always holds remaining maximum. Moving it to the end partitions array into (heap | sorted).',
      rule: 'swap(heap[0], heap[size - 1]); size--; siftDown(0)',
      values: { heapSize },
    },
  };

  while (heapSize > 1) {
    const lastIdx = heapSize - 1;
    const maxVal = heap[0];

    // Swap root with last
    const temp = heap[0];
    heap[0] = heap[lastIdx];
    heap[lastIdx] = temp;
    heapSize--;

    yield {
      type: 'swap',
      codeLine: 7,
      indices: [0, lastIdx],
      dataState: {
        heapArray: [...heap],
        heapType: 'Max-Heap',
        activeIndices: [0, lastIdx],
        swapPair: [0, lastIdx],
        heapSize,
        operation: `Extracted Max (${maxVal}) to position [${lastIdx}]`,
        runningMetric: `Placed ${maxVal} at sorted index [${lastIdx}]. Remaining heap size: ${heapSize}`,
      },
      message: `Extracted Max element ${maxVal}: Swapped root with index [${lastIdx}]. Active heap shrunk to ${heapSize} elements.`,
      reason: {
        action: `Extract Max -> [${lastIdx}]`,
        why: `Maximum element ${maxVal} placed in its final sorted position.`,
        rule: 'swap(heap[0], heap[end]); end--',
        values: { extractedMax: maxVal, sortedSlot: lastIdx, remainingHeapSize: heapSize },
      },
    };

    // Sift down new root
    yield* siftDown(0, heapSize);
  }

  // Complete
  yield {
    type: 'complete',
    codeLine: 8,
    indices: [],
    dataState: {
      heapArray: [...heap],
      heapType: 'Max-Heap',
      activeIndices: [],
      heapSize: 0,
      operation: 'Heap Sort Complete',
      runningMetric: `Fully Sorted Array: [${heap.join(', ')}]`,
    },
    message: `Heap Sort Complete! Array is now completely sorted in ascending order: [${heap.join(', ')}]. Time: O(n log n), Space: O(1) in-place.`,
    reason: {
      action: 'Sorting Complete',
      why: 'All elements extracted in order of priority.',
      rule: 'Array Sorted',
      values: { sortedArray: [...heap] },
    },
  };
}
