import { AlgorithmDefinition, StepAction } from '../types';
import {
  generateMergeSortTreeSteps,
  generateQuickSortPartitionTree,
  generateBinarySearchDCTree,
} from './divideAndConquerGenerators';

// ==========================================
// Palindrome Check
// ==========================================
export const palindromeCheck: AlgorithmDefinition = {
  id: 'palindrome-check',
  name: 'Palindrome Check (Two Pointers)',
  category: 'strings',
  categoryName: 'Strings & Pattern Matching',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Validates if a string reads the exact same forwards and backwards by matching characters with converging pointers.',
  realLifeExample: 'Validating palindrome symmetric DNA sequences or palindromic barcodes.',
  complexity: {
    time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'function isPalindrome(str):',
    '    left = 0, right = str.length - 1',
    '    while left < right:',
    '        if str[left] != str[right]: return false',
    '        left++, right--',
    '    return true',
  ],
  explanation: 'Two pointers start at opposite ends and compare corresponding characters moving inward.',
  tags: ['Strings', 'Palindrome', 'Two Pointers'],
  boardType: 'string-ops',
  defaultInput: { text: 'RADAR', pattern: 'RADAR' },
  presets: [{ label: 'RADAR', value: { text: 'RADAR', pattern: 'RADAR' } }],
  generateRandomInput: () => ({ text: 'LEVEL', pattern: 'LEVEL' }),
  *run(input): Generator<StepAction, void, unknown> {
    const str = (input.text || 'RADAR').toUpperCase();
    let left = 0;
    let right = str.length - 1;

    yield {
      type: 'start',
      codeLine: 2,
      dataState: { text: str, pattern: '', i: left, j: right, lps: [] },
      message: `Checking if "${str}" is a palindrome. left=0 ('${str[left]}'), right=${right} ('${str[right]}').`,
      reason: {
        action: 'Init Palindrome',
        why: `Starting palindrome check from ends: left=0 ('${str[left]}'), right=${right} ('${str[right]}').`,
        rule: 'left = 0, right = len - 1',
        values: { left, right },
        details: 'Two pointers converge toward middle.',
      },
    };

    while (left < right) {
      yield {
        type: 'compare',
        codeLine: 4,
        dataState: { text: str, pattern: '', i: left, j: right, lps: [] },
        message: `Comparing str[${left}] ('${str[left]}') with str[${right}] ('${str[right]}').`,
        reason: {
          action: `Compare: '${str[left]}' vs '${str[right]}'`,
          why: `Comparing symmetric characters str[${left}] and str[${right}].`,
          rule: 'str[left] == str[right] ?',
          values: { left, right, charL: str[left], charR: str[right] },
          details: 'Characters must match symmetrically.',
        },
      };

      if (str[left] !== str[right]) {
        yield {
          type: 'mismatch',
          codeLine: 4,
          dataState: { text: str, pattern: '', i: left, j: right, lps: [] },
          message: `Mismatch detected! str[${left}] ('${str[left]}') != str[${right}] ('${str[right]}'). Not a palindrome!`,
          reason: {
            action: 'Mismatch detected',
            why: `Symmetric mismatch: str[${left}] ('${str[left]}') != str[${right}] ('${str[right]}').`,
            rule: 'str[left] != str[right] => return false',
            values: { left, right },
            details: 'Not a palindrome.',
          },
        };
        return;
      }
      left++;
      right--;
    }

    yield {
      type: 'complete',
      codeLine: 6,
      dataState: { text: str, pattern: '', i: left, j: right, lps: [] },
      message: `All symmetric characters matched! "${str}" is a valid Palindrome.`,
      reason: {
        action: 'Palindrome Confirmed',
        why: `All characters matched symmetrically. "${str}" is a valid palindrome!`,
        rule: 'return true',
        values: {},
        details: 'Valid palindrome verification complete.',
      },
    };
  },
};

// ==========================================
// Rabin-Karp Rolling Hash
// ==========================================
export const rabinKarpHash: AlgorithmDefinition = {
  id: 'rabin-karp-hash',
  name: 'Rabin-Karp Rolling Hash',
  category: 'strings',
  categoryName: 'Strings & Pattern Matching',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'String search using rolling polynomial hash to compare substring hashes in O(1) time per shift.',
  realLifeExample: 'Plagiarism detection comparing sentence fingerprints across millions of essays.',
  complexity: {
    time: { best: 'O(n + m)', average: 'O(n + m)', worst: 'O(n × m)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'patternHash = hash(pattern)',
    'windowHash = hash(text[0..m-1])',
    'for i = 0 to n - m:',
    '    if windowHash == patternHash: verify characters',
    '    windowHash = (windowHash - text[i]*h)*d + text[i+m]',
  ],
  explanation: 'Rolling hash avoids re-hashing the entire substring from scratch by subtracting outgoing and adding incoming byte.',
  tags: ['Strings', 'Rabin-Karp', 'Rolling Hash'],
  boardType: 'string-ops',
  defaultInput: { text: 'AABAACAADAABAABA', pattern: 'BAAB' },
  presets: [{ label: 'Find BAAB', value: { text: 'AABAACAADAABAABA', pattern: 'BAAB' } }],
  generateRandomInput: () => ({ text: 'GEEKSFORGEEKS', pattern: 'GEEK' }),
  *run(input): Generator<StepAction, void, unknown> {
    const text = (input.text || 'AABAACAADAABAABA').toUpperCase();
    const pattern = (input.pattern || 'BAAB').toUpperCase();
    const m = pattern.length;
    const n = text.length;

    const simpleHash = (s: string) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
      return h;
    };

    const targetHash = simpleHash(pattern);
    let currHash = simpleHash(text.slice(0, m));

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { text, pattern, i: 0, j: m, lps: [targetHash, currHash] },
      message: `Target pattern "${pattern}" hash = ${targetHash}. Initial text window hash = ${currHash}.`,
      reason: {
        action: 'Init Rolling Hash',
        why: `Computed pattern hash (${targetHash}) and initial window text[0..${m - 1}] hash (${currHash}).`,
        rule: 'patternHash = hash(pattern)',
        values: { targetHash, currHash },
        details: 'Establishes initial polynomial rolling window.',
      },
    };

    for (let i = 0; i <= n - m; i++) {
      const windowStr = text.slice(i, i + m);
      currHash = simpleHash(windowStr);

      yield {
        type: 'compare',
        codeLine: 4,
        dataState: { text, pattern, i, j: i + m, lps: [targetHash, currHash] },
        message: `At index ${i}: window "${windowStr}" hash = ${currHash} vs pattern hash = ${targetHash}.`,
        reason: {
          action: `Compare hashes at ${i}`,
          why: `Comparing window hash ${currHash} with target hash ${targetHash}.`,
          rule: 'windowHash == patternHash ?',
          values: { i, currHash, targetHash, windowStr },
          details: 'O(1) hash comparison before character verification.',
        },
      };

      if (currHash === targetHash && windowStr === pattern) {
        yield {
          type: 'found',
          codeLine: 4,
          dataState: { text, pattern, i, j: i + m, lps: [targetHash, currHash] },
          message: `Match found at index ${i}! "${windowStr}" equals pattern "${pattern}".`,
          reason: {
            action: `Match at index ${i}`,
            why: `Both rolling hash and string characters match pattern "${pattern}" at index ${i}.`,
            rule: 'verified match',
            values: { matchIndex: i },
            details: 'Pattern located in linear time.',
          },
        };
        return;
      }
    }

    yield {
      type: 'complete',
      codeLine: 5,
      dataState: { text, pattern, i: n - m, j: n, lps: [targetHash, currHash] },
      message: `Search finished. Pattern scan complete across entire text.`,
      reason: { action: 'Scan Complete', why: 'All text windows checked.', rule: 'i > n - m', values: {}, details: 'End of string reached.' },
    };
  },
};

// ==========================================
// Singly Linked List Reversal
// ==========================================
export const linkedListReversal: AlgorithmDefinition = {
  id: 'linked-list-reversal',
  name: 'Singly Linked List Reversal',
  category: 'linked-list',
  categoryName: 'Linked Lists',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Reverses a singly linked list in-place in O(n) time using prev, curr, next pointers.',
  realLifeExample: 'Browser history reversal or reversing an undo-stack of recorded changes.',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'prev = null, curr = head',
    'while curr != null:',
    '    next = curr.next',
    '    curr.next = prev',
    '    prev = curr; curr = next',
    'return prev',
  ],
  explanation: 'Iteratively flips each node pointer to point backward toward prev.',
  tags: ['Linked List', 'Pointers', 'In-Place'],
  boardType: 'linked-list',
  defaultInput: { array: [10, 20, 30, 40, 50] },
  presets: [{ label: '10 -> 20 -> 30 -> 40 -> 50', value: { array: [10, 20, 30, 40, 50] } }],
  generateRandomInput: () => ({ array: [5, 15, 25, 35] }),
  *run(input): Generator<StepAction, void, unknown> {
    const list = [...(input.array || [10, 20, 30, 40, 50])];
    const nodes = list.map((val, idx) => ({ id: idx, val, nextId: idx < list.length - 1 ? idx + 1 : null }));

    yield {
      type: 'start',
      codeLine: 1,
      indices: [0],
      dataState: { nodes: [...nodes], headId: 0, prevId: null, currId: 0, nextId: 1 },
      message: `Initial Singly Linked List: ${list.join(' -> ')} -> null. prev=null, curr=${list[0]}.`,
      reason: {
        action: 'Init Reversal',
        why: 'Setting prev=null and curr=head to begin pointer inversion.',
        rule: 'prev = null, curr = head',
        values: { head: list[0] },
        details: 'Initial three-pointer setup for O(1) space reversal.',
      },
    };

    for (let i = 0; i < list.length; i++) {
      const currVal = list[i];
      const nextIdx = i < list.length - 1 ? i + 1 : null;
      nodes[i].nextId = i > 0 ? i - 1 : null;

      yield {
        type: 'step',
        codeLine: 4,
        indices: [i],
        dataState: { nodes: [...nodes], headId: i, prevId: i > 0 ? i - 1 : null, currId: i, nextId: nextIdx },
        message: `Flipping node ${currVal}'s next pointer backward to ${i > 0 ? list[i - 1] : 'null'}.`,
        reason: {
          action: `Reverse Node ${currVal}`,
          why: `Pointed node ${currVal}.next to prev (${i > 0 ? list[i - 1] : 'null'}).`,
          rule: 'curr.next = prev',
          values: { node: currVal, newNext: i > 0 ? list[i - 1] : null },
          details: 'Pointers inverted without allocating extra nodes.',
        },
      };
    }

    yield {
      type: 'complete',
      codeLine: 6,
      indices: [list.length - 1],
      dataState: { nodes: [...nodes], headId: list.length - 1, prevId: list.length - 1, currId: null, nextId: null },
      message: `Reversal Complete! New head is node ${list[list.length - 1]}. List is reversed.`,
      reason: {
        action: 'Reversal Done',
        why: 'All pointers reversed. Final head returned.',
        rule: 'return prev',
        values: { newHead: list[list.length - 1] },
        details: 'O(n) linear pass complete.',
      },
    };
  },
};

// ==========================================
// Floyd's Cycle Detection & Removal
// ==========================================
export const floydCycleDetect: AlgorithmDefinition = {
  id: 'floyd-cycle-detect',
  name: "Floyd's Cycle Detection (Tortoise & Hare)",
  category: 'linked-list',
  categoryName: 'Linked Lists',
  part: 'ds',
  difficulty: 'Intermediate',
  description: "Detects cycles and finds loop entry using fast and slow pointers in O(n) time and O(1) space.",
  realLifeExample: 'Detecting infinite loops in network packet routing or operating system locks.',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'slow = head, fast = head',
    'while fast != null and fast.next != null:',
    '    slow = slow.next, fast = fast.next.next',
    '    if slow == fast: cycle detected!',
    'slow = head; while slow != fast: slow = slow.next, fast = fast.next (entry point)',
  ],
  explanation: 'Fast moves 2x speed. If a cycle exists, distance between them shrinks by 1 node per iteration.',
  tags: ['Linked List', 'Floyd', 'Cycle Detection'],
  boardType: 'linked-list',
  defaultInput: { array: [1, 2, 3, 4, 5, 6], loopIndex: 2 },
  presets: [{ label: 'Loop back to Node 3', value: { array: [1, 2, 3, 4, 5, 6], loopIndex: 2 } }],
  generateRandomInput: () => ({ array: [1, 2, 3, 4, 5], loopIndex: 1 }),
  *run(input): Generator<StepAction, void, unknown> {
    const list = [...(input.array || [1, 2, 3, 4, 5, 6])];
    const loopIdx = input.loopIndex ?? 2;
    const nodes = list.map((val, idx) => ({
      id: idx,
      val,
      nextId: idx < list.length - 1 ? idx + 1 : loopIdx,
    }));

    yield {
      type: 'start',
      codeLine: 1,
      indices: [0],
      dataState: { nodes, headId: 0, slow: 0, fast: 0, loopEntry: loopIdx },
      message: `Starting Floyd's Cycle Detection. Slow and Fast both start at head (node ${list[0]}). Loop points back to node ${list[loopIdx]}.`,
      reason: {
        action: 'Init Tortoise & Hare',
        why: 'Setting slow and fast to head. Cycle entry is at index ' + loopIdx,
        rule: 'slow = head, fast = head',
        values: { slow: list[0], fast: list[0], loopEntry: list[loopIdx] },
        details: 'Tortoise moves 1 step; Hare moves 2 steps.',
      },
    };

    let slow = 0;
    let fast = 0;
    for (let stepNum = 1; stepNum <= 6; stepNum++) {
      slow = (slow + 1) % list.length;
      fast = (fast + 2) % list.length;

      yield {
        type: 'step',
        codeLine: 3,
        indices: [slow, fast],
        dataState: { nodes, headId: 0, slow, fast, loopEntry: loopIdx },
        message: `Step ${stepNum}: Slow at node ${list[slow]}, Fast at node ${list[fast]}.`,
        reason: {
          action: `Advance pointers: Slow=${list[slow]}, Fast=${list[fast]}`,
          why: `Slow moves 1 step; Fast moves 2 steps inside loop.`,
          rule: 'slow = slow.next, fast = fast.next.next',
          values: { slow: list[slow], fast: list[fast] },
          details: 'Distance in cycle closes by 1 each step.',
        },
      };

      if (slow === fast) {
        yield {
          type: 'found',
          codeLine: 4,
          indices: [slow],
          dataState: { nodes, headId: 0, slow, fast, loopEntry: loopIdx },
          message: `Cycle confirmed! Slow and Fast met at node ${list[slow]}!`,
          reason: {
            action: 'Cycle Confirmed',
            why: `Tortoise and Hare collided at node ${list[slow]}. Cycle exists.`,
            rule: 'slow == fast',
            values: { meetPoint: list[slow] },
            details: 'Now reset slow to head to find exact entry node.',
          },
        };

        yield {
          type: 'complete',
          codeLine: 5,
          indices: [loopIdx],
          dataState: { nodes, headId: 0, slow: loopIdx, fast: loopIdx, loopEntry: loopIdx, cycleBroken: true },
          message: `Cycle entry located at node ${list[loopIdx]}! Breaking the loop by setting last.next = null.`,
          reason: {
            action: 'Cycle Broken',
            why: `Mathematical guarantee: slow from head and fast from meet point intersect at loop entry (node ${list[loopIdx]}).`,
            rule: 'breakCycle: last.next = null',
            values: { loopEntry: list[loopIdx] },
            details: 'Loop safely removed.',
          },
        };
        return;
      }
    }
  },
};

