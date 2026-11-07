import { StepAction } from '../types';

export interface BitManipulationData {
  a: number;
  b?: number;
  operation: string;
  activeBitIndex: number | null; // 0 to 7 (where 0 is LSB)
  computedBits: number[]; // indices of bits that have been computed so far
  result: number;
  setBitsCount?: number;
  kernighanStep?: number;
  explanationNote?: string;
}

export function* generateBitManipulationSteps(
  inputA: number = 25,
  inputB: number = 14
): Generator<StepAction<BitManipulationData>, void, unknown> {
  const a = inputA;
  const b = inputB;

  // Step 0: Initial Registers
  yield {
    type: 'start',
    codeLine: 1,
    bitIndex: null,
    dataState: {
      a,
      b,
      operation: 'AND (&)',
      activeBitIndex: null,
      computedBits: [],
      result: 0,
    },
    message: `Initialized 8-bit registers: A = ${a} (${a.toString(2).padStart(8, '0')}), B = ${b} (${b.toString(2).padStart(8, '0')}).`,
    reason: {
      action: 'Init Registers',
      why: `Load operands A=${a} and B=${b} into CPU binary registers.`,
      rule: 'Register allocation',
      values: { a, b, binA: a.toString(2).padStart(8, '0'), binB: b.toString(2).padStart(8, '0') },
      details: 'Bitwise operations evaluate corresponding bit positions in parallel hardware pipelines.',
    },
  };

  // 1. Bitwise AND: Bit by Bit (bit 0 to 7)
  let andResult = 0;
  const andComputed: number[] = [];

  for (let bit = 0; bit < 8; bit++) {
    const bitA = (a >> bit) & 1;
    const bitB = (b >> bit) & 1;
    const resBit = bitA & bitB;
    if (resBit === 1) andResult |= (1 << bit);
    andComputed.push(bit);

    yield {
      type: 'bit-toggle',
      codeLine: 1,
      bitIndex: bit,
      dataState: {
        a,
        b,
        operation: 'AND (&)',
        activeBitIndex: bit,
        computedBits: [...andComputed],
        result: andResult,
        explanationNote: `Bit ${bit} (weight 2^${bit}=${1 << bit}): ${bitA} & ${bitB} = ${resBit}`,
      },
      message: `Bit ${bit}: A[${bit}]=${bitA}, B[${bit}]=${bitB} => Result bit = ${resBit} (${bitA === 1 && bitB === 1 ? 'Both 1' : 'Zeroed'}).`,
      reason: {
        action: `AND at Bit ${bit}`,
        why: `${bitA} AND ${bitB} evaluates to ${resBit}. A bit is 1 only when BOTH operands have 1.`,
        rule: 'bitA & bitB',
        values: { bit, bitA, bitB, resultBit: resBit },
        details: 'Evaluated according to standard binary truth table.',
      },
    };
  }

  // 2. Bitwise OR: Bit by Bit (bit 0 to 7)
  let orResult = 0;
  const orComputed: number[] = [];

  for (let bit = 0; bit < 8; bit++) {
    const bitA = (a >> bit) & 1;
    const bitB = (b >> bit) & 1;
    const resBit = bitA | bitB;
    if (resBit === 1) orResult |= (1 << bit);
    orComputed.push(bit);

    yield {
      type: 'bit-toggle',
      codeLine: 2,
      bitIndex: bit,
      dataState: {
        a,
        b,
        operation: 'OR (|)',
        activeBitIndex: bit,
        computedBits: [...orComputed],
        result: orResult,
        explanationNote: `Bit ${bit} (weight 2^${bit}=${1 << bit}): ${bitA} | ${bitB} = ${resBit}`,
      },
      message: `Bit ${bit}: A[${bit}]=${bitA}, B[${bit}]=${bitB} => OR Result = ${resBit} (${bitA === 1 || bitB === 1 ? 'At least one 1' : 'Both 0'}).`,
      reason: {
        action: `OR at Bit ${bit}`,
        why: `${bitA} OR ${bitB} evaluates to ${resBit}. A bit is 1 if EITHER operand has 1.`,
        rule: 'bitA | bitB',
        values: { bit, bitA, bitB, resultBit: resBit },
        details: 'Combines flag bits from both registers.',
      },
    };
  }

  // 3. Bitwise XOR: Bit by Bit (bit 0 to 7)
  let xorResult = 0;
  const xorComputed: number[] = [];

  for (let bit = 0; bit < 8; bit++) {
    const bitA = (a >> bit) & 1;
    const bitB = (b >> bit) & 1;
    const resBit = bitA ^ bitB;
    if (resBit === 1) xorResult |= (1 << bit);
    xorComputed.push(bit);

    yield {
      type: 'bit-toggle',
      codeLine: 3,
      bitIndex: bit,
      dataState: {
        a,
        b,
        operation: 'XOR (^)',
        activeBitIndex: bit,
        computedBits: [...xorComputed],
        result: xorResult,
        explanationNote: `Bit ${bit} (weight 2^${bit}=${1 << bit}): ${bitA} ^ ${bitB} = ${resBit}`,
      },
      message: `Bit ${bit}: A[${bit}]=${bitA}, B[${bit}]=${bitB} => XOR Result = ${resBit} (${bitA !== bitB ? 'Bits differ' : 'Bits match'}).`,
      reason: {
        action: `XOR at Bit ${bit}`,
        why: `${bitA} XOR ${bitB} evaluates to ${resBit}. 1 when bits differ, 0 when they match.`,
        rule: 'bitA ^ bitB',
        values: { bit, bitA, bitB, resultBit: resBit },
        details: 'Self-inverse property: x ^ x = 0; x ^ 0 = x.',
      },
    };
  }

  // 4. Shifts
  const leftShift = (a << 1) & 0xff;
  yield {
    type: 'step',
    codeLine: 3,
    bitIndex: null,
    dataState: {
      a,
      b: 1,
      operation: 'LEFT SHIFT (A << 1)',
      activeBitIndex: null,
      computedBits: [0, 1, 2, 3, 4, 5, 6, 7],
      result: leftShift,
      explanationNote: `A << 1: ${a} * 2 = ${leftShift} (All bits moved left, 0 filled at LSB)`,
    },
    message: `Left Shift (A << 1): ${a} << 1 = ${leftShift}. Equivalent to multiplying by 2!`,
    reason: {
      action: 'Left Shift << 1',
      why: 'Each bit shifts to the next power of 2 (2^(k+1)). LSB receives 0.',
      rule: 'A << 1 == A * 2',
      values: { original: a, shifted: leftShift },
      details: 'High bit overflows past 8-bit bound if set.',
    },
  };

  const rightShift = a >> 1;
  yield {
    type: 'step',
    codeLine: 3,
    bitIndex: null,
    dataState: {
      a,
      b: 1,
      operation: 'RIGHT SHIFT (A >> 1)',
      activeBitIndex: null,
      computedBits: [0, 1, 2, 3, 4, 5, 6, 7],
      result: rightShift,
      explanationNote: `A >> 1: floor(${a} / 2) = ${rightShift} (All bits moved right, MSB filled with 0)`,
    },
    message: `Right Shift (A >> 1): ${a} >> 1 = ${rightShift}. Equivalent to integer division by 2!`,
    reason: {
      action: 'Right Shift >> 1',
      why: 'Each bit shifts down by one power of 2. LSB is discarded.',
      rule: 'A >> 1 == floor(A / 2)',
      values: { original: a, shifted: rightShift },
      details: 'Logical right shift shifts 0 into the MSB.',
    },
  };

  // 5. Brian Kernighan Set Bits Count: n & (n - 1)
  let nKern = a;
  let setCount = 0;
  let kStep = 0;

  while (nKern > 0) {
    kStep++;
    const nextN = nKern & (nKern - 1);
    setCount++;

    yield {
      type: 'step',
      codeLine: 4,
      bitIndex: null,
      dataState: {
        a: nKern,
        b: nKern - 1,
        operation: `Kernighan (Step ${kStep})`,
        activeBitIndex: null,
        computedBits: [0, 1, 2, 3, 4, 5, 6, 7],
        result: nextN,
        setBitsCount: setCount,
        kernighanStep: kStep,
        explanationNote: `${nKern} & (${nKern - 1}) clears rightmost set bit => ${nextN}`,
      },
      message: `Brian Kernighan Step ${kStep}: ${nKern} & ${nKern - 1} = ${nextN}. Cleared rightmost set bit! (Count = ${setCount}).`,
      reason: {
        action: `Kernighan Clear #${kStep}`,
        why: `Subtracting 1 flips the rightmost 1 and all trailing 0s. Bitwise AND zeros out that rightmost 1.`,
        rule: 'n = n & (n - 1)',
        values: { n: nKern, 'n-1': nKern - 1, nextN, count: setCount },
        details: 'Runs in O(k) time where k is strictly the number of set bits, not 8 cycles!',
      },
    };

    nKern = nextN;
  }

  // 6. Check Parity: Odd / Even
  const isOdd = (a & 1) === 1;
  yield {
    type: 'step',
    codeLine: 4,
    bitIndex: 0,
    dataState: {
      a,
      b: 1,
      operation: 'Odd/Even Test (A & 1)',
      activeBitIndex: 0,
      computedBits: [0],
      result: isOdd ? 1 : 0,
      setBitsCount: setCount,
      explanationNote: `A & 1 = ${a & 1} => ${a} is ${isOdd ? 'ODD' : 'EVEN'}`,
    },
    message: `Odd / Even Check: A & 1 = ${a & 1}. Number ${a} is ${isOdd ? 'ODD (LSB is 1)' : 'EVEN (LSB is 0)'}.`,
    reason: {
      action: 'Check Parity (A & 1)',
      why: 'In binary, only 2^0 (weight 1) is odd. All higher bit weights (2, 4, 8, ...) are even.',
      rule: '(A & 1) == 1 ? Odd : Even',
      values: { a, lsb: a & 1, parity: isOdd ? 'Odd' : 'Even' },
      details: 'Faster than modulo operator `% 2` on hardware.',
    },
  };

  // 7. Complete Summary
  yield {
    type: 'complete',
    codeLine: 4,
    bitIndex: null,
    dataState: {
      a,
      b,
      operation: 'Complete',
      activeBitIndex: null,
      computedBits: [0, 1, 2, 3, 4, 5, 6, 7],
      result: andResult,
      setBitsCount: setCount,
    },
    message: `Bit Manipulation complete! Verified AND, OR, XOR, shifts, parity check, and Kernighan set bits count (${setCount} set bits).`,
    reason: {
      action: 'Bitwise Complete',
      why: 'All fundamental bitwise logic gates and arithmetic optimizations verified.',
      rule: 'CPU hardware ALU operations',
      values: { totalSetBits: setCount },
      details: 'Zero abstraction overhead.',
    },
  };
}
