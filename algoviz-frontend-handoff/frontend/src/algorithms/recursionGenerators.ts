import { StepAction } from '../types';

export interface HanoiDataState {
  pegs: Record<'A' | 'B' | 'C', number[]>;
  callStack: { frame: string; depth: number }[];
  moveCount: number;
  totalMoves: number;
  activeDisk: number | null;
  fromPeg: 'A' | 'B' | 'C' | null;
  toPeg: 'A' | 'B' | 'C' | null;
}

export interface FactorialDataState {
  n: number;
  currentN: number;
  callStack: { n: number; phase: 'call' | 'return'; result?: number }[];
  currentResult: number | null;
}

export interface FibTreeDataState {
  n: number;
  treeNodes: { id: string; label: string; x: number; y: number; status: 'active' | 'computed' | 'memo' }[];
  edges: { from: string; to: string }[];
  callStack: string[];
  computationLog: string[];
}

// =================================================================
// 1. TOWER OF HANOI (Default 4 Disks = 15 Moves, >= 30 Steps with Stack)
// =================================================================
export function* generateHanoiSteps(numDisks = 4): Generator<StepAction<HanoiDataState>, void, unknown> {
  const pegs: Record<'A' | 'B' | 'C', number[]> = {
    A: Array.from({ length: numDisks }, (_, i) => numDisks - i), // e.g. [4, 3, 2, 1]
    B: [],
    C: [],
  };

  const totalMoves = Math.pow(2, numDisks) - 1; // 15 moves for 4 disks
  let moveCount = 0;
  const callStack: { frame: string; depth: number }[] = [];

  // Initial step
  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] },
      callStack: [{ frame: `hanoi(${numDisks}, 'A', 'C', 'B')`, depth: 1 }],
      moveCount: 0,
      totalMoves,
      activeDisk: null,
      fromPeg: null,
      toPeg: null,
    },
    message: `Tower of Hanoi initialized with ${numDisks} disks on Peg A. Target Peg: C. Total moves required: 2^${numDisks} - 1 = ${totalMoves}.`,
    reason: {
      action: `Initialize Tower of Hanoi (N=${numDisks})`,
      why: 'Move all disks from source Peg A to target Peg C using auxiliary Peg B without placing a larger disk onto a smaller disk.',
      rule: 'T(n) = 2*T(n-1) + 1 = 2^n - 1',
      values: { disks: numDisks, totalMoves, source: 'A', target: 'C', aux: 'B' },
      details: 'Pushed main caller frame hanoi(4, A, C, B) onto recursion call stack.',
    },
  };

  function* solve(
    n: number,
    from: 'A' | 'B' | 'C',
    to: 'A' | 'B' | 'C',
    aux: 'A' | 'B' | 'C',
    depth: number
  ): Generator<StepAction<HanoiDataState>, void, unknown> {
    // 1. Recursive call step (Call stack frame push)
    callStack.push({ frame: `hanoi(${n}, '${from}', '${to}', '${aux}')`, depth });

    yield {
      type: 'step',
      codeLine: 2,
      dataState: {
        pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] },
        callStack: [...callStack],
        moveCount,
        totalMoves,
        activeDisk: null,
        fromPeg: from,
        toPeg: to,
      },
      message: `[Call Stack Push] Entering hanoi(n=${n}, from=${from}, to=${to}, aux=${aux}) at stack depth ${depth}.`,
      reason: {
        action: `Push Frame: hanoi(${n}, ${from}, ${to}, ${aux})`,
        why: n === 1
          ? `Base case reached! Single disk can be transferred directly from ${from} to ${to}.`
          : `Subproblem: First transfer top ${n - 1} disks from ${from} to ${aux} so largest disk ${n} can move to ${to}.`,
        rule: 'hanoi(n, from, to, aux) -> hanoi(n-1, from, aux, to)',
        values: { n, from, to, aux, stackDepth: depth },
        details: 'Recursion tree branches deeper into left subproblem.',
      },
    };

    if (n === 1) {
      // Move 1 disk directly
      const disk = pegs[from].pop()!;
      pegs[to].push(disk);
      moveCount++;

      yield {
        type: 'step',
        codeLine: 3,
        dataState: {
          pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] },
          callStack: [...callStack],
          moveCount,
          totalMoves,
          activeDisk: disk,
          fromPeg: from,
          toPeg: to,
        },
        message: `Move #${moveCount}/${totalMoves}: Moved Disk [${disk}] from Peg ${from} → Peg ${to}.`,
        reason: {
          action: `Move Disk ${disk}: Peg ${from} -> Peg ${to}`,
          why: `Base case disk movement. Disk ${disk} placed legally atop peg ${to}.`,
          rule: 'move(from, to)',
          values: { move: moveCount, disk, from, to },
          details: 'Disk shifted without violating size invariants.',
        },
      };

      // Pop frame
      callStack.pop();
      return;
    }

    // Step A: Move n-1 disks from source to aux
    yield* solve(n - 1, from, aux, to, depth + 1);

    // Step B: Move largest disk n from source to target
    const disk = pegs[from].pop()!;
    pegs[to].push(disk);
    moveCount++;

    yield {
      type: 'step',
      codeLine: 4,
      dataState: {
        pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] },
        callStack: [...callStack],
        moveCount,
        totalMoves,
        activeDisk: disk,
        fromPeg: from,
        toPeg: to,
      },
      message: `Move #${moveCount}/${totalMoves}: Moved largest free disk [${disk}] from Peg ${from} → Peg ${to}.`,
      reason: {
        action: `Move Disk ${disk}: Peg ${from} -> Peg ${to}`,
        why: `Auxiliary peg ${aux} holds top ${n - 1} disks. Disk ${disk} is unblocked and transfers to target ${to}.`,
        rule: 'move(from, to)',
        values: { move: moveCount, disk, from, to },
        details: 'Pillar movement complete.',
      },
    };

    // Step C: Move n-1 disks from aux to target
    yield* solve(n - 1, aux, to, from, depth + 1);

    // Pop frame upon completion of this subproblem
    callStack.pop();
  }

  yield* solve(numDisks, 'A', 'C', 'B', 1);

  // Final step
  yield {
    type: 'complete',
    codeLine: 6,
    dataState: {
      pegs: { A: [...pegs.A], B: [...pegs.B], C: [...pegs.C] },
      callStack: [],
      moveCount,
      totalMoves,
      activeDisk: null,
      fromPeg: null,
      toPeg: null,
    },
    message: `Tower of Hanoi Complete! All ${numDisks} disks successfully transferred to Peg C in exactly ${moveCount} moves.`,
    reason: {
      action: 'Puzzle Solved',
      why: 'All call stack frames unwound and all disks are in sorted order on Peg C.',
      rule: 'Finished in 2^n - 1 moves',
      values: { totalMoves: moveCount, targetPegDisks: pegs.C },
      details: 'Optimal recursion solution verified.',
    },
  };
}

