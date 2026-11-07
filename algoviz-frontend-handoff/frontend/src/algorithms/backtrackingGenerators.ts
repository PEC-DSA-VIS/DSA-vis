import { StepAction } from '../types';

export interface NQueensData {
  n: number;
  grid: number[][];
  currentCell: [number, number] | null;
  conflictingQueen?: [number, number] | null;
  attackLines?: { from: [number, number]; to: [number, number] }[];
  queensPlaced: number;
  placementsCount: number;
  backtracksCount: number;
  solutionsCount: number;
  isBacktracking?: boolean;
}

export interface SudokuData {
  size: number;
  boxSize: number;
  grid: number[][];
  initialGrid: number[][];
  currentCell: [number, number] | null;
  conflictingCells?: [number, number][];
  candidateDigits?: number[];
  testedDigit?: number;
  placementsCount: number;
  backtracksCount: number;
  filledCount: number;
  totalEmpty: number;
  isBacktracking?: boolean;
}

/**
 * Generator for N-Queens Backtracking with live attack conflicts, placements & undo
 */
export function* generateNQueensSteps(n: number = 4): Generator<StepAction<NQueensData>, void, unknown> {
  const board: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  let placementsCount = 0;
  let backtracksCount = 0;
  let queensPlaced = 0;

  // Step 0: Start on empty board
  yield {
    type: 'start',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      n,
      grid: board.map((r) => [...r]),
      currentCell: [0, 0],
      queensPlaced: 0,
      placementsCount: 0,
      backtracksCount: 0,
      solutionsCount: 0,
    },
    message: `Initialized empty ${n}×${n} chessboard. Ready to place ${n} non-attacking Queens via recursive backtracking.`,
    reason: {
      action: `Init ${n}-Queens`,
      why: `Started backtracking search on ${n}×${n} board from row 0.`,
      rule: 'solveNQueens(row = 0)',
      values: { n, boardSize: `${n}x${n}` },
      details: 'No two queens may share the same row, column, or diagonal.',
    },
  };

  let solutionFound = false;

  function* solve(row: number): Generator<StepAction<NQueensData>, boolean, unknown> {
    if (row === n) {
      solutionFound = true;
      yield {
        type: 'found',
        codeLine: 2,
        gridCell: null,
        dataState: {
          n,
          grid: board.map((r) => [...r]),
          currentCell: null,
          queensPlaced: n,
          placementsCount,
          backtracksCount,
          solutionsCount: 1,
        },
        message: `Solution Discovered! Successfully placed all ${n} Queens without any mutual attacks!`,
        reason: {
          action: 'Solution Complete',
          why: `Placed ${n} queens across all ${n} rows without conflicts.`,
          rule: 'row == n => recordSolution()',
          values: { totalPlacements: placementsCount, totalBacktracks: backtracksCount },
          details: 'Optimal chessboard arrangement verified.',
        },
      };
      return true;
    }

    for (let col = 0; col < n; col++) {
      // Check safety against previously placed queens
      let conflict: [number, number] | null = null;
      let conflictType = '';

      for (let prevRow = 0; prevRow < row; prevRow++) {
        for (let prevCol = 0; prevCol < n; prevCol++) {
          if (board[prevRow][prevCol] === 1) {
            // Column conflict
            if (prevCol === col) {
              conflict = [prevRow, prevCol];
              conflictType = `column ${col}`;
              break;
            }
            // Diagonal conflict
            if (Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
              conflict = [prevRow, prevCol];
              conflictType = `diagonal (|${prevRow}-${row}| == |${prevCol}-${col}|)`;
              break;
            }
          }
        }
        if (conflict) break;
      }

      if (conflict) {
        yield {
          type: 'compare',
          codeLine: 4,
          gridCell: [row, col],
          dataState: {
            n,
            grid: board.map((r) => [...r]),
            currentCell: [row, col],
            conflictingQueen: conflict,
            queensPlaced,
            placementsCount,
            backtracksCount,
            solutionsCount: 0,
          },
          message: `Attack Conflict at (${row}, ${col})! Square is attacked by Queen at (${conflict[0]}, ${conflict[1]}) on ${conflictType}.`,
          reason: {
            action: `Conflict at (${row}, ${col})`,
            why: `Square attacked by Queen at (${conflict[0]}, ${conflict[1]}).`,
            rule: 'isSafe == false => Reject square',
            values: { row, col, conflictingQueen: conflict, conflictType },
            details: 'Cannot place queen here; must test next column.',
          },
        };
      } else {
        // Safe to place!
        board[row][col] = 1;
        queensPlaced++;
        placementsCount++;

        yield {
          type: 'step',
          codeLine: 5,
          gridCell: [row, col],
          dataState: {
            n,
            grid: board.map((r) => [...r]),
            currentCell: [row, col],
            conflictingQueen: null,
            queensPlaced,
            placementsCount,
            backtracksCount,
            solutionsCount: 0,
          },
          message: `CHOOSE: Placed Queen #${queensPlaced} at Row ${row}, Col ${col}. Square is verified safe!`,
          reason: {
            action: `Place Queen at (${row}, ${col})`,
            why: `No conflicts across column ${col} or diagonals.`,
            rule: 'isSafe == true => placeQueen(row, col)',
            values: { row, col, queensPlaced, placementsCount },
            details: 'Recursively advance to row ' + (row + 1),
          },
        };

        const success = yield* solve(row + 1);
        if (success) return true;

        // Backtrack
        board[row][col] = 0;
        queensPlaced--;
        backtracksCount++;

        yield {
          type: 'backtrack',
          codeLine: 7,
          gridCell: [row, col],
          dataState: {
            n,
            grid: board.map((r) => [...r]),
            currentCell: [row, col],
            conflictingQueen: null,
            queensPlaced,
            placementsCount,
            backtracksCount,
            solutionsCount: 0,
            isBacktracking: true,
          },
          message: `BACKTRACK: Row ${row + 1} led to a dead-end with no safe squares! Removed Queen from Row ${row}, Col ${col}.`,
          reason: {
            action: `Undo Queen at (${row}, ${col})`,
            why: `Subsequent rows failed to find safe placements; reverting board state.`,
            rule: 'removeQueen(row, col) => Backtrack',
            values: { row, col, backtracksCount },
            details: 'Pruning unviable search branch and exploring next candidate column.',
          },
        };
      }
    }

    return false;
  }

  yield* solve(0);

  if (solutionFound) {
    yield {
      type: 'complete',
      codeLine: 2,
      gridCell: null,
      dataState: {
        n,
        grid: board.map((r) => [...r]),
        currentCell: null,
        queensPlaced: n,
        placementsCount,
        backtracksCount,
        solutionsCount: 1,
      },
      message: `${n}-Queens puzzle completed with ${placementsCount} placements and ${backtracksCount} backtracks.`,
      reason: {
        action: 'Search Finished',
        why: 'Complete solution reached and confirmed.',
        rule: 'O(N!) search space pruned via constraints',
        values: { placements: placementsCount, backtracks: backtracksCount },
      },
    };
  }
}

