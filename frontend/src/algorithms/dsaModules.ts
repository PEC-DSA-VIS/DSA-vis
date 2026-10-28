import { AlgorithmDefinition, StepAction } from '../types';
import { generateNQueensSteps, generateSudokuSteps } from './backtrackingGenerators';
import { generateActivitySelectionSteps, generateHuffmanSteps } from './greedyGenerators';
import { generateBitManipulationSteps } from './bitGenerators';
import {
  generateLCSSteps,
  generateKnapsackSteps,
  generateCoinChangeSteps,
  generateMatrixChainSteps,
  generateFibonacciDualSteps,
} from './dpGenerators';
import {
  generateKMPSteps,
  generateRabinKarpSteps,
  generatePalindromeSteps,
} from './stringGenerators';
import {
  generateKadaneSteps,
  generateTwoPointersSteps,
  generateSlidingWindowSteps,
  generatePrefixSumSteps,
} from './arrayPatternGenerators';
import {
  generateSinglyLinkedListSteps,
  generateFloydCycleSteps,
  generateDoublyCircularSteps,
} from './linkedListGenerators';
import {
  generateStackSteps,
  generateParenthesesSteps,
  generateQueueSteps,
  generatePriorityQueueSteps,
} from './stackQueueGenerators';
import {
  generateHashChainingSteps,
  generateHashOpenAddressingSteps,
  generateHashExampleQuestionSteps,
} from './hashGenerators';
import {
  generateBSTSteps,
  generateTraversalSteps,
  generateAVLSteps,
} from './treeGenerators';
import { generateHeapSteps } from './heapGenerators';
import { generateTrieSteps } from './trieGenerators';
import { generateUnionFindSteps } from './unionFindGenerators';
import {
  generateBFSDFSSteps,
  generateDijkstraSteps,
  generateAdjDualSteps,
  generateMSTSteps,
} from './graphGenerators';
import {
  generateFloodFillSteps,
  generateSpiralSteps,
} from './matrixGenerators';
import {
  generateHanoiSteps,
  generateFactorialSteps,
  generateFibonacciTreeSteps,
} from './recursionGenerators';
import {
  generateJumpSearchSteps,
  generateInterpolationSearchSteps,
  generateCountingSortSteps,
  generateHeapSortSteps,
  generateArrayCRUDSteps,
  generateStringCompareConcatSteps,
  generateTreeLCAHeightSteps,
  generateCircularDoublySteps,
} from './additionalGenerators';

// ==========================================
// 1. ARRAYS: Kadane's Max Subarray Sum
// ==========================================
export const kadaneAlgorithm: AlgorithmDefinition = {
  id: 'kadane-algorithm',
  name: "Kadane's Algorithm (Max Subarray)",
  category: 'arrays',
  categoryName: 'Arrays & Patterns',
  part: 'ds',
  difficulty: 'Medium',
  description: 'Finds the contiguous subarray within a one-dimensional numeric array that has the largest sum in O(n) linear time.',
  realLifeExample: 'Stock market profit analysis: finding the best continuous window of days to buy and sell for peak returns.',
  complexity: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'function kadane(arr):',
    '    maxSoFar = arr[0], currentMax = arr[0]',
    '    for i = 1 to arr.length - 1:',
    '        currentMax = max(arr[i], currentMax + arr[i])',
    '        maxSoFar = max(maxSoFar, currentMax)',
    '    return maxSoFar',
  ],
  explanation: 'At each position i, we decide whether to extend the previous subarray (currentMax + arr[i]) or start a fresh subarray at arr[i].',
  tags: ['Dynamic Programming', 'Arrays', 'Subarray', 'Optimization'],
  boardType: 'array-search',
  defaultInput: { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  presets: [
    { label: 'Classic Mixed (Result: 6)', value: { array: [-2, 1, -3, 4, -1, 2, 1, -5, 4] } },
    { label: 'All Negative (Result: -1)', value: { array: [-5, -2, -8, -1, -4] } },
    { label: 'All Positive (Result: 20)', value: { array: [3, 5, 2, 8, 2] } },
  ],
  generateRandomInput: () => ({
    array: Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) - 10),
  }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateKadaneSteps(input?.array);
  },
};

