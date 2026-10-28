import { AlgorithmDefinition, CategoryInfo, DSASectionPart } from '../types';
import { binarySearch } from './searching/binarySearch';
import { linearSearch } from './searching/linearSearch';
import { bubbleSort } from './sorting/bubbleSort';
import { insertionSort } from './sorting/insertionSort';
import {
  kadaneAlgorithm,
  twoPointersSum,
  slidingWindowMax,
  prefixSumRange,
  kmpPatternMatching,
  palindromeCheck,
  rabinKarpHash,
  linkedListReversal,
  floydCycleDetect,
  doublyLinkedOps,
  stackOperations,
  parenthesesValidation,
  queueOperations,
  priorityQueueOps,
  bstInsertSearch,
  treeTraversalsAll,
  avlTreeRotations,
  graphBfsDfs,
  dijkstraShortest,
  adjListMatrixDual,
  kruskalPrimMST,
  hashTableChaining,
  hashOpenAddressing,
  hashExampleQuestions,
  heapDualView,
  triePrefixTree,
  disjointSetUnion,
  matrixFloodFill,
  matrixSpiralOrder,
  towerOfHanoi,
  selectionSort,
  mergeSortTree,
  quickSortPartition,
  divideConquerMerge,
  divideConquerQuick,
  divideConquerBinary,
  knapsack01Table,
  lcsAnimatedFill,
  coinChangeDP,
  matrixChainMult,
  huffmanCodingTree,
  activitySelectionOpt,
  nQueensSolver,
  sudokuBacktrack,
  bitManipulation,
  dpFibonacciDual,
  jumpSearch,
  interpolationSearch,
  countingSort,
  heapSortAlgo,
  recursionFactorial,
  recursionFibonacciTree,
  arrayCrudOperations,
  stringComparisonConcat,
  binaryTreeLcaHeight,
  circularDoublyLinkedList,
} from './dsaModules';