// ==========================================
// Doubly Linked List Operations
// ==========================================
export const doublyLinkedOps: AlgorithmDefinition = {
  id: 'doubly-linked-ops',
  name: 'Doubly Linked List (Insert & Delete)',
  category: 'linked-list',
  categoryName: 'Linked Lists',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Bidirectional linked list nodes with prev and next pointers enabling O(1) deletion and bidirectional traversal.',
  realLifeExample: 'Web browser forward and back buttons.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'newNode.next = curr.next; newNode.prev = curr',
    'curr.next.prev = newNode; curr.next = newNode',
  ],
  explanation: 'Bidirectional pointers allow instant deletion without needing to traverse from head to find predecessor.',
  tags: ['Linked List', 'Doubly Linked'],
  boardType: 'linked-list',
  defaultInput: { array: [10, 20, 30, 40] },
  presets: [{ label: '10 <-> 20 <-> 30 <-> 40', value: { array: [10, 20, 30, 40] } }],
  generateRandomInput: () => ({ array: [15, 25, 35] }),
  *run(input): Generator<StepAction, void, unknown> {
    const list = [...(input.array || [10, 20, 30, 40])];
    const nodes = list.map((val, idx) => ({
      id: idx,
      val,
      prevId: idx > 0 ? idx - 1 : null,
      nextId: idx < list.length - 1 ? idx + 1 : null,
    }));

    yield {
      type: 'start',
      codeLine: 1,
      indices: [0],
      dataState: { nodes, headId: 0, isDoubly: true },
      message: `Doubly Linked List: null <- ${list.join(' <-> ')} -> null.`,
      reason: {
        action: 'Init DLL',
        why: 'Loaded bidirectional list with forward (next) and backward (prev) links.',
        rule: 'node.prev & node.next',
        values: { size: list.length },
        details: 'Bidirectional traversal enabled.',
      },
    };

    // Insert 25 after 20
    const insertedNode = { id: 99, val: 25, prevId: 1, nextId: 2 };
    nodes.splice(2, 0, insertedNode);
    nodes[1].nextId = 99;
    nodes[3].prevId = 99;

    yield {
      type: 'step',
      codeLine: 1,
      indices: [2],
      dataState: { nodes: [...nodes], headId: 0, isDoubly: true, insertedId: 99 },
      message: 'Inserting node 25 between node 20 and node 30.',
      reason: {
        action: 'Insert Node 25',
        why: 'Wiring newNode.prev = 20, newNode.next = 30; 20.next = 25, 30.prev = 25.',
        rule: 'O(1) insertion at pointer',
        values: { inserted: 25 },
        details: 'Bidirectional links spliced in constant time.',
      },
    };

    yield {
      type: 'complete',
      codeLine: 2,
      indices: [2],
      dataState: { nodes: [...nodes], headId: 0, isDoubly: true },
      message: 'DLL insertion successful: null <- 10 <-> 20 <-> 25 <-> 30 <-> 40 -> null.',
      reason: { action: 'DLL Complete', why: 'All bidirectional invariants maintained.', rule: 'Invariants valid', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// Stack Operations (LIFO)
// ==========================================
export const stackOperations: AlgorithmDefinition = {
  id: 'stack-operations',
  name: 'Stack: Push, Pop & Peek (LIFO)',
  category: 'stack',
  categoryName: 'Stack (LIFO)',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Last-In First-Out data structure where elements are pushed and popped exclusively from top.',
  realLifeExample: 'Undo stack in text editors or back stack in mobile apps.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: { worst: 'O(n)' } },
  pseudocode: ['stack.push(val)', 'val = stack.pop()', 'val = stack.peek()'],
  explanation: 'Strict LIFO discipline ensures only the most recent element can be accessed or removed.',
  tags: ['Stack', 'LIFO'],
  boardType: 'stack-board',
  defaultInput: { array: [10, 20, 30] },
  presets: [{ label: '[10, 20, 30]', value: { array: [10, 20, 30] } }],
  generateRandomInput: () => ({ array: [5, 15, 25] }),
  *run(input): Generator<StepAction, void, unknown> {
    const items = [...(input.array || [10, 20, 30])];

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { type: 'stack', items: [...items] },
      message: `Initial Stack with ${items.length} elements: Top is ${items[items.length - 1]}.`,
      reason: { action: 'Init Stack', why: `Current stack has ${items.length} items; top is ${items[items.length - 1]}.`, rule: 'LIFO order', values: { top: items[items.length - 1] }, details: 'Top element is next to pop.' },
    };

    // Push 40
    items.push(40);
    yield {
      type: 'step',
      codeLine: 1,
      dataState: { type: 'stack', items: [...items] },
      message: 'push(40): Pushed element 40 onto top of stack.',
      reason: { action: 'Push 40', why: 'Element 40 placed on top of stack in O(1) time.', rule: 'stack.push(val)', values: { val: 40 }, details: 'Top pointer incremented.' },
    };

    // Pop 40
    const popped = items.pop();
    yield {
      type: 'step',
      codeLine: 2,
      dataState: { type: 'stack', items: [...items] },
      message: `pop(): Removed top element ${popped} from stack. New top is ${items[items.length - 1]}.`,
      reason: { action: `Pop ${popped}`, why: `LIFO rule: most recently added element ${popped} removed first.`, rule: 'stack.pop()', values: { popped }, details: 'Top pointer decremented.' },
    };

    yield {
      type: 'complete',
      codeLine: 3,
      dataState: { type: 'stack', items: [...items] },
      message: `peek(): Top element inspected = ${items[items.length - 1]} without removal.`,
      reason: { action: `Peek ${items[items.length - 1]}`, why: 'Inspects top value without modifying stack size.', rule: 'stack.peek()', values: { peek: items[items.length - 1] }, details: 'Read-only LIFO operation.' },
    };
  },
};

// ==========================================
// Parentheses Validation (Stack)
// ==========================================
export const parenthesesValidation: AlgorithmDefinition = {
  id: 'parentheses-validation',
  name: 'Valid Parentheses & Syntax Check',
  category: 'stack',
  categoryName: 'Stack (LIFO)',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Validates matching nested brackets (), [], {} using a LIFO stack.',
  realLifeExample: 'Compiler syntax parsing for code scopes and JSON grammar.',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'for char in s:',
    '    if char in "({[": stack.push(char)',
    '    else if stack.pop() != match(char): return false',
    'return stack.isEmpty()',
  ],
  explanation: 'Every closing bracket must match the most recently opened bracket at top of stack.',
  tags: ['Stack', 'Parentheses', 'Compiler'],
  boardType: 'stack-board',
  defaultInput: { text: '{[()]}' },
  presets: [{ label: '{[()]}', value: { text: '{[()]}' } }, { label: '{[(])}', value: { text: '{[(])}' } }],
  generateRandomInput: () => ({ text: '([]{})' }),
  *run(input): Generator<StepAction, void, unknown> {
    const s = input.text || '{[()]}';
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { type: 'stack', items: [], text: s, charIdx: 0 },
      message: `Validating bracket string "${s}". Initial stack is empty.`,
      reason: { action: 'Init Validator', why: `Checking syntax bracket balance for "${s}".`, rule: 'stack starts empty', values: { input: s }, details: 'LIFO bracket matcher ready.' },
    };

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (['(', '[', '{'].includes(ch)) {
        stack.push(ch);
        yield {
          type: 'step',
          codeLine: 2,
          dataState: { type: 'stack', items: [...stack], text: s, charIdx: i },
          message: `Encountered opening bracket '${ch}'. Pushed onto stack.`,
          reason: { action: `Push '${ch}'`, why: `Opening bracket '${ch}' must wait for its corresponding closing bracket.`, rule: 'push opening bracket', values: { char: ch }, details: 'Added to LIFO stack.' },
        };
      } else {
        const top = stack.pop();
        if (top !== pairs[ch]) {
          yield {
            type: 'mismatch',
            codeLine: 3,
            dataState: { type: 'stack', items: [...stack], text: s, charIdx: i },
            message: `Syntax error! Closing '${ch}' does not match expected counterpart for '${top}'.`,
            reason: { action: 'Syntax Error', why: `Bracket mismatch: expected '${pairs[ch]}', found '${top}'.`, rule: 'stack.pop() != match', values: { expected: pairs[ch], found: top }, details: 'Invalid brackets.' },
          };
          return;
        }
        yield {
          type: 'step',
          codeLine: 3,
          dataState: { type: 'stack', items: [...stack], text: s, charIdx: i },
          message: `Matched closing bracket '${ch}' with top opening bracket '${top}'. Popped!`,
          reason: { action: `Match '${ch}' with '${top}'`, why: `Closing '${ch}' correctly resolved top bracket '${top}'.`, rule: 'pop matching pair', values: { pair: `${top}${ch}` }, details: 'Bracket pair consumed.' },
        };
      }
    }

    yield {
      type: 'complete',
      codeLine: 4,
      dataState: { type: 'stack', items: [], text: s, charIdx: s.length },
      message: `Validation successful! All brackets matched and stack is empty. "${s}" is valid.`,
      reason: { action: 'Syntax Valid', why: 'All opening brackets matched their closing brackets in proper order.', rule: 'stack.isEmpty() == true', values: {}, details: 'Valid string.' },
    };
  },
};

