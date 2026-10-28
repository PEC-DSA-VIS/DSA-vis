import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { WhyPopup } from '../visualization/WhyPopup';
import { GitFork, ArrowDown, ArrowUp, CheckCircle2, Split, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TreeNodeBox {
  id: string;
  parentId?: string;
  level: number;
  array: number[];
  status?: 'idle' | 'splitting' | 'comparing' | 'copying' | 'merged' | 'pivot';
  pointers?: { p1?: number; p2?: number };
  mergedSoFar?: number[];
  targetSize?: number;
  isPivot?: boolean;
}

export interface DivideConquerData {
  title?: string;
  mode?: 'merge-sort' | 'quick-sort' | 'binary-search';
  phase?: 'split' | 'merge' | 'partition' | 'halve' | 'complete';
  levels: {
    level: number;
    title: string;
    nodes: TreeNodeBox[];
  }[];
  activeNodeId?: string;
  comparisonValues?: { left: number; right: number };
  copiedValue?: number;
  pointer1Val?: number;
  pointer2Val?: number;
  sortedIndices?: number[];
  array?: number[];
}

interface DivideConquerBoardProps {
  step: StepAction<DivideConquerData | any>;
  onAskAI?: (context: string) => void;
}

export const DivideConquerBoard: React.FC<DivideConquerBoardProps> = ({ step, onAskAI }) => {
  const data: DivideConquerData = step.dataState || {};
  const levels = data.levels || [];
  const phase = data.phase || (step.type === 'complete' ? 'complete' : 'split');
  const activeNodeId = data.activeNodeId;
  const comparisonValues = data.comparisonValues;
  const copiedValue = data.copiedValue;

  return (
    <div className="flex flex-col items-center justify-between w-full min-h-[380px] flex-1 p-3 sm:p-5 select-none space-y-4 relative">
      {/* Top Phase & Pointer Status Bar */}
      <div className="flex items-center justify-between w-full flex-wrap gap-2 text-xs font-mono z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border shadow-sm">
          {phase === 'split' ? (
            <Split className="w-4 h-4 text-amber-500 animate-pulse" />
          ) : phase === 'merge' ? (
            <ArrowUp className="w-4 h-4 text-emerald-500 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span className="font-bold text-foreground">
            {phase === 'split'
              ? 'DIVIDE PHASE: Splitting into Halves'
              : phase === 'merge'
              ? 'COMBINE PHASE: Merging Subproblems Upward'
              : phase === 'partition'
              ? 'PARTITION PHASE: Left & Right Trees'
              : 'COMPLETED: Sorted Solution Built'}
          </span>
        </div>

        {/* Live Pointers & Active Comparison Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {comparisonValues && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 font-bold shadow-sm"
            >
              <span>Comparing:</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[11px]">
                P1: {comparisonValues.left}
              </span>
              <span>vs</span>
              <span className="px-1.5 py-0.5 rounded bg-fuchsia-600 text-white text-[11px]">
                P2: {comparisonValues.right}
              </span>
            </motion.div>
          )}

          {copiedValue !== undefined && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Copied Smaller Element: {copiedValue}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating "WHY?" Pop-up Callout */}
      <WhyPopup step={step} onAskAI={onAskAI} />

      {/* Main Multi-Level Split & Merge Tree Container */}
      <div className="flex flex-col items-center justify-start w-full flex-1 space-y-5 overflow-x-auto py-2 px-2 z-10">
        {levels.map((lvl, lvlIdx) => (
          <div key={`level-${lvl.level}`} className="flex flex-col items-center w-full">
            {/* Level Label */}
            <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              <span>{lvl.title}</span>
            </div>

            {/* Boxes on this Level */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap max-w-full">
              {lvl.nodes.map((node) => {
                const isActive = activeNodeId === node.id || node.status === 'splitting' || node.status === 'comparing';
                const isMerged = node.status === 'merged';
                const isCopying = node.status === 'copying';
                const isPivot = node.isPivot;

                // Elements to render: either the completed array, or elements merged so far
                const elements = node.mergedSoFar ?? node.array;
                const targetLen = node.targetSize ?? node.array.length;

                return (
                  <motion.div
                    key={node.id}
                    layout
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className={cn(
                      'flex flex-col items-center p-2 rounded-xl border transition-all duration-300 shadow-sm relative',
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 scale-105'
                        : isCopying
                        ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/30'
                        : isMerged
                        ? 'bg-emerald-500/10 border-emerald-500/50'
                        : isPivot
                        ? 'bg-amber-500/15 border-amber-500'
                        : 'bg-card border-border hover:border-primary/40'
                    )}
                  >
                    {/* Node Header Pill */}
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono text-muted-foreground">
                      <span className="font-bold text-foreground">
                        {isPivot ? 'Pivot' : `Size ${node.array.length}`}
                      </span>
                      {node.status && (
                        <span
                          className={cn(
                            'px-1 py-0.2 rounded text-[9px] uppercase font-bold',
                            isActive && 'bg-amber-500 text-black',
                            isMerged && 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
                            isCopying && 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                          )}
                        >
                          {node.status}
                        </span>
                      )}
                    </div>

                    {/* Array Cells in Box */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {elements.map((val, cellIdx) => {
                        const isJustCopied = copiedValue === val && isCopying;
                        return (
                          <motion.div
                            key={cellIdx}
                            layout
                            className={cn(
                              'w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-mono text-xs sm:text-sm font-bold flex items-center justify-center border shadow-xs select-none transition-all',
                              isJustCopied
                                ? 'bg-emerald-500 text-white border-emerald-400 scale-110 shadow-emerald-500/30'
                                : isMerged
                                ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/40'
                                : isActive
                                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500'
                                : 'bg-muted/60 text-foreground border-border'
                            )}
                          >
                            {val}
                          </motion.div>
                        );
                      })}

                      {/* Ghost slots for items remaining to be merged */}
                      {Array.from({ length: Math.max(0, targetLen - elements.length) }).map((_, ghostIdx) => (
                        <div
                          key={`ghost-${ghostIdx}`}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-dashed border-border/60 flex items-center justify-center font-mono text-xs text-muted-foreground/40"
                        >
                          —
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Downward Split Flow Connectors (between levels) */}
            {lvlIdx < levels.length - 1 && (
              <div className="flex items-center justify-center w-full my-2 text-muted-foreground/30">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