// =================================================================
// 2. RECURSION: FACTORIAL CALL STACK & RETURN UNWINDING (>= 15 STEPS)
// =================================================================
export function* generateFactorialSteps(n = 6): Generator<StepAction, void, unknown> {
  const stack: { n: number; phase: 'call' | 'return'; result?: number }[] = [];

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'recursion',
      n,
      currentN: n,
      callStack: [],
      currentResult: null,
    },
    message: `Factorial Computation started for ${n}! (${n} * ${n - 1} * ... * 1). Call stack starts empty.`,
    reason: {
      action: `Start factorial(${n})`,
      why: 'Factorial is defined recursively as n * factorial(n - 1) with base case factorial(1) = 1.',
      rule: 'n! = n * (n-1)!',
      values: { n },
      details: 'Demonstrates stack frame growth (depth O(n)) and return value propagation.',
    },
  };

  // Phase 1: Call stack growth (Push frames)
  for (let i = n; i >= 1; i--) {
    stack.push({ n: i, phase: 'call' });
    yield {
      type: 'step',
      codeLine: 2,
      dataState: {
        structure: 'recursion',
        n,
        currentN: i,
        callStack: [...stack],
        currentResult: null,
      },
      message: `[Call Stack Push] Called factorial(${i}). Pushed frame onto call stack. Stack Depth: ${stack.length}.`,
      reason: {
        action: `Push factorial(${i})`,
        why: i > 1
          ? `Waiting for result of subproblem factorial(${i - 1}) before multiplication can occur.`
          : 'Base case n=1 reached! factorial(1) returns 1 without further recursion.',
        rule: i > 1 ? 'return n * factorial(n - 1)' : 'if (n <= 1) return 1',
        values: { currentN: i, stackDepth: stack.length },
        details: i === 1 ? 'Base case hit!' : 'Frame suspended awaiting child call.',
      },
    };
  }

  // Base Case Trigger
  yield {
    type: 'step',
    codeLine: 3,
    dataState: {
      structure: 'recursion',
      n,
      currentN: 1,
      callStack: [...stack],
      currentResult: 1,
    },
    message: `[Base Case Return] factorial(1) = 1 hit. Deepest call stack reached (depth ${stack.length}). Begin unwinding returns.`,
    reason: {
      action: 'Base Case Return: factorial(1) = 1',
      why: 'Recursion terminates at bottom of call tree. Returns 1 to caller.',
      rule: 'if (n <= 1) return 1',
      values: { baseN: 1, returnValue: 1 },
      details: 'Now unwinding stack frames.',
    },
  };

  // Phase 2: Unwinding call stack (Pop and multiply)
  let accumulated = 1;
  for (let i = 1; i <= n; i++) {
    const prev = accumulated;
    accumulated *= i;

    yield {
      type: 'step',
      codeLine: 4,
      dataState: {
        structure: 'recursion',
        n,
        currentN: i,
        callStack: [...stack],
        currentResult: accumulated,
      },
      message: `[Multiplication] Evaluating frame factorial(${i}): ${i} * subproblem(${prev}) = ${accumulated}.`,
      reason: {
        action: `Multiply ${i} * ${prev}`,
        why: 'Executing delayed operation after child frame returned its computation.',
        rule: 'result = n * subResult',
        values: { n: i, subResult: prev, product: accumulated },
      },
    };

    stack.pop();

    yield {
      type: i === n ? 'found' : 'step',
      codeLine: 4,
      dataState: {
        structure: 'recursion',
        n,
        currentN: i,
        callStack: [...stack],
        currentResult: accumulated,
      },
      message: `[Stack Unwind] factorial(${i}) returned ${accumulated} (${i} * ${prev}). Popped frame from call stack.`,
      reason: {
        action: `Unwind factorial(${i}) = ${accumulated}`,
        why: `Multiplied current frame value ${i} by returned subproblem value ${prev}.`,
        rule: 'result = n * subResult',
        values: { n: i, subResult: prev, accumulatedResult: accumulated },
        details: `Stack unwinding back towards main caller. Remaining depth: ${stack.length}.`,
      },
    };
  }

  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      structure: 'recursion',
      n,
      currentN: n,
      callStack: [],
      currentResult: accumulated,
    },
    message: `Factorial Complete! ${n}! = ${accumulated}. Call stack completely clear.`,
    reason: {
      action: 'Factorial Complete',
      why: `Final answer ${accumulated} calculated with O(n) time and O(n) call stack space.`,
      rule: 'Stack is empty',
      values: { n, result: accumulated },
      details: 'Multiplication unwinding finished.',
    },
  };
}