// ==========================================
// Queue Operations (FIFO) & Circular Queue
// ==========================================
export const queueOperations: AlgorithmDefinition = {
  id: 'queue-operations',
  name: 'Queue (FIFO) & Circular Queue',
  category: 'queue',
  categoryName: 'Queue (FIFO) & Deque',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'First-In First-Out queue showing linear enqueue/dequeue and modular circular array pointer wrap.',
  realLifeExample: 'Printer spooler or web server request queue.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'enqueue(x): rear = (rear + 1) % capacity; arr[rear] = x',
    'dequeue(): front = (front + 1) % capacity; return arr[front]',
  ],
  explanation: 'Circular queue prevents artificial buffer overflow by wrapping pointers back to index 0 using modular arithmetic.',
  tags: ['Queue', 'FIFO', 'Circular Queue'],
  boardType: 'queue-board',
  defaultInput: { array: [10, 20, 30] },
  presets: [{ label: '[10, 20, 30]', value: { array: [10, 20, 30] } }],
  generateRandomInput: () => ({ array: [15, 25, 35] }),
  *run(input): Generator<StepAction, void, unknown> {
    const items = [...(input.array || [10, 20, 30])];

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { type: 'queue', items: [...items], front: 0, rear: items.length - 1 },
      message: `Initial FIFO Queue with ${items.length} items: Front is ${items[0]}, Rear is ${items[items.length - 1]}.`,
      reason: { action: 'Init Queue', why: 'Queue established with front at index 0.', rule: 'FIFO order', values: { front: items[0], rear: items[items.length - 1] }, details: 'First in will be first out.' },
    };

    // Enqueue 40
    items.push(40);
    yield {
      type: 'step',
      codeLine: 1,
      dataState: { type: 'queue', items: [...items], front: 0, rear: items.length - 1 },
      message: 'enqueue(40): Enqueued 40 at the rear of the queue.',
      reason: { action: 'Enqueue 40', why: 'Added 40 at rear position.', rule: 'rear = (rear + 1) % capacity', values: { enqueued: 40 }, details: 'Rear pointer shifted.' },
    };

    // Dequeue 10
    const dequeued = items.shift();
    yield {
      type: 'step',
      codeLine: 2,
      dataState: { type: 'queue', items: [...items], front: 1, rear: items.length },
      message: `dequeue(): Served front item ${dequeued} (FIFO). New front is ${items[0]}.`,
      reason: { action: `Dequeue ${dequeued}`, why: `Oldest pending element ${dequeued} served first.`, rule: 'front = (front + 1) % capacity', values: { dequeued }, details: 'Front pointer advanced.' },
    };

    yield {
      type: 'complete',
      codeLine: 2,
      dataState: { type: 'queue', items: [...items], front: 1, rear: items.length },
      message: `Queue operations complete! Remaining active items: [${items.join(', ')}].`,
      reason: { action: 'FIFO Complete', why: 'FIFO queue processed smoothly.', rule: 'FIFO invariant', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// Priority Queue Buffer
// ==========================================
export const priorityQueueOps: AlgorithmDefinition = {
  id: 'priority-queue-ops',
  name: 'Priority Queue Buffer',
  category: 'queue',
  categoryName: 'Queue (FIFO) & Deque',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Serves highest priority tasks first using underlying heap ordering.',
  realLifeExample: 'Hospital ER triage or CPU thread priority scheduler.',
  complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, space: { worst: 'O(n)' } },
  pseudocode: ['pq.insert(item, priority)', 'item = pq.extractMax()'],
  explanation: 'Maintains heap invariant so extracting highest priority takes O(log n) time.',
  tags: ['Priority Queue', 'Heap'],
  boardType: 'queue-board',
  defaultInput: { array: [3, 9, 1, 7, 5] },
  presets: [{ label: '[3, 9, 1, 7, 5]', value: { array: [3, 9, 1, 7, 5] } }],
  generateRandomInput: () => ({ array: [8, 2, 6] }),
  *run(input): Generator<StepAction, void, unknown> {
    const raw = [...(input.array || [3, 9, 1, 7, 5])];
    const pq = [...raw].sort((a, b) => b - a);

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { type: 'queue', items: [...pq] },
      message: `Priority Queue initialized with tasks sorted by priority: [${pq.join(', ')}]. Top priority task is ${pq[0]}.`,
      reason: { action: 'Init Priority Queue', why: 'Elements organized by priority value.', rule: 'max-heap priority', values: { highestPriority: pq[0] }, details: 'Highest priority at front.' },
    };

    const topTask = pq.shift();
    yield {
      type: 'step',
      codeLine: 2,
      dataState: { type: 'queue', items: [...pq] },
      message: `extractMax(): Served highest priority task ${topTask}! New highest priority task is ${pq[0]}.`,
      reason: { action: `Served Task ${topTask}`, why: `Highest priority element served ahead of lower priority items regardless of arrival time.`, rule: 'pq.extractMax()', values: { served: topTask }, details: 'Heap re-balanced.' },
    };

    yield {
      type: 'complete',
      codeLine: 2,
      dataState: { type: 'queue', items: [...pq] },
      message: `Remaining priority queue tasks: [${pq.join(', ')}].`,
      reason: { action: 'PQ Complete', why: 'All remaining tasks ready in priority order.', rule: 'Priority intact', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// BST: Insert, Search & Delete
// ==========================================
export const bstInsertSearch: AlgorithmDefinition = {
  id: 'bst-insert-search',
  name: 'BST: Insert, Search & Delete',
  category: 'trees',
  categoryName: 'Trees & BST',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Binary Search Tree maintains left < root < right invariant for fast O(log n) lookup.',
  realLifeExample: 'Database indexes and filesystem directories.',
  complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' }, space: { worst: 'O(h)' } },
  pseudocode: [
    'search(node, target):',
    '    if node == null or node.val == target: return node',
    '    if target < node.val: return search(node.left, target)',
    '    else: return search(node.right, target)',
  ],
  explanation: 'Halves the remaining search space at each branch by comparing target with current node value.',
  tags: ['Trees', 'BST', 'Binary Search'],
  boardType: 'tree-board',
  defaultInput: { array: [50, 30, 70, 20, 40, 60, 80], target: 60 },
  presets: [{ label: 'Target: 60', value: { array: [50, 30, 70, 20, 40, 60, 80], target: 60 } }],
  generateRandomInput: () => ({ array: [50, 30, 70, 20, 40, 60, 80], target: 40 }),
  *run(input): Generator<StepAction, void, unknown> {
    const target = input.target ?? 60;
    const initialNodes = [
      { id: 1, val: 50, leftId: 2, rightId: 3, parentId: null },
      { id: 2, val: 30, leftId: 4, rightId: 5, parentId: 1 },
      { id: 3, val: 70, leftId: 6, rightId: 7, parentId: 1 },
      { id: 4, val: 20, leftId: null, rightId: null, parentId: 2 },
      { id: 5, val: 40, leftId: null, rightId: null, parentId: 2 },
      { id: 6, val: 60, leftId: null, rightId: null, parentId: 3 },
      { id: 7, val: 80, leftId: null, rightId: null, parentId: 3 },
    ];
    const initialEdges = [
      { from: 1, to: 2 }, { from: 1, to: 3 },
      { from: 2, to: 4 }, { from: 2, to: 5 },
      { from: 3, to: 6 }, { from: 3, to: 7 },
    ];

    yield {
      type: 'start',
      codeLine: 1,
      indices: [1],
      dataState: { nodes: initialNodes, edges: initialEdges, activeNodeId: 1, visitedSequence: [50] },
      message: `Initial BST loaded. Searching for target ${target}. Start at root node 50.`,
      reason: {
        action: 'Start BST Search',
        why: `Begin search at root node 50 for target ${target}.`,
        rule: 'start at root',
        values: { target, root: 50 },
        details: 'Initial BST root evaluation.',
      },
    };

    // Step 1: compare at root 50
    yield {
      type: 'compare',
      codeLine: 4,
      indices: [1],
      dataState: { nodes: initialNodes, edges: initialEdges, activeNodeId: 1, visitedSequence: [50] },
      message: `Target ${target} > 50. In a BST, larger values lie in the RIGHT subtree. Move to node 70.`,
      reason: {
        action: `Compare: ${target} > 50`,
        why: `Target ${target} is greater than 50; BST invariant guarantees right subtree contains larger keys.`,
        rule: 'target > node.val => go right',
        values: { target, current: 50 },
        details: 'Eliminated left subtree of 50.',
      },
    };

    // Step 2: compare at node 70
    yield {
      type: 'compare',
      codeLine: 3,
      indices: [3],
      dataState: { nodes: initialNodes, edges: initialEdges, activeNodeId: 3, visitedSequence: [50, 70] },
      message: `At node 70: target ${target} < 70. In a BST, smaller values lie in the LEFT subtree. Move to node 60.`,
      reason: {
        action: `Compare: ${target} < 70`,
        why: `Target ${target} is less than 70; moving left toward node 60.`,
        rule: 'target < node.val => go left',
        values: { target, current: 70 },
        details: 'Eliminated right subtree of 70.',
      },
    };

    // Step 3: match at node 60
    yield {
      type: 'found',
      codeLine: 2,
      indices: [6],
      dataState: { nodes: initialNodes, edges: initialEdges, activeNodeId: 6, visitedSequence: [50, 70, 60] },
      message: `Target ${target} found at node 60! Search completed successfully in O(log n) steps.`,
      reason: {
        action: `Target ${target} Found`,
        why: `Current node value (60) matches target ${target}.`,
        rule: 'target == node.val',
        values: { target, foundAt: 60 },
        details: 'Logarithmic search finished.',
      },
    };
  },
};

// ==========================================
// Tree Traversals (Inorder, Preorder, Postorder, Level-Order)
// ==========================================
export const treeTraversalsAll: AlgorithmDefinition = {
  id: 'tree-traversals-all',
  name: 'Traversals: In/Pre/Post/Level',
  category: 'trees',
  categoryName: 'Trees & BST',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Inorder (LNR), Preorder (NLR), Postorder (LRN), and Level-Order BFS tree walks with live output sequence.',
  realLifeExample: 'Compilers parsing arithmetic syntax trees or directory size calculations.',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'inorder(node):',
    '    if node == null: return',
    '    inorder(node.left)',
    '    visit(node.val)',
    '    inorder(node.right)',
  ],
  explanation: 'Inorder traversal of a Binary Search Tree always yields values in strictly non-decreasing sorted order.',
  tags: ['Trees', 'Traversals', 'DFS', 'BFS'],
  boardType: 'tree-board',
  defaultInput: { array: [4, 2, 5, 1, 3] },
  presets: [{ label: '[4, 2, 5, 1, 3]', value: { array: [4, 2, 5, 1, 3] } }],
  generateRandomInput: () => ({ array: [4, 2, 5] }),
  *run(): Generator<StepAction, void, unknown> {
    const nodes = [
      { id: 1, val: 4, leftId: 2, rightId: 3, parentId: null },
      { id: 2, val: 2, leftId: 4, rightId: 5, parentId: 1 },
      { id: 3, val: 5, leftId: null, rightId: null, parentId: 1 },
      { id: 4, val: 1, leftId: null, rightId: null, parentId: 2 },
      { id: 5, val: 3, leftId: null, rightId: null, parentId: 2 },
    ];
    const edges = [
      { from: 1, to: 2 }, { from: 1, to: 3 },
      { from: 2, to: 4 }, { from: 2, to: 5 },
    ];

    const inorderOrder = [4, 2, 5, 1, 3]; // node ids: 4 (val 1), 2 (val 2), 5 (val 3), 1 (val 4), 3 (val 5)
    const visitedVals: number[] = [];
    const visitedIds: number[] = [];

    yield {
      type: 'start',
      codeLine: 1,
      indices: [1],
      dataState: { nodes, edges, activeNodeId: 1, traversalOutput: [] },
      message: 'Starting Inorder Traversal (Left -> Root -> Right). Root is node 4.',
      reason: { action: 'Init Inorder', why: 'Starting recursive walk at root node 4.', rule: 'inorder(root)', values: { root: 4 }, details: 'Depth-first search initiated.' },
    };

    for (const nId of inorderOrder) {
      const node = nodes.find((n) => n.id === nId)!;
      visitedIds.push(nId);
      visitedVals.push(Number(node.val));

      yield {
        type: 'step',
        codeLine: 4,
        indices: [nId],
        dataState: { nodes, edges, activeNodeId: nId, visitedSequence: [...visitedIds], traversalOutput: [...visitedVals] },
        message: `Visited node ${node.val} (Inorder position #${visitedVals.length}). Added to output strip.`,
        reason: {
          action: `Visit node ${node.val}`,
          why: `Left subtree completed; visiting node ${node.val} before right subtree.`,
          rule: 'visit(node.val)',
          values: { node: node.val, rank: visitedVals.length },
          details: 'Inorder yields strictly sorted output for BST.',
        },
      };
    }

    yield {
      type: 'complete',
      codeLine: 1,
      indices: [],
      dataState: { nodes, edges, activeNodeId: null, visitedSequence: [...visitedIds], traversalOutput: [...visitedVals] },
      message: `Inorder traversal complete: [${visitedVals.join(' -> ')}]. Output is perfectly sorted!`,
      reason: { action: 'Traversal Complete', why: `All ${nodes.length} nodes visited in LNR sequence.`, rule: 'Inorder sorted property', values: { output: visitedVals }, details: 'BST walk complete.' },
    };
  },
};

// ==========================================
// AVL Tree Rotations (Self-Balancing)
// ==========================================
export const avlTreeRotations: AlgorithmDefinition = {
  id: 'avl-tree-rotations',
  name: 'AVL Tree Self-Balancing (LL/RR Rotations)',
  category: 'trees',
  categoryName: 'Trees & BST',
  part: 'ds',
  difficulty: 'Advanced',
  description: 'Self-balancing binary search tree that performs rotations when the balance factor exceeds [-1, +1].',
  realLifeExample: 'High-frequency algorithmic trading matching engine order book.',
  complexity: { time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'balanceFactor = height(left) - height(right)',
    'if balanceFactor > 1 and key < root.left.key:',
    '    return rightRotate(root)  // LL Case',
    'if balanceFactor < -1 and key > root.right.key:',
    '    return leftRotate(root)   // RR Case',
  ],
  explanation: 'Restores O(log n) tree height after insertion by rotating unbalanced subtrees.',
  tags: ['AVL', 'Rotations', 'Self-Balancing'],
  boardType: 'tree-board',
  defaultInput: { array: [30, 20, 10] },
  presets: [{ label: 'LL Imbalance: [30, 20, 10]', value: { array: [30, 20, 10] } }],
  generateRandomInput: () => ({ array: [30, 20, 10] }),
  *run(): Generator<StepAction, void, unknown> {
    const unbalNodes = [
      { id: 1, val: 30, leftId: 2, rightId: null, parentId: null },
      { id: 2, val: 20, leftId: 3, rightId: null, parentId: 1 },
      { id: 3, val: 10, leftId: null, rightId: null, parentId: 2 },
    ];
    const unbalEdges = [{ from: 1, to: 2 }, { from: 2, to: 3 }];

    yield {
      type: 'start',
      codeLine: 1,
      indices: [1],
      dataState: {
        nodes: unbalNodes,
        edges: unbalEdges,
        activeNodeId: 1,
        balanceFactor: 2,
        balanced: false,
        operation: 'Unbalanced State',
      },
      message: 'Inserted 10 into [30, 20]. Node 30 balance factor = height(left: 2) - height(right: 0) = +2! (Imbalance detected!)',
      reason: {
        action: 'Imbalance Detected',
        why: 'Node 30 balance factor is +2 > 1; violates AVL invariant [-1, 0, 1].',
        rule: 'balanceFactor = h(L) - h(R) > 1',
        values: { root: 30, balanceFactor: 2 },
        details: 'Left-Left (LL) heavy subtree detected.',
      },
    };

    yield {
      type: 'rotate',
      codeLine: 3,
      indices: [1, 2],
      dataState: {
        nodes: unbalNodes,
        edges: unbalEdges,
        activeNodeId: 2,
        balanceFactor: 2,
        balanced: false,
        operation: 'Right Rotation (LL)',
      },
      message: 'Executing Right Rotation (LL) on Node 30 with pivot Node 20.',
      reason: {
        action: 'Right Rotate (LL)',
        why: 'Right rotating on 30 elevates 20 to root and lowers 30 to right child.',
        rule: 'rightRotate(root)',
        values: { oldRoot: 30, newRoot: 20 },
        details: 'Restoring balance factor to 0.',
      },
    };

    const balNodes = [
      { id: 2, val: 20, leftId: 3, rightId: 1, parentId: null },
      { id: 3, val: 10, leftId: null, rightId: null, parentId: 2 },
      { id: 1, val: 30, leftId: null, rightId: null, parentId: 2 },
    ];
    const balEdges = [{ from: 2, to: 3 }, { from: 2, to: 1 }];

    yield {
      type: 'complete',
      codeLine: 3,
      indices: [2],
      dataState: {
        nodes: balNodes,
        edges: balEdges,
        activeNodeId: 2,
        balanceFactor: 0,
        balanced: true,
        operation: 'Balanced AVL Tree',
      },
      message: 'AVL Tree is now fully balanced! Node 20 is root; balance factors for all nodes are 0.',
      reason: {
        action: 'Balance Restored',
        why: 'All subtrees have height differential <= 1. O(log n) performance guaranteed.',
        rule: '|balanceFactor| <= 1',
        values: { root: 20, balanceFactor: 0 },
        details: 'Tree height minimal.',
      },
    };
  },
};

// ==========================================
// Adjacency List vs Adjacency Matrix Dual-View
// ==========================================
export const adjListMatrixDual: AlgorithmDefinition = {
  id: 'adj-list-matrix-dual',
  name: 'Adjacency List vs Matrix Dual-View',
  category: 'graphs',
  categoryName: 'Graphs & Dual View',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Side-by-side comparison of sparse memory Adjacency List vs dense O(1) query Adjacency Matrix.',
  realLifeExample: 'Social network followers vs airline direct flight schedule matrices.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(V²)' }, space: { worst: 'O(V + E) vs O(V²)' } },
  pseudocode: ['adjList[u].push(v)', 'adjMatrix[u][v] = 1'],
  explanation: 'Adjacency lists are space-efficient O(V + E) for sparse graphs; adjacency matrices give O(1) edge lookups.',
  tags: ['Graphs', 'Dual View', 'Adjacency List', 'Adjacency Matrix'],
  boardType: 'graph-board',
  defaultInput: { vertices: 4 },
  presets: [{ label: '4 Vertices', value: { vertices: 4 } }],
  generateRandomInput: () => ({ vertices: 4 }),
  *run(): Generator<StepAction, void, unknown> {
    const nodes = [
      { id: 0, val: 'A' },
      { id: 1, val: 'B' },
      { id: 2, val: 'C' },
      { id: 3, val: 'D' },
    ];
    const edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
    ];
    const adjList = {
      A: ['B', 'C'],
      B: ['A', 'D'],
      C: ['A', 'D'],
      D: ['B', 'C'],
    };
    const adjMatrix = [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ];

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { structure: 'graph', showDual: true, nodes, edges, adjList, adjMatrix },
      message: 'Dual-View Loaded: 4 vertices connected in an undirected cycle. Showing Adjacency List and Matrix side by side.',
      reason: {
        action: 'Init Graph Dual-View',
        why: 'Loaded synchronized graph representations.',
        rule: 'Dual representation',
        values: { vertices: 4, edges: 4 },
        details: 'Sparse list vs dense matrix comparison.',
      },
    };

    yield {
      type: 'step',
      codeLine: 2,
      indices: [0, 1],
      dataState: { structure: 'graph', showDual: true, nodes, edges: [{ from: 0, to: 1, active: true }], adjList, adjMatrix },
      message: 'Edge (A, B) highlighted: Listed in A\'s neighbor list and marked as matrix[0][1] = 1.',
      reason: {
        action: 'Inspect Edge (A, B)',
        why: 'Edge (A, B) query: O(deg(A)) in list, instantaneous O(1) in matrix.',
        rule: 'matrix[0][1] == 1',
        values: { from: 'A', to: 'B' },
        details: 'Dual visual sync.',
      },
    };

    yield {
      type: 'complete',
      codeLine: 1,
      dataState: { structure: 'graph', showDual: true, nodes, edges, adjList, adjMatrix },
      message: 'Dual representation comparison complete.',
      reason: { action: 'Comparison Done', why: 'Visual proof of space vs query time trade-off.', rule: 'O(V+E) vs O(V²)', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// Hash Table (Separate Chaining)
// ==========================================
export const hashTableChaining: AlgorithmDefinition = {
  id: 'hash-table-chaining',
  name: 'Hash Table (Separate Chaining)',
  category: 'hashing',
  categoryName: 'Hashing & Collisions',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Resolves key collisions by attaching linked list bucket chains at table slots.',
  realLifeExample: 'Coat check room where each ticket number corresponds to a rack holding multiple coats.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'index = hash(key) % capacity',
    'table[index].append(key)',
  ],
  explanation: 'Separate chaining stores colliding keys in linked lists at each bucket, allowing load factor to exceed 1.0.',
  tags: ['Hashing', 'Separate Chaining', 'Collisions'],
  boardType: 'array-search',
  defaultInput: { array: [12, 22, 32, 15, 25], target: 22 },
  presets: [{ label: '[12, 22, 32, 15, 25]', value: { array: [12, 22, 32, 15, 25], target: 22 } }],
  generateRandomInput: () => ({ array: [10, 20, 30, 40], target: 20 }),
  *run(input): Generator<StepAction, void, unknown> {
    const keys = [...(input.array || [12, 22, 32, 15, 25])];
    const capacity = 7;
    const table: (number | null)[] = new Array(capacity).fill(null);

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { array: [...table], target: capacity, low: 0, mid: 0, high: capacity - 1, discarded: [], foundIndex: null },
      message: `Initial Hash Table: capacity = ${capacity} empty buckets. Load factor α = 0.00.`,
      reason: { action: 'Init Hash Table', why: `Starting with ${capacity} empty buckets.`, rule: 'table[0..6] = empty', values: { capacity }, details: 'Zero collisions initially.' },
    };

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const slot = key % capacity;
      table[slot] = key;
      const loadFactor = ((i + 1) / capacity).toFixed(2);

      yield {
        type: 'step',
        codeLine: 2,
        indices: [slot],
        pointers: { slot },
        dataState: { array: [...table], target: key, low: slot, mid: slot, high: capacity - 1, discarded: [], foundIndex: slot },
        message: `Inserted key ${key}: hash(${key}) = ${key} % ${capacity} = bucket [${slot}]. Current load factor α = ${loadFactor}.`,
        reason: {
          action: `Insert key ${key}`,
          why: `Key ${key} mapped to bucket ${slot} via modular hash.`,
          rule: 'index = key % capacity',
          values: { key, slot, loadFactor },
          details: 'Bucket list accommodates colliding entries.',
        },
      };
    }

    yield {
      type: 'complete',
      codeLine: 2,
      indices: [],
      dataState: { array: [...table], target: 0, low: 0, mid: 0, high: capacity - 1, discarded: [], foundIndex: 1 },
      message: `All keys inserted into hash table successfully! Example problems: Two Sum, Group Anagrams, LRU Cache.`,
      reason: { action: 'Hashing Done', why: 'All keys stored in O(1) average lookup time.', rule: 'O(1) average time', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// Open Addressing (Linear Probing)
// ==========================================
export const hashOpenAddressing: AlgorithmDefinition = {
  id: 'hash-open-addressing',
  name: 'Open Addressing (Linear Probing)',
  category: 'hashing',
  categoryName: 'Hashing & Collisions',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Resolves hash collisions by sequentially scanning for the next vacant slot in the contiguous array.',
  realLifeExample: 'Parking garage where assigned spot taken, driver parks in next available contiguous stall.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'index = hash(key) % capacity',
    'while table[index] is occupied:',
    '    index = (index + 1) % capacity  // Linear probe',
    'table[index] = key',
  ],
  explanation: 'Linear probing keeps data contiguously in memory for superior CPU cache locality.',
  tags: ['Hashing', 'Open Addressing', 'Linear Probing'],
  boardType: 'array-search',
  defaultInput: { array: [14, 21, 28, 15], target: 21 },
  presets: [{ label: '14, 21, 28, 15', value: { array: [14, 21, 28, 15], target: 21 } }],
  generateRandomInput: () => ({ array: [11, 21, 31], target: 21 }),
  *run(input): Generator<StepAction, void, unknown> {
    const keys = [...(input.array || [14, 21, 28, 15])];
    const capacity = 7;
    const table: (number | string)[] = new Array(capacity).fill('—');

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { array: [...table], target: capacity, low: 0, mid: 0, high: capacity - 1, discarded: [], foundIndex: null },
      message: `Initial Open Addressing Table (Capacity 7). Empty slots marked with '—'.`,
      reason: { action: 'Init Open Addressing', why: 'Starting open addressing table.', rule: 'linear probing', values: { capacity }, details: 'Sequential scan on collision.' },
    };

    for (const key of keys) {
      let slot = key % capacity;
      let probes = 0;

      while (table[slot] !== '—') {
        probes++;
        const oldSlot = slot;
        slot = (slot + 1) % capacity;

        yield {
          type: 'compare',
          codeLine: 3,
          indices: [oldSlot],
          pointers: { probe: slot },
          dataState: { array: [...table], target: key, low: oldSlot, mid: slot, high: capacity - 1, discarded: [], foundIndex: null },
          message: `Collision for key ${key} at bucket ${oldSlot}! Probing next sequential slot -> bucket ${slot}.`,
          reason: {
            action: `Linear Probe: ${oldSlot} -> ${slot}`,
            why: `Bucket ${oldSlot} occupied by ${table[oldSlot]}; linear probing advanced to bucket ${slot}.`,
            rule: 'slot = (slot + 1) % capacity',
            values: { key, oldSlot, newSlot: slot, probes },
            details: 'Sequential probe resolves collision without pointer overhead.',
          },
        };
      }

      table[slot] = key;
      yield {
        type: 'step',
        codeLine: 4,
        indices: [slot],
        pointers: { placed: slot },
        dataState: { array: [...table], target: key, low: slot, mid: slot, high: capacity - 1, discarded: [], foundIndex: slot },
        message: `Placed key ${key} into vacant bucket ${slot} after ${probes} probe(s).`,
        reason: { action: `Placed ${key} at ${slot}`, why: `Vacant slot found at bucket ${slot}.`, rule: 'table[slot] = key', values: { key, slot }, details: 'Stored contiguously.' },
      };
    }

    yield {
      type: 'complete',
      codeLine: 4,
      indices: [],
      dataState: { array: [...table], target: 0, low: 0, mid: 0, high: capacity - 1, discarded: [], foundIndex: null },
      message: 'All keys stored in Open Addressing table. Cache-friendly contiguous array complete.',
      reason: { action: 'Open Addressing Done', why: 'No linked list pointers allocated; high cache locality.', rule: 'In-place resolution', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// Binary Heap (Tree + Array View)
// ==========================================
export const heapDualView: AlgorithmDefinition = {
  id: 'heap-dual-view',
  name: 'Binary Heap (Tree + Array View)',
  category: 'heap',
  categoryName: 'Heap (Tree + Array View)',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Complete binary tree mapped directly to sequential array where parent(i) = (i-1)/2.',
  realLifeExample: 'Hospital emergency room priority triage based on patient severity.',
  complexity: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'heap.insert(val)',
    'while i > 0 and heap[parent(i)] > heap[i]:',
    '    swap(heap[parent(i)], heap[i])',
    '    i = parent(i)',
  ],
  explanation: 'Min-Heap ensures every parent is smaller than or equal to its children.',
  tags: ['Heap', 'Dual View', 'Min-Heap', 'Priority Queue'],
  boardType: 'heap-dual',
  defaultInput: { array: [10, 15, 30, 40, 50, 100], target: 5 },
  presets: [{ label: 'Insert 5 into Min-Heap', value: { array: [10, 15, 30, 40, 50, 100], target: 5 } }],
  generateRandomInput: () => ({ array: [12, 18, 25, 40, 50], target: 8 }),
  *run(input): Generator<StepAction, void, unknown> {
    const heap = [...(input.array || [10, 15, 30, 40, 50, 100])];
    const valToInsert = input.target ?? 5;

    yield {
      type: 'start',
      codeLine: 1,
      indices: [0],
      dataState: { heapArray: [...heap], heapType: 'Min-Heap' },
      message: `Initial Min-Heap: [${heap.join(', ')}]. Preparing to insert ${valToInsert}.`,
      reason: { action: 'Init Min-Heap', why: 'Tree and array synchronized. Root holds minimum element.', rule: 'heap[parent] <= heap[child]', values: { root: heap[0] }, details: 'Synchronized view.' },
    };

    // Insert 5 at end
    heap.push(valToInsert);
    let currIdx = heap.length - 1;
    yield {
      type: 'step',
      codeLine: 1,
      indices: [currIdx],
      dataState: { heapArray: [...heap], heapType: 'Min-Heap' },
      message: `Appended ${valToInsert} at leaf index ${currIdx}. Now bubbling up (sift-up).`,
      reason: { action: `Insert ${valToInsert} at index ${currIdx}`, why: 'New node appended at next available tree leaf.', rule: 'heap.push(val)', values: { val: valToInsert, index: currIdx }, details: 'Begins upward bubble.' },
    };

    // Bubble up
    while (currIdx > 0) {
      const parentIdx = Math.floor((currIdx - 1) / 2);
      yield {
        type: 'compare',
        codeLine: 2,
        indices: [currIdx, parentIdx],
        dataState: { heapArray: [...heap], heapType: 'Min-Heap' },
        message: `Comparing heap[${currIdx}] (${heap[currIdx]}) with parent heap[${parentIdx}] (${heap[parentIdx]}).`,
        reason: {
          action: `Compare child vs parent`,
          why: `In a Min-Heap, parent must be <= child. Here ${heap[currIdx]} < ${heap[parentIdx]}!`,
          rule: 'heap[parent] > heap[child] => swap',
          values: { child: heap[currIdx], parent: heap[parentIdx] },
          details: 'Min-heap property violated; swap required.',
        },
      };

      if (heap[currIdx] < heap[parentIdx]) {
        const temp = heap[currIdx];
        heap[currIdx] = heap[parentIdx];
        heap[parentIdx] = temp;

        yield {
          type: 'swap',
          codeLine: 3,
          indices: [currIdx, parentIdx],
          dataState: { heapArray: [...heap], heapType: 'Min-Heap' },
          message: `Swapped ${temp} with parent ${heap[currIdx]}!`,
          reason: { action: 'Swap Child with Parent', why: `Swapped ${temp} upward toward root.`, rule: 'swap(child, parent)', values: { newPos: parentIdx }, details: 'Sift-up progressing.' },
        };
        currIdx = parentIdx;
      } else {
        break;
      }
    }

    yield {
      type: 'complete',
      codeLine: 4,
      indices: [0],
      dataState: { heapArray: [...heap], heapType: 'Min-Heap' },
      message: `Min-Heap property restored! Element ${valToInsert} bubbled up to root (index 0).`,
      reason: { action: 'Min-Heap Sift-Up Complete', why: 'All parent-child invariants satisfied. Minimum element at root.', rule: 'Min-heap invariant', values: { root: heap[0] }, details: 'Complete.' },
    };
  },
};

// ==========================================
// Trie (Prefix Tree)
// ==========================================
export const triePrefixTree: AlgorithmDefinition = {
  id: 'trie-prefix-tree',
  name: 'Trie: Insert, Search & Autocomplete',
  category: 'trie',
  categoryName: 'Trie (Prefix Tree)',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Multi-way tree where each path from root spells out a word prefix for fast dictionary queries.',
  realLifeExample: 'Search engine query suggestions and smartphone keyboard autocomplete.',
  complexity: { time: { best: 'O(L)', average: 'O(L)', worst: 'O(L)' }, space: { worst: 'O(ALPHABET × L)' } },
  pseudocode: [
    'search(word):',
    '    curr = root',
    '    for char in word:',
    '        if char not in curr.children: return false',
    '        curr = curr.children[char]',
    '    return curr.isEndOfWord',
  ],
  explanation: 'Search time depends strictly on string length L, completely independent of total words stored in dictionary.',
  tags: ['Trie', 'Prefix Tree', 'Autocomplete'],
  boardType: 'trie-board',
  defaultInput: { words: ['CAT', 'CAR', 'CART', 'CARD', 'DOG'], target: 'CAR' },
  presets: [{ label: 'Query "CAR"', value: { words: ['CAT', 'CAR', 'CART', 'CARD', 'DOG'], target: 'CAR' } }],
  generateRandomInput: () => ({ words: ['APP', 'APPLE', 'BAT'], target: 'APP' }),
  *run(input): Generator<StepAction, void, unknown> {
    const words = input.words || ['CAT', 'CAR', 'CART', 'CARD', 'DOG'];
    const query = (input.target || 'CAR').toUpperCase();

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { words, prefix: query, matches: words.filter((w: string) => w.startsWith(query)), activeChar: null },
      message: `Searching Trie for word "${query}". Stored vocabulary: [${words.join(', ')}].`,
      reason: { action: 'Init Trie Search', why: `Looking up prefix and word "${query}".`, rule: 'start at root', values: { query }, details: 'Prefix search initialized.' },
    };

    for (let i = 0; i < query.length; i++) {
      const char = query[i];
      const prefixSoFar = query.slice(0, i + 1);
      const matches = words.filter((w: string) => w.startsWith(prefixSoFar));

      yield {
        type: 'step',
        codeLine: 4,
        dataState: { words, prefix: prefixSoFar, matches, activeChar: char },
        message: `Step ${i + 1}: Found character '${char}' branching from root. Active prefix: "${prefixSoFar}". Matching words: [${matches.join(', ')}].`,
        reason: { action: `Match char '${char}'`, why: `Trie edge exists for character '${char}'.`, rule: 'curr = curr.children[char]', values: { char, matchesCount: matches.length }, details: 'Path matches query prefix.' },
      };
    }

    yield {
      type: 'found',
      codeLine: 6,
      dataState: { words, prefix: query, matches: words.filter((w: string) => w.startsWith(query)), activeChar: null },
      message: `Word "${query}" confirmed in Trie! isEndOfWord flag is true. Autocomplete suggestions: [${words.filter((w: string) => w.startsWith(query)).join(', ')}].`,
      reason: { action: `Word "${query}" Found`, why: `Entire path verified and isEndOfWord flag is true.`, rule: 'curr.isEndOfWord == true', values: { word: query }, details: 'Search finished in O(L) time.' },
    };
  },
};

// ==========================================
// 2D Grid Image Flood Fill
// ==========================================
export const matrixFloodFill: AlgorithmDefinition = {
  id: 'matrix-flood-fill',
  name: '2D Grid Image Flood Fill',
  category: 'matrix',
  categoryName: 'Matrix & 2D Grid',
  part: 'ds',
  difficulty: 'Medium',
  description: 'Simulates graphic paint bucket flood fill using 4-directional breadth/depth-first expansion.',
  realLifeExample: 'Photoshop paint bucket tool filling contiguous regions of identical color.',
  complexity: { time: { best: 'O(M × N)', average: 'O(M × N)', worst: 'O(M × N)' }, space: { worst: 'O(M × N)' } },
  pseudocode: [
    'floodFill(r, c, newColor):',
    '    if out of bounds or grid[r][c] != origColor: return',
    '    grid[r][c] = newColor',
    '    recurse(r+1, c); recurse(r-1, c); recurse(r, c+1); recurse(r, c-1)',
  ],
  explanation: 'Expands along connected cardinal directions (North, South, East, West) repainting contiguous pixels.',
  tags: ['Matrix', 'Flood Fill', 'BFS', 'DFS'],
  boardType: 'grid-matrix',
  defaultInput: { rows: 4, cols: 5 },
  presets: [{ label: '4x5 Grid', value: { rows: 4, cols: 5 } }],
  generateRandomInput: () => ({ rows: 4, cols: 4 }),
  *run(): Generator<StepAction, void, unknown> {
    const grid = [
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 1],
      [1, 0, 0, 1, 1],
      [0, 0, 1, 1, 1],
    ];
    const visited: [number, number][] = [];

    yield {
      type: 'start',
      codeLine: 1,
      gridCell: [0, 0],
      visitedCells: [],
      dataState: { grid, currentCell: [0, 0], visitedCells: [], islandsCount: 1 },
      message: 'Starting Flood Fill at pixel (0, 0). Repainting connected land (1) into water (0).',
      reason: { action: 'Init Flood Fill', why: 'Starting at coordinate (0, 0).', rule: 'seed pixel', values: { r: 0, c: 0 }, details: 'BFS/DFS ripple initialized.' },
    };

    const cellsToFill: [number, number][] = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 0]];
    for (const [r, c] of cellsToFill) {
      visited.push([r, c]);
      grid[r][c] = 0; // Filled

      yield {
        type: 'step',
        codeLine: 3,
        gridCell: [r, c],
        visitedCells: [...visited],
        dataState: { grid: grid.map((row) => [...row]), currentCell: [r, c], visitedCells: [...visited], islandsCount: 1 },
        message: `Filled pixel at (${r}, ${c}). Repainted to filled color.`,
        reason: { action: `Fill pixel (${r}, ${c})`, why: `Adjacent matching color pixel repainted.`, rule: 'grid[r][c] = newColor', values: { r, c }, details: 'Cardinal expansion.' },
      };
    }

    yield {
      type: 'complete',
      codeLine: 4,
      gridCell: null,
      visitedCells: [...visited],
      dataState: { grid: grid.map((row) => [...row]), currentCell: null, visitedCells: [...visited], islandsCount: 1 },
      message: 'Flood fill complete! All connected matching pixels repainted.',
      reason: { action: 'Flood Fill Done', why: 'Connected component completely repainted.', rule: 'All neighbors processed', values: { filledCount: visited.length }, details: 'Complete.' },
    };
  },
};

// ==========================================
// Spiral Order Matrix Traversal
// ==========================================
export const matrixSpiralOrder: AlgorithmDefinition = {
  id: 'matrix-spiral-order',
  name: 'Spiral Order Matrix Traversal',
  category: 'matrix',
  categoryName: 'Matrix & 2D Grid',
  part: 'ds',
  difficulty: 'Medium',
  description: 'Traverses a 2D matrix in a clockwise inward spiral using top, bottom, left, right boundary pointers.',
  realLifeExample: 'Camera sensor raster scanning or robotics cleaning floor path planning.',
  complexity: { time: { best: 'O(M × N)', average: 'O(M × N)', worst: 'O(M × N)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'traverse top row left to right; top++',
    'traverse right column top to bottom; right--',
    'traverse bottom row right to left; bottom--',
    'traverse left column bottom to top; left++',
  ],
  explanation: 'Boundary contractions prevent visiting already processed perimeter cells.',
  tags: ['Matrix', 'Spiral', 'Simulation'],
  boardType: 'grid-matrix',
  defaultInput: { rows: 3, cols: 3 },
  presets: [{ label: '3x3 Matrix', value: { rows: 3, cols: 3 } }],
  generateRandomInput: () => ({ rows: 3, cols: 3 }),
  *run(): Generator<StepAction, void, unknown> {
    const grid = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const spiralOrder: [number, number][] = [
      [0, 0], [0, 1], [0, 2],
      [1, 2], [2, 2],
      [2, 1], [2, 0],
      [1, 0],
      [1, 1],
    ];
    const visited: [number, number][] = [];

    yield {
      type: 'start',
      codeLine: 1,
      gridCell: [0, 0],
      visitedCells: [],
      dataState: { grid, currentCell: [0, 0], visitedCells: [] },
      message: 'Starting Clockwise Spiral Traversal on 3x3 Matrix. Top-left cell is 1.',
      reason: { action: 'Init Spiral', why: 'Setting initial boundaries: top=0, bottom=2, left=0, right=2.', rule: 'Boundary setup', values: {}, details: 'Clockwise path begins.' },
    };

    for (const [r, c] of spiralOrder) {
      visited.push([r, c]);
      const val = grid[r][c];

      yield {
        type: 'step',
        codeLine: 1,
        gridCell: [r, c],
        visitedCells: [...visited],
        dataState: { grid, currentCell: [r, c], visitedCells: [...visited] },
        message: `Visited cell (${r}, ${c}) = ${val}. Spiral sequence: [${visited.map(([vr, vc]) => grid[vr][vc]).join(' -> ')}].`,
        reason: {
          action: `Visit cell (${r}, ${c})`,
          why: `Moving along current spiral perimeter.`,
          rule: 'Spiral boundary crawl',
          values: { val, r, c },
          details: 'Boundary contracted inward.',
        },
      };
    }

    yield {
      type: 'complete',
      codeLine: 4,
      gridCell: null,
      visitedCells: [...visited],
      dataState: { grid, currentCell: null, visitedCells: [...visited] },
      message: 'Spiral traversal complete! Output: 1 -> 2 -> 3 -> 6 -> 9 -> 8 -> 7 -> 4 -> 5.',
      reason: { action: 'Spiral Complete', why: 'All 9 cells visited clockwise from boundary to center.', rule: 'All cells visited', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// Tower of Hanoi (Recursion & Call Stack)
// ==========================================
export const towerOfHanoi: AlgorithmDefinition = {
  id: 'tower-of-hanoi',
  name: 'Tower of Hanoi & Call Stack',
  category: 'recursion',
  categoryName: 'Recursion & Call Stack',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Moves N disks between 3 pegs without ever placing a larger disk onto a smaller disk in 2^n - 1 moves.',
  realLifeExample: 'Backup rotation schemes and recursive directory tree replication.',
  complexity: { time: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'hanoi(n, from, aux, to):',
    '    if n == 1: move(from, to); return',
    '    hanoi(n - 1, from, to, aux)',
    '    move(from, to)',
    '    hanoi(n - 1, aux, from, to)',
  ],
  explanation: 'Solves N disks by recursively moving top N-1 disks to auxiliary peg, moving largest disk to target peg, then moving N-1 disks onto target peg.',
  tags: ['Recursion', 'Hanoi', 'Call Stack'],
  boardType: 'recursion-tree',
  defaultInput: { disks: 3 },
  presets: [{ label: '3 Disks (7 moves)', value: { disks: 3 } }],
  generateRandomInput: () => ({ disks: 3 }),
  *run(): Generator<StepAction, void, unknown> {
    const pegs: Record<'A' | 'B' | 'C', number[]> = {
      A: [3, 2, 1],
      B: [],
      C: [],
    };
    const callStack: { name: string; args: string }[] = [{ name: 'hanoi', args: 'n=3, A->C via B' }];

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { type: 'hanoi', pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] }, callStack: [...callStack] },
      message: 'Tower of Hanoi: Initial 3 disks stacked on Peg A. Goal: Move all disks to Peg C using Peg B.',
      reason: { action: 'Init Hanoi', why: 'Stack of 3 disks placed on Peg A in decreasing size order.', rule: 'hanoi(3, A, B, C)', values: { disks: 3 }, details: 'Requires 2³ - 1 = 7 moves.' },
    };

    const movesWithStack: {
      disk: number;
      from: 'A' | 'B' | 'C';
      to: 'A' | 'B' | 'C';
      stack: { name: string; args: string }[];
      explanation: string;
    }[] = [
      {
        disk: 1,
        from: 'A',
        to: 'C',
        stack: [
          { name: 'hanoi', args: 'n=3, A->C via B' },
          { name: 'hanoi', args: 'n=2, A->B via C' },
          { name: 'hanoi', args: 'n=1, A->C via B' },
        ],
        explanation: 'Base case n=1 reached: transfer smallest disk 1 directly to Peg C.',
      },
      {
        disk: 2,
        from: 'A',
        to: 'B',
        stack: [
          { name: 'hanoi', args: 'n=3, A->C via B' },
          { name: 'hanoi', args: 'n=2, A->B via C' },
        ],
        explanation: 'Unwound to n=2: move medium disk 2 to auxiliary Peg B.',
      },
      {
        disk: 1,
        from: 'C',
        to: 'B',
        stack: [
          { name: 'hanoi', args: 'n=3, A->C via B' },
          { name: 'hanoi', args: 'n=2, A->B via C' },
          { name: 'hanoi', args: 'n=1, C->B via A' },
        ],
        explanation: 'Move disk 1 from Peg C onto Peg B above disk 2, freeing Peg C for disk 3.',
      },
      {
        disk: 3,
        from: 'A',
        to: 'C',
        stack: [{ name: 'hanoi', args: 'n=3, A->C via B' }],
        explanation: 'Subproblem of size 2 solved on Peg B! Largest disk 3 moves directly to destination Peg C.',
      },
      {
        disk: 1,
        from: 'B',
        to: 'A',
        stack: [
          { name: 'hanoi', args: 'n=3, A->C via B' },
          { name: 'hanoi', args: 'n=2, B->C via A' },
          { name: 'hanoi', args: 'n=1, B->A via C' },
        ],
        explanation: 'Now solving n=2 on Peg B: move disk 1 to Peg A to uncover disk 2.',
      },
      {
        disk: 2,
        from: 'B',
        to: 'C',
        stack: [
          { name: 'hanoi', args: 'n=3, A->C via B' },
          { name: 'hanoi', args: 'n=2, B->C via A' },
        ],
        explanation: 'Move disk 2 from Peg B to target Peg C directly on top of disk 3.',
      },
      {
        disk: 1,
        from: 'A',
        to: 'C',
        stack: [
          { name: 'hanoi', args: 'n=3, A->C via B' },
          { name: 'hanoi', args: 'n=2, B->C via A' },
          { name: 'hanoi', args: 'n=1, A->C via B' },
        ],
        explanation: 'Final step! Move smallest disk 1 onto Peg C to complete the full tower.',
      },
    ];

    let moveNum = 1;
    for (const m of movesWithStack) {
      pegs[m.from].pop();
      pegs[m.to].push(m.disk);

      yield {
        type: 'step',
        codeLine: 4,
        dataState: {
          type: 'hanoi',
          pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] },
          callStack: [...m.stack],
          moveNumber: moveNum,
          totalMoves: 7,
          activeDisk: m.disk,
          fromPeg: m.from,
          toPeg: m.to,
        },
        message: `Move #${moveNum} of 7: Transferred Disk ${m.disk} from Peg ${m.from} to Peg ${m.to}.`,
        reason: {
          action: `Move Disk ${m.disk}: ${m.from} -> ${m.to}`,
          why: m.explanation,
          rule: 'move(from, to) without placing larger disk on smaller',
          values: { disk: m.disk, from: m.from, to: m.to, move: moveNum, remaining: 7 - moveNum },
          details: 'Valid move constraint preserved.',
        },
      };
      moveNum++;
    }

    yield {
      type: 'complete',
      codeLine: 1,
      dataState: { type: 'hanoi', pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] }, callStack: [] },
      message: 'Tower of Hanoi puzzle solved in exactly 7 moves! All disks safely on Peg C.',
      reason: { action: 'Hanoi Solved', why: 'All 3 disks moved to Peg C following non-violation constraint.', rule: '2ⁿ - 1 moves', values: { moves: 7 }, details: 'Optimal 2ⁿ-1 move sequence achieved.' },
    };
  },
};

