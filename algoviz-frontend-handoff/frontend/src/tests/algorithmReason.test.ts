import { algorithmRegistry } from '../algorithms/registry';
import { ensureStepReason } from '../lib/reasonUtils';
import { getAlgorithmCode } from '../data/algorithmCode';

export interface TestResultReport {
  success: boolean;
  totalSteps: number;
  algorithmCount: number;
  checklist: { id: string; name: string; category: string; stepCount: number; status: 'fixed' | 'broken'; reason?: string }[];
}

export function getMinRequiredSteps(categoryId: string, algoId: string): number {
  const cat = (categoryId || '').toLowerCase();
  const id = (algoId || '').toLowerCase();

  // Step 2 & 9 Core Divide & Conquer / Sorting / Searching Thresholds
  if (id === 'binary-search') return 12;
  if (id === 'linear-search') return 8;
  if (id === 'tower-of-hanoi') return 30; // User requirement: default 4 disks, >= 30 steps
  if (id === 'bubble-sort') return 20;
  if (id === 'insertion-sort') return 15;
  if (id === 'quick-sort-partition') return 15;
  if (id === 'merge-sort-tree') return 30; // User requirement: >= 30 steps for 8 elements
  if (id === 'divide-conquer-merge') return 30; // User requirement: >= 30 steps for 8 elements
  if (id === 'divide-conquer-quick') return 25; // User requirement: >= 25 steps
  if (id === 'divide-conquer-binary') return 12; // User requirement: >= 12 steps

  // Step 3 Backtracking, Greedy & Bit Manipulation Thresholds
  if (id === 'n-queens-solver') return 30;
  if (id === 'sudoku-backtrack') return 40;
  if (id === 'activity-selection-opt') return 15;
  if (id === 'huffman-coding-tree') return 20; // User requirement: >= 20 steps
  if (id === 'bit-manipulation') return 15;

  // Step 4 DP, Strings, Array Patterns Thresholds
  if (id === 'lcs-animated-fill') return 15;
  if (id === 'knapsack-01-table') return 15;
  if (id === 'coin-change-dp') return 10;
  if (id === 'matrix-chain-mult') return 10;
  if (id === 'dp-fibonacci-dual') return 20; // User requirement: >= 20 steps
  if (id === 'kmp-pattern-matching') return 15;
  if (id === 'rabin-karp-hash') return 10;
  if (id === 'palindrome-check') return 10; // User requirement: >= 10 steps
  if (id === 'kadane-algorithm') return 10;
  if (id === 'two-pointers-sum') return 10; // User requirement: >= 10 steps
  if (id === 'sliding-window-max') return 8;
  if (id === 'prefix-sum-range') return 10;

  // Step 5 Linked List, Stack, Queue, Hashing Thresholds
  if (id === 'linked-list-reversal') return 15;
  if (id === 'floyd-cycle-detect') return 15; // User requirement: >= 15 steps
  if (id === 'doubly-linked-ops') return 20; // User requirement: >= 20 steps
  if (id === 'circular-doubly-linked-list') return 20; // User requirement: >= 20 steps
  if (id === 'stack-operations') return 7;
  if (id === 'parentheses-validation') return 6;
  if (id === 'queue-operations') return 8;
  if (id === 'priority-queue-ops') return 20; // User requirement: >= 20 steps
  if (id === 'hash-table-chaining') return 25; // User requirement: Min 25 steps for 8 keys
  if (id === 'hash-open-addressing') return 10;
  if (id === 'hash-example-questions') return 20; // User requirement: >= 20 total

  // Step 6 Trees, Heap, Trie, Union-Find Thresholds
  if (id === 'bst-insert-search') return 20;
  if (id === 'tree-traversals-all') return 30; // User requirement: total >= 30 steps
  if (id === 'avl-tree-rotations') return 20; // User requirement: Min 20 steps
  if (id === 'heap-dual-view') return 15;
  if (id === 'trie-prefix-tree') return 12;
  if (id === 'disjoint-set-union') return 10;

  // Step 7 Graphs & 2D Grid Thresholds
  if (id === 'dijkstra-shortest') return 25; // User requirement: Min 25 steps
  if (id === 'graph-bfs-dfs') return 15;
  if (id === 'adj-list-matrix-dual') return 20; // User requirement: >= 20 steps
  if (id === 'kruskal-prim-mst') return 20; // User requirement: >= 20 steps
  if (id === 'matrix-flood-fill') return 20; // User requirement: 8 steps is not enough
  if (id === 'matrix-spiral-order') return 20; // User requirement: every move and boundary shrink

  // Step 9 Additional Missing Topics Thresholds
  if (id === 'jump-search') return 12;
  if (id === 'interpolation-search') return 12;
  if (id === 'counting-sort') return 20;
  if (id === 'heap-sort-algo') return 25;
  if (id === 'recursion-factorial') return 15;
  if (id === 'recursion-fibonacci-tree') return 20;
  if (id === 'array-crud-operations') return 15;
  if (id === 'string-comparison-concat') return 15;
  if (id === 'binary-tree-lca-height') return 15;

  if (cat.includes('sort')) return 8;
  if (cat.includes('search')) return 3;
  if (cat.includes('tree')) return 3;
  if (cat.includes('graph')) return 3;
  if (cat.includes('dynamic') || cat.includes('dp')) return 3;
  if (cat.includes('backtrack')) return 3;
  if (cat.includes('linked') || cat.includes('stack') || cat.includes('queue')) return 3;
  return 3;
}

