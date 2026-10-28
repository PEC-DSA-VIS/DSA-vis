import { StepAction } from '../types';

export interface StackQueueDataState {
  structure: 'stack' | 'queue' | 'circular-queue' | 'deque' | 'priority-queue';
  items: (string | number)[];
  topIndex?: number | null;
  frontIndex?: number | null;
  rearIndex?: number | null;
  capacity: number;
  auxiliaryHistory?: (string | number)[] | null;
  errorState?: 'overflow' | 'underflow' | 'syntax-error' | null;
  activeCharIndex?: number | null;
  inputString?: string | null;
  dequeMode?: 'front' | 'rear' | null;
  priorityList?: { item: string | number; priority: number }[];
  runningMetric?: string;
}

/**
 * 1. Stack: Push, Pop, Peek, Top pointer, Overflow & Underflow handling
 */
export function* generateStackSteps(): Generator<StepAction<StackQueueDataState>, void, unknown> {
  const capacity = 5;
  const stack: (string | number)[] = [];

  // Start with completely EMPTY stack
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { top: -1 },
    dataState: {
      structure: 'stack',
      items: [],
      topIndex: -1,
      capacity,
      runningMetric: 'Stack is EMPTY (top = -1)',
    },
    message: `Stack initialized with capacity ${capacity}. Top pointer at -1 (EMPTY).`,
    reason: {
      action: 'Initialize Stack',
      why: 'LIFO (Last-In-First-Out) container starts completely empty with topIndex pointing to -1.',
      rule: 'top = -1',
      values: { size: 0, capacity, top: -1 },
      details: 'Stack elements will be stacked vertically on top of each other.',
    },
  };

  // Push operations
  const pushValues = [15, 25, 35, 45, 55];
  for (let i = 0; i < pushValues.length; i++) {
    const val = pushValues[i];
    stack.push(val);
    const newTop = stack.length - 1;

    yield {
      type: 'push',
      codeLine: 2,
      indices: [newTop],
      pointers: { top: newTop },
      dataState: {
        structure: 'stack',
        items: [...stack],
        topIndex: newTop,
        capacity,
        runningMetric: `Pushed ${val} (Size: ${stack.length}/${capacity})`,
      },
      message: `PUSH(${val}): Incremented top to [${newTop}]. Inserted ${val} at the top of the stack.`,
      reason: {
        action: `push(${val}) -> index [${newTop}]`,
        why: `Capacity check passed (${stack.length} <= ${capacity}). top incremented from ${newTop - 1} to ${newTop}.`,
        rule: 'if top < capacity - 1: stack[++top] = val',
        values: { pushedValue: val, newTopIndex: newTop, currentSize: stack.length, capacity },
        details: 'O(1) constant time push operation.',
      },
    };
  }

  // OVERFLOW Attempt: Try to push when full
  yield {
    type: 'step',
    codeLine: 3,
    indices: [stack.length - 1],
    pointers: { top: stack.length - 1 },
    dataState: {
      structure: 'stack',
      items: [...stack],
      topIndex: stack.length - 1,
      capacity,
      errorState: 'overflow',
      runningMetric: 'STACK OVERFLOW BLOCKED! (Size == Capacity)',
    },
    message: `PUSH ATTEMPT BLOCKED: STACK OVERFLOW! Stack is full (${stack.length}/${capacity}). Cannot push new element 65 without exceeding fixed capacity.`,
    reason: {
      action: 'Stack Overflow Guard Triggered',
      why: `top is at [${stack.length - 1}], which equals capacity - 1. Pushing would cause memory boundary violation.`,
      rule: 'if top == capacity - 1 => THROW STACK_OVERFLOW',
      values: { currentTop: stack.length - 1, capacity, attemptedValue: 65 },
      details: 'Critical boundary check preventing buffer overflow attacks in low-level memory.',
    },
  };

  // PEEK Operation: Look at top without removing
  const peekVal = stack[stack.length - 1];
  yield {
    type: 'step',
    codeLine: 4,
    indices: [stack.length - 1],
    pointers: { top: stack.length - 1 },
    dataState: {
      structure: 'stack',
      items: [...stack],
      topIndex: stack.length - 1,
      capacity,
      runningMetric: `PEEK: Top element is ${peekVal}`,
    },
    message: `PEEK(): Inspecting top element without removing it. Value is ${peekVal} at index [${stack.length - 1}].`,
    reason: {
      action: `peek() => ${peekVal}`,
      why: `Returns value at top of stack (${peekVal}) without altering top pointer.`,
      rule: 'return stack[top]',
      values: { topIndex: stack.length - 1, topValue: peekVal },
      details: 'O(1) non-destructive read.',
    },
  };

  // POP Operations
  while (stack.length > 0) {
    const poppedVal = stack.pop();
    const curTop = stack.length - 1;

    yield {
      type: 'pop',
      codeLine: 5,
      indices: curTop >= 0 ? [curTop] : [],
      pointers: { top: curTop },
      dataState: {
        structure: 'stack',
        items: [...stack],
        topIndex: curTop,
        capacity,
        runningMetric: `Popped ${poppedVal} (Remaining: ${stack.length})`,
      },
      message: `POP(): Removed ${poppedVal} from top. Top pointer decremented to [${curTop >= 0 ? curTop : 'EMPTY (-1)'}].`,
      reason: {
        action: `pop() => ${poppedVal}`,
        why: `Removed top item (${poppedVal}) according to LIFO order. Next available item is now at index [${curTop}].`,
        rule: 'val = stack[top--]',
        values: { poppedValue: poppedVal, newTopIndex: curTop, remainingSize: stack.length },
        details: 'O(1) constant time pop operation.',
      },
    };
  }

  // UNDERFLOW Attempt: Pop on empty stack
  yield {
    type: 'step',
    codeLine: 6,
    indices: [],
    pointers: { top: -1 },
    dataState: {
      structure: 'stack',
      items: [],
      topIndex: -1,
      capacity,
      errorState: 'underflow',
      runningMetric: 'STACK UNDERFLOW BLOCKED! (Empty Stack)',
    },
    message: 'POP ATTEMPT BLOCKED: STACK UNDERFLOW! The stack is empty (top = -1). Cannot pop from an empty container.',
    reason: {
      action: 'Stack Underflow Guard Triggered',
      why: 'Attempted to remove an element when stack size is 0. Accessing index -1 is illegal.',
      rule: 'if top == -1 => THROW STACK_UNDERFLOW',
      values: { top: -1, size: 0 },
      details: 'Safety guard preventing invalid memory reads.',
    },
  };

  // Complete
  yield {
    type: 'complete',
    codeLine: 7,
    indices: [],
    pointers: { top: -1 },
    dataState: {
      structure: 'stack',
      items: [],
      topIndex: -1,
      capacity,
      runningMetric: 'Stack Lifecycle Verification Complete',
    },
    message: 'Stack operations demo complete: Push, Overflow guard, Peek, Pop, and Underflow guard all verified successfully!',
    reason: {
      action: 'Stack Verification Done',
      why: 'All fundamental LIFO operations and edge constraints executed in O(1) time per operation.',
      rule: 'LIFO Verified',
      values: { totalOperations: 8 },
    },
  };
}

