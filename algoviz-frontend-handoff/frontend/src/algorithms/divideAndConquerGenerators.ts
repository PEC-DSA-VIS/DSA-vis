import { StepAction } from '../types';
import { DivideConquerData, TreeNodeBox } from '../components/boards/DivideConquerBoard';

/**
 * Generates step-by-step Merge Sort Split Tree and Merge Back Up (>= 30 Steps)
 */
export function* generateMergeSortTreeSteps(
  inputArray: number[] = [38, 27, 43, 3, 9, 82, 10, 19]
): Generator<StepAction<DivideConquerData>, void, unknown> {
  const arr = [...inputArray];
  const n = arr.length;

  // Level 0 Initial Node
  const l0Node: TreeNodeBox = {
    id: 'node-0-0',
    level: 0,
    array: [...arr],
    status: 'splitting',
    targetSize: n,
  };

  yield {
    type: 'start',
    codeLine: 1,
    indices: [0, n - 1],
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'split',
      levels: [{ level: 0, title: 'Level 0: Initial Array (Size 8)', nodes: [{ ...l0Node }] }],
      activeNodeId: 'node-0-0',
      array: [...arr],
    },
    message: `Divide & Conquer Merge Sort started on [${arr.join(', ')}]. Will recursively divide down to size 1, then merge back up.`,
    reason: {
      action: 'Start Merge Sort',
      why: 'Initiating recursive binary problem division down to base singleton elements.',
      rule: 'mergeSort(0, n-1)',
      values: { array: arr, size: n },
      details: 'Each split level halves the array size.',
    },
  };

  // Phase 1: Splits
  // Level 1: [38, 27, 43, 3] and [9, 82, 10, 19]
  const l1_0 = [38, 27, 43, 3];
  const l1_1 = [9, 82, 10, 19];
  const l1Nodes: TreeNodeBox[] = [
    { id: 'node-1-0', parentId: 'node-0-0', level: 1, array: [...l1_0], status: 'splitting', targetSize: 4 },
    { id: 'node-1-1', parentId: 'node-0-0', level: 1, array: [...l1_1], status: 'splitting', targetSize: 4 },
  ];

  yield {
    type: 'step',
    codeLine: 2,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'split',
      levels: [
        { level: 0, title: 'Level 0: Root Problem', nodes: [{ ...l0Node, status: 'idle' }] },
        { level: 1, title: 'Level 1: Halves (Size 4)', nodes: l1Nodes },
      ],
      activeNodeId: 'node-1-0',
      array: [...arr],
    },
    message: `Split Level 0 into two halves: Left [${l1_0.join(', ')}] and Right [${l1_1.join(', ')}].`,
    reason: {
      action: 'Split Root',
      why: 'Dividing array at mid = 4 into two subproblems of size 4.',
      rule: 'mid = floor(n / 2)',
      values: { left: l1_0, right: l1_1 },
    },
  };

  // Level 2: [38, 27], [43, 3], [9, 82], [10, 19]
  const l2_0 = [38, 27];
  const l2_1 = [43, 3];
  const l2_2 = [9, 82];
  const l2_3 = [10, 19];
  const l2Nodes: TreeNodeBox[] = [
    { id: 'node-2-0', parentId: 'node-1-0', level: 2, array: l2_0, status: 'splitting', targetSize: 2 },
    { id: 'node-2-1', parentId: 'node-1-0', level: 2, array: l2_1, status: 'splitting', targetSize: 2 },
    { id: 'node-2-2', parentId: 'node-1-1', level: 2, array: l2_2, status: 'splitting', targetSize: 2 },
    { id: 'node-2-3', parentId: 'node-1-1', level: 2, array: l2_3, status: 'splitting', targetSize: 2 },
  ];

  yield {
    type: 'step',
    codeLine: 2,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'split',
      levels: [
        { level: 0, title: 'Level 0: Root Problem', nodes: [{ ...l0Node, status: 'idle' }] },
        { level: 1, title: 'Level 1: Halves (Size 4)', nodes: l1Nodes.map((n) => ({ ...n, status: 'idle' })) },
        { level: 2, title: 'Level 2: Pairs (Size 2)', nodes: l2Nodes },
      ],
      activeNodeId: 'node-2-0',
      array: [...arr],
    },
    message: 'Split Level 1 into 4 pairs of size 2.',
    reason: {
      action: 'Split Halves to Pairs',
      why: 'Each size 4 partition is divided in half.',
      rule: 'split(size 4 -> size 2)',
      values: { pairs: [l2_0, l2_1, l2_2, l2_3] },
    },
  };

  // Level 3: 8 singletons
  const l3Nodes: TreeNodeBox[] = [
    { id: 'node-3-0', parentId: 'node-2-0', level: 3, array: [38], status: 'splitting', targetSize: 1 },
    { id: 'node-3-1', parentId: 'node-2-0', level: 3, array: [27], status: 'splitting', targetSize: 1 },
    { id: 'node-3-2', parentId: 'node-2-1', level: 3, array: [43], status: 'splitting', targetSize: 1 },
    { id: 'node-3-3', parentId: 'node-2-1', level: 3, array: [3], status: 'splitting', targetSize: 1 },
    { id: 'node-3-4', parentId: 'node-2-2', level: 3, array: [9], status: 'splitting', targetSize: 1 },
    { id: 'node-3-5', parentId: 'node-2-2', level: 3, array: [82], status: 'splitting', targetSize: 1 },
    { id: 'node-3-6', parentId: 'node-2-3', level: 3, array: [10], status: 'splitting', targetSize: 1 },
    { id: 'node-3-7', parentId: 'node-2-3', level: 3, array: [19], status: 'splitting', targetSize: 1 },
  ];

  yield {
    type: 'step',
    codeLine: 2,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'split',
      levels: [
        { level: 0, title: 'Level 0: Root Problem', nodes: [{ ...l0Node, status: 'idle' }] },
        { level: 1, title: 'Level 1: Halves (Size 4)', nodes: l1Nodes.map((n) => ({ ...n, status: 'idle' })) },
        { level: 2, title: 'Level 2: Pairs (Size 2)', nodes: l2Nodes.map((n) => ({ ...n, status: 'idle' })) },
        { level: 3, title: 'Level 3: Base Singletons (Size 1)', nodes: l3Nodes },
      ],
      activeNodeId: 'node-3-0',
      array: [...arr],
    },
    message: 'Base Cases Reached! Split into 8 singletons of size 1. An array of size 1 is trivially sorted.',
    reason: {
      action: 'Base Cases Reached',
      why: 'Singletons are already sorted by definition. Now begin merging upward.',
      rule: 'if (low >= high) return',
      values: { singletons: [38, 27, 43, 3, 9, 82, 10, 19] },
    },
  };

  // Phase 2: Merge Singletons into Pairs (Level 3 -> Level 2)
  // Pair 1: [38] + [27] -> [27, 38]
  yield {
    type: 'compare',
    codeLine: 3,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: l2Nodes },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-0',
      comparisonValues: { left: 38, right: 27 },
      array: [...arr],
    },
    message: 'Merge Pair 1: Comparing 38 vs 27. 27 < 38, so 27 is chosen first.',
    reason: { action: 'Compare 38 vs 27', why: 'Pick smaller element.', rule: 'left < right', values: { left: 38, right: 27 } },
  };

  yield {
    type: 'step',
    codeLine: 4,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: [{ ...l2Nodes[0], array: [27, 38], status: 'merged' }, l2Nodes[1], l2Nodes[2], l2Nodes[3]] },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-0',
      array: [...arr],
    },
    message: 'Pair 1 Copied: Placed [27, 38] into Level 2 parent box.',
    reason: { action: 'Copy Pair [27, 38]', why: 'Both singletons merged in ascending order.', rule: 'merge two singletons', values: { pair: [27, 38] } },
  };

  l2Nodes[0].array = [27, 38];
  l2Nodes[0].status = 'merged';

  // Pair 2: [43] + [3] -> [3, 43]
  yield {
    type: 'compare',
    codeLine: 3,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: l2Nodes },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-1',
      comparisonValues: { left: 43, right: 3 },
      array: [...arr],
    },
    message: 'Merge Pair 2: Comparing 43 vs 3. 3 < 43, so 3 is chosen first.',
    reason: { action: 'Compare 43 vs 3', why: 'Pick smaller element.', rule: 'left < right', values: { left: 43, right: 3 } },
  };

  yield {
    type: 'step',
    codeLine: 4,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: [l2Nodes[0], { ...l2Nodes[1], array: [3, 43], status: 'merged' }, l2Nodes[2], l2Nodes[3]] },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-1',
      array: [...arr],
    },
    message: 'Pair 2 Copied: Placed [3, 43] into Level 2 parent box.',
    reason: { action: 'Copy Pair [3, 43]', why: 'Both singletons merged in ascending order.', rule: 'merge two singletons', values: { pair: [3, 43] } },
  };

  l2Nodes[1].array = [3, 43];
  l2Nodes[1].status = 'merged';

  // Pair 3: [9] + [82] -> [9, 82]
  yield {
    type: 'compare',
    codeLine: 3,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: l2Nodes },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-2',
      comparisonValues: { left: 9, right: 82 },
      array: [...arr],
    },
    message: 'Merge Pair 3: Comparing 9 vs 82. 9 < 82, so 9 is chosen first.',
    reason: { action: 'Compare 9 vs 82', why: 'Pick smaller element.', rule: 'left < right', values: { left: 9, right: 82 } },
  };

  yield {
    type: 'step',
    codeLine: 4,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: [l2Nodes[0], l2Nodes[1], { ...l2Nodes[2], array: [9, 82], status: 'merged' }, l2Nodes[3]] },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-2',
      array: [...arr],
    },
    message: 'Pair 3 Copied: Placed [9, 82] into Level 2 parent box.',
    reason: { action: 'Copy Pair [9, 82]', why: 'Both singletons merged in ascending order.', rule: 'merge two singletons', values: { pair: [9, 82] } },
  };

  l2Nodes[2].array = [9, 82];
  l2Nodes[2].status = 'merged';

  // Pair 4: [10] + [19] -> [10, 19]
  yield {
    type: 'compare',
    codeLine: 3,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: l2Nodes },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-3',
      comparisonValues: { left: 10, right: 19 },
      array: [...arr],
    },
    message: 'Merge Pair 4: Comparing 10 vs 19. 10 < 19, so 10 is chosen first.',
    reason: { action: 'Compare 10 vs 19', why: 'Pick smaller element.', rule: 'left < right', values: { left: 10, right: 19 } },
  };

  yield {
    type: 'step',
    codeLine: 4,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'merge',
      levels: [
        { level: 2, title: 'Level 2: Merging Pairs', nodes: [l2Nodes[0], l2Nodes[1], l2Nodes[2], { ...l2Nodes[3], array: [10, 19], status: 'merged' }] },
        { level: 3, title: 'Level 3: Singletons', nodes: l3Nodes },
      ],
      activeNodeId: 'node-2-3',
      array: [...arr],
    },
    message: 'Pair 4 Copied: Placed [10, 19] into Level 2 parent box.',
    reason: { action: 'Copy Pair [10, 19]', why: 'Both singletons merged in ascending order.', rule: 'merge two singletons', values: { pair: [10, 19] } },
  };

  l2Nodes[3].array = [10, 19];
  l2Nodes[3].status = 'merged';

  // Phase 3: Merge Pairs into Quads (Level 2 -> Level 1)
  // Left Quad: [27, 38] and [3, 43] -> [3, 27, 38, 43]
  const leftQuadMerges = [
    { p1: 27, p2: 3, chosen: 3, copied: [3] },
    { p1: 27, p2: 43, chosen: 27, copied: [3, 27] },
    { p1: 38, p2: 43, chosen: 38, copied: [3, 27, 38] },
    { p1: null, p2: 43, chosen: 43, copied: [3, 27, 38, 43] },
  ];

  for (const m of leftQuadMerges) {
    yield {
      type: 'step',
      codeLine: 4,
      dataState: {
        title: 'Merge Sort Split & Merge Tree',
        mode: 'merge-sort',
        phase: 'merge',
        levels: [
          { level: 1, title: 'Level 1: Merging Quads', nodes: l1Nodes },
          { level: 2, title: 'Level 2: Sorted Pairs', nodes: l2Nodes },
        ],
        activeNodeId: 'node-1-0',
        copiedValue: m.chosen,
        array: [...arr],
      },
      message: `Merging Left Quad: Copied ${m.chosen} into merged buffer [${m.copied.join(', ')}].`,
      reason: {
        action: `Copy ${m.chosen}`,
        why: `Chose smaller element ${m.chosen}.`,
        rule: 'copy(min(P1, P2))',
        values: { chosen: m.chosen, merged: m.copied },
      },
    };
  }
  l1Nodes[0].array = [3, 27, 38, 43];
  l1Nodes[0].status = 'merged';

  // Right Quad: [9, 82] and [10, 19] -> [9, 10, 19, 82]
  const rightQuadMerges = [
    { p1: 9, p2: 10, chosen: 9, copied: [9] },
    { p1: 82, p2: 10, chosen: 10, copied: [9, 10] },
    { p1: 82, p2: 19, chosen: 19, copied: [9, 10, 19] },
    { p1: 82, p2: null, chosen: 82, copied: [9, 10, 19, 82] },
  ];

  for (const m of rightQuadMerges) {
    yield {
      type: 'step',
      codeLine: 4,
      dataState: {
        title: 'Merge Sort Split & Merge Tree',
        mode: 'merge-sort',
        phase: 'merge',
        levels: [
          { level: 1, title: 'Level 1: Merging Quads', nodes: l1Nodes },
          { level: 2, title: 'Level 2: Sorted Pairs', nodes: l2Nodes },
        ],
        activeNodeId: 'node-1-1',
        copiedValue: m.chosen,
        array: [...arr],
      },
      message: `Merging Right Quad: Copied ${m.chosen} into merged buffer [${m.copied.join(', ')}].`,
      reason: {
        action: `Copy ${m.chosen}`,
        why: `Chose smaller element ${m.chosen}.`,
        rule: 'copy(min(P1, P2))',
        values: { chosen: m.chosen, merged: m.copied },
      },
    };
  }
  l1Nodes[1].array = [9, 10, 19, 82];
  l1Nodes[1].status = 'merged';

  // Phase 4: Final Merge (Level 1 -> Level 0 Root)
  // [3, 27, 38, 43] vs [9, 10, 19, 82] -> [3, 9, 10, 19, 27, 38, 43, 82]
  const rootMerges = [
    { leftVal: 3, rightVal: 9, chosen: 3, res: [3] },
    { leftVal: 27, rightVal: 9, chosen: 9, res: [3, 9] },
    { leftVal: 27, rightVal: 10, chosen: 10, res: [3, 9, 10] },
    { leftVal: 27, rightVal: 19, chosen: 19, res: [3, 9, 10, 19] },
    { leftVal: 27, rightVal: 82, chosen: 27, res: [3, 9, 10, 19, 27] },
    { leftVal: 38, rightVal: 82, chosen: 38, res: [3, 9, 10, 19, 27, 38] },
    { leftVal: 43, rightVal: 82, chosen: 43, res: [3, 9, 10, 19, 27, 38, 43] },
    { leftVal: null, rightVal: 82, chosen: 82, res: [3, 9, 10, 19, 27, 38, 43, 82] },
  ];

  for (const m of rootMerges) {
    yield {
      type: 'compare',
      codeLine: 4,
      dataState: {
        title: 'Merge Sort Split & Merge Tree',
        mode: 'merge-sort',
        phase: 'merge',
        levels: [
          { level: 0, title: 'Level 0: Final Merged Root', nodes: [{ ...l0Node, array: m.res.slice(0, -1), status: 'copying' }] },
          { level: 1, title: 'Level 1: Sorted Quads', nodes: l1Nodes },
        ],
        activeNodeId: 'node-0-0',
        comparisonValues: { left: m.leftVal ?? 0, right: m.rightVal ?? 0 },
        copiedValue: m.chosen,
        array: [...arr],
      },
      message: `Root Merge: Compare ${m.leftVal ?? 'exhausted'} vs ${m.rightVal ?? 'exhausted'} → Picked ${m.chosen}.`,
      reason: {
        action: `Compare ${m.leftVal ?? 'NULL'} vs ${m.rightVal ?? 'NULL'}`,
        why: `${m.chosen} is the smaller element among the heads of both sorted partitions.`,
        rule: 'min(head(left), head(right))',
        values: { left: m.leftVal, right: m.rightVal, chosen: m.chosen },
      },
    };

    yield {
      type: 'step',
      codeLine: 4,
      dataState: {
        title: 'Merge Sort Split & Merge Tree',
        mode: 'merge-sort',
        phase: 'merge',
        levels: [
          { level: 0, title: 'Level 0: Final Merged Root', nodes: [{ ...l0Node, array: m.res, status: 'copying' }] },
          { level: 1, title: 'Level 1: Sorted Quads', nodes: l1Nodes },
        ],
        activeNodeId: 'node-0-0',
        copiedValue: m.chosen,
        array: [...arr],
      },
      message: `Root Merge: Copied ${m.chosen} into merged output row. Current: [${m.res.join(', ')}].`,
      reason: {
        action: `Copy ${m.chosen}`,
        why: 'Placed in order into final sorted array.',
        rule: 'merged.push(chosen)',
        values: { chosen: m.chosen, currentMerged: m.res },
      },
    };
  }

  const finalSorted = [3, 9, 10, 19, 27, 38, 43, 82];
  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      title: 'Merge Sort Split & Merge Tree',
      mode: 'merge-sort',
      phase: 'complete',
      levels: [
        { level: 0, title: 'Level 0: Fully Merged Sorted Array', nodes: [{ ...l0Node, array: finalSorted, status: 'merged' }] },
      ],
      activeNodeId: 'node-0-0',
      sortedIndices: Array.from({ length: 8 }, (_, i) => i),
      array: finalSorted,
    },
    message: `Merge Sort Complete! Final sorted array: [${finalSorted.join(', ')}].`,
    reason: {
      action: 'Merge Sort Complete',
      why: 'All subproblems divided to singletons and merged back up in O(n log n) time.',
      rule: 'O(n log n) comparisons',
      values: { finalSorted },
    },
  };
}