// ==========================================
// Selection Sort
// ==========================================
export const selectionSort: AlgorithmDefinition = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting',
  categoryName: 'Sorting Algorithms',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Repeatedly finds minimum element from unsorted portion and places it at the sorted boundary.',
  realLifeExample: 'Sorting playing cards in hand by repeatedly scanning for the lowest card.',
  complexity: { time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'for i = 0 to n - 2:',
    '    minIdx = i',
    '    for j = i + 1 to n - 1:',
    '        if arr[j] < arr[minIdx]: minIdx = j',
    '    swap(arr[i], arr[minIdx])',
  ],
  explanation: 'Performs at most N swaps, making it useful when memory write operations are expensive.',
  tags: ['Sorting', 'Selection Sort'],
  boardType: 'array-sort',
  defaultInput: { array: [29, 10, 14, 37, 13] },
  presets: [{ label: '[29, 10, 14, 37, 13]', value: { array: [29, 10, 14, 37, 13] } }],
  generateRandomInput: () => ({ array: [25, 12, 33, 17, 8] }),
  *run(input): Generator<StepAction, void, unknown> {
    const arr = [...(input.array || [29, 10, 14, 37, 13])];
    const n = arr.length;

    yield {
      type: 'start',
      codeLine: 1,
      indices: [0],
      dataState: { array: [...arr], sortedIndices: [] },
      message: `Initial Array for Selection Sort: [${arr.join(', ')}].`,
      reason: { action: 'Init Selection Sort', why: 'Unsorted array ready for minimum element selection.', rule: 'start at i=0', values: { array: arr }, details: 'Outer loop boundary at index 0.' },
    };

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      for (let j = i + 1; j < n; j++) {
        yield {
          type: 'compare',
          codeLine: 4,
          indices: [j, minIdx],
          pointers: { i, j, minIdx },
          dataState: { array: [...arr], sortedIndices: Array.from({ length: i }, (_, k) => k) },
          message: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}).`,
          reason: { action: `Compare: ${arr[j]} vs ${arr[minIdx]}`, why: `Scanning unsorted portion for smallest key.`, rule: 'arr[j] < arr[minIdx]', values: { valJ: arr[j], valMin: arr[minIdx] }, details: 'Minimum candidate search.' },
        };

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;

        yield {
          type: 'swap',
          codeLine: 5,
          indices: [i, minIdx],
          pointers: { i, minIdx },
          dataState: { array: [...arr], sortedIndices: Array.from({ length: i + 1 }, (_, k) => k) },
          message: `Swapped minimum element ${arr[i]} into sorted position index ${i}.`,
          reason: { action: `Swap: arr[${i}] <-> arr[${minIdx}]`, why: `Placed smallest remaining element into position index ${i}.`, rule: 'swap(arr[i], arr[minIdx])', values: { val: arr[i] }, details: 'Sorted prefix expanded.' },
        };
      }
    }

    yield {
      type: 'complete',
      codeLine: 1,
      indices: [],
      dataState: { array: [...arr], sortedIndices: Array.from({ length: n }, (_, k) => k) },
      message: `Selection Sort complete! Sorted array: [${arr.join(', ')}].`,
      reason: { action: 'Selection Sort Complete', why: 'All elements placed into sorted order.', rule: 'O(n²) time', values: {}, details: 'Complete.' },
    };
  },
};

// ==========================================
// Merge Sort (Divide & Conquer)
// ==========================================
export const mergeSortTree: AlgorithmDefinition = {
  id: 'merge-sort-tree',
  name: 'Merge Sort (Divide & Conquer)',
  category: 'sorting',
  categoryName: 'Sorting Algorithms',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'First builds the split tree level by level (array boxes dividing into rows), then merges going back up: two pointers pick smaller elements copied into new merged rows.',
  realLifeExample: 'Sorting physical exam answer sheets by dividing among teachers and merging sorted batches.',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'mergeSort(arr, left, right):',
    '    if left >= right: return',
    '    mid = left + (right - left) / 2',
    '    mergeSort(arr, left, mid); mergeSort(arr, mid + 1, right)',
    '    merge(arr, left, mid, right)',
  ],
  explanation: 'First builds the split tree level by level, then merges back upward: two pointers pick the smaller element, copied into a new merged row.',
  tags: ['Sorting', 'Merge Sort', 'Divide and Conquer', 'Split Tree'],
  boardType: 'divide-conquer-tree',
  defaultInput: { array: [38, 27, 43, 3, 9, 82, 10, 19] },
  presets: [{ label: '[38, 27, 43, 3, 9, 82, 10, 19]', value: { array: [38, 27, 43, 3, 9, 82, 10, 19] } }],
  generateRandomInput: () => ({ array: [38, 27, 43, 3, 9, 82, 10, 19] }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateMergeSortTreeSteps(input?.array || [38, 27, 43, 3, 9, 82, 10, 19]);
  },
};

// ==========================================
// Quick Sort (Pivot Partitioning)
// ==========================================
export const quickSortPartition: AlgorithmDefinition = {
  id: 'quick-sort-partition',
  name: 'Quick Sort (Pivot Partitioning)',
  category: 'sorting',
  categoryName: 'Sorting Algorithms',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Selects a benchmark pivot and partitions elements: smaller keys to left, larger keys to right.',
  realLifeExample: 'Organizing library books by picking a benchmark height and separating into shorter and taller stacks.',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: { worst: 'O(log n)' } },
  pseudocode: [
    'pivot = arr[high], i = low - 1',
    'for j = low to high - 1:',
    '    if arr[j] < pivot: i++; swap(arr[i], arr[j])',
    'swap(arr[i + 1], arr[high]); return i + 1',
  ],
  explanation: 'Fastest general-purpose in-place sorting algorithm in practical applications due to cache efficiency.',
  tags: ['Sorting', 'Quick Sort', 'Partition'],
  boardType: 'array-sort',
  defaultInput: { array: [10, 80, 30, 90, 40, 50, 70] },
  presets: [{ label: '[10, 80, 30, 90, 40, 50, 70]', value: { array: [10, 80, 30, 90, 40, 50, 70] } }],
  generateRandomInput: () => ({ array: [24, 9, 29, 14, 40] }),
  *run(input): Generator<StepAction, void, unknown> {
    const arr = [...(input.array || [10, 80, 30, 90, 40, 50, 70])];
    const n = arr.length;
    const sortedIndices: number[] = [];

    yield {
      type: 'start',
      codeLine: 1,
      indices: [0, n - 1],
      pointers: { pivot: n - 1 },
      dataState: { array: [...arr], sortedIndices: [] },
      message: `Quick Sort initialized on array of size ${n}: [${arr.join(', ')}].`,
      reason: {
        action: 'Init Quick Sort',
        why: 'Initiating recursive pivot partitioning.',
        rule: 'quickSort(0, n-1)',
        values: { size: n },
        details: 'Elements < pivot move left; > pivot move right.',
      },
    };

    function* recursiveQuickSort(low: number, high: number): Generator<StepAction, void, unknown> {
      if (low >= high) {
        if (low === high && !sortedIndices.includes(low)) {
          sortedIndices.push(low);
          sortedIndices.sort((a, b) => a - b);
          yield {
            type: 'sorted',
            codeLine: 4,
            indices: [low],
            pointers: { pivotFinal: low },
            dataState: { array: [...arr], sortedIndices: [...sortedIndices] },
            message: `Subarray of size 1 at index ${low} (${arr[low]}) is trivially sorted.`,
            reason: {
              action: `Single element settled at index ${low}`,
              why: 'Base case of size 1 has no elements to compare.',
              rule: 'low >= high',
              values: { index: low, value: arr[low] },
            },
          };
        }
        return;
      }

      const pivot = arr[high];

      yield {
        type: 'highlight',
        codeLine: 1,
        indices: [high],
        pointers: { pivot: high },
        dataState: { array: [...arr], sortedIndices: [...sortedIndices] },
        message: `Partition range [${low}..${high}]: Chosen pivot arr[${high}] = ${pivot}.`,
        reason: {
          action: `Select Pivot: ${pivot}`,
          why: `Chosen benchmark pivot at end of range [${low}..${high}].`,
          rule: 'pivot = arr[high]',
          values: { range: [low, high], pivot },
        },
      };

      let i = low - 1;

      for (let j = low; j < high; j++) {
        yield {
          type: 'compare',
          codeLine: 3,
          indices: [j, high],
          pointers: { i: Math.max(i, low), j, pivot: high },
          dataState: { array: [...arr], comparing: [j, high], sortedIndices: [...sortedIndices] },
          message: `Scanning j = ${j}: Comparing arr[${j}] = ${arr[j]} with pivot ${pivot}.`,
          reason: {
            action: `Compare: arr[${j}] vs pivot`,
            why: `Determining if arr[${j}]=${arr[j]} belongs to left partition (< ${pivot}).`,
            rule: 'arr[j] < pivot ?',
            values: { j, val: arr[j], pivot, iBoundary: i },
          },
        };

        if (arr[j] < pivot) {
          i++;
          if (i !== j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            yield {
              type: 'swap',
              codeLine: 3,
              indices: [i, j],
              pointers: { i, j, pivot: high },
              dataState: { array: [...arr], swapped: [i, j], sortedIndices: [...sortedIndices] },
              message: `arr[${j}] < ${pivot}. Advanced i to ${i} and swapped arr[${i}] <-> arr[${j}].`,
              reason: {
                action: `Swap: arr[${i}] <-> arr[${j}]`,
                why: `Moved smaller element ${arr[i]} into left partition boundary i=${i}.`,
                rule: 'swap(arr[i], arr[j])',
                values: { i, j, movedVal: arr[i] },
              },
            };
          }
        }
      }

      // Place pivot in correct position at i + 1
      const pPos = i + 1;
      const tempP = arr[pPos];
      arr[pPos] = arr[high];
      arr[high] = tempP;

      if (!sortedIndices.includes(pPos)) {
        sortedIndices.push(pPos);
        sortedIndices.sort((a, b) => a - b);
      }

      yield {
        type: 'sorted',
        codeLine: 4,
        indices: [pPos],
        pointers: { pivotFinal: pPos },
        dataState: { array: [...arr], swapped: [pPos, high], sortedIndices: [...sortedIndices] },
        message: `Pivot ${pivot} placed into its permanent sorted position at index ${pPos}! Left < ${pivot}, Right >= ${pivot}.`,
        reason: {
          action: `Place Pivot at index ${pPos}`,
          why: `All keys to left [${low}..${pPos - 1}] are < ${pivot}; all keys to right [${pPos + 1}..${high}] are >= ${pivot}.`,
          rule: 'swap(arr[i+1], arr[high])',
          values: { pivot, finalIndex: pPos },
          details: 'Pivot permanently locked in position.',
        },
      };

      // Recursively partition left and right
      yield* recursiveQuickSort(low, pPos - 1);
      yield* recursiveQuickSort(pPos + 1, high);
    }

    yield* recursiveQuickSort(0, n - 1);

    yield {
      type: 'complete',
      codeLine: 4,
      indices: [],
      dataState: { array: [...arr], sortedIndices: Array.from({ length: n }, (_, k) => k) },
      message: `Quick Sort completed! Fully sorted array: [${arr.join(', ')}].`,
      reason: {
        action: 'Quick Sort Complete',
        why: 'All sub-arrays recursively partitioned and settled in O(n log n) average time.',
        rule: 'In-place partitioned',
        values: { sorted: arr },
        details: 'Complete.',
      },
    };
  },
};

// ==========================================
// Divide & Conquer Algorithms (Merge, Quick, Binary Search D&C)
// ==========================================
export const divideConquerMerge: AlgorithmDefinition = {
  id: 'divide-conquer-merge',
  name: 'Merge Sort Split & Merge Tree',
  category: 'divide-and-conquer',
  categoryName: 'Divide and Conquer',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'First builds the split tree level by level (array boxes dividing into rows), then merges going back up: two pointers pick smaller elements copied into new merged rows.',
  realLifeExample: 'Tournament brackets splitting into head-to-head pairs then merging winners upward to champion.',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'Divide: split array box into two children boxes',
    'Conquer: base singletons reached at leaves',
    'Combine: two pointers pick smaller element, copied to parent row',
  ],
  explanation: 'Builds the live recursive split tree downwards, then combines sorted subproblems upward level by level.',
  tags: ['Divide and Conquer', 'Merge Sort Tree', 'Split & Merge'],
  boardType: 'divide-conquer-tree',
  defaultInput: { array: [38, 27, 43, 3, 9, 82, 10, 19] },
  presets: [{ label: '[38, 27, 43, 3, 9, 82, 10, 19]', value: { array: [38, 27, 43, 3, 9, 82, 10, 19] } }],
  generateRandomInput: () => ({ array: [38, 27, 43, 3, 9, 82, 10, 19] }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateMergeSortTreeSteps(input?.array || [38, 27, 43, 3, 9, 82, 10, 19]);
  },
};

export const divideConquerQuick: AlgorithmDefinition = {
  id: 'divide-conquer-quick',
  name: 'Quick Sort Partition Tree',
  category: 'divide-and-conquer',
  categoryName: 'Divide and Conquer',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Recursively partitions array around a chosen pivot, showing partition tree branches for left (< pivot) and right (>= pivot) subproblems.',
  realLifeExample: 'Sorting mail by destination postal code benchmarks into separate bins.',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: { worst: 'O(log n)' } },
  pseudocode: [
    'Choose benchmark pivot (arr[high])',
    'Partition elements: Left < Pivot <= Right',
    'Recursively build partition tree for left and right',
  ],
  explanation: 'Visualizes divide-and-conquer partitioning tree with pivots locked in place at each level.',
  tags: ['Divide and Conquer', 'Quick Sort', 'Partition Tree'],
  boardType: 'divide-conquer-tree',
  defaultInput: { array: [10, 80, 30, 90, 40, 50, 70] },
  presets: [{ label: '[10, 80, 30, 90, 40, 50, 70]', value: { array: [10, 80, 30, 90, 40, 50, 70] } }],
  generateRandomInput: () => ({ array: [25, 60, 15, 80, 35] }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateQuickSortPartitionTree(input.array || [10, 80, 30, 90, 40, 50, 70]);
  },
};

export const divideConquerBinary: AlgorithmDefinition = {
  id: 'divide-conquer-binary',
  name: 'Binary Search as D&C Halving Tree',
  category: 'divide-and-conquer',
  categoryName: 'Divide and Conquer',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Applies divide and conquer to reduce search space by half at each level: tests middle element, discards irrelevant half, and conquers remaining half.',
  realLifeExample: 'Binary search guessing game: guessing a secret number between 1 and 100 by guessing 50 first.',
  complexity: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'mid = floor((low + high) / 2)',
    'if arr[mid] == target: match found',
    'else if target < arr[mid]: conquer left interval [low..mid-1]',
    'else: conquer right interval [mid+1..high]',
  ],
  explanation: 'Shows the logarithmic interval halving tree down to the matched target leaf.',
  tags: ['Divide and Conquer', 'Binary Search', 'Interval Halving'],
  boardType: 'divide-conquer-tree',
  defaultInput: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 72 },
  presets: [{ label: 'Find 72 (Tree Depth 3)', value: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 72 } }],
  generateRandomInput: () => ({ array: [3, 9, 14, 28, 35, 49, 62, 77, 88], target: 62 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateBinarySearchDCTree(input.array || [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], input.target ?? 72);
  },
};

// ==========================================
// 0/1 Knapsack Animated Table
// ==========================================
export const knapsack01Table: AlgorithmDefinition = {
  id: 'knapsack-01-table',
  name: '0/1 Knapsack Animated Table',
  category: 'dp',
  categoryName: 'Dynamic Programming',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Maximizes value within weight capacity by filling a 2D dynamic programming memoization table.',
  realLifeExample: 'Hiker packing a backpack with limited weight capacity picking highest utility items.',
  complexity: { time: { best: 'O(N × W)', average: 'O(N × W)', worst: 'O(N × W)' }, space: { worst: 'O(N × W)' } },
  pseudocode: [
    'for i = 1 to N:',
    '    for w = 1 to W:',
    '        if wt[i-1] <= w:',
    '            dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])',
    '        else: dp[i][w] = dp[i-1][w]',
  ],
  explanation: 'At each cell [i, w], we choose between taking the item (if capacity allows) or leaving it.',
  tags: ['DP', 'Knapsack', 'Dynamic Programming'],
  boardType: 'dp-table',
  defaultInput: { capacity: 4 },
  presets: [{ label: 'Capacity 4 (Optimal: 7)', value: { capacity: 4 } }],
  generateRandomInput: () => ({ capacity: 4 }),
  *run(): Generator<StepAction, void, unknown> {
    const weights = [1, 2, 3];
    const values = [1, 4, 6];
    const W = 4;
    const N = weights.length;

    const dpTable: number[][] = Array.from({ length: N + 1 }, () => new Array(W + 1).fill(0));
    const rowLabels = ['Ø (0)', 'Item 1 (w:1, v:1)', 'Item 2 (w:2, v:4)', 'Item 3 (w:3, v:6)'];
    const colLabels = ['w:0', 'w:1', 'w:2', 'w:3', 'w:4'];

    yield {
      type: 'start',
      codeLine: 1,
      gridCell: [0, 0],
      dataState: { dpTable: dpTable.map((r) => [...r]), rowLabels, colLabels, currentCell: [0, 0] },
      message: 'Initialized 0/1 Knapsack DP Table. Base cases (0 items or 0 capacity) are 0.',
      reason: { action: 'Init DP Table', why: 'Zero items or zero capacity yield zero profit.', rule: 'dp[0][w] = 0, dp[i][0] = 0', values: { items: N, capacity: W }, details: 'Base case initialized.' },
    };

    for (let i = 1; i <= N; i++) {
      const wt = weights[i - 1];
      const val = values[i - 1];

      for (let w = 1; w <= W; w++) {
        if (wt <= w) {
          const take = val + dpTable[i - 1][w - wt];
          const leave = dpTable[i - 1][w];
          dpTable[i][w] = Math.max(take, leave);

          yield {
            type: 'step',
            codeLine: 4,
            gridCell: [i, w],
            dataState: { dpTable: dpTable.map((r) => [...r]), rowLabels, colLabels, currentCell: [i, w] },
            message: `Cell [${i}, ${w}]: Item ${i} (wt:${wt}, val:${val}) fits. max(Take: ${val}+${dpTable[i - 1][w - wt]} = ${take}, Leave: ${leave}) = ${dpTable[i][w]}.`,
            reason: {
              action: `Compute dp[${i}][${w}] = ${dpTable[i][w]}`,
              why: `Item fits into capacity ${w}; evaluated max(take, leave).`,
              rule: 'max(val + dp[i-1][w-wt], dp[i-1][w])',
              values: { item: i, capacity: w, take, leave, chosen: dpTable[i][w] },
              details: 'Optimal subproblem recorded in table.',
            },
          };
        } else {
          dpTable[i][w] = dpTable[i - 1][w];

          yield {
            type: 'step',
            codeLine: 5,
            gridCell: [i, w],
            dataState: { dpTable: dpTable.map((r) => [...r]), rowLabels, colLabels, currentCell: [i, w] },
            message: `Cell [${i}, ${w}]: Item ${i} (wt:${wt}) exceeds capacity ${w}. Must leave: dp[${i}][${w}] = ${dpTable[i][w]}.`,
            reason: {
              action: `Cannot take item ${i}`,
              why: `Item weight ${wt} exceeds capacity ${w}; copied profit from previous row.`,
              rule: 'dp[i][w] = dp[i-1][w]',
              values: { item: i, wt, capacity: w },
              details: 'Capacity constraint enforced.',
            },
          };
        }
      }
    }

    yield {
      type: 'complete',
      codeLine: 4,
      gridCell: [N, W],
      dataState: { dpTable: dpTable.map((r) => [...r]), rowLabels, colLabels, currentCell: [N, W] },
      message: `0/1 Knapsack optimal maximum value = ${dpTable[N][W]} achieved at capacity ${W}!`,
      reason: { action: 'Knapsack Complete', why: `Bottom-right cell dp[${N}][${W}] holds globally optimal solution.`, rule: 'return dp[N][W]', values: { maxProfit: dpTable[N][W] }, details: 'DP table finished.' },
    };
  },
};

// ==========================================
// Huffman Coding Tree Builder
// ==========================================
export const huffmanCodingTree: AlgorithmDefinition = {
  id: 'huffman-coding-tree',
  name: 'Huffman Coding Tree Builder',
  category: 'greedy',
  categoryName: 'Greedy Algorithms',
  part: 'algo',
  difficulty: 'Advanced',
  description: 'Lossless data compression algorithm assigning variable-length prefix codes based on character frequency.',
  realLifeExample: 'ZIP archives, MP3 audio, and JPEG image compression.',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'pq = min-priority-queue of leaf nodes by frequency',
    'while pq.size() > 1:',
    '    left = pq.extractMin(), right = pq.extractMin()',
    '    parent = new Node(freq = left.freq + right.freq, left, right)',
    '    pq.insert(parent)',
  ],
  explanation: 'Greedily pairs the two lowest-frequency subtrees to build an optimal prefix binary tree.',
  tags: ['Greedy', 'Huffman', 'Compression'],
  boardType: 'tree-board',
  defaultInput: { text: 'ABRACADABRA' },
  presets: [{ label: 'ABRACADABRA', value: { text: 'ABRACADABRA' } }],
  generateRandomInput: () => ({ text: 'BEEP BOOP' }),
  *run(): Generator<StepAction, void, unknown> {
    const leafNodes = [
      { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: null },
      { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: null },
      { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: null },
      { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: null },
      { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: null },
    ];

    yield {
      type: 'start',
      codeLine: 1,
      indices: [8, 9],
      dataState: {
        nodes: [...leafNodes],
        edges: [],
        activeNodeId: 8,
        traversalOutput: ['Leaves: C:1, D:1, B:2, R:2, A:5'],
      },
      message: "Initialized Huffman Priority Queue for 'ABRACADABRA'. Extracted character frequencies: A(5), R(2), B(2), C(1), D(1).",
      reason: {
        action: 'Init Priority Queue',
        why: 'Insert all distinct characters as leaf nodes sorted by frequency into priority queue.',
        rule: 'pq.insert(leaf)',
        values: { A: 5, R: 2, B: 2, C: 1, D: 1 },
      },
    };

    // Step 1: Pair C(1) + D(1) -> CD(2)
    const stage1Nodes = [
      { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: null },
      { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7 },
      { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7 },
      { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: null },
      { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: null },
      { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: null },
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
        traversalOutput: ['Combined C(1)+D(1)=CD(2)', 'PQ: CD(2), B(2), R(2), A(5)'],
      },
      message: 'Greedy Step 1: Extracted two lowest frequencies C(1) and D(1); merged under parent node CD with sum frequency 2.',
      reason: {
        action: 'Merge C & D',
        why: 'C and D have the lowest frequencies (1 each) in the priority queue.',
        rule: 'parent.freq = left.freq + right.freq',
        values: { left: 'C(1)', right: 'D(1)', sum: 2 },
      },
    };

    // Step 2: Pair B(2) + CD(2) -> BCD(4)
    const stage2Nodes = [
      { id: 5, val: 'BCD (4)', leftId: 6, rightId: 7, parentId: null },
      { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: 5 },
      { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: 5 },
      { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7 },
      { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7 },
      { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: null },
      { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: null },
    ];
    const stage2Edges = [
      { from: 5, to: 6, weight: 0 },
      { from: 5, to: 7, weight: 1 },
      { from: 7, to: 8, weight: 0 },
      { from: 7, to: 9, weight: 1 },
    ];
    yield {
      type: 'step',
      codeLine: 4,
      indices: [5],
      dataState: {
        nodes: stage2Nodes,
        edges: stage2Edges,
        activeNodeId: 5,
        traversalOutput: ['Combined B(2)+CD(2)=BCD(4)', 'PQ: R(2), BCD(4), A(5)'],
      },
      message: 'Greedy Step 2: Extracted B(2) and CD(2); merged under parent node BCD with sum frequency 4.',
      reason: {
        action: 'Merge B & CD',
        why: 'B(2) and CD(2) are now the two lowest frequencies in PQ.',
        rule: 'parent.freq = left.freq + right.freq',
        values: { left: 'B(2)', right: 'CD(2)', sum: 4 },
      },
    };

    // Step 3: Pair R(2) + BCD(4) -> RBCD(6)
    const stage3Nodes = [
      { id: 3, val: 'RBCD (6)', leftId: 4, rightId: 5, parentId: null },
      { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: 3 },
      { id: 5, val: 'BCD (4)', leftId: 6, rightId: 7, parentId: 3 },
      { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: 5 },
      { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: 5 },
      { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7 },
      { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7 },
      { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: null },
    ];
    const stage3Edges = [
      { from: 3, to: 4, weight: 0 },
      { from: 3, to: 5, weight: 1 },
      { from: 5, to: 6, weight: 0 },
      { from: 5, to: 7, weight: 1 },
      { from: 7, to: 8, weight: 0 },
      { from: 7, to: 9, weight: 1 },
    ];
    yield {
      type: 'step',
      codeLine: 4,
      indices: [3],
      dataState: {
        nodes: stage3Nodes,
        edges: stage3Edges,
        activeNodeId: 3,
        traversalOutput: ['Combined R(2)+BCD(4)=RBCD(6)', 'PQ: A(5), RBCD(6)'],
      },
      message: 'Greedy Step 3: Extracted R(2) and BCD(4); merged under parent node RBCD with sum frequency 6.',
      reason: {
        action: 'Merge R & BCD',
        why: 'R(2) and BCD(4) are the two lowest frequencies in PQ.',
        rule: 'parent.freq = left.freq + right.freq',
        values: { left: 'R(2)', right: 'BCD(4)', sum: 6 },
      },
    };

    // Step 4: Final merge with A(5) -> Root (11)
    const finalNodes = [
      { id: 1, val: 'Root (11)', leftId: 2, rightId: 3, parentId: null },
      { id: 2, val: 'A (5)', leftId: null, rightId: null, parentId: 1 },
      { id: 3, val: 'RBCD (6)', leftId: 4, rightId: 5, parentId: 1 },
      { id: 4, val: 'R (2)', leftId: null, rightId: null, parentId: 3 },
      { id: 5, val: 'BCD (4)', leftId: 6, rightId: 7, parentId: 3 },
      { id: 6, val: 'B (2)', leftId: null, rightId: null, parentId: 5 },
      { id: 7, val: 'CD (2)', leftId: 8, rightId: 9, parentId: 5 },
      { id: 8, val: 'C (1)', leftId: null, rightId: null, parentId: 7 },
      { id: 9, val: 'D (1)', leftId: null, rightId: null, parentId: 7 },
    ];
    const finalEdges = [
      { from: 1, to: 2, weight: 0 },
      { from: 1, to: 3, weight: 1 },
      { from: 3, to: 4, weight: 0 },
      { from: 3, to: 5, weight: 1 },
      { from: 5, to: 6, weight: 0 },
      { from: 5, to: 7, weight: 1 },
      { from: 7, to: 8, weight: 0 },
      { from: 7, to: 9, weight: 1 },
    ];
    yield {
      type: 'complete',
      codeLine: 5,
      indices: [1, 2],
      dataState: {
        nodes: finalNodes,
        edges: finalEdges,
        activeNodeId: 1,
        traversalOutput: ['A: 0', 'R: 10', 'B: 110', 'C: 1110', 'D: 1111'],
      },
      message: "Huffman Tree completed! Root(11) constructed. 'A' gets shortest 1-bit code '0'. Zero ambiguity prefix code guaranteed.",
      reason: {
        action: 'Huffman Complete',
        why: 'Final two nodes A(5) and RBCD(6) merged into single root. Optimal prefix codes generated.',
        rule: 'Prefix tree invariant',
        values: { 'A': '0', 'R': '10', 'B': '110', 'C': '1110', 'D': '1111' },
      },
    };
  },
};

// ==========================================
// Activity Selection Problem
// ==========================================
export const activitySelectionOpt: AlgorithmDefinition = {
  id: 'activity-selection-opt',
  name: 'Activity Selection Problem',
  category: 'greedy',
  categoryName: 'Greedy Algorithms',
  part: 'algo',
  difficulty: 'Medium',
  description: 'Greedy scheduling algorithm selecting maximum compatible non-overlapping activities by earliest finish time.',
  realLifeExample: 'Classroom or boardroom meeting scheduling to accommodate maximum conferences without overlaps.',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'sort activities by finish time',
    'select first activity',
    'for i = 1 to n - 1:',
    '    if act[i].start >= lastSelected.finish: select act[i]',
  ],
  explanation: 'Picking the compatible activity that finishes earliest always leaves maximum possible time for subsequent activities.',
  tags: ['Greedy', 'Activity Selection', 'Intervals'],
  boardType: 'array-search',
  defaultInput: { array: [1, 3, 0, 5, 8, 5] },
  presets: [{ label: '6 Activities', value: { array: [1, 3, 0, 5, 8, 5] } }],
  generateRandomInput: () => ({ array: [2, 4, 1, 6, 8] }),
  *run(): Generator<StepAction, void, unknown> {
    const activities = [
      { id: 1, start: 1, end: 2 },
      { id: 2, start: 3, end: 4 },
      { id: 3, start: 0, end: 6 },
      { id: 4, start: 5, end: 7 },
      { id: 5, start: 8, end: 9 },
      { id: 6, start: 5, end: 9 },
    ];
    // Sorted by end time
    activities.sort((a, b) => a.end - b.end);

    const finishTimes = activities.map((a) => a.end);
    yield {
      type: 'start',
      codeLine: 1,
      indices: [0],
      dataState: { array: finishTimes, target: 4, low: 0, mid: 0, high: 5, discarded: [], foundIndex: 0 },
      message: `Activities sorted by finish time: [${activities.map((a) => `(${a.start}..${a.end})`).join(', ')}].`,
      reason: { action: 'Sort by Finish Time', why: 'Greedy strategy requires sorting by earliest finish time.', rule: 'sort(finish)', values: {}, details: 'Earliest finish maximizes open capacity.' },
    };

    const selected: number[] = [activities[0].id];
    let lastFinish = activities[0].end;

    for (let i = 1; i < activities.length; i++) {
      const act = activities[i];
      if (act.start >= lastFinish) {
        selected.push(act.id);
        lastFinish = act.end;

        yield {
          type: 'found',
          codeLine: 4,
          indices: [i],
          dataState: { array: finishTimes, target: selected.length, low: 0, mid: i, high: 5, discarded: [], foundIndex: i },
          message: `Selected Activity #${act.id} (${act.start}..${act.end}): start ${act.start} >= previous finish ${lastFinish}. Compatible!`,
          reason: { action: `Select Activity #${act.id}`, why: `Start time ${act.start} >= last finish time; no conflict.`, rule: 'start >= lastFinish', values: { activity: act.id, start: act.start, finish: act.end }, details: 'Non-overlapping activity scheduled.' },
        };
      } else {
        yield {
          type: 'compare',
          codeLine: 3,
          indices: [i],
          dataState: { array: finishTimes, target: selected.length, low: 0, mid: i, high: 5, discarded: [i], foundIndex: null },
          message: `Rejected Activity #${act.id} (${act.start}..${act.end}): start ${act.start} < last finish ${lastFinish} (Overlap conflict!).`,
          reason: { action: `Reject Activity #${act.id}`, why: `Overlaps with currently active schedule.`, rule: 'start < lastFinish => conflict', values: { activity: act.id }, details: 'Pruned overlapping interval.' },
        };
      }
    }

    yield {
      type: 'complete',
      codeLine: 4,
      indices: [],
      dataState: { array: finishTimes, target: selected.length, low: 0, mid: 0, high: 5, discarded: [], foundIndex: null },
      message: `Greedy selection completed! Scheduled ${selected.length} non-overlapping activities: [${selected.join(', ')}].`,
      reason: { action: 'Scheduling Complete', why: 'Maximum possible compatible activities scheduled in O(n log n) time.', rule: 'Optimal greedy bound', values: { count: selected.length }, details: 'Complete.' },
    };
  },
};

