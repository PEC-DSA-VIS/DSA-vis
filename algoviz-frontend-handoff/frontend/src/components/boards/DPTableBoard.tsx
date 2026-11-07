import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { DPTableData } from '../../algorithms/dpGenerators';
import { WhyPopup } from '../visualization/WhyPopup';
import { Table, Sparkles, CheckCircle2, ArrowRight, Layers, Calculator } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DPTableBoardProps {
  step: StepAction;
  onAskAI?: (reason: string) => void;
}

export const DPTableBoard: React.FC<DPTableBoardProps> = ({ step, onAskAI }) => {
  const data = (step.dataState || {}) as Partial<DPTableData>;
  const isFibCompare = data.type === 'fib-dual';

  // 1. Dual View: Memoization (Top-Down) vs Tabulation (Bottom-Up)
  if (isFibCompare) {
    const memoMap: Record<number, number> = data.memo || { 0: 0, 1: 1 };
    const tabArray: number[] = data.tab || [0, 1];
    const n = data.n || 6;
    const currentIdx = step.gridCell ? step.gridCell[1] : null;

    return (
      <div className="flex flex-col items-center justify-between w-full h-full min-h-0 p-3 sm:p-5 select-none overflow-y-auto">
        <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono font-bold text-foreground">
            <Layers className="w-4 h-4 text-primary" />
            <span>Fibonacci({n}): Top-Down (Memoization) vs Bottom-Up (Tabulation)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Top-Down Memoization Card */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground">
                  1. Top-Down: Memoization Hash Cache
                </span>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 font-bold">
                  Demand-Driven
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 font-mono text-xs">
                {Array.from({ length: n + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-2 rounded-xl border-2 text-center transition-all',
                      memoMap[i] !== undefined
                        ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400 font-extrabold shadow-xs'
                        : 'bg-muted/30 border-dashed border-border/70 text-muted-foreground/40',
                      currentIdx === i && 'ring-3 ring-amber-400 scale-105 border-amber-500 z-10'
                    )}
                  >
                    <span className="text-[9px] block opacity-70">F({i})</span>
                    <span className="text-sm">{memoMap[i] !== undefined ? memoMap[i] : '·'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom-Up Tabulation Card */}
            <div className="p-4 rounded-2xl bg-card border border-border shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-foreground">
                  2. Bottom-Up: Tabulation Array
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  Sequential Fill
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 font-mono text-xs">
                {Array.from({ length: n + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-2 rounded-xl border-2 text-center transition-all',
                      tabArray[i] !== undefined
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-xs'
                        : 'bg-muted/30 border-dashed border-border/70 text-muted-foreground/40',
                      currentIdx === i && 'ring-3 ring-amber-400 scale-105 border-amber-500 z-10'
                    )}
                  >
                    <span className="text-[9px] block opacity-70">dp[{i}]</span>
                    <span className="text-sm">{tabArray[i] !== undefined ? tabArray[i] : '·'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Decision Callout */}
        <div className="w-full max-w-xl shrink-0 mt-3">
          <WhyPopup step={step} onAskAI={onAskAI} />
        </div>
      </div>
    );
  }

  // 2. 2D DP Table (LCS, Knapsack, Coin Change, Matrix Chain)
  const matrix: (number | string | null)[][] = data.dpTable || [];
  const rowLabels: string[] = data.rowLabels || [];
  const colLabels: string[] = data.colLabels || [];
  const currentCell: [number, number] | null = step.gridCell || data.currentCell || null;
  const dependencyCells: [number, number][] = data.dependencyCells || [];
  const tracebackPath: [number, number][] = data.tracebackPath || [];
  const formula = data.formula;
  const solution = data.solution;

  const isDependency = (r: number, c: number) =>
    dependencyCells.some(([dr, dc]) => dr === r && dc === c);

  const isTraceback = (r: number, c: number) =>
    tracebackPath.some(([tr, tc]) => tr === r && tc === c);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-0 p-3 sm:p-5 select-none overflow-y-auto">
      <div className="flex flex-col items-center gap-3 w-full max-w-3xl">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between w-full gap-2 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
            <Table className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Current Cell</span>
              <span className="font-bold text-foreground">
                {currentCell ? `[${currentCell[0]}, ${currentCell[1]}]` : 'Complete'}
              </span>
            </div>
          </div>

          {solution && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Result: {solution}</span>
            </div>
          )}
        </div>

        {/* Live Formula Banner */}
        {formula && (
          <div className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-muted/40 border border-border text-xs font-mono text-muted-foreground">
            <Calculator className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold text-foreground truncate">{formula}</span>
          </div>
        )}

        {/* DP Table */}
        <div className="p-3.5 rounded-2xl bg-card border border-border shadow-lg overflow-x-auto max-w-full w-full">
          <table className="w-full text-center font-mono text-xs border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-muted-foreground text-[10px] border-b border-border"></th>
                {colLabels.map((c, i) => (
                  <th
                    key={i}
                    className="p-2 text-primary font-bold text-[11px] border-b border-border whitespace-nowrap"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r}>
                  <td className="p-2 text-primary font-bold text-[11px] border-r border-border whitespace-nowrap text-left">
                    {rowLabels[r] ?? r}
                  </td>
                  {row.map((val, c) => {
                    const isCurrent = currentCell && currentCell[0] === r && currentCell[1] === c;
                    const isDep = isDependency(r, c);
                    const isTb = isTraceback(r, c);
                    const isBlank = val === null || val === undefined;

                    return (
                      <td
                        key={c}
                        className={cn(
                          'p-2.5 border border-border/40 transition-all duration-200 min-w-10 h-10',
                          isBlank && 'bg-muted/15 text-muted-foreground/30',
                          !isBlank && !isCurrent && !isDep && !isTb && 'bg-card text-foreground font-semibold',
                          isDep && 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold ring-2 ring-blue-400 border-blue-500',
                          isCurrent && 'bg-amber-500 text-white font-black ring-3 ring-amber-400 scale-105 z-10 shadow-md',
                          isTb && 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-black ring-2 ring-emerald-500 shadow-sm'
                        )}
                      >
                        <AnimatePresence mode="popLayout">
                          {!isBlank ? (
                            <motion.span
                              key={String(val)}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                            >
                              {val}
                            </motion.span>
                          ) : (
                            <span className="text-muted-foreground/30 select-none">·</span>
                          )}
                        </AnimatePresence>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Decision Callout */}
      <div className="w-full max-w-xl shrink-0 mt-3">
        <WhyPopup step={step} onAskAI={onAskAI} />
      </div>
    </div>
  );
};
