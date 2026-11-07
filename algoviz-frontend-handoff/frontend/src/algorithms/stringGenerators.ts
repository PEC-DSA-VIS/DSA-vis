import { StepAction } from '../types';

export interface StringData {
  text: string;
  pattern?: string;
  lps?: (number | null)[];
  textPointer: number;
  patPointer?: number;
  patternOffset?: number; // Where the pattern currently starts relative to text (i - j)
  matchIndices?: number[];
  rollingHash?: number;
  patternHash?: number;
  windowStr?: string;
  isMatch?: boolean;
  leftPointer?: number;
  rightPointer?: number;
  phase?: 'lps' | 'search' | 'complete' | 'palindrome' | 'hash';
}

/**
 * 1. KMP: Cell-by-cell LPS table build + pattern sliding with match/mismatch & LPS jumps
 */
export function* generateKMPSteps(
  customText?: string,
  customPattern?: string
): Generator<StepAction<StringData>, void, unknown> {
  const text = (customText || 'ABABDABACDABABCABAB').toUpperCase();
  const pattern = (customPattern || 'ABABCABAB').toUpperCase();
  const m = pattern.length;
  const n = text.length;

  const lps: (number | null)[] = new Array(m).fill(null);
  lps[0] = 0; // lps[0] is always 0

  // Phase 1: Build LPS Table cell by cell
  yield {
    type: 'start',
    codeLine: 1,
    pointers: { i: 1, len: 0 },
    dataState: {
      text,
      pattern,
      lps: [...lps],
      textPointer: 0,
      patPointer: 0,
      patternOffset: 0,
      phase: 'lps',
    },
    message: `Phase 1: Build KMP LPS (Longest Prefix Suffix) table for pattern "${pattern}". lps[0] = 0 by definition.`,
    reason: {
      action: 'Init LPS Build',
      why: `Building prefix table of size ${m}. A single character cannot have a proper prefix/suffix match, so lps[0] = 0.`,
      rule: 'lps[0] = 0, len = 0, i = 1',
      values: { pattern, patternLength: m },
      details: 'LPS stores length of longest proper prefix that is also a suffix for pattern[0..i].',
    },
  };

  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;

      yield {
        type: 'set',
        codeLine: 4,
        pointers: { i, len },
        dataState: {
          text,
          pattern,
          lps: [...lps],
          textPointer: 0,
          patPointer: i,
          patternOffset: 0,
          phase: 'lps',
        },
        message: `LPS[${i}]: pattern[${i}] ('${pattern[i]}') == pattern[${len - 1}] ('${pattern[len - 1]}')! Match extends prefix: lps[${i}] = ${len}.`,
        reason: {
          action: `Set lps[${i}] = ${len}`,
          why: `'${pattern[i]}' matches prefix character '${pattern[len - 1]}'. Longest prefix-suffix length increments to ${len}.`,
          rule: 'pattern[i] == pattern[len] => len++, lps[i] = len',
          values: { i, len, char: pattern[i] },
          details: `Prefix "${pattern.slice(0, len)}" matches suffix of length ${len}.`,
        },
      };

      i++;
    } else {
      if (len !== 0) {
        const prevLen = len;
        len = (lps[len - 1] as number) ?? 0;

        yield {
          type: 'step',
          codeLine: 5,
          pointers: { i, len },
          dataState: {
            text,
            pattern,
            lps: [...lps],
            textPointer: 0,
            patPointer: i,
            patternOffset: 0,
            phase: 'lps',
          },
          message: `LPS Mismatch at i=${i}: pattern[${i}] ('${pattern[i]}') != pattern[${prevLen}] ('${pattern[prevLen]}'). Fall back len to lps[${prevLen - 1}] = ${len}.`,
          reason: {
            action: `LPS Jump: len ${prevLen} -> ${len}`,
            why: `Mismatch encountered; retreat to previous known prefix length lps[${prevLen - 1}] = ${len}.`,
            rule: 'len != 0 => len = lps[len - 1]',
            values: { i, prevLen, newLen: len },
            details: 'Avoids restarting from scratch by checking next shorter common prefix.',
          },
        };
      } else {
        lps[i] = 0;

        yield {
          type: 'set',
          codeLine: 6,
          pointers: { i, len: 0 },
          dataState: {
            text,
            pattern,
            lps: [...lps],
            textPointer: 0,
            patPointer: i,
            patternOffset: 0,
            phase: 'lps',
          },
          message: `LPS[${i}]: pattern[${i}] ('${pattern[i]}') has no common prefix with len=0. Set lps[${i}] = 0.`,
          reason: {
            action: `Set lps[${i}] = 0`,
            why: `No matching prefix found for '${pattern[i]}' even at len=0.`,
            rule: 'len == 0 => lps[i] = 0, i++',
            values: { i, char: pattern[i] },
            details: 'Subproblem prefix-suffix length is zero.',
          },
        };

        i++;
      }
    }
  }

  // Phase 1 complete, transition to search
  yield {
    type: 'step',
    codeLine: 1,
    pointers: { i: 0, j: 0 },
    dataState: {
      text,
      pattern,
      lps: [...lps],
      textPointer: 0,
      patPointer: 0,
      patternOffset: 0,
      phase: 'search',
    },
    message: `Phase 2: LPS table complete: [${lps.join(', ')}]. Beginning sliding pattern search across text.`,
    reason: {
      action: 'Begin KMP Search',
      why: 'LPS preprocessing complete in O(m) time. Text search will run in O(n) without backtracking the text pointer.',
      rule: 'Search phase start',
      values: { lpsTable: lps },
      details: 'Whenever a mismatch occurs, pattern will slide forward using LPS lookup.',
    },
  };

  // Phase 2: Search with Pattern Sliding
  let ti = 0;
  let pj = 0;
  const matchIndices: number[] = [];

  while (ti < n) {
    const patternOffset = ti - pj;

    if (text[ti] === pattern[pj]) {
      yield {
        type: 'compare',
        codeLine: 4,
        indices: [ti],
        pointers: { i: ti, j: pj },
        dataState: {
          text,
          pattern,
          lps: [...lps],
          textPointer: ti,
          patPointer: pj,
          patternOffset,
          matchIndices: [...matchIndices],
          isMatch: true,
          phase: 'search',
        },
        message: `Match at text[${ti}] ('${text[ti]}') == pattern[${pj}] ('${pattern[pj]}')! Advance both pointers.`,
        reason: {
          action: `Match: '${text[ti]}' == '${pattern[pj]}'`,
          why: `Character match at text index ${ti} and pattern index ${pj}. Both advance forward.`,
          rule: 'text[i] == pattern[j] => i++, j++',
          values: { textIndex: ti, patternIndex: pj, char: text[ti] },
          details: 'Continuous matching chain intact.',
        },
      };

      ti++;
      pj++;

      if (pj === m) {
        const foundPos = ti - pj;
        matchIndices.push(foundPos);

        yield {
          type: 'found',
          codeLine: 4,
          indices: Array.from({ length: m }, (_, k) => foundPos + k),
          pointers: { i: ti, j: pj },
          dataState: {
            text,
            pattern,
            lps: [...lps],
            textPointer: ti,
            patPointer: pj,
            patternOffset: foundPos,
            matchIndices: [...matchIndices],
            phase: 'search',
          },
          message: `PATTERN FOUND! Full pattern "${pattern}" matched at text index ${foundPos}!`,
          reason: {
            action: `Pattern Matched at ${foundPos}`,
            why: `All ${m} pattern characters matched text[${foundPos}..${foundPos + m - 1}].`,
            rule: 'j == m => Pattern Located!',
            values: { matchIndex: foundPos, pattern },
            details: 'Jumping j using LPS to find potential overlapping subsequent matches.',
          },
        };

        pj = (lps[pj - 1] as number) ?? 0;
      }
    } else {
      // Mismatch
      yield {
        type: 'mismatch',
        codeLine: 5,
        indices: [ti],
        pointers: { i: ti, j: pj },
        dataState: {
          text,
          pattern,
          lps: [...lps],
          textPointer: ti,
          patPointer: pj,
          patternOffset,
          matchIndices: [...matchIndices],
          isMatch: false,
          phase: 'search',
        },
        message: `MISMATCH! text[${ti}] ('${text[ti]}') != pattern[${pj}] ('${pattern[pj]}').`,
        reason: {
          action: `Mismatch: '${text[ti]}' != '${pattern[pj]}'`,
          why: `Mismatch at text index ${ti}. KMP jumps pattern pointer j to lps[${pj - 1}] instead of rewinding text pointer i!`,
          rule: 'text[i] != pattern[j]',
          values: { textIndex: ti, textChar: text[ti], patternIndex: pj, patternChar: pattern[pj] },
          details: 'Key advantage of KMP: text pointer i NEVER moves backward!',
        },
      };

      if (pj !== 0) {
        const oldPj = pj;
        pj = (lps[pj - 1] as number) ?? 0;

        yield {
          type: 'step',
          codeLine: 5,
          pointers: { i: ti, j: pj },
          dataState: {
            text,
            pattern,
            lps: [...lps],
            textPointer: ti,
            patPointer: pj,
            patternOffset: ti - pj,
            matchIndices: [...matchIndices],
            phase: 'search',
          },
          message: `KMP Slide: Jump j from ${oldPj} to lps[${oldPj - 1}] = ${pj}. Pattern shifts right by ${oldPj - pj} slots.`,
          reason: {
            action: `LPS Jump: j ${oldPj} -> ${pj}`,
            why: `Skipping ${oldPj - pj} characters based on precomputed LPS value ${pj}.`,
            rule: 'j = lps[j - 1]',
            values: { previousJ: oldPj, newJ: pj, shiftAmount: oldPj - pj },
            details: 'Pattern aligns its known matching prefix with the current text suffix.',
          },
        };
      } else {
        ti++;
      }
    }
  }

  // Complete
  yield {
    type: 'complete',
    codeLine: 1,
    pointers: { i: n, j: 0 },
    dataState: {
      text,
      pattern,
      lps: [...lps],
      textPointer: n,
      patPointer: 0,
      patternOffset: n - m,
      matchIndices: [...matchIndices],
      phase: 'complete',
    },
    message: `KMP Search complete! Found ${matchIndices.length} occurrence(s) of "${pattern}" at indices: [${matchIndices.join(', ')}].`,
    reason: {
      action: 'KMP Complete',
      why: `Scanned all ${n} characters of text in O(n + m) time with ${matchIndices.length} matches.`,
      rule: 'i == n => Scan Finished',
      values: { matchesFound: matchIndices.length, occurrences: matchIndices },
      details: 'Optimal linear pattern matching algorithm executed successfully.',
    },
  };
}