/**
 * 2. Parentheses / Syntax Validator: character-by-character processing with Stack
 */
export function* generateParenthesesSteps(
  customExpression?: string
): Generator<StepAction<StackQueueDataState>, void, unknown> {
  const expr = customExpression || '{[()()]}';
  const stack: string[] = [];
  const matchingMap: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const openingSet = new Set(['(', '[', '{']);

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { top: -1 },
    dataState: {
      structure: 'stack',
      items: [],
      topIndex: -1,
      capacity: expr.length,
      inputString: expr,
      activeCharIndex: null,
      runningMetric: `Evaluating Expression: "${expr}"`,
    },
    message: `Parentheses Validator initialized for expression "${expr}". Empty stack ready to track opening brackets.`,
    reason: {
      action: 'Init Validator',
      why: 'Parentheses matching requires LIFO stack so that the most recently opened bracket is closed first.',
      rule: 'stack = empty',
      values: { expression: expr, length: expr.length },
    },
  };

  let isValid = true;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];

    if (openingSet.has(ch)) {
      stack.push(ch);
      const topIdx = stack.length - 1;

      yield {
        type: 'push',
        codeLine: 2,
        indices: [topIdx],
        pointers: { top: topIdx },
        dataState: {
          structure: 'stack',
          items: [...stack],
          topIndex: topIdx,
          capacity: expr.length,
          inputString: expr,
          activeCharIndex: i,
          runningMetric: `Scanned '${ch}' [${i}] -> PUSHED to Stack`,
        },
        message: `Char [${i}] = '${ch}': Opening bracket encountered. PUSHED '${ch}' onto stack. Stack depth is now ${stack.length}.`,
        reason: {
          action: `Push Opening Bracket '${ch}'`,
          why: `Encountered opening bracket '${ch}'. Pushing to stack to await its matching closer.`,
          rule: 'if ch in ["(", "[", "{"]: stack.push(ch)',
          values: { char: ch, index: i, stackDepth: stack.length },
          details: 'Opening brackets wait on stack until corresponding closing bracket arrives.',
        },
      };
    } else if (ch in matchingMap) {
      const expectedOpener = matchingMap[ch];
      const topOpener = stack.length > 0 ? stack[stack.length - 1] : null;

      if (topOpener === expectedOpener) {
        stack.pop();
        const newTop = stack.length - 1;

        yield {
          type: 'pop',
          codeLine: 3,
          indices: newTop >= 0 ? [newTop] : [],
          pointers: { top: newTop },
          dataState: {
            structure: 'stack',
            items: [...stack],
            topIndex: newTop,
            capacity: expr.length,
            inputString: expr,
            activeCharIndex: i,
            runningMetric: `Matched '${expectedOpener}' with '${ch}' -> POPPED!`,
          },
          message: `Char [${i}] = '${ch}': MATCH FOUND! Closing '${ch}' matches top opening '${expectedOpener}'. POPPED from stack!`,
          reason: {
            action: `Match: '${expectedOpener}' <-> '${ch}'`,
            why: `Top bracket '${expectedOpener}' perfectly matches incoming '${ch}'. Valid pair closed.`,
            rule: 'if stack.top() == matching[ch]: stack.pop()',
            values: { closer: ch, matchedOpener: expectedOpener, remainingDepth: stack.length },
            details: 'Subexpression closed cleanly.',
          },
        };
      } else {
        isValid = false;
        yield {
          type: 'step',
          codeLine: 4,
          indices: stack.length > 0 ? [stack.length - 1] : [],
          pointers: { top: stack.length - 1 },
          dataState: {
            structure: 'stack',
            items: [...stack],
            topIndex: stack.length - 1,
            capacity: expr.length,
            inputString: expr,
            activeCharIndex: i,
            errorState: 'syntax-error',
            runningMetric: `SYNTAX ERROR: '${ch}' does not match '${topOpener ?? 'EMPTY'}'`,
          },
          message: `SYNTAX ERROR at char [${i}] '${ch}': Expected matching opener '${expectedOpener}', but found '${topOpener ?? 'EMPTY STACK'}'. Expression is INVALID!`,
          reason: {
            action: 'Mismatched Parentheses Error',
            why: `Mismatched brackets: incoming closer '${ch}' requires '${expectedOpener}', but top of stack was '${topOpener ?? 'EMPTY'}'.`,
            rule: 'stack.top() != matching[ch] => return false',
            values: { char: ch, index: i, topBracket: topOpener, expected: expectedOpener },
            details: 'Syntax validation failed.',
          },
        };
        return;
      }
    }
  }

  const fullyBalanced = isValid && stack.length === 0;
  yield {
    type: fullyBalanced ? 'found' : 'step',
    codeLine: 5,
    indices: [],
    pointers: { top: stack.length - 1 },
    dataState: {
      structure: 'stack',
      items: [...stack],
      topIndex: stack.length - 1,
      capacity: expr.length,
      inputString: expr,
      activeCharIndex: null,
      errorState: fullyBalanced ? null : 'syntax-error',
      runningMetric: fullyBalanced ? 'ALL BRACKETS BALANCED!' : 'UNBALANCED: Leftover brackets on stack',
    },
    message: fullyBalanced
      ? `EXPRESSION IS VALID! All brackets in "${expr}" were matched and closed. Stack is empty.`
      : `EXPRESSION IS INVALID: Leftover unmatched opening brackets remain on the stack: [${stack.join(', ')}].`,
    reason: {
      action: fullyBalanced ? 'Validation Passed' : 'Validation Failed',
      why: fullyBalanced
        ? 'All pairs matched symmetrically in correct nesting order. Final stack is completely empty.'
        : `Stack contains ${stack.length} opening bracket(s) that were never closed.`,
      rule: 'return stack.isEmpty()',
      values: { expression: expr, balanced: fullyBalanced, remainingStack: stack },
    },
  };
}