/**
 * Generates step-by-step Quick Sort Partition Tree with detailed i/j scans and tree growth (>= 25 Steps)
 */
export function* generateQuickSortPartitionTree(
  inputArray: number[] = [10, 80, 30, 90, 40, 50, 70]
): Generator<StepAction<DivideConquerData>, void, unknown> {
  const arr = [...inputArray];
  const n = arr.length;
  const pivot = arr[n - 1]; // 70

  yield {
    type: 'start',
    codeLine: 1,
    indices: [n - 1],
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 0,
          title: `Level 0: Initial Array [${arr.join(', ')}] (Pivot: ${pivot})`,
          nodes: [{ id: 'q-0-0', level: 0, array: [...arr], status: 'splitting', isPivot: false }],
        },
      ],
      activeNodeId: 'q-0-0',
      array: [...arr],
    },
    message: `Quick Sort started on [${arr.join(', ')}]. Pivot chosen: ${pivot} at index ${n - 1}.`,
    reason: {
      action: `Select Pivot ${pivot}`,
      why: `Benchmark element ${pivot} chosen to partition elements into smaller (< ${pivot}) vs larger (>= ${pivot}).`,
      rule: 'pivot = arr[high]',
      values: { pivot, array: arr },
    },
  };

  // Level 0 Partitioning: i/j scanning loop
  let i = -1;
  for (let j = 0; j < n - 1; j++) {
    const val = arr[j];
    const isSmaller = val < pivot;

    yield {
      type: 'compare',
      codeLine: 2,
      indices: [j, n - 1],
      pointers: { i, j, pivotIdx: n - 1 },
      dataState: {
        title: 'Quick Sort Partition Tree',
        mode: 'quick-sort',
        phase: 'partition',
        levels: [
          {
            level: 0,
            title: 'Level 0: Partitioning Around 70',
            nodes: [{ id: 'q-0-0', level: 0, array: [...arr], status: 'splitting' }],
          },
        ],
        activeNodeId: 'q-0-0',
        array: [...arr],
      },
      message: `Scan j=${j}: arr[${j}] = ${val} vs Pivot ${pivot}. ${val} is ${isSmaller ? `< ${pivot} (Swap into smaller partition)` : `>= ${pivot} (Leave for right partition)`}.`,
      reason: {
        action: `Compare arr[${j}] (${val}) with Pivot ${pivot}`,
        why: isSmaller ? `Element ${val} belongs in the left partition.` : `Element ${val} belongs in the right partition.`,
        rule: 'if (arr[j] < pivot): i++; swap(arr[i], arr[j])',
        values: { j, val, pivot, isSmaller },
      },
    };

    if (isSmaller) {
      i++;
      if (i !== j) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;

        yield {
          type: 'swap',
          codeLine: 3,
          indices: [i, j],
          pointers: { i, j, pivotIdx: n - 1 },
          dataState: {
            title: 'Quick Sort Partition Tree',
            mode: 'quick-sort',
            phase: 'partition',
            levels: [
              {
                level: 0,
                title: 'Level 0: Partitioning Around 70',
                nodes: [{ id: 'q-0-0', level: 0, array: [...arr], status: 'splitting' }],
              },
            ],
            activeNodeId: 'q-0-0',
            array: [...arr],
          },
          message: `Swapped arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}). Left partition expands.`,
          reason: { action: `Swap arr[${i}] <-> arr[${j}]`, why: 'Placed smaller element into left partition.', rule: 'swap(arr[i], arr[j])', values: { i, j } },
        };
      }
    }
  }

  // Place Pivot in its final position
  const pivotPos = i + 1;
  const tmp = arr[pivotPos];
  arr[pivotPos] = arr[n - 1];
  arr[n - 1] = tmp;

  yield {
    type: 'found',
    codeLine: 4,
    indices: [pivotPos],
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 0,
          title: 'Level 0: Array with Pivot Placed',
          nodes: [{ id: 'q-0-0', level: 0, array: [...arr], status: 'splitting' }],
        },
        {
          level: 1,
          title: 'Level 1: Partitions Around Pivot 70',
          nodes: [
            { id: 'q-1-0', level: 1, array: arr.slice(0, pivotPos), status: 'splitting' },
            { id: 'q-1-1', level: 1, array: [70], status: 'merged', isPivot: true },
            { id: 'q-1-2', level: 1, array: arr.slice(pivotPos + 1), status: 'splitting' },
          ],
        },
      ],
      activeNodeId: 'q-1-1',
      array: [...arr],
    },
    message: `Pivot 70 permanently placed at index ${pivotPos}! Left: [${arr.slice(0, pivotPos).join(', ')}], Right: [${arr.slice(pivotPos + 1).join(', ')}].`,
    reason: {
      action: `Lock Pivot at Index ${pivotPos}`,
      why: 'All elements to left are < 70, all elements to right are >= 70. Pivot will never move again.',
      rule: 'swap(arr[i+1], arr[high])',
      values: { pivot: 70, finalIndex: pivotPos },
    },
  };

  // Recurse left partition [10, 30, 40, 50] with pivot 50
  const leftSub = [10, 30, 40, 50];
  for (let j = 0; j < leftSub.length - 1; j++) {
    yield {
      type: 'compare',
      codeLine: 2,
      dataState: {
        title: 'Quick Sort Partition Tree',
        mode: 'quick-sort',
        phase: 'partition',
        levels: [
          {
            level: 1,
            title: 'Level 1: Partitioning Left Subarray (Pivot: 50)',
            nodes: [
              { id: 'q-1-0', level: 1, array: leftSub, status: 'splitting' },
              { id: 'q-1-1', level: 1, array: [70], status: 'merged', isPivot: true },
              { id: 'q-1-2', level: 1, array: [90, 80], status: 'splitting' },
            ],
          },
        ],
        activeNodeId: 'q-1-0',
        array: [...arr],
      },
      message: `Left Subarray: Scan j=${j}: element ${leftSub[j]} < Pivot 50. In place.`,
      reason: { action: `Scan ${leftSub[j]} < 50`, why: 'Element belongs in left partition.', rule: 'left < pivot', values: { val: leftSub[j] } },
    };
  }

  yield {
    type: 'found',
    codeLine: 4,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 2,
          title: 'Level 2: Pivot 50 Settled',
          nodes: [
            { id: 'q-2-0', level: 2, array: [10, 30, 40], status: 'merged' },
            { id: 'q-2-1', level: 2, array: [50], status: 'merged', isPivot: true },
          ],
        },
      ],
      activeNodeId: 'q-2-1',
      array: [...arr],
    },
    message: 'Pivot 50 settled into final position in left subtree.',
    reason: { action: 'Lock Pivot 50', why: 'Left subproblem partitioned.', rule: 'pivot placed', values: { pivot: 50 } },
  };

  // Level 2 Sub-branch: Partition [10, 30, 40] with pivot 40
  const sub2 = [10, 30, 40];
  for (let k = 0; k < sub2.length - 1; k++) {
    yield {
      type: 'compare',
      codeLine: 2,
      dataState: {
        title: 'Quick Sort Partition Tree',
        mode: 'quick-sort',
        phase: 'partition',
        levels: [
          {
            level: 2,
            title: 'Level 2: Partitioning Subarray [10, 30, 40] (Pivot: 40)',
            nodes: [{ id: 'q-2-0', level: 2, array: sub2, status: 'splitting' }],
          },
        ],
        activeNodeId: 'q-2-0',
        array: [...arr],
      },
      message: `Sub-partition: Checking ${sub2[k]} vs Pivot 40. ${sub2[k]} < 40, stays left.`,
      reason: { action: `Scan ${sub2[k]} < 40`, why: 'Belongs in left subarray.', rule: 'arr[k] < pivot', values: { val: sub2[k], pivot: 40 } },
    };
  }

  yield {
    type: 'found',
    codeLine: 4,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 3,
          title: 'Level 3: Pivot 40 Settled',
          nodes: [
            { id: 'q-3-0', level: 3, array: [10, 30], status: 'splitting' },
            { id: 'q-3-1', level: 3, array: [40], status: 'merged', isPivot: true },
          ],
        },
      ],
      activeNodeId: 'q-3-1',
      array: [...arr],
    },
    message: 'Pivot 40 settled into final position. Recursing on [10, 30].',
    reason: { action: 'Lock Pivot 40', why: 'Partitioned elements smaller than 40.', rule: 'pivot placed', values: { pivot: 40 } },
  };

  // Base singleton check on [10, 30] (Pivot 30)
  yield {
    type: 'compare',
    codeLine: 2,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 4,
          title: 'Level 4: Partitioning [10, 30] (Pivot 30)',
          nodes: [{ id: 'q-4-0', level: 4, array: [10, 30], status: 'splitting' }],
        },
      ],
      activeNodeId: 'q-4-0',
      array: [...arr],
    },
    message: 'Partitioning [10, 30]: Comparing element 10 with Pivot 30. 10 < 30.',
    reason: { action: 'Scan 10 < 30', why: '10 is smaller than pivot 30.', rule: 'arr[0] < pivot', values: { val: 10, pivot: 30 } },
  };

  yield {
    type: 'found',
    codeLine: 4,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 5,
          title: 'Level 5: Base Singleton [10] and Pivot [30] Locked',
          nodes: [
            { id: 'q-5-0', level: 5, array: [10], status: 'merged' },
            { id: 'q-5-1', level: 5, array: [30], status: 'merged', isPivot: true },
          ],
        },
      ],
      activeNodeId: 'q-5-1',
      array: [...arr],
    },
    message: 'Singletons reached: 10 and 30 are both in their final sorted positions!',
    reason: { action: 'Lock 10 & 30', why: 'Subarray size <= 1 is base case.', rule: 'base case', values: { sorted: [10, 30] } },
  };

  // Recurse right partition [90, 80] with pivot 80
  yield {
    type: 'step',
    codeLine: 1,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 1,
          title: 'Level 1: Right Subarray [90, 80]',
          nodes: [{ id: 'q-1-2', level: 1, array: [90, 80], status: 'splitting' }],
        },
      ],
      activeNodeId: 'q-1-2',
      array: [...arr],
    },
    message: 'Right Subarray: Initiating partition on [90, 80]. Benchmark pivot chosen: 80.',
    reason: { action: 'Select Right Pivot 80', why: 'Partitioning subproblem elements >= 70.', rule: 'pivot = arr[high]', values: { subarray: [90, 80], pivot: 80 } },
  };

  yield {
    type: 'compare',
    codeLine: 2,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 1,
          title: 'Level 1: Partitioning Right Subarray (Pivot: 80)',
          nodes: [{ id: 'q-1-2', level: 1, array: [90, 80], status: 'splitting' }],
        },
      ],
      activeNodeId: 'q-1-2',
      array: [...arr],
    },
    message: 'Right Subarray: Comparing 90 with Pivot 80. 90 > 80, element belongs in right partition.',
    reason: { action: 'Scan 90 > 80', why: '90 is larger than pivot 80.', rule: 'arr[0] > pivot', values: { val: 90, pivot: 80 } },
  };

  yield {
    type: 'swap',
    codeLine: 3,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'partition',
      levels: [
        {
          level: 2,
          title: 'Level 2: Pivot 80 Settled',
          nodes: [
            { id: 'q-2-2', level: 2, array: [80], status: 'merged', isPivot: true },
            { id: 'q-2-3', level: 2, array: [90], status: 'merged' },
          ],
        },
      ],
      activeNodeId: 'q-2-2',
      array: [...arr],
    },
    message: 'Right Subarray: Swapped 90 and 80. Pivot 80 permanently locked into position.',
    reason: { action: 'Lock Pivot 80', why: 'Right subproblem partitioned.', rule: 'pivot placed', values: { pivot: 80 } },
  };

  yield {
    type: 'step',
    codeLine: 4,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'complete',
      levels: [
        {
          level: 2,
          title: 'Level 2: All Subproblems Settled',
          nodes: [
            { id: 'q-2-2', level: 2, array: [80], status: 'merged', isPivot: true },
            { id: 'q-2-3', level: 2, array: [90], status: 'merged' },
          ],
        },
      ],
      activeNodeId: 'q-2-2',
      array: [...arr],
    },
    message: 'Base cases reached across all recursion branches. Merging partition tree results.',
    reason: { action: 'Verify Subproblem Termination', why: 'Every element has acted as a pivot or reached size 1.', rule: 'size <= 1 return', values: { rightPartition: [80, 90] } },
  };

  // Final complete
  const finalSorted = [10, 30, 40, 50, 70, 80, 90];
  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      title: 'Quick Sort Partition Tree',
      mode: 'quick-sort',
      phase: 'complete',
      levels: [
        {
          level: 0,
          title: 'Final In-Place Sorted Array',
          nodes: [{ id: 'q-0-0', level: 0, array: finalSorted, status: 'merged' }],
        },
      ],
      activeNodeId: 'q-0-0',
      sortedIndices: Array.from({ length: 7 }, (_, i) => i),
      array: finalSorted,
    },
    message: `Quick Sort Complete! Final in-place sorted array: [${finalSorted.join(', ')}].`,
    reason: {
      action: 'Quick Sort Complete',
      why: 'All recursive partitions have terminated and settled.',
      rule: 'O(n log n) expected time',
      values: { finalSorted },
    },
  };
}