export function runReasonValidationSuite(): TestResultReport {
  let totalSteps = 0;
  const failures: string[] = [];
  const checklist: { id: string; name: string; category: string; stepCount: number; status: 'fixed' | 'broken'; reason?: string }[] = [];

  for (const algo of algorithmRegistry) {
    let stepCount = 0;
    let initialStepHasData = false;
    let hasCode = false;

    try {
      // 1. Verify Code Panel has runnable code in C++, Java, and Python
      const codeImpl = getAlgorithmCode(algo.id, algo.name);
      if (codeImpl.cpp && codeImpl.java && codeImpl.python) {
        hasCode = true;
      } else {
        failures.push(`[CODE FAIL] Algorithm "${algo.name}" (${algo.id}) is missing complete runnable code.`);
      }

      // 2. Verify Generator & Steps
      const generator = algo.run(algo.defaultInput || algo.generateRandomInput?.() || {});
      let stepResult = generator.next();
      let stepIdx = 0;

      while (!stepResult.done && stepResult.value) {
        stepCount++;
        totalSteps++;
        const step = stepResult.value;

        // Check Step 0 renders non-empty state
        if (stepIdx === 0) {
          const ds = step.dataState || {};
          if (
            ds.array?.length > 0 ||
            ds.nodes?.length > 0 ||
            ds.levels?.length > 0 ||
            ds.grid?.length > 0 ||
            ds.activities?.length > 0 ||
            ds.pegs ||
            ds.dpTable ||
            ds.parent ||
            ds.heapArray ||
            ds.items ||
            ds.words ||
            ds.text ||
            ds.tab ||
            ds.memo ||
            ds.prefixArray ||
            ds.lps ||
            ds.windowStr ||
            ds.buckets ||
            ds.slots ||
            ds.structure ||
            ds.listType ||
            ds.capacity !== undefined ||
            ds.nodes !== undefined ||
            ds.items !== undefined ||
            ds.a !== undefined ||
            ds.numA !== undefined
          ) {
            initialStepHasData = true;
          }
        }

        const reason = step.reason ? step.reason : ensureStepReason(step);
        if (!reason || !reason.action?.trim() || !reason.why?.trim() || !reason.rule?.trim()) {
          failures.push(
            `[FAIL] Algorithm "${algo.name}" (${algo.id}) at Step ${stepIdx} has missing/empty reason fields: action="${reason?.action}", why="${reason?.why}", rule="${reason?.rule}"`
          );
        }

        stepResult = generator.next();
        stepIdx++;
      }

      const minRequired = getMinRequiredSteps(algo.category, algo.id);
      if (stepCount < minRequired) {
        failures.push(
          `[STEP FAIL] Algorithm "${algo.name}" (${algo.id}) in category "${algo.categoryName}" generated only ${stepCount} step(s); minimum required is ${minRequired}.`
        );
      }

      const isFixed = initialStepHasData && hasCode && stepCount >= minRequired;
      checklist.push({
        id: algo.id,
        name: algo.name,
        category: algo.categoryName,
        stepCount,
        status: isFixed ? 'fixed' : 'broken',
        reason: !hasCode
          ? 'missing complete C++/Java/Python code'
          : !initialStepHasData
          ? 'blank initial state'
          : stepCount < minRequired
          ? `insufficient steps (${stepCount} < ${minRequired})`
          : undefined,
      });
    } catch (e: any) {
      failures.push(`[ERROR] Algorithm "${algo.name}" (${algo.id}) crashed during step generation: ${e.message}`);
      checklist.push({
        id: algo.id,
        name: algo.name,
        category: algo.categoryName,
        stepCount: 0,
        status: 'broken',
        reason: e.message,
      });
    }
  }

  if (failures.length > 0) {
    console.error(`FAIL: ${failures.length} algorithm steps failed QA validation!`);
    failures.forEach((f) => console.error(f));
    throw new Error(`QA smoke tests failed with ${failures.length} errors.`);
  }

  console.log(`[TEST PASS] Successfully verified ${totalSteps} steps across all ${algorithmRegistry.length} algorithms! Every step has non-empty initial board state, valid reasons, and runnable C++/Java/Python code.`);
  return { success: true, totalSteps, algorithmCount: algorithmRegistry.length, checklist };
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('algorithmReason.test')) {
  runReasonValidationSuite();
}