// ==========================================
// Sudoku Solver (Constraint Backtracking)
// ==========================================
export const sudokuBacktrack: AlgorithmDefinition = {
  id: 'sudoku-backtrack',
  name: 'Sudoku Solver (Constraint Pruning)',
  category: 'backtracking',
  categoryName: 'Backtracking',
  part: 'algo',
  difficulty: 'Advanced',
  description: 'Solves number puzzles using recursive choose, explore, and undo backtracking with constraint pruning.',
  realLifeExample: 'Automated airline crew scheduling and frequency assignment in telecommunications.',
  complexity: { time: { best: 'O(1)', average: 'O(9^m)', worst: 'O(9^(N×N))' }, space: { worst: 'O(N²)' } },
  pseudocode: [
    'solveSudoku(grid):',
    '    find empty cell (r, c)',
    '    for num in 1..4:',
    '        if isValid(r, c, num):',
    '            grid[r][c] = num; if solveSudoku(grid): return true',
    '            grid[r][c] = 0  // Undo / Backtrack',
  ],
  explanation: 'Prunes illegal branches instantly by checking row, column, and subgrid constraints before exploring deeper.',
  tags: ['Backtracking', 'Sudoku', 'Constraints'],
  boardType: 'grid-matrix',
  defaultInput: { emptyCells: 4 },
  presets: [{ label: '4x4 Sudoku', value: { emptyCells: 4 } }],
  generateRandomInput: () => ({ emptyCells: 4 }),
  *run(): Generator<StepAction, void, unknown> {
    const grid = [
      [1, 0, 3, 4],
      [0, 4, 1, 2],
      [4, 1, 2, 0],
      [2, 3, 0, 1],
    ];

    yield {
      type: 'start',
      codeLine: 1,
      gridCell: [0, 1],
      dataState: { grid: grid.map((r) => [...r]), currentCell: [0, 1], visitedCells: [] },
      message: 'Initial 4x4 Sudoku board loaded with empty cells. Starting constraint backtracking.',
      reason: { action: 'Init Sudoku', why: 'Starting search at first empty cell (0, 1).', rule: 'Find next empty', values: { r: 0, c: 1 }, details: 'Row, col, 2x2 box validation.' },
    };

    // Step 1: place 2 at (0, 1)
    grid[0][1] = 2;
    yield {
      type: 'step',
      codeLine: 5,
      gridCell: [0, 1],
      dataState: { grid: grid.map((r) => [...r]), currentCell: [0, 1], visitedCells: [[0, 1]] },
      message: 'Choose & Place: Put 2 at cell (0, 1). Valid in row, col, and 2x2 subgrid!',
      reason: { action: 'Place 2 at (0, 1)', why: 'Number 2 does not clash with row [1, 2, 3, 4] or column.', rule: 'isValid(0, 1, 2) == true', values: { r: 0, c: 1, num: 2 }, details: 'Constraint satisfied.' },
    };

    // Step 2: place 3 at (1, 0)
    grid[1][0] = 3;
    yield {
      type: 'step',
      codeLine: 5,
      gridCell: [1, 0],
      dataState: { grid: grid.map((r) => [...r]), currentCell: [1, 0], visitedCells: [[0, 1], [1, 0]] },
      message: 'Choose & Place: Put 3 at cell (1, 0). Valid in row 1: [3, 4, 1, 2].',
      reason: { action: 'Place 3 at (1, 0)', why: 'Number 3 satisfies all constraints.', rule: 'isValid(1, 0, 3)', values: { r: 1, c: 0, num: 3 }, details: 'Deepening search.' },
    };

    // Step 3: place 3 at (2, 3) and 4 at (3, 2)
    grid[2][3] = 3;
    grid[3][2] = 4;
    yield {
      type: 'complete',
      codeLine: 5,
      gridCell: null,
      dataState: { grid: grid.map((r) => [...r]), currentCell: null, visitedCells: [[0, 1], [1, 0], [2, 3], [3, 2]] },
      message: 'Sudoku successfully solved without any constraint violations!',
      reason: { action: 'Sudoku Solved', why: 'All grid cells satisfied row, column, and 2x2 block constraints.', rule: 'Solution found', values: {}, details: 'Backtracking complete.' },
    };
  },
};

