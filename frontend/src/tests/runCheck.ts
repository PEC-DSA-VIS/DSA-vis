import { runReasonValidationSuite } from './algorithmReason.test';

try {
  const result = runReasonValidationSuite();
  console.log(`\n=== VALIDATION REPORT ===`);
  console.log(`Success: ${result.success}`);
  console.log(`Algorithms Checked: ${result.algorithmCount}`);
  console.log(`Total Steps Evaluated: ${result.totalSteps}`);
  
  console.log(`\n--- STEP 3 ALGORITHMS FOCUS ---`);
  const step3Ids = ['n-queens-solver', 'sudoku-backtrack', 'activity-selection-opt', 'huffman-coding-tree', 'bit-manipulation'];
  result.checklist
    .filter(item => step3Ids.includes(item.id))
    .forEach(item => {
      console.log(`[${item.status.toUpperCase()}] ${item.name} (${item.id}): ${item.stepCount} steps`);
    });

  console.log(`\n--- STEP 4 ALGORITHMS FOCUS (DP, STRINGS, ARRAY PATTERNS) ---`);
  const step4Ids = [
    'lcs-animated-fill',
    'dp-fibonacci-dual',
    'knapsack-01-table',
    'coin-change-dp',
    'matrix-chain-mult',
    'kmp-pattern-matching',
    'rabin-karp-hash',
    'palindrome-check',
    'kadane-algorithm',
    'two-pointers-sum',
    'sliding-window-max',
    'prefix-sum-range',
  ];
  result.checklist
    .filter(item => step4Ids.includes(item.id))
    .forEach(item => {
      console.log(`[${item.status.toUpperCase()}] ${item.name} (${item.id}): ${item.stepCount} steps`);
    });

  console.log(`\n--- STEP 5 ALGORITHMS FOCUS (LINKED LIST, STACK, QUEUE, HASHING) ---`);
  const step5Ids = [
    'linked-list-reversal',
    'floyd-cycle-detect',
    'doubly-linked-ops',
    'stack-operations',
    'parentheses-validation',
    'queue-operations',
    'priority-queue-ops',
    'hash-table-chaining',
    'hash-open-addressing',
    'hash-example-questions',
  ];
  result.checklist
    .filter(item => step5Ids.includes(item.id))
    .forEach(item => {
      console.log(`[${item.status.toUpperCase()}] ${item.name} (${item.id}): ${item.stepCount} steps`);
    });
  console.log(`\n--- STEP 6 ALGORITHMS FOCUS (TREES, HEAP, TRIE, UNION-FIND) ---`);
  const step6Ids = [
    'bst-insert-search',
    'tree-traversals-all',
    'avl-tree-rotations',
    'heap-dual-view',
    'trie-prefix-tree',
    'disjoint-set-union',
  ];
  result.checklist
    .filter(item => step6Ids.includes(item.id))
    .forEach(item => {
      console.log(`[${item.status.toUpperCase()}] ${item.name} (${item.id}): ${item.stepCount} steps`);
    });

  console.log(`\n--- STEP 7 ALGORITHMS FOCUS (GRAPHS & 2D GRID) ---`);
  const step7Ids = [
    'graph-bfs-dfs',
    'dijkstra-shortest',
    'adj-list-matrix-dual',
    'kruskal-prim-mst',
    'matrix-flood-fill',
    'matrix-spiral-order',
  ];
  result.checklist
    .filter(item => step7Ids.includes(item.id))
    .forEach(item => {
      console.log(`[${item.status.toUpperCase()}] ${item.name} (${item.id}): ${item.stepCount} steps`);
    });
} catch (e: any) {
  console.error('Test Suite Failed:', e.message);
  process.exit(1);
}
