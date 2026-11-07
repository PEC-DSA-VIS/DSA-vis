import { AlgorithmDefinition, StepAction } from '../../types';

export interface BinarySearchInput {
  array: number[];
  target: number;
}

export interface BinarySearchData {
  array: number[];
  target: number;
  low: number;
  mid: number | null;
  high: number;
  discarded: number[];
  foundIndex: number | null;
}

export const binarySearch: AlgorithmDefinition<BinarySearchInput, BinarySearchData> = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  categoryName: 'Searching Algorithms',
  part: 'algo',
  difficulty: 'Beginner',
  description:
    'A divide-and-conquer algorithm that efficiently finds the position of a target value within a sorted array by repeatedly halving the search interval.',
  realLifeExample: 'Searching for a name in a physical alphabetical phonebook or dictionary by opening right in the middle.',
  complexity: {
    time: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
    },
    space: {
      worst: 'O(1)',
    },
  },
  pseudocode: [
    'function binarySearch(arr, target):',
    '    low = 0, high = arr.length - 1',
    '    while low <= high:',
    '        mid = floor((low + high) / 2)',
    '        if arr[mid] == target: return mid',
    '        else if arr[mid] < target: low = mid + 1',
    '        else: high = mid - 1',
    '    return -1 // Target not found',
  ],
  explanation:
    'Binary Search works on sorted arrays. It compares the target value to the middle element of the array. If they are equal, the target is found. If the target is less than the middle element, search continues in the lower half by adjusting high. Otherwise, search continues in the upper half by adjusting low. The search space halves at every step, yielding logarithmic time complexity O(log n).',
  tags: ['Divide and Conquer', 'Logarithmic Time', 'Sorted Array', 'Two Pointers'],
  boardType: 'array-search',

  defaultInput: {
    array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91],
    target: 72,
  },

  presets: [
    {
      label: 'Deep Search (72 - 13 Steps)',
      value: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 72 },
      description: 'Multi-step binary search halving intervals 3 times before match.',
    },
    {
      label: 'Target in Middle (23)',
      value: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 23 },
      description: 'Element sits right in the middle region.',
    },
    {
      label: 'Target at Start (2)',
      value: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 2 },
      description: 'Target is the first element, requiring repeated left shifts.',
    },
    {
      label: 'Target at End (91)',
      value: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 91 },
      description: 'Target is the last element, requiring repeated right shifts.',
    },
    {
      label: 'Element Not Present (30)',
      value: { array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91], target: 30 },
      description: 'Search exhausts the entire range until low > high.',
    },
    {
      label: 'Small Array (5 items)',
      value: { array: [10, 20, 30, 40, 50], target: 40 },
      description: 'Quick 5-element trace.',
    },
  ],

  generateRandomInput: () => {
    const size = Math.floor(Math.random() * 6) + 7; // 7 to 12 elements
    const set = new Set<number>();
    while (set.size < size) {
      set.add(Math.floor(Math.random() * 95) + 3);
    }
    const array = Array.from(set).sort((a, b) => a - b);
    // 75% chance target is in array, 25% random not in array
    const inArray = Math.random() < 0.75;
    const target = inArray
      ? array[Math.floor(Math.random() * array.length)]
      : Math.floor(Math.random() * 95) + 3;

    return { array, target };
  },

  validateInput: (input) => {
    if (!input || !Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Array must have at least 1 element' };
    }
    if (input.array.length > 20) {
      return { valid: false, error: 'Array length cannot exceed 20 for clear visualization' };
    }
    if (typeof input.target !== 'number' || isNaN(input.target)) {
      return { valid: false, error: 'Target must be a valid number' };
    }
    // Check if sorted
    for (let i = 1; i < input.array.length; i++) {
      if (input.array[i] < input.array[i - 1]) {
        return { valid: false, error: 'Binary Search requires a sorted array!' };
      }
    }
    return { valid: true };
  },

  *run(input): Generator<StepAction<BinarySearchData>, void, unknown> {
    const arr = [...input.array];
    const target = input.target;
    let low = 0;
    let high = arr.length - 1;
    const discarded: number[] = [];

    // Step 0: Initial state
    yield {
      type: 'start',
      indices: [],
      pointers: { low, mid: null, high },
      discardedIndices: [],
      dataState: { array: arr, target, low, mid: null, high, discarded: [], foundIndex: null },
      codeLine: 2,
      message: `Initialized search range: low = 0 (val: ${arr[low]}), high = ${high} (val: ${arr[high]}). Target = ${target}.`,
      reason: {
        action: `Init: [${low}..${high}]`,
        why: `Setting search boundaries low=0 and high=${high} for sorted array of ${arr.length} elements.`,
        rule: `low <= high`,
        values: { low, high, target },
        details: 'Binary search requires a sorted array. Search boundaries initially encompass all array elements.',
      },
    };

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      // Step: Calculate mid pointer
      yield {
        type: 'pointer',
        indices: [mid],
        pointers: { low, mid, high },
        discardedIndices: [...discarded],
        dataState: { array: arr, target, low, mid, high, discarded: [...discarded], foundIndex: null },
        codeLine: 4,
        message: `Calculated mid index = floor((${low} + ${high}) / 2) = ${mid}. arr[${mid}] = ${arr[mid]}.`,
        reason: {
          action: `mid = ${mid}`,
          why: `Calculated midpoint index ${mid} between low=${low} and high=${high}. Middle value is ${arr[mid]}.`,
          rule: `mid = floor((low + high) / 2)`,
          values: { low, high, mid, value: arr[mid] },
          details: 'Splits search region into two equal halves to eliminate half the elements in O(1) comparison.',
        },
      };

      // Step: Compare arr[mid] with target
      yield {
        type: 'compare',
        indices: [mid],
        pointers: { low, mid, high },
        discardedIndices: [...discarded],
        dataState: { array: arr, target, low, mid, high, discarded: [...discarded], foundIndex: null },
        codeLine: 5,
        message: `Comparing middle element arr[${mid}] (${arr[mid]}) with target (${target}).`,
        reason: {
          action: `Compare: arr[${mid}] (${arr[mid]}) vs ${target}`,
          why: `Evaluating middle element ${arr[mid]} against search target ${target}.`,
          rule: `arr[mid] == target ?`,
          values: { mid, arrMid: arr[mid], target },
          details: 'If middle matches target we stop. Otherwise we determine whether target lies to left or right.',
        },
      };

      if (arr[mid] === target) {
        // Step: Found!
        yield {
          type: 'found',
          indices: [mid],
          pointers: { low, mid, high },
          discardedIndices: [...discarded],
          dataState: { array: arr, target, low, mid, high, discarded: [...discarded], foundIndex: mid },
          codeLine: 5,
          message: `Target ${target} found at index ${mid}! Search complete.`,
          reason: {
            action: `Found at index ${mid}!`,
            why: `arr[mid]=${arr[mid]} matches target ${target} exactly. Supernova complete!`,
            rule: `arr[mid] === target`,
            values: { mid, target },
            details: 'Target successfully discovered in O(log n) logarithmic steps.',
          },
        };

        yield {
          type: 'complete',
          indices: [mid],
          pointers: { low, mid, high },
          discardedIndices: [...discarded],
          dataState: { array: arr, target, low, mid, high, discarded: [...discarded], foundIndex: mid },
          codeLine: 5,
          message: `Binary Search completed successfully in O(log n) time. Element ${target} verified at index ${mid}.`,
          reason: {
            action: 'Binary Search Complete',
            why: `Search range halved repeatedly until match verified.`,
            rule: 'return mid',
            values: { target, foundIndex: mid },
            details: 'Search finished.',
          },
        };
        return;
      } else if (arr[mid] < target) {
        // Discard left half [low .. mid]
        for (let i = low; i <= mid; i++) {
          if (!discarded.includes(i)) discarded.push(i);
        }

        yield {
          type: 'discard',
          indices: [mid],
          pointers: { low, mid, high },
          discardedIndices: [...discarded],
          dataState: { array: arr, target, low, mid, high, discarded: [...discarded], foundIndex: null },
          codeLine: 6,
          message: `Since arr[mid]=${arr[mid]} < ${target}, target must lie in the right half. Discarding indices [${low}..${mid}].`,
          reason: {
            action: `Discard [${low}..${mid}]`,
            why: `arr[mid]=${arr[mid]} is smaller than target ${target}, so everything at or left of mid is too small.`,
            rule: `arr[mid] < target => eliminate left half`,
            values: { mid, val: arr[mid], target },
            details: 'Because array is sorted in ascending order, all elements at index <= mid are strictly smaller than target.',
          },
        };

        const oldLow = low;
        low = mid + 1;
        yield {
          type: 'pointer',
          indices: low <= high ? [low] : [],
          pointers: { low, mid: null, high },
          discardedIndices: [...discarded],
          dataState: { array: arr, target, low, mid: null, high, discarded: [...discarded], foundIndex: null },
          codeLine: 6,
          message: `Moved low pointer to index ${low} (${low <= high ? `arr[${low}] = ${arr[low]}` : 'out of bounds'}).`,
          reason: {
            action: `low: ${oldLow} -> ${low}`,
            why: `low moved ${oldLow} -> ${low} because arr[${mid}]=${arr[mid]} < ${target}.`,
            rule: `low = mid + 1`,
            values: { oldLow, newLow: low, mid },
            details: 'Search space now restricted to the remaining right half.',
          },
        };
      } else {
        // arr[mid] > target: Discard right half [mid .. high]
        for (let i = mid; i <= high; i++) {
          if (!discarded.includes(i)) discarded.push(i);
        }

        yield {
          type: 'discard',
          indices: [mid],
          pointers: { low, mid, high },
          discardedIndices: [...discarded],
          dataState: { array: arr, target, low, mid, high, discarded: [...discarded], foundIndex: null },
          codeLine: 7,
          message: `Since arr[mid]=${arr[mid]} > ${target}, target must lie in the left half. Discarding indices [${mid}..${high}].`,
          reason: {
            action: `Discard [${mid}..${high}]`,
            why: `arr[mid]=${arr[mid]} is greater than target ${target}, so everything at or right of mid is too large.`,
            rule: `arr[mid] > target => eliminate right half`,
            values: { mid, val: arr[mid], target },
            details: 'All elements at index >= mid are strictly larger than target in a sorted array.',
          },
        };

        const oldHigh = high;
        high = mid - 1;
        yield {
          type: 'pointer',
          indices: low <= high ? [high] : [],
          pointers: { low, mid: null, high },
          discardedIndices: [...discarded],
          dataState: { array: arr, target, low, mid: null, high, discarded: [...discarded], foundIndex: null },
          codeLine: 7,
          message: `Moved high pointer to index ${high} (${high >= low ? `arr[${high}] = ${arr[high]}` : 'out of bounds'}).`,
          reason: {
            action: `high: ${oldHigh} -> ${high}`,
            why: `high moved ${oldHigh} -> ${high} because arr[${mid}]=${arr[mid]} > ${target}.`,
            rule: `high = mid - 1`,
            values: { oldHigh, newHigh: high, mid },
            details: 'Search space now restricted to the remaining left half.',
          },
        };
      }
    }

    // Step: Not found
    for (let i = 0; i < arr.length; i++) {
      if (!discarded.includes(i)) discarded.push(i);
    }
    yield {
      type: 'not-found',
      indices: [],
      pointers: { low, mid: null, high },
      discardedIndices: [...discarded],
      dataState: { array: arr, target, low, mid: null, high, discarded: [...discarded], foundIndex: null },
      codeLine: 8,
      message: `Search range exhausted (low=${low} > high=${high}). Target ${target} does not exist in array.`,
      reason: {
        action: 'Not found',
        why: `Pointers crossed (low=${low} > high=${high}). Target ${target} does not exist in array.`,
        rule: `low > high`,
        values: { low, high, target },
        details: 'All search candidates have been eliminated.',
      },
    };
  },

  quiz: [
    {
      question: 'What is the maximum number of comparisons for binary search on an array of 16 elements?',
      options: ['4 comparisons', '5 comparisons', '16 comparisons', '8 comparisons'],
      correctAnswer: 1,
      explanation: 'For n = 16, ceil(log2(16)) + 1 = 4 or 5 comparisons depending on implementation (at most floor(log2(n)) + 1 = 5 comparisons).',
    },
    {
      question: 'What is the prerequisite for performing Binary Search on an array?',
      options: ['Elements must all be positive', 'Array must be sorted', 'Array must contain unique elements', 'Array length must be a power of 2'],
      correctAnswer: 1,
      explanation: 'Binary Search relies on the array being monotonically sorted so it can discard half the remaining range at each step.',
    },
  ],
};