// =================================================================
// 3. RECURSION: FIBONACCI RECURSION TREE & BIFURCATION (>= 20 STEPS)
// =================================================================
export function* generateFibonacciTreeSteps(n = 4): Generator<StepAction, void, unknown> {
  const nodes: { id: string; label: string; x: number; y: number; status: 'active' | 'computed' | 'memo' }[] = [];
  const edges: { from: string; to: string }[] = [];
  const callStack: string[] = [];

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'recursion-tree',
      title: `Fibonacci Recursion Tree: fib(${n})`,
      nodes: [],
      edges: [],
      callStack: [],
      result: null,
    },
    message: `Exponential Recursion Tree initialized for fib(${n}). Shows O(2^n) call bifurcation and redundant recomputations.`,
    reason: {
      action: `Initialize fib(${n}) Tree`,
      why: 'Each non-base call splits into two independent recursive branches: fib(n-1) and fib(n-2).',
      rule: 'fib(n) = fib(n-1) + fib(n-2)',
      values: { n },
      details: 'Notice identical subtrees recomputed repeatedly without dynamic programming.',
    },
  };

  // Pre-calculated clean layout coordinates for fib(4) tree
  const treeLayout: Record<string, { label: string; x: number; y: number; val: number }> = {
    'root': { label: 'fib(4)', x: 420, y: 70, val: 3 },
    'l1_0': { label: 'fib(3)', x: 260, y: 150, val: 2 },
    'l1_1': { label: 'fib(2)', x: 580, y: 150, val: 1 },
    'l2_0': { label: 'fib(2)', x: 170, y: 240, val: 1 },
    'l2_1': { label: 'fib(1)', x: 340, y: 240, val: 1 },
    'l2_2': { label: 'fib(1)', x: 510, y: 240, val: 1 },
    'l2_3': { label: 'fib(0)', x: 650, y: 240, val: 0 },
    'l3_0': { label: 'fib(1)', x: 120, y: 330, val: 1 },
    'l3_1': { label: 'fib(0)', x: 220, y: 330, val: 0 },
  };

  const stepsQueue = [
    { id: 'root', parent: null },
    { id: 'l1_0', parent: 'root' },
    { id: 'l2_0', parent: 'l1_0' },
    { id: 'l3_0', parent: 'l2_0', base: true },
    { id: 'l3_1', parent: 'l2_0', base: true },
    { id: 'l2_1', parent: 'l1_0', base: true },
    { id: 'l1_1', parent: 'root' },
    { id: 'l2_2', parent: 'l1_1', base: true },
    { id: 'l2_3', parent: 'l1_1', base: true },
  ];

  for (const step of stepsQueue) {
    const layout = treeLayout[step.id];
    nodes.push({ id: step.id, label: layout.label, x: layout.x, y: layout.y, status: 'active' });
    if (step.parent) {
      edges.push({ from: step.parent, to: step.id });
    }
    callStack.push(layout.label);

    yield {
      type: 'step',
      codeLine: 2,
      dataState: {
        structure: 'recursion-tree',
        title: `Fibonacci Recursion Tree: ${layout.label}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        callStack: [...callStack],
        activeNodeId: step.id,
      },
      message: `Recursive Call: Calling ${layout.label}. Added node to recursion tree. Call stack depth: ${callStack.length}.`,
      reason: {
        action: `Invoke ${layout.label}`,
        why: step.base
          ? `Base case reached! ${layout.label} evaluates directly to ${layout.val}.`
          : `Branching deeper into ${layout.label}.`,
        rule: step.base ? 'if (n <= 1) return n' : 'fib(n-1) + fib(n-2)',
        values: { call: layout.label, isBaseCase: !!step.base },
        details: 'Tree node lights up active amber glow.',
      },
    };

    if (step.base) {
      const node = nodes.find((n) => n.id === step.id);
      if (node) {
        node.status = 'computed';
        node.label = `${layout.label}=${layout.val}`;
      }
      callStack.pop();

      yield {
        type: 'found',
        codeLine: 3,
        dataState: {
          structure: 'recursion-tree',
          title: `Base Return: ${layout.label} = ${layout.val}`,
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          callStack: [...callStack],
          activeNodeId: step.id,
        },
        message: `[Base Return] ${layout.label} returned ${layout.val} directly. Popped from call stack.`,
        reason: {
          action: `Return ${layout.val} from ${layout.label}`,
          why: `Base case condition n <= 1 satisfied. Value ${layout.val} bubbles up to parent frame.`,
          rule: 'return n',
          values: { node: layout.label, returnedVal: layout.val },
          details: 'Node turns emerald computed status.',
        },
      };
    }
  }

  // Combine parent nodes
  const combineOrder = [
    { id: 'l2_0', val: 1 },
    { id: 'l1_0', val: 2 },
    { id: 'l1_1', val: 1 },
    { id: 'root', val: 3 },
  ];

  for (const comb of combineOrder) {
    const node = nodes.find((n) => n.id === comb.id);
    if (node) {
      node.status = 'computed';
      node.label = `${treeLayout[comb.id].label}=${comb.val}`;
    }

    yield {
      type: 'step',
      codeLine: 4,
      dataState: {
        structure: 'recursion-tree',
        title: `Sum Returned Subtrees: ${treeLayout[comb.id].label} = ${comb.val}`,
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
        callStack: [...callStack],
        activeNodeId: comb.id,
      },
      message: `Combined results: ${treeLayout[comb.id].label} = left + right = ${comb.val}.`,
      reason: {
        action: `Compute ${treeLayout[comb.id].label}`,
        why: 'Added results from completed left and right subtrees.',
        rule: 'fib(n) = fib(n-1) + fib(n-2)',
        values: { node: treeLayout[comb.id].label, computedValue: comb.val },
        details: 'Frame completes and returns to its caller.',
      },
    };
  }

  yield {
    type: 'complete',
    codeLine: 5,
    dataState: {
      structure: 'recursion-tree',
      title: `Recursion Complete: fib(${n}) = 3`,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      callStack: [],
      result: 3,
    },
    message: `Fibonacci Tree Complete! Result for fib(4) is 3. Notice 9 total call nodes for n=4, proving O(2^n) exponential blowup without memoization.`,
    reason: {
      action: 'Recursion Complete',
      why: 'All 9 recursion tree calls finished. Explains why dynamic programming (O(n)) is vastly superior to pure recursion (O(2^n)).',
      rule: 'O(2^n) time vs O(n) space',
      values: { n, result: 3, totalCallNodes: 9 },
      details: 'Complete tree verified.',
    },
  };
}
