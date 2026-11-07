import { ProblemPlan } from '../types/problemSolver';

export const twoSumProblemPlan: ProblemPlan = {
  canVisualize: true,
  pattern: 'Hash Map / Two Pointers',
  difficulty: 'Easy',
  approachSummary:
    'Iterate through the array while maintaining a hash map of seen numbers to their indices. For each element `nums[i]`, compute `complement = target - nums[i]`. If the complement exists in the map, return the pair of indices.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  code: {
    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
    java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
  },
  pseudocode: [
    'function twoSum(nums, target):',
    '    seen = empty hash map',
    '    for i = 0 to nums.length - 1:',
    '        complement = target - nums[i]',
    '        if complement in seen: return [seen[complement], i]',
    '        seen[nums[i]] = i',
    '    return []',
  ],
  hints: [
    'Can you compute target - nums[i] for the current number?',
    'Think about what data structure lets you look up the complement in O(1) time.',
    'A Hash Map can store (value -> index) as you scan the array in a single pass.',
  ],
  boardType: 'array',
  initialData: {
    array: [2, 7, 11, 15],
    target: 9,
  },
  steps: [
    {
      type: 'start',
      indices: [],
      dataState: { array: [2, 7, 11, 15], target: 9, seen: {} },
      codeLine: 2,
      message: 'Initialized empty hash map `seen = {}`. Target is 9.',
    },
    {
      type: 'pointer',
      indices: [0],
      pointers: { i: 0 },
      dataState: { array: [2, 7, 11, 15], target: 9, currentVal: 2, complement: 7, seen: {} },
      codeLine: 4,
      message: 'i = 0: nums[0] = 2. Complement needed = target - 2 = 7.',
    },
    {
      type: 'compare',
      indices: [0],
      pointers: { i: 0 },
      dataState: { array: [2, 7, 11, 15], target: 9, currentVal: 2, complement: 7, seen: {} },
      codeLine: 5,
      message: 'Checking if complement 7 exists in hash map `seen`... Not found.',
    },
    {
      type: 'set',
      indices: [0],
      pointers: { i: 0 },
      dataState: { array: [2, 7, 11, 15], target: 9, seen: { 2: 0 } },
      codeLine: 6,
      message: 'Inserted { 2: index 0 } into `seen` map.',
    },
    {
      type: 'pointer',
      indices: [1],
      pointers: { i: 1 },
      dataState: { array: [2, 7, 11, 15], target: 9, currentVal: 7, complement: 2, seen: { 2: 0 } },
      codeLine: 4,
      message: 'i = 1: nums[1] = 7. Complement needed = target - 7 = 2.',
    },
    {
      type: 'compare',
      indices: [1],
      pointers: { i: 1 },
      dataState: { array: [2, 7, 11, 15], target: 9, currentVal: 7, complement: 2, seen: { 2: 0 } },
      codeLine: 5,
      message: 'Checking if complement 2 exists in hash map... Found at index 0!',
    },
    {
      type: 'found',
      indices: [0, 1],
      pointers: { first: 0, second: 1 },
      dataState: { array: [2, 7, 11, 15], target: 9, result: [0, 1], seen: { 2: 0 } },
      codeLine: 5,
      message: 'Solution found! Pair of indices [0, 1] sum up to target: 2 + 7 = 9.',
    },
  ],
};

export const numberOfIslandsProblemPlan: ProblemPlan = {
  canVisualize: true,
  pattern: 'Breadth-First Search (BFS) / DFS Flood Fill on 2D Grid',
  difficulty: 'Medium',
  approachSummary:
    'Treat the 2D grid as an unweighted graph where land cells ("1") are vertices and adjacent horizontal/vertical land cells are edges. Scan every cell; when an unvisited land cell is found, increment the island counter and launch a BFS or DFS traversal to sink (mark visited) all connected land cells.',
  timeComplexity: 'O(M × N)',
  spaceComplexity: 'O(M × N)',
  code: {
    python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0' # mark visited/sink
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            dfs(r + dr, c + dc)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands`,
    cpp: `int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int rows = grid.size(), cols = grid[0].size();
    int islands = 0;

    auto dfs = [&](auto& self, int r, int c) -> void {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;
        grid[r][c] = '0';
        self(self, r + 1, c); self(self, r - 1, c);
        self(self, r, c + 1); self(self, r, c - 1);
    };

    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < cols; ++c) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(dfs, r, c);
            }
        }
    }
    return islands;
}`,
    java: `public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int rows = grid.length, cols = grid[0].length;
    int islands = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(grid, r, c);
            }
        }
    }
    return islands;
}