/**
 * 3. Circular Queue & Deque: Front/Rear pointer wrap-around modulo capacity, Full/Empty conditions
 */
export function* generateQueueSteps(): Generator<StepAction<StackQueueDataState>, void, unknown> {
  const capacity = 5;
  // Circular buffer array of size 5
  const buffer: (number | null)[] = new Array(capacity).fill(null);
  let front = -1;
  let rear = -1;
  let count = 0;

  // Step 1: Initial empty circular queue
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { front: -1, rear: -1 },
    dataState: {
      structure: 'circular-queue',
      items: buffer.map((v) => (v !== null ? v : '-')),
      frontIndex: -1,
      rearIndex: -1,
      capacity,
      runningMetric: 'Circular Queue EMPTY (count = 0, front = -1, rear = -1)',
    },
    message: `Circular Queue initialized: Capacity = ${capacity} slots. front = -1, rear = -1 (EMPTY).`,
    reason: {
      action: 'Init Circular Queue',
      why: 'Ring buffer utilizes modulo arithmetic (idx = (idx + 1) % capacity) to reuse deallocated slots.',
      rule: 'front = -1, rear = -1, count = 0',
      values: { capacity, count: 0 },
      details: 'Prevents false full conditions of linear queues.',
    },
  };

  // Helper to enqueue
  const ops = [
    { action: 'enqueue', val: 10 },
    { action: 'enqueue', val: 20 },
    { action: 'enqueue', val: 30 },
    { action: 'dequeue' },
    { action: 'dequeue' },
    { action: 'enqueue', val: 40 },
    { action: 'enqueue', val: 50 },
    { action: 'enqueue', val: 60 }, // Will WRAP AROUND to index 0!
    { action: 'enqueue', val: 70 }, // Will occupy index 1!
  ];

  for (const op of ops) {
    if (op.action === 'enqueue' && op.val !== undefined) {
      const isFull = count === capacity;
      if (isFull) {
        yield {
          type: 'step',
          codeLine: 2,
          indices: [rear],
          pointers: { front, rear },
          dataState: {
            structure: 'circular-queue',
            items: buffer.map((v) => (v !== null ? v : '-')),
            frontIndex: front,
            rearIndex: rear,
            capacity,
            errorState: 'overflow',
            runningMetric: `QUEUE FULL! Cannot enqueue ${op.val}`,
          },
          message: `QUEUE FULL! count (${count}) == capacity (${capacity}). Cannot enqueue ${op.val}.`,
          reason: {
            action: 'Queue Overflow Guard',
            why: 'All slots in circular buffer occupied. (rear + 1) % capacity == front.',
            rule: '(rear + 1) % capacity == front',
            values: { count, capacity, front, rear },
          },
        };
        continue;
      }

      if (front === -1) {
        front = 0;
        rear = 0;
      } else {
        rear = (rear + 1) % capacity;
      }
      buffer[rear] = op.val;
      count++;

      const isWrapped = rear < front;
      yield {
        type: 'enqueue',
        codeLine: 3,
        indices: [rear],
        pointers: { front, rear },
        dataState: {
          structure: 'circular-queue',
          items: buffer.map((v) => (v !== null ? v : '-')),
          frontIndex: front,
          rearIndex: rear,
          capacity,
          runningMetric: `ENQUEUED ${op.val} at [${rear}] ${isWrapped ? '(WRAPPED AROUND!)' : ''}`,
        },
        message: `ENQUEUE(${op.val}): Placed at slot [${rear}]. ${
          isWrapped ? `REAR WRAPPED AROUND to beginning of array! ` : ''
        }front = ${front}, rear = ${rear}, count = ${count}/${capacity}.`,
        reason: {
          action: `enqueue(${op.val}) -> slot [${rear}]`,
          why: `rear moved to (${rear === 0 ? capacity - 1 : rear - 1} + 1) % ${capacity} = ${rear}. Slot populated with ${op.val}.`,
          rule: 'rear = (rear + 1) % capacity',
          values: { enqueued: op.val, rear, front, count, capacity, wrapped: isWrapped },
          details: 'Demonstrates ring buffer slot recycling.',
        },
      };
    } else if (op.action === 'dequeue') {
      const isEmpty = count === 0;
      if (isEmpty) {
        yield {
          type: 'step',
          codeLine: 4,
          indices: [],
          pointers: { front, rear },
          dataState: {
            structure: 'circular-queue',
            items: buffer.map((v) => (v !== null ? v : '-')),
            frontIndex: front,
            rearIndex: rear,
            capacity,
            errorState: 'underflow',
            runningMetric: 'QUEUE EMPTY! Cannot dequeue',
          },
          message: 'QUEUE UNDERFLOW! Circular queue is empty.',
          reason: {
            action: 'Queue Underflow Guard',
            why: 'Cannot dequeue from an empty queue.',
            rule: 'count == 0',
            values: { count: 0 },
          },
        };
        continue;
      }

      const dequeuedVal = buffer[front];
      buffer[front] = null;
      const oldFront = front;

      if (front === rear) {
        front = -1;
        rear = -1;
      } else {
        front = (front + 1) % capacity;
      }
      count--;

      yield {
        type: 'dequeue',
        codeLine: 5,
        indices: [oldFront],
        pointers: { front, rear },
        dataState: {
          structure: 'circular-queue',
          items: buffer.map((v) => (v !== null ? v : '-')),
          frontIndex: front,
          rearIndex: rear,
          capacity,
          runningMetric: `DEQUEUED ${dequeuedVal} from [${oldFront}]`,
        },
        message: `DEQUEUE(): Removed ${dequeuedVal} from slot [${oldFront}]. front advanced to [${front}]. Slot [${oldFront}] is now freed for reuse!`,
        reason: {
          action: `dequeue() => ${dequeuedVal}`,
          why: `FIFO element removed from front. front updated to (${oldFront} + 1) % ${capacity} = ${front}.`,
          rule: 'front = (front + 1) % capacity',
          values: { dequeued: dequeuedVal, freedSlot: oldFront, newFront: front, count },
          details: 'Freed slot becomes available for future wrapped enqueues.',
        },
      };
    }
  }

  // Complete
  yield {
    type: 'complete',
    codeLine: 6,
    indices: [],
    pointers: { front, rear },
    dataState: {
      structure: 'circular-queue',
      items: buffer.map((v) => (v !== null ? v : '-')),
      frontIndex: front,
      rearIndex: rear,
      capacity,
      runningMetric: 'Circular Queue Wrap-Around Verified',
    },
    message: `Circular Queue demo complete! Demonstrated slot recycling, pointer wrap-around, and O(1) FIFO scheduling.`,
    reason: {
      action: 'Circular Queue Verified',
      why: 'Ring buffer proved that rear wrapped from slot 4 back to slots 0 and 1 without shifting any elements.',
      rule: 'O(1) Enqueue and Dequeue',
      values: { finalCount: count, capacity },
    },
  };
}

