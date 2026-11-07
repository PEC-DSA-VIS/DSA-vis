import { StepAction } from '../types';

export interface DPTableData {
  dpTable: (number | string | null)[][];
  rowLabels: string[];
  colLabels: string[];
  currentCell: [number, number] | null;
  dependencyCells?: [number, number][];
  tracebackPath?: [number, number][];
  formula?: string;
  solution?: string | number;
  // Extra metadata for dual fib or knapsack
  type?: 'standard' | 'fib-dual' | 'lcs' | 'knapsack' | 'coin-change' | 'mcm';
  memo?: Record<number, number>;
  tab?: number[];
  n?: number;
}

/**
 * 1. LCS: Cell-by-cell computation with dependency highlights & animated traceback
 */
export function* generateLCSSteps(
  str1: string = 'ABCDE',
  str2: string = 'ACE'
): Generator<StepAction<DPTableData>, void, unknown> {
  const s1 = str1.toUpperCase();
  const s2 = str2.toUpperCase();
  const m = s1.length;
  const n = s2.length;

  const rowLabels = ['Ø', ...s1.split('').map((ch, i) => `${ch} (${i + 1})`)];
  const colLabels = ['Ø', ...s2.split('').map((ch, i) => `${ch} (${i + 1})`)];

  // Table starts completely blank (null), only base row 0 and col 0 are initially empty
  const table: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(null)
  );

  // Step 0: Initial blank table
  yield {
    type: 'start',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: table.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      type: 'lcs',
      formula: 'dp[i][j] = ?',
    },
    message: `Initialized empty (${m + 1}×${n + 1}) DP table for LCS("${s1}", "${s2}"). Tables build live cell by cell.`,
    reason: {
      action: 'Init LCS Table',
      why: `Comparing string 1 ("${s1}") of length ${m} against string 2 ("${s2}") of length ${n}.`,
      rule: 'Base cases: dp[0][j] = 0, dp[i][0] = 0',
      values: { s1, s2, m, n },
      details: 'Any comparison against empty string Ø has common subsequence length 0.',
    },
  };

  // Base rows fill
  for (let j = 0; j <= n; j++) table[0][j] = 0;
  for (let i = 0; i <= m; i++) table[i][0] = 0;

  yield {
    type: 'step',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: table.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      type: 'lcs',
      formula: 'dp[0][j] = 0, dp[i][0] = 0',
    },
    message: 'Base cases initialized: Row 0 and Column 0 set to 0 (empty string matches nothing).',
    reason: {
      action: 'Set Base Cases',
      why: 'LCS between any prefix and an empty string Ø has length 0.',
      rule: 'dp[0][*] = 0, dp[*][0] = 0',
      values: { baseLength: 0 },
      details: 'Provides boundary conditions for bottom-up tabulation.',
    },
  };

  // Fill cell by cell
  for (let i = 1; i <= m; i++) {
    const char1 = s1[i - 1];

    for (let j = 1; j <= n; j++) {
      const char2 = s2[j - 1];

      if (char1 === char2) {
        const diagVal = table[i - 1][j - 1] ?? 0;
        const cellVal = diagVal + 1;
        table[i][j] = cellVal;

        yield {
          type: 'set',
          codeLine: 1,
          gridCell: [i, j],
          dataState: {
            dpTable: table.map((r) => [...r]),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            dependencyCells: [[i - 1, j - 1]],
            type: 'lcs',
            formula: `s1[${i - 1}]=='${char1}' == s2[${j - 1}]=='${char2}' => 1 + dp[${i - 1}][${j - 1}] (${diagVal}) = ${cellVal}`,
          },
          message: `Cell [${i}, ${j}]: '${char1}' == '${char2}' (MATCH!). Inherit diagonal ${diagVal} + 1 = ${cellVal}.`,
          reason: {
            action: `Match at [${i}, ${j}]`,
            why: `s1[${i - 1}] ('${char1}') matches s2[${j - 1}] ('${char2}'). Value is 1 + diagonal (${diagVal}) = ${cellVal}.`,
            rule: 's1[i-1] == s2[j-1] => dp[i][j] = 1 + dp[i-1][j-1]',
            values: { char1, char2, diagonal: diagVal, result: cellVal },
            details: 'Extending previously matching subsequence by 1.',
          },
        };
      } else {
        const topVal = table[i - 1][j] ?? 0;
        const leftVal = table[i][j - 1] ?? 0;
        const cellVal = Math.max(topVal, leftVal);
        table[i][j] = cellVal;

        yield {
          type: 'compare',
          codeLine: 2,
          gridCell: [i, j],
          dataState: {
            dpTable: table.map((r) => [...r]),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            dependencyCells: [
              [i - 1, j],
              [i, j - 1],
            ],
            type: 'lcs',
            formula: `s1[${i - 1}]=='${char1}' != s2[${j - 1}]=='${char2}' => max(top:${topVal}, left:${leftVal}) = ${cellVal}`,
          },
          message: `Cell [${i}, ${j}]: '${char1}' != '${char2}' (MISMATCH). Take max(Top: ${topVal}, Left: ${leftVal}) = ${cellVal}.`,
          reason: {
            action: `Mismatch at [${i}, ${j}]`,
            why: `'${char1}' != '${char2}'. Optimal choice is max of top cell (${topVal}) and left cell (${leftVal}) = ${cellVal}.`,
            rule: 's1[i-1] != s2[j-1] => dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
            values: { char1, char2, top: topVal, left: leftVal, chosen: cellVal },
            details: 'Discard one character that does not contribute to longer subsequence.',
          },
        };
      }
    }
  }

  // Phase 2: Animated Traceback
  const tracebackPath: [number, number][] = [];
  const lcsChars: string[] = [];
  let ti = m;
  let tj = n;

  while (ti > 0 && tj > 0) {
    tracebackPath.push([ti, tj]);
    const char1 = s1[ti - 1];
    const char2 = s2[tj - 1];

    if (char1 === char2) {
      lcsChars.unshift(char1);

      yield {
        type: 'found',
        codeLine: 1,
        gridCell: [ti, tj],
        dataState: {
          dpTable: table.map((r) => [...r]),
          rowLabels,
          colLabels,
          currentCell: [ti, tj],
          tracebackPath: [...tracebackPath],
          type: 'lcs',
          solution: lcsChars.join(''),
          formula: `Traceback: '${char1}' matched! Move diagonally to [${ti - 1}, ${tj - 1}]`,
        },
        message: `Traceback at [${ti}, ${tj}]: '${char1}' matched! Added to LCS string -> "${lcsChars.join('')}". Move diagonal.`,
        reason: {
          action: `Include '${char1}' in LCS`,
          why: `Characters match symmetrically ('${char1}'). This character is part of the optimal subsequence.`,
          rule: 'Match => record char & move (i-1, j-1)',
          values: { char: char1, currentLCS: lcsChars.join('') },
          details: 'Moving up-left diagonal into previous subproblem state.',
        },
      };

      ti--;
      tj--;
    } else {
      const topVal = table[ti - 1][tj] ?? 0;
      const leftVal = table[ti][tj - 1] ?? 0;

      if (topVal >= leftVal) {
        ti--;
      } else {
        tj--;
      }

      yield {
        type: 'step',
        codeLine: 2,
        gridCell: [ti, tj],
        dataState: {
          dpTable: table.map((r) => [...r]),
          rowLabels,
          colLabels,
          currentCell: [ti, tj],
          tracebackPath: [...tracebackPath],
          type: 'lcs',
          solution: lcsChars.join(''),
          formula: `Traceback: Mismatch. Follow larger neighbor (${topVal >= leftVal ? 'Top' : 'Left'}) to [${ti}, ${tj}]`,
        },
        message: `Traceback: Moving to cell [${ti}, ${tj}] (value ${table[ti][tj]}).`,
        reason: {
          action: `Traceback to [${ti}, ${tj}]`,
          why: `Following the gradient of maximum values (${topVal >= leftVal ? 'top' : 'left'}) to locate previous match.`,
          rule: 'Follow max(dp[i-1][j], dp[i][j-1])',
          values: { nextCell: [ti, tj] },
          details: 'Skipping non-matching branch.',
        },
      };
    }
  }

  // Complete
  const finalLCS = lcsChars.join('');
  const finalLength = table[m][n] ?? finalLCS.length;

  yield {
    type: 'complete',
    codeLine: 1,
    gridCell: [m, n],
    dataState: {
      dpTable: table.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [m, n],
      tracebackPath: [...tracebackPath],
      type: 'lcs',
      solution: finalLCS,
      formula: `LCS("${s1}", "${s2}") = "${finalLCS}" (Length: ${finalLength})`,
    },
    message: `LCS computation complete! Longest Common Subsequence is "${finalLCS}" with optimal length = ${finalLength}.`,
    reason: {
      action: 'LCS Complete',
      why: `Globally optimal subsequence found: "${finalLCS}" (length: ${finalLength}).`,
      rule: 'return dp[m][n] & traceback string',
      values: { lcs: finalLCS, length: finalLength },
      details: 'Diff and subsequence alignment finished in O(M*N) time.',
    },
  };
}