/**
 * 2. Rabin-Karp: Window hash, hash comparisons, verification on match & rolling hash updates
 */
export function* generateRabinKarpSteps(
  customText?: string,
  customPattern?: string
): Generator<StepAction<StringData>, void, unknown> {
  const text = (customText || 'AABAACAADAABAABA').toUpperCase();
  const pattern = (customPattern || 'BAAB').toUpperCase();
  const n = text.length;
  const m = pattern.length;
  const d = 256; // Alphabet size
  const q = 101; // Prime modulo

  // Compute d^(m-1) % q
  let h = 1;
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  let pHash = 0;
  let tHash = 0;
  for (let i = 0; i < m; i++) {
    pHash = (d * pHash + pattern.charCodeAt(i)) % q;
    tHash = (d * tHash + text.charCodeAt(i)) % q;
  }

  const matchIndices: number[] = [];

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      text,
      pattern,
      textPointer: 0,
      patternOffset: 0,
      patternHash: pHash,
      rollingHash: tHash,
      windowStr: text.slice(0, m),
      phase: 'hash',
    },
    message: `Rabin-Karp initialized: Target pattern "${pattern}" hash = ${pHash} (mod ${q}). Initial window text[0..${m - 1}] ("${text.slice(0, m)}") hash = ${tHash}.`,
    reason: {
      action: 'Init Rabin-Karp',
      why: `Computed polynomial rolling hashes using base ${d} and prime modulo ${q}.`,
      rule: 'patternHash = hash(pattern), windowHash = hash(text[0..m-1])',
      values: { pattern, patternHash: pHash, initialWindowHash: tHash, prime: q },
      details: 'Hashes allow O(1) comparison before checking individual characters.',
    },
  };

  for (let i = 0; i <= n - m; i++) {
    const windowStr = text.slice(i, i + m);

    // Hash comparison step
    const hashesMatch = pHash === tHash;

    yield {
      type: 'compare',
      codeLine: 4,
      indices: Array.from({ length: m }, (_, k) => i + k),
      dataState: {
        text,
        pattern,
        textPointer: i,
        patternOffset: i,
        patternHash: pHash,
        rollingHash: tHash,
        windowStr,
        isMatch: hashesMatch,
        matchIndices: [...matchIndices],
        phase: 'hash',
      },
      message: `Window [${i}..${i + m - 1}] ("${windowStr}"): Hash = ${tHash} vs Pattern Hash = ${pHash} (${hashesMatch ? 'HASH MATCH!' : 'Hash mismatch'}).`,
      reason: {
        action: `Compare Hash at ${i}`,
        why: `Window hash ${tHash} ${hashesMatch ? '==' : '!='} target hash ${pHash}.`,
        rule: 'windowHash == patternHash ?',
        values: { window: windowStr, windowHash: tHash, patternHash: pHash, matches: hashesMatch },
        details: hashesMatch
          ? 'Hash matched! Must verify character-by-character to eliminate spurious collisions.'
          : 'Hashes differ; guaranteed not a match, skip character comparison.',
      },
    };

    if (hashesMatch) {
      // Character-by-character verification
      const exactMatch = windowStr === pattern;

      yield {
        type: exactMatch ? 'found' : 'mismatch',
        codeLine: 4,
        indices: Array.from({ length: m }, (_, k) => i + k),
        dataState: {
          text,
          pattern,
          textPointer: i,
          patternOffset: i,
          patternHash: pHash,
          rollingHash: tHash,
          windowStr,
          isMatch: exactMatch,
          matchIndices: exactMatch ? [...matchIndices, i] : [...matchIndices],
          phase: 'hash',
        },
        message: exactMatch
          ? `MATCH CONFIRMED! Window "${windowStr}" equals pattern "${pattern}" at index ${i}!`
          : `Spurious Hash Collision! Hash ${tHash} matched, but string "${windowStr}" != "${pattern}".`,
        reason: {
          action: exactMatch ? `Match at ${i}` : `Spurious Collision at ${i}`,
          why: exactMatch
            ? `Verified all ${m} characters match pattern "${pattern}".`
            : `Hash collision due to modulo ${q}; characters do not match.`,
          rule: 'exact verification: window == pattern',
          values: { window: windowStr, pattern, isExact: exactMatch },
          details: 'Eliminates false positives from hash collisions.',
        },
      };

      if (exactMatch) {
        matchIndices.push(i);
      }
    }

    // Roll the hash forward to next window
    if (i < n - m) {
      const outgoing = text[i];
      const incoming = text[i + m];
      const oldHash = tHash;

      tHash = (d * (tHash - outgoing.charCodeAt(0) * h) + incoming.charCodeAt(0)) % q;
      if (tHash < 0) tHash += q;

      yield {
        type: 'step',
        codeLine: 5,
        indices: [i, i + m],
        dataState: {
          text,
          pattern,
          textPointer: i + 1,
          patternOffset: i + 1,
          patternHash: pHash,
          rollingHash: tHash,
          windowStr: text.slice(i + 1, i + 1 + m),
          matchIndices: [...matchIndices],
          phase: 'hash',
        },
        message: `Roll Hash: Subtract '${outgoing}' (idx ${i}), Shift ×${d}, Add '${incoming}' (idx ${i + m}). Hash ${oldHash} -> ${tHash}.`,
        reason: {
          action: `Roll Hash to ${i + 1}`,
          why: `O(1) rolling formula: ((${oldHash} - '${outgoing}'*${h})*${d} + '${incoming}') mod ${q} = ${tHash}.`,
          rule: 'tHash = (d*(tHash - text[i]*h) + text[i+m]) % q',
          values: { outgoing, incoming, oldHash, newHash: tHash },
          details: 'Updates hash in constant O(1) time without rescanning window.',
        },
      };
    }
  }

  yield {
    type: 'complete',
    codeLine: 1,
    dataState: {
      text,
      pattern,
      textPointer: n,
      patternOffset: n - m,
      patternHash: pHash,
      rollingHash: tHash,
      matchIndices: [...matchIndices],
      phase: 'complete',
    },
    message: `Rabin-Karp complete! Found ${matchIndices.length} occurrence(s) of "${pattern}" at indices: [${matchIndices.join(', ')}].`,
    reason: {
      action: 'Rabin-Karp Complete',
      why: `Checked all ${n - m + 1} windows using O(1) rolling hashes. Found ${matchIndices.length} matches.`,
      rule: 'Scan complete',
      values: { matches: matchIndices },
      details: 'Average time complexity O(n + m).',
    },
  };
}