// ==========================================
// Bit Manipulation
// ==========================================
export const bitManipulation: AlgorithmDefinition = {
  id: 'bit-manipulation',
  name: 'Bit Manipulation: AND, OR, XOR & Shifts',
  category: 'bit-manipulation',
  categoryName: 'Bit Manipulation',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Low-level binary operations performing bitwise AND, OR, XOR, shifts, and Brian Kernighan set bits count in O(1) CPU cycles.',
  realLifeExample: 'Graphics RGBA color packing, bitmask flags in permissions, and cryptographic hashing.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'A & B  // Bitwise AND',
    'A | B  // Bitwise OR',
    'A ^ B  // Bitwise XOR',
    'countSetBits: while n > 0: n = n & (n - 1); count++',
  ],
  explanation: 'Operates directly on binary registers at hardware speed with zero abstraction overhead.',
  tags: ['Bits', 'Binary', 'Bitwise'],
  boardType: 'bit-cells',
  defaultInput: { numA: 25, numB: 14 },
  presets: [{ label: 'A=25, B=14', value: { numA: 25, numB: 14 } }],
  generateRandomInput: () => ({ numA: 25, numB: 14 }),
  *run(): Generator<StepAction, void, unknown> {
    const a = 25; // 00011001
    const b = 14; // 00001110
    const toBin = (n: number) => n.toString(2).padStart(8, '0');

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { numA: a, numB: b, binA: toBin(a), binB: toBin(b), resultBin: toBin(a & b), opName: 'A AND B' },
      message: `Bit Manipulation: A = ${a} (${toBin(a)}), B = ${b} (${toBin(b)}).`,
      reason: { action: 'Init Bits', why: 'Loading operands into 8-bit registers.', rule: 'Binary representation', values: { a, b }, details: 'Hardware register layout.' },
    };

    yield {
      type: 'step',
      codeLine: 1,
      dataState: { numA: a, numB: b, binA: toBin(a), binB: toBin(b), resultBin: toBin(a & b), opName: 'A & B (AND)' },
      message: `Bitwise AND (A & B) = ${a & b} (${toBin(a & b)}). A bit is 1 only if BOTH bits are 1.`,
      reason: { action: 'Execute AND', why: '1 & 1 = 1; all other bit pairs produce 0.', rule: 'A & B', values: { result: a & b }, details: 'Bitwise mask extraction.' },
    };

    yield {
      type: 'step',
      codeLine: 2,
      dataState: { numA: a, numB: b, binA: toBin(a), binB: toBin(b), resultBin: toBin(a | b), opName: 'A | B (OR)' },
      message: `Bitwise OR (A | B) = ${a | b} (${toBin(a | b)}). A bit is 1 if AT LEAST ONE bit is 1.`,
      reason: { action: 'Execute OR', why: 'Combines flag sets from both operands.', rule: 'A | B', values: { result: a | b }, details: 'Bitwise union.' },
    };

    yield {
      type: 'step',
      codeLine: 3,
      dataState: { numA: a, numB: b, binA: toBin(a), binB: toBin(b), resultBin: toBin(a ^ b), opName: 'A ^ B (XOR)' },
      message: `Bitwise XOR (A ^ B) = ${a ^ b} (${toBin(a ^ b)}). A bit is 1 if bits DIFFER (1 ^ 0 = 1, 1 ^ 1 = 0).`,
      reason: { action: 'Execute XOR', why: 'Finds differing bit positions; self-inverse (x ^ x = 0).', rule: 'A ^ B', values: { result: a ^ b }, details: 'Parity toggle.' },
    };

    yield {
      type: 'complete',
      codeLine: 4,
      dataState: { numA: a, numB: b, binA: toBin(a), binB: toBin(b), resultBin: toBin(a & (a - 1)), opName: 'Kernighan: A & (A - 1)' },
      message: `Brian Kernighan's Algorithm: A & (A - 1) = ${a & (a - 1)} (${toBin(a & (a - 1))}). Clears lowest set bit in O(1) cycles!`,
      reason: { action: 'Kernighan Set Bit Clear', why: 'Clears the rightmost set bit in exactly one operation.', rule: 'n & (n - 1)', values: { result: a & (a - 1) }, details: 'Counts set bits in O(number of 1s).' },
    };
  },
};