// ==========================================
// 1b. ARRAYS: Two Pointers Target Sum
// ==========================================
export const twoPointersSum: AlgorithmDefinition = {
  id: 'two-pointers-sum',
  name: 'Two Pointers (Target Sum)',
  category: 'arrays',
  categoryName: 'Arrays & Patterns',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'In a sorted array, two pointers start at opposite ends and move inward until elements summing to the target are found.',
  realLifeExample: 'Two friends walking toward each other from opposite ends of a street until they meet at a designated rendezvous spot.',
  complexity: {
    time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'function twoPointers(arr, target):',
    '    left = 0, right = arr.length - 1',
    '    while left < right:',
    '        sum = arr[left] + arr[right]',
    '        if sum == target: return [left, right]',
    '        else if sum < target: left++',
    '        else: right--',
  ],
  explanation: 'Because array is sorted, increasing sum requires moving left pointer right; decreasing sum requires moving right pointer left.',
  tags: ['Two Pointers', 'Arrays', 'Sorted Array', 'Search'],
  boardType: 'array-search',
  defaultInput: { array: [1, 3, 6, 8, 11, 15, 18, 21, 25, 30], target: 29 },
  presets: [
    { label: 'Target: 29 (8 + 21)', value: { array: [1, 3, 6, 8, 11, 15, 18, 21, 25, 30], target: 29 } },
    { label: 'Target: 33 (8 + 25)', value: { array: [1, 3, 6, 8, 11, 15, 18, 21, 25, 30], target: 33 } },
  ],
  generateRandomInput: () => ({ array: [1, 4, 6, 9, 12, 15, 19, 23, 28], target: 21 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateTwoPointersSteps(input?.array, input?.target);
  },
};

// ==========================================
// 1c. ARRAYS: Sliding Window Maximum
// ==========================================
export const slidingWindowMax: AlgorithmDefinition = {
  id: 'sliding-window-max',
  name: 'Sliding Window (Fixed & Variable)',
  category: 'arrays',
  categoryName: 'Arrays & Patterns',
  part: 'ds',
  difficulty: 'Medium',
  description: 'Maintains a sliding subset window across an array to compute continuous metric without redundant calculations.',
  realLifeExample: 'Moving average in weather forecasting or calculating running network throughput over the last 3 seconds.',
  complexity: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(k)' },
  },
  pseudocode: [
    'Fixed: windowSum += arr[i] - arr[i-k]',
    'Variable: expand right while sum < S; shrink left while sum >= S',
  ],
  explanation: 'Fixed window adds incoming and subtracts outgoing elements in O(1); variable window expands/shrinks dynamically.',
  tags: ['Sliding Window', 'Arrays', 'Subarrays', 'Two Pointers'],
  boardType: 'array-search',
  defaultInput: { array: [2, 1, 5, 1, 3, 2, 7, 4], target: 3, mode: 'fixed' },
  presets: [
    { label: 'Fixed Window (k=3)', value: { array: [2, 1, 5, 1, 3, 2, 7, 4], target: 3, mode: 'fixed' } },
    { label: 'Variable Window (Sum >= 7)', value: { array: [2, 1, 5, 1, 3, 2, 7, 4], target: 7, mode: 'variable' } },
  ],
  generateRandomInput: () => ({ array: [3, 2, 6, 1, 4, 5, 2, 8], target: 3 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateSlidingWindowSteps(input?.array, input?.target || 3, input?.mode || 'fixed');
  },
};

// ==========================================
// 1d. ARRAYS: Prefix Sum Array
// ==========================================
export const prefixSumRange: AlgorithmDefinition = {
  id: 'prefix-sum-range',
  name: 'Prefix Sum Array (Range Query)',
  category: 'arrays',
  categoryName: 'Arrays & Patterns',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Precomputes cumulative sums to answer any subarray sum query between range [L, R] in O(1) instantaneous time.',
  realLifeExample: 'Odometer in your car: trip distance = current odometer reading minus starting odometer reading.',
  complexity: {
    time: { best: 'O(1) query', average: 'O(1) query', worst: 'O(n) build' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'prefix[0] = arr[0]',
    'for i = 1 to n - 1: prefix[i] = prefix[i - 1] + arr[i]',
    'function query(L, R): return L == 0 ? prefix[R] : prefix[R] - prefix[L - 1]',
  ],
  explanation: 'Cumulative prefix construction enables answering infinite range queries in O(1) time without looping.',
  tags: ['Prefix Sum', 'Range Queries', 'Precomputation', 'Arrays'],
  boardType: 'array-search',
  defaultInput: { array: [3, 1, 4, 1, 5, 9, 2, 6] },
  presets: [{ label: 'Array [3, 1, 4, 1, 5, 9, 2, 6]', value: { array: [3, 1, 4, 1, 5, 9, 2, 6] } }],
  generateRandomInput: () => ({ array: [2, 4, 6, 8, 10, 12, 14] }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generatePrefixSumSteps(input?.array);
  },
};

// ==========================================
// 2. STRINGS: KMP Pattern Matching
// ==========================================
export const kmpPatternMatching: AlgorithmDefinition = {
  id: 'kmp-pattern-matching',
  name: 'KMP Pattern Matching (LPS Table)',
  category: 'strings',
  categoryName: 'Strings & Pattern Matching',
  part: 'ds',
  difficulty: 'Hard',
  description: 'Knuth-Morris-Pratt searches occurrences of a pattern in a text using the Longest Proper Prefix which is also Suffix (LPS) table.',
  realLifeExample: 'Searching for genomic DNA sequences (e.g. "ATCGATCA") without re-checking previous matching nucleotides on mismatch.',
  complexity: {
    time: { best: 'O(n)', average: 'O(n + m)', worst: 'O(n + m)' },
    space: { worst: 'O(m)' },
  },
  pseudocode: [
    'build LPS table: if pat[i] == pat[len]: len++, lps[i]=len',
    'search: if text[i] == pat[j]: i++, j++',
    '        else if j != 0: j = lps[j-1]  // jump without retreating i',
    '        else: i++',
  ],
  explanation: 'When a character mismatch occurs, the LPS table determines the next characters to skip avoiding redundant comparisons.',
  tags: ['Strings', 'Pattern Matching', 'KMP', 'LPS'],
  boardType: 'string-ops',
  defaultInput: { text: 'ABABDABACDABABCABAB', pattern: 'ABABCABAB' },
  presets: [
    { label: 'Classic KMP (ABABCABAB)', value: { text: 'ABABDABACDABABCABAB', pattern: 'ABABCABAB' } },
    { label: 'Repeated Pattern (AABA)', value: { text: 'AABAACAADAABAABA', pattern: 'AABA' } },
  ],
  generateRandomInput: () => ({ text: 'AABAACAADAABAABA', pattern: 'AABA' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateKMPSteps(input?.text, input?.pattern);
  },
};

// ==========================================
// 2b. STRINGS: Rabin-Karp Rolling Hash
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
    yield* generateRabinKarpSteps(input?.text, input?.pattern);
  },
};

// ==========================================
// 2c. STRINGS: Palindrome Check
// ==========================================
export const palindromeCheck: AlgorithmDefinition = {
  id: 'palindrome-check',
  name: 'Palindrome Check (Two Pointers)',
  category: 'strings',
  categoryName: 'Strings & Pattern Matching',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Checks whether a string reads identically forward and backward using symmetric converging two pointers.',
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
  explanation: 'Compares symmetric character pairs from the outside in; mismatches terminate early.',
  tags: ['Strings', 'Palindrome', 'Two Pointers'],
  boardType: 'string-ops',
  defaultInput: { text: 'WASITACATISAW' },
  presets: [
    { label: 'WASITACATISAW (13 chars)', value: { text: 'WASITACATISAW' } },
    { label: 'RACECAR (7 chars)', value: { text: 'RACECAR' } },
    { label: 'NOON (Even Length)', value: { text: 'NOON' } },
    { label: 'ALGOVIZ (Not Palindrome)', value: { text: 'ALGOVIZ' } },
  ],
  generateRandomInput: () => ({ text: 'DEIFIED' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generatePalindromeSteps(input?.text);
  },
};

// ==========================================
// 7. GRAPHS: BFS & DFS
// ==========================================
export const graphBfsDfs: AlgorithmDefinition = {
  id: 'graph-bfs-dfs',
  name: 'Graph Traversal (BFS & DFS)',
  category: 'graphs',
  categoryName: 'Graphs & Dual View',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Breadth-First Search (level-by-level queue) vs Depth-First Search (deep dive stack) graph exploration with live adjacency list and matrix.',
  realLifeExample: 'Social network friend degrees (BFS: 1st, 2nd, 3rd degree connections) vs maze solving (DFS).',
  complexity: {
    time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    space: { worst: 'O(V)' },
  },
  pseudocode: [
    'BFS: queue.push(start); visited.add(start)',
    'while queue: u = queue.pop(); for v in adj[u]: if v not in visited: visited.add(v); queue.push(v)',
    'DFS: stack.push(start); while stack: u = stack.pop(); for v in adj[u]: if v not in visited: stack.push(v)',
  ],
  explanation: 'BFS discovers shortest path in unweighted graphs using a FIFO queue; DFS explores branches to dead ends using recursion or stack.',
  tags: ['Graphs', 'BFS', 'DFS', 'Traversal', 'Wavefront'],
  boardType: 'graph-board',
  defaultInput: { mode: 'bfs' },
  presets: [
    { label: 'Breadth-First Search (FIFO Queue & Wavefront)', value: { mode: 'bfs' } },
    { label: 'Depth-First Search (LIFO Call Stack)', value: { mode: 'dfs' } },
  ],
  generateRandomInput: () => ({ mode: 'bfs' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateBFSDFSSteps(input?.mode || 'bfs');
  },
};

// ==========================================
// 7b. GRAPHS: Dijkstra Shortest Path
// ==========================================
export const dijkstraShortest: AlgorithmDefinition = {
  id: 'dijkstra-shortest',
  name: 'Dijkstra Shortest Path',
  category: 'graphs',
  categoryName: 'Graphs & Dual View',
  part: 'ds',
  difficulty: 'Advanced',
  description: 'Greedy shortest path algorithm tracking distance table, min-heap priority queue, and edge relaxations.',
  realLifeExample: 'GPS navigation routing the fastest driving route avoiding traffic or delays.',
  complexity: {
    time: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)' },
    space: { worst: 'O(V)' },
  },
  pseudocode: [
    'dist[src] = 0, pq.push({0, src})',
    'while pq is not empty:',
    '    (d, u) = pq.popMin()',
    '    for (v, weight) in adj[u]:',
    '        if dist[u] + weight < dist[v]:',
    '            dist[v] = dist[u] + weight; pq.push({dist[v], v})',
  ],
  explanation: 'Repeatedly relaxes adjacent edges of the currently closest unvisited vertex until all reachable nodes are finalized.',
  tags: ['Graphs', 'Dijkstra', 'Shortest Path', 'Greedy', 'Priority Queue'],
  boardType: 'graph-board',
  defaultInput: {},
  presets: [{ label: '6 Vertices with Edge Relaxations (A to F)', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateDijkstraSteps();
  },
};

// ==========================================
// 7c. GRAPHS: Adjacency List vs Matrix Dual
// ==========================================
export const adjListMatrixDual: AlgorithmDefinition = {
  id: 'adj-list-matrix-dual',
  name: 'Adjacency List vs Matrix Dual-View',
  category: 'graphs',
  categoryName: 'Graphs & Dual View',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Side-by-side comparison of sparse memory Adjacency List O(V + E) vs dense O(1) query Adjacency Matrix O(V²).',
  realLifeExample: 'Social network followers (sparse list) vs airline direct flight schedule matrices (dense matrix).',
  complexity: {
    time: { best: 'O(1)', average: 'O(1)', worst: 'O(V²)' },
    space: { worst: 'O(V + E) vs O(V²)' },
  },
  pseudocode: [
    'adjList[u].push(v)    // O(1) append, saves space on sparse graphs',
    'adjMatrix[u][v] = wt  // O(1) direct edge lookup in 2D array',
  ],
  explanation: 'Adjacency lists are space-efficient O(V + E) for sparse graphs; adjacency matrices give instantaneous O(1) edge lookups.',
  tags: ['Graphs', 'Dual View', 'Adjacency List', 'Adjacency Matrix'],
  boardType: 'graph-board',
  defaultInput: {},
  presets: [{ label: 'Live Edge Insertions into List & Matrix (4 Vertices)', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateAdjDualSteps();
  },
};

// ==========================================
// 7d. GRAPHS: Kruskal & Prim MST
// ==========================================
export const kruskalPrimMST: AlgorithmDefinition = {
  id: 'kruskal-prim-mst',
  name: 'Kruskal & Prim MST',
  category: 'graphs',
  categoryName: 'Graphs & Dual View',
  part: 'ds',
  difficulty: 'Advanced',
  description: "Minimum Spanning Tree algorithms: Kruskal's edge sorting with Union-Find cycle check vs Prim's cut-edge expansion.",
  realLifeExample: 'Designing an electrical grid or fiber-optic broadband network that connects all cities with the lowest total cable cost.',
  complexity: {
    time: { best: 'O(E log E)', average: 'O(E log V)', worst: 'O(E log V)' },
    space: { worst: 'O(V + E)' },
  },
  pseudocode: [
    'Kruskal: sort edges; for (u, v) in edges: if find(u) != find(v): union(u, v); mst.add(edge)',
    'Prim: inMST.add(src); while inMST.size < V: pick min cut edge (u, v); inMST.add(v); mst.add(edge)',
  ],
  explanation: "Kruskal greedily adds edges unless they create a cycle; Prim greedily grows a connected tree from a seed vertex.",
  tags: ['Graphs', 'MST', 'Kruskal', 'Prim', 'Greedy', 'Union-Find'],
  boardType: 'graph-board',
  defaultInput: { mode: 'kruskal' },
  presets: [
    { label: "Kruskal's MST (Edge Sorting + Union-Find Cycle Check)", value: { mode: 'kruskal' } },
    { label: "Prim's MST (Cheapest Cut-Edge Expansion)", value: { mode: 'prim' } },
  ],
  generateRandomInput: () => ({ mode: 'kruskal' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateMSTSteps(input?.mode || 'kruskal');
  },
};

// ==========================================
// 11. DISJOINT SET: Union-Find
// ==========================================
export const disjointSetUnion: AlgorithmDefinition = {
  id: 'disjoint-set-union',
  name: 'Union-Find (Path Compression & Rank)',
  category: 'disjoint-set',
  categoryName: 'Disjoint Set (Union-Find)',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Tracks elements partitioned into disjoint subsets with nearly O(1) amortized inverse Ackermann time operations, connected directly to Kruskals Minimum Spanning Tree cycle detection.',
  realLifeExample: 'Kruskals Minimum Spanning Tree algorithm detecting whether adding a network cable creates an illegal cycle.',
  complexity: {
    time: { best: 'O(α(n))', average: 'O(α(n))', worst: 'O(α(n))' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'find(i): if parent[i] == i: return i; return parent[i] = find(parent[i])  // Path Compression',
    'union(i, j): rootI = find(i), rootJ = find(j); unionByRank(rootI, rootJ)',
    'kruskal(edges): for (u, v) in edges: if find(u) != find(v): union(u, v); add(edge)',
  ],
  explanation: 'Path compression flattens the tree during find calls; union by rank attaches smaller trees under larger roots.',
  tags: ['Disjoint Set', 'Union-Find', 'Kruskal', 'Graphs'],
  boardType: 'disjoint-set',
  defaultInput: { elements: 6 },
  presets: [{ label: 'Kruskals MST with Cycle Detection (6 Vertices)', value: { elements: 6 } }],
  generateRandomInput: () => ({ elements: 6 }),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateUnionFindSteps();
  },
};

// ==========================================
// 15b. DYNAMIC PROGRAMMING: LCS
// ==========================================
export const lcsAnimatedFill: AlgorithmDefinition = {
  id: 'lcs-animated-fill',
  name: 'Longest Common Subsequence (LCS)',
  category: 'dp',
  categoryName: 'Dynamic Programming',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Finds the length and exact sequence of the longest subsequence present in both strings in relative order.',
  realLifeExample: 'Git diff tool identifying lines that were kept versus inserted or deleted between two file revisions.',
  complexity: {
    time: { best: 'O(M × N)', average: 'O(M × N)', worst: 'O(M × N)' },
    space: { worst: 'O(M × N)' },
  },
  pseudocode: [
    'if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]',
    'else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
    'traceback from (m, n) to recover LCS string',
  ],
  explanation: 'Fills 2D grid matching character pairs; traceback yields the exact subsequence string.',
  tags: ['DP', 'LCS', 'Strings', 'Diff'],
  boardType: 'dp-table',
  defaultInput: { text1: 'ABCDE', text2: 'ACE' },
  presets: [
    { label: 's1="ABCDE", s2="ACE" (LCS: "ACE")', value: { text1: 'ABCDE', text2: 'ACE' } },
    { label: 's1="AGGTAB", s2="GXTXAYB" (LCS: "GTAB")', value: { text1: 'AGGTAB', text2: 'GXTXAYB' } },
  ],
  generateRandomInput: () => ({ text1: 'AGGTAB', text2: 'GXTXAYB' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateLCSSteps(input?.text1 || 'ABCDE', input?.text2 || 'ACE');
  },
};

// ==========================================
// 15c. DYNAMIC PROGRAMMING: 0/1 Knapsack Table
// ==========================================
export const knapsack01Table: AlgorithmDefinition = {
  id: 'knapsack-01-table',
  name: '0/1 Knapsack Animated Table',
  category: 'dp',
  categoryName: 'Dynamic Programming',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Maximizes value within weight capacity by filling a 2D dynamic programming memoization table with live item traceback.',
  realLifeExample: 'Hiker packing a backpack with limited weight capacity picking highest utility items.',
  complexity: {
    time: { best: 'O(N × W)', average: 'O(N × W)', worst: 'O(N × W)' },
    space: { worst: 'O(N × W)' },
  },
  pseudocode: [
    'for i = 1 to N:',
    '    for w = 1 to W:',
    '        if wt[i-1] <= w: dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])',
    '        else: dp[i][w] = dp[i-1][w]',
  ],
  explanation: 'At each cell [i, w], we choose between taking the item (if capacity allows) or leaving it.',
  tags: ['DP', 'Knapsack', 'Dynamic Programming'],
  boardType: 'dp-table',
  defaultInput: { capacity: 4 },
  presets: [{ label: 'Capacity 4 (Optimal: 7)', value: { capacity: 4 } }],
  generateRandomInput: () => ({ capacity: 4 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateKnapsackSteps(input?.capacity);
  },
};

// ==========================================
// 15d. DYNAMIC PROGRAMMING: Fibonacci Dual View
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
  complexity: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'memo[n] = fib(n-1) + fib(n-2)',
    'dp[i] = dp[i-1] + dp[i-2]',
  ],
  explanation: 'Transforms exponential O(2^n) recursion into linear O(n) by caching solutions to overlapping subproblems.',
  tags: ['DP', 'Fibonacci', 'Memoization', 'Tabulation'],
  boardType: 'dp-table',
  defaultInput: { n: 6 },
  presets: [{ label: 'N = 6', value: { n: 6 } }],
  generateRandomInput: () => ({ n: 6 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateFibonacciDualSteps(input?.n || 6);
  },
};

// ==========================================
// 15e. DYNAMIC PROGRAMMING: Coin Change
// ==========================================
export const coinChangeDP: AlgorithmDefinition = {
  id: 'coin-change-dp',
  name: 'Coin Change (Fewest Coins)',
  category: 'dp',
  categoryName: 'Dynamic Programming',
  part: 'algo',
  difficulty: 'Medium',
  description: 'Computes the fewest number of coins that make up a given amount using bottom-up dynamic programming.',
  realLifeExample: 'Self-checkout cash machines calculating minimal coin combinations for change dispensing.',
  complexity: {
    time: { best: 'O(A × C)', average: 'O(A × C)', worst: 'O(A × C)' },
    space: { worst: 'O(A)' },
  },
  pseudocode: [
    'dp[0] = 0, dp[1..A] = INF',
    'for a = 1 to amount:',
    '    for c in coins:',
    '        if a - c >= 0: dp[a] = min(dp[a], 1 + dp[a - c])',
  ],
  explanation: 'Calculates the optimal coin count for every incremental amount from 1 up to target.',
  tags: ['DP', 'Coin Change', 'Optimization'],
  boardType: 'dp-table',
  defaultInput: { coins: [1, 2, 5], amount: 7 },
  presets: [{ label: 'Amount 7, Coins [1, 2, 5]', value: { coins: [1, 2, 5], amount: 7 } }],
  generateRandomInput: () => ({ coins: [1, 2, 5], amount: 7 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateCoinChangeSteps(input?.coins, input?.amount);
  },
};

// ==========================================
// 15f. DYNAMIC PROGRAMMING: Matrix Chain Multiplication
// ==========================================
export const matrixChainMult: AlgorithmDefinition = {
  id: 'matrix-chain-mult',
  name: 'Matrix Chain Multiplication',
  category: 'dp',
  categoryName: 'Dynamic Programming',
  part: 'algo',
  difficulty: 'Advanced',
  description: 'Finds the most efficient parenthesization to multiply a chain of matrices with minimal scalar multiplications.',
  realLifeExample: '3D rendering pipeline matrix transformations optimizing vertex shader matrix multiplication sequences.',
  complexity: {
    time: { best: 'O(N^3)', average: 'O(N^3)', worst: 'O(N^3)' },
    space: { worst: 'O(N^2)' },
  },
  pseudocode: [
    'for L = 2 to n:  // chain length',
    '    for i = 0 to n - L: j = i + L - 1',
    '        m[i][j] = min_k (m[i][k] + m[k+1][j] + d_i * d_{k+1} * d_{j+1})',
  ],
  explanation: 'Fills upper-triangular DP table diagonally by chain length to find optimal subproblem partition.',
  tags: ['DP', 'Matrix Chain', 'Optimization', 'Parenthesization'],
  boardType: 'dp-table',
  defaultInput: {},
  presets: [{ label: '4 Matrices: A1..A4', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateMatrixChainSteps();
  },
};

// ==========================================
// 17. BACKTRACKING: N-Queens
// ==========================================
export const nQueensSolver: AlgorithmDefinition = {
  id: 'n-queens-solver',
  name: 'N-Queens (Choose, Explore, Undo)',
  category: 'backtracking',
  categoryName: 'Backtracking',
  part: 'algo',
  difficulty: 'Advanced',
  description: 'Places N non-attacking chess queens on an N×N chessboard using recursive backtracking with state undo.',
  realLifeExample: 'VLSI chip circuit component routing avoiding electromagnetic cross-talk interference lines.',
  complexity: {
    time: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' },
    space: { worst: 'O(N)' },
  },
  pseudocode: [
    'solveNQueens(row):',
    '    if row == N: recordSolution(); return',
    '    for col = 0 to N - 1:',
    '        if isSafe(row, col):',
    '            placeQueen(row, col)  // Choose',
    '            solveNQueens(row + 1) // Explore',
    '            removeQueen(row, col) // Undo',
  ],
  explanation: 'Tests queen placement column by column; upon conflict, instantly backtracks and restores previous board state.',
  tags: ['Backtracking', 'N-Queens', 'Chess', 'Recursion'],
  boardType: 'backtracking-board',
  defaultInput: { n: 4 },
  presets: [
    { label: '4-Queens (4x4 Board)', value: { n: 4 } },
    { label: '8-Queens (8x8 Board)', value: { n: 8 } },
  ],
  generateRandomInput: () => ({ n: 4 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateNQueensSteps(input?.n || 4);
  },
};

// ==========================================
// 18. BACKTRACKING: Sudoku Solver
// ==========================================
export const sudokuBacktrack: AlgorithmDefinition = {
  id: 'sudoku-backtrack',
  name: 'Sudoku Solver (Constraint Pruning)',
  category: 'backtracking',
  categoryName: 'Backtracking',
  part: 'algo',
  difficulty: 'Advanced',
  description: 'Solves Sudoku puzzles by recursively filling empty cells with valid candidates and backtracking on row/col/box constraint violations.',
  realLifeExample: 'Constraint satisfaction problems like airline crew scheduling and frequency assignment in telecommunication networks.',
  complexity: {
    time: { best: 'O(9^(empty))', average: 'O(9^(empty))', worst: 'O(9^(empty))' },
    space: { worst: 'O(N^2)' },
  },
  pseudocode: [
    'solveSudoku(grid):',
    '    find empty cell (r, c)',
    '    if no empty cell: return true',
    '    for num in 1 to N:',
    '        if isValid(grid, r, c, num):',
    '            grid[r][c] = num',
    '            if solveSudoku(grid): return true',
    '            grid[r][c] = 0 // Undo',
    '    return false',
  ],
  explanation: 'Prunes illegal branches instantly by checking row, column, and subgrid constraints before exploring deeper.',
  tags: ['Backtracking', 'Sudoku', 'Constraints', 'Pruning'],
  boardType: 'backtracking-board',
  defaultInput: { size: 4 },
  presets: [
    { label: '4x4 Sudoku (Easy)', value: { size: 4 } },
    { label: '9x9 Sudoku (Classic)', value: { size: 9 } },
  ],
  generateRandomInput: () => ({ size: 4 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateSudokuSteps(input?.size || 4);
  },
};

// ==========================================
// 19. GREEDY: Activity Selection
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
  complexity: {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'sort activities by finish time',
    'select first activity',
    'for i = 1 to n - 1:',
    '    if act[i].start >= lastSelected.finish: select act[i]',
  ],
  explanation: 'Picking the compatible activity that finishes earliest always leaves maximum possible time for subsequent activities.',
  tags: ['Greedy', 'Activity Selection', 'Intervals'],
  boardType: 'activity-timeline',
  defaultInput: {},
  presets: [{ label: '8 Activities (0..12h)', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateActivitySelectionSteps();
  },
};

// ==========================================
// 20. GREEDY: Huffman Coding Tree
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
  complexity: {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: { worst: 'O(n)' },
  },
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
    yield* generateHuffmanSteps();
  },
};

// ==========================================
// 21. BIT MANIPULATION: AND, OR, XOR & Shifts
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
  complexity: {
    time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'A & B  // Bitwise AND bit-by-bit',
    'A | B  // Bitwise OR bit-by-bit',
    'A ^ B  // Bitwise XOR bit-by-bit',
    'countSetBits: while n > 0: n = n & (n - 1); count++',
  ],
  explanation: 'Operates directly on binary registers at hardware speed with zero abstraction overhead.',
  tags: ['Bits', 'Binary', 'Bitwise'],
  boardType: 'bit-cells',
  defaultInput: { numA: 25, numB: 14 },
  presets: [
    { label: 'A=25, B=14 (AND/OR/XOR/Shifts)', value: { numA: 25, numB: 14 } },
    { label: 'A=29, B=15 (Kernighan Set Bits)', value: { numA: 29, numB: 15 } },
  ],
  generateRandomInput: () => ({ numA: 25, numB: 14 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateBitManipulationSteps(input?.numA ?? 25, input?.numB ?? 14);
  },
};

// ==========================================
// 22. LINKED LIST: Singly Linked List Lifecycle
// ==========================================
export const linkedListReversal: AlgorithmDefinition = {
  id: 'linked-list-reversal',
  name: 'Singly Linked List (Build, Traverse, Modify, Reverse)',
  category: 'linked-list',
  categoryName: 'Linked Lists',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Complete lifecycle of a Singly Linked List: live memory allocation, pointer-by-pointer traversal, node insertion, deletion, and in-place reversal.',
  realLifeExample: 'Music streaming playlist track sequencing where each song holds a pointer link to the next queued track.',
  complexity: {
    time: { best: 'O(1) insert/delete', average: 'O(n) traversal', worst: 'O(n) reverse' },
    space: { worst: 'O(1) auxiliary' },
  },
  pseudocode: [
    'newNode = new Node(val); tail->next = newNode',
    'curr = head; while curr: curr = curr->next',
    'insert: newNode->next = curr->next; curr->next = newNode',
    'delete: prev->next = curr->next; free(curr)',
    'reverse: next = curr->next; curr->next = prev; prev = curr; curr = next',
  ],
  explanation: 'Nodes store data and a next pointer. Pointers are adjusted dynamically in memory without shifting arrays.',
  tags: ['Linked List', 'Pointers', 'Reversal', 'Data Structures'],
  boardType: 'linked-list',
  defaultInput: { mode: 'all' },
  presets: [
    { label: 'Full Lifecycle (Build -> Traverse -> Insert -> Delete -> Reverse)', value: { mode: 'all' } },
    { label: 'Creation & Linking Only', value: { mode: 'create' } },
  ],
  generateRandomInput: () => ({ mode: 'all' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateSinglyLinkedListSteps(input?.mode || 'all');
  },
};

// ==========================================
// 23. LINKED LIST: Floyd Cycle (Tortoise & Hare) & Removal
// ==========================================
export const floydCycleDetect: AlgorithmDefinition = {
  id: 'floyd-cycle-detect',
  name: 'Floyd Cycle (Detection & Loop Removal)',
  category: 'linked-list',
  categoryName: 'Linked Lists',
  part: 'ds',
  difficulty: 'Medium',
  description: 'Two-pointer algorithm detecting closed loops in linked structures using fast (2x) and slow (1x) pointers, locating the loop entry, and breaking the cycle.',
  realLifeExample: 'Deadlock detection in distributed operating systems and circular reference cleanup in garbage collectors.',
  complexity: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'slow = head, fast = head',
    'while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow == fast: break',
    'find start: ptr1 = head, ptr2 = slow; while ptr1 != ptr2: advance both',
    'remove loop: tail->next = null',
  ],
  explanation: 'Fast pointer laps slow pointer inside cycle. Mathematical distance relationship isolates entry point.',
  tags: ['Floyd', 'Cycle Detection', 'Tortoise & Hare', 'Linked List'],
  boardType: 'linked-list',
  defaultInput: {},
  presets: [{ label: '6-Node List with Cycle to Node 3', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateFloydCycleSteps();
  },
};

// ==========================================
// 24. LINKED LIST: Doubly & Circular Linked Lists
// ==========================================
export const doublyLinkedOps: AlgorithmDefinition = {
  id: 'doubly-linked-ops',
  name: 'Doubly & Circular Linked Lists',
  category: 'linked-list',
  categoryName: 'Linked Lists',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Bidirectional linked list maintaining both next and prev pointers with circular wrap-around capabilities.',
  realLifeExample: 'Browser history navigation where clicking Back and Forward moves across prev and next page links.',
  complexity: {
    time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'struct Node { int val; Node* prev; Node* next; }',
    'insert: newNode->next = curr->next; newNode->prev = curr',
    'circular wrap: tail->next = head; head->prev = tail',
  ],
  explanation: 'Each node tracks its forward successor and backward predecessor, allowing bidirectional navigation.',
  tags: ['Doubly Linked', 'Circular', 'Bidirectional', 'Pointers'],
  boardType: 'linked-list',
  defaultInput: { listType: 'doubly' },
  presets: [
    { label: 'Doubly Linked List (Next & Prev)', value: { listType: 'doubly' } },
    { label: 'Circular Linked List (Tail -> Head Wrap)', value: { listType: 'circular' } },
  ],
  generateRandomInput: () => ({ listType: 'doubly' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateDoublyCircularSteps(input?.listType || 'doubly');
  },
};

// ==========================================
// 25. STACK: Push, Pop, Peek & Bounds
// ==========================================
export const stackOperations: AlgorithmDefinition = {
  id: 'stack-operations',
  name: 'Stack: Push, Pop, Peek & Bounds',
  category: 'stack',
  categoryName: 'Stack (LIFO)',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'LIFO (Last-In-First-Out) container demonstrating push, pop, peek, top pointer dynamics, stack overflow, and stack underflow safety guards.',
  realLifeExample: 'Undo/Redo command stacks in text editors and function call stacks in compiler runtime environments.',
  complexity: {
    time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'push(x): if top == cap - 1 => OVERFLOW; stack[++top] = x',
    'pop(): if top == -1 => UNDERFLOW; return stack[top--]',
    'peek(): return stack[top]',
  ],
  explanation: 'Elements are added and removed strictly at the top of the stack in constant O(1) time.',
  tags: ['Stack', 'LIFO', 'Data Structures', 'Call Stack'],
  boardType: 'stack-board',
  defaultInput: {},
  presets: [{ label: 'Push 5 Items, Overflow, Peek, Pop, Underflow', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateStackSteps();
  },
};

// ==========================================
// 26. STACK: Parentheses Validator
// ==========================================
export const parenthesesValidation: AlgorithmDefinition = {
  id: 'parentheses-validation',
  name: 'Parentheses / Syntax Validator',
  category: 'stack',
  categoryName: 'Stack (LIFO)',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Parses programming language syntax brackets character-by-character to ensure balanced opening and closing delimiters.',
  realLifeExample: 'IDE syntax highlighter and compiler lexers detecting missing or mismatched curly braces and parentheses.',
  complexity: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'for char in string:',
    '    if char in "([{": stack.push(char)',
    '    else if char in ")]}":',
    '        if stack.isEmpty() or not match(stack.pop(), char): return false',
    'return stack.isEmpty()',
  ],
  explanation: 'Opening brackets wait on the stack until matching closers arrive, verifying balanced nesting.',
  tags: ['Stack', 'Syntax', 'Parentheses', 'Compiler'],
  boardType: 'stack-board',
  defaultInput: { expression: '{[()()]}' },
  presets: [
    { label: 'Valid Nested: "{[()()]}"', value: { expression: '{[()()]}' } },
    { label: 'Mismatched Closer: "{[(])}"', value: { expression: '{[(])}' } },
    { label: 'Unclosed Opener: "((()" ', value: { expression: '((()' } },
  ],
  generateRandomInput: () => ({ expression: '{[()]}' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateParenthesesSteps(input?.expression || '{[()()]}');
  },
};

// ==========================================
// 27. QUEUE: Circular Queue & Ring Buffer
// ==========================================
export const queueOperations: AlgorithmDefinition = {
  id: 'queue-operations',
  name: 'Circular Queue & Ring Buffer',
  category: 'queue',
  categoryName: 'Queue (FIFO) & Deque',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'FIFO (First-In-First-Out) container using modulo capacity pointer wrap-around to recycle vacated memory slots without shifting elements.',
  realLifeExample: 'Audio audio streaming ring buffers and printer spoolers processing documents in submission order.',
  complexity: {
    time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'enqueue(x): if full => OVERFLOW; rear = (rear + 1) % cap; buf[rear] = x',
    'dequeue(): if empty => UNDERFLOW; val = buf[front]; front = (front + 1) % cap',
  ],
  explanation: 'Modulo arithmetic allows rear and front pointers to wrap from end of buffer to slot 0.',
  tags: ['Queue', 'FIFO', 'Circular Queue', 'Ring Buffer'],
  boardType: 'queue-board',
  defaultInput: {},
  presets: [{ label: 'Ring Buffer Wrap-Around Modulo 5', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateQueueSteps();
  },
};

// ==========================================
// 28. QUEUE: Priority Queue
// ==========================================
export const priorityQueueOps: AlgorithmDefinition = {
  id: 'priority-queue-ops',
  name: 'Priority Queue (Min-Heap)',
  category: 'queue',
  categoryName: 'Queue (FIFO) & Deque',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Heap-backed priority queue retrieving items by priority urgency rather than insertion order via bubble-up operations.',
  realLifeExample: 'Hospital triage room treating severe emergencies before routine check-ups regardless of arrival time.',
  complexity: {
    time: { best: 'O(1) peek', average: 'O(log n) insert', worst: 'O(log n) insert/extract' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'insert(x, priority): heap.push(x); bubbleUp(size - 1)',
    'extractMin(): val = heap[0]; heap[0] = heap.pop(); siftDown(0); return val',
  ],
  explanation: 'Binary min-heap maintains highest priority item at root [0] with logarithmic updates.',
  tags: ['Priority Queue', 'Heap', 'Scheduling'],
  boardType: 'queue-board',
  defaultInput: {},
  presets: [{ label: '4 Urgent Tasks (Heap Bubble-Up)', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generatePriorityQueueSteps();
  },
};

// ==========================================
// 29. HASHING: Hash Table (Separate Chaining & Rehash)
// ==========================================
export const hashTableChaining: AlgorithmDefinition = {
  id: 'hash-table-chaining',
  name: 'Hash Table (Separate Chaining & Rehash)',
  category: 'hashing',
  categoryName: 'Hashing & Collisions',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Starts from empty table, computes live hash codes, resolves collisions via bucket linked chains, monitors load factor α, and dynamically doubles table capacity with full rehashing.',
  realLifeExample: 'Database index lookups and dictionary associative mappings translating keys to values in O(1) average time.',
  complexity: {
    time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'hash(key) = key % capacity',
    'if table[slot] occupied: bucket.append(key)  // Collision Chaining',
    'if loadFactor >= 0.75: resize(capacity * 2); rehashAll()',
  ],
  explanation: 'Maps arbitrary keys to table buckets; linked list chains handle collisions; dynamic rehashing prevents chain elongation.',
  tags: ['Hashing', 'Separate Chaining', 'Collisions', 'Rehashing'],
  boardType: 'hash-table',
  defaultInput: { array: [15, 22, 35, 8, 42, 29, 14, 50], capacity: 7 },
  presets: [
    { label: '8 Keys with Dynamic Resize (7 -> 14)', value: { array: [15, 22, 35, 8, 42, 29, 14, 50], capacity: 7 } },
    { label: 'Heavy Collision Cluster: [7, 14, 21, 28, 35]', value: { array: [7, 14, 21, 28, 35], capacity: 7 } },
  ],
  generateRandomInput: () => ({ array: [15, 22, 35, 8, 42, 29, 14, 50], capacity: 7 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateHashChainingSteps(input?.array, input?.capacity || 7);
  },
};

// ==========================================
// 30. HASHING: Open Addressing (Linear, Quad, Double)
// ==========================================
export const hashOpenAddressing: AlgorithmDefinition = {
  id: 'hash-open-addressing',
  name: 'Open Addressing (Linear, Quad, Double)',
  category: 'hashing',
  categoryName: 'Hashing & Collisions',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Resolves hash collisions without external chains by calculating probe sequences (Linear, Quadratic, Double Hashing) to find the next vacant array slot.',
  realLifeExample: 'CPU cache line conflict allocation and compact in-memory embedded lookup tables.',
  complexity: {
    time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'Linear: h(k, i) = (h(k) + i) % m',
    'Quadratic: h(k, i) = (h(k) + i²) % m',
    'Double: h(k, i) = (h1(k) + i * h2(k)) % m',
  ],
  explanation: 'All elements reside inside the contiguous array; collisions advance through a deterministic probe sequence.',
  tags: ['Hashing', 'Open Addressing', 'Linear Probing', 'Double Hashing'],
  boardType: 'hash-table',
  defaultInput: { mode: 'linear', array: [15, 25, 35, 12, 22, 32, 45, 5] },
  presets: [
    { label: 'Linear Probing (h(k) + i % 10)', value: { mode: 'linear', array: [15, 25, 35, 12, 22, 32, 45, 5] } },
    { label: 'Quadratic Probing (h(k) + i² % 10)', value: { mode: 'quadratic', array: [15, 25, 35, 12, 22, 32, 45, 5] } },
    { label: 'Double Hashing (h1(k) + i*h2(k) % 10)', value: { mode: 'double-hash', array: [15, 25, 35, 12, 22, 32, 45, 5] } },
  ],
  generateRandomInput: () => ({ mode: 'linear', array: [15, 25, 35, 12, 22, 32, 45, 5] }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateHashOpenAddressingSteps(input?.mode || 'linear', input?.array);
  },
};

// ==========================================
// 31. HASHING: Example Solved Questions
// ==========================================
export const hashExampleQuestions: AlgorithmDefinition = {
  id: 'hash-example-questions',
  name: 'Hashing Solved Problems (Two Sum, Set)',
  category: 'hashing',
  categoryName: 'Hashing & Collisions',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Interactive execution of solved classic hashing interview problems: Two Sum with HashMap, Counting Distinct Elements with HashSet, and Collisions insertion.',
  realLifeExample: 'Search autocomplete indexing, transaction deduplication, and fast two-key lookup algorithms.',
  complexity: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(n)' },
  },
  pseudocode: [
    'Two Sum: complement = target - nums[i]; if complement in map: return pair; map[nums[i]] = i',
    'Count Distinct: for x in arr: set.add(x); return set.size()',
  ],
  explanation: 'Employs constant-time hash lookups to transform O(n²) nested loop searches into single O(n) passes.',
  tags: ['Hashing', 'Two Sum', 'HashSet', 'Interview Problems'],
  boardType: 'hash-table',
  defaultInput: { question: 'all' },
  presets: [
    { label: 'All Solved Problems (Suite)', value: { question: 'all' } },
    { label: 'Two Sum with HashMap ([2, 7, 11, 15], target=9)', value: { question: 'two-sum' } },
    { label: 'Count Distinct Elements ([4, 2, 7, 2, 4, 9, 7])', value: { question: 'count-distinct' } },
    { label: 'Insert 15, 25, 35 into Size-10 Table', value: { question: 'insert-collisions' } },
    { label: 'First Non-Repeating Character ("swiss")', value: { question: 'first-unique' } },
  ],
  generateRandomInput: () => ({ question: 'all' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateHashExampleQuestionSteps(input?.question || 'all');
  },
};

// ==========================================
// 32. TREES: Binary Search Tree (Live Build, Search, Delete 3 Cases)
// ==========================================
export const bstInsertSearch: AlgorithmDefinition = {
  id: 'bst-insert-search',
  name: 'BST: Insert, Search & Delete',
  category: 'trees',
  categoryName: 'Trees & BST',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Grows a binary search tree live node-by-node from empty state, traces comparison paths during search, and demonstrates all 3 deletion cases (leaf, one child, two children with in-order successor).',
  realLifeExample: 'Database index trees (B-Trees/BST) facilitating logarithmic record lookups.',
  complexity: {
    time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
    space: { worst: 'O(h)' },
  },
  pseudocode: [
    'insert(val): compare down left/right until null; attach new Node(val)',
    'search(target): while curr: if target == curr.val: found; else branch left/right',
    'delete(val): case 1 leaf: parent.child = null',
    'delete case 2 (1 child): parent.child = curr.child',
    'delete case 3 (2 children): succ = min(curr.right); curr.val = succ.val; delete(succ)',
  ],
  explanation: 'Maintains left < root < right invariant for fast O(log n) lookup, insertion, and deletion.',
  tags: ['Trees', 'BST', 'Binary Search Tree', 'Data Structures'],
  boardType: 'tree-board',
  defaultInput: {},
  presets: [{ label: 'Build Tree, Search 60, Delete 3 Cases (20, 30, 50)', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateBSTSteps();
  },
};

// ==========================================
// 33. TREES: Traversals (In, Pre, Post, Level Order)
// ==========================================
export const treeTraversalsAll: AlgorithmDefinition = {
  id: 'tree-traversals-all',
  name: 'Tree Traversals: In/Pre/Post/Level',
  category: 'trees',
  categoryName: 'Trees & BST',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Visualizes systematic tree traversal orders (In-Order, Pre-Order, Post-Order, and Level-Order BFS) with live output strips and call stacks/queues.',
  realLifeExample: 'Compiler syntax tree evaluation (preorder for prefix, inorder for math formulas, postorder for bottom-up execution).',
  complexity: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: { worst: 'O(h)' },
  },
  pseudocode: [
    'In-Order: traverse(left); visit(node); traverse(right)  // Yields Sorted Order',
    'Pre-Order: visit(node); traverse(left); traverse(right)',
    'Post-Order: traverse(left); traverse(right); visit(node)',
    'Level-Order: queue.push(root); while queue: curr = queue.pop(); visit(curr)',
  ],
  explanation: 'Visits every node exactly once using depth-first recursion or breadth-first FIFO queue.',
  tags: ['Trees', 'Traversals', 'In-Order', 'BFS', 'DFS'],
  boardType: 'tree-board',
  defaultInput: { mode: 'all' },
  presets: [
    { label: 'All 4 Traversals (Sequential In/Pre/Post/Level)', value: { mode: 'all' } },
    { label: 'In-Order (Left -> Root -> Right) [Sorted]', value: { mode: 'inorder' } },
    { label: 'Pre-Order (Root -> Left -> Right)', value: { mode: 'preorder' } },
    { label: 'Post-Order (Left -> Right -> Root)', value: { mode: 'postorder' } },
    { label: 'Level-Order / BFS (Queue-based)', value: { mode: 'levelorder' } },
  ],
  generateRandomInput: () => ({ mode: 'all' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateTraversalSteps(input?.mode || 'all');
  },
};

// ==========================================
// 34. TREES: AVL Tree Self-Balancing Rotations
// ==========================================
export const avlTreeRotations: AlgorithmDefinition = {
  id: 'avl-tree-rotations',
  name: 'AVL Tree Self-Balancing (LL, RR, RL, LR)',
  category: 'trees',
  categoryName: 'Trees & BST',
  part: 'ds',
  difficulty: 'Advanced',
  description: 'Self-balancing BST updating heights and balance factors (|BF| <= 1) on every insert, identifying imbalance patterns (LL, RR, LR, RL), and executing animated sub-step rotations.',
  realLifeExample: 'High-frequency transactional databases requiring strict O(log n) worst-case read time guarantees.',
  complexity: {
    time: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    space: { worst: 'O(h)' },
  },
  pseudocode: [
    'BF = height(node.left) - height(node.right)',
    'if BF > 1 and key < left.key => RightRotate (LL)',
    'if BF < -1 and key > right.key => LeftRotate (RR)',
    'if BF > 1 and key > left.key => LeftRotate(left); RightRotate(node) (LR)',
    'if BF < -1 and key < right.key => RightRotate(right); LeftRotate(node) (RL)',
  ],
  explanation: 'Restores strictly balanced height via single and double rotations whenever balance factor deviates beyond {-1, 0, 1}.',
  tags: ['AVL Tree', 'Self-Balancing', 'Rotations', 'Data Structures'],
  boardType: 'tree-board',
  defaultInput: {},
  presets: [{ label: 'AVL Inserts: RR & RL Double Rotation Lifecycle', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateAVLSteps();
  },
};

// ==========================================
// 35. HEAP: Binary Heap (Synchronized Tree & Array View)
// ==========================================
export const heapDualView: AlgorithmDefinition = {
  id: 'heap-dual-view',
  name: 'Binary Heap: Sync Tree & Array View',
  category: 'heap',
  categoryName: 'Heap (Tree + Array View)',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Dual synchronized representation showing the complete binary tree alongside its backing array, demonstrating bottom-up Heapify in O(n) and in-place Heap Sort.',
  realLifeExample: 'Operating system process schedulers and event-driven simulation priority queues.',
  complexity: {
    time: { best: 'O(n) heapify', average: 'O(n log n) sort', worst: 'O(n log n)' },
    space: { worst: 'O(1) in-place' },
  },
  pseudocode: [
    'heapify: for i = floor(n/2)-1 down to 0: siftDown(i)',
    'siftDown: while largest != i: swap(heap[i], heap[largest]); i = largest',
    'heapSort: while size > 1: swap(heap[0], heap[size-1]); size--; siftDown(0)',
  ],
  explanation: 'Every element in the array maps directly to a node in the complete binary tree without pointer overhead.',
  tags: ['Heap', 'Binary Heap', 'Heap Sort', 'Heapify', 'Priority Queue'],
  boardType: 'heap-dual',
  defaultInput: { mode: 'all' },
  presets: [
    { label: 'Full Heapify & Heap Sort', value: { mode: 'all' } },
    { label: 'Bottom-Up Heapify Only O(n)', value: { mode: 'heapify' } },
  ],
  generateRandomInput: () => ({ mode: 'all' }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateHeapSteps(input?.mode || 'all');
  },
};

// ==========================================
// 36. TRIE: Prefix Tree Autocomplete
// ==========================================
export const triePrefixTree: AlgorithmDefinition = {
  id: 'trie-prefix-tree',
  name: 'Trie: Insert, Search & Autocomplete DFS',
  category: 'trie',
  categoryName: 'Trie (Prefix Tree)',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Character-by-character trie node construction from dictionary words, prefix search navigation, and depth-first search autocomplete exploration.',
  realLifeExample: 'Search engine autocomplete suggestions and smartphone predictive keyboard text input.',
  complexity: {
    time: { best: 'O(L)', average: 'O(L)', worst: 'O(L)' },
    space: { worst: 'O(ALPHABET × L × N)' },
  },
  pseudocode: [
    'insert(word): for ch in word: if not child: createNode(); curr = child; isEnd = true',
    'search(prefix): for ch in prefix: curr = curr.child; return curr != null',
    'autocomplete: curr = findPrefix(prefix); dfsCollect(curr, results)',
  ],
  explanation: 'Prefix tree shares common initial character branches among multiple words for instantaneous prefix queries.',
  tags: ['Trie', 'Prefix Tree', 'Strings', 'Autocomplete'],
  boardType: 'trie-board',
  defaultInput: {},
  presets: [{ label: '5 Words (cat, car, cart, dog, dot) with "ca" Autocomplete', value: {} }],
  generateRandomInput: () => ({}),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateTrieSteps();
  },
};

// ==========================================
// 37. MATRIX: 2D Grid Image Flood Fill & Islands
// ==========================================
export const matrixFloodFill: AlgorithmDefinition = {
  id: 'matrix-flood-fill',
  name: '2D Grid Image Flood Fill & Number of Islands',
  category: 'matrix',
  categoryName: 'Matrix & 2D Grid',
  part: 'ds',
  difficulty: 'Medium',
  description: 'Simulates graphic paint bucket flood fill and connected components / island sinking using 4-directional breadth-first search.',
  realLifeExample: 'Photoshop paint bucket tool filling contiguous regions of identical color and satellite imagery island mapping.',
  complexity: {
    time: { best: 'O(M × N)', average: 'O(M × N)', worst: 'O(M × N)' },
    space: { worst: 'O(M × N)' },
  },
  pseudocode: [
    'for r in 0..rows: for c in 0..cols:',
    '    if grid[r][c] == 1: islands++; bfsQueue.push([r, c])',
    '    while bfsQueue: [cr, cc] = pop(); markSunk(cr, cc)',
    '    for (dr, dc) in [(-1,0), (1,0), (0,-1), (0,1)]:',
    '        if inBounds && grid[nr][nc] == 1: bfsQueue.push([nr, nc])',
  ],
  explanation: 'Expands along connected cardinal directions (North, South, East, West) repainting and sinking contiguous land tiles one cell at a time.',
  tags: ['Matrix', 'Flood Fill', 'Islands', 'BFS', '2D Grid'],
  boardType: 'grid-matrix',
  defaultInput: { rows: 4, cols: 5 },
  presets: [{ label: '4×5 Grid (2 Distinct Disconnected Islands)', value: { rows: 4, cols: 5 } }],
  generateRandomInput: () => ({ rows: 4, cols: 5 }),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateFloodFillSteps();
  },
};

// ==========================================
// 38. MATRIX: Spiral Order Traversal & Divide
// ==========================================
export const matrixSpiralOrder: AlgorithmDefinition = {
  id: 'matrix-spiral-order',
  name: 'Spiral Order Matrix Traversal',
  category: 'matrix',
  categoryName: 'Matrix & 2D Grid',
  part: 'ds',
  difficulty: 'Medium',
  description: 'Traverses a 2D matrix in a clockwise inward spiral, contracting Top, Bottom, Left, and Right boundary pointers.',
  realLifeExample: 'Camera sensor raster scanning, robotic vacuum floor cleaning paths, and image spiral convolution.',
  complexity: {
    time: { best: 'O(M × N)', average: 'O(M × N)', worst: 'O(M × N)' },
    space: { worst: 'O(1)' },
  },
  pseudocode: [
    'traverse top row: c = left..right; top++',
    'traverse right col: r = top..bottom; right--',
    'traverse bottom row: c = right..left; bottom--',
    'traverse left col: r = bottom..top; left++',
  ],
  explanation: 'Concentric perimeter boundary contractions prevent visiting already processed cells in strictly O(M × N) time.',
  tags: ['Matrix', 'Spiral', 'Simulation', '2D Grid'],
  boardType: 'grid-matrix',
  defaultInput: { rows: 4, cols: 4 },
  presets: [{ label: '4×4 Concentric Matrix (Values 1 to 16)', value: { rows: 4, cols: 4 } }],
  generateRandomInput: () => ({ rows: 4, cols: 4 }),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateSpiralSteps();
  },
};

// ==========================================
// 39. RECURSION: Tower of Hanoi (4 Disks, 15 moves, >= 30 steps)
// ==========================================
export const towerOfHanoi: AlgorithmDefinition = {
  id: 'tower-of-hanoi',
  name: 'Tower of Hanoi & Call Stack',
  category: 'recursion',
  categoryName: 'Recursion & Call Stack',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Moves N disks between 3 pegs without ever placing a larger disk onto a smaller disk. Default 4 disks (15 moves) with call stack push/pop animation.',
  realLifeExample: 'Backup rotation schemes, recursive directory replication, and robotic arm payload staging.',
  complexity: { time: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'hanoi(n, from, to, aux):',
    '    if n == 1: move(from, to); return',
    '    hanoi(n - 1, from, aux, to)',
    '    move(from, to)',
    '    hanoi(n - 1, aux, to, from)',
  ],
  explanation: 'Solves N disks by recursively moving top N-1 disks to auxiliary peg, moving largest disk to target peg, then moving N-1 disks onto target peg.',
  tags: ['Recursion', 'Hanoi', 'Call Stack', 'Divide and Conquer'],
  boardType: 'recursion-tree',
  defaultInput: { disks: 4 },
  presets: [
    { label: '4 Disks (15 moves, 31 steps)', value: { disks: 4 } },
    { label: '3 Disks (7 moves, 15 steps)', value: { disks: 3 } },
  ],
  generateRandomInput: () => ({ disks: 4 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateHanoiSteps(input?.disks || 4);
  },
};

// ==========================================
// 40. SEARCHING: Jump Search
// ==========================================
export const jumpSearch: AlgorithmDefinition = {
  id: 'jump-search',
  name: 'Jump Search (Block Jumping)',
  category: 'searching',
  categoryName: 'Searching Algorithms',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Searches sorted array by jumping forward by fixed block steps of m = floor(sqrt(n)), then performing a backward linear scan within the identified block.',
  realLifeExample: 'Fast-forwarding chapters in audiobooks/videos before fine-tuning with 5-second skips.',
  complexity: { time: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'm = floor(sqrt(n))',
    'while arr[min(step, n)-1] < target: prev = step; step += m',
    'while arr[prev] < target: prev++; if prev == min(step, n): return -1',
    'if arr[prev] == target: return prev',
  ],
  explanation: 'Optimal step size is √n, balancing jump overhead and linear scan length in O(√n) time.',
  tags: ['Searching', 'Jump Search', 'Square Root', 'Sorted Array'],
  boardType: 'array-search',
  defaultInput: { array: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610], target: 55 },
  presets: [{ label: '16 Fibonacci numbers, target=55', value: { array: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610], target: 55 } }],
  generateRandomInput: () => ({ array: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610], target: 55 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateJumpSearchSteps(input?.array, input?.target);
  },
};

// ==========================================
// 41. SEARCHING: Interpolation Search
// ==========================================
export const interpolationSearch: AlgorithmDefinition = {
  id: 'interpolation-search',
  name: 'Interpolation Search (Proportional Probe)',
  category: 'searching',
  categoryName: 'Searching Algorithms',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Searches sorted uniformly distributed arrays by estimating probe position based on key value, achieving average O(log log n) time.',
  realLifeExample: 'Searching a phonebook for "Williams" near the very end rather than starting exactly at page 500.',
  complexity: { time: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'pos = low + floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))',
    'if arr[pos] == target: return pos',
    'if arr[pos] < target: low = pos + 1 else high = pos - 1',
  ],
  explanation: 'Uses linear interpolation formula to probe closer to the target key position in uniformly distributed data.',
  tags: ['Searching', 'Interpolation', 'Probing', 'Sorted Array'],
  boardType: 'array-search',
  defaultInput: { array: [3, 9, 17, 26, 38, 52, 69, 89, 112, 138, 168, 201, 238, 279, 324, 373], target: 201 },
  presets: [{ label: '16 non-uniform items, target=201', value: { array: [3, 9, 17, 26, 38, 52, 69, 89, 112, 138, 168, 201, 238, 279, 324, 373], target: 201 } }],
  generateRandomInput: () => ({ array: [3, 9, 17, 26, 38, 52, 69, 89, 112, 138, 168, 201, 238, 279, 324, 373], target: 201 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateInterpolationSearchSteps(input?.array, input?.target);
  },
};

// ==========================================
// 42. SORTING: Counting Sort
// ==========================================
export const countingSort: AlgorithmDefinition = {
  id: 'counting-sort',
  name: 'Counting Sort (Non-Comparison)',
  category: 'sorting',
  categoryName: 'Sorting Algorithms',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'Non-comparison integer sort that tallies key frequencies, computes prefix sums to determine positions, and places elements stably in O(n + k) time.',
  realLifeExample: 'Sorting student exam scores ranging from 0 to 100 across a graduating class of 10,000 students.',
  complexity: { time: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' }, space: { worst: 'O(k)' } },
  pseudocode: [
    'count = array of zeros of size (max - min + 1)',
    'for x in arr: count[x - min]++',
    'for i from 1 to count.length: count[i] += count[i - 1]',
    'for x in arr reversed: output[count[x - min] - 1] = x; count[x - min]--',
  ],
  explanation: 'Achieves linear time sorting by mapping small integer keys directly to array buckets without element comparisons.',
  tags: ['Sorting', 'Counting Sort', 'Non-Comparison', 'Stable'],
  boardType: 'array-sort',
  defaultInput: { array: [4, 2, 2, 8, 3, 3, 1] },
  presets: [{ label: '[4, 2, 2, 8, 3, 3, 1]', value: { array: [4, 2, 2, 8, 3, 3, 1] } }],
  generateRandomInput: () => ({ array: [5, 1, 4, 2, 2, 3, 1] }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateCountingSortSteps(input?.array);
  },
};

// ==========================================
// 43. SORTING: Heap Sort
// ==========================================
export const heapSortAlgo: AlgorithmDefinition = {
  id: 'heap-sort-algo',
  name: 'Heap Sort (In-Place Sift-Down)',
  category: 'sorting',
  categoryName: 'Sorting Algorithms',
  part: 'algo',
  difficulty: 'Intermediate',
  description: 'In-place O(n log n) comparison sort: builds a Max-Heap from the input, then repeatedly swaps root with the current end and sifts down.',
  realLifeExample: 'Continuous priority scheduling and finding top-K elements in live memory-constrained embedded systems.',
  complexity: { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'buildMaxHeap(arr)',
    'for i from n - 1 down to 1:',
    '    swap(arr[0], arr[i])',
    '    heapify(arr, 0, i)',
  ],
  explanation: 'Combines the O(n log n) worst-case speed of Merge Sort with the O(1) auxiliary space of Insertion Sort.',
  tags: ['Sorting', 'Heap Sort', 'Max-Heap', 'In-Place'],
  boardType: 'heap-dual',
  defaultInput: { array: [12, 11, 13, 5, 6, 7] },
  presets: [{ label: '[12, 11, 13, 5, 6, 7]', value: { array: [12, 11, 13, 5, 6, 7] } }],
  generateRandomInput: () => ({ array: [20, 5, 15, 3, 10, 8] }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateHeapSortSteps(input?.array);
  },
};

// ==========================================
// 44. RECURSION: Factorial Call Stack
// ==========================================
export const recursionFactorial: AlgorithmDefinition = {
  id: 'recursion-factorial',
  name: 'Recursion: Factorial Call Stack',
  category: 'recursion',
  categoryName: 'Recursion & Call Stack',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Visualizes recursive call stack growth and unwinding return values when computing n! = n × (n - 1)!. Shows active frame push/pop.',
  realLifeExample: 'Permutations calculation and compiler runtime stack frame execution models.',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'def factorial(n):',
    '    if n <= 1: return 1',
    '    return n * factorial(n - 1)',
  ],
  explanation: 'Demonstrates stack overflow risk and activation record lifecycle during recursive function calls.',
  tags: ['Recursion', 'Factorial', 'Call Stack', 'Frames'],
  boardType: 'recursion-tree',
  defaultInput: { n: 6 },
  presets: [
    { label: '6! = 720 (22 steps)', value: { n: 6 } },
    { label: '5! = 120 (18 steps)', value: { n: 5 } },
    { label: '4! = 24 (15 steps)', value: { n: 4 } },
  ],
  generateRandomInput: () => ({ n: 6 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateFactorialSteps(input?.n || 6);
  },
};

// ==========================================
// 45. RECURSION: Fibonacci Tree
// ==========================================
export const recursionFibonacciTree: AlgorithmDefinition = {
  id: 'recursion-fibonacci-tree',
  name: 'Recursion: Fibonacci Call Tree',
  category: 'recursion',
  categoryName: 'Recursion & Call Stack',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Visualizes the bifurcating binary recursion tree of naive fib(n) = fib(n - 1) + fib(n - 2), revealing the massive O(2ⁿ) redundant subproblem calculations.',
  realLifeExample: 'Demonstrating why naive recursion fails on overlapping subproblems, motivating Dynamic Programming.',
  complexity: { time: { best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'def fib(n):',
    '    if n <= 1: return n',
    '    return fib(n - 1) + fib(n - 2)',
  ],
  explanation: 'Shows tree explosion with identical subtrees computed over and over across separate branches.',
  tags: ['Recursion', 'Fibonacci', 'Binary Tree', 'Overlapping Subproblems'],
  boardType: 'recursion-tree',
  defaultInput: { n: 4 },
  presets: [{ label: 'fib(4) Tree (21 steps)', value: { n: 4 } }],
  generateRandomInput: () => ({ n: 4 }),
  *run(input): Generator<StepAction, void, unknown> {
    yield* generateFibonacciTreeSteps(input?.n || 4);
  },
};

// ==========================================
// 46. ARRAYS: CRUD Operations (Insert, Shift, Delete)
// ==========================================
export const arrayCrudOperations: AlgorithmDefinition = {
  id: 'array-crud-operations',
  name: 'Array CRUD: Insert, Shift & Delete',
  category: 'arrays',
  categoryName: 'Arrays & Patterns',
  part: 'ds',
  difficulty: 'Beginner',
  description: 'Step-by-step element shifting during array insertions (shift right to create space) and deletions (shift left to fill vacant gap).',
  realLifeExample: 'Inserting a song into a playlist queue or deleting a task from a prioritized to-do list.',
  complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(1)' } },
  pseudocode: [
    'Insert at index k: for i from size-1 down to k: arr[i+1] = arr[i]; arr[k] = val; size++',
    'Delete at index k: for i from k to size-2: arr[i] = arr[i+1]; size--',
  ],
  explanation: 'Demonstrates why contiguous array insertions and deletions take O(n) time due to element shifting.',
  tags: ['Arrays', 'CRUD', 'Insertion', 'Deletion', 'Shifting'],
  boardType: 'array-pattern',
  defaultInput: { array: [10, 20, 30, 40, 50] },
  presets: [{ label: '[10, 20, 30, 40, 50]', value: { array: [10, 20, 30, 40, 50] } }],
  generateRandomInput: () => ({ array: [10, 20, 30, 40, 50] }),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateArrayCRUDSteps();
  },
};

// ==========================================
// 47. STRINGS: Comparison & Concatenation
// ==========================================
export const stringComparisonConcat: AlgorithmDefinition = {
  id: 'string-comparison-concat',
  name: 'String Comparison & Concatenation',
  category: 'strings',
  categoryName: 'String Algorithms',
  part: 'algo',
  difficulty: 'Beginner',
  description: 'Character-by-character lexicographical string comparison (strcmp) and buffer concatenation (strcat) with memory allocation.',
  realLifeExample: 'Alphabetical sorting of contact lists and building HTTP URL query strings.',
  complexity: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'compare(s1, s2): for i from 0 to min(len1, len2): if s1[i] != s2[i]: return s1[i] - s2[i]',
    'concat(s1, s2): allocate len1 + len2 buffer; copy s1; copy s2; return buffer',
  ],
  explanation: 'Shows ASCII byte comparisons and memory copying behind immutable string operations.',
  tags: ['Strings', 'Comparison', 'Concatenation', 'Lexicographical'],
  boardType: 'string-ops',
  defaultInput: { str1: 'ALGO', str2: 'ALARM' },
  presets: [{ label: '"ALGO" vs "ALARM"', value: { str1: 'ALGO', str2: 'ALARM' } }],
  generateRandomInput: () => ({ str1: 'ALGO', str2: 'ALARM' }),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateStringCompareConcatSteps();
  },
};

// ==========================================
// 48. TREES: Binary Tree Height, Depth & LCA
// ==========================================
export const binaryTreeLcaHeight: AlgorithmDefinition = {
  id: 'binary-tree-lca-height',
  name: 'Binary Tree: Height, Depth & LCA',
  category: 'trees',
  categoryName: 'Tree Data Structures',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Computes tree node depths, sub-tree heights, and finds the Lowest Common Ancestor (LCA) of two given nodes via recursive post-order traversal.',
  realLifeExample: 'Git merge base commit resolution and organizational hierarchy managerial routing.',
  complexity: { time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, space: { worst: 'O(h)' } },
  pseudocode: [
    'height(node): return 1 + max(height(node.left), height(node.right))',
    'lca(root, p, q): if !root || root == p || root == q: return root',
    'left = lca(root.left, p, q); right = lca(root.right, p, q)',
    'if left && right: return root; return left ? left : right',
  ],
  explanation: 'Post-order DFS returns subtree results upward; LCA is the bifurcation node where both left and right return matches.',
  tags: ['Trees', 'Binary Tree', 'Height', 'Depth', 'LCA'],
  boardType: 'tree-board',
  defaultInput: { p: 4, q: 7 },
  presets: [{ label: 'LCA of 4 and 7', value: { p: 4, q: 7 } }],
  generateRandomInput: () => ({ p: 4, q: 7 }),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateTreeLCAHeightSteps();
  },
};

// ==========================================
// 49. LINKED LIST: Circular Doubly Linked List
// ==========================================
export const circularDoublyLinkedList: AlgorithmDefinition = {
  id: 'circular-doubly-linked-list',
  name: 'Circular Doubly Linked List',
  category: 'linked-list',
  categoryName: 'Linked Lists',
  part: 'ds',
  difficulty: 'Intermediate',
  description: 'Bidirectional circular list where tail->next wraps back to head, and head->prev wraps back to tail. Animated forward & backward traversal.',
  realLifeExample: 'Alt-Tab task switcher window carousel and circular buffer playlists.',
  complexity: { time: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' }, space: { worst: 'O(n)' } },
  pseudocode: [
    'head->prev = tail; tail->next = head',
    'forward: curr = curr->next; if curr == head: wrapped',
    'backward: curr = curr->prev; if curr == tail: wrapped',
  ],
  explanation: 'Permits infinite circular traversal in either direction with O(1) insertion at either boundary.',
  tags: ['Linked List', 'Doubly Linked', 'Circular', 'Bidirectional'],
  boardType: 'linked-list',
  defaultInput: { listType: 'circular' },
  presets: [{ label: 'Circular Doubly (5 Nodes, 22 steps)', value: { listType: 'circular' } }],
  generateRandomInput: () => ({ listType: 'circular' }),
  *run(): Generator<StepAction, void, unknown> {
    yield* generateCircularDoublySteps();
  },
};

// Re-export other modules through ensureStepReason in useAlgorithmStore
export {
  selectionSort,
  mergeSortTree,
  quickSortPartition,
  divideConquerMerge,
  divideConquerQuick,
  divideConquerBinary,
} from './dsaModulesOriginal';