// =================================================================
// 20 CORE DSA CATEGORIES (12 Data Structures + 8 Algorithms)
// =================================================================
export const categories: CategoryInfo[] = [
  // PART 1: DATA STRUCTURES
  {
    id: 'arrays',
    part: 'ds',
    title: '1. Arrays & Patterns',
    description: 'Static vs dynamic, index access, traversal, Kadane max subarray, Two Pointers, Sliding Window, Prefix Sum.',
    realLifeAnalogy: 'Train passenger seats numbered 0 to N-1 with instant seat access in O(1) time.',
    iconName: 'LayoutGrid',
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-500',
    subtopics: ['Static vs Dynamic', 'Kadane Max Subarray', 'Two Pointers Target', 'Sliding Window', 'Prefix Sum'],
  },
  {
    id: 'strings',
    part: 'ds',
    title: '2. Strings & Pattern Matching',
    description: 'Comparison, concatenation, palindrome check, subsequences, KMP with LPS table, and Rabin-Karp rolling hash.',
    realLifeAnalogy: 'Ctrl+F search in a book editor or genomic DNA sequence matching.',
    iconName: 'Type',
    color: 'from-indigo-500/20 to-blue-500/20 text-indigo-500',
    subtopics: ['Palindrome Check', 'KMP Pattern Matching', 'LPS Table', 'Rabin-Karp Rolling Hash'],
  },
  {
    id: 'linked-list',
    part: 'ds',
    title: '3. Linked Lists',
    description: 'Singly, Doubly, Circular, and Circular Doubly; insertion, deletion, reversal, Floyd cycle detection & removal.',
    realLifeAnalogy: 'Music player playlist: next track and previous track pointers, and repeat-playlist loops.',
    iconName: 'GitCommit',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500',
    subtopics: ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List', 'Floyd Cycle Detection'],
  },
  {
    id: 'stack',
    part: 'ds',
    title: '4. Stack (LIFO)',
    description: 'Push, pop, peek; undo/redo demo, syntax brackets check, and backtracking demo.',
    realLifeAnalogy: 'A stack of cafeteria plates, browser back-history, and Ctrl+Z undo buffer.',
    iconName: 'Layers',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-500',
    subtopics: ['Push / Pop / Peek', 'Undo / Redo Buffer', 'Syntax Bracket Match', 'Call Stack Frames'],
  },
  {
    id: 'queue',
    part: 'ds',
    title: '5. Queue (FIFO) & Deque',
    description: 'Simple Queue, Circular Queue with modular pointer wrap, Priority Queue, and Double-Ended Queue (Deque).',
    realLifeAnalogy: 'Movie ticket counter queue or printer job queue where first request is served first.',
    iconName: 'ArrowRightLeft',
    color: 'from-orange-500/20 to-red-500/20 text-orange-500',
    subtopics: ['Simple FIFO', 'Circular Queue Wrap', 'Priority Queue', 'Double-Ended Queue (Deque)'],
  },
  {
    id: 'trees',
    part: 'ds',
    title: '6. Trees & BST',
    description: 'Binary tree, BST (insert, search, delete), AVL rotations, traversals (in/pre/post/level), height & LCA.',
    realLifeAnalogy: 'Operating system directory folder hierarchy and corporate organizational chart.',
    iconName: 'GitFork',
    color: 'from-green-500/20 to-emerald-500/20 text-green-500',
    subtopics: ['BST Insert & Search', 'AVL Self-Balancing', 'Inorder / Preorder / Postorder', 'Lowest Common Ancestor'],
  },
  {
    id: 'graphs',
    part: 'ds',
    title: '7. Graphs & Dual View',
    description: 'Directed/undirected, weighted/unweighted, Adjacency List vs Adjacency Matrix dual-view, BFS, DFS, Dijkstra, Kruskal, Prim.',
    realLifeAnalogy: 'Google Maps city road intersections and social media friend networks.',
    iconName: 'Network',
    color: 'from-sky-500/20 to-indigo-500/20 text-sky-500',
    subtopics: ['Adjacency List vs Matrix', 'Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Dijkstra Shortest Path'],
  },
  {
    id: 'hashing',
    part: 'ds',
    title: '8. Hashing & Collisions',
    description: 'Hash functions, hash map, separate chaining buckets, and open addressing linear probing.',
    realLifeAnalogy: 'Airport luggage tag barcodes mapping directly to luggage carousel slots.',
    iconName: 'Hash',
    color: 'from-yellow-500/20 to-amber-500/20 text-yellow-500',
    subtopics: ['Hash Function Modulo', 'Separate Chaining', 'Open Addressing Probing'],
  },
  {
    id: 'heap',
    part: 'ds',
    title: '9. Heap (Tree + Array View)',
    description: 'Min-Heap, Max-Heap, insert, extract, heapify, Heap Sort, Priority Queue with synchronized tree and array dual-view.',
    realLifeAnalogy: 'Hospital emergency room priority triage where highest emergency patient is treated first.',
    iconName: 'ArrowDownUp',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-500',
    subtopics: ['Min-Heap Tree vs Array', 'Max-Heapify Down', 'Priority Queue Operations'],
  },
  {
    id: 'trie',
    part: 'ds',
    title: '10. Trie (Prefix Tree)',
    description: 'Insert, search, prefix search, and dictionary word autocomplete.',
    realLifeAnalogy: 'Phonebook predictive keyboard autocomplete while typing SMS messages.',
    iconName: 'Sparkles',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-500',
    subtopics: ['Trie Insert & Search', 'Prefix Match', 'Autocomplete Suggestions'],
  },
  {
    id: 'disjoint-set',
    part: 'ds',
    title: '11. Disjoint Set (Union-Find)',
    description: 'Find with path compression, union by rank, and connection to Kruskal MST.',
    realLifeAnalogy: 'Merging social clubs where each club has one elected president representing the group.',
    iconName: 'GitMerge',
    color: 'from-fuchsia-500/20 to-rose-500/20 text-fuchsia-500',
    subtopics: ['Union by Rank', 'Find with Path Compression', 'Connected Components'],
  },
  {
    id: 'matrix',
    part: 'ds',
    title: '12. Matrix & 2D Grid',
    description: '2D grid traversal, image-processing flood fill, spiral traversal, 90-degree rotate, and grid DP paths.',
    realLifeAnalogy: 'Photoshop paint bucket tool flood filling a shape or image pixel manipulation.',
    iconName: 'Grid',
    color: 'from-rose-500/20 to-pink-500/20 text-rose-500',
    subtopics: ['2D Grid Flood Fill', 'Spiral Order Traversal', 'Matrix Rotation 90°', 'Unique Grid Paths'],
  },

  // PART 2: ALGORITHMS
  {
    id: 'recursion',
    part: 'algo',
    title: '1. Recursion & Call Stack',
    description: 'Factorial, Fibonacci call stack and recursion tree, and Tower of Hanoi disk puzzle.',
    realLifeAnalogy: 'Russian Matryoshka nesting dolls opening smaller identical dolls inside.',
    iconName: 'Repeat',
    color: 'from-blue-500/20 to-purple-500/20 text-blue-500',
    subtopics: ['Tower of Hanoi', 'Factorial Call Stack', 'Fibonacci Tree'],
  },
  {
    id: 'searching',
    part: 'algo',
    title: '2. Searching Algorithms',
    description: 'Linear Search, Binary Search (low/mid/high boundaries), Jump Search, and Interpolation Search.',
    realLifeAnalogy: 'Opening a physical dictionary right in the middle to find a word faster.',
    iconName: 'Search',
    color: 'from-sky-500/20 to-cyan-500/20 text-sky-500',
    subtopics: ['Binary Search', 'Linear Search', 'Jump Search', 'Interpolation Search'],
  },
  {
    id: 'sorting',
    part: 'algo',
    title: '3. Sorting Algorithms',
    description: 'Basic (Bubble, Insertion, Selection) and Advanced (Merge, Quick, Heap, Counting); compare mode for any two.',
    realLifeAnalogy: 'Sorting a deck of playing cards in your hand in ascending order.',
    iconName: 'ArrowUpDown',
    color: 'from-violet-500/20 to-purple-500/20 text-violet-500',
    subtopics: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort'],
  },
  {
    id: 'divide-and-conquer',
    part: 'algo',
    title: '4. Divide and Conquer',
    description: 'Merge Sort split/merge tree, Quick Sort pivot partitioning, and Binary Search as D&C.',
    realLifeAnalogy: 'Breaking a massive group project into independent sub-tasks, then merging results.',
    iconName: 'Split',
    color: 'from-teal-500/20 to-emerald-500/20 text-teal-500',
    subtopics: ['Merge Sort Tree', 'Quick Sort Partitioning', 'Binary Search as D&C'],
  },
  {
    id: 'dp',
    part: 'algo',
    title: '5. Dynamic Programming',
    description: 'Fibonacci Top-Down vs Bottom-Up side-by-side, LCS, 0/1 Knapsack, Coin Change, Matrix Chain Multiplication.',
    realLifeAnalogy: 'Remembering 1+1+1+1=4 so when another 1 is added, you immediately know it is 5 without recount.',
    iconName: 'Table',
    color: 'from-rose-500/20 to-amber-500/20 text-rose-500',
    subtopics: ['Fibonacci Memo vs Tabulation', '0/1 Knapsack Table', 'Longest Common Subsequence (LCS)', 'Coin Change'],
  },
  {
    id: 'greedy',
    part: 'algo',
    title: '6. Greedy Algorithms',
    description: 'Huffman Coding prefix tree, Activity Selection, Kruskal MST, and Prim MST.',
    realLifeAnalogy: 'Cashier giving change with the fewest coins by always picking largest denomination first.',
    iconName: 'Zap',
    color: 'from-amber-500/20 to-yellow-500/20 text-amber-500',
    subtopics: ['Huffman Coding Tree', 'Activity Selection', "Kruskal's MST", "Prim's Algorithm"],
  },
  {
    id: 'backtracking',
    part: 'algo',
    title: '7. Backtracking',
    description: 'N-Queens placement, Sudoku Solver showing Choose, Explore, Undo phases.',
    realLifeAnalogy: 'Navigating a maze: walk a path until hitting a dead end, then backtrack to the last fork.',
    iconName: 'Undo2',
    color: 'from-fuchsia-500/20 to-purple-500/20 text-fuchsia-500',
    subtopics: ['N-Queens Problem', 'Sudoku Solver (Choose/Explore/Undo)', 'Subsets Power Set'],
  },
  {
    id: 'bit-manipulation',
    part: 'algo',
    title: '8. Bit Manipulation',
    description: 'AND, OR, XOR, shifts, counting set bits, odd/even check; animated toggling binary cells.',
    realLifeAnalogy: 'A bank of light switches representing device on/off configuration states.',
    iconName: 'Cpu',
    color: 'from-emerald-500/20 to-cyan-500/20 text-emerald-500',
    subtopics: ['Bitwise AND / OR / XOR', 'Bit Shifts (Left & Right)', 'Count Set Bits (Hamming Weight)', 'Odd / Even Check'],
  },
];

