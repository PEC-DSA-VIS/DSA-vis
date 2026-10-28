import { StepAction } from '../types';

export interface ActivityItem {
  id: number;
  name: string;
  start: number;
  end: number;
  color?: string;
  status: 'pending' | 'comparing' | 'accepted' | 'rejected';
  rejectionReason?: string;
}

export interface ActivityTimelineData {
  activities: ActivityItem[];
  sortedActivities: ActivityItem[];
  currentIndex: number | null;
  lastAcceptedId: number | null;
  lastFinishTime: number;
  timelineMax: number;
  acceptedCount: number;
  rejectedCount: number;
  phase: 'unsorted' | 'sorting' | 'evaluating' | 'complete';
}

export function* generateActivitySelectionSteps(): Generator<StepAction<ActivityTimelineData>, void, unknown> {
  const initialActivities: ActivityItem[] = [
    { id: 1, name: 'Act 1', start: 1, end: 4, status: 'pending' },
    { id: 2, name: 'Act 2', start: 3, end: 5, status: 'pending' },
    { id: 3, name: 'Act 3', start: 0, end: 6, status: 'pending' },
    { id: 4, name: 'Act 4', start: 5, end: 7, status: 'pending' },
    { id: 5, name: 'Act 5', start: 3, end: 9, status: 'pending' },
    { id: 6, name: 'Act 6', start: 5, end: 9, status: 'pending' },
    { id: 7, name: 'Act 7', start: 6, end: 10, status: 'pending' },
    { id: 8, name: 'Act 8', start: 8, end: 11, status: 'pending' },
  ];

  const timelineMax = 12;

  // Step 0: Initial Unsorted
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      activities: initialActivities.map((a) => ({ ...a })),
      sortedActivities: [],
      currentIndex: null,
      lastAcceptedId: null,
      lastFinishTime: 0,
      timelineMax,
      acceptedCount: 0,
      rejectedCount: 0,
      phase: 'unsorted',
    },
    message: `Loaded ${initialActivities.length} unsorted interval requests. Greedy goal: select maximum non-overlapping activities.`,
    reason: {
      action: 'Load Activities',
      why: 'Starting with raw activity requests across a 0..12 timeline.',
      rule: 'Input processing',
      values: { count: initialActivities.length },
      details: 'Interval scheduling requires sorting by earliest finish time.',
    },
  };

  // Step 1: Sorting intro
  const sorted = [...initialActivities].sort((a, b) => a.end - b.end);

  yield {
    type: 'step',
    codeLine: 1,
    indices: [],
    dataState: {
      activities: initialActivities.map((a) => ({ ...a })),
      sortedActivities: sorted.map((a) => ({ ...a })),
      currentIndex: null,
      lastAcceptedId: null,
      lastFinishTime: 0,
      timelineMax,
      acceptedCount: 0,
      rejectedCount: 0,
      phase: 'sorting',
    },
    message: 'Sorting all activities by finish time ascending. Earliest finish leaves maximum room for future events.',
    reason: {
      action: 'Sort by Finish Time',
      why: 'Sorting order: ' + sorted.map((a) => `${a.name} (end: ${a.end})`).join(' < '),
      rule: 'a.end <= b.end',
      values: { order: sorted.map((a) => a.end) },
      details: 'Greedy choice property: finishing earliest is always optimal.',
    },
  };

  const currentList = sorted.map((a) => ({ ...a }));
  let lastFinishTime = 0;
  let acceptedCount = 0;
  let rejectedCount = 0;
  let lastAcceptedId: number | null = null;

  // Process activities one by one
  for (let i = 0; i < currentList.length; i++) {
    const act = currentList[i];
    act.status = 'comparing';

    // Step: Examining activity
    yield {
      type: 'compare',
      codeLine: 3,
      indices: [i],
      dataState: {
        activities: initialActivities,
        sortedActivities: currentList.map((a) => ({ ...a })),
        currentIndex: i,
        lastAcceptedId,
        lastFinishTime,
        timelineMax,
        acceptedCount,
        rejectedCount,
        phase: 'evaluating',
      },
      message: `Evaluating ${act.name} [${act.start}..${act.end}]. Check if start (${act.start}) >= last finish (${lastFinishTime}).`,
      reason: {
        action: `Check ${act.name}`,
        why: `Compare start time ${act.start} against current resource availability time ${lastFinishTime}.`,
        rule: `start (${act.start}) >= lastFinish (${lastFinishTime})`,
        values: { start: act.start, lastFinish: lastFinishTime, overlap: act.start < lastFinishTime },
        details: act.start >= lastFinishTime ? 'Interval is free; no collision.' : `Collision: overlaps by ${lastFinishTime - act.start} unit(s).`,
      },
    };

    if (act.start >= lastFinishTime) {
      // Accepted!
      act.status = 'accepted';
      lastFinishTime = act.end;
      lastAcceptedId = act.id;
      acceptedCount++;

      yield {
        type: 'found',
        codeLine: 4,
        indices: [i],
        dataState: {
          activities: initialActivities,
          sortedActivities: currentList.map((a) => ({ ...a })),
          currentIndex: i,
          lastAcceptedId,
          lastFinishTime,
          timelineMax,
          acceptedCount,
          rejectedCount,
          phase: 'evaluating',
        },
        message: `Accepted ${act.name} [${act.start}..${act.end}]! Scheduled on timeline. Resource locked until T=${lastFinishTime}.`,
        reason: {
          action: `Accept ${act.name}`,
          why: `Start time ${act.start} >= previous finish ${lastFinishTime}. Zero conflict!`,
          rule: 'Compatible: scheduled',
          values: { activity: act.name, newFinishTime: lastFinishTime },
          details: 'Greedily commit to this interval.',
        },
      };
    } else {
      // Rejected!
      act.status = 'rejected';
      act.rejectionReason = `Overlaps by ${lastFinishTime - act.start} unit(s)`;
      rejectedCount++;

      yield {
        type: 'discard',
        codeLine: 3,
        indices: [i],
        dataState: {
          activities: initialActivities,
          sortedActivities: currentList.map((a) => ({ ...a })),
          currentIndex: i,
          lastAcceptedId,
          lastFinishTime,
          timelineMax,
          acceptedCount,
          rejectedCount,
          phase: 'evaluating',
        },
        message: `Rejected ${act.name} [${act.start}..${act.end}]: Starts at T=${act.start}, but resource busy until T=${lastFinishTime}!`,
        reason: {
          action: `Reject ${act.name}`,
          why: `Conflict: interval starts at ${act.start}, earlier than active task completion at ${lastFinishTime}.`,
          rule: `${act.start} < ${lastFinishTime} => Incompatible`,
          values: { start: act.start, required: lastFinishTime, overlap: lastFinishTime - act.start },
          details: 'Discarding overlapping request to preserve scheduling integrity.',
        },
      };
    }
  }

  // Final completion step
  yield {
    type: 'complete',
    codeLine: 4,
    indices: [],
    dataState: {
      activities: initialActivities,
      sortedActivities: currentList.map((a) => ({ ...a })),
      currentIndex: null,
      lastAcceptedId,
      lastFinishTime,
      timelineMax,
      acceptedCount,
      rejectedCount,
      phase: 'complete',
    },
    message: `Activity Selection complete! Scheduled ${acceptedCount} optimal non-overlapping activities (Rejected ${rejectedCount}).`,
    reason: {
      action: 'Greedy Complete',
      why: `Greedy finish-time strategy achieved optimal capacity with ${acceptedCount} scheduled activities.`,
      rule: 'O(n log n) optimal bound',
      values: { accepted: acceptedCount, rejected: rejectedCount },
      details: 'All remaining requests successfully processed.',
    },
  };
}