/**
 * 4. Priority Queue: Heap-based priority extraction with Bubble-Up and Sift-Down
 */
export function* generatePriorityQueueSteps(): Generator<StepAction<StackQueueDataState>, void, unknown> {
  const pq: { item: string; priority: number }[] = [];

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { top: -1 },
    dataState: {
      structure: 'priority-queue',
      items: [],
      capacity: 8,
      priorityList: [],
      runningMetric: 'Priority Queue (Min-Heap) EMPTY',
    },
    message: 'Min-Priority Queue initialized EMPTY. Lower numeric score denotes higher urgency. Backed by a complete binary min-heap array.',
    reason: {
      action: 'Init Priority Queue',
      why: 'Binary min-heap maintains highest priority item at root [0] with O(log n) insertions and extractions.',
      rule: 'pq = []',
      values: { size: 0 },
    },
  };

  const tasks = [
    { item: 'Task-1 (Disk I/O)', priority: 35 },
    { item: 'Task-2 (Net Flush)', priority: 25 },
    { item: 'Task-3 (Render Frame)', priority: 40 },
    { item: 'Task-4 (User Input)', priority: 15 },
    { item: 'Task-5 (Mem Alloc)', priority: 10 },
    { item: 'Task-6 (Kernel Panic)', priority: 5 },
  ];

  for (const t of tasks) {
    pq.push(t);
    let child = pq.length - 1;

    yield {
      type: 'insert',
      codeLine: 2,
      indices: [child],
      pointers: { newElement: child },
      dataState: {
        structure: 'priority-queue',
        items: pq.map((x) => `${x.item} [p=${x.priority}]`),
        priorityList: [...pq],
        capacity: 8,
        runningMetric: `Inserted ${t.item} (Priority: ${t.priority})`,
      },
      message: `INSERT: Appended ${t.item} [priority ${t.priority}] at leaf index [${child}]. Starting Bubble-Up.`,
      reason: {
        action: `Insert [p=${t.priority}]`,
        why: 'New items are appended at the next available leaf position in complete binary tree.',
        rule: 'heap.push(item); bubbleUp(size - 1)',
        values: { item: t.item, priority: t.priority, index: child },
      },
    };

    // Bubble up
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      yield {
        type: 'compare',
        codeLine: 2,
        indices: [child, parent],
        pointers: { child, parent },
        dataState: {
          structure: 'priority-queue',
          items: pq.map((x) => `${x.item} [p=${x.priority}]`),
          priorityList: [...pq],
          capacity: 8,
          runningMetric: `Bubble-Up Compare: child [${child}] (p=${pq[child].priority}) vs parent [${parent}] (p=${pq[parent].priority})`,
        },
        message: `Bubble-Up: Comparing child [${child}] (p=${pq[child].priority}) with parent [${parent}] (p=${pq[parent].priority}).`,
        reason: {
          action: `Compare child ${pq[child].priority} vs parent ${pq[parent].priority}`,
          why: 'Min-heap requires parent priority <= child priority.',
          rule: 'child.priority < parent.priority => swap',
          values: { childPri: pq[child].priority, parentPri: pq[parent].priority },
        },
      };

      if (pq[child].priority < pq[parent].priority) {
        const temp = pq[child];
        pq[child] = pq[parent];
        pq[parent] = temp;

        yield {
          type: 'swap',
          codeLine: 3,
          indices: [child, parent],
          pointers: { child, parent },
          dataState: {
            structure: 'priority-queue',
            items: pq.map((x) => `${x.item} [p=${x.priority}]`),
            priorityList: [...pq],
            capacity: 8,
            runningMetric: `Bubble-Up Swap: [${child}] <-> [${parent}]`,
          },
          message: `BUBBLE-UP SWAP: Swapped child [${child}] and parent [${parent}]. Priority ${pq[parent].priority} moved up.`,
          reason: {
            action: `Swap [${child}] <-> [${parent}]`,
            why: `Child priority (${pq[parent].priority}) is more urgent than parent priority (${pq[child].priority}). Swapping preserves min-heap invariant.`,
            rule: 'swap(heap[child], heap[parent])',
            values: { childIdx: child, parentIdx: parent },
          },
        };

        child = parent;
      } else {
        break;
      }
    }
  }

  // Extract-Min Round 1
  const min1 = pq[0];
  yield {
    type: 'found',
    codeLine: 4,
    indices: [0],
    pointers: { root: 0 },
    dataState: {
      structure: 'priority-queue',
      items: pq.map((x) => `${x.item} [p=${x.priority}]`),
      priorityList: [...pq],
      capacity: 8,
      runningMetric: `PEEK EXTRACT-MIN: ${min1.item} (p=${min1.priority})`,
    },
    message: `EXTRACT-MIN #1: Highest urgency item is root ${min1.item} (priority ${min1.priority})!`,
    reason: {
      action: `Extract-Min => ${min1.item}`,
      why: 'Root [0] always contains minimum priority score in min-heap.',
      rule: 'return heap[0]',
      values: { task: min1.item, priority: min1.priority },
    },
  };

  // Replace root with last element and sift down
  const last1 = pq.pop()!;
  pq[0] = last1;

  yield {
    type: 'step',
    codeLine: 4,
    indices: [0],
    pointers: { root: 0 },
    dataState: {
      structure: 'priority-queue',
      items: pq.map((x) => `${x.item} [p=${x.priority}]`),
      priorityList: [...pq],
      capacity: 8,
      runningMetric: `Moved last element ${last1.item} to root [0] for Sift-Down`,
    },
    message: `Removed root. Moved last leaf ${last1.item} to root [0]. Starting Sift-Down to restore min-heap invariant.`,
    reason: {
      action: 'Replace Root with Last Leaf',
      why: 'Maintains complete binary tree structure before sifting down.',
      rule: 'heap[0] = heap.pop(); siftDown(0)',
      values: { movedItem: last1.item, priority: last1.priority },
    },
  };

  // Sift Down 1
  let curr = 0;
  while (true) {
    let smallest = curr;
    const leftChild = 2 * curr + 1;
    const rightChild = 2 * curr + 2;

    if (leftChild < pq.length && pq[leftChild].priority < pq[smallest].priority) {
      smallest = leftChild;
    }
    if (rightChild < pq.length && pq[rightChild].priority < pq[smallest].priority) {
      smallest = rightChild;
    }

    if (smallest !== curr) {
      const temp = pq[curr];
      pq[curr] = pq[smallest];
      pq[smallest] = temp;

      yield {
        type: 'swap',
        codeLine: 4,
        indices: [curr, smallest],
        pointers: { parent: curr, child: smallest },
        dataState: {
          structure: 'priority-queue',
          items: pq.map((x) => `${x.item} [p=${x.priority}]`),
          priorityList: [...pq],
          capacity: 8,
          runningMetric: `Sift-Down: Swapped parent [${curr}] with smaller child [${smallest}]`,
        },
        message: `SIFT-DOWN SWAP: Swapped parent [${curr}] with smaller child [${smallest}] (p=${pq[curr].priority}).`,
        reason: {
          action: `Sift-Down [${curr}] <-> [${smallest}]`,
          why: `Parent violated min-heap with child. Swapping with smallest child preserves heap ordering.`,
          rule: 'swap(heap[curr], heap[smallest])',
          values: { parentIdx: curr, childIdx: smallest },
        },
      };

      curr = smallest;
    } else {
      break;
    }
  }

  // Extract-Min Round 2
  const min2 = pq[0];
  yield {
    type: 'found',
    codeLine: 4,
    indices: [0],
    pointers: { root: 0 },
    dataState: {
      structure: 'priority-queue',
      items: pq.map((x) => `${x.item} [p=${x.priority}]`),
      priorityList: [...pq],
      capacity: 8,
      runningMetric: `PEEK EXTRACT-MIN #2: ${min2.item} (p=${min2.priority})`,
    },
    message: `EXTRACT-MIN #2: Next highest urgency item is root ${min2.item} (priority ${min2.priority})!`,
    reason: {
      action: `Extract-Min #2 => ${min2.item}`,
      why: 'After sift-down, new minimum is at root in O(1) peek time.',
      rule: 'return heap[0]',
      values: { task: min2.item, priority: min2.priority },
    },
  };

  // Complete
  yield {
    type: 'complete',
    codeLine: 5,
    indices: [0],
    pointers: { root: 0 },
    dataState: {
      structure: 'priority-queue',
      items: pq.map((x) => `${x.item} [p=${x.priority}]`),
      priorityList: [...pq],
      capacity: 8,
      runningMetric: 'Priority Queue Execution Verified',
    },
    message: 'Priority Queue demonstration complete! Both Bubble-Up insertions and Sift-Down extractions verified in O(log n) time.',
    reason: {
      action: 'PQ Verified',
      why: 'Full heap invariant validated across multiple insertions and priority dispatches.',
      rule: 'Min-Heap Invariant Holds',
      values: { remainingTasks: pq.length },
    },
  };
}
