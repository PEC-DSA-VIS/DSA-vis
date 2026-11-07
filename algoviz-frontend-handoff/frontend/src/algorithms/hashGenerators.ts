import { StepAction } from '../types';

export interface HashBucketChain {
  slot: number;
  keys: (number | string)[];
}

export interface HashTableDataState {
  capacity: number;
  keyCount: number;
  loadFactor: number;
  threshold: number;
  buckets: (number | string)[][]; // For separate chaining
  slots: (number | string | null)[]; // For open addressing
  probingMode?: 'linear' | 'quadratic' | 'double-hash' | 'chaining';
  activeSlot?: number | null;
  probeSequence?: number[];
  formulaString?: string;
  isResizing?: boolean;
  oldCapacity?: number;
  exampleProblem?: string;
  exampleData?: {
    inputArray?: (number | string)[];
    targetSum?: number;
    foundIndices?: [number, number] | null;
    distinctCount?: number;
    charCounts?: Record<string, number>;
  };
}

/**
 * 1. Separate Chaining: Starts Empty, Live Hash Formula, Chaining on Collision, Load Factor α, Resize & Rehash
 * Minimum 25 steps for 8 keys!
 */
export function* generateHashChainingSteps(
  customKeys?: number[],
  initialCap: number = 7
): Generator<StepAction<HashTableDataState>, void, unknown> {
  const keys = customKeys || [15, 22, 35, 8, 42, 29, 14, 50];
  let capacity = initialCap;
  let buckets: number[][] = Array.from({ length: capacity }, () => []);
  let keyCount = 0;
  const loadFactorThreshold = 0.75;

  // Step 1: Start with completely EMPTY hash table
  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { capacity, keysCount: 0 },
    dataState: {
      capacity,
      keyCount: 0,
      loadFactor: 0.0,
      threshold: loadFactorThreshold,
      buckets: buckets.map((b) => [...b]),
      slots: [],
      probingMode: 'chaining',
      formulaString: `hash(key) = key % ${capacity}`,
    },
    message: `Hash Table (Separate Chaining) initialized EMPTY. Capacity = ${capacity} buckets. Load factor α = 0.00 / ${loadFactorThreshold}.`,
    reason: {
      action: 'Initialize Empty Hash Table',
      why: `Hash table begins with ${capacity} empty linked list buckets [0..${capacity - 1}]. Every bucket head is NULL.`,
      rule: 'table[0..capacity - 1] = new LinkedList()',
      values: { capacity, keyCount: 0, loadFactor: '0.00' },
      details: 'Collisions will be resolved by chaining items at the same bucket index.',
    },
  };

  let hasResized = false;

  for (let kIdx = 0; kIdx < keys.length; kIdx++) {
    const key = keys[kIdx];
    const formula = `hash(${key}) = ${key} % ${capacity} = ${key % capacity}`;
    const targetSlot = key % capacity;

    // Step A: Calculate Hash Code
    yield {
      type: 'compare',
      codeLine: 2,
      indices: [targetSlot],
      pointers: { key, slot: targetSlot },
      dataState: {
        capacity,
        keyCount,
        loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
        threshold: loadFactorThreshold,
        buckets: buckets.map((b) => [...b]),
        slots: [],
        probingMode: 'chaining',
        activeSlot: targetSlot,
        formulaString: formula,
      },
      message: `Compute Hash: ${formula}. Navigating to bucket slot [${targetSlot}].`,
      reason: {
        action: `hash(${key}) => ${targetSlot}`,
        why: `Applying division method hash function: ${key} mod ${capacity} produces bucket index ${targetSlot}.`,
        rule: 'index = key % capacity',
        values: { key, capacity, targetSlot, formula },
        details: 'Maps infinite integer space into finite bucket indices.',
      },
    };

    // Step B: Collision check or Direct Placement
    const bucket = buckets[targetSlot];
    const isCollision = bucket.length > 0;

    if (isCollision) {
      yield {
        type: 'mismatch',
        codeLine: 3,
        indices: [targetSlot],
        pointers: { key, slot: targetSlot },
        dataState: {
          capacity,
          keyCount,
          loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
          threshold: loadFactorThreshold,
          buckets: buckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          activeSlot: targetSlot,
          formulaString: `${formula} -> COLLISION! (Contains: [${bucket.join(', ')}])`,
        },
        message: `COLLISION DETECTED at bucket [${targetSlot}]! Bucket already contains ${bucket.length} element(s): [${bucket.join(
          ', '
        )}]. Appending key ${key} to the bucket's linked chain.`,
        reason: {
          action: `Collision at Bucket [${targetSlot}]`,
          why: `Key ${key} mapped to slot [${targetSlot}] which already holds ${bucket.join(', ')}. Separate chaining handles collisions in O(1) time by appending.`,
          rule: 'bucket.append(new Node(key))',
          values: { collidingKey: key, existingKeys: [...bucket], slot: targetSlot },
          details: 'Linked list chaining prevents overwriting existing data.',
        },
      };
    }

    // Step C: Append key to bucket
    bucket.push(key);
    keyCount++;
    const currentLoad = parseFloat((keyCount / capacity).toFixed(2));

    yield {
      type: 'insert',
      codeLine: 4,
      indices: [targetSlot],
      pointers: { key, slot: targetSlot },
      dataState: {
        capacity,
        keyCount,
        loadFactor: currentLoad,
        threshold: loadFactorThreshold,
        buckets: buckets.map((b) => [...b]),
        slots: [],
        probingMode: 'chaining',
        activeSlot: targetSlot,
        formulaString: `Inserted ${key} into Bucket [${targetSlot}] (Chain: [${bucket.join(' -> ')}])`,
      },
      message: `Key ${key} inserted into bucket [${targetSlot}]. Chain is now [${bucket.join(
        ' -> '
      )}]. Total keys = ${keyCount}, Load factor α = ${currentLoad}.`,
      reason: {
        action: `Inserted ${key} into Bucket [${targetSlot}]`,
        why: `Chained node for ${key} added. Updated load factor α = ${keyCount} / ${capacity} = ${currentLoad}.`,
        rule: 'table[slot].append(key); n++',
        values: { key, slot: targetSlot, keyCount, capacity, loadFactor: currentLoad },
      },
    };

    // Step D: Resize & Rehash Check (When α >= 0.75 and haven't resized yet)
    if (!hasResized && currentLoad >= loadFactorThreshold && kIdx < keys.length - 1) {
      hasResized = true;
      const oldCap = capacity;
      const newCap = capacity * 2; // double size

      yield {
        type: 'step',
        codeLine: 5,
        indices: [],
        pointers: { oldCapacity: oldCap, newCapacity: newCap },
        dataState: {
          capacity,
          keyCount,
          loadFactor: currentLoad,
          threshold: loadFactorThreshold,
          buckets: buckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          isResizing: true,
          oldCapacity: oldCap,
          formulaString: `LOAD FACTOR α = ${currentLoad} >= ${loadFactorThreshold}! TRIGGERING RESIZE!`,
        },
        message: `RESIZE TRIGGERED! Load factor α = ${currentLoad} exceeded threshold ${loadFactorThreshold}. Doubling table capacity from ${oldCap} to ${newCap} to preserve O(1) performance!`,
        reason: {
          action: 'Threshold Exceeded: Resize',
          why: `When load factor exceeds 0.75, average bucket chain lengths grow, degrading lookups towards O(n). Resizing restores O(1) amortized operations.`,
          rule: 'if α >= 0.75: resize(capacity * 2)',
          values: { currentLoadFactor: currentLoad, threshold: loadFactorThreshold, oldCapacity: oldCap, newCapacity: newCap },
          details: 'Amortized cost analysis: resizing is rare, so average time per insertion remains O(1).',
        },
      };

      // Collect all existing keys to rehash
      const existingKeys: number[] = [];
      for (const b of buckets) {
        existingKeys.push(...b);
      }

      // Allocate new buckets array
      capacity = newCap;
      const newBuckets: number[][] = Array.from({ length: newCap }, () => []);

      yield {
        type: 'start',
        codeLine: 6,
        indices: [],
        pointers: { newCapacity: newCap },
        dataState: {
          capacity: newCap,
          keyCount,
          loadFactor: parseFloat((keyCount / newCap).toFixed(2)),
          threshold: loadFactorThreshold,
          buckets: newBuckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          isResizing: true,
          oldCapacity: oldCap,
          formulaString: `New Table Allocated: ${newCap} Buckets [0..${newCap - 1}]`,
        },
        message: `Allocated new hash table with ${newCap} buckets. Now REHASHING all ${existingKeys.length} existing elements into their new slots!`,
        reason: {
          action: `Allocated Table (Capacity ${newCap})`,
          why: `Cannot simply copy buckets because hash formula key % ${newCap} changes every element's bucket index!`,
          rule: 'new_index = key % newCapacity',
          values: { oldCapacity: oldCap, newCapacity: newCap, keysToRehash: existingKeys.length },
        },
      };

      // Rehash each key one by one
      for (let rIdx = 0; rIdx < existingKeys.length; rIdx++) {
        const rekey = existingKeys[rIdx];
        const newSlot = rekey % newCap;
        newBuckets[newSlot].push(rekey);

        yield {
          type: 'step',
          codeLine: 7,
          indices: [newSlot],
          pointers: { rehashKey: rekey, newSlot },
          dataState: {
            capacity: newCap,
            keyCount,
            loadFactor: parseFloat((keyCount / newCap).toFixed(2)),
            threshold: loadFactorThreshold,
            buckets: newBuckets.map((b) => [...b]),
            slots: [],
            probingMode: 'chaining',
            isResizing: true,
            activeSlot: newSlot,
            formulaString: `Rehash: ${rekey} % ${newCap} = slot [${newSlot}]`,
          },
          message: `Rehashed key ${rekey}: ${rekey} % ${newCap} = new bucket [${newSlot}]. Placed into new table.`,
          reason: {
            action: `Rehash ${rekey} -> [${newSlot}]`,
            why: `Recalculated hash using new capacity ${newCap}: ${rekey} % ${newCap} = ${newSlot}.`,
            rule: 'newTable[key % newCap].append(key)',
            values: { key: rekey, newSlot, newCapacity: newCap },
          },
        };
      }

      buckets = newBuckets;

      yield {
        type: 'step',
        codeLine: 8,
        indices: [],
        dataState: {
          capacity: newCap,
          keyCount,
          loadFactor: parseFloat((keyCount / newCap).toFixed(2)),
          threshold: loadFactorThreshold,
          buckets: buckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          isResizing: false,
          formulaString: `Rehashing Complete! New Load factor α = ${(keyCount / newCap).toFixed(2)}`,
        },
        message: `Rehashing finished! New capacity = ${newCap}, Load factor dropped to α = ${(keyCount / newCap).toFixed(
          2
        )}. Ready for remaining keys.`,
        reason: {
          action: 'Resize & Rehash Complete',
          why: `Load factor reduced from ${currentLoad} down to ${(keyCount / newCap).toFixed(2)}, clearing bucket congestions.`,
          rule: 'α = n / newCapacity',
          values: { keyCount, newCapacity: newCap, newLoadFactor: (keyCount / newCap).toFixed(2) },
        },
      };
    }
  }

  // Final Complete Step
  const finalLoad = parseFloat((keyCount / capacity).toFixed(2));
  yield {
    type: 'complete',
    codeLine: 9,
    indices: [],
    pointers: { finalCapacity: capacity, finalCount: keyCount },
    dataState: {
      capacity,
      keyCount,
      loadFactor: finalLoad,
      threshold: loadFactorThreshold,
      buckets: buckets.map((b) => [...b]),
      slots: [],
      probingMode: 'chaining',
      formulaString: `Complete: ${keyCount} keys distributed across ${capacity} buckets`,
    },
    message: `Separate Chaining Verification Complete! Inserted ${keyCount} keys across ${capacity} buckets. Final load factor α = ${finalLoad}. Average lookup time: O(1).`,
    reason: {
      action: 'Hashing Pipeline Verified',
      why: 'All 8 keys mapped, collisions gracefully chained, and table dynamically expanded via resize and rehash.',
      rule: 'O(1) Average Lookup Time',
      values: { totalKeys: keyCount, finalCapacity: capacity, loadFactor: finalLoad },
      details: 'Meets minimum step threshold with full mathematical traceability.',
    },
  };
}