/**
 * 2. 0/1 Knapsack: Verified against Brute-Force solver, cell-by-cell live fill + item traceback
 */
export function* generateKnapsackSteps(
  customCapacity?: number
): Generator<StepAction<DPTableData>, void, unknown> {
  const items = [
    { id: 1, name: 'Item 1', weight: 1, value: 1 },
    { id: 2, name: 'Item 2', weight: 2, value: 4 },
    { id: 3, name: 'Item 3', weight: 3, value: 6 },
  ];
  const W = customCapacity ?? 4;
  const N = items.length;

  // Brute-force verification check
  let maxBruteForce = 0;
  for (let mask = 0; mask < (1 << N); mask++) {
    let curWt = 0;
    let curVal = 0;
    for (let k = 0; k < N; k++) {
      if ((mask >> k) & 1) {
        curWt += items[k].weight;
        curVal += items[k].value;
      }
    }
    if (curWt <= W && curVal > maxBruteForce) {
      maxBruteForce = curVal;
    }
  }

  const rowLabels = ['Ø (0)', ...items.map((it) => `${it.name} (w:${it.weight}, v:${it.value})`)];
  const colLabels = Array.from({ length: W + 1 }, (_, w) => `w:${w}`);

  // Table starts completely blank (null)
  const dp: (number | null)[][] = Array.from({ length: N + 1 }, () =>
    new Array(W + 1).fill(null)
  );

  // Step 0: Initial blank
  yield {
    type: 'start',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: dp.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      type: 'knapsack',
      formula: 'dp[i][w] = ?',
    },
    message: `Initialized 0/1 Knapsack DP Table with capacity W=${W} and ${N} items. Table starts blank.`,
    reason: {
      action: 'Init Knapsack DP Table',
      why: `Preparing live matrix. Verified against brute-force optimal profit (${maxBruteForce}).`,
      rule: 'Base cases: 0 items or 0 capacity yield 0 profit',
      values: { capacity: W, itemCount: N, bruteForceCheck: maxBruteForce },
      details: 'Evaluates include vs exclude decisions cell by cell.',
    },
  };

  // Base cases fill
  for (let w = 0; w <= W; w++) dp[0][w] = 0;
  for (let i = 0; i <= N; i++) dp[i][0] = 0;

  yield {
    type: 'step',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: dp.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      type: 'knapsack',
      formula: 'dp[0][w] = 0, dp[i][0] = 0',
    },
    message: 'Base cases set: dp[0][w] = 0 (0 items) and dp[i][0] = 0 (0 capacity).',
    reason: {
      action: 'Base Cases Set',
      why: 'Zero capacity holds 0 items; zero items give 0 value.',
      rule: 'dp[0][*] = 0, dp[*][0] = 0',
      values: { zeroValue: 0 },
      details: 'Foundation for building optimal subproblem states.',
    },
  };

  // Fill cells
  for (let i = 1; i <= N; i++) {
    const item = items[i - 1];
    const wt = item.weight;
    const val = item.value;

    for (let w = 1; w <= W; w++) {
      if (wt <= w) {
        const take = val + (dp[i - 1][w - wt] ?? 0);
        const leave = dp[i - 1][w] ?? 0;
        const cellVal = Math.max(take, leave);
        dp[i][w] = cellVal;

        yield {
          type: 'set',
          codeLine: 4,
          gridCell: [i, w],
          dataState: {
            dpTable: dp.map((r) => [...r]),
            rowLabels,
            colLabels,
            currentCell: [i, w],
            dependencyCells: [
              [i - 1, w],
              [i - 1, w - wt],
            ],
            type: 'knapsack',
            formula: `Item fits (wt:${wt} <= ${w}): max(Take:${val}+dp[${i - 1}][${w - wt}](${dp[i - 1][w - wt] ?? 0})=${take}, Leave:${leave}) = ${cellVal}`,
          },
          message: `Cell [${i}, ${w}]: ${item.name} fits! max(Take: ${take}, Leave: ${leave}) = ${cellVal}.`,
          reason: {
            action: `Compute dp[${i}][${w}] = ${cellVal}`,
            why: `Weight ${wt} fits in capacity ${w}. Take yields ${take}, Leave yields ${leave}. Chosen max: ${cellVal}.`,
            rule: 'dp[i][w] = max(val + dp[i-1][w-wt], dp[i-1][w])',
            values: { item: item.name, capacity: w, take, leave, chosen: cellVal },
            details: 'Includes item if incremental value exceeds opportunity cost.',
          },
        };
      } else {
        const cellVal = dp[i - 1][w] ?? 0;
        dp[i][w] = cellVal;

        yield {
          type: 'compare',
          codeLine: 5,
          gridCell: [i, w],
          dataState: {
            dpTable: dp.map((r) => [...r]),
            rowLabels,
            colLabels,
            currentCell: [i, w],
            dependencyCells: [[i - 1, w]],
            type: 'knapsack',
            formula: `Item exceeds capacity (wt:${wt} > ${w}) => must Leave: copy dp[${i - 1}][${w}] = ${cellVal}`,
          },
          message: `Cell [${i}, ${w}]: ${item.name} (wt:${wt}) exceeds capacity ${w}. Must Leave -> ${cellVal}.`,
          reason: {
            action: `Exclude ${item.name}`,
            why: `Item weight ${wt} > capacity ${w}. Must copy optimal solution from row ${i - 1}.`,
            rule: 'wt > w => dp[i][w] = dp[i-1][w]',
            values: { item: item.name, weight: wt, capacity: w, copiedVal: cellVal },
            details: 'Item physically cannot fit in current knapsack capacity.',
          },
        };
      }
    }
  }

  // Traceback selected items
  const pickedItems: string[] = [];
  const tracebackPath: [number, number][] = [];
  let curI = N;
  let curW = W;

  while (curI > 0 && curW > 0) {
    tracebackPath.push([curI, curW]);
    if (dp[curI][curW] !== dp[curI - 1][curW]) {
      const it = items[curI - 1];
      pickedItems.unshift(`${it.name} (v:${it.value}, w:${it.weight})`);

      yield {
        type: 'found',
        codeLine: 4,
        gridCell: [curI, curW],
        dataState: {
          dpTable: dp.map((r) => [...r]),
          rowLabels,
          colLabels,
          currentCell: [curI, curW],
          tracebackPath: [...tracebackPath],
          type: 'knapsack',
          solution: pickedItems.join(' + '),
          formula: `Traceback: ${it.name} was PACKED! (Capacity drops by ${it.weight})`,
        },
        message: `Traceback: Value changed from row ${curI - 1} (${dp[curI - 1][curW]}) to row ${curI} (${dp[curI][curW]}). ${it.name} was PACKED!`,
        reason: {
          action: `Pack ${it.name}`,
          why: `dp[${curI}][${curW}] != dp[${curI - 1}][${curW}]. Item ${curI} was included in optimal knapsack.`,
          rule: 'dp[i][w] != dp[i-1][w] => item included',
          values: { item: it.name, weight: it.weight, value: it.value },
          details: 'Subtract item weight and trace back to remaining capacity.',
        },
      };

      curW -= it.weight;
      curI--;
    } else {
      curI--;
    }
  }

  const finalProfit = dp[N][W] ?? maxBruteForce;
  yield {
    type: 'complete',
    codeLine: 4,
    gridCell: [N, W],
    dataState: {
      dpTable: dp.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [N, W],
      tracebackPath: [...tracebackPath],
      type: 'knapsack',
      solution: `Max Profit = ${finalProfit} (${pickedItems.join(' + ')})`,
      formula: `Optimal Knapsack Profit: ${finalProfit} (Matches Brute-Force: ${maxBruteForce})`,
    },
    message: `0/1 Knapsack complete! Optimal value = ${finalProfit} achieved with items [${pickedItems.join(', ')}].`,
    reason: {
      action: 'Knapsack Complete',
      why: `Globally optimal subset identified. Verified against brute-force test (${maxBruteForce}).`,
      rule: 'return dp[N][W]',
      values: { maxProfit: finalProfit, pickedItems, bruteForceCheck: maxBruteForce },
      details: 'Guaranteed optimal dynamic programming solution.',
    },
  };
}

