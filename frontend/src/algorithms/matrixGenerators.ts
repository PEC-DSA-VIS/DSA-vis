import { StepAction } from '../types';

export interface GridCell {
  r: number;
  c: number;
  val: string | number;
  status: 'water' | 'land' | 'visited' | 'current' | 'queued' | 'boundary';
}

// =================================================================
// 1. 2D GRID IMAGE FLOOD FILL & NUMBER OF ISLANDS (>= 25 STEPS)
// =================================================================
export function* generateFloodFillSteps(): Generator<StepAction, void, unknown> {
  // 4x5 Grid with 2 distinct islands
  // 1 = unvisited land, 0 = water, 2 = visited/sunk island #1, 3 = visited/sunk island #2
  const initialGrid: (string | number)[][] = [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 0, 0],
  ];

  const rows = initialGrid.length;
  const cols = initialGrid[0].length;
  const currentGrid = initialGrid.map((row) => [...row]);
  const visitedCells: [number, number][] = [];
  const queue: [number, number][] = [];

  let islandsDiscovered = 0;
  let cellsProcessed = 0;

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'grid-matrix',
      mode: 'islands',
      grid: currentGrid.map((r) => [...r]),
      visitedCells: [...visitedCells],
      queue: [...queue],
      currentCell: null,
      islandsCount: 0,
      stats: {
        islandsCount: 0,
        cellsProcessed: 0,
        queueSize: 0,
        gridSize: `${rows} × ${cols}`,
      },
    },
    message: `Initialized 2D Grid (${rows} Rows × ${cols} Columns). Scanning cells row by row for unvisited land ('1').`,
    reason: {
      action: 'Start 2D Grid Scan',
      why: 'We iterate through each cell (r, c). When an unvisited land cell is encountered, we trigger a BFS/DFS flood fill to sink the island.',
      rule: 'for r in 0..rows: for c in 0..cols: if grid[r][c] == 1: bfsSink(r, c)',
      values: { rows, cols, totalCells: rows * cols },
      details: 'Queue tracks frontier cells to explore in cardinal directions (Up, Down, Left, Right).',
    },
  };

  const directions = [
    { dr: -1, dc: 0, name: 'North (Up)' },
    { dr: 1, dc: 0, name: 'South (Down)' },
    { dr: 0, dc: 1, name: 'East (Right)' },
    { dr: 0, dc: -1, name: 'West (Left)' },
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (currentGrid[r][c] === 1) {
        // Discovered a new island!
        islandsDiscovered++;
        queue.push([r, c]);
        currentGrid[r][c] = islandsDiscovered === 1 ? '✦' : '★'; // marked as queued
        visitedCells.push([r, c]);

        yield {
          type: 'found',
          codeLine: 3,
          dataState: {
            structure: 'grid-matrix',
            mode: 'islands',
            grid: currentGrid.map((row) => [...row]),
            visitedCells: [...visitedCells],
            queue: [...queue],
            currentCell: [r, c],
            islandsCount: islandsDiscovered,
            stats: {
              islandsCount: islandsDiscovered,
              cellsProcessed,
              queueSize: queue.length,
              gridSize: `${rows} × ${cols}`,
            },
          },
          message: `NEW ISLAND #${islandsDiscovered} FOUND at cell (${r}, ${c})! Triggering BFS flood fill to explore and sink contiguous land.`,
          reason: {
            action: `New Island Root at (${r}, ${c})`,
            why: `Cell (${r}, ${c}) contains unvisited land ('1'). Incrementing island count to ${islandsDiscovered}.`,
            rule: 'islands++; queue.push([r, c]); markVisited([r, c])',
            values: { row: r, col: c, islandNumber: islandsDiscovered },
            details: 'Adding root land cell to BFS queue.',
          },
        };

        // Run BFS for this island
        while (queue.length > 0) {
          const [cr, cc] = queue.shift()!;
          cellsProcessed++;
          currentGrid[cr][cc] = islandsDiscovered + 1; // 2 or 3 (sunk island)

          yield {
            type: 'step',
            codeLine: 5,
            dataState: {
              structure: 'grid-matrix',
              mode: 'islands',
              grid: currentGrid.map((row) => [...row]),
              visitedCells: [...visitedCells],
              queue: [...queue],
              currentCell: [cr, cc],
              islandsCount: islandsDiscovered,
              stats: {
                islandsCount: islandsDiscovered,
                cellsProcessed,
                queueSize: queue.length,
                gridSize: `${rows} × ${cols}`,
              },
            },
            message: `Dequeued cell (${cr}, ${cc}). Sunk into Island #${islandsDiscovered}. Now checking 4-directional cardinal neighbors.`,
            reason: {
              action: `Process Cell (${cr}, ${cc})`,
              why: `Expanding contiguous land from cell (${cr}, ${cc}). Checking adjacent tiles (North, South, East, West).`,
              rule: '[cr, cc] = queue.pop()',
              values: { r: cr, c: cc, queueRemaining: [...queue] },
              details: 'FIFO queue processes cells in expanding wavefront order.',
            },
          };

          for (const { dr, dc, name } of directions) {
            const nr = cr + dr;
            const nc = cc + dc;

            const isOutOfBounds = nr < 0 || nr >= rows || nc < 0 || nc >= cols;
            const isWater = !isOutOfBounds && currentGrid[nr][nc] === 0;
            const isAlreadyVisited = !isOutOfBounds && (currentGrid[nr][nc] === 2 || currentGrid[nr][nc] === 3 || currentGrid[nr][nc] === '✦' || currentGrid[nr][nc] === '★');
            const isUnvisitedLand = !isOutOfBounds && currentGrid[nr][nc] === 1;

            yield {
              type: 'compare',
              codeLine: 7,
              dataState: {
                structure: 'grid-matrix',
                mode: 'islands',
                grid: currentGrid.map((row) => [...row]),
                visitedCells: [...visitedCells],
                queue: [...queue],
                currentCell: [cr, cc],
                comparingCell: [nr, nc],
                islandsCount: islandsDiscovered,
                stats: {
                  islandsCount: islandsDiscovered,
                  cellsProcessed,
                  queueSize: queue.length,
                  gridSize: `${rows} × ${cols}`,
                },
              },
              message: `Checking ${name} neighbor at (${nr}, ${nc}): ${
                isOutOfBounds
                  ? 'OUT OF BOUNDS (Skip)'
                  : isWater
                  ? 'WATER 0 (Skip)'
                  : isAlreadyVisited
                  ? 'ALREADY SUNK (Skip)'
                  : 'UNVISITED LAND 1 (Enqueue!)'
              }`,
              reason: {
                action: `Check neighbor (${nr}, ${nc})`,
                why: isOutOfBounds
                  ? `Coordinates (${nr}, ${nc}) exceed grid boundaries (${rows}x${cols}).`
                  : isWater
                  ? `Cell (${nr}, ${nc}) is water ('0'). Cannot expand island across water.`
                  : isAlreadyVisited
                  ? `Cell (${nr}, ${nc}) is already visited or sunk.`
                  : `Cell (${nr}, ${nc}) is connected land! Will enqueue and sink.`,
                rule: 'if inBounds && grid[nr][nc] == 1: queue.push([nr, nc])',
                values: {
                  from: `(${cr}, ${cc})`,
                  neighbor: `(${nr}, ${nc})`,
                  direction: name,
                  inBounds: !isOutOfBounds,
                  cellValue: isOutOfBounds ? 'N/A' : currentGrid[nr][nc],
                },
                details: isUnvisitedLand ? 'Valid expansion step!' : 'Direction pruned.',
              },
            };

            if (isUnvisitedLand) {
              currentGrid[nr][nc] = islandsDiscovered === 1 ? '✦' : '★';
              queue.push([nr, nc]);
              visitedCells.push([nr, nc]);

              yield {
                type: 'step',
                codeLine: 8,
                dataState: {
                  structure: 'grid-matrix',
                  mode: 'islands',
                  grid: currentGrid.map((row) => [...row]),
                  visitedCells: [...visitedCells],
                  queue: [...queue],
                  currentCell: [nr, nc],
                  islandsCount: islandsDiscovered,
                  stats: {
                    islandsCount: islandsDiscovered,
                    cellsProcessed,
                    queueSize: queue.length,
                    gridSize: `${rows} × ${cols}`,
                  },
                },
                message: `Enqueued adjacent land (${nr}, ${nc}) to BFS queue. Queue length: ${queue.length}.`,
                reason: {
                  action: `Enqueue Neighbor (${nr}, ${nc})`,
                  why: `Connected land tile attached to Island #${islandsDiscovered}.`,
                  rule: 'queue.push([nr, nc]); markQueued()',
                  values: { queuedCell: `(${nr}, ${nc})`, queue: [...queue] },
                  details: 'Wavefront expansion continues.',
                },
              };
            }
          }
        }
      }
    }
  }

  yield {
    type: 'complete',
    codeLine: 10,
    dataState: {
      structure: 'grid-matrix',
      mode: 'islands',
      grid: currentGrid.map((row) => [...row]),
      visitedCells: [...visitedCells],
      queue: [],
      currentCell: null,
      islandsCount: islandsDiscovered,
      stats: {
        islandsCount: islandsDiscovered,
        cellsProcessed,
        queueSize: 0,
        gridSize: `${rows} × ${cols}`,
      },
    },
    message: `Flood Fill complete! Discovered and mapped a total of ${islandsDiscovered} disconnected islands. Processed ${cellsProcessed} land tiles.`,
    reason: {
      action: 'Flood Fill Finished',
      why: 'All 20 cells in the 4x5 grid have been scanned. All land components have been completely sunk.',
      rule: 'Full 2D Scan Complete: O(M * N) time complexity',
      values: { totalIslands: islandsDiscovered, landTilesSunk: visitedCells.length },
      details: 'All islands color-coded and accounted for.',
    },
  };
}