/**
 * 3. Palindrome Check: Two pointers moving inward comparing symmetric character pairs
 */
export function* generatePalindromeSteps(
  customStr?: string
): Generator<StepAction<StringData>, void, unknown> {
  const str = (customStr || 'WASITACATISAW').toUpperCase();
  let left = 0;
  let right = str.length - 1;

  yield {
    type: 'start',
    codeLine: 1,
    indices: [left, right],
    dataState: {
      text: str,
      textPointer: left,
      leftPointer: left,
      rightPointer: right,
      phase: 'palindrome',
    },
    message: `Palindrome Check: Testing "${str}" (length ${str.length}). Left pointer at index 0 ('${str[0]}'), Right pointer at index ${right} ('${str[right]}').`,
    reason: {
      action: 'Init Palindrome Check',
      why: `Checking if "${str}" is symmetric. Two pointers placed at opposing ends and move inward step-by-step.`,
      rule: 'left = 0, right = str.length - 1',
      values: { string: str, length: str.length },
      details: 'A palindrome reads identical forwards and backwards.',
    },
  };

  while (left < right) {
    const charL = str[left];
    const charR = str[right];
    const isPairEqual = charL === charR;

    yield {
      type: isPairEqual ? 'compare' : 'mismatch',
      codeLine: 3,
      indices: [left, right],
      dataState: {
        text: str,
        textPointer: left,
        leftPointer: left,
        rightPointer: right,
        isMatch: isPairEqual,
        phase: 'palindrome',
      },
      message: isPairEqual
        ? `Symmetric Match: str[${left}] ('${charL}') == str[${right}] ('${charR}').`
        : `MISMATCH: str[${left}] ('${charL}') != str[${right}] ('${charR}'). NOT a Palindrome!`,
      reason: {
        action: `Compare: str[${left}] ('${charL}') vs str[${right}] ('${charR}')`,
        why: isPairEqual
          ? `Characters at index ${left} and ${right} match symmetrically ('${charL}').`
          : `Characters at index ${left} ('${charL}') and ${right} ('${charR}') differ. Symmetrical invariant broken.`,
        rule: 'str[left] == str[right] ? left++, right-- : return false',
        values: { left, right, charL, charR, isMatch: isPairEqual },
        details: isPairEqual ? 'Continuing to check inner substring.' : 'Early exit: non-palindrome identified.',
      },
    };

    if (!isPairEqual) {
      return;
    }

    left++;
    right--;

    yield {
      type: 'step',
      codeLine: 3,
      indices: [left, right],
      dataState: {
        text: str,
        textPointer: left,
        leftPointer: left,
        rightPointer: right,
        isMatch: true,
        phase: 'palindrome',
      },
      message: left < right
        ? `Pointers moved inward: left -> index ${left} ('${str[left]}'), right -> index ${right} ('${str[right]}').`
        : `Pointers met at middle index ${left} ('${str[left]}').`,
      reason: {
        action: 'Inward Pointer Shift',
        why: 'Both pointers shifted 1 step towards center.',
        rule: 'left++, right--',
        values: { newLeft: left, newRight: right },
      },
    };
  }

  yield {
    type: 'found',
    codeLine: 4,
    indices: Array.from({ length: str.length }, (_, k) => k),
    dataState: {
      text: str,
      textPointer: left,
      leftPointer: left,
      rightPointer: right,
      isMatch: true,
      phase: 'palindrome',
    },
    message: `VALID PALINDROME! All symmetric pairs matched! "${str}" reads identically backwards and forwards.`,
    reason: {
      action: 'Palindrome Confirmed',
      why: `All opposite character pairs matched up to the center. "${str}" is a true palindrome.`,
      rule: 'left >= right => return true',
      values: { palindrome: str, checkedPairs: Math.floor(str.length / 2) },
      details: 'Two-pointer inward scan finished in O(n/2) comparisons with O(1) space.',
    },
  };
}
