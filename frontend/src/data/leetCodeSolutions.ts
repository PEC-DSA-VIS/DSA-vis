export interface SynthesizedStep {
  stepNum: number;
  totalSteps?: number;
  action: string;
  why: string;
  activeLine: number;
  // Multi-pointer & buffer state
  array?: number[];
  pointers?: { [name: string]: number | null };
  pointerI?: number | null;
  pointerJ?: number | null;
  pointerK?: number | null;
  highlightedIndices?: number[];
  matchedIndices?: number[];
  // Variable registers for Terminal Watch & Inspector
  variables?: { [name: string]: string | number | boolean };
  // Hash map / frequency entries
  hashEntries?: { key: string | number; val: string | number }[];
  // Heights & trapped water (for Trapping Rain Water, Container)
  heights?: number[];
  trappedWater?: number[];
  currentArea?: number;
  maxArea?: number;
  // String / sliding window
  stringChars?: string[];
  windowRange?: [number, number];
  // Stack entries
  stack?: string[];
  // Grid / Matrix
  grid?: string[][];
  currentCell?: [number, number] | null;
  visitedCells?: [number, number][];
  isComplete?: boolean;
}

export interface LeetCodeProblemDef {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  defaultInput: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: {
    python: string;
    cpp: string;
    java: string;
  };
  generateSteps: (customArray?: number[], customTarget?: number, customStr?: string) => SynthesizedStep[];
}