export function* generateHuffmanSteps(): Generator<StepAction, void, unknown> {
  const characters = [
    { char: 'A', freq: 5, id: 2, x: 200, y: 80 },
    { char: 'R', freq: 2, id: 4, x: 300, y: 150 },
    { char: 'B', freq: 2, id: 6, x: 400, y: 220 },
    { char: 'C', freq: 1, id: 8, x: 500, y: 300 },
    { char: 'D', freq: 1, id: 9, x: 600, y: 300 },
  ];

  // Step 0: Frequency Table Initialized
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      nodes: [],
      edges: [],
      traversalOutput: ['Input: "ABRACADABRA" (11 chars)', 'Frequencies: A:5, R:2, B:2, C:1, D:1'],
    },
    message: 'Frequency analysis for "ABRACADABRA": A(5), R(2), B(2), C(1), D(1). Priority Queue initialized empty.',
    reason: {
      action: 'Frequency Analysis',
      why: 'Count frequencies across input string. Lower frequency characters will be placed deeper in the tree.',
      rule: 'table = countFrequencies(text)',
      values: { A: 5, R: 2, B: 2, C: 1, D: 1, totalLength: 11 },
      details: 'Optimal prefix code requires assigning shorter binary codes to more frequent symbols.',
    },
  };

  // Step 1-5: Insert leaves into Priority Queue one by one
  const initialNodes: any[] = [];
  const pqLeaves = [
    { char: 'C', freq: 1, id: 8, x: 500, y: 300 },
    { char: 'D', freq: 1, id: 9, x: 600, y: 300 },
    { char: 'B', freq: 2, id: 6, x: 400, y: 220 },
    { char: 'R', freq: 2, id: 4, x: 300, y: 150 },
    { char: 'A', freq: 5, id: 2, x: 200, y: 80 },
  ];

  for (let idx = 0; idx < pqLeaves.length; idx++) {
    const leaf = pqLeaves[idx];
    initialNodes.push({
      id: leaf.id,
      val: `${leaf.char} (${leaf.freq})`,
      leftId: null,
      rightId: null,
      parentId: null,
      x: leaf.x,
      y: leaf.y,
    });

    yield {
      type: 'insert',
      codeLine: 2,
      indices: [leaf.id],
      dataState: {
        nodes: [...initialNodes],
        edges: [],
        activeNodeId: leaf.id,
        traversalOutput: [
          `PQ Insert: ${leaf.char}(${leaf.freq})`,
          `Current Queue: [${initialNodes.map((n) => n.val).join(', ')}]`,
        ],
      },
      message: `PQ Insert: Created leaf node '${leaf.char}' (weight ${leaf.freq}) and inserted into Min-Heap.`,
      reason: {
        action: `Insert leaf ${leaf.char}`,
        why: `Building the initial priority queue with all distinct alphabet symbols as single-node trees.`,
        rule: 'pq.insert(new Leaf(char, freq))',
        values: { symbol: leaf.char, frequency: leaf.freq, pqSize: initialNodes.length },
        details: 'Priority queue orders subtrees ascending by root weight.',
      },
    };
  }

  // Intermediate node definitions
  // Round 1: C(1) + D(1) -> CD(2)
  yield {
    type: 'compare',
    codeLine: 3,
    indices: [8, 9],
    dataState: {
      nodes: [...initialNodes],
      edges: [],
      activeNodeId: 8,
      traversalOutput: ['Round 1: Extracting 2 minimums from PQ -> C(1) and D(1)'],
    },
    message: 'Min-Heap Extract 1: Smallest items in queue are C(1) and D(1).',
    reason: {
      action: 'Extract Min: C(1) & D(1)',
      why: 'Both C and D have frequency 1, the lowest weights in the heap.',
      rule: 'min1 = pq.extractMin(), min2 = pq.extractMin()',
      values: { min1: 'C(1)', min2: 'D(1)' },
      details: 'Greedy choice: combine the two rarest characters first.',
    },
  };

  const nodeCD = { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: null, x: 550, y: 220 };
  const stage1Nodes = [
    nodeCD,
    { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7, x: 500, y: 300 },
    { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7, x: 600, y: 300 },
    { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: null, x: 400, y: 220 },
    { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: null, x: 300, y: 220 },
    { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: null, x: 200, y: 150 },
  ];
  const stage1Edges = [
    { from: 7, to: 8, weight: 0 },
    { from: 7, to: 9, weight: 1 },
  ];

  yield {
    type: 'step',
    codeLine: 4,
    indices: [7],
    dataState: {
      nodes: stage1Nodes,
      edges: stage1Edges,
      activeNodeId: 7,
      traversalOutput: ['Merged: C(1) + D(1) = CD(2)', 'Re-inserted CD(2) into PQ: [B(2), R(2), CD(2), A(5)]'],
    },
    message: 'Merge 1: Joined C(1) and D(1) into internal node CD(2). Left edge=0, Right edge=1. Re-inserted into Min-Heap.',
    reason: {
      action: 'Create Node CD(2)',
      why: 'Combined frequency = 1 + 1 = 2. C receives bit prefix 0; D receives bit prefix 1.',
      rule: 'parent.freq = left.freq + right.freq',
      values: { left: 'C(1)', right: 'D(1)', sum: 2 },
      details: 'Queue now holds 4 trees: B(2), R(2), CD(2), A(5).',
    },
  };

  // Round 2: B(2) + CD(2) -> BCD(4)
  yield {
    type: 'compare',
    codeLine: 3,
    indices: [6, 7],
    dataState: {
      nodes: stage1Nodes,
      edges: stage1Edges,
      activeNodeId: 6,
      traversalOutput: ['Round 2: Extracting 2 minimums from PQ -> B(2) and CD(2)'],
    },
    message: 'Min-Heap Extract 2: Next two minimums are B(2) and CD(2).',
    reason: {
      action: 'Extract Min: B(2) & CD(2)',
      why: 'Both have frequency 2, strictly less than A(5).',
      rule: 'min1 = pq.extractMin(), min2 = pq.extractMin()',
      values: { min1: 'B(2)', min2: 'CD(2)' },
      details: 'Combining single leaf B with subtree CD.',
    },
  };

  const nodeBCD = { id: 5, val: 'BCD (4)', leftId: 6, rightId: 7, parentId: null, x: 475, y: 150 };
  const stage2Nodes = [
    nodeBCD,
    { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: 5, x: 400, y: 220 },
    { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: 5, x: 550, y: 220 },
    { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7, x: 500, y: 300 },
    { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7, x: 600, y: 300 },
    { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: null, x: 300, y: 220 },
    { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: null, x: 200, y: 150 },
  ];
  const stage2Edges = [
    { from: 5, to: 6, weight: 0 },
    { from: 5, to: 7, weight: 1 },
    ...stage1Edges,
  ];

  yield {
    type: 'step',
    codeLine: 4,
    indices: [5],
    dataState: {
      nodes: stage2Nodes,
      edges: stage2Edges,
      activeNodeId: 5,
      traversalOutput: ['Merged: B(2) + CD(2) = BCD(4)', 'Re-inserted BCD(4) into PQ: [R(2), BCD(4), A(5)]'],
    },
    message: 'Merge 2: Joined B(2) and CD(2) into internal node BCD(4). Left edge=0, Right edge=1.',
    reason: {
      action: 'Create Node BCD(4)',
      why: 'Combined frequency = 2 + 2 = 4. Subtree BCD is pushed back to Min-Heap.',
      rule: 'parent.freq = left.freq + right.freq',
      values: { left: 'B(2)', right: 'CD(2)', sum: 4 },
      details: 'Queue now holds 3 trees: R(2), BCD(4), A(5).',
    },
  };

  // Round 3: R(2) + BCD(4) -> RBCD(6)
  yield {
    type: 'compare',
    codeLine: 3,
    indices: [4, 5],
    dataState: {
      nodes: stage2Nodes,
      edges: stage2Edges,
      activeNodeId: 4,
      traversalOutput: ['Round 3: Extracting 2 minimums from PQ -> R(2) and BCD(4)'],
    },
    message: 'Min-Heap Extract 3: Lowest remaining weights are R(2) and BCD(4).',
    reason: {
      action: 'Extract Min: R(2) & BCD(4)',
      why: 'R has frequency 2; BCD has frequency 4. Both are smaller than or equal to A(5).',
      rule: 'min1 = pq.extractMin(), min2 = pq.extractMin()',
      values: { min1: 'R(2)', min2: 'BCD(4)' },
      details: 'Merging subtree BCD with leaf R.',
    },
  };

  const nodeRBCD = { id: 3, val: 'RBCD (6)', leftId: 4, rightId: 5, parentId: null, x: 387, y: 80 };
  const stage3Nodes = [
    nodeRBCD,
    { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: 3, x: 300, y: 150 },
    { id: 5, val: 'BCD (4)', leftId: 6, rightId: 7, parentId: 3, x: 475, y: 150 },
    { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: 5, x: 400, y: 220 },
    { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: 5, x: 550, y: 220 },
    { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7, x: 500, y: 300 },
    { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7, x: 600, y: 300 },
    { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: null, x: 200, y: 150 },
  ];
  const stage3Edges = [
    { from: 3, to: 4, weight: 0 },
    { from: 3, to: 5, weight: 1 },
    ...stage2Edges,
  ];

  yield {
    type: 'step',
    codeLine: 4,
    indices: [3],
    dataState: {
      nodes: stage3Nodes,
      edges: stage3Edges,
      activeNodeId: 3,
      traversalOutput: ['Merged: R(2) + BCD(4) = RBCD(6)', 'Re-inserted RBCD(6) into PQ: [A(5), RBCD(6)]'],
    },
    message: 'Merge 3: Joined R(2) and BCD(4) into internal node RBCD(6). Left edge=0, Right edge=1.',
    reason: {
      action: 'Create Node RBCD(6)',
      why: 'Combined frequency = 2 + 4 = 6. Only two subtrees remain in queue: A(5) and RBCD(6).',
      rule: 'parent.freq = left.freq + right.freq',
      values: { left: 'R(2)', right: 'BCD(4)', sum: 6 },
      details: 'Queue size is now 2.',
    },
  };

  // Round 4: A(5) + RBCD(6) -> Root(11)
  yield {
    type: 'compare',
    codeLine: 3,
    indices: [2, 3],
    dataState: {
      nodes: stage3Nodes,
      edges: stage3Edges,
      activeNodeId: 2,
      traversalOutput: ['Round 4: Final extraction -> A(5) and RBCD(6)'],
    },
    message: 'Min-Heap Extract 4: Final two roots extracted: A(5) and RBCD(6).',
    reason: {
      action: 'Extract Min: A(5) & RBCD(6)',
      why: 'Only two elements left in priority queue. Merging these creates the final root.',
      rule: 'min1 = pq.extractMin(), min2 = pq.extractMin()',
      values: { min1: 'A(5)', min2: 'RBCD(6)' },
      details: 'Total weight will equal the full length of the input text (11).',
    },
  };

  const finalNodes = [
    { id: 1, val: 'Root (11)', leftId: 2, rightId: 3, parentId: null, x: 293, y: 20 },
    { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: 1, x: 200, y: 80 },
    { id: 3, val: 'RBCD (6)', leftId: 4, rightId: 5, parentId: 1, x: 387, y: 80 },
    { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: 3, x: 300, y: 150 },
    { id: 5, val: 'BCD (4)', leftId: 6, rightId: 7, parentId: 3, x: 475, y: 150 },
    { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: 5, x: 400, y: 220 },
    { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: 5, x: 550, y: 220 },
    { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7, x: 500, y: 300 },
    { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7, x: 600, y: 300 },
  ];
  const finalEdges = [
    { from: 1, to: 2, weight: 0 },
    { from: 1, to: 3, weight: 1 },
    ...stage3Edges,
  ];

  yield {
    type: 'step',
    codeLine: 4,
    indices: [1],
    dataState: {
      nodes: finalNodes,
      edges: finalEdges,
      activeNodeId: 1,
      traversalOutput: ['Final Merge: A(5) + RBCD(6) = Root(11)', 'Binary Tree Structure Complete!'],
    },
    message: 'Merge 4: Created Root(11) with Left child A(5) [0] and Right child RBCD(6) [1]. Queue size = 1.',
    reason: {
      action: 'Construct Root(11)',
      why: 'All 5 alphabets merged into a single binary tree rooted at Root(11).',
      rule: 'pq.size() == 1 => stop',
      values: { totalFrequency: 11, alphabetCount: 5 },
      details: 'All paths from root down to leaves now form unambiguous prefix codes.',
    },
  };

  // Traversal & Code derivation steps (labeling edges & extracting codes)
  const codes = [
    { char: 'A', code: '0', path: 'Root -> Left (0)' },
    { char: 'R', code: '10', path: 'Root -> Right (1) -> Left (0)' },
    { char: 'B', code: '110', path: 'Root -> Right (1) -> Right (1) -> Left (0)' },
    { char: 'C', code: '1110', path: 'Root -> Right (1) -> Right (1) -> Right (1) -> Left (0)' },
    { char: 'D', code: '1111', path: 'Root -> Right (1) -> Right (1) -> Right (1) -> Right (1)' },
  ];

  for (const c of codes) {
    yield {
      type: 'found',
      codeLine: 5,
      indices: [1],
      dataState: {
        nodes: finalNodes,
        edges: finalEdges,
        traversalOutput: [
          `Derived Code for '${c.char}': "${c.code}"`,
          `Traversal Path: ${c.path}`,
        ],
      },
      message: `Code derived for '${c.char}': "${c.code}" via path ${c.path}.`,
      reason: {
        action: `Prefix Code for '${c.char}'`,
        why: `Traversing left edge appends '0', right edge appends '1'. Leaf '${c.char}' reached with code "${c.code}".`,
        rule: 'path(root, leaf) -> binary string',
        values: { symbol: c.char, code: c.code, bits: c.code.length },
        details: 'No code is a prefix of any other code (instant decoding property).',
      },
    };
  }

  // Final Summary step
  yield {
    type: 'complete',
    codeLine: 5,
    indices: [1, 2],
    dataState: {
      nodes: finalNodes,
      edges: finalEdges,
      activeNodeId: 1,
      traversalOutput: [
        'Prefix Codes: A="0", R="10", B="110", C="1110", D="1111"',
        'Uncompressed: 11 chars * 8 bits = 88 bits',
        'Compressed: 5*1 + 2*2 + 2*3 + 1*4 + 1*4 = 23 bits (73.9% savings!)',
      ],
    },
    message: 'Huffman Coding Complete! Compressed 88 bits to 23 bits (73.9% savings). Optimal variable-length prefix tree validated.',
    reason: {
      action: 'Huffman Complete',
      why: 'Optimal lossless compression: high frequency symbol A gets 1 bit, rare symbols get 4 bits.',
      rule: 'O(n log n) construction, O(1) instantaneous prefix-free decoding',
      values: { originalBits: 88, compressedBits: 23, compressionRatio: '73.9%' },
      details: 'Shannon-Fano / Huffman optimality theorem satisfied.',
    },
  };
}