// =================================================================
// 2. SPIRAL ORDER MATRIX TRAVERSAL & BOUNDARY CONTRACTIONS (>= 25 STEPS)
// =================================================================
export function* generateSpiralSteps(): Generator<StepAction, void, unknown> {
  // 4x4 Matrix with numbers 1 to 16
  const matrix: number[][] = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];

  const rows = matrix.length;
  const cols = matrix[0].length;
  const totalElements = rows * cols;

  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;

  const spiralOutput: number[] = [];
  const visitedCells: [number, number][] = [];

  yield {
    type: 'start',
    codeLine: 1,
    dataState: {
      structure: 'grid-matrix',
      mode: 'spiral',
      grid: matrix,
      spiralOutput: [...spiralOutput],
      visitedCells: [...visitedCells],
      currentCell: null,
      boundaries: { top, bottom, left, right },
      direction: 'RIGHT',
      stats: {
        visitedCount: 0,
        totalElements,
        boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
      },
    },
    message: `Spiral Order Traversal initialized for 4×4 Matrix. Initial boundaries: Top=0, Bottom=3, Left=0, Right=3.`,
    reason: {
      action: 'Initialize Boundaries',
      why: 'Spiral traversal contracts 4 boundary pointers (Top, Bottom, Left, Right) as outer perimeters are consumed.',
      rule: 'top = 0, bottom = rows-1, left = 0, right = cols-1',
      values: { top, bottom, left, right, totalCells: totalElements },
      details: 'Direction sequence repeats: RIGHT → DOWN → LEFT → UP.',
    },
  };

  while (top <= bottom && left <= right) {
    // 1. Traverse Right across Top row
    for (let c = left; c <= right; c++) {
      const val = matrix[top][c];
      spiralOutput.push(val);
      visitedCells.push([top, c]);

      yield {
        type: 'step',
        codeLine: 2,
        dataState: {
          structure: 'grid-matrix',
          mode: 'spiral',
          grid: matrix,
          spiralOutput: [...spiralOutput],
          visitedCells: [...visitedCells],
          currentCell: [top, c],
          boundaries: { top, bottom, left, right },
          direction: 'RIGHT',
          stats: {
            visitedCount: spiralOutput.length,
            totalElements,
            boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
          },
        },
        message: `[RIGHT] Visited cell (${top}, ${c}) = ${val}. Output: [${spiralOutput.join(', ')}].`,
        reason: {
          action: `Collect Cell (${top}, ${c}) = ${val}`,
          why: `Moving along top row (r=${top}) from left boundary (c=${left}) to right boundary (c=${right}).`,
          rule: 'output.push(matrix[top][c])',
          values: { row: top, col: c, value: val, direction: 'RIGHT' },
          details: 'Advancing rightward across active top perimeter.',
        },
      };
    }

    // Shrink Top boundary
    top++;
    yield {
      type: 'compare',
      codeLine: 3,
      dataState: {
        structure: 'grid-matrix',
        mode: 'spiral',
        grid: matrix,
        spiralOutput: [...spiralOutput],
        visitedCells: [...visitedCells],
        currentCell: null,
        boundaries: { top, bottom, left, right },
        direction: 'DOWN',
        stats: {
          visitedCount: spiralOutput.length,
          totalElements,
          boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
        },
      },
      message: `CONTRACT TOP BOUNDARY: top++ → Top is now ${top}. Top row fully processed.`,
      reason: {
        action: 'Shrink Top Boundary',
        why: 'The current top row is completely consumed. Shifting top boundary pointer downwards prevents re-visiting.',
        rule: 'top++',
        values: { newTop: top, remainingRows: bottom - top + 1 },
        details: 'Switching direction to DOWN.',
      },
    };

    if (top > bottom) break;

    // 2. Traverse Down along Right column
    for (let r = top; r <= bottom; r++) {
      const val = matrix[r][right];
      spiralOutput.push(val);
      visitedCells.push([r, right]);

      yield {
        type: 'step',
        codeLine: 4,
        dataState: {
          structure: 'grid-matrix',
          mode: 'spiral',
          grid: matrix,
          spiralOutput: [...spiralOutput],
          visitedCells: [...visitedCells],
          currentCell: [r, right],
          boundaries: { top, bottom, left, right },
          direction: 'DOWN',
          stats: {
            visitedCount: spiralOutput.length,
            totalElements,
            boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
          },
        },
        message: `[DOWN] Visited cell (${r}, ${right}) = ${val}. Output: [${spiralOutput.join(', ')}].`,
        reason: {
          action: `Collect Cell (${r}, ${right}) = ${val}`,
          why: `Moving along right column (c=${right}) from top boundary (r=${top}) to bottom boundary (r=${bottom}).`,
          rule: 'output.push(matrix[r][right])',
          values: { row: r, col: right, value: val, direction: 'DOWN' },
          details: 'Advancing downward along active right perimeter.',
        },
      };
    }

    // Shrink Right boundary
    right--;
    yield {
      type: 'compare',
      codeLine: 5,
      dataState: {
        structure: 'grid-matrix',
        mode: 'spiral',
        grid: matrix,
        spiralOutput: [...spiralOutput],
        visitedCells: [...visitedCells],
        currentCell: null,
        boundaries: { top, bottom, left, right },
        direction: 'LEFT',
        stats: {
          visitedCount: spiralOutput.length,
          totalElements,
          boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
        },
      },
      message: `CONTRACT RIGHT BOUNDARY: right-- → Right is now ${right}. Right column fully processed.`,
      reason: {
        action: 'Shrink Right Boundary',
        why: 'The current right column is completely consumed. Shifting right boundary pointer leftwards prevents re-visiting.',
        rule: 'right--',
        values: { newRight: right, remainingCols: right - left + 1 },
        details: 'Switching direction to LEFT.',
      },
    };

    if (left > right) break;

    // 3. Traverse Left across Bottom row
    for (let c = right; c >= left; c--) {
      const val = matrix[bottom][c];
      spiralOutput.push(val);
      visitedCells.push([bottom, c]);

      yield {
        type: 'step',
        codeLine: 6,
        dataState: {
          structure: 'grid-matrix',
          mode: 'spiral',
          grid: matrix,
          spiralOutput: [...spiralOutput],
          visitedCells: [...visitedCells],
          currentCell: [bottom, c],
          boundaries: { top, bottom, left, right },
          direction: 'LEFT',
          stats: {
            visitedCount: spiralOutput.length,
            totalElements,
            boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
          },
        },
        message: `[LEFT] Visited cell (${bottom}, ${c}) = ${val}. Output: [${spiralOutput.join(', ')}].`,
        reason: {
          action: `Collect Cell (${bottom}, ${c}) = ${val}`,
          why: `Moving along bottom row (r=${bottom}) from right boundary (c=${right}) to left boundary (c=${left}).`,
          rule: 'output.push(matrix[bottom][c])',
          values: { row: bottom, col: c, value: val, direction: 'LEFT' },
          details: 'Advancing leftward along active bottom perimeter.',
        },
      };
    }

    // Shrink Bottom boundary
    bottom--;
    yield {
      type: 'compare',
      codeLine: 7,
      dataState: {
        structure: 'grid-matrix',
        mode: 'spiral',
        grid: matrix,
        spiralOutput: [...spiralOutput],
        visitedCells: [...visitedCells],
        currentCell: null,
        boundaries: { top, bottom, left, right },
        direction: 'UP',
        stats: {
          visitedCount: spiralOutput.length,
          totalElements,
          boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
        },
      },
      message: `CONTRACT BOTTOM BOUNDARY: bottom-- → Bottom is now ${bottom}. Bottom row fully processed.`,
      reason: {
        action: 'Shrink Bottom Boundary',
        why: 'The current bottom row is completely consumed. Shifting bottom boundary pointer upwards.',
        rule: 'bottom--',
        values: { newBottom: bottom, remainingRows: bottom - top + 1 },
        details: 'Switching direction to UP.',
      },
    };

    if (top > bottom) break;

    // 4. Traverse Up along Left column
    for (let r = bottom; r >= top; r--) {
      const val = matrix[r][left];
      spiralOutput.push(val);
      visitedCells.push([r, left]);

      yield {
        type: 'step',
        codeLine: 8,
        dataState: {
          structure: 'grid-matrix',
          mode: 'spiral',
          grid: matrix,
          spiralOutput: [...spiralOutput],
          visitedCells: [...visitedCells],
          currentCell: [r, left],
          boundaries: { top, bottom, left, right },
          direction: 'UP',
          stats: {
            visitedCount: spiralOutput.length,
            totalElements,
            boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
          },
        },
        message: `[UP] Visited cell (${r}, ${left}) = ${val}. Output: [${spiralOutput.join(', ')}].`,
        reason: {
          action: `Collect Cell (${r}, ${left}) = ${val}`,
          why: `Moving along left column (c=${left}) from bottom boundary (r=${bottom}) up to top boundary (r=${top}).`,
          rule: 'output.push(matrix[r][left])',
          values: { row: r, col: left, value: val, direction: 'UP' },
          details: 'Advancing upward along active left perimeter.',
        },
      };
    }

    // Shrink Left boundary
    left++;
    yield {
      type: 'compare',
      codeLine: 9,
      dataState: {
        structure: 'grid-matrix',
        mode: 'spiral',
        grid: matrix,
        spiralOutput: [...spiralOutput],
        visitedCells: [...visitedCells],
        currentCell: null,
        boundaries: { top, bottom, left, right },
        direction: 'RIGHT',
        stats: {
          visitedCount: spiralOutput.length,
          totalElements,
          boundaries: `T:${top}, B:${bottom}, L:${left}, R:${right}`,
        },
      },
      message: `CONTRACT LEFT BOUNDARY: left++ → Left is now ${left}. Left column fully processed. Completed 1 full spiral loop!`,
      reason: {
        action: 'Shrink Left Boundary',
        why: 'The current left column is completely consumed. Outer boundary loop finished; shrinking to inner matrix core.',
        rule: 'left++',
        values: { newLeft: left, remainingCols: right - left + 1 },
        details: 'Switching direction to RIGHT for next concentric layer.',
      },
    };
  }

  yield {
    type: 'complete',
    codeLine: 10,
    dataState: {
      structure: 'grid-matrix',
      mode: 'spiral',
      grid: matrix,
      spiralOutput: [...spiralOutput],
      visitedCells: [...visitedCells],
      currentCell: null,
      boundaries: { top, bottom, left, right },
      direction: 'DONE',
      stats: {
        visitedCount: spiralOutput.length,
        totalElements,
        boundaries: `Finished (${spiralOutput.length}/${totalElements})`,
      },
    },
    message: `Spiral Matrix Traversal Complete! All 16 elements gathered in clockwise spiral order: [${spiralOutput.join(', ')}].`,
    reason: {
      action: 'Spiral Traversal Complete',
      why: 'All boundaries crossed (top > bottom || left > right). Every matrix cell was visited exactly once in O(M × N) time.',
      rule: 'All concentric layers consumed',
      values: { fullSequence: spiralOutput },
      details: 'O(1) auxiliary space traversal finished.',
    },
  };
}