private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}`,
  },
  pseudocode: [
    'function numIslands(grid):',
    '    islands = 0',
    '    for r = 0 to rows - 1:',
    '        for c = 0 to cols - 1:',
    '            if grid[r][c] == "1":',
    '                islands = islands + 1',
    '                dfsSink(grid, r, c)',
    '    return islands',
  ],
  hints: [
    'How can you model the grid cells as a graph problem?',
    'Once you encounter a "1", you need to visit all reachable adjacent "1"s (up, down, left, right).',
    'To avoid counting the same island twice, sink or mark each land cell visited as you explore it.',
  ],
  boardType: 'grid-2d',
  initialData: {
    grid: [
      ['1', '1', '0', '0'],
      ['1', '1', '0', '0'],
      ['0', '0', '1', '0'],
      ['0', '0', '0', '1'],
    ],
  },
  steps: [
    {
      type: 'start',
      gridCell: [0, 0],
      visitedCells: [],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 0,
        currentCell: [0, 0],
      },
      codeLine: 2,
      message: 'Starting scan of 4x4 matrix. islands = 0.',
    },
    {
      type: 'visit',
      gridCell: [0, 0],
      visitedCells: [[0, 0]],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 1,
        currentCell: [0, 0],
      },
      codeLine: 6,
      message: 'Encountered land cell at (0, 0)! Found Island #1. Starting DFS flood fill to sink connected land.',
    },
    {
      type: 'visit',
      gridCell: [0, 1],
      visitedCells: [[0, 0], [0, 1]],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 1,
        currentCell: [0, 1],
      },
      codeLine: 7,
      message: 'DFS visits adjacent right cell (0, 1). Marking visited.',
    },
    {
      type: 'visit',
      gridCell: [1, 1],
      visitedCells: [[0, 0], [0, 1], [1, 1]],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 1,
        currentCell: [1, 1],
      },
      codeLine: 7,
      message: 'DFS visits adjacent down cell (1, 1). Marking visited.',
    },
    {
      type: 'visit',
      gridCell: [1, 0],
      visitedCells: [[0, 0], [0, 1], [1, 1], [1, 0]],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 1,
        currentCell: [1, 0],
      },
      codeLine: 7,
      message: 'DFS visits adjacent left cell (1, 0). All cells of Island #1 are now explored.',
    },
    {
      type: 'visit',
      gridCell: [2, 2],
      visitedCells: [[0, 0], [0, 1], [1, 1], [1, 0], [2, 2]],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 2,
        currentCell: [2, 2],
      },
      codeLine: 6,
      message: 'Scan continues... Found isolated land cell at (2, 2)! Found Island #2.',
    },
    {
      type: 'visit',
      gridCell: [3, 3],
      visitedCells: [[0, 0], [0, 1], [1, 1], [1, 0], [2, 2], [3, 3]],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 3,
        currentCell: [3, 3],
      },
      codeLine: 6,
      message: 'Scan reaches cell (3, 3)! Found Island #3.',
    },
    {
      type: 'complete',
      gridCell: [3, 3],
      visitedCells: [[0, 0], [0, 1], [1, 1], [1, 0], [2, 2], [3, 3]],
      dataState: {
        grid: [
          ['1', '1', '0', '0'],
          ['1', '1', '0', '0'],
          ['0', '0', '1', '0'],
          ['0', '0', '0', '1'],
        ],
        islandsCount: 3,
        currentCell: null,
      },
      codeLine: 8,
      message: 'Grid scan complete! Total number of connected islands = 3.',
    },
  ],
};