export const LEETCODE_PROBLEMS: Record<number, LeetCodeProblemDef> = {
  // 16. 3Sum Closest
  16: {
    id: 16,
    title: 'LeetCode #16: 3Sum Closest',
    slug: '3sum-closest',
    difficulty: 'Medium',
    category: 'Two Pointers / Sorting',
    description:
      'Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers.',
    defaultInput: 'nums = [-1, 2, 1, -4], target = 1',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    code: {
      python: `class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        nums.sort()
        n = len(nums)
        closest_sum = nums[0] + nums[1] + nums[2]
        
        for i in range(n - 2):
            left, right = i + 1, n - 1
            while left < right:
                current_sum = nums[i] + nums[left] + nums[right]
                if abs(current_sum - target) < abs(closest_sum - target):
                    closest_sum = current_sum
                
                if current_sum < target:
                    left += 1
                elif current_sum > target:
                    right -= 1
                else:
                    return current_sum
        return closest_sum`,
      cpp: `class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        int closest_sum = nums[0] + nums[1] + nums[2];
        
        for (int i = 0; i < n - 2; ++i) {
            int left = i + 1, right = n - 1;
            while (left < right) {
                int current_sum = nums[i] + nums[left] + nums[right];
                if (abs(current_sum - target) < abs(closest_sum - target)) {
                    closest_sum = current_sum;
                }
                if (current_sum < target) {
                    ++left;
                } else if (current_sum > target) {
                    --right;
                } else {
                    return current_sum;
                }
            }
        }
        return closest_sum;
    }
};`,
      java: `class Solution {
    public int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        int n = nums.length;
        int closestSum = nums[0] + nums[1] + nums[2];
        
        for (int i = 0; i < n - 2; i++) {
            int left = i + 1, right = n - 1;
            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];
                if (Math.abs(currentSum - target) < Math.abs(closestSum - target)) {
                    closestSum = currentSum;
                }
                if (currentSum < target) {
                    left++;
                } else if (currentSum > target) {
                    right--;
                } else {
                    return currentSum;
                }
            }
        }
        return closestSum;
    }
}`,
    },
    generateSteps: (customArray, customTarget) => {
      const initial = customArray && customArray.length >= 3 ? [...customArray] : [-1, 2, 1, -4];
      const target = customTarget !== undefined ? customTarget : 1;
      const steps: SynthesizedStep[] = [];

      // Step 1: Initial raw array
      steps.push({
        stepNum: 1,
        array: [...initial],
        pointers: {},
        variables: { target, state: 'Loaded unsorted input' },
        action: `Load raw input buffer of ${initial.length} elements with target = ${target}`,
        why: `We need to find three integers whose sum has minimum absolute difference |sum - ${target}|.`,
        activeLine: 2,
      });

      // Step 2: Sort
      const sorted = [...initial].sort((a, b) => a - b);
      steps.push({
        stepNum: 2,
        array: [...sorted],
        pointers: {},
        variables: { target, sorted: 'true' },
        action: `Sort array in non-decreasing order: [${sorted.join(', ')}]`,
        why: `Sorting in O(n log n) enables two-pointer convergence: if sum < target, increment left; if sum > target, decrement right.`,
        activeLine: 3,
      });

      const n = sorted.length;
      let closestSum = sorted[0] + sorted[1] + sorted[2];
      let bestDiff = Math.abs(closestSum - target);
      let bestTriplet: [number, number, number] = [0, 1, 2];

      // Step 3: Initialize closestSum
      steps.push({
        stepNum: 3,
        array: [...sorted],
        pointers: { i: 0, left: 1, right: 2 },
        highlightedIndices: [0, 1, 2],
        variables: {
          i: 0,
          left: 1,
          right: 2,
          current_sum: closestSum,
          closest_sum: closestSum,
          min_diff: bestDiff,
        },
        action: `Initialize closest_sum = ${sorted[0]} + ${sorted[1]} + ${sorted[2]} = ${closestSum}`,
        why: `Base baseline difference is |${closestSum} - ${target}| = ${bestDiff}.`,
        activeLine: 5,
      });

      for (let i = 0; i < n - 2; i++) {
        let left = i + 1;
        let right = n - 1;

        steps.push({
          stepNum: steps.length + 1,
          array: [...sorted],
          pointers: { i, left, right },
          highlightedIndices: [i],
          variables: {
            i,
            'nums[i]': sorted[i],
            left,
            right,
            closest_sum: closestSum,
            min_diff: bestDiff,
          },
          action: `Anchor i = ${i} (nums[${i}] = ${sorted[i]}). Initialize two pointers left = ${left}, right = ${right}`,
          why: `We fix nums[${i}] as the first element and search for optimal pairs in subarray [${left}..${right}].`,
          activeLine: 7,
        });

        while (left < right) {
          const currentSum = sorted[i] + sorted[left] + sorted[right];
          const diff = Math.abs(currentSum - target);

          steps.push({
            stepNum: steps.length + 1,
            array: [...sorted],
            pointers: { i, left, right },
            highlightedIndices: [i, left, right],
            variables: {
              i,
              left,
              right,
              triplet: `(${sorted[i]}, ${sorted[left]}, ${sorted[right]})`,
              current_sum: currentSum,
              target,
              diff,
              closest_sum: closestSum,
              min_diff: bestDiff,
            },
            action: `Evaluate triplet (${sorted[i]} + ${sorted[left]} + ${sorted[right]}) = ${currentSum}. Diff = |${currentSum} - ${target}| = ${diff}`,
            why: `Checking if diff ${diff} is closer to target than current best difference ${bestDiff}.`,
            activeLine: 10,
          });

          if (diff < bestDiff) {
            closestSum = currentSum;
            bestDiff = diff;
            bestTriplet = [i, left, right];

            steps.push({
              stepNum: steps.length + 1,
              array: [...sorted],
              pointers: { i, left, right },
              highlightedIndices: [i, left, right],
              matchedIndices: [i, left, right],
              variables: {
                i,
                left,
                right,
                NEW_CLOSEST: closestSum,
                NEW_MIN_DIFF: bestDiff,
              },
              action: `Update best closest_sum = ${closestSum}! New minimum difference = ${bestDiff}`,
              why: `Found a closer triplet sum (${sorted[i]}, ${sorted[left]}, ${sorted[right]}). Storing as global best candidate.`,
              activeLine: 12,
            });
          }

          if (currentSum < target) {
            const oldLeft = left;
            left++;
            steps.push({
              stepNum: steps.length + 1,
              array: [...sorted],
              pointers: { i, left, right },
              highlightedIndices: [i, oldLeft, right],
              variables: {
                'current_sum < target': `${currentSum} < ${target}`,
                action: 'left++',
                new_left: left,
                right,
                closest_sum: closestSum,
              },
              action: `Sum ${currentSum} < target ${target} → increment left from ${oldLeft} to ${left}`,
              why: `Because the array is sorted, incrementing left increases nums[left], driving the sum closer upward toward target.`,
              activeLine: 15,
            });
          } else if (currentSum > target) {
            const oldRight = right;
            right--;
            steps.push({
              stepNum: steps.length + 1,
              array: [...sorted],
              pointers: { i, left, right },
              highlightedIndices: [i, left, oldRight],
              variables: {
                'current_sum > target': `${currentSum} > ${target}`,
                action: 'right--',
                left,
                new_right: right,
                closest_sum: closestSum,
              },
              action: `Sum ${currentSum} > target ${target} → decrement right from ${oldRight} to ${right}`,
              why: `Because the array is sorted, decrementing right decreases nums[right], driving the sum downward toward target.`,
              activeLine: 17,
            });
          } else {
            // Exact hit!
            steps.push({
              stepNum: steps.length + 1,
              array: [...sorted],
              pointers: { i, left, right },
              matchedIndices: [i, left, right],
              variables: {
                EXACT_MATCH: currentSum,
                closest_sum: currentSum,
                min_diff: 0,
              },
              action: `Exact match found! current_sum (${currentSum}) == target (${target}). Diff = 0`,
              why: `No sum can be closer than absolute difference 0. Returning immediately.`,
              activeLine: 19,
              isComplete: true,
            });
            return steps;
          }
        }
      }

      // Final complete step
      steps.push({
        stepNum: steps.length + 1,
        array: [...sorted],
        pointers: { i: bestTriplet[0], left: bestTriplet[1], right: bestTriplet[2] },
        matchedIndices: [...bestTriplet],
        variables: {
          RESULT_CLOSEST_SUM: closestSum,
          FINAL_MIN_DIFF: bestDiff,
          OPTIMAL_TRIPLET: `[${sorted[bestTriplet[0]]}, ${sorted[bestTriplet[1]]}, ${sorted[bestTriplet[2]]}]`,
        },
        action: `Execution complete. Optimal closest sum = ${closestSum} (diff = ${bestDiff})`,
        why: `Exhausted all two-pointer sweeps across O(n²) space. Optimal solution guaranteed.`,
        activeLine: 20,
        isComplete: true,
      });

      return steps;
    },
  },

  // 1. Two Sum
  1: {
    id: 1,
    title: 'LeetCode #1: Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Hash Table / Array',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    defaultInput: 'nums = [2, 7, 11, 15], target = 9',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: {
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
    },
    generateSteps: (customArray, customTarget) => {
      const array = customArray && customArray.length >= 2 ? [...customArray] : [2, 7, 11, 15];
      const target = customTarget !== undefined ? customTarget : 9;
      const steps: SynthesizedStep[] = [];
      const seen = new Map<number, number>();

      steps.push({
        stepNum: 1,
        array: [...array],
        pointers: {},
        hashEntries: [],
        variables: { target, 'seen.size()': 0 },
        action: `Initialize empty Hash Map seen = {} with target = ${target}`,
        why: `We scan elements one by one; the hash map will store (value -> index) for O(1) complement lookup.`,
        activeLine: 3,
      });

      for (let i = 0; i < array.length; i++) {
        const val = array[i];
        const complement = target - val;

        steps.push({
          stepNum: steps.length + 1,
          array: [...array],
          pointers: { i },
          highlightedIndices: [i],
          hashEntries: Array.from(seen.entries()).map(([k, v]) => ({ key: k, val: v })),
          variables: {
            i,
            'nums[i]': val,
            target,
            complement: `${target} - ${val} = ${complement}`,
          },
          action: `i = ${i}: nums[${i}] = ${val}. Compute complement = ${target} - ${val} = ${complement}`,
          why: `We check if the required number ${complement} was previously inserted into our hash map.`,
          activeLine: 5,
        });

        if (seen.has(complement)) {
          const matchIdx = seen.get(complement)!;
          steps.push({
            stepNum: steps.length + 1,
            array: [...array],
            pointers: { i, match: matchIdx },
            matchedIndices: [matchIdx, i],
            hashEntries: Array.from(seen.entries()).map(([k, v]) => ({ key: k, val: v })),
            variables: {
              FOUND_COMPLEMENT: complement,
              'seen[complement]': matchIdx,
              current_i: i,
              PAIR: `[${matchIdx}, ${i}]`,
              SUM: `${array[matchIdx]} + ${val} = ${target}`,
            },
            action: `Hash Table Hit! Complement ${complement} found at index ${matchIdx}`,
            why: `nums[${matchIdx}] (${complement}) + nums[${i}] (${val}) = ${target}. Target satisfied in single-pass O(n) time.`,
            activeLine: 6,
            isComplete: true,
          });
          return steps;
        } else {
          seen.set(val, i);
          steps.push({
            stepNum: steps.length + 1,
            array: [...array],
            pointers: { i },
            highlightedIndices: [i],
            hashEntries: Array.from(seen.entries()).map(([k, v]) => ({ key: k, val: v })),
            variables: {
              'seen.has(comp)': 'false',
              'inserted_pair': `{ ${val}: ${i} }`,
              'map_size': seen.size,
            },
            action: `Complement ${complement} not in map. Store seen[${val}] = ${i}`,
            why: `Stored current value ${val} at index ${i} so later numbers can use it as their complement.`,
            activeLine: 7,
          });
        }
      }

      steps.push({
        stepNum: steps.length + 1,
        array: [...array],
        pointers: {},
        hashEntries: Array.from(seen.entries()).map(([k, v]) => ({ key: k, val: v })),
        variables: { result: '[]' },
        action: `Finished scan. No pair summed to ${target}`,
        why: `All elements evaluated without finding a complement pair.`,
        activeLine: 8,
        isComplete: true,
      });

      return steps;
    },
  },

  // 15. 3Sum
  15: {
    id: 15,
    title: 'LeetCode #15: 3Sum',
    slug: '3sum',
    difficulty: 'Medium',
    category: 'Two Pointers / Sorting',
    description:
      'Given an integer array nums, return all the triplets [nums[i], nums[left], nums[right]] such that i != left, i != right, and left != right, and nums[i] + nums[left] + nums[right] == 0.',
    defaultInput: 'nums = [-1, 0, 1, 2, -1, -4]',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1) extra',
    code: {
      python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        res = []
        n = len(nums)
        for i in range(n - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, n - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    res.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
        return res`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        int n = nums.size();
        for (int i = 0; i < n - 2; ++i) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = n - 1;
            while (left < right) {
                int total = nums[i] + nums[left] + nums[right];
                if (total < 0) {
                    ++left;
                } else if (total > 0) {
                    --right;
                } else {
                    res.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) ++left;
                    while (left < right && nums[right] == nums[right - 1]) --right;
                    ++left; --right;
                }
            }
        }
        return res;
    }
};`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        int n = nums.length;
        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = n - 1;
            while (left < right) {
                int total = nums[i] + nums[left] + nums[right];
                if (total < 0) {
                    left++;
                } else if (total > 0) {
                    right--;
                } else {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                }
            }
        }
        return res;
    }
}`,
    },
    generateSteps: (customArray) => {
      const initial = customArray && customArray.length >= 3 ? [...customArray] : [-1, 0, 1, 2, -1, -4];
      const sorted = [...initial].sort((a, b) => a - b);
      const steps: SynthesizedStep[] = [];
      const n = sorted.length;
      const foundTriplets: string[] = [];

      steps.push({
        stepNum: 1,
        array: [...sorted],
        pointers: {},
        variables: { status: 'Array Sorted', size: n },
        action: `Sort array in non-decreasing order: [${sorted.join(', ')}]`,
        why: `Sorting allows dual pointers and skip of duplicate elements to avoid redundant triplets.`,
        activeLine: 3,
      });

      for (let i = 0; i < n - 2; i++) {
        if (i > 0 && sorted[i] === sorted[i - 1]) {
          steps.push({
            stepNum: steps.length + 1,
            array: [...sorted],
            pointers: { i },
            highlightedIndices: [i, i - 1],
            variables: { i, 'duplicate_val': sorted[i] },
            action: `Skip duplicate anchor nums[${i}] = ${sorted[i]} (same as nums[${i - 1}])`,
            why: `Prevents duplicate triplets in the final result.`,
            activeLine: 7,
          });
          continue;
        }

        let left = i + 1;
        let right = n - 1;

        steps.push({
          stepNum: steps.length + 1,
          array: [...sorted],
          pointers: { i, left, right },
          highlightedIndices: [i],
          variables: { i, 'anchor_nums[i]': sorted[i], left, right },
          action: `Set anchor i = ${i} (${sorted[i]}), left = ${left} (${sorted[left]}), right = ${right} (${sorted[right]})`,
          why: `Searching for pairs summing to -(${sorted[i]}) in subarray [${left}..${right}].`,
          activeLine: 8,
        });

        while (left < right) {
          const total = sorted[i] + sorted[left] + sorted[right];

          steps.push({
            stepNum: steps.length + 1,
            array: [...sorted],
            pointers: { i, left, right },
            highlightedIndices: [i, left, right],
            variables: {
              i,
              left,
              right,
              sum_expr: `${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${total}`,
              total,
            },
            action: `Check sum: ${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${total}`,
            why: `Comparing total to 0.`,
            activeLine: 11,
          });

          if (total < 0) {
            left++;
            steps.push({
              stepNum: steps.length + 1,
              array: [...sorted],
              pointers: { i, left, right },
              variables: { 'total < 0': true, new_left: left },
              action: `Sum ${total} < 0 → increment left pointer to ${left}`,
              why: `Array is sorted; incrementing left increases the total sum towards 0.`,
              activeLine: 13,
            });
          } else if (total > 0) {
            right--;
            steps.push({
              stepNum: steps.length + 1,
              array: [...sorted],
              pointers: { i, left, right },
              variables: { 'total > 0': true, new_right: right },
              action: `Sum ${total} > 0 → decrement right pointer to ${right}`,
              why: `Array is sorted; decrementing right decreases the total sum towards 0.`,
              activeLine: 15,
            });
          } else {
            const tripletStr = `[${sorted[i]}, ${sorted[left]}, ${sorted[right]}]`;
            foundTriplets.push(tripletStr);
            steps.push({
              stepNum: steps.length + 1,
              array: [...sorted],
              pointers: { i, left, right },
              matchedIndices: [i, left, right],
              variables: {
                FOUND_TRIPLET: tripletStr,
                total_found: foundTriplets.length,
              },
              action: `Valid Triplet Found: ${tripletStr} sums to 0!`,
              why: `Found 3 elements whose sum equals zero. Adding to answer set.`,
              activeLine: 17,
            });

            left++;
            right--;
          }
        }
      }

      steps.push({
        stepNum: steps.length + 1,
        array: [...sorted],
        pointers: {},
        variables: { RESULT: `[${foundTriplets.join(', ')}]`, total: foundTriplets.length },
        action: `3Sum Search Complete. Found ${foundTriplets.length} unique triplets: ${foundTriplets.join(', ') || 'None'}`,
        why: `All combinations checked in optimal O(n²) time.`,
        activeLine: 24,
        isComplete: true,
      });

      return steps;
    },
  },

  // 42. Trapping Rain Water
  42: {
    id: 42,
    title: 'LeetCode #42: Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Two Pointers / Dynamic Programming',
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    defaultInput: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: {
      python: `class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0
        left, right = 0, len(height) - 1
        left_max, right_max = height[left], height[right]
        water = 0
        
        while left < right:
            if left_max <= right_max:
                left += 1
                left_max = max(left_max, height[left])
                water += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                water += right_max - height[right]
        return water`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        if (height.empty()) return 0;
        int left = 0, right = height.size() - 1;
        int left_max = height[left], right_max = height[right];
        int water = 0;
        
        while (left < right) {
            if (left_max <= right_max) {
                left++;
                left_max = max(left_max, height[left]);
                water += left_max - height[left];
            } else {
                right--;
                right_max = max(right_max, height[right]);
                water += right_max - height[right];
            }
        }
        return water;
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        if (height == null || height.length == 0) return 0;
        int left = 0, right = height.length - 1;
        int leftMax = height[left], rightMax = height[right];
        int water = 0;
        
        while (left < right) {
            if (leftMax <= rightMax) {
                left++;
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
            } else {
                right--;
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
            }
        }
        return water;
    }
}`,
    },
    generateSteps: (customHeights) => {
      const heights = customHeights && customHeights.length >= 3 ? [...customHeights] : [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      const steps: SynthesizedStep[] = [];
      const trapped = new Array(heights.length).fill(0);

      let left = 0;
      let right = heights.length - 1;
      let leftMax = heights[left];
      let rightMax = heights[right];
      let totalWater = 0;

      steps.push({
        stepNum: 1,
        array: [...heights],
        heights: [...heights],
        trappedWater: [...trapped],
        pointers: { left, right },
        variables: {
          left,
          right,
          left_max: leftMax,
          right_max: rightMax,
          total_water: 0,
        },
        action: `Initialize Two Pointers: left = 0 (h = ${heights[0]}), right = ${right} (h = ${heights[right]})`,
        why: `Trapped water at any index is bounded by min(left_max, right_max) - height[i].`,
        activeLine: 6,
      });

      while (left < right) {
        if (leftMax <= rightMax) {
          left++;
          const curH = heights[left];
          const newLeftMax = Math.max(leftMax, curH);
          const add = Math.max(0, newLeftMax - curH);
          trapped[left] = add;
          totalWater += add;
          leftMax = newLeftMax;

          steps.push({
            stepNum: steps.length + 1,
            array: [...heights],
            heights: [...heights],
            trappedWater: [...trapped],
            pointers: { left, right },
            highlightedIndices: [left],
            variables: {
              'condition': `left_max (${leftMax}) <= right_max (${rightMax})`,
              left,
              'height[left]': curH,
              left_max: leftMax,
              water_added: add,
              TOTAL_WATER: totalWater,
            },
            action: `Move left to ${left} (height = ${curH}). Traps ${add} unit(s) of water. Total water = ${totalWater}`,
            why: `Since left_max <= right_max, water height at index ${left} is strictly limited by left_max. Trapped = ${leftMax} - ${curH} = ${add}.`,
            activeLine: 11,
          });
        } else {
          right--;
          const curH = heights[right];
          const newRightMax = Math.max(rightMax, curH);
          const add = Math.max(0, newRightMax - curH);
          trapped[right] = add;
          totalWater += add;
          rightMax = newRightMax;

          steps.push({
            stepNum: steps.length + 1,
            array: [...heights],
            heights: [...heights],
            trappedWater: [...trapped],
            pointers: { left, right },
            highlightedIndices: [right],
            variables: {
              'condition': `left_max (${leftMax}) > right_max (${rightMax})`,
              right,
              'height[right]': curH,
              right_max: rightMax,
              water_added: add,
              TOTAL_WATER: totalWater,
            },
            action: `Move right to ${right} (height = ${curH}). Traps ${add} unit(s) of water. Total water = ${totalWater}`,
            why: `Since right_max < left_max, water height at index ${right} is strictly limited by right_max. Trapped = ${rightMax} - ${curH} = ${add}.`,
            activeLine: 16,
          });
        }
      }

      steps.push({
        stepNum: steps.length + 1,
        array: [...heights],
        heights: [...heights],
        trappedWater: [...trapped],
        pointers: { left, right },
        variables: { FINAL_TRAPPED_WATER: totalWater, algorithm: 'Two Pointers O(n)' },
        action: `Trapping Rain Water completed! Total water trapped = ${totalWater} units.`,
        why: `Both pointers met. Computed exact water volume across all columns in linear O(n) time and O(1) space.`,
        activeLine: 17,
        isComplete: true,
      });

      return steps;
    },
  },

  // 3. Longest Substring Without Repeating Characters
  3: {
    id: 3,
    title: 'LeetCode #3: Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window / Hash Table',
    description:
      'Given a string s, find the length of the longest substring without duplicate characters.',
    defaultInput: 's = "abcabcbb"',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, m))',
    code: {
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = 0
        max_len = 0
        for right, ch in enumerate(s):
            if ch in char_map and char_map[ch] >= left:
                left = char_map[ch] + 1
            char_map[ch] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> char_map;
        int left = 0, max_len = 0;
        for (int right = 0; right < s.length(); ++right) {
            char ch = s[right];
            if (char_map.count(ch) && char_map[ch] >= left) {
                left = char_map[ch] + 1;
            }
            char_map[ch] = right;
            max_len = max(max_len, right - left + 1);
        }
        return max_len;
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> charMap = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            if (charMap.containsKey(ch) && charMap.get(ch) >= left) {
                left = charMap.get(ch) + 1;
            }
            charMap.put(ch, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
    },
    generateSteps: (_arr, _tgt, customStr) => {
      const s = customStr && customStr.length > 0 ? customStr : 'abcabcbb';
      const chars = s.split('');
      const steps: SynthesizedStep[] = [];
      const charMap = new Map<string, number>();

      let left = 0;
      let maxLen = 0;
      let bestWindow: [number, number] = [0, 0];

      steps.push({
        stepNum: 1,
        stringChars: chars,
        windowRange: [0, 0],
        pointers: { left: 0, right: 0 },
        hashEntries: [],
        variables: { s: `"${s}"`, left: 0, max_len: 0 },
        action: `Initialize Sliding Window over string "${s}" with left = 0, max_len = 0`,
        why: `We expand right pointer character by character. If a duplicate is encountered, shrink left.`,
        activeLine: 3,
      });

      for (let right = 0; right < chars.length; right++) {
        const ch = chars[right];

        if (charMap.has(ch) && charMap.get(ch)! >= left) {
          const oldLeft = left;
          left = charMap.get(ch)! + 1;
          steps.push({
            stepNum: steps.length + 1,
            stringChars: chars,
            windowRange: [left, right],
            pointers: { left, right },
            highlightedIndices: [charMap.get(ch)!, right],
            hashEntries: Array.from(charMap.entries()).map(([k, v]) => ({ key: k, val: v })),
            variables: {
              duplicate_char: `'${ch}'`,
              previous_index: charMap.get(ch)!,
              old_left: oldLeft,
              new_left: left,
              max_len: maxLen,
            },
            action: `Duplicate '${ch}' detected at index ${charMap.get(ch)!}! Jump left pointer to ${left}`,
            why: `To preserve uniqueness, the window cannot contain two '${ch}' characters. Left pointer slides past the previous occurrence.`,
            activeLine: 7,
          });
        }

        charMap.set(ch, right);
        const curLen = right - left + 1;
        if (curLen > maxLen) {
          maxLen = curLen;
          bestWindow = [left, right];
        }

        steps.push({
          stepNum: steps.length + 1,
          stringChars: chars,
          windowRange: [left, right],
          pointers: { left, right },
          matchedIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          hashEntries: Array.from(charMap.entries()).map(([k, v]) => ({ key: k, val: v })),
          variables: {
            right,
            current_char: `'${ch}'`,
            window_str: `"${chars.slice(left, right + 1).join('')}"`,
            window_length: curLen,
            CURRENT_MAX_LEN: maxLen,
          },
          action: `Expand right to ${right} ('${ch}'). Window: "${chars.slice(left, right + 1).join('')}" (len: ${curLen})`,
          why: `Window contains unique characters. Updated maximum substring length = ${maxLen}.`,
          activeLine: 9,
        });
      }

      steps.push({
        stepNum: steps.length + 1,
        stringChars: chars,
        windowRange: bestWindow,
        matchedIndices: Array.from({ length: bestWindow[1] - bestWindow[0] + 1 }, (_, i) => bestWindow[0] + i),
        pointers: { left: bestWindow[0], right: bestWindow[1] },
        variables: {
          RESULT_MAX_LEN: maxLen,
          LONGEST_SUBSTRING: `"${chars.slice(bestWindow[0], bestWindow[1] + 1).join('')}"`,
        },
        action: `Scan Complete! Longest Substring Length = ${maxLen} ("${chars.slice(bestWindow[0], bestWindow[1] + 1).join('')}")`,
        why: `Sliding window guaranteed O(n) single pass time complexity with O(k) memory.`,
        activeLine: 10,
        isComplete: true,
      });

      return steps;
    },
  },

  // 53. Maximum Subarray (Kadane's Algorithm)
  53: {
    id: 53,
    title: "LeetCode #53: Maximum Subarray (Kadane's Algorithm)",
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming / Array',
    description:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    defaultInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: {
      python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        max_so_far = nums[0]
        current_max = nums[0]
        for i in range(1, len(nums)):
            current_max = max(nums[i], current_max + nums[i])
            max_so_far = max(max_so_far, current_max)
        return max_so_far`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int max_so_far = nums[0];
        int current_max = nums[0];
        for (int i = 1; i < nums.size(); ++i) {
            current_max = max(nums[i], current_max + nums[i]);
            max_so_far = max(max_so_far, current_max);
        }
        return max_so_far;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currentMax);
        }
        return maxSoFar;
    }
}`,
    },
    generateSteps: (customArray) => {
      const nums = customArray && customArray.length >= 1 ? [...customArray] : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
      const steps: SynthesizedStep[] = [];

      let currentMax = nums[0];
      let maxSoFar = nums[0];
      let startIdx = 0;
      let bestStart = 0;
      let bestEnd = 0;

      steps.push({
        stepNum: 1,
        array: [...nums],
        pointers: { i: 0 },
        highlightedIndices: [0],
        variables: {
          i: 0,
          current_max: nums[0],
          max_so_far: nums[0],
        },
        action: `Initialize Kadane's Algorithm with nums[0] = ${nums[0]}`,
        why: `Base state: at index 0, both current contiguous sum and global max are ${nums[0]}.`,
        activeLine: 3,
      });

      for (let i = 1; i < nums.length; i++) {
        const val = nums[i];
        const extendSum = currentMax + val;

        if (val > extendSum) {
          currentMax = val;
          startIdx = i;
          steps.push({
            stepNum: steps.length + 1,
            array: [...nums],
            pointers: { i },
            highlightedIndices: [i],
            variables: {
              i,
              val,
              'extendSum (currentMax + val)': extendSum,
              choice: 'Reset subarray at index ' + i,
              current_max: currentMax,
              max_so_far: maxSoFar,
            },
            action: `i = ${i} (nums[${i}] = ${val}): Discard negative prefix (${extendSum} < ${val}). Start fresh subarray at index ${i}`,
            why: `Adding ${val} to a negative running sum hurts the sum. It is strictly better to begin a new contiguous subarray.`,
            activeLine: 6,
          });
        } else {
          currentMax = extendSum;
          steps.push({
            stepNum: steps.length + 1,
            array: [...nums],
            pointers: { i },
            highlightedIndices: Array.from({ length: i - startIdx + 1 }, (_, k) => startIdx + k),
            variables: {
              i,
              val,
              extended_sum: currentMax,
              choice: 'Extend existing subarray',
              max_so_far: maxSoFar,
            },
            action: `i = ${i} (nums[${i}] = ${val}): Extend subarray [${startIdx}..${i}]. Running sum = ${currentMax}`,
            why: `Previous sum was non-negative, so extending it increases the contiguous sum.`,
            activeLine: 6,
          });
        }

        if (currentMax > maxSoFar) {
          maxSoFar = currentMax;
          bestStart = startIdx;
          bestEnd = i;
          steps.push({
            stepNum: steps.length + 1,
            array: [...nums],
            pointers: { i },
            matchedIndices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
            variables: {
              NEW_MAX_SO_FAR: maxSoFar,
              BEST_SUBARRAY: `[${bestStart}..${bestEnd}]`,
              SUBARRAY_VALUES: `[${nums.slice(bestStart, bestEnd + 1).join(', ')}]`,
            },
            action: `New Global Maximum! max_so_far updated to ${maxSoFar} (Subarray [${bestStart}..${bestEnd}])`,
            why: `current_max (${currentMax}) exceeds previous max_so_far. Storing new record.`,
            activeLine: 7,
          });
        }
      }

      steps.push({
        stepNum: steps.length + 1,
        array: [...nums],
        pointers: {},
        matchedIndices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
        variables: {
          RESULT_MAX_SUM: maxSoFar,
          OPTIMAL_RANGE: `[${bestStart}..${bestEnd}]`,
          OPTIMAL_ELEMENTS: `[${nums.slice(bestStart, bestEnd + 1).join(', ')}]`,
        },
        action: `Kadane's Scan Complete! Maximum Subarray Sum = ${maxSoFar}`,
        why: `Verified all contiguous candidates in single pass O(n) time and O(1) space.`,
        activeLine: 8,
        isComplete: true,
      });

      return steps;
    },
  },

  // 11. Container With Most Water
  11: {
    id: 11,
    title: 'LeetCode #11: Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    category: 'Two Pointers / Greedy',
    description:
      'Given n non-negative integers a1, a2, ..., an, where each represents a point at coordinate (i, ai). Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    defaultInput: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: {
      python: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        max_area = 0
        while left < right:
            area = min(height[left], height[right]) * (right - left)
            max_area = max(max_area, area)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_area`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int max_area = 0;
        while (left < right) {
            int area = min(height[left], height[right]) * (right - left);
            max_area = max(max_area, area);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return max_area;
    }
};`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;
        while (left < right) {
            int area = Math.min(height[left], height[right]) * (right - left);
            maxArea = Math.max(maxArea, area);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}`,
    },
    generateSteps: (customHeights) => {
      const height = customHeights && customHeights.length >= 2 ? [...customHeights] : [1, 8, 6, 2, 5, 4, 8, 3, 7];
      const steps: SynthesizedStep[] = [];

      let left = 0;
      let right = height.length - 1;
      let maxArea = 0;
      let bestPair: [number, number] = [0, right];

      steps.push({
        stepNum: 1,
        array: [...height],
        heights: [...height],
        pointers: { left, right },
        variables: { left, right, width: right - left, max_area: 0 },
        action: `Initialize Two Pointers at extreme ends: left = 0 (h = ${height[0]}), right = ${right} (h = ${height[right]})`,
        why: `We start with the widest possible container of width ${right - left} and iteratively move inward.`,
        activeLine: 3,
      });

      while (left < right) {
        const width = right - left;
        const minH = Math.min(height[left], height[right]);
        const area = minH * width;

        steps.push({
          stepNum: steps.length + 1,
          array: [...height],
          heights: [...height],
          pointers: { left, right },
          highlightedIndices: [left, right],
          currentArea: area,
          maxArea: Math.max(maxArea, area),
          variables: {
            left,
            right,
            'height[left]': height[left],
            'height[right]': height[right],
            min_height: minH,
            width,
            current_area: `${minH} × ${width} = ${area}`,
            max_area: maxArea,
          },
          action: `Inspect container [${left}..${right}]: min(${height[left]}, ${height[right]}) × ${width} = ${area}`,
          why: `Water capacity is governed by the shorter bar of height ${minH}.`,
          activeLine: 6,
        });

        if (area > maxArea) {
          maxArea = area;
          bestPair = [left, right];
          steps.push({
            stepNum: steps.length + 1,
            array: [...height],
            heights: [...height],
            pointers: { left, right },
            matchedIndices: [left, right],
            currentArea: area,
            maxArea: maxArea,
            variables: {
              NEW_MAX_AREA: maxArea,
              best_left: left,
              best_right: right,
            },
            action: `New Maximum Area Found! max_area = ${maxArea}`,
            why: `Area ${area} exceeds previous record. Storing as optimal solution candidate.`,
            activeLine: 7,
          });
        }

        if (height[left] < height[right]) {
          const oldL = left;
          left++;
          steps.push({
            stepNum: steps.length + 1,
            array: [...height],
            heights: [...height],
            pointers: { left, right },
            variables: {
              'condition': `height[left] (${height[oldL]}) < height[right] (${height[right]})`,
              action: 'left++',
              new_left: left,
              right,
            },
            action: `height[${oldL}] (${height[oldL]}) < height[${right}] (${height[right]}) → increment left to ${left}`,
            why: `The shorter bar at left limits the area. Moving right would only decrease width without any chance to increase height.`,
            activeLine: 9,
          });
        } else {
          const oldR = right;
          right--;
          steps.push({
            stepNum: steps.length + 1,
            array: [...height],
            heights: [...height],
            pointers: { left, right },
            variables: {
              'condition': `height[left] (${height[left]}) >= height[right] (${height[oldR]})`,
              action: 'right--',
              left,
              new_right: right,
            },
            action: `height[${oldR}] (${height[oldR]}) <= height[${left}] (${height[left]}) → decrement right to ${right}`,
            why: `The shorter bar at right limits the area. Moving left inward seeks a taller bar.`,
            activeLine: 11,
          });
        }
      }

      steps.push({
        stepNum: steps.length + 1,
        array: [...height],
        heights: [...height],
        pointers: { left: bestPair[0], right: bestPair[1] },
        matchedIndices: [bestPair[0], bestPair[1]],
        maxArea: maxArea,
        variables: {
          OPTIMAL_MAX_AREA: maxArea,
          best_left_idx: bestPair[0],
          best_right_idx: bestPair[1],
        },
        action: `Execution Complete. Maximum Water Container Area = ${maxArea}`,
        why: `Two-pointer sweep verified all candidate container boundaries in linear O(n) time.`,
        activeLine: 12,
        isComplete: true,
      });

      return steps;
    },
  },
};

// Heuristic problem matcher: detects problem number, title, or keywords
export function detectLeetCodeProblem(text: string): LeetCodeProblemDef | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  // Match LeetCode ID directly (#16, 16, #1, #15, #42, #3, #53, #11)
  const idMatch = text.match(/#\s*(\d+)|leetcode\s*[:#\-]?\s*(\d+)/i);
  if (idMatch) {
    const id = parseInt(idMatch[1] || idMatch[2], 10);
    if (LEETCODE_PROBLEMS[id]) return LEETCODE_PROBLEMS[id];
  }

  // Keywords
  if (lower.includes('closest') || lower.includes('3sum closest') || lower.includes('threesumclosest')) {
    return LEETCODE_PROBLEMS[16];
  }
  if (lower.includes('3sum') || lower.includes('three sum') || lower.includes('triplet')) {
    return LEETCODE_PROBLEMS[15];
  }
  if (lower.includes('two sum') || lower.includes('twosum')) {
    return LEETCODE_PROBLEMS[1];
  }
  if (lower.includes('rain water') || lower.includes('trapping rain') || lower.includes('trap')) {
    return LEETCODE_PROBLEMS[42];
  }
  if (lower.includes('longest substring') || lower.includes('without repeating') || lower.includes('lengthoflongestsubstring')) {
    return LEETCODE_PROBLEMS[3];
  }
  if (lower.includes('maximum subarray') || lower.includes('kadane') || lower.includes('maxsubarray')) {
    return LEETCODE_PROBLEMS[53];
  }
  if (lower.includes('container with most water') || lower.includes('maxarea')) {
    return LEETCODE_PROBLEMS[11];
  }

  return null;
}