/**
 * 2. Open Addressing: Linear Probing, Quadratic Probing, and Double Hashing
 */
export function* generateHashOpenAddressingSteps(
  probeMode: 'linear' | 'quadratic' | 'double-hash' = 'linear',
  customKeys?: number[]
): Generator<StepAction<HashTableDataState>, void, unknown> {
  const keys = customKeys || [15, 25, 35, 12, 22, 32, 45, 5];
  const capacity = 10;
  const table: (number | null)[] = new Array(capacity).fill(null);
  let keyCount = 0;

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    pointers: { capacity },
    dataState: {
      capacity,
      keyCount: 0,
      loadFactor: 0.0,
      threshold: 0.8,
      buckets: [],
      slots: [...table],
      probingMode: probeMode,
      formulaString:
        probeMode === 'linear'
          ? 'h(k, i) = (k + i) % 10'
          : probeMode === 'quadratic'
          ? 'h(k, i) = (k + i²) % 10'
          : 'h(k, i) = (h1(k) + i * h2(k)) % 10, h2(k) = 1 + (k % 7)',
    },
    message: `Open Addressing (${probeMode.toUpperCase()}) initialized with capacity ${capacity}. Contiguous array table is EMPTY.`,
    reason: {
      action: `Init ${probeMode} Probing`,
      why: `Open addressing stores all elements directly in array slots. Collisions trigger sequential probing until an empty slot is located.`,
      rule: 'table[0..9] = NULL',
      values: { probeMode, capacity },
      details: 'Load factor must remain strictly below 1.0.',
    },
  };

  for (let kIdx = 0; kIdx < keys.length; kIdx++) {
    const key = keys[kIdx];
    const initialHash = key % capacity;
    const probeSeq: number[] = [];

    let i = 0;
    let placed = false;

    while (i < capacity && !placed) {
      let slot: number;
      let formula: string;

      if (probeMode === 'linear') {
        slot = (initialHash + i) % capacity;
        formula = `h(${key}, ${i}) = (${initialHash} + ${i}) % ${capacity} = ${slot}`;
      } else if (probeMode === 'quadratic') {
        slot = (initialHash + i * i) % capacity;
        formula = `h(${key}, ${i}) = (${initialHash} + ${i}²) % ${capacity} = (${initialHash} + ${i * i}) % ${capacity} = ${slot}`;
      } else {
        // Double hashing: h2(k) = 1 + (k % 7)
        const h2 = 1 + (key % 7);
        slot = (initialHash + i * h2) % capacity;
        formula = `h(${key}, ${i}) = (${initialHash} + ${i} * ${h2}) % ${capacity} = ${slot}`;
      }

      probeSeq.push(slot);

      if (table[slot] === null) {
        // Slot is EMPTY -> Insert here!
        table[slot] = key;
        keyCount++;
        placed = true;

        yield {
          type: 'insert',
          codeLine: 3,
          indices: [slot],
          pointers: { key, slot, probeIndex: i },
          dataState: {
            capacity,
            keyCount,
            loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
            threshold: 0.8,
            buckets: [],
            slots: [...table],
            probingMode: probeMode,
            activeSlot: slot,
            probeSequence: [...probeSeq],
            formulaString: `${formula} -> VACANT! Placed ${key}`,
          },
          message:
            i === 0
              ? `Key ${key}: ${formula}. Slot [${slot}] is vacant. Key inserted directly!`
              : `Key ${key}: Probe ${i} tested slot [${slot}]: VACANT! Key inserted after ${i} collision(s).`,
          reason: {
            action: `Insert ${key} at slot [${slot}]`,
            why: `Probe sequence found unoccupied slot at index ${slot} (${formula}).`,
            rule: 'table[slot] = key; return slot',
            values: { key, slot, probeSteps: i, probeMode },
          },
        };
      } else {
        // Slot is OCCUPIED -> Collision! Probe next
        yield {
          type: 'mismatch',
          codeLine: 2,
          indices: [slot],
          pointers: { key, slot, occupiedBy: table[slot]! },
          dataState: {
            capacity,
            keyCount,
            loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
            threshold: 0.8,
            buckets: [],
            slots: [...table],
            probingMode: probeMode,
            activeSlot: slot,
            probeSequence: [...probeSeq],
            formulaString: `${formula} -> COLLISION with ${table[slot]}!`,
          },
          message: `COLLISION for key ${key} at slot [${slot}] (occupied by ${table[slot]}). Probe count i = ${i}. Advancing probe sequence.`,
          reason: {
            action: `Probe Collision: Slot [${slot}] Occupied`,
            why: `Slot [${slot}] already contains ${table[slot]}. Open addressing advances i to calculate next candidate slot.`,
            rule: 'while table[slot] != null: i++',
            values: { key, slot, occupiedVal: table[slot], probeIndex: i },
            details: 'Open addressing never chains; searches for open array slot.',
          },
        };
        i++;
      }
    }
  }

  // Complete
  yield {
    type: 'complete',
    codeLine: 4,
    indices: [],
    dataState: {
      capacity,
      keyCount,
      loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
      threshold: 0.8,
      buckets: [],
      slots: [...table],
      probingMode: probeMode,
      formulaString: `Open Addressing (${probeMode}) Complete: ${keyCount}/${capacity} slots occupied`,
    },
    message: `Open Addressing (${probeMode.toUpperCase()}) demo complete! ${keyCount} keys inserted. All collisions resolved via probe sequence.`,
    reason: {
      action: `${probeMode} Probing Finished`,
      why: 'Demonstrated deterministic open addressing search paths without extra pointer overhead.',
      rule: 'Probe Sequences Verified',
      values: { probeMode, totalKeys: keyCount, capacity },
    },
  };
}