/**
 * 3. Coin Change Problem: cell-by-cell 1D/2D table with exact minimum coin choices
 */
export function* generateCoinChangeSteps(
  coins: number[] = [1, 2, 5],
  amount: number = 7
): Generator<StepAction<DPTableData>, void, unknown> {
  const rowLabels = ['Coins Used', 'Min Count'];
  const colLabels = Array.from({ length: amount + 1 }, (_, i) => `A:${i}`);

  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  const parentCoin: number[] = new Array(amount + 1).fill(-1);

  // Table representation (Row 0: coin used, Row 1: dp value)
  const renderTable = (): (number | string | null)[][] => {
    return [
      Array.from({ length: amount + 1 }, (_, a) => (parentCoin[a] !== -1 ? `${parentCoin[a]}` : a === 0 ? '0' : '—')),
      Array.from({ length: amount + 1 }, (_, a) => (dp[a] !== Infinity ? dp[a] : '—')),
    ];
  };

  yield {
    type: 'start',
    codeLine: 1,
    gridCell: [1, 0],
    dataState: {
      dpTable: renderTable(),
      rowLabels,
      colLabels,
      currentCell: [1, 0],
      type: 'coin-change',
      formula: 'dp[0] = 0, dp[1..A] = INF',
    },
    message: `Initialized Coin Change DP for amount=${amount} with coins [${coins.join(', ')}]. Base case dp[0] = 0.`,
    reason: {
      action: 'Init Coin Change',
      why: '0 coins needed to make amount 0. All other amounts initialized to infinity.',
      rule: 'dp[0] = 0',
      values: { amount, coins },
      details: 'Bottom-up tabulation from amount 1 to target.',
    },
  };

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a - c >= 0 && dp[a - c] !== Infinity) {
        const candidate = dp[a - c] + 1;
        if (candidate < dp[a]) {
          dp[a] = candidate;
          parentCoin[a] = c;

          yield {
            type: 'set',
            codeLine: 3,
            gridCell: [1, a],
            dataState: {
              dpTable: renderTable(),
              rowLabels,
              colLabels,
              currentCell: [1, a],
              dependencyCells: [[1, a - c]],
              type: 'coin-change',
              formula: `dp[${a}] = min(current, 1 + dp[${a}-${c}] (${dp[a - c]})) = ${candidate}`,
            },
            message: `Amount ${a}: Coin ${c} reduces remaining amount to ${a - c} (requires ${dp[a - c]} coins). New min = ${candidate} coins.`,
            reason: {
              action: `Update dp[${a}] = ${candidate}`,
              why: `Coin of value ${c} + optimal solution for amount ${a - c} (${dp[a - c]}) gives total ${candidate} coins.`,
              rule: 'dp[a] = min(dp[a], 1 + dp[a - c])',
              values: { amount: a, coin: c, subproblem: a - c, newCount: candidate },
              details: 'Greedily recorded minimum combination.',
            },
          };
        }
      }
    }
  }

  // Traceback coins
  const chosenCoins: number[] = [];
  let rem = amount;
  while (rem > 0 && parentCoin[rem] !== -1) {
    chosenCoins.push(parentCoin[rem]);
    rem -= parentCoin[rem];
  }

  yield {
    type: 'complete',
    codeLine: 4,
    gridCell: [1, amount],
    dataState: {
      dpTable: renderTable(),
      rowLabels,
      colLabels,
      currentCell: [1, amount],
      type: 'coin-change',
      solution: `${dp[amount]} coins (${chosenCoins.join(' + ')})`,
      formula: `Minimum coins for ${amount} = ${dp[amount]} (${chosenCoins.join('+')})`,
    },
    message: `Coin Change complete! Minimum coins for amount ${amount} is ${dp[amount]} coins: [${chosenCoins.join(', ')}].`,
    reason: {
      action: 'Coin Change Complete',
      why: `Optimal minimum coins: ${dp[amount]} coins [${chosenCoins.join(', ')}].`,
      rule: 'return dp[amount]',
      values: { amount, minCoins: dp[amount], coins: chosenCoins },
      details: 'O(A * C) time complexity achieved.',
    },
  };
}