/**
 * Generator for Sudoku Backtracking with candidate checks, row/col/box conflict highlights & undo
 */
export function* generateSudokuSteps(size: 4 | 9 = 4): Generator<StepAction<SudokuData>, void, unknown> {
  const boxSize = size === 4 ? 2 : 3;

  // Initial puzzle configuration
  const grid: number[][] =
    size === 4
      ? [
          [0, 0, 3, 0],
          [0, 0, 0, 2],
          [4, 0, 0, 0],
          [0, 3, 0, 0],
        ]
      : [
          [5, 3, 0, 0, 7, 0, 0, 0, 0],
          [6, 0, 0, 1, 9, 5, 0, 0, 0],
          [0, 9, 8, 0, 0, 0, 0, 6, 0],
          [8, 0, 0, 0, 6, 0, 0, 0, 3],
          [4, 0, 0, 8, 0, 3, 0, 0, 1],
          [7, 0, 0, 0, 2, 0, 0, 0, 6],
          [0, 6, 0, 0, 0, 0, 2, 8, 0],
          [0, 0, 0, 4, 1, 9, 0, 0, 5],
          [0, 0, 0, 0, 8, 0, 0, 7, 9],
        ];

  const initialGrid = grid.map((r) => [...r]);
  let totalEmpty = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) totalEmpty++;
    }
  }

  let placementsCount = 0;
  let backtracksCount = 0;
  let filledCount = size * size - totalEmpty;

  yield {
    type: 'start',
    codeLine: 1,
    gridCell: [0, 0],
    dataState: {
      size,
      boxSize,
      grid: grid.map((r) => [...r]),
      initialGrid,
      currentCell: [0, 0],
      placementsCount: 0,
      backtracksCount: 0,
      filledCount,
      totalEmpty,
    },
    message: `Initialized ${size}×${size} Sudoku puzzle with ${totalEmpty} empty cells. Starting constraint backtracking.`,
    reason: {
      action: `Init ${size}×${size} Sudoku`,
      why: 'Starting search for first unfilled cell.',
      rule: 'findEmptyCell(grid)',
      values: { size, emptyCells: totalEmpty },
      details: 'Must satisfy row uniqueness, column uniqueness, and box uniqueness.',
    },
  };

  function findEmpty(): [number, number] | null {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0) return [r, c];
      }
    }
    return null;
  }

  function getConflicts(row: number, col: number, num: number): [number, number][] {
    const conflicts: [number, number][] = [];
    // Row check
    for (let c = 0; c < size; c++) {
      if (c !== col && grid[row][c] === num) {
        conflicts.push([row, c]);
      }
    }
    // Col check
    for (let r = 0; r < size; r++) {
      if (r !== row && grid[r][col] === num) {
        conflicts.push([r, col]);
      }
    }
    // Box check
    const startRow = Math.floor(row / boxSize) * boxSize;
    const startCol = Math.floor(col / boxSize) * boxSize;
    for (let r = startRow; r < startRow + boxSize; r++) {
      for (let c = startCol; c < startCol + boxSize; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) {
          if (!conflicts.some(([cr, cc]) => cr === r && cc === c)) {
            conflicts.push([r, c]);
          }
        }
      }
    }
    return conflicts;
  }

  function* solveSudoku(): Generator<StepAction<SudokuData>, boolean, unknown> {
    const emptyPos = findEmpty();
    if (!emptyPos) {
      return true; // Puzzle solved!
    }

    const [row, col] = emptyPos;

    // Emit cell inspection step with remaining candidate digits
    const validCandidates: number[] = [];
    for (let d = 1; d <= size; d++) {
      if (getConflicts(row, col, d).length === 0) validCandidates.push(d);
    }

    yield {
      type: 'pointer',
      codeLine: 2,
      gridCell: [row, col],
      dataState: {
        size,
        boxSize,
        grid: grid.map((r) => [...r]),
        initialGrid,
        currentCell: [row, col],
        conflictingCells: [],
        candidateDigits: validCandidates,
        testedDigit: 0,
        placementsCount,
        backtracksCount,
        filledCount,
        totalEmpty,
      },
      message: `Inspecting empty cell (${row}, ${col}). Candidate digits: [${validCandidates.length > 0 ? validCandidates.join(', ') : 'none'}].`,
      reason: {
        action: `Inspect Cell (${row}, ${col})`,
        why: `Finding next unfilled cell in row-major order. Candidates available: [${validCandidates.join(', ')}].`,
        rule: 'findEmptyCell(grid) => (row, col)',
        values: { row, col, candidates: validCandidates },
        details: 'Each candidate digit from 1..N will be validated against row, column, and subgrid constraints.',
      },
    };

    for (let num = 1; num <= size; num++) {
      const conflicts = getConflicts(row, col, num);

      if (conflicts.length > 0) {
        yield {
          type: 'compare',
          codeLine: 4,
          gridCell: [row, col],
          dataState: {
            size,
            boxSize,
            grid: grid.map((r) => [...r]),
            initialGrid,
            currentCell: [row, col],
            conflictingCells: conflicts,
            testedDigit: num,
            placementsCount,
            backtracksCount,
            filledCount,
            totalEmpty,
          },
          message: `Constraint Conflict! Candidate digit ${num} at cell (${row}, ${col}) violates uniqueness in ${conflicts.map(([r, c]) => `(${r}, ${c})`).join(', ')}.`,
          reason: {
            action: `Reject digit ${num} at (${row}, ${col})`,
            why: `Digit ${num} already exists in same row, column, or ${boxSize}×${boxSize} subgrid.`,
            rule: 'isValid(r, c, num) == false',
            values: { row, col, candidate: num, conflicts },
            details: 'Constraint pruning: immediately reject invalid digit without exploring further.',
          },
        };
      } else {
        // Place digit
        grid[row][col] = num;
        placementsCount++;
        filledCount++;

        yield {
          type: 'step',
          codeLine: 5,
          gridCell: [row, col],
          dataState: {
            size,
            boxSize,
            grid: grid.map((r) => [...r]),
            initialGrid,
            currentCell: [row, col],
            conflictingCells: [],
            testedDigit: num,
            placementsCount,
            backtracksCount,
            filledCount,
            totalEmpty,
          },
          message: `CHOOSE: Placed candidate digit ${num} at cell (${row}, ${col}). All row, column, and box constraints met!`,
          reason: {
            action: `Place ${num} at (${row}, ${col})`,
            why: `Digit ${num} satisfies all constraints for cell (${row}, ${col}).`,
            rule: 'isValid(r, c, num) == true => grid[r][c] = num',
            values: { row, col, digit: num, filledCount },
            details: 'Explore next unfilled cell recursively.',
          },
        };

        const success = yield* solveSudoku();
        if (success) return true;

        // Undo / Backtrack
        grid[row][col] = 0;
        backtracksCount++;
        filledCount--;

        yield {
          type: 'backtrack',
          codeLine: 6,
          gridCell: [row, col],
          dataState: {
            size,
            boxSize,
            grid: grid.map((r) => [...r]),
            initialGrid,
            currentCell: [row, col],
            conflictingCells: [],
            testedDigit: 0,
            placementsCount,
            backtracksCount,
            filledCount,
            totalEmpty,
            isBacktracking: true,
          },
          message: `BACKTRACK: Digit ${num} at (${row}, ${col}) led to a contradiction downstream. Reset cell (${row}, ${col}) to 0.`,
          reason: {
            action: `Undo digit at (${row}, ${col})`,
            why: `No valid assignment possible for downstream cells with current choice.`,
            rule: 'grid[r][c] = 0 => Backtrack',
            values: { row, col, undoneDigit: num, backtracksCount },
            details: 'Restoring state and testing next candidate digit.',
          },
        };
      }
    }

    return false;
  }

  yield* solveSudoku();

  yield {
    type: 'complete',
    codeLine: 5,
    gridCell: null,
    dataState: {
      size,
      boxSize,
      grid: grid.map((r) => [...r]),
      initialGrid,
      currentCell: null,
      placementsCount,
      backtracksCount,
      filledCount: size * size,
      totalEmpty,
    },
    message: `Sudoku Solver completed! Solved all cells with ${placementsCount} placements and ${backtracksCount} backtracks.`,
    reason: {
      action: 'Sudoku Solved',
      why: 'All rows, columns, and subgrids satisfy 1..N uniqueness constraints.',
      rule: 'Puzzle completed',
      values: { totalFilled: size * size, placements: placementsCount, backtracks: backtracksCount },
    },
  };
}