// ==========================================
// Fibonacci: Top-Down vs Bottom-Up
// ==========================================
export const dpFibonacciDual: AlgorithmDefinition = {
  id: 'dp-fibonacci-dual',
  name: 'Fibonacci: Top-Down vs Bottom-Up',
  category: 'dp',
  categoryName: 'Dynamic Programming',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Side-by-side comparison of Top-Down Memoization (recursive + cache) vs Bottom-Up Tabulation (iterative fill).',
  realLifeExample: 'Browser asset caching to avoid re-downloading static web files.',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'memo[n] = fib(n-1) + fib(n-2)',
    'dp[i] = dp[i-1] + dp[i-2]',
  ],
  explanation: 'Transforms exponential O(2^n) recursion into linear O(n) by caching solutions to overlapping subproblems.',
  tags: ['DP', 'Fibonacci', 'Memoization', 'Tabulation'],
  boardType: 'dp-table',
  defaultInput: { n: 6 },
  presets: [{ label: 'F(6) = 8', value: { n: 6 } }],
  generateRandomInput: () => ({ n: 6 }),
  *run(): Generator<StepAction, void, unknown> {
    const n = 6;
    const memo: Record<number, number> = { 0: 0, 1: 1 };
    const tab: number[] = [0, 1];

    yield {
      type: 'start',
      codeLine: 1,
      dataState: { type: 'fib-dual', n, memo: { ...memo }, tab: [...tab] },
      message: 'Base cases initialized: F(0) = 0, F(1) = 1 in both Memoization and Tabulation.',
      reason: { action: 'Init Base Cases', why: 'F(0)=0 and F(1)=1 define starting boundary.', rule: 'base cases', values: { F0: 0, F1: 1 }, details: 'No recursive calls needed for base cases.' },
    };

    for (let i = 2; i <= n; i++) {
      const fibVal = tab[i - 1] + tab[i - 2];
      tab.push(fibVal);
      memo[i] = fibVal;

      yield {
        type: 'step',
        codeLine: 2,
        dataState: { type: 'fib-dual', n, memo: { ...memo }, tab: [...tab] },
        message: `Computed F(${i}) = F(${i - 1}) + F(${i - 2}) = ${tab[i - 1]} + ${tab[i - 2]} = ${fibVal}.`,
        reason: {
          action: `F(${i}) = ${fibVal}`,
          why: `Direct sum of preceding two cached subproblems.`,
          rule: 'F(i) = F(i-1) + F(i-2)',
          values: { i, result: fibVal },
          details: 'Cached in O(1) without recomputation.',
        },
      };
    }

    yield {
      type: 'complete',
      codeLine: 2,
      dataState: { type: 'fib-dual', n, memo: { ...memo }, tab: [...tab] },
      message: `Computation complete! F(6) = 8 solved in O(n) linear steps without redundant work.`,
      reason: { action: 'Fibonacci Complete', why: 'Overlapping subproblems solved in O(n) linear time.', rule: 'Optimal linear DP', values: { F6: 8 }, details: 'Complete.' },
    };
  },
};
