import { AlgorithmDefinition, StepAction } from '../../types';

export interface LinearSearchInput {
  array: number[];
  target: number;
}

export interface LinearSearchData {
  array: number[];
  target: number;
  currentIndex: number;
  foundIndex: number | null;
  visitedIndices: number[];
}

export const linearSearch: AlgorithmDefinition<LinearSearchInput, LinearSearchData> = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'searching',
  categoryName: 'Searching Algorithms',
  part: 'algo',
  difficulty: 'Beginner',
  description:
    'A sequential search algorithm that checks every element in the list from left to right until a match is found or the end of the list is reached.',
  realLifeExample: 'Searching for your car keys by checking every jacket pocket and table one by one.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)',
    },
    space: {
      worst: 'O(1)',
    },
  },
  pseudocode: [
    'function linearSearch(arr, target):',
    '    for i = 0 to arr.length - 1:',
    '        if arr[i] == target:',
    '            return i // Found target at index i',
    '    return -1 // Target not found',
  ],
  explanation:
    'Linear Search works by inspecting each element of the array one after another from index 0 to n - 1. It does not require the array to be sorted. If the element matches the target, it stops and returns the index. If all elements have been scanned without a match, it concludes the target is not present.',
  tags: ['Sequential', 'Unsorted Array', 'Linear Time'],
  boardType: 'array-search',

  defaultInput: {
    array: [19, 42, 8, 35, 91, 56, 27, 64],
    target: 64,
  },

  presets: [
    {
      label: 'Scan Full Array (Target: 64)',
      value: { array: [19, 42, 8, 35, 91, 56, 27, 64], target: 64 },
      description: 'Scans every element sequentially from index 0 to 7.',
    },
    {
      label: 'Target at Start (19)',
      value: { array: [19, 42, 8, 35, 91, 56, 27, 64], target: 19 },
      description: 'Best case scenario: found in 1 comparison O(1).',
    },
    {
      label: 'Target in Middle (35)',
      value: { array: [19, 42, 8, 35, 91, 56, 27, 64], target: 35 },
      description: 'Found at index 3 in average time.',
    },
    {
      label: 'Target at End (64)',
      value: { array: [19, 42, 8, 35, 91, 56, 27, 64], target: 64 },
      description: 'Worst-case found scenario: scans all n elements.',
    },
    {
      label: 'Target Missing (99)',
      value: { array: [19, 42, 8, 35, 91, 56, 27, 64], target: 99 },
      description: 'Worst-case missing: exhausts whole array.',
    },
  ],

  generateRandomInput: () => {
    const size = Math.floor(Math.random() * 4) + 6;
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * 90) + 10);
    }
    const target = Math.random() < 0.75 ? array[Math.floor(Math.random() * array.length)] : 77;
    return { array, target };
  },

  validateInput: (input) => {
    if (!input || !Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Array must have at least 1 element' };
    }
    if (typeof input.target !== 'number' || isNaN(input.target)) {
      return { valid: false, error: 'Target must be a number' };
    }
    return { valid: true };
  },

  *run(input): Generator<StepAction<LinearSearchData>, void, unknown> {
    const arr = [...input.array];
    const target = input.target;
    const visited: number[] = [];

    yield {
      type: 'start',
      indices: [],
      dataState: { array: arr, target, currentIndex: -1, foundIndex: null, visitedIndices: [] },
      codeLine: 1,
      message: `Starting Linear Search for target ${target} across ${arr.length} elements.`,
      reason: {
        action: 'Init Linear Scan',
        why: `Begin scanning array sequentially from left index 0 for target ${target}.`,
        rule: 'for i = 0 to n - 1',
        values: { target, length: arr.length },
        details: 'Sequential scan inspects each item one by one in O(n) linear time.',
      },
    };

    for (let i = 0; i < arr.length; i++) {
      visited.push(i);

      yield {
        type: 'compare',
        indices: [i],
        pointers: { current: i },
        dataState: { array: arr, target, currentIndex: i, foundIndex: null, visitedIndices: [...visited] },
        codeLine: 3,
        message: `Inspecting index ${i}: arr[${i}] = ${arr[i]}. Comparing with target ${target}.`,
        reason: {
          action: `Inspect index ${i}`,
          why: `Comparing arr[${i}]=${arr[i]} with target ${target}.`,
          rule: `arr[i] == target ?`,
          values: { i, val: arr[i], target },
          details: 'Check if current element matches the search target.',
        },
      };

      if (arr[i] === target) {
        yield {
          type: 'found',
          indices: [i],
          pointers: { current: i },
          dataState: { array: arr, target, currentIndex: i, foundIndex: i, visitedIndices: [...visited] },
          codeLine: 4,
          message: `Match found! arr[${i}] equals ${target}. Search succeeds at index ${i}.`,
          reason: {
            action: `Found at index ${i}!`,
            why: `arr[${i}]=${arr[i]} matches target ${target} exactly. Linear search succeeds!`,
            rule: `arr[i] === target`,
            values: { i, target },
            details: 'Target located successfully.',
          },
        };

        yield {
          type: 'complete',
          indices: [i],
          pointers: { current: i },
          dataState: { array: arr, target, currentIndex: i, foundIndex: i, visitedIndices: [...visited] },
          codeLine: 4,
          message: `Linear search successfully verified target ${target} at index ${i}. Total inspections: ${visited.length}.`,
          reason: {
            action: 'Linear Search Complete',
            why: `Inspected ${visited.length} elements sequentially to find ${target}.`,
            rule: 'return index',
            values: { foundAt: i, comparisons: visited.length },
            details: 'Complete.',
          },
        };
        return;
      }
    }

    yield {
      type: 'not-found',
      indices: [],
      dataState: { array: arr, target, currentIndex: arr.length, foundIndex: null, visitedIndices: [...visited] },
      codeLine: 5,
      message: `Reached end of array. Target ${target} was not found.`,
      reason: {
        action: 'Not found',
        why: `Scanned all ${arr.length} items without finding target ${target}.`,
        rule: `i >= n`,
        values: { target },
        details: 'Linear search exhausted all candidates.',
      },
    };
  },
};
