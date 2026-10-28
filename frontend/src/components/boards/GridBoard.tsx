import React from 'react';
import { motion } from 'framer-motion';
import {
  Waves,
  Mountain,
  Compass,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ListOrdered,
  Layers,
  Sparkles,
} from 'lucide-react';
import { StepAction } from '../../types';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';

interface GridBoardProps {
  step: StepAction;
  onAskAI?: (prompt: string) => void;
}

export const GridBoard: React.FC<GridBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || {};
  const mode = data.mode || (data.spiralOutput ? 'spiral' : 'islands');
  const grid: (string | number)[][] = data.grid || [];
  const currentCell: [number, number] | null = step.gridCell || data.currentCell || null;
  const comparingCell: [number, number] | null = data.comparingCell || null;
  const visitedCells: [number, number][] = step.visitedCells || data.visitedCells || [];
  const queue: [number, number][] = data.queue || [];
  const islandsCount = data.islandsCount ?? 0;
  const spiralOutput: number[] = data.spiralOutput || [];
  const boundaries = data.boundaries || null;
  const direction = data.direction || 'RIGHT';
  const stats = data.stats || {};

  if (!grid || grid.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-xs font-mono">
        No 2D Grid data present.
      </div>
    );
  }

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const isCellVisited = (r: number, c: number) => {
    return visitedCells.some(([vr, vc]) => vr === r && vc === c);
  };

  const getDirectionIcon = (dir: string) => {
    switch (dir) {
      case 'RIGHT':
        return <ArrowRight className="w-3.5 h-3.5 text-blue-500" />;
      case 'DOWN':
        return <ArrowDown className="w-3.5 h-3.5 text-amber-500" />;
      case 'LEFT':
        return <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />;
      case 'UP':
        return <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0 overflow-y-auto p-4 gap-4 bg-background select-none">
      {/* 1. TOP STATS BAR */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs flex-wrap shrink-0">
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Compass className="w-4 h-4 text-primary" />
            <span className="capitalize">{mode === 'spiral' ? 'Spiral Matrix Traversal' : '2D Grid Flood Fill & Islands'}</span>
          </div>

          {/* Mode Counters */}
          {mode === 'islands' && (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                <span>Islands Found:</span>
                <span className="font-bold">{islandsCount}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold font-mono">
                <span>Frontier Queue:</span>
                <span className="font-bold">{queue.length}</span>
              </div>
            </>
          )}

          {mode === 'spiral' && (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold font-mono">
                <span>Direction:</span>
                <span className="font-bold flex items-center gap-1">
                  {getDirectionIcon(direction)} {direction}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                <span>Collected:</span>
                <span className="font-bold">{spiralOutput.length} / {rows * cols}</span>
              </div>
              {boundaries && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold font-mono text-[11px]">
                  <span>Bounds:</span>
                  <span>T:{boundaries.top} B:{boundaries.bottom} L:{boundaries.left} R:{boundaries.right}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-[11px] font-mono text-muted-foreground">
          {rows} Rows × {cols} Columns
        </div>
      </div>

      {/* 2. PENDING QUEUE / OUTPUT STRIP */}
      {mode === 'islands' && queue.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5" /> BFS Queue:
          </span>
          {queue.map(([qr, qc], idx) => (
            <span
              key={idx}
              className={cn(
                'px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all',
                idx === 0
                  ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400 animate-pulse'
                  : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
              )}
            >
              ({qr}, {qc}) {idx === 0 && '← NEXT'}
            </span>
          ))}
        </div>
      )}

      {mode === 'spiral' && spiralOutput.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-muted-foreground font-bold shrink-0">Spiral Sequence:</span>
          {spiralOutput.map((val, idx) => (
            <span key={idx} className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-md bg-muted text-foreground border border-border font-bold text-[11px]">
                {val}
              </span>
              {idx < spiralOutput.length - 1 && (
                <span className="text-muted-foreground/60 text-xs">→</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* 3. 2D GRID DISPLAY CONTAINER */}
      <div className="flex flex-col items-center justify-center w-full min-h-[300px] sm:min-h-[380px] p-6 rounded-2xl bg-card/60 border border-border shadow-inner relative overflow-hidden">
        {/* Spiral Boundary Pointers (if mode === 'spiral' and boundaries available) */}
        {mode === 'spiral' && boundaries && (
          <div className="flex items-center gap-3 mb-4 text-xs font-mono text-muted-foreground flex-wrap justify-center">
            <span className={cn('px-2 py-1 rounded border', boundaries.top >= 0 ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 font-bold' : '')}>
              Top: Row {boundaries.top}
            </span>
            <span className={cn('px-2 py-1 rounded border', boundaries.bottom >= 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 font-bold' : '')}>
              Bottom: Row {boundaries.bottom}
            </span>
            <span className={cn('px-2 py-1 rounded border', boundaries.left >= 0 ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 font-bold' : '')}>
              Left: Col {boundaries.left}
            </span>
            <span className={cn('px-2 py-1 rounded border', boundaries.right >= 0 ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 font-bold' : '')}>
              Right: Col {boundaries.right}
            </span>
          </div>
        )}

        {/* Matrix Grid */}
        <div
          className="grid gap-2.5 p-4 rounded-2xl bg-card border border-border shadow-md"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isCurrent = currentCell && currentCell[0] === r && currentCell[1] === c;
              const isComparing = comparingCell && comparingCell[0] === r && comparingCell[1] === c;
              const visited = isCellVisited(r, c);

              // Islands logic
              const isWater = val === 0 || val === '0';
              const isUnvisitedLand = val === 1 || val === '1';
              const isQueued = val === '✦' || val === '★';
              const isSunkIsland1 = val === 2 || val === '2';
              const isSunkIsland2 = val === 3 || val === '3';

              // Spiral boundary in-range test
              const isInsideBoundaries =
                boundaries &&
                r >= boundaries.top &&
                r <= boundaries.bottom &&
                c >= boundaries.left &&
                c <= boundaries.right;

              return (
                <motion.div
                  key={`${r}-${c}`}
                  layout
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className={cn(
                    'w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center font-mono text-sm font-bold border transition-all duration-200 relative select-none',
                    // Current active cell
                    isCurrent &&
                      'ring-4 ring-amber-400 scale-105 z-10 shadow-lg bg-amber-500 text-white border-amber-400',
                    // Comparing neighbor cell
                    isComparing &&
                      'ring-4 ring-blue-400 scale-105 z-10 bg-blue-500 text-white border-blue-400 animate-pulse',
                    // Normal non-active states
                    !isCurrent && !isComparing && [
                      mode === 'islands' && [
                        isWater && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                        isUnvisitedLand && 'bg-amber-600/15 text-amber-700 dark:text-amber-300 border-amber-600/30',
                        isQueued && 'bg-blue-500/20 text-blue-600 border-blue-500/40 animate-pulse',
                        isSunkIsland1 && 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
                        isSunkIsland2 && 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/40',
                      ],
                      mode === 'spiral' && [
                        visited && 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
                        !visited && isInsideBoundaries && 'bg-card text-foreground border-border shadow-xs hover:border-primary/50',
                        !visited && !isInsideBoundaries && 'bg-muted/30 text-muted-foreground/40 border-border/40',
                      ],
                    ]
                  )}
                >
                  {/* Visual Icon for Islands */}
                  {mode === 'islands' && (
                    <div className="mb-0.5">
                      {isWater ? (
                        <Waves className="w-3.5 h-3.5 opacity-60" />
                      ) : (
                        <Mountain className="w-3.5 h-3.5" />
                      )}
                    </div>
                  )}

                  <span>{val}</span>

                  {/* Subscript Coordinates */}
                  <span className="text-[9px] opacity-60 absolute bottom-0.5 font-normal">
                    {r},{c}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. EMBEDDED WHY POPUP */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};
