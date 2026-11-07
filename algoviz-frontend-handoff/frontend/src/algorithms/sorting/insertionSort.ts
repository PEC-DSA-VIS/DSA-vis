import { AlgorithmDefinition, StepAction } from '../../types';

export interface InsertionSortInput {
  array: number[];
}

export interface InsertionSortData {
  array: number[];
  currentIndex: number;
  comparingIndex: number | null;
  keyVal: number | null;
  sortedIndices: number[];
}

export const insertionSort: AlgorithmDefinition<InsertionSortInput, InsertionSortData> = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  categoryName: 'Sorting Algorithms',
  part: 'algo',
  difficulty: 'Beginner',
  description:
    'A simple sorting algorithm that builds the final sorted array one item at a time. It iterates through an input array and removes one element per iteration, finding the place the element belongs in the sorted list.',
  realLifeExample: 'Arranging playing cards in your hand in ascending order as you receive each new card.',
  complexity: {
    time: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: {
      worst: 'O(1)',
    },
  },
  pseudocode: [
    'function insertionSort(arr):',
    '    for i = 1 to arr.length - 1:',
    '        key = arr[i]',
    '        j = i - 1',
    '        while j >= 0 and arr[j] > key:',
    '            arr[j + 1] = arr[j]',
    '            j = j - 1',
    '        arr[j + 1] = key',
    '    return arr',
  ],
  explanation:
    'Insertion Sort works similarly to sorting playing cards in your hand. The array is virtually split into a sorted and an unsorted part. Values from the unsorted part are picked and placed into the correct position in the sorted part by shifting larger elements one position to the right.',
  tags: ['Comparison Sort', 'Adaptive', 'Stable', 'In-Place'],
  boardType: 'array-sort',

  defaultInput: {
    array: [52, 28, 87, 14, 63, 41, 75],
  },

  presets: [
    {
      label: 'Random Mix (7 items)',
      value: { array: [52, 28, 87, 14, 63, 41, 75] },
      description: 'Typical mixed array.',
    },
    {
      label: 'Nearly Sorted',
      value: { array: [10, 20, 30, 25, 40, 50, 45] },
      description: 'Very fast O(n) performance on nearly sorted inputs.',
    },
    {
      label: 'Reversed Array (Worst Case)',
      value: { array: [70, 60, 50, 40, 30, 20, 10] },
      description: 'Each element has to shift all previous sorted items.',
    },
  ],

  generateRandomInput: () => {
    const size = Math.floor(Math.random() * 4) + 6;
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * 85) + 12);
    }
    return { array };
  },

  validateInput: (input) => {
    if (!input || !Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Array must have at least 1 element' };
    }
    return { valid: true };
  },

  *run(input): Generator<StepAction<InsertionSortData>, void, unknown> {
    const arr = [...input.array];
    const n = arr.length;
    const sortedIndices: number[] = [0];

    yield {
      type: 'start',
      indices: [0],
      dataState: { array: [...arr], currentIndex: 0, comparingIndex: null, keyVal: arr[0], sortedIndices: [0] },
      codeLine: 1,
      message: `Initial state: Index 0 (${arr[0]}) forms initial sorted prefix.`,
      reason: {
        action: 'Init Insertion Sort',
        why: `Index 0 (${arr[0]}) forms a trivially sorted prefix of length 1.`,
        rule: 'Sorted prefix: [0..0]',
        values: { initialKey: arr[0] },
        details: 'A single element is always sorted relative to itself.',
      },
    };

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      yield {
        type: 'highlight',
        indices: [i],
        dataState: { array: [...arr], currentIndex: i, comparingIndex: null, keyVal: key, sortedIndices: [...sortedIndices] },
        codeLine: 3,
        message: `Selected key = ${key} at index ${i} to insert into sorted prefix [0..${i - 1}].`,
        reason: {
          action: `Pick key = ${key}`,
          why: `Selected key=${key} at index ${i} to shift into sorted subarray [0..${i - 1}].`,
          rule: `key = arr[i]`,
          values: { i, key },
          details: 'We will compare key backwards with each element in the sorted prefix.',
        },
      };

      while (j >= 0) {
        yield {
          type: 'compare',
          indices: [j, j + 1],
          dataState: { array: [...arr], currentIndex: i, comparingIndex: j, keyVal: key, sortedIndices: [...sortedIndices] },
          codeLine: 5,
          message: `Comparing key (${key}) with sorted element arr[${j}] (${arr[j]}).`,
          reason: {
            action: `Compare: arr[${j}] vs key`,
            why: `Checking if arr[${j}]=${arr[j]} is greater than key ${key}.`,
            rule: `arr[j] > key ?`,
            values: { j, arrJ: arr[j], key },
            details: 'If arr[j] is larger, it must shift right to make room for key.',
          },
        };

        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          yield {
            type: 'swap',
            indices: [j, j + 1],
            dataState: { array: [...arr], currentIndex: i, comparingIndex: j, keyVal: key, sortedIndices: [...sortedIndices] },
            codeLine: 6,
            message: `arr[${j}] (${arr[j]}) > key (${key}). Shifted arr[${j}] right to index ${j + 1}.`,
            reason: {
              action: `Shift arr[${j}] right`,
              why: `arr[${j}]=${arr[j]} > ${key}. Shifted element right to index ${j + 1}.`,
              rule: `arr[j] > key => arr[j+1] = arr[j]`,
              values: { j, shifted: arr[j], key },
              details: 'Vacating a slot on the left for smaller key placement.',
            },
          };
          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      if (!sortedIndices.includes(i)) sortedIndices.push(i);
      sortedIndices.sort((a, b) => a - b);

      yield {
        type: 'sorted',
        indices: [j + 1],
        dataState: { array: [...arr], currentIndex: i, comparingIndex: null, keyVal: null, sortedIndices: [...sortedIndices] },
        codeLine: 8,
        message: `Inserted key ${key} at correct position index ${j + 1}. Sorted prefix is now [0..${i}].`,
        reason: {
          action: `Insert key at ${j + 1}`,
          why: `Placed key ${key} into its sorted position at index ${j + 1}.`,
          rule: `arr[j + 1] = key`,
          values: { insertIndex: j + 1, key },
          details: 'Sorted prefix expanded by one element.',
        },
      };
    }

    yield {
      type: 'complete',
      indices: [...sortedIndices],
      dataState: { array: [...arr], currentIndex: -1, comparingIndex: null, keyVal: null, sortedIndices: [...sortedIndices] },
      codeLine: 9,
      message: 'Insertion Sort complete! Entire array is sorted.',
      reason: {
        action: 'Sort complete',
        why: 'All elements successfully inserted into sorted arrangement.',
        rule: 'Array sorted',
        values: {},
        details: 'Insertion sort finished in O(n²) worst-case / O(n) best-case.',
      },
    };
  },
};
