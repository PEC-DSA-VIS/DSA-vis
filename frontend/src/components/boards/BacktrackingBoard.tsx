import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { NQueensData, SudokuData } from '../../algorithms/backtrackingGenerators';
import { WhyPopup } from '../visualization/WhyPopup';
import { Crown, Sparkles, ShieldAlert, Undo2, CheckCircle2, Hash, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BacktrackingBoardProps {
  step: StepAction;
  onAskAI?: (reason: string) => void;
}

export const BacktrackingBoard: React.FC<BacktrackingBoardProps> = ({ step, onAskAI }) => {
  const data = (step.dataState || {}) as Partial<NQueensData & SudokuData>;
  const isQueens = data.n !== undefined || data.queensPlaced !== undefined || (step.message && step.message.toLowerCase().includes('queen'));

  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-0 p-3 sm:p-5 select-none overflow-y-auto">
      {/* Dynamic Sub-Board */}
      {isQueens ? (
        <NQueensView data={data as NQueensData} step={step} />
      ) : (
        <SudokuView data={data as SudokuData} step={step} />
      )}

      {/* Why Decision Callout */}
      <div className="w-full max-w-xl shrink-0 mt-3">
        <WhyPopup step={step} onAskAI={onAskAI} />
      </div>
    </div>
  );
};