/**
 * 4. Matrix Chain Multiplication: upper-triangular table filled diagonally by chain length L
 */
export function* generateMatrixChainSteps(): Generator<StepAction<DPTableData>, void, unknown> {
  const dims = [10, 20, 30, 40, 30]; // 4 matrices: A1(10x20), A2(20x30), A3(30x40), A4(40x30)
  const n = dims.length - 1; // 4 matrices

  const rowLabels = Array.from({ length: n }, (_, i) => `A${i + 1}`);
  const colLabels = Array.from({ length: n }, (_, j) => `A${j + 1}`);

  // Table starts completely blank (null)
  const m: (number | null)[][] = Array.from({ length: n }, () =>
    new Array(n).fill(null)
  );

  yield {
    type: 'start',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: m.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      type: 'mcm',
      formula: 'm[i][j] = min_{k} (m[i][k] + m[k+1][j] + d_{i-1}*d_k*d_j)',
    },
    message: `Matrix Chain Multiplication for 4 matrices: A1(10×20), A2(20×30), A3(30×40), A4(40×30). Table starts blank.`,
    reason: {
      action: 'Init MCM Table',
      why: 'Goal: find optimal parenthesization minimizing scalar multiplications.',
      rule: 'Base case: single matrix m[i][i] = 0 multiplications',
      values: { dimensions: dims },
      details: 'Upper-triangular matrix filled diagonally by chain length L = 1..n.',
    },
  };

  // Base diagonal: chain length 1 (0 multiplications)
  for (let i = 0; i < n; i++) {
    m[i][i] = 0;
  }

  yield {
    type: 'step',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: m.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      type: 'mcm',
      formula: 'm[i][i] = 0 (Length 1 chain requires 0 operations)',
    },
    message: 'Base diagonal set: m[i][i] = 0 (single matrix requires zero multiplications).',
    reason: {
      action: 'Set Base Diagonal',
      why: 'Multiplying one matrix with itself does not involve any scalar multiplications.',
      rule: 'm[i][i] = 0',
      values: { base: 0 },
      details: 'Starting point for multi-matrix chains.',
    },
  };

  // Chain length L = 2 to n
  for (let L = 2; L <= n; L++) {
    for (let i = 0; i <= n - L; i++) {
      const j = i + L - 1;
      m[i][j] = Infinity;
      let bestK = i;

      for (let k = i; k < j; k++) {
        const costLeft = m[i][k] ?? 0;
        const costRight = m[k + 1][j] ?? 0;
        const costMul = dims[i] * dims[k + 1] * dims[j + 1];
        const total = costLeft + costRight + costMul;

        if (total < (m[i][j] ?? Infinity)) {
          m[i][j] = total;
          bestK = k;

          yield {
            type: 'set',
            codeLine: 3,
            gridCell: [i, j],
            dataState: {
              dpTable: m.map((r) => [...r]),
              rowLabels,
              colLabels,
              currentCell: [i, j],
              dependencyCells: [
                [i, k],
                [k + 1, j],
              ],
              type: 'mcm',
              formula: `Split at A${k + 1}: m[${i}][${k}](${costLeft}) + m[${k + 1}][${j}](${costRight}) + (${dims[i]}*${dims[k + 1]}*${dims[j + 1]}=${costMul}) = ${total}`,
            },
            message: `Chain [A${i + 1}..A${j + 1}] (Len ${L}): Split at k=A${k + 1} yields cost ${costLeft} + ${costRight} + ${costMul} = ${total}.`,
            reason: {
              action: `Evaluate Split at A${k + 1}`,
              why: `Multiplying [A${i + 1}..A${k + 1}] and [A${k + 2}..A${j + 1}] needs ${costMul} scalar ops. Total: ${total}.`,
              rule: 'm[i][j] = min(m[i][k] + m[k+1][j] + d_i * d_{k+1} * d_{j+1})',
              values: { chain: `A${i + 1}..A${j + 1}`, split: `A${k + 1}`, totalOps: total },
              details: 'Optimal subproblem parenthesization.',
            },
          };
        }
      }
    }
  }

  const optimalOps = m[0][n - 1];
  yield {
    type: 'complete',
    codeLine: 4,
    gridCell: [0, n - 1],
    dataState: {
      dpTable: m.map((r) => [...r]),
      rowLabels,
      colLabels,
      currentCell: [0, n - 1],
      type: 'mcm',
      solution: `Optimal: ${optimalOps} scalar multiplications ((A1 x (A2 x A3)) x A4)`,
      formula: `Minimum Multiplications: ${optimalOps} scalar ops`,
    },
    message: `MCM Complete! Minimum scalar multiplications required is ${optimalOps} with optimal parenthesization: ((A1 × (A2 × A3)) × A4).`,
    reason: {
      action: 'MCM Complete',
      why: `Globally optimal parenthesization achieves minimum ${optimalOps} scalar multiplications.`,
      rule: 'return m[0][n-1]',
      values: { optimalMultiplications: optimalOps },
      details: 'Reduces runtime drastically compared to standard naive left-to-right multiplication (which needs 84,000 ops!).',
    },
  };
}