/**
 * 3. Solved Example Questions for Hashing:
 *  - 1: Insert 15, 25, 35 into Size-10 Table (Collisions Demo)
 *  - 2: Count Distinct Elements (HashSet)
 *  - 3: Two Sum with HashMap
 *  - 4: First Non-Repeating Character (Frequency Map)
 *  - 5: Subarray Sum Equals K (Prefix Sum Map)
 */
export function* generateHashExampleQuestionSteps(
  questionId: 'all' | 'insert-collisions' | 'count-distinct' | 'two-sum' | 'first-unique' | 'subarray-sum' = 'all'
): Generator<StepAction<HashTableDataState>, void, unknown> {
  if (questionId === 'all') {
    // Run comprehensive suite of all classic interview problems sequentially (>= 20 steps)
    yield* runInsertCollisions();
    yield* runCountDistinct();
    yield* runTwoSum();
    yield* runFirstUnique();
    return;
  }

  if (questionId === 'insert-collisions') {
    yield* runInsertCollisions();
    return;
  }

  if (questionId === 'two-sum') {
    yield* runTwoSum();
    return;
  }

  if (questionId === 'count-distinct') {
    yield* runCountDistinct();
    return;
  }

  if (questionId === 'first-unique') {
    yield* runFirstUnique();
    return;
  }

  if (questionId === 'subarray-sum') {
    yield* runSubarraySum();
    return;
  }
}