// =================================================================
// RUNNABLE EXECUTABLE ALGORITHMS REGISTRY (ALL UNLOCKED & IMPLEMENTED)
// =================================================================
export const algorithmRegistry: AlgorithmDefinition[] = [
  // Searching
  binarySearch,
  linearSearch,
  // Sorting
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSortTree,
  quickSortPartition,
  // Divide & Conquer
  divideConquerMerge,
  divideConquerQuick,
  divideConquerBinary,
  // Arrays
  kadaneAlgorithm,
  twoPointersSum,
  slidingWindowMax,
  prefixSumRange,
  // Strings
  kmpPatternMatching,
  palindromeCheck,
  rabinKarpHash,
  // Linked Lists
  linkedListReversal,
  floydCycleDetect,
  doublyLinkedOps,
  // Stack
  stackOperations,
  parenthesesValidation,
  // Queue
  queueOperations,
  priorityQueueOps,
  // Trees
  bstInsertSearch,
  treeTraversalsAll,
  avlTreeRotations,
  // Graphs
  graphBfsDfs,
  dijkstraShortest,
  adjListMatrixDual,
  kruskalPrimMST,
  // Hashing
  hashTableChaining,
  hashOpenAddressing,
  hashExampleQuestions,
  // Heap
  heapDualView,
  // Trie
  triePrefixTree,
  // Disjoint Set
  disjointSetUnion,
  // Matrix
  matrixFloodFill,
  matrixSpiralOrder,
  // Recursion
  towerOfHanoi,
  // Dynamic Programming
  dpFibonacciDual,
  knapsack01Table,
  lcsAnimatedFill,
  coinChangeDP,
  matrixChainMult,
  // Greedy
  huffmanCodingTree,
  activitySelectionOpt,
  // Backtracking
  nQueensSolver,
  sudokuBacktrack,
  // Bit Manipulation
  bitManipulation,
  // Additional Topics
  jumpSearch,
  interpolationSearch,
  countingSort,
  heapSortAlgo,
  recursionFactorial,
  recursionFibonacciTree,
  arrayCrudOperations,
  stringComparisonConcat,
  binaryTreeLcaHeight,
  circularDoublyLinkedList,
];