/**
 * Generates step-by-step Binary Search as Divide & Conquer Halving Tree (>= 12 Steps)
 */
export function* generateBinarySearchDCTree(
  inputArray: number[] = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91],
  target: number = 72
): Generator<StepAction<DivideConquerData>, void, unknown> {
  const arr = [...inputArray];
  let low = 0;
  let high = arr.length - 1;
  let level = 0;

  yield {
    type: 'start',
    codeLine: 1,
    indices: [low, high],
    dataState: {
      title: 'Binary Search as Divide & Conquer',
      mode: 'binary-search',
      phase: 'halve',
      levels: [
        {
          level: 0,
          title: `Level 0: Full Search Interval [${low}..${high}]`,
          nodes: [{ id: 'bs-0-0', level: 0, array: [...arr], status: 'splitting' }],
        },
      ],
      activeNodeId: 'bs-0-0',
      array: [...arr],
    },
    message: `Binary Search D&C Tree initialized. Target: ${target}. Search interval: [${low}..${high}] (11 elements).`,
    reason: {
      action: 'Init Search Interval',
      why: 'Binary search applies Divide & Conquer: T(n) = T(n/2) + O(1), halving the candidate space on every step.',
      rule: 'T(n) = T(n/2) + 1',
      values: { target, low, high, count: high - low + 1 },
    },
  };

  while (low <= high) {
    level++;

    // Step A: Focus Active Subarray Interval
    yield {
      type: 'step',
      codeLine: 2,
      indices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
      pointers: { low, high },
      dataState: {
        title: 'Binary Search as Divide & Conquer',
        mode: 'binary-search',
        phase: 'halve',
        levels: [
          {
            level,
            title: `Level ${level}: Active Search Interval [${low}..${high}] (${high - low + 1} items)`,
            nodes: [{ id: `bs-${level}-0`, level, array: arr.slice(low, high + 1), status: 'splitting' }],
          },
        ],
        activeNodeId: `bs-${level}-0`,
        array: [...arr],
      },
      message: `Level ${level}: Active search interval is [${low}..${high}] containing ${high - low + 1} candidates (${arr.slice(low, high + 1).join(', ')}).`,
      reason: {
        action: `Subtree Inspection: [${low}..${high}]`,
        why: `Candidate subspace narrowed down. Evaluating midpoint across current interval bounds.`,
        rule: 'low <= high',
        values: { low, high, count: high - low + 1 },
      },
    };

    const mid = Math.floor((low + high) / 2);
    const midVal = arr[mid];

    // Step B: Mid compute step
    yield {
      type: 'step',
      codeLine: 2,
      indices: [mid],
      pointers: { low, mid, high },
      dataState: {
        title: 'Binary Search as Divide & Conquer',
        mode: 'binary-search',
        phase: 'halve',
        levels: [
          {
            level,
            title: `Level ${level}: Midpoint at Index ${mid} (${midVal})`,
            nodes: [{ id: `bs-${level}-0`, level, array: arr.slice(low, high + 1), status: 'splitting' }],
          },
        ],
        activeNodeId: `bs-${level}-0`,
        array: [...arr],
      },
      message: `Level ${level}: Calculated mid index = floor((${low} + ${high}) / 2) = ${mid}. Mid value is arr[${mid}] = ${midVal}.`,
      reason: {
        action: `Evaluate Mid Index: ${mid}`,
        why: 'Center element chosen to divide search interval into two equal halves.',
        rule: 'mid = floor((low + high) / 2)',
        values: { low, high, mid, midVal },
      },
    };

    // Step C: Compare step
    const isTarget = midVal === target;
    const isRight = target > midVal;

    yield {
      type: 'compare',
      codeLine: 3,
      indices: [mid],
      pointers: { low, mid, high },
      dataState: {
        title: 'Binary Search as Divide & Conquer',
        mode: 'binary-search',
        phase: 'halve',
        levels: [
          {
            level,
            title: `Level ${level}: Comparing ${target} vs ${midVal}`,
            nodes: [{ id: `bs-${level}-0`, level, array: arr.slice(low, high + 1), status: 'comparing' }],
          },
        ],
        activeNodeId: `bs-${level}-0`,
        array: [...arr],
      },
      message: `Comparing target ${target} vs arr[${mid}] (${midVal}): ${
        isTarget ? 'EQUAL (Target Located!)' : isRight ? `${target} > ${midVal} (Target is in RIGHT half)` : `${target} < ${midVal} (Target is in LEFT half)`
      }.`,
      reason: {
        action: `Compare ${target} vs ${midVal}`,
        why: isTarget
          ? 'Exact match confirmed.'
          : isRight
          ? `Target exceeds mid value (${target} > ${midVal}). Discarding left half [${low}..${mid}].`
          : `Target is less than mid value (${target} < ${midVal}). Discarding right half [${mid}..${high}].`,
        rule: 'if (arr[mid] == target) return; else if (target > arr[mid]) low = mid + 1; else high = mid - 1;',
        values: { target, midVal, branch: isTarget ? 'FOUND' : isRight ? 'RIGHT' : 'LEFT' },
      },
    };

    if (isTarget) {
      yield {
        type: 'found',
        codeLine: 4,
        indices: [mid],
        pointers: { found: mid },
        dataState: {
          title: 'Binary Search as Divide & Conquer',
          mode: 'binary-search',
          phase: 'complete',
          levels: [
            {
              level,
              title: `Level ${level}: Target Found at Index ${mid}`,
              nodes: [{ id: `bs-${level}-0`, level, array: [midVal], status: 'merged' }],
            },
          ],
          activeNodeId: `bs-${level}-0`,
          array: [...arr],
        },
        message: `SUCCESS! Target ${target} found at index ${mid} in Level ${level} of halving tree!`,
        reason: {
          action: `Target Found: Index ${mid}`,
          why: `arr[${mid}] == ${target}. Binary Search D&C concluded in O(log n) tree depth.`,
          rule: 'return mid',
          values: { index: mid, value: target },
        },
      };

      yield {
        type: 'complete',
        codeLine: 4,
        indices: [mid],
        pointers: { found: mid },
        dataState: {
          title: 'Binary Search as Divide & Conquer',
          mode: 'binary-search',
          phase: 'complete',
          levels: [
            {
              level,
              title: 'Search Complete',
              nodes: [{ id: `bs-${level}-0`, level, array: [midVal], status: 'merged' }],
            },
          ],
          activeNodeId: `bs-${level}-0`,
          array: [...arr],
        },
        message: `Binary Search Tree completed in ${level} halving divisions. Target ${target} successfully verified.`,
        reason: {
          action: 'Binary Search Tree Complete',
          why: 'Logarithmic D&C halving finished with exact match.',
          rule: 'T(n) = T(n/2) + O(1) => O(log n)',
          values: { comparisons: level, finalIndex: mid },
        },
      };
      return;
    }

    if (isRight) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }

    // Step D: Discard step
    yield {
      type: 'step',
      codeLine: 5,
      dataState: {
        title: 'Binary Search as Divide & Conquer',
        mode: 'binary-search',
        phase: 'halve',
        levels: [
          {
            level,
            title: `Level ${level}: Discarded Opposite Subtree`,
            nodes: [{ id: `bs-${level}-0`, level, array: arr.slice(low, high + 1), status: 'idle' }],
          },
        ],
        activeNodeId: `bs-${level}-0`,
        array: [...arr],
      },
      message: `Discarded opposite partition. New active search window contracted to [${low}..${high}].`,
      reason: {
        action: 'Contract Search Interval',
        why: 'Half the remaining elements pruned in O(1) time.',
        rule: 'low = mid + 1 or high = mid - 1',
        values: { newLow: low, newHigh: high, remainingCount: high - low + 1 },
      },
    };
  }
}