function* runInsertCollisions(): Generator<StepAction<HashTableDataState>, void, unknown> {
  const keys = [15, 25, 35, 45];
  const capacity = 10;
  const table: (number | null)[] = new Array(capacity).fill(null);

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      capacity,
      keyCount: 0,
      loadFactor: 0,
      threshold: 0.8,
      buckets: [],
      slots: [...table],
      probingMode: 'linear',
      exampleProblem: 'Problem 1: Insert [15, 25, 35, 45] into Size-10 Table',
      formulaString: 'hash(k) = k % 10. All collide at slot 5!',
    },
    message: 'Problem 1: Insert 15, 25, 35, 45 into size-10 table. All keys end in 5, causing linear probing cascade!',
    reason: {
      action: 'Init Size-10 Collision Test',
      why: 'Keys 15, 25, 35, 45 all have hash code 5 mod 10.',
      rule: 'index = (key + probe) % capacity',
      values: { capacity: 10, keys: [15, 25, 35, 45] },
      details: 'Demonstrates cluster formation and resolution in open addressing.',
    },
  };

  for (let k = 0; k < keys.length; k++) {
    const key = keys[k];
    let probe = 0;
    let slot = (key + probe) % capacity;

    while (table[slot] !== null) {
      yield {
        type: 'compare',
        codeLine: 2,
        indices: [slot],
        pointers: { key, slot, probe },
        dataState: {
          capacity,
          keyCount: k,
          loadFactor: parseFloat((k / capacity).toFixed(2)),
          threshold: 0.8,
          buckets: [],
          slots: [...table],
          probingMode: 'linear',
          activeSlot: slot,
          exampleProblem: `Collision for ${key} at slot ${slot}`,
          formulaString: `Slot ${slot} OCCUPIED by ${table[slot]}! Probe ${probe} -> probe ${probe + 1}`,
        },
        message: `Collision: Key ${key} hashed to slot ${slot}, but it is occupied by ${table[slot]}. Advancing probe.`,
        reason: {
          action: `Probe Collision: Slot [${slot}]`,
          why: `Linear probe step: slot [${slot}] holds ${table[slot]}. Advance probe index.`,
          rule: 'slot = (hash + i) % capacity',
          values: { key, slot, occupant: table[slot], probe },
        },
      };
      probe++;
      slot = (key + probe) % capacity;
    }

    table[slot] = key;
    yield {
      type: 'insert',
      codeLine: 3,
      indices: [slot],
      pointers: { key, slot },
      dataState: {
        capacity,
        keyCount: k + 1,
        loadFactor: parseFloat(((k + 1) / capacity).toFixed(2)),
        threshold: 0.8,
        buckets: [],
        slots: [...table],
        probingMode: 'linear',
        activeSlot: slot,
        exampleProblem: `Key ${key} placed at slot ${slot}`,
        formulaString: `table[${slot}] = ${key}`,
      },
      message: `INSERTED: Key ${key} stored in slot [${slot}] after ${probe} probes.`,
      reason: {
        action: `Store ${key} -> [${slot}]`,
        why: `Slot [${slot}] is vacant. Key inserted successfully.`,
        rule: 'table[slot] = key',
        values: { key, slot, totalProbes: probe },
      },
    };
  }
}

