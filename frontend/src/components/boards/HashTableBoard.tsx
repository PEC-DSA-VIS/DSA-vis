import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { HashTableDataState } from '../../algorithms/hashGenerators';
import { WhyPopup } from '../visualization/WhyPopup';
import {
  Hash,
  Database,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface HashTableBoardProps {
  step: StepAction<HashTableDataState>;
  onAskAI?: (stepReason: string) => void;
}

export const HashTableBoard: React.FC<HashTableBoardProps> = ({ step, onAskAI }) => {
  const data: HashTableDataState = step.dataState || ({} as any);
  const capacity = data.capacity || 7;
  const keyCount = data.keyCount || 0;
  const loadFactor = data.loadFactor ?? 0;
  const threshold = data.threshold ?? 0.75;
  const isChaining = data.probingMode === 'chaining' || (!data.slots?.length && !!data.buckets);
  const buckets = data.buckets || [];
  const slots = data.slots || [];
  const activeSlot = data.activeSlot ?? null;
  const formulaString = data.formulaString;
  const isResizing = data.isResizing;
  const exampleProblem = data.exampleProblem;
  const exampleData = data.exampleData;

  const loadPercent = Math.min(100, Math.round((loadFactor / threshold) * 100));

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[460px] p-4 select-none max-w-5xl mx-auto space-y-4">
      {/* 1. TOP METRICS & LOAD FACTOR BAR */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-border shadow-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Capacity (m):</span>
            <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-muted text-primary">
              {capacity}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-foreground">Keys (n):</span>
            <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-muted text-foreground">
              {keyCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Mode:</span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {data.probingMode || 'Separate Chaining'}
            </span>
          </div>
        </div>

        {/* Load factor α with visual progress bar */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground">Load Factor α:</span>
              <span
                className={cn(
                  'font-bold',
                  loadFactor >= threshold
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                )}
              >
                {loadFactor.toFixed(2)} / {threshold}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden mt-1 border border-border">
              <div
                className={cn(
                  'h-full transition-all duration-300 rounded-full',
                  loadFactor >= threshold ? 'bg-rose-500' : 'bg-primary'
                )}
                style={{ width: `${Math.min(100, (loadFactor / 1.0) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. FORMULA BANNER & EXAMPLE PROBLEM BANNER */}
      {exampleProblem && (
        <div className="w-full p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-bold">{exampleProblem}</span>
          </div>
          {exampleData?.targetSum && (
            <span className="px-2 py-0.5 rounded bg-blue-500/20 font-bold">
              Target: {exampleData.targetSum}
            </span>
          )}
        </div>
      )}

      {formulaString && (
        <motion.div
          key={formulaString}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'w-full p-3 rounded-xl border flex items-center justify-between font-mono text-xs font-semibold shadow-xs',
            isResizing
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-200 ring-2 ring-amber-500/20'
              : 'bg-muted/70 border-border text-foreground'
          )}
        >
          <div className="flex items-center gap-2.5">
            <Hash className="w-4 h-4 text-primary" />
            <span>{formulaString}</span>
          </div>
          {isResizing && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider">
              <Maximize2 className="w-3 h-3" />
              Dynamic Table Doubling
            </span>
          )}
        </motion.div>
      )}

      {/* 3. MAIN HASH TABLE BOARD (SEPARATE CHAINING OR OPEN ADDRESSING) */}
      <div className="w-full p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center min-h-[280px]">
        {isChaining ? (
          /* SEPARATE CHAINING LAYOUT */
          <div className="w-full flex flex-col gap-2.5 overflow-x-auto">
            {buckets.map((chain, slotIdx) => {
              const isActive = activeSlot === slotIdx;
              const hasItems = chain.length > 0;

              return (
                <div
                  key={slotIdx}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-xl border transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                      : 'bg-muted/30 border-border/70 hover:bg-muted/50'
                  )}
                >
                  {/* Bucket Header Slot */}
                  <div className="flex items-center justify-center w-14 h-10 rounded-lg bg-card border-2 font-mono font-bold text-xs shrink-0 shadow-xs">
                    <span className="text-muted-foreground mr-0.5">[</span>
                    <span className={isActive ? 'text-primary' : 'text-foreground'}>{slotIdx}</span>
                    <span className="text-muted-foreground ml-0.5">]</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />

                  {/* Chained Linked List Nodes */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <AnimatePresence>
                      {hasItems ? (
                        chain.map((keyVal, itemIdx) => {
                          const isLatest =
                            isActive && itemIdx === chain.length - 1 && step.type === 'insert';

                          return (
                            <React.Fragment key={`${slotIdx}-${itemIdx}-${keyVal}`}>
                              <motion.div
                                layout
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn(
                                  'h-10 px-3.5 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm shadow-xs transition-all',
                                  isLatest
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                                    : 'bg-card border-border text-foreground'
                                )}
                              >
                                <span>{keyVal}</span>
                              </motion.div>

                              {itemIdx < chain.length - 1 && (
                                <span className="text-xs font-mono font-bold text-primary">→</span>
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <span className="text-xs font-mono text-muted-foreground italic px-2">
                          NULL (empty bucket)
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* OPEN ADDRESSING CONTIGUOUS ARRAY LAYOUT */
          <div className="w-full flex flex-col items-center justify-center gap-4 py-2">
            <div className="text-xs font-mono text-muted-foreground">
              Contiguous Slots [0..{capacity - 1}] with Collision Probing
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 w-full max-w-4xl">
              {slots.map((val, idx) => {
                const isActive = activeSlot === idx;
                const isProbed = data.probeSequence?.includes(idx);
                const probeOrder = data.probeSequence ? data.probeSequence.indexOf(idx) : -1;
                const isOccupied = val !== null;

                return (
                  <motion.div
                    key={idx}
                    layout
                    className={cn(
                      'flex flex-col items-center justify-center p-2 rounded-xl border-2 min-h-[72px] font-mono transition-all relative',
                      isActive
                        ? step.type === 'mismatch'
                          ? 'bg-rose-500/15 border-rose-500 ring-2 ring-rose-500/30'
                          : 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30'
                        : isProbed
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : isOccupied
                        ? 'bg-card border-border shadow-xs'
                        : 'bg-muted/20 border-dashed border-border text-muted-foreground'
                    )}
                  >
                    {/* Probe sequence badge */}
                    {probeOrder >= 0 && (
                      <span className="absolute -top-2 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary text-white shadow-xs">
                        p={probeOrder}
                      </span>
                    )}

                    <span className="text-base font-bold text-foreground">
                      {isOccupied ? val : '—'}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">[{idx}]</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. WHY POPUP */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};
