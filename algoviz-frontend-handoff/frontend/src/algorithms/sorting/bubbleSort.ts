import { AlgorithmDefinition, StepAction } from '../../types';

export interface BubbleSortInput {
  array: number[];
}

export interface BubbleSortData {
  array: number[];
  comparing: [number, number] | null;
  swapped: [number, number] | null;
  sortedIndices: number[];
}

export const bubbleSort: AlgorithmDefinition<BubbleSortInput, BubbleSortData> = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  categoryName: 'Sorting Algorithms',
  part: 'algo',
  difficulty: 'Beginner',
  description:
    'A simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Larger elements bubble up to the end of the array.',
  realLifeExample: 'Air bubbles rising to the surface of a carbonated beverage or fish tank in order of buoyancy.',
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
    'function bubbleSort(arr):',
    '    n = arr.length',
    '    for i = 0 to n - 1:',
    '        swapped = false',
    '        for j = 0 to n - i - 2:',
    '            if arr[j] > arr[j + 1]:',
    '                swap(arr[j], arr[j + 1])',
    '                swapped = true',
    '        if not swapped: break',
    '    return arr',
  ],
  explanation:
    'Bubble Sort repeatedly steps through the input list element by element, comparing the current element with the one after it, swapping their values if needed. After pass i, the i-th largest element is guaranteed to have bubbled to its final sorted position at index (n - 1 - i). With an early-exit optimization checking if any swaps occurred, it achieves O(n) best-case performance for sorted arrays.',
  tags: ['Comparison Sort', 'In-Place', 'Stable', 'Quadratic Time'],
  boardType: 'array-sort',

  defaultInput: {
    array: [45, 12, 85, 32, 89, 39, 69, 21, 55],
  },

  presets: [
    {
      label: 'Random Mix (9 items)',
      value: { array: [45, 12, 85, 32, 89, 39, 69, 21, 55] },
      description: 'Typical unsorted array.',
    },
    {
      label: 'Reverse Sorted (Worst Case)',
      value: { array: [90, 80, 70, 60, 50, 40, 30, 20, 10] },
      description: 'Maximum number of swaps required: n*(n-1)/2.',
    },
    {
      label: 'Nearly Sorted',
      value: { array: [10, 20, 40, 30, 50, 60, 80, 70, 90] },
      description: 'Only a couple of inversions.',
    },
    {
      label: 'Already Sorted (Best Case)',
      value: { array: [10, 20, 30, 40, 50, 60, 70, 80, 90] },
      description: 'Terminates early in O(n) after 1 pass with zero swaps.',
    },
    {
      label: 'Few Unique Elements',
      value: { array: [20, 50, 20, 80, 50, 20, 80, 50] },
      description: 'Tests stability with duplicate keys.',
    },
  ],

  generateRandomInput: () => {
    const size = Math.floor(Math.random() * 5) + 7; // 7 to 11 elements
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array.push(Math.floor(Math.random() * 85) + 10);
    }
    return { array };
  },

  validateInput: (input) => {
    if (!input || !Array.isArray(input.array) || input.array.length === 0) {
      return { valid: false, error: 'Array must have at least 1 element' };
    }
    if (input.array.length > 20) {
      return { valid: false, error: 'Array length cannot exceed 20 for clear visual rendering' };
    }
    for (const val of input.array) {
      if (typeof val !== 'number' || isNaN(val)) {
        return { valid: false, error: 'All elements must be valid numbers' };
      }
    }
    return { valid: true };
  },

  *run(input): Generator<StepAction<BubbleSortData>, void, unknown> {
    const arr = [...input.array];
    const n = arr.length;
    const sortedIndices: number[] = [];

    // Step 0: Start
    yield {
      type: 'start',
      indices: [],
      dataState: { array: [...arr], comparing: null, swapped: null, sortedIndices: [] },
      codeLine: 2,
      message: `Starting Bubble Sort on ${n} elements.`,
      reason: {
        action: 'Init Bubble Sort',
        why: `Begin sorting array of ${n} elements using adjacent comparisons and swaps.`,
        rule: 'for i = 0 to n - 1',
        values: { n },
        details: 'Bubble Sort repeatedly steps through the array, compares adjacent elements and swaps them if they are in the wrong order.',
      },
    };

    if (n <= 1) {
      yield {
        type: 'complete',
        indices: [0],
        dataState: { array: [...arr], comparing: null, swapped: null, sortedIndices: [0] },
        codeLine: 10,
        message: 'Array with 1 or fewer elements is already sorted.',
        reason: {
          action: 'Trivially Sorted',
          why: 'An array of size 1 or 0 has zero inversions and is already sorted.',
          rule: 'n <= 1',
          values: { n },
          details: 'No comparisons or swaps required.',
        },
      };
      return;
    }

    for (let i = 0; i < n - 1; i++) {
      let swappedInPass = false;

      yield {
        type: 'highlight',
        indices: [],
        dataState: { array: [...arr], comparing: null, swapped: null, sortedIndices: [...sortedIndices] },
        codeLine: 3,
        message: `Beginning Pass ${i + 1} of ${n - 1}. Bubble the largest remaining item to position ${n - 1 - i}.`,
        reason: {
          action: `Pass ${i + 1} / ${n - 1}`,
          why: `Bubbling the largest unsorted value up to position ${n - 1 - i}.`,
          rule: `i = ${i}`,
          values: { pass: i + 1, targetIndex: n - 1 - i },
          details: 'Each outer loop iteration guarantees placing at least one element into its final sorted position at the right end.',
        },
      };

      for (let j = 0; j < n - i - 1; j++) {
        // Step: Compare arr[j] and arr[j + 1]
        yield {
          type: 'compare',
          indices: [j, j + 1],
          dataState: {
            array: [...arr],
            comparing: [j, j + 1],
            swapped: null,
            sortedIndices: [...sortedIndices],
          },
          codeLine: 6,
          message: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
          reason: {
            action: `Compare: ${arr[j]} vs ${arr[j + 1]}`,
            why: `Comparing adjacent elements arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}.`,
            rule: `arr[j] > arr[j + 1] ?`,
            values: { j, left: arr[j], right: arr[j + 1] },
            details: 'If left element is greater than right element, they violate sorted order and must be swapped.',
          },
        };

        if (arr[j] > arr[j + 1]) {
          // Swap
          const leftVal = arr[j];
          const rightVal = arr[j + 1];
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swappedInPass = true;

          yield {
            type: 'swap',
            indices: [j, j + 1],
            dataState: {
              array: [...arr],
              comparing: null,
              swapped: [j, j + 1],
              sortedIndices: [...sortedIndices],
            },
            codeLine: 7,
            message: `${temp} > ${arr[j]}, swapped elements at index ${j} and ${j + 1}.`,
            reason: {
              action: `Swap: ${leftVal} <-> ${rightVal}`,
              why: `Swapped ${leftVal} and ${rightVal} because ${leftVal} > ${rightVal}, the larger value bubbles right.`,
              rule: `arr[${j}] > arr[${j + 1}] => swap`,
              values: { left: leftVal, right: rightVal, j },
              details: 'The larger element moves one step closer to its destination at the end of the array.',
            },
          };
        }
      }

      // Element at n - 1 - i is now guaranteed sorted
      const settledIndex = n - 1 - i;
      if (!sortedIndices.includes(settledIndex)) {
        sortedIndices.unshift(settledIndex);
      }

      yield {
        type: 'sorted',
        indices: [settledIndex],
        dataState: {
          array: [...arr],
          comparing: null,
          swapped: null,
          sortedIndices: [...sortedIndices],
        },
        codeLine: 5,
        message: `Pass ${i + 1} complete. Element ${arr[settledIndex]} placed in its sorted position at index ${settledIndex}.`,
        reason: {
          action: `Settled index ${settledIndex}`,
          why: `Pass ${i + 1} complete: Element ${arr[settledIndex]} is now settled in its permanent sorted location.`,
          rule: `Subarray [${settledIndex}..${n - 1}] is sorted`,
          values: { settledIndex, value: arr[settledIndex] },
          details: 'This element will never need to be moved or checked again in future passes.',
        },
      };

      // Early break if no swaps occurred
      if (!swappedInPass) {
        // Mark all remaining unsorted as sorted
        for (let k = 0; k < n; k++) {
          if (!sortedIndices.includes(k)) sortedIndices.push(k);
        }
        sortedIndices.sort((a, b) => a - b);

        yield {
          type: 'complete',
          indices: [...sortedIndices],
          dataState: {
            array: [...arr],
            comparing: null,
            swapped: null,
            sortedIndices: [...sortedIndices],
          },
          codeLine: 9,
          message: `Zero swaps made during Pass ${i + 1}! The array is completely sorted. Early termination.`,
          reason: {
            action: 'Early Complete (O(n))',
            why: `Zero swaps made during entire pass! Array is already in perfect ascending order.`,
            rule: `swappedInPass == false => return`,
            values: { pass: i + 1 },
            details: 'Adaptive optimization avoids unnecessary remaining passes, achieving O(n) best-case time.',
          },
        };
        return;
      }
    }

    // Add first element to sorted if not already
    if (!sortedIndices.includes(0)) {
      sortedIndices.unshift(0);
    }
    sortedIndices.sort((a, b) => a - b);

    // Final Complete Step
    yield {
      type: 'complete',
      indices: [...sortedIndices],
      dataState: {
        array: [...arr],
        comparing: null,
        swapped: null,
        sortedIndices: [...sortedIndices],
      },
      codeLine: 10,
      message: 'Bubble sort complete! Array is sorted in ascending order.',
      reason: {
        action: 'Sort Finished',
        why: 'All elements verified in sorted ascending order.',
        rule: 'All passes complete',
        values: {},
        details: 'Sorting invariant established across entire array.',
      },
    };
  },

  quiz: [
    {
      question: 'What is the best-case time complexity of optimized Bubble Sort on an already sorted array?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 0,
      explanation: 'With the swapped boolean flag optimization, Bubble Sort finishes after one pass (n - 1 comparisons) with 0 swaps, taking O(n) time.',
    },
    {
      question: 'Is Bubble Sort an in-place and stable sorting algorithm?',
      options: [
        'Yes, it is both in-place and stable',
        'It is in-place but not stable',
        'It is stable but requires O(n) auxiliary memory',
        'Neither in-place nor stable',
      ],
      correctAnswer: 0,
      explanation: 'Bubble Sort only swaps strictly adjacent elements when arr[j] > arr[j+1], preserving relative order of equal keys (stable) with O(1) extra space (in-place).',
    },
  ],
};