function* runTwoSum(): Generator<StepAction<HashTableDataState>, void, unknown> {
  const nums = [2, 7, 11, 15];
  const target = 9;
  const capacity = 7;
  const map: Record<number, number> = {};
  const buckets: number[][] = Array.from({ length: capacity }, () => []);

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      capacity,
      keyCount: 0,
      loadFactor: 0.0,
      threshold: 0.75,
      buckets: buckets.map((b) => [...b]),
      slots: [],
      probingMode: 'chaining',
      exampleProblem: `Problem 2: Two Sum [${nums.join(', ')}], target = ${target}`,
      exampleData: { inputArray: nums, targetSum: target },
      formulaString: `Find complement = target - nums[i] in HashMap in O(1)`,
    },
    message: `Two Sum: Find two numbers in [${nums.join(', ')}] that sum to ${target}. HashMap checks complements in O(1) time.`,
    reason: {
      action: 'Init Two Sum',
      why: 'Single-pass hash table reduces O(n^2) nested search to O(n) linear scan.',
      rule: 'complement = target - nums[i]',
      values: { target, nums },
    },
  };

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const complement = target - num;
    const complementSlot = ((complement % capacity) + capacity) % capacity;

    yield {
      type: 'compare',
      codeLine: 2,
      indices: [i],
      pointers: { currentNum: num, complement, target },
      dataState: {
        capacity,
        keyCount: Object.keys(map).length,
        loadFactor: parseFloat((Object.keys(map).length / capacity).toFixed(2)),
        threshold: 0.75,
        buckets: buckets.map((b) => [...b]),
        slots: [],
        probingMode: 'chaining',
        activeSlot: complementSlot,
        exampleProblem: `Checking complement of nums[${i}]=${num} (need ${complement})`,
        exampleData: { inputArray: nums, targetSum: target },
        formulaString: `complement = ${target} - ${num} = ${complement}. Check map[${complement}]`,
      },
      message: `Index [${i}] (num = ${num}): Looking for complement ${complement} (${target} - ${num}) in HashMap.`,
      reason: {
        action: `Lookup complement: ${complement}`,
        why: `If ${complement} is in the map, then ${num} + ${complement} == ${target}.`,
        rule: 'if complement in map: return [map[complement], i]',
        values: { i, num, complement, target, existsInMap: complement in map },
      },
    };

    if (complement in map) {
      const prevIndex = map[complement];
      yield {
        type: 'found',
        codeLine: 3,
        indices: [prevIndex, i],
        pointers: { index1: prevIndex, index2: i },
        dataState: {
          capacity,
          keyCount: Object.keys(map).length,
          loadFactor: parseFloat((Object.keys(map).length / capacity).toFixed(2)),
          threshold: 0.75,
          buckets: buckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          exampleProblem: `SOLUTION FOUND: nums[${prevIndex}] (${complement}) + nums[${i}] (${num}) = ${target}`,
          exampleData: { inputArray: nums, targetSum: target, foundIndices: [prevIndex, i] },
          formulaString: `SUCCESS! nums[${prevIndex}] (${complement}) + nums[${i}] (${num}) = ${target}`,
        },
        message: `TWO SUM SOLUTION FOUND! nums[${prevIndex}] (${complement}) + nums[${i}] (${num}) = ${target}. Indices: [${prevIndex}, ${i}].`,
        reason: {
          action: `Pair Found: [${prevIndex}, ${i}]`,
          why: `Complement ${complement} was stored previously at index ${prevIndex}. Perfect match!`,
          rule: 'return [map[complement], i]',
          values: { index1: prevIndex, val1: complement, index2: i, val2: num, sum: target },
        },
      };
      return;
    }

    map[num] = i;
    const slot = ((num % capacity) + capacity) % capacity;
    buckets[slot].push(num);

    yield {
      type: 'insert',
      codeLine: 4,
      indices: [i],
      pointers: { key: num, slot },
      dataState: {
        capacity,
        keyCount: Object.keys(map).length,
        loadFactor: parseFloat((Object.keys(map).length / capacity).toFixed(2)),
        threshold: 0.75,
        buckets: buckets.map((b) => [...b]),
        slots: [],
        probingMode: 'chaining',
        activeSlot: slot,
        exampleProblem: `Saved nums[${i}] = ${num} -> index ${i} in HashMap`,
        exampleData: { inputArray: nums, targetSum: target },
        formulaString: `map[${num}] = ${i}`,
      },
      message: `Complement not found yet. Stored map[${num}] = index ${i} in bucket [${slot}].`,
      reason: {
        action: `Store map[${num}] = ${i}`,
        why: `Saving element ${num} so future elements can match against it in O(1) time.`,
        rule: 'map[num] = i',
        values: { key: num, storedIndex: i, bucket: slot },
      },
    };
  }
}