// ============================================================================
// N-QUEENS BOARD COMPONENT
// ============================================================================
const NQueensView: React.FC<{ data: NQueensData; step: StepAction }> = ({ data, step }) => {
  const n = data.n || 4;
  const grid = data.grid || Array.from({ length: n }, () => Array(n).fill(0));
  const currentCell = data.currentCell;
  const conflictingQueen = data.conflictingQueen;
  const queensPlaced = data.queensPlaced ?? grid.reduce((acc, row) => acc + row.filter((c) => c === 1).length, 0);
  const placementsCount = data.placementsCount ?? 0;
  const backtracksCount = data.backtracksCount ?? 0;
  const isBacktracking = data.isBacktracking || (step.type as string) === 'backtrack';
  const isComplete = step.type === 'found' || step.type === 'complete';

  // Gather placed queen coordinates for partial solution display
  const queenCoords: [number, number][] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r]?.[c] === 1) queenCoords.push([r, c]);
    }
  }

  // Cell size dynamic based on N (N=4 vs N=8)
  const cellSize = n === 8 ? 'w-8 h-8 sm:w-11 sm:h-11' : 'w-14 h-14 sm:w-18 sm:h-18';
  const iconSize = n === 8 ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-8 h-8 sm:w-10 sm:h-10';

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
      {/* Status & Real-time Backtracking Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-xs font-mono">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <Layers className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Board & Depth</span>
            <span className="font-bold text-foreground truncate">
              {n}x{n} | Row {currentCell ? currentCell[0] : isComplete ? n : 0}/{n}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <Crown className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Queens Placed</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {queensPlaced} / {n}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Placements</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{placementsCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <Undo2 className="w-4 h-4 text-purple-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Backtracks</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">{backtracksCount}</span>
          </div>
        </div>
      </div>

      {/* Partial Solution Mini-Tray */}
      <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-muted/40 border border-border text-xs font-mono">
        <span className="text-muted-foreground">Current Placements:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {queenCoords.length === 0 ? (
            <span className="text-muted-foreground/60 italic text-[11px]">Empty (Searching...)</span>
          ) : (
            queenCoords.map(([r, c], i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold"
              >
                Q({r},{c})
              </span>
            ))
          )}
        </div>
      </div>

      {/* Chessboard */}
      <div className="relative p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-amber-100/40 to-amber-200/20 dark:from-slate-900/60 dark:to-slate-950/80 border-2 border-amber-600/30 shadow-xl">
        {/* SVG Attack Line Overlay */}
        {currentCell && conflictingQueen && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            style={{ padding: '0.625rem' }}
          >
            <defs>
              <marker
                id="attack-arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
              </marker>
            </defs>
            <line
              x1={`${((conflictingQueen[1] + 0.5) / n) * 100}%`}
              y1={`${((conflictingQueen[0] + 0.5) / n) * 100}%`}
              x2={`${((currentCell[1] + 0.5) / n) * 100}%`}
              y2={`${((currentCell[0] + 0.5) / n) * 100}%`}
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              markerEnd="url(#attack-arrow)"
            />
          </svg>
        )}

        <div
          className="grid gap-1 rounded-xl overflow-hidden border border-border"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isDarkSquare = (r + c) % 2 === 1;
              const hasQueen = cell === 1;
              const isCurrent = currentCell && currentCell[0] === r && currentCell[1] === c;
              const isAttacking = conflictingQueen && conflictingQueen[0] === r && conflictingQueen[1] === c;

              return (
                <div
                  key={`${r}-${c}`}
                  className={cn(
                    cellSize,
                    'relative flex items-center justify-center font-mono font-bold transition-all duration-200 rounded-md',
                    // Square checker pattern
                    isDarkSquare
                      ? 'bg-amber-100/70 dark:bg-slate-800/80 text-foreground'
                      : 'bg-white dark:bg-slate-900/70 text-foreground',
                    // Candidate active focus
                    isCurrent && !conflictingQueen && 'ring-3 ring-blue-500 scale-105 z-10 bg-blue-500/20',
                    // Conflict square
                    isCurrent && conflictingQueen && 'ring-3 ring-rose-500 scale-105 z-10 bg-rose-500/25',
                    // Attacking Queen highlight
                    isAttacking && 'ring-3 ring-rose-500 bg-rose-500/30 animate-pulse z-10',
                    // Backtracking undo pulse
                    isBacktracking && isCurrent && 'ring-3 ring-purple-500 bg-purple-500/20'
                  )}
                >
                  {/* Subtle rank/file notation corner */}
                  {c === 0 && (
                    <span className="absolute top-0.5 left-1 text-[8px] text-muted-foreground/60 select-none">
                      {n - r}
                    </span>
                  )}
                  {r === n - 1 && (
                    <span className="absolute bottom-0.5 right-1 text-[8px] text-muted-foreground/60 select-none">
                      {String.fromCharCode(97 + c)}
                    </span>
                  )}

                  {/* Queen Piece */}
                  <AnimatePresence>
                    {hasQueen && (
                      <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        className={cn(
                          'flex items-center justify-center',
                          isAttacking ? 'text-rose-500' : 'text-amber-500 dark:text-amber-400'
                        )}
                      >
                        <Crown className={cn(iconSize, 'fill-amber-400/30 stroke-[2] drop-shadow-md')} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Candidate testing indicator */}
                  {isCurrent && !hasQueen && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        'w-3 h-3 rounded-full',
                        conflictingQueen ? 'bg-rose-500' : 'bg-blue-500 ring-2 ring-blue-300 animate-ping'
                      )}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUDOKU BOARD COMPONENT
// ============================================================================
const SudokuView: React.FC<{ data: SudokuData; step: StepAction }> = ({ data, step }) => {
  const size = data.size || 4;
  const boxSize = data.boxSize || (size === 4 ? 2 : 3);
  const grid = data.grid || Array.from({ length: size }, () => Array(size).fill(0));
  const initialGrid = data.initialGrid || grid;
  const currentCell = data.currentCell;
  const conflictingCells = data.conflictingCells || [];
  const candidateDigits = data.candidateDigits || [];
  const testedDigit = data.testedDigit;
  const placementsCount = data.placementsCount ?? 0;
  const backtracksCount = data.backtracksCount ?? 0;
  const filledCount = data.filledCount ?? grid.reduce((acc, row) => acc + row.filter((c) => c !== 0).length, 0);
  const totalCells = size * size;

  const isConflicting = (r: number, c: number) =>
    conflictingCells.some(([cr, cc]) => cr === r && cc === c);

  const cellSize = size === 9 ? 'w-7 h-7 sm:w-10 sm:h-10 text-xs sm:text-base' : 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl';

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
      {/* Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-xs font-mono">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <Hash className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Grid & Filled</span>
            <span className="font-bold text-foreground truncate">
              {size}x{size} | {filledCount}/{totalCells}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Placements</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{placementsCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <Undo2 className="w-4 h-4 text-purple-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Backtracks</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">{backtracksCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground uppercase">Remaining</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{totalCells - filledCount}</span>
          </div>
        </div>
      </div>

      {/* Candidate Numbers Strip */}
      <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-muted/40 border border-border text-xs font-mono">
        <span className="text-muted-foreground">Tested Candidate:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {testedDigit ? (
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
              Digit {testedDigit}
            </span>
          ) : (
            <span className="text-muted-foreground/60 italic text-[11px]">Selecting cell...</span>
          )}
          {candidateDigits.length > 0 && (
            <span className="text-muted-foreground text-[11px] ml-2">
              Valid remaining: [{candidateDigits.join(', ')}]
            </span>
          )}
        </div>
      </div>

      {/* Sudoku Grid */}
      <div className="p-3 rounded-2xl bg-card border-2 border-border shadow-xl">
        <div
          className="grid gap-0 border-2 border-foreground/80 rounded-lg overflow-hidden bg-background"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isInitial = initialGrid[r]?.[c] !== 0 && initialGrid[r]?.[c] !== undefined;
              const isCurrent = currentCell && currentCell[0] === r && currentCell[1] === c;
              const hasConflict = isConflicting(r, c);

              // Subgrid box borders
              const borderBottom = (r + 1) % boxSize === 0 && r + 1 < size;
              const borderRight = (c + 1) % boxSize === 0 && c + 1 < size;

              return (
                <div
                  key={`${r}-${c}`}
                  className={cn(
                    cellSize,
                    'relative flex items-center justify-center font-mono font-extrabold border border-border/50 transition-all duration-150',
                    borderBottom && 'border-b-2 border-b-foreground/70',
                    borderRight && 'border-r-2 border-r-foreground/70',
                    // States
                    isInitial && 'bg-muted/30 text-foreground font-black',
                    !isInitial && val !== 0 && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    isCurrent && 'ring-3 ring-blue-500 z-10 bg-blue-500/25 scale-105',
                    hasConflict && 'ring-3 ring-rose-500 bg-rose-500/25 text-rose-600 dark:text-rose-400 z-10'
                  )}
                >
                  <AnimatePresence mode="popLayout">
                    {val !== 0 ? (
                      <motion.span
                        key={val}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                      >
                        {val}
                      </motion.span>
                    ) : isCurrent && testedDigit ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        className="text-muted-foreground/60 text-sm"
                      >
                        {testedDigit}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