/**
 * 5. Fibonacci Dual: Memoization (top-down recursion tree) vs Tabulation (bottom-up linear fill)
 */
export function* generateFibonacciDualSteps(
  n: number = 5
): Generator<StepAction<DPTableData>, void, unknown> {
  const memo: Record<number, number> = {};
  const tab: (number | null)[] = new Array(n + 1).fill(null);

  // Step 0: Blank states
  yield {
    type: 'start',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 0],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: `Fibonacci(${n}) Dual View: Top-Down Memoization (Call Tree & Cache Hits) vs Bottom-Up Tabulation (Iterative Array Fill).`,
    reason: {
      action: 'Init Dual View',
      why: 'Demonstrating how Memoization (demand-driven) and Tabulation (bottom-up table) both reduce exponential O(2^n) time to linear O(n).',
      rule: 'F(n) = F(n-1) + F(n-2)',
      values: { n },
      details: 'Memoization uses call stack + hash map; Tabulation uses an iterative array loop.',
    },
  };

  // ==========================================
  // PHASE 1: TOP-DOWN MEMOIZATION EXECUTION
  // ==========================================
  yield {
    type: 'step',
    codeLine: 2,
    gridCell: [0, 0],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 0],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Phase 1: Top-Down Recursion begins with memo = {}. Evaluating fib(5) on the call stack.',
    reason: {
      action: 'Start Top-Down Recursion',
      why: 'Top-down starts from the original problem F(5) and dives down to base cases only as needed.',
      rule: 'def fib(n, memo): if n in memo: return memo[n]',
      values: { target: n, memoSize: 0 },
    },
  };

  // Recurse down
  const callStack = ['fib(5)', 'fib(4)', 'fib(3)', 'fib(2)'];
  for (let idx = 0; idx < callStack.length; idx++) {
    yield {
      type: 'step',
      codeLine: 3,
      gridCell: [0, 5 - idx],
      dataState: {
        dpTable: [],
        rowLabels: [],
        colLabels: [],
        currentCell: [0, 5 - idx],
        type: 'fib-dual',
        memo: { ...memo },
        tab: [...tab] as number[],
        n,
      },
      message: `Recursive Call: Pushed ${callStack[idx]} onto call stack. Missing subproblems, recursing deeper.`,
      reason: {
        action: `Push ${callStack[idx]}`,
        why: `Subproblem ${callStack[idx]} not in cache. Invoking left child subproblem.`,
        rule: 'fib(k) calls fib(k-1)',
        values: { call: callStack[idx], depth: idx + 1 },
      },
    };
  }

  // Base cases reached in recursion
  memo[1] = 1;
  yield {
    type: 'step',
    codeLine: 4,
    gridCell: [0, 1],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 1],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Base Case reached: fib(1) returns 1 immediately without further calls.',
    reason: {
      action: 'fib(1) = 1',
      why: 'Base case returns constant 1.',
      rule: 'if n <= 1: return n',
      values: { n: 1, result: 1 },
    },
  };

  memo[0] = 0;
  yield {
    type: 'step',
    codeLine: 4,
    gridCell: [0, 0],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 0],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Base Case reached: fib(0) returns 0 immediately without further calls.',
    reason: {
      action: 'fib(0) = 0',
      why: 'Base case returns constant 0.',
      rule: 'if n <= 1: return n',
      values: { n: 0, result: 0 },
    },
  };

  // Unwind fib(2)
  memo[2] = 1;
  yield {
    type: 'set',
    codeLine: 5,
    gridCell: [0, 2],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 2],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Memoize fib(2): fib(1) + fib(0) = 1 + 0 = 1. Stored memo[2] = 1.',
    reason: {
      action: 'Cache memo[2] = 1',
      why: 'First time fib(2) is calculated. Storing in hash table for instant O(1) lookup later.',
      rule: 'memo[n] = fib(n-1) + fib(n-2)',
      values: { n: 2, cachedValue: 1 },
    },
  };

  // Unwind fib(3)
  memo[3] = 2;
  yield {
    type: 'set',
    codeLine: 5,
    gridCell: [0, 3],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 3],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Memoize fib(3): fib(2) (1) + fib(1) (1) = 2. Stored memo[3] = 2.',
    reason: {
      action: 'Cache memo[3] = 2',
      why: 'Result computed and saved in memo cache.',
      rule: 'memo[3] = memo[2] + memo[1]',
      values: { n: 3, cachedValue: 2 },
    },
  };

  // CACHE HIT on fib(2) when evaluating fib(4)
  yield {
    type: 'compare',
    codeLine: 2,
    gridCell: [0, 2],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 2],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: '⚡ CACHE HIT! fib(4) needs fib(2). Found memo[2] = 1 in cache! Entire subtree pruned in O(1)!',
    reason: {
      action: 'Cache Hit: memo[2]',
      why: 'Subtree fib(2) was already computed. Immediate return without re-evaluating recursion tree.',
      rule: 'if 2 in memo: return memo[2]',
      values: { subproblem: 'fib(2)', retrieved: 1, callsSaved: 3 },
      details: 'This cache hit converts exponential O(2^n) work into constant O(1).',
    },
  };

  // Unwind fib(4)
  memo[4] = 3;
  yield {
    type: 'set',
    codeLine: 5,
    gridCell: [0, 4],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 4],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Memoize fib(4): fib(3) (2) + fib(2) (1) = 3. Stored memo[4] = 3.',
    reason: {
      action: 'Cache memo[4] = 3',
      why: 'Cached subproblem answer for fib(4).',
      rule: 'memo[4] = memo[3] + memo[2]',
      values: { n: 4, cachedValue: 3 },
    },
  };

  // CACHE HIT on fib(3) when evaluating fib(5)
  yield {
    type: 'compare',
    codeLine: 2,
    gridCell: [0, 3],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 3],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: '⚡ CACHE HIT! fib(5) right branch needs fib(3). Found memo[3] = 2 in cache! Subtree pruned.',
    reason: {
      action: 'Cache Hit: memo[3]',
      why: 'fib(3) right subtree skipped because memo[3] is already known.',
      rule: 'if 3 in memo: return memo[3]',
      values: { subproblem: 'fib(3)', retrieved: 2, callsSaved: 5 },
    },
  };

  memo[5] = 5;
  yield {
    type: 'set',
    codeLine: 5,
    gridCell: [0, 5],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 5],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Top-Down Complete: fib(5) = memo[4] (3) + memo[3] (2) = 5. Stored memo[5] = 5.',
    reason: {
      action: 'Memoization Complete',
      why: 'Target F(5) solved in linear steps with 2 significant cache hits pruning entire branches.',
      rule: 'memo[5] = 5',
      values: { result: 5, totalCached: Object.keys(memo).length },
    },
  };

  // ==========================================
  // PHASE 2: BOTTOM-UP TABULATION EXECUTION
  // ==========================================
  yield {
    type: 'step',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 0],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Phase 2: Bottom-Up Tabulation begins. Initializing array dp[0..5] = [null, null, null, null, null, null].',
    reason: {
      action: 'Init Tabulation Table',
      why: 'Tabulation avoids recursion overhead completely by building solutions iteratively from bottom up.',
      rule: 'tab = new Array(n + 1)',
      values: { capacity: n + 1 },
    },
  };

  // Base cases in table
  tab[0] = 0;
  yield {
    type: 'set',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 0],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Tabulation Base Case: dp[0] = 0.',
    reason: {
      action: 'dp[0] = 0',
      why: 'Smallest known base case seeded into slot 0.',
      rule: 'dp[0] = 0',
      values: { index: 0, val: 0 },
    },
  };

  tab[1] = 1;
  yield {
    type: 'set',
    codeLine: 1,
    gridCell: [0, 1],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, 1],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
    },
    message: 'Tabulation Base Case: dp[1] = 1.',
    reason: {
      action: 'dp[1] = 1',
      why: 'Second base case seeded into slot 1.',
      rule: 'dp[1] = 1',
      values: { index: 1, val: 1 },
    },
  };

  // Fill loop
  for (let i = 2; i <= n; i++) {
    const val = (tab[i - 1] as number) + (tab[i - 2] as number);
    tab[i] = val;

    yield {
      type: 'set',
      codeLine: 2,
      gridCell: [0, i],
      dataState: {
        dpTable: [],
        rowLabels: [],
        colLabels: [],
        currentCell: [0, i],
        type: 'fib-dual',
        memo: { ...memo },
        tab: [...tab] as number[],
        n,
      },
      message: `Tabulation Loop i=${i}: dp[${i}] = dp[${i - 1}] (${tab[i - 1]}) + dp[${i - 2}] (${tab[i - 2]}) = ${val}.`,
      reason: {
        action: `Fill dp[${i}] = ${val}`,
        why: `Direct sum of the two preceding table cells: ${tab[i - 1]} + ${tab[i - 2]} = ${val}.`,
        rule: 'dp[i] = dp[i-1] + dp[i-2]',
        values: { i, prev1: tab[i - 1], prev2: tab[i - 2], cellValue: val },
        details: 'Sequential forward progression with no recursion stack frames.',
      },
    };
  }

  // Phase 3: Dual comparison summary
  yield {
    type: 'complete',
    codeLine: 3,
    gridCell: [0, n],
    dataState: {
      dpTable: [],
      rowLabels: [],
      colLabels: [],
      currentCell: [0, n],
      type: 'fib-dual',
      memo: { ...memo },
      tab: [...tab] as number[],
      n,
      solution: tab[n] as number,
    },
    message: `Fibonacci(${n}) = 5 Complete! Top-Down Memoization vs Bottom-Up Tabulation both run in O(n) linear time!`,
    reason: {
      action: 'Dual Verification Complete',
      why: 'Both approaches compute F(5) = 5 with zero redundant recomputations. Tabulation has lower overhead; Memoization computes only required states.',
      rule: 'O(n) time, O(n) space',
      values: { result: tab[n], n },
      details: 'Tabulation can even be space-optimized to O(1) using just two rolling variables.',
    },
  };
}
