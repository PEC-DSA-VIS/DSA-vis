export type DSASectionPart = 'ds' | 'algo';

export type AlgorithmCategory =
  // PART 1: DATA STRUCTURES
  | 'arrays'
  | 'strings'
  | 'linked-list'
  | 'stack'
  | 'queue'
  | 'trees'
  | 'graphs'
  | 'hashing'
  | 'heap'
  | 'trie'
  | 'disjoint-set'
  | 'matrix'
  // PART 2: ALGORITHMS
  | 'recursion'
  | 'searching'
  | 'sorting'
  | 'divide-and-conquer'
  | 'dp'
  | 'greedy'
  | 'backtracking'
  | 'bit-manipulation';

export type StepType =
  | 'start'
  | 'compare'
  | 'swap'
  | 'sorted'
  | 'found'
  | 'not-found'
  | 'discard'
  | 'pointer'
  | 'visit'
  | 'set'
  | 'step'
  | 'mismatch'
  | 'highlight'
  | 'push'
  | 'pop'
  | 'enqueue'
  | 'dequeue'
  | 'insert'
  | 'delete'
  | 'rotate'
  | 'call'
  | 'return'
  | 'backtrack'
  | 'bit-toggle'
  | 'complete';

export interface StepReason {
  action: string; // e.g. "low: 2 -> 4" or "swap: arr[2] <-> arr[3]"
  why: string; // Plain sentence with REAL numbers from current state
  rule: string; // Condition that fired, e.g. "arr[mid] < target"
  values?: Record<string, any>; // Snapshot of actual evaluated values
  details?: string; // Optional deeper intuition for "More why" expander
}

export interface StepAction<TData = any> {
  type: StepType;
  indices?: number[]; // Active indices being inspected, compared or swapped
  pointers?: Record<string, number | string | null>; // e.g., { low: 0, mid: 4, high: 9 } or { head: 0, slow: 2, fast: 4 }
  discardedIndices?: number[]; // e.g. for binary search discarded sections
  gridCell?: [number, number] | null; // [row, col] for 2D grid/matrix algorithms
  visitedCells?: [number, number][]; // [[row, col], ...]
  // For Bit Manipulation
  bitIndex?: number | null;
  bitOperation?: string;
  // For Stack / Queue / Recursion Call Stack
  callStack?: { name: string; args: string; returnValue?: string | number }[];
  // Snapshot data of the visual primitive
  dataState: TData;
  codeLine: number; // 1-based index corresponding to pseudocode
  message: string; // Explanatory step-by-step description
  reason: StepReason; // Mandatory "Why?" explanation on every step
  comparisonsCount?: number;
  swapsCount?: number;
  customMetadata?: Record<string, any>;
}

export interface AlgorithmComplexity {
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: {
    worst: string;
  };
}

export interface AlgorithmPreset<TInput = any> {
  label: string;
  value: TInput;
  description?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type BoardType =
  | 'array-search'
  | 'array-sort'
  | 'array-pattern'
  | 'string-ops'
  | 'linked-list'
  | 'stack-board'
  | 'queue-board'
  | 'tree-board'
  | 'graph-board'
  | 'heap-dual'
  | 'hash-table'
  | 'trie-board'
  | 'disjoint-set'
  | 'grid-matrix'
  | 'recursion-tree'
  | 'divide-conquer-tree'
  | 'merge-sort-tree'
  | 'dp-table'
  | 'bit-cells'
  | 'backtracking-board'
  | 'activity-timeline';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Easy' | 'Medium' | 'Hard';

export interface AlgorithmDefinition<TInput = any, TData = any> {
  id: string;
  name: string;
  category: AlgorithmCategory;
  categoryName: string;
  part: DSASectionPart;
  difficulty: DifficultyLevel;
  description: string;
  realLifeExample: string; // e.g., "Undo/Redo = Stack", "Playlist = Linked List"
  complexity: AlgorithmComplexity;
  pseudocode: string[];
  explanation: string;
  learnMoreUrl?: string;
  tags: string[];
  boardType: BoardType;
  defaultInput: TInput;
  presets?: AlgorithmPreset<TInput>[];
  generateRandomInput: () => TInput;
  validateInput?: (input: TInput) => { valid: boolean; error?: string };
  // Generator function that yields steps
  run: (input: TInput) => Generator<StepAction<TData>, void, unknown>;
  quiz?: QuizQuestion[];
}

export interface CategoryInfo {
  id: AlgorithmCategory;
  title: string;
  part: DSASectionPart;
  description: string;
  realLifeAnalogy: string;
  iconName: string;
  color: string;
  subtopics: string[];
  status?: 'ready' | 'coming-soon';
}
