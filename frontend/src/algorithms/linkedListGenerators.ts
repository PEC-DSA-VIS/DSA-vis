import { StepAction } from '../types';

export interface LLNodeData {
  id: string | number;
  val: number | string;
  nextId?: string | number | null;
  prevId?: string | number | null;
}

export interface LinkedListDataState {
  nodes: LLNodeData[];
  listType: 'singly' | 'doubly' | 'circular' | 'cycle';
  pointers: Record<string, string | number | null>;
  cycleIndex?: number | null;
  activeOperation?: string;
  headIndex?: number | null;
  tailIndex?: number | null;
}

/**
 * 1. Singly Linked List: Live Creation, Traversal, Insertion, Deletion, and Reversal
 */
export function* generateSinglyLinkedListSteps(
  mode: 'all' | 'create' | 'traverse' | 'insert' | 'delete' | 'reverse' = 'all'
): Generator<StepAction<LinkedListDataState>, void, unknown> {
  const currentNodes: LLNodeData[] = [];

  // Start with completely EMPTY board
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { head: null },
    dataState: {
      nodes: [],
      listType: 'singly',
      pointers: { head: null },
      activeOperation: 'Initialize Empty List',
      headIndex: null,
      tailIndex: null,
    },
    message: 'Singly Linked List initialized as EMPTY (head = NULL). Board is clear.',
    reason: {
      action: 'Initialize Empty List',
      why: 'A new linked list begins with zero nodes and head pointer pointing to null.',
      rule: 'head = null',
      values: { nodeCount: 0, head: 'NULL' },
      details: 'Dynamic memory allocation allows nodes to be added sequentially.',
    },
  };

  // Phase 1: Create nodes one by one and link them
  const initialValues = [10, 20, 30, 40];
  for (let i = 0; i < initialValues.length; i++) {
    const val = initialValues[i];
    const newNode: LLNodeData = {
      id: `node-${i}`,
      val,
      nextId: null,
    };

    // Step A: Allocate node
    yield {
      type: 'insert',
      codeLine: 2,
      indices: [i],
      pointers: { newNode: i, head: currentNodes.length > 0 ? 0 : i },
      dataState: {
        nodes: [...currentNodes, { ...newNode }],
        listType: 'singly',
        pointers: { newNode: i, head: currentNodes.length > 0 ? 0 : i },
        activeOperation: `Create Node(${val})`,
        headIndex: 0,
        tailIndex: i,
      },
      message: `Allocated new Node with value ${val} in memory. next pointer = NULL.`,
      reason: {
        action: `Allocate Node(${val})`,
        why: `Created new Node(${val}) at heap address [${i}]. Not yet linked to list.`,
        rule: 'Node* newNode = new Node(val)',
        values: { value: val, index: i, next: 'NULL' },
        details: 'Dynamic memory node creation.',
      },
    };

    if (currentNodes.length > 0) {
      // Step B: Link previous node to new node
      const prevIdx = currentNodes.length - 1;
      currentNodes[prevIdx].nextId = newNode.id;

      yield {
        type: 'step',
        codeLine: 3,
        indices: [prevIdx, i],
        pointers: { prev: prevIdx, newNode: i, head: 0 },
        dataState: {
          nodes: [...currentNodes, { ...newNode }],
          listType: 'singly',
          pointers: { prev: prevIdx, newNode: i, head: 0 },
          activeOperation: `Link Node(${currentNodes[prevIdx].val}) -> Node(${val})`,
          headIndex: 0,
          tailIndex: i,
        },
        message: `Linked Node(${currentNodes[prevIdx].val}) [${prevIdx}] to point to new Node(${val}) [${i}].`,
        reason: {
          action: `Link [${prevIdx}].next = [${i}]`,
          why: `Extended list: previous tail [${prevIdx}] (val ${currentNodes[prevIdx].val}) now points to new node (${val}).`,
          rule: 'tail->next = newNode',
          values: { fromVal: currentNodes[prevIdx].val, toVal: val },
          details: 'Pointer linkage establishes sequential list order.',
        },
      };
    }

    currentNodes.push(newNode);
  }

  // If only creation was requested, finish here
  if (mode === 'create') {
    yield {
      type: 'complete',
      codeLine: 4,
      indices: [0, currentNodes.length - 1],
      pointers: { head: 0, tail: currentNodes.length - 1 },
      dataState: {
        nodes: currentNodes.map((n) => ({ ...n })),
        listType: 'singly',
        pointers: { head: 0, tail: currentNodes.length - 1 },
        activeOperation: 'List Created',
        headIndex: 0,
        tailIndex: currentNodes.length - 1,
      },
      message: `Singly Linked List created with ${currentNodes.length} nodes: 10 -> 20 -> 30 -> 40 -> NULL.`,
      reason: {
        action: 'Creation Complete',
        why: `All ${currentNodes.length} nodes successfully allocated and linked.`,
        rule: 'head -> [10] -> [20] -> [30] -> [40] -> NULL',
        values: { length: currentNodes.length },
      },
    };
    return;
  }

  // Phase 2: Pointer-by-pointer Traversal
  yield {
    type: 'step',
    codeLine: 4,
    indices: [0],
    pointers: { curr: 0, head: 0 },
    dataState: {
      nodes: currentNodes.map((n) => ({ ...n })),
      listType: 'singly',
      pointers: { curr: 0, head: 0 },
      activeOperation: 'Start Traversal',
      headIndex: 0,
      tailIndex: currentNodes.length - 1,
    },
    message: 'Starting traversal: pointer curr set to head (Node 0, val = 10).',
    reason: {
      action: 'curr = head',
      why: 'Traversal begins by pointing curr to the head node.',
      rule: 'Node* curr = head',
      values: { currIndex: 0, val: currentNodes[0].val },
      details: 'Sequential O(n) scan.',
    },
  };

  for (let c = 0; c < currentNodes.length; c++) {
    yield {
      type: 'visit',
      codeLine: 5,
      indices: [c],
      pointers: { curr: c, head: 0 },
      dataState: {
        nodes: currentNodes.map((n) => ({ ...n })),
        listType: 'singly',
        pointers: { curr: c, head: 0 },
        activeOperation: `Traverse Node [${c}]`,
        headIndex: 0,
        tailIndex: currentNodes.length - 1,
      },
      message: `Visiting Node [${c}] (val = ${currentNodes[c].val}). Next pointer points to ${
        c < currentNodes.length - 1 ? `Node [${c + 1}]` : 'NULL'
      }.`,
      reason: {
        action: `Visit [${c}] (val=${currentNodes[c].val})`,
        why: `curr is at index ${c} holding value ${currentNodes[c].val}.`,
        rule: 'process(curr->val); curr = curr->next',
        values: { currVal: currentNodes[c].val, nextVal: c < currentNodes.length - 1 ? currentNodes[c + 1].val : 'NULL' },
      },
    };
  }

  // Phase 3: Insert Node(25) between Node(20) and Node(30)
  const insertVal = 25;
  const insertIndex = 2; // after index 1 (val 20)
  const insertedNode: LLNodeData = {
    id: 'node-insert-25',
    val: insertVal,
    nextId: currentNodes[2].id,
  };

  yield {
    type: 'insert',
    codeLine: 6,
    indices: [1, 2],
    pointers: { curr: 1, newNode: 'newNode(25)', head: 0 },
    dataState: {
      nodes: currentNodes.map((n) => ({ ...n })),
      listType: 'singly',
      pointers: { curr: 1, newNode: 'newNode(25)', head: 0 },
      activeOperation: `Insert Node(${insertVal}) after Node(${currentNodes[1].val})`,
      headIndex: 0,
      tailIndex: currentNodes.length - 1,
    },
    message: `Inserting Node(${insertVal}) after Node(${currentNodes[1].val}). Setting newNode->next = curr->next (Node ${currentNodes[2].val}).`,
    reason: {
      action: `newNode->next = curr->next`,
      why: `Connecting newNode(${insertVal}) to current successor Node(${currentNodes[2].val}) so we don't lose the remaining list.`,
      rule: 'newNode->next = curr->next',
      values: { newVal: insertVal, targetSuccessor: currentNodes[2].val },
      details: 'Crucial order: link successor first to avoid memory leaks.',
    },
  };

  // Rewire curr.next = newNode
  currentNodes.splice(insertIndex, 0, insertedNode);
  currentNodes[1].nextId = insertedNode.id;

  yield {
    type: 'step',
    codeLine: 7,
    indices: [1, 2],
    pointers: { curr: 1, newNode: 2, head: 0 },
    dataState: {
      nodes: currentNodes.map((n) => ({ ...n })),
      listType: 'singly',
      pointers: { curr: 1, newNode: 2, head: 0 },
      activeOperation: `Rewire: Node(20)->next = Node(${insertVal})`,
      headIndex: 0,
      tailIndex: currentNodes.length - 1,
    },
    message: `Rewired Node(20)->next = Node(${insertVal}). Insertion complete! List size is now ${currentNodes.length}.`,
    reason: {
      action: 'curr->next = newNode',
      why: 'Now Node(20) points directly to Node(25), successfully splicing it into the chain.',
      rule: 'curr->next = newNode',
      values: { predecessor: 20, inserted: 25, successor: 30 },
      details: 'O(1) pointer splice once position is known.',
    },
  };

  // Phase 4: Delete Node(25)
  yield {
    type: 'delete',
    codeLine: 8,
    indices: [1, 2, 3],
    pointers: { prev: 1, curr: 2, next: 3, head: 0 },
    dataState: {
      nodes: currentNodes.map((n) => ({ ...n })),
      listType: 'singly',
      pointers: { prev: 1, curr: 2, next: 3, head: 0 },
      activeOperation: `Delete Node(${insertVal}) [index 2]`,
      headIndex: 0,
      tailIndex: currentNodes.length - 1,
    },
    message: `Deleting Node(${insertVal}): prev points to Node(20), curr points to Node(25), next points to Node(30).`,
    reason: {
      action: 'Bypass curr node',
      why: 'To delete Node(25), rewire prev->next directly to curr->next (Node 30), bypassing Node(25).',
      rule: 'prev->next = curr->next',
      values: { prevVal: 20, deleteVal: 25, nextVal: 30 },
      details: 'Bypassing the node unlinks it from the chain.',
    },
  };

  currentNodes.splice(2, 1);
  currentNodes[1].nextId = currentNodes[2].id;

  yield {
    type: 'step',
    codeLine: 9,
    indices: [1, 2],
    pointers: { prev: 1, head: 0 },
    dataState: {
      nodes: currentNodes.map((n) => ({ ...n })),
      listType: 'singly',
      pointers: { prev: 1, head: 0 },
      activeOperation: 'Node Deleted & Garbage Collected',
      headIndex: 0,
      tailIndex: currentNodes.length - 1,
    },
    message: `Node(25) unlinked and freed from heap memory. List restored to: 10 -> 20 -> 30 -> 40 -> NULL.`,
    reason: {
      action: 'delete curr',
      why: 'Memory deallocated for removed node. Restored original sequence.',
      rule: 'delete curr; curr = null',
      values: { listLength: currentNodes.length },
    },
  };

  // Phase 5: Reversal with prev, curr, next pointers moving live
  yield {
    type: 'start',
    codeLine: 10,
    indices: [0],
    pointers: { prev: 'NULL', curr: 0, next: 1, head: 0 },
    dataState: {
      nodes: currentNodes.map((n) => ({ ...n })),
      listType: 'singly',
      pointers: { prev: 'NULL', curr: 0, next: 1, head: 0 },
      activeOperation: 'Start In-Place Reversal',
      headIndex: 0,
      tailIndex: currentNodes.length - 1,
    },
    message: 'Starting in-place reversal: prev = NULL, curr = head (Node 0, val=10), next = curr->next (Node 1, val=20).',
    reason: {
      action: 'Init Reversal Pointers',
      why: 'Three pointers (prev, curr, next) prevent losing track of subsequent nodes during pointer inversion.',
      rule: 'prev = NULL, curr = head',
      values: { prev: 'NULL', curr: 10, next: 20 },
      details: 'Standard O(n) time, O(1) space reversal algorithm.',
    },
  };

  const reversedNodes: LLNodeData[] = currentNodes.map((n) => ({ ...n }));
  for (let stepIdx = 0; stepIdx < reversedNodes.length; stepIdx++) {
    const curVal = reversedNodes[stepIdx].val;
    const prevVal = stepIdx > 0 ? reversedNodes[stepIdx - 1].val : 'NULL';
    const nextVal = stepIdx < reversedNodes.length - 1 ? reversedNodes[stepIdx + 1].val : 'NULL';

    // Step A: Save next
    yield {
      type: 'pointer',
      codeLine: 11,
      indices: [stepIdx],
      pointers: {
        prev: stepIdx > 0 ? stepIdx - 1 : 'NULL',
        curr: stepIdx,
        next: stepIdx < reversedNodes.length - 1 ? stepIdx + 1 : 'NULL',
      },
      dataState: {
        nodes: reversedNodes.map((n) => ({ ...n })),
        listType: 'singly',
        pointers: {
          prev: stepIdx > 0 ? stepIdx - 1 : 'NULL',
          curr: stepIdx,
          next: stepIdx < reversedNodes.length - 1 ? stepIdx + 1 : 'NULL',
        },
        activeOperation: `Invert Pointer at Node(${curVal})`,
        headIndex: 0,
        tailIndex: reversedNodes.length - 1,
      },
      message: `Step ${stepIdx + 1}: Inverting pointer at Node(${curVal}). Pointing curr->next backwards to prev (${prevVal}).`,
      reason: {
        action: `curr->next = prev (${curVal} -> ${prevVal})`,
        why: `Reversing the directional link: Node(${curVal}) now points backwards to Node(${prevVal}).`,
        rule: 'curr->next = prev',
        values: { currVal: curVal, newNextVal: prevVal },
        details: 'Reverses arrow direction.',
      },
    };

    // Step B: Advance pointers
    yield {
      type: 'step',
      codeLine: 12,
      indices: [stepIdx],
      pointers: {
        prev: stepIdx,
        curr: stepIdx < reversedNodes.length - 1 ? stepIdx + 1 : 'NULL',
        next: stepIdx + 2 < reversedNodes.length ? stepIdx + 2 : 'NULL',
      },
      dataState: {
        nodes: reversedNodes.map((n) => ({ ...n })),
        listType: 'singly',
        pointers: {
          prev: stepIdx,
          curr: stepIdx < reversedNodes.length - 1 ? stepIdx + 1 : 'NULL',
          next: stepIdx + 2 < reversedNodes.length ? stepIdx + 2 : 'NULL',
        },
        activeOperation: 'Advance prev & curr',
        headIndex: 0,
        tailIndex: reversedNodes.length - 1,
      },
      message: `Advanced pointers: prev moves to Node(${curVal}), curr moves forward to ${nextVal}.`,
      reason: {
        action: 'prev = curr; curr = next',
        why: `Prepared pointers for next iteration: prev is now at Node(${curVal}), curr is at ${nextVal}.`,
        rule: 'prev = curr; curr = next',
        values: { newPrev: curVal, newCurr: nextVal },
      },
    };
  }

  // Final reversed display
  const finalReversed = [...reversedNodes].reverse();
  yield {
    type: 'complete',
    codeLine: 13,
    indices: [0, finalReversed.length - 1],
    pointers: { head: 0, tail: finalReversed.length - 1 },
    dataState: {
      nodes: finalReversed,
      listType: 'singly',
      pointers: { head: 0, tail: finalReversed.length - 1 },
      activeOperation: 'Reversal Finished',
      headIndex: 0,
      tailIndex: finalReversed.length - 1,
    },
    message: `Reversal Complete! New head is Node(${finalReversed[0].val}). Reversed order: 40 -> 30 -> 20 -> 10 -> NULL.`,
    reason: {
      action: 'head = prev',
      why: 'curr reached NULL, terminating loop. head updated to prev (Node 40). Entire list successfully reversed in O(n) time and O(1) space.',
      rule: 'return prev',
      values: { newHeadVal: finalReversed[0].val, totalNodes: finalReversed.length },
      details: 'Complete.',
    },
  };
}