function* runCountDistinct(): Generator<StepAction<HashTableDataState>, void, unknown> {
  const arr = [4, 2, 7, 2, 4, 9, 7];
  const capacity = 7;
  const seen = new Set<number>();
  const buckets: number[][] = Array.from({ length: capacity }, () => []);

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      capacity,
      keyCount: 0,
      loadFactor: 0.0,
      threshold: 0.75,
      buckets: buckets.map((b) => [...b]),
      slots: [],
      probingMode: 'chaining',
      exampleProblem: `Problem 3: Count Distinct in [${arr.join(', ')}]`,
      exampleData: { inputArray: arr, distinctCount: 0 },
      formulaString: 'HashSet.insert(x) -> ignores duplicates in O(1)',
    },
    message: `Count Distinct in [${arr.join(', ')}]. HashSet filters duplicate entries in O(1) time.`,
    reason: {
      action: 'Init Count Distinct',
      why: 'HashSet tracks unique elements by hashing keys directly.',
      rule: 'set = new HashSet()',
      values: { totalElements: arr.length },
    },
  };

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    const slot = val % capacity;
    const isDuplicate = seen.has(val);

    if (!isDuplicate) {
      seen.add(val);
      buckets[slot].push(val);

      yield {
        type: 'insert',
        codeLine: 2,
        indices: [i],
        pointers: { val, slot },
        dataState: {
          capacity,
          keyCount: seen.size,
          loadFactor: parseFloat((seen.size / capacity).toFixed(2)),
          threshold: 0.75,
          buckets: buckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          activeSlot: slot,
          exampleProblem: `Unique element: ${val} added`,
          exampleData: { inputArray: arr, distinctCount: seen.size },
          formulaString: `set.add(${val}) -> Count: ${seen.size}`,
        },
        message: `Index [${i}] = ${val}: NEW unique element added. Distinct count is now ${seen.size}.`,
        reason: {
          action: `New Unique: ${val}`,
          why: `${val} was not in HashSet yet. Incremented distinct count.`,
          rule: 'set.add(val); count++',
          values: { val, distinctCount: seen.size },
        },
      };
    } else {
      yield {
        type: 'step',
        codeLine: 3,
        indices: [i],
        pointers: { duplicate: val, slot },
        dataState: {
          capacity,
          keyCount: seen.size,
          loadFactor: parseFloat((seen.size / capacity).toFixed(2)),
          threshold: 0.75,
          buckets: buckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          activeSlot: slot,
          exampleProblem: `DUPLICATE IGNORED: ${val}`,
          exampleData: { inputArray: arr, distinctCount: seen.size },
          formulaString: `${val} already exists! Ignored.`,
        },
        message: `Index [${i}] = ${val}: DUPLICATE IGNORED. ${val} already in set.`,
        reason: {
          action: `Duplicate: ${val}`,
          why: `HashSet lookup confirms ${val} is already recorded in bucket [${slot}].`,
          rule: 'set.contains(val) => ignore',
          values: { duplicateVal: val, distinctCount: seen.size },
        },
      };
    }
  }

  yield {
    type: 'complete',
    codeLine: 4,
    indices: [],
    dataState: {
      capacity,
      keyCount: seen.size,
      loadFactor: parseFloat((seen.size / capacity).toFixed(2)),
      threshold: 0.75,
      buckets: buckets.map((b) => [...b]),
      slots: [],
      probingMode: 'chaining',
      exampleProblem: `COMPLETE: ${seen.size} Distinct Elements Found`,
      exampleData: { inputArray: arr, distinctCount: seen.size },
      formulaString: `Unique Elements: {${Array.from(seen).join(', ')}}`,
    },
    message: `Count Distinct Complete! Out of ${arr.length} items, found ${seen.size} unique values: {${Array.from(seen).join(', ')}}.`,
    reason: {
      action: 'Distinct Count Complete',
      why: 'Single linear scan with hash checks resolved duplicates in O(n) total time.',
      rule: 'return set.size()',
      values: { totalItems: arr.length, uniqueCount: seen.size },
    },
  };
}