// Comprehensive Planned Catalog for Sidebar & Command Palette Search (100% UNLOCKED)
export interface PlannedTopicItem {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  part: DSASectionPart;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Easy' | 'Medium' | 'Hard';
  timeComplexity: string;
  spaceComplexity: string;
  isAvailable: boolean;
}

export const fullCatalog: PlannedTopicItem[] = [
  // PART 1: DATA STRUCTURES
  // 1. Arrays
  { id: 'kadane-algorithm', name: "Kadane's Algorithm (Max Subarray)", category: 'arrays', categoryName: 'Arrays & Patterns', part: 'ds', difficulty: 'Medium', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'two-pointers-sum', name: 'Two Pointers (Target Sum)', category: 'arrays', categoryName: 'Arrays & Patterns', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'sliding-window-max', name: 'Sliding Window (Fixed & Variable)', category: 'arrays', categoryName: 'Arrays & Patterns', part: 'ds', difficulty: 'Medium', timeComplexity: 'O(n)', spaceComplexity: 'O(k)', isAvailable: true },
  { id: 'prefix-sum-range', name: 'Prefix Sum Array (Range Query)', category: 'arrays', categoryName: 'Arrays & Patterns', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(1) query', spaceComplexity: 'O(n)', isAvailable: true },

  // 2. Strings
  { id: 'kmp-pattern-matching', name: 'KMP Pattern Matching (LPS Table)', category: 'strings', categoryName: 'Strings & Pattern Matching', part: 'ds', difficulty: 'Hard', timeComplexity: 'O(n + m)', spaceComplexity: 'O(m)', isAvailable: true },
  { id: 'palindrome-check', name: 'Palindrome Check (Two Pointers)', category: 'strings', categoryName: 'Strings & Pattern Matching', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'rabin-karp-hash', name: 'Rabin-Karp (Rolling Hash)', category: 'strings', categoryName: 'Strings & Pattern Matching', part: 'ds', difficulty: 'Medium', timeComplexity: 'O(n + m)', spaceComplexity: 'O(1)', isAvailable: true },

  // 3. Linked Lists
  { id: 'linked-list-reversal', name: 'Singly Linked List Reversal', category: 'linked-list', categoryName: 'Linked Lists', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'floyd-cycle-detect', name: 'Floyd Cycle (Tortoise & Hare)', category: 'linked-list', categoryName: 'Linked Lists', part: 'ds', difficulty: 'Medium', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'doubly-linked-ops', name: 'Doubly Linked List (Next & Prev)', category: 'linked-list', categoryName: 'Linked Lists', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', isAvailable: true },

  // 4. Stack
  { id: 'stack-operations', name: 'Stack: Push, Pop & Undo/Redo', category: 'stack', categoryName: 'Stack (LIFO)', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(1)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'parentheses-validation', name: 'Parentheses / Syntax Validator', category: 'stack', categoryName: 'Stack (LIFO)', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', isAvailable: true },

  // 5. Queue
  { id: 'queue-operations', name: 'Circular Queue & Deque (FIFO)', category: 'queue', categoryName: 'Queue (FIFO) & Deque', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(1)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'priority-queue-ops', name: 'Priority Queue Buffer', category: 'queue', categoryName: 'Queue (FIFO) & Deque', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(log n)', spaceComplexity: 'O(n)', isAvailable: true },

  // 6. Trees
  { id: 'bst-insert-search', name: 'BST: Insert, Search & Delete', category: 'trees', categoryName: 'Trees & BST', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(log n)', spaceComplexity: 'O(h)', isAvailable: true },
  { id: 'tree-traversals-all', name: 'Traversals: In/Pre/Post/Level', category: 'trees', categoryName: 'Trees & BST', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'avl-tree-rotations', name: 'AVL Tree Self-Balancing (LL/RR)', category: 'trees', categoryName: 'Trees & BST', part: 'ds', difficulty: 'Advanced', timeComplexity: 'O(log n)', spaceComplexity: 'O(n)', isAvailable: true },

  // 7. Graphs
  { id: 'graph-bfs-dfs', name: 'Graph Traversal (BFS & DFS)', category: 'graphs', categoryName: 'Graphs & Dual View', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)', isAvailable: true },
  { id: 'dijkstra-shortest', name: 'Dijkstra Shortest Path', category: 'graphs', categoryName: 'Graphs & Dual View', part: 'ds', difficulty: 'Advanced', timeComplexity: 'O(E log V)', spaceComplexity: 'O(V)', isAvailable: true },
  { id: 'adj-list-matrix-dual', name: 'Adjacency List vs Matrix Dual-View', category: 'graphs', categoryName: 'Graphs & Dual View', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(1)', spaceComplexity: 'O(V²)', isAvailable: true },
  { id: 'kruskal-prim-mst', name: "Kruskal & Prim MST", category: 'graphs', categoryName: 'Graphs & Dual View', part: 'ds', difficulty: 'Advanced', timeComplexity: 'O(E log V)', spaceComplexity: 'O(V)', isAvailable: true },

  // 8. Hashing
  { id: 'hash-table-chaining', name: 'Hash Table (Separate Chaining)', category: 'hashing', categoryName: 'Hashing & Collisions', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(1) avg', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'hash-open-addressing', name: 'Open Addressing (Linear Probing)', category: 'hashing', categoryName: 'Hashing & Collisions', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(1) avg', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'hash-example-questions', name: 'Hashing Solved Problems (Two Sum, Set)', category: 'hashing', categoryName: 'Hashing & Collisions', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', isAvailable: true },

  // 9. Heap
  { id: 'heap-dual-view', name: 'Binary Heap (Tree + Array View)', category: 'heap', categoryName: 'Heap (Tree + Array View)', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(log n)', spaceComplexity: 'O(n)', isAvailable: true },

  // 10. Trie
  { id: 'trie-prefix-tree', name: 'Trie: Insert, Search & Autocomplete', category: 'trie', categoryName: 'Trie (Prefix Tree)', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(L)', spaceComplexity: 'O(ALPHABET × L)', isAvailable: true },

  // 11. Disjoint Set
  { id: 'disjoint-set-union', name: 'Union-Find (Path Compression & Rank)', category: 'disjoint-set', categoryName: 'Disjoint Set (Union-Find)', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(α(n))', spaceComplexity: 'O(n)', isAvailable: true },

  // 12. Matrix
  { id: 'matrix-flood-fill', name: '2D Grid Image Flood Fill', category: 'matrix', categoryName: 'Matrix & 2D Grid', part: 'ds', difficulty: 'Medium', timeComplexity: 'O(M × N)', spaceComplexity: 'O(M × N)', isAvailable: true },
  { id: 'matrix-spiral-order', name: 'Spiral Order Matrix Traversal', category: 'matrix', categoryName: 'Matrix & 2D Grid', part: 'ds', difficulty: 'Medium', timeComplexity: 'O(M × N)', spaceComplexity: 'O(1)', isAvailable: true },

  // PART 2: ALGORITHMS
  // 1. Recursion
  { id: 'tower-of-hanoi', name: 'Tower of Hanoi & Call Stack', category: 'recursion', categoryName: 'Recursion & Call Stack', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(2ⁿ)', spaceComplexity: 'O(n)', isAvailable: true },

  // 2. Searching
  { id: 'binary-search', name: 'Binary Search (Sorted Array)', category: 'searching', categoryName: 'Searching Algorithms', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'linear-search', name: 'Linear Search (Sequential Scan)', category: 'searching', categoryName: 'Searching Algorithms', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', isAvailable: true },

  // 3. Sorting
  { id: 'bubble-sort', name: 'Bubble Sort (Adaptive)', category: 'sorting', categoryName: 'Sorting Algorithms', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'insertion-sort', name: 'Insertion Sort (In-Place)', category: 'sorting', categoryName: 'Sorting Algorithms', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'selection-sort', name: 'Selection Sort', category: 'sorting', categoryName: 'Sorting Algorithms', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'merge-sort-tree', name: 'Merge Sort (Divide & Conquer)', category: 'sorting', categoryName: 'Sorting Algorithms', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'quick-sort-partition', name: 'Quick Sort (Pivot Partitioning)', category: 'sorting', categoryName: 'Sorting Algorithms', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)', isAvailable: true },

  // 4. Divide and Conquer
  { id: 'divide-conquer-merge', name: 'Merge Sort Split/Merge Tree', category: 'divide-and-conquer', categoryName: 'Divide and Conquer', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', isAvailable: true },

  // 5. Dynamic Programming
  { id: 'dp-fibonacci-dual', name: 'Fibonacci: Top-Down vs Bottom-Up', category: 'dp', categoryName: 'Dynamic Programming', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'knapsack-01-table', name: '0/1 Knapsack Animated Table', category: 'dp', categoryName: 'Dynamic Programming', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(N × W)', spaceComplexity: 'O(N × W)', isAvailable: true },
  { id: 'lcs-animated-fill', name: 'Longest Common Subsequence (LCS)', category: 'dp', categoryName: 'Dynamic Programming', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(M × N)', spaceComplexity: 'O(M × N)', isAvailable: true },
  { id: 'coin-change-dp', name: 'Coin Change (Fewest Coins)', category: 'dp', categoryName: 'Dynamic Programming', part: 'algo', difficulty: 'Medium', timeComplexity: 'O(A × C)', spaceComplexity: 'O(A)', isAvailable: true },
  { id: 'matrix-chain-mult', name: 'Matrix Chain Multiplication', category: 'dp', categoryName: 'Dynamic Programming', part: 'algo', difficulty: 'Advanced', timeComplexity: 'O(N³)', spaceComplexity: 'O(N²)', isAvailable: true },

  // 6. Greedy
  { id: 'huffman-coding-tree', name: 'Huffman Coding Tree Builder', category: 'greedy', categoryName: 'Greedy Algorithms', part: 'algo', difficulty: 'Advanced', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'activity-selection-opt', name: 'Activity Selection Problem', category: 'greedy', categoryName: 'Greedy Algorithms', part: 'algo', difficulty: 'Medium', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)', isAvailable: true },

  // 7. Backtracking
  { id: 'n-queens-solver', name: 'N-Queens (Choose, Explore, Undo)', category: 'backtracking', categoryName: 'Backtracking', part: 'algo', difficulty: 'Advanced', timeComplexity: 'O(N!)', spaceComplexity: 'O(N)', isAvailable: true },
  { id: 'sudoku-backtrack', name: 'Sudoku Solver (Constraint Pruning)', category: 'backtracking', categoryName: 'Backtracking', part: 'algo', difficulty: 'Advanced', timeComplexity: 'O(9^(N×N))', spaceComplexity: 'O(N²)', isAvailable: true },

  // 8. Bit Manipulation
  { id: 'bit-manipulation', name: 'Bit Manipulation: AND, OR, XOR & Shifts', category: 'bit-manipulation', categoryName: 'Bit Manipulation', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(1)', spaceComplexity: 'O(1)', isAvailable: true },

  // 9. Additional Master List Topics
  { id: 'jump-search', name: 'Jump Search (Block Jumping)', category: 'searching', categoryName: 'Searching Algorithms', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(√n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'interpolation-search', name: 'Interpolation Search (Proportional Probe)', category: 'searching', categoryName: 'Searching Algorithms', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(log log n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'counting-sort', name: 'Counting Sort (Non-Comparison)', category: 'sorting', categoryName: 'Sorting Algorithms', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(n + k)', spaceComplexity: 'O(k)', isAvailable: true },
  { id: 'heap-sort-algo', name: 'Heap Sort (In-Place Sift-Down)', category: 'sorting', categoryName: 'Sorting Algorithms', part: 'algo', difficulty: 'Intermediate', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'recursion-factorial', name: 'Recursion: Factorial Call Stack', category: 'recursion', categoryName: 'Recursion & Call Stack', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'recursion-fibonacci-tree', name: 'Recursion: Fibonacci Call Tree', category: 'recursion', categoryName: 'Recursion & Call Stack', part: 'algo', difficulty: 'Beginner', timeComplexity: 'O(2ⁿ)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'array-crud-operations', name: 'Array CRUD: Insert, Shift & Delete', category: 'arrays', categoryName: 'Arrays & Patterns', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', isAvailable: true },
  { id: 'string-comparison-concat', name: 'String Comparison & Concatenation', category: 'strings', categoryName: 'Strings & Pattern Matching', part: 'ds', difficulty: 'Beginner', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', isAvailable: true },
  { id: 'binary-tree-lca-height', name: 'Binary Tree: Height, Depth & LCA', category: 'trees', categoryName: 'Trees & BST', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', isAvailable: true },
  { id: 'circular-doubly-linked-list', name: 'Circular Doubly Linked List', category: 'linked-list', categoryName: 'Linked Lists', part: 'ds', difficulty: 'Intermediate', timeComplexity: 'O(1)', spaceComplexity: 'O(n)', isAvailable: true },
];

export const plannedCatalog = fullCatalog;
export type PlannedAlgorithm = PlannedTopicItem;

export function getAlgorithmById(id: string): AlgorithmDefinition | undefined {
  return algorithmRegistry.find((algo) => algo.id === id);
}

export function getCategoriesByPart(part: DSASectionPart): CategoryInfo[] {
  return categories.filter((c) => c.part === part);
}

export function searchAlgorithms(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return fullCatalog;
  return fullCatalog.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.categoryName.toLowerCase().includes(q) ||
      a.difficulty.toLowerCase().includes(q)
  );
}