/**
 * 2. Floyd's Cycle Detection (Tortoise and Hare) & Loop Removal
 */
export function* generateFloydCycleSteps(): Generator<StepAction<LinkedListDataState>, void, unknown> {
  // Nodes: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> loops back to 3 (index 2)
  const values = [1, 2, 3, 4, 5, 6, 7, 8];
  const cycleIndex = 2; // Node with value 3
  const nodes: LLNodeData[] = values.map((val, idx) => ({
    id: `node-${idx}`,
    val,
    nextId: idx < values.length - 1 ? `node-${idx + 1}` : `node-${cycleIndex}`,
  }));

  // Step 0: Initial setup
  yield {
    type: 'start',
    codeLine: 1,
    indices: [0],
    pointers: { slow: 0, fast: 0, head: 0 },
    dataState: {
      nodes: nodes.map((n) => ({ ...n })),
      listType: 'cycle',
      pointers: { slow: 0, fast: 0, head: 0 },
      cycleIndex,
      activeOperation: 'Init Floyd Cycle Detection',
      headIndex: 0,
    },
    message: `Floyd's Tortoise & Hare initialized at head Node [0] (val=1). List contains a directed cycle from tail (val=8) back to Node [2] (val=3).`,
    reason: {
      action: 'slow = head, fast = head',
      why: 'Both pointers start at head. Slow advances 1 node per turn; fast advances 2 nodes per turn.',
      rule: 'slow = head; fast = head',
      values: { slowPos: 0, fastPos: 0, cycleTarget: `Node [${cycleIndex}] (val=${nodes[cycleIndex].val})` },
      details: 'Relative speed of 1 guarantees they will collide inside the cycle without an infinite loop.',
    },
  };

  // Phase 1: Advance until slow and fast meet
  let slow = 0;
  let fast = 0;
  const nextPos = (curr: number) => (curr === nodes.length - 1 ? cycleIndex : curr + 1);

  let stepNumber = 1;
  let met = false;

  while (!met) {
    // 1. Advance slow
    slow = nextPos(slow);
    yield {
      type: 'step',
      codeLine: 2,
      indices: [slow, fast],
      pointers: { slow, fast, head: 0 },
      dataState: {
        nodes: nodes.map((n) => ({ ...n })),
        listType: 'cycle',
        pointers: { slow, fast, head: 0 },
        cycleIndex,
        activeOperation: `Turn ${stepNumber}: Advance Slow (Speed 1)`,
        headIndex: 0,
      },
      message: `Turn ${stepNumber}: Slow pointer advanced 1 step to Node [${slow}] (val=${nodes[slow].val}). Fast is at Node [${fast}] (val=${nodes[fast].val}).`,
      reason: {
        action: `slow = slow->next (val=${nodes[slow].val})`,
        why: 'Tortoise moves forward by 1 node each turn.',
        rule: 'slow = slow->next',
        values: { slow: nodes[slow].val, fast: nodes[fast].val },
      },
    };

    // 2. Advance fast 2 steps
    const fastMid = nextPos(fast);
    fast = nextPos(fastMid);
    met = slow === fast;

    yield {
      type: met ? 'found' : 'step',
      codeLine: 3,
      indices: met ? [slow] : [slow, fast],
      pointers: { slow, fast, head: 0 },
      dataState: {
        nodes: nodes.map((n) => ({ ...n })),
        listType: 'cycle',
        pointers: { slow, fast, head: 0 },
        cycleIndex,
        activeOperation: met ? 'COLLISION DETECTED!' : `Turn ${stepNumber}: Advance Fast (Speed 2)`,
        headIndex: 0,
      },
      message: met
        ? `COLLISION DETECTED! Both slow and fast met at Node [${slow}] (val=${nodes[slow].val})! Cycle confirmed.`
        : `Turn ${stepNumber}: Fast pointer advanced 2 steps to Node [${fast}] (val=${nodes[fast].val}). Distance delta shrinking.`,
      reason: {
        action: met ? `slow == fast at Node [${slow}]` : `fast = fast->next->next (val=${nodes[fast].val})`,
        why: met
          ? `Slow and Fast occupy the same node [${slow}] (val=${nodes[slow].val}). Mathematical proof confirms a cycle exists.`
          : 'Hare moves forward 2 nodes per turn.',
        rule: met ? 'slow == fast => cycle detected' : 'fast = fast->next->next',
        values: { slow: nodes[slow].val, fast: nodes[fast].val, met },
      },
    };

    stepNumber++;
  }

  // Phase 2: Find Cycle Start Node
  let ptr1 = 0; // from head
  let ptr2 = slow; // from meeting point

  yield {
    type: 'pointer',
    codeLine: 4,
    indices: [ptr1, ptr2],
    pointers: { ptrHead: ptr1, ptrMeet: ptr2, cycleStart: null },
    dataState: {
      nodes: nodes.map((n) => ({ ...n })),
      listType: 'cycle',
      pointers: { ptrHead: ptr1, ptrMeet: ptr2 },
      cycleIndex,
      activeOperation: 'Find Cycle Entrance Node',
      headIndex: 0,
    },
    message: `Phase 2: Finding cycle start. Reset ptr1 to head Node [0] (val=1); keep ptr2 at meeting point Node [${ptr2}] (val=${nodes[ptr2].val}). Both move 1 step at a time.`,
    reason: {
      action: 'ptr1 = head; ptr2 = meetingPoint',
      why: 'Mathematical proof: distance(head, entrance) == distance(meetingPoint, entrance) along the cycle.',
      rule: 'ptr1 = head; ptr2 = meet',
      values: { ptr1Val: nodes[ptr1].val, ptr2Val: nodes[ptr2].val },
      details: 'They are guaranteed to meet precisely at the cycle entrance.',
    },
  };

  while (ptr1 !== ptr2) {
    ptr1 = nextPos(ptr1);
    ptr2 = nextPos(ptr2);

    const isEntrance = ptr1 === ptr2;
    yield {
      type: isEntrance ? 'found' : 'step',
      codeLine: 5,
      indices: [ptr1, ptr2],
      pointers: { ptr1, ptr2, cycleStart: isEntrance ? ptr1 : null },
      dataState: {
        nodes: nodes.map((n) => ({ ...n })),
        listType: 'cycle',
        pointers: { ptr1, ptr2 },
        cycleIndex,
        activeOperation: isEntrance ? `Cycle Entrance Found at Node [${ptr1}]` : 'Advancing ptr1 & ptr2',
        headIndex: 0,
      },
      message: isEntrance
        ? `CYCLE ENTRANCE FOUND! Both pointers met at Node [${ptr1}] (val=${nodes[ptr1].val}). This is the exact start of the loop!`
        : `Advancing: ptr1 at Node [${ptr1}] (val=${nodes[ptr1].val}); ptr2 at Node [${ptr2}] (val=${nodes[ptr2].val}).`,
      reason: {
        action: isEntrance ? `Found Cycle Entrance: Node [${ptr1}]` : 'Advance both 1 step',
        why: isEntrance
          ? `Pointers met at Node [${ptr1}] (val=${nodes[ptr1].val}). Loop entry node identified.`
          : 'Both pointers advance at unit speed.',
        rule: isEntrance ? 'ptr1 == ptr2 => return cycleStart' : 'ptr1 = ptr1->next; ptr2 = ptr2->next',
        values: { entranceIndex: ptr1, val: nodes[ptr1].val },
      },
    };
  }

  // Phase 3: Loop Removal
  let tailPtr = ptr1;
  while (nextPos(tailPtr) !== ptr1) {
    tailPtr = nextPos(tailPtr);
    yield {
      type: 'step',
      codeLine: 6,
      indices: [tailPtr],
      pointers: { tailSearch: tailPtr },
      dataState: {
        nodes: nodes.map((n) => ({ ...n })),
        listType: 'cycle',
        pointers: { tailSearch: tailPtr },
        cycleIndex,
        activeOperation: `Finding Cycle Tail: at Node [${tailPtr}] (val=${nodes[tailPtr].val})`,
        headIndex: 0,
      },
      message: `Loop Removal: Traversing cycle to find the tail node pointing back to entrance. Currently at Node [${tailPtr}] (val=${nodes[tailPtr].val}).`,
      reason: {
        action: `Inspect Node [${tailPtr}]`,
        why: `Looking for node where next == cycleEntrance (val=${nodes[ptr1].val}).`,
        rule: 'while (tail->next != entrance) tail = tail->next',
        values: { currentTailCheck: nodes[tailPtr].val, nextVal: nodes[nextPos(tailPtr)].val },
      },
    };
  }

  yield {
    type: 'delete',
    codeLine: 6,
    indices: [tailPtr, ptr1],
    pointers: { tail: tailPtr, cycleEntrance: ptr1 },
    dataState: {
      nodes: nodes.map((n) => ({ ...n })),
      listType: 'cycle',
      pointers: { tail: tailPtr, cycleEntrance: ptr1 },
      cycleIndex,
      activeOperation: `Break Cycle: Node(${nodes[tailPtr].val})->next = NULL`,
      headIndex: 0,
    },
    message: `Loop Removal: Found cycle tail Node [${tailPtr}] (val=${nodes[tailPtr].val}) pointing to cycle start Node [${ptr1}]. Breaking link!`,
    reason: {
      action: `tail->next = NULL at Node [${tailPtr}]`,
      why: `Setting Node(${nodes[tailPtr].val})->next to NULL severs the circular link, converting the list into a clean acyclic singly linked list.`,
      rule: 'tail->next = null',
      values: { tailVal: nodes[tailPtr].val, loopTargetVal: nodes[ptr1].val },
      details: 'Restores list integrity without losing any nodes.',
    },
  };

  // Create clean acyclic list
  const cleanNodes: LLNodeData[] = nodes.map((n, idx) => ({
    ...n,
    nextId: idx < nodes.length - 1 ? `node-${idx + 1}` : null,
  }));

  yield {
    type: 'complete',
    codeLine: 7,
    indices: [0, cleanNodes.length - 1],
    pointers: { head: 0, tail: cleanNodes.length - 1 },
    dataState: {
      nodes: cleanNodes,
      listType: 'singly',
      pointers: { head: 0, tail: cleanNodes.length - 1 },
      cycleIndex: null,
      activeOperation: 'Cycle Removed: Clean Acyclic List',
      headIndex: 0,
      tailIndex: cleanNodes.length - 1,
    },
    message: `Floyd Cycle Detection & Removal Complete! Cycle detected, entrance found at Node (3), and severed. Clean list: 1 -> 2 -> ... -> 8 -> NULL.`,
    reason: {
      action: 'Acyclic List Restored',
      why: 'Full cycle detected, located, and dismantled in linear O(n) time and O(1) auxiliary space.',
      rule: 'return head',
      values: { totalNodes: cleanNodes.length, cycleSevered: true },
    },
  };
}