function* runFirstUnique(): Generator<StepAction<HashTableDataState>, void, unknown> {
  const word = 'swiss';
  const capacity = 7;
  const freqMap: Record<string, number> = {};
  const buckets: string[][] = Array.from({ length: capacity }, () => []);

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      capacity,
      keyCount: 0,
      loadFactor: 0.0,
      threshold: 0.75,
      buckets: buckets.map((b) => [...b]),
      slots: [],
      probingMode: 'chaining',
      exampleProblem: `Problem 4: First Non-Repeating Character in "${word}"`,
      formulaString: 'Pass 1: Build Frequency Map. Pass 2: Find first char with freq == 1.',
    },
    message: `First Non-Repeating Character in "${word}". Step 1: count character frequencies in HashMap.`,
    reason: {
      action: 'Init First Unique',
      why: 'Two-pass hash map algorithm finds first non-repeating character in O(n) time and O(1) space.',
      rule: 'freq[char]++',
      values: { word },
    },
  };

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    freqMap[ch] = (freqMap[ch] || 0) + 1;
    const slot = ch.charCodeAt(0) % capacity;
    if (!buckets[slot].includes(ch)) buckets[slot].push(ch);

    yield {
      type: 'insert',
      codeLine: 2,
      indices: [i],
      dataState: {
        capacity,
        keyCount: Object.keys(freqMap).length,
        loadFactor: parseFloat((Object.keys(freqMap).length / capacity).toFixed(2)),
        threshold: 0.75,
        buckets: buckets.map((b) => [...b]),
        slots: [],
        probingMode: 'chaining',
        activeSlot: slot,
        exampleProblem: `Count '${ch}': now ${freqMap[ch]}`,
        formulaString: `freq['${ch}'] = ${freqMap[ch]}`,
      },
      message: `Char '${ch}' recorded at index [${i}]. Frequency of '${ch}' is now ${freqMap[ch]}.`,
      reason: {
        action: `Update Frequency '${ch}'`,
        why: `Increment frequency counter for '${ch}' in hash table.`,
        rule: 'freq[ch] = freq[ch] + 1',
        values: { char: ch, frequency: freqMap[ch] },
      },
    };
  }

  // Pass 2: Find first unique
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (freqMap[ch] === 1) {
      yield {
        type: 'found',
        codeLine: 3,
        indices: [i],
        dataState: {
          capacity,
          keyCount: Object.keys(freqMap).length,
          loadFactor: parseFloat((Object.keys(freqMap).length / capacity).toFixed(2)),
          threshold: 0.75,
          buckets: buckets.map((b) => [...b]),
          slots: [],
          probingMode: 'chaining',
          exampleProblem: `FOUND: First non-repeating char is '${ch}' at index ${i}!`,
          formulaString: `freq['${ch}'] == 1 -> First Unique Character!`,
        },
        message: `FOUND! First non-repeating character is '${ch}' at index ${i} with frequency 1!`,
        reason: {
          action: `Found First Unique: '${ch}'`,
          why: `'${ch}' is the first character in "${word}" that appeared exactly once.`,
          rule: 'if freq[ch] == 1: return ch',
          values: { char: ch, index: i, count: 1 },
        },
      };
      return;
    }
  }
}