/**
 * 3. Doubly and Circular Linked Lists: Both prev & next animated
 * Builds live from empty board, node by node with bidirectional pointers. >= 20 steps!
 */
export function* generateDoublyCircularSteps(
  listType: 'doubly' | 'circular' = 'doubly'
): Generator<StepAction<LinkedListDataState>, void, unknown> {
  const insertVals = [10, 20, 30, 40, 50, 60];
  const liveNodes: LLNodeData[] = [];

  // Step 0: Empty Board
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { head: null, tail: null },
    dataState: {
      nodes: [],
      listType,
      pointers: { head: null, tail: null },
      activeOperation: `Init Empty ${listType === 'circular' ? 'Circular Doubly' : 'Doubly'} Linked List`,
      headIndex: null,
      tailIndex: null,
    },
    message: `${listType === 'circular' ? 'Circular Doubly' : 'Doubly'} Linked List initialized EMPTY. Board starts completely blank (head = null, tail = null).`,
    reason: {
      action: `Init Empty ${listType} list`,
      why: 'Starting from null. Each node will be dynamically allocated with prev and next pointers.',
      rule: 'head = null; tail = null;',
      values: { listType, initialNodes: 0 },
      details: 'Bidirectional links allow O(1) insertion and traversal in both directions.',
    },
  };

  // Build live node by node
  for (let i = 0; i < insertVals.length; i++) {
    const val = insertVals[i];
    const newNodeId = `dnode-${i}`;

    // Allocate node
    const newNode: LLNodeData = {
      id: newNodeId,
      val,
      prevId: i > 0 ? liveNodes[i - 1].id : null,
      nextId: null,
    };

    if (i > 0) {
      liveNodes[i - 1].nextId = newNodeId;
    }

    liveNodes.push(newNode);

    yield {
      type: 'insert',
      codeLine: 2,
      indices: [i],
      pointers: { head: 0, tail: i, curr: i },
      dataState: {
        nodes: liveNodes.map((n) => ({ ...n })),
        listType: 'doubly',
        pointers: { head: 0, tail: i, curr: i },
        activeOperation: `Append Node [${i}] (val=${val})`,
        headIndex: 0,
        tailIndex: i,
      },
      message: `Append #${i + 1}: Created Node [${i}] (val=${val}). Linked previous tail Node [${i - 1 > 0 ? i - 1 : 0}] <-> new Node. Tail updated to ${val}.`,
      reason: {
        action: `Append ${val}`,
        why: i === 0
          ? 'First node becomes both head and tail of the list.'
          : `Tail->next = new Node; new Node->prev = tail; tail = new Node.`,
        rule: 'tail->next = node; node->prev = tail; tail = node;',
        values: { val, nodeIndex: i, prevVal: i > 0 ? insertVals[i - 1] : null },
      },
    };
  }

  // If circular, connect circular wrap-around links
  if (listType === 'circular') {
    const headNode = liveNodes[0];
    const tailNode = liveNodes[liveNodes.length - 1];

    tailNode.nextId = headNode.id;
    headNode.prevId = tailNode.id;

    yield {
      type: 'step',
      codeLine: 3,
      indices: [0, liveNodes.length - 1],
      pointers: { head: 0, tail: liveNodes.length - 1 },
      dataState: {
        nodes: liveNodes.map((n) => ({ ...n })),
        listType: 'circular',
        pointers: { head: 0, tail: liveNodes.length - 1 },
        activeOperation: 'Form Circular Links: Tail->next = Head, Head->prev = Tail',
        headIndex: 0,
        tailIndex: liveNodes.length - 1,
      },
      message: `Formed Circular Doubly Links! tail (${tailNode.val})->next points to head (${headNode.val}); head (${headNode.val})->prev points to tail (${tailNode.val})!`,
      reason: {
        action: 'Close Circular Ring',
        why: 'In a circular doubly linked list, neither head->prev nor tail->next is null. They form a seamless closed loop.',
        rule: 'tail->next = head; head->prev = tail;',
        values: { headVal: headNode.val, tailVal: tailNode.val },
        details: 'Allows endless bidirectional navigation without null pointer checks.',
      },
    };
  } else {
    yield {
      type: 'step',
      codeLine: 3,
      indices: [0, liveNodes.length - 1],
      pointers: { head: 0, tail: liveNodes.length - 1 },
      dataState: {
        nodes: liveNodes.map((n) => ({ ...n })),
        listType,
        pointers: { head: 0, tail: liveNodes.length - 1 },
        activeOperation: 'Verify Bidirectional Links & Boundary Ends',
        headIndex: 0,
        tailIndex: liveNodes.length - 1,
      },
      message: `Verified all bidirectional pointers! head (val=10)->prev is NULL; tail (val=60)->next is NULL. Ready for bidirectional traversals.`,
      reason: {
        action: 'Validate Doubly Linked Chain',
        why: 'Head and tail boundary pointers properly terminated with NULL.',
        rule: 'head->prev == NULL && tail->next == NULL',
        values: { headVal: liveNodes[0].val, tailVal: liveNodes[liveNodes.length - 1].val, count: liveNodes.length },
      },
    };
  }

  // Forward Traversal through all nodes
  for (let f = 0; f < liveNodes.length; f++) {
    yield {
      type: 'visit',
      codeLine: 4,
      indices: [f],
      pointers: { curr: f, head: 0, tail: liveNodes.length - 1 },
      dataState: {
        nodes: liveNodes.map((n) => ({ ...n })),
        listType,
        pointers: { curr: f, head: 0, tail: liveNodes.length - 1 },
        activeOperation: `Forward Traversal: Node [${f}] (val=${liveNodes[f].val})`,
        headIndex: 0,
        tailIndex: liveNodes.length - 1,
      },
      message: `Forward Traversal: Visiting Node [${f}] (val=${liveNodes[f].val}) using NEXT -> pointer.`,
      reason: {
        action: `curr = curr->next (val=${liveNodes[f].val})`,
        why: `Following next pointer forward.`,
        rule: 'curr = curr->next',
        values: { index: f, val: liveNodes[f].val },
      },
    };
  }

  // Backward Traversal through all nodes using PREV pointers
  for (let b = liveNodes.length - 1; b >= 0; b--) {
    yield {
      type: 'visit',
      codeLine: 5,
      indices: [b],
      pointers: { curr: b, head: 0, tail: liveNodes.length - 1 },
      dataState: {
        nodes: liveNodes.map((n) => ({ ...n })),
        listType,
        pointers: { curr: b, head: 0, tail: liveNodes.length - 1 },
        activeOperation: `Backward Traversal: Node [${b}] (val=${liveNodes[b].val})`,
        headIndex: 0,
        tailIndex: liveNodes.length - 1,
      },
      message: `Backward Traversal: Visiting Node [${b}] (val=${liveNodes[b].val}) using PREV <- pointer.`,
      reason: {
        action: `curr = curr->prev (val=${liveNodes[b].val})`,
        why: `Doubly linked structure enables immediate backwards movement without stack or recursion.`,
        rule: 'curr = curr->prev',
        values: { index: b, val: liveNodes[b].val },
      },
    };
  }

  // Final verification & summary
  yield {
    type: 'complete',
    codeLine: 6,
    indices: [0, liveNodes.length - 1],
    pointers: { head: 0, tail: liveNodes.length - 1 },
    dataState: {
      nodes: liveNodes.map((n) => ({ ...n })),
      listType,
      pointers: { head: 0, tail: liveNodes.length - 1 },
      activeOperation: `${listType === 'circular' ? 'Circular' : 'Doubly'} List Demonstration Complete`,
      headIndex: 0,
      tailIndex: liveNodes.length - 1,
    },
    message: `${listType === 'circular' ? 'Circular Doubly' : 'Doubly'} Linked List verified! Built from empty, bidirectionally linked, and navigated.`,
    reason: {
      action: 'Doubly/Circular Complete',
      why: 'All operations demonstrated in O(1) pointer updates.',
      rule: 'O(1) insertion/deletion at endpoints, O(n) traversal',
      values: { totalNodes: liveNodes.length, listType },
    },
  };
}