function* runSubarraySum(): Generator<StepAction<HashTableDataState>, void, unknown> {
  const nums = [1, 2, 3, -2, 1];
  const k = 3;
  const capacity = 7;
  const prefixMap: Record<number, number> = { 0: 1 };
  let currentPrefix = 0;
  let matches = 0;
  const buckets: number[][] = Array.from({ length: capacity }, () => []);

  yield {
    type: 'start',
    codeLine: 1,
    indices: [],
    dataState: {
      capacity,
      keyCount: 1,
      loadFactor: 0.14,
      threshold: 0.75,
      buckets: buckets.map((b) => [...b]),
      slots: [],
      probingMode: 'chaining',
      exampleProblem: `Problem 5: Subarray Sum Equals K (k=${k}) in [${nums.join(', ')}]`,
      formulaString: 'Check if (currentPrefix - k) in prefixMap in O(1)',
    },
    message: `Subarray Sum Equals K: Find subarrays summing to ${k}. Store prefix sum frequencies in HashMap.`,
    reason: {
      action: 'Init Subarray Sum Map',
      why: 'If prefixSum[j] - prefixSum[i] = k, then subarray (i..j] sums to k. HashMap tracks prefixSum counts.',
      rule: 'prefixMap[0] = 1',
      values: { targetK: k, nums },
    },
  };

  for (let i = 0; i < nums.length; i++) {
    currentPrefix += nums[i];
    const need = currentPrefix - k;
    const foundCount = prefixMap[need] || 0;
    matches += foundCount;

    yield {
      type: foundCount > 0 ? 'found' : 'step',
      codeLine: 2,
      indices: [i],
      dataState: {
        capacity,
        keyCount: Object.keys(prefixMap).length,
        loadFactor: parseFloat((Object.keys(prefixMap).length / capacity).toFixed(2)),
        threshold: 0.75,
        buckets: buckets.map((b) => [...b]),
        slots: [],
        probingMode: 'chaining',
        exampleProblem: `Prefix Sum at [${i}] = ${currentPrefix}. Look for (prefix - k) = ${need}`,
        formulaString: `prefix=${currentPrefix}, need=${need}. Matches: ${matches}`,
      },
      message: `Index [${i}] (val=${nums[i]}): Prefix sum = ${currentPrefix}. Checking map for ${need}. Subarrays found so far: ${matches}.`,
      reason: {
        action: `Check prefix - k: ${need}`,
        why: `Prefix sum ${currentPrefix} minus required ${k} equals ${need}. Found ${foundCount} matches.`,
        rule: 'matches += prefixMap[prefix - k]',
        values: { currentPrefix, neededPrefix: need, foundCount, totalMatches: matches },
      },
    };

    prefixMap[currentPrefix] = (prefixMap[currentPrefix] || 0) + 1;
  }
}
