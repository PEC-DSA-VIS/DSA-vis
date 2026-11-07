import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { ArrowDown, ArrowUp, AlertTriangle, CheckCircle2, RotateCw, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';

interface StackQueueBoardProps {
  step: StepAction;
  onAskAI?: (stepReason: string) => void;
}

export const StackQueueBoard: React.FC<StackQueueBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || {};
  const structure: 'stack' | 'queue' | 'circular-queue' | 'deque' | 'priority-queue' =
    data.structure || 'stack';
  const isStack = structure === 'stack';
  const isCircularQueue = structure === 'circular-queue';
  const isPriorityQueue = structure === 'priority-queue';

  const items: (string | number)[] = data.items || [];
  const topIndex = data.topIndex ?? (isStack ? items.length - 1 : null);
  const frontIndex = data.frontIndex ?? 0;
  const rearIndex = data.rearIndex ?? (items.length - 1);
  const capacity = data.capacity || 8;
  const errorState = data.errorState;
  const inputString = data.inputString;
  const activeCharIndex = data.activeCharIndex;
  const runningMetric = data.runningMetric;
  const priorityList = data.priorityList || [];

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[440px] p-4 select-none space-y-4 max-w-5xl mx-auto">
      {/* 1. TOP METRICS & STATUS BAR */}
      <div className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-xs flex-wrap text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-foreground font-mono">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold">{structure.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            {isStack ? (
              <>
                <span className="text-muted-foreground">TOP:</span>
                <span className="font-bold text-primary">{topIndex !== null && topIndex >= 0 ? topIndex : 'EMPTY (-1)'}</span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground">FRONT:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{frontIndex}</span>
                <span className="text-muted-foreground ml-2">REAR:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{rearIndex}</span>
              </>
            )}
            <span className="text-muted-foreground ml-2">Cap:</span>
            <span className="font-bold">{capacity}</span>
          </div>
        </div>

        {/* Error / Warning Alert Badge */}
        {errorState && (
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border',
              errorState === 'overflow' && 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
              errorState === 'underflow' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
              errorState === 'syntax-error' && 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{errorState.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* 2. PARENTHESES INPUT STRING TAPE (IF PRESENT) */}
      {inputString && (
        <div className="w-full p-3 rounded-xl bg-card border border-border shadow-xs flex flex-col items-center justify-center gap-2">
          <span className="text-[11px] font-mono text-muted-foreground font-semibold">
            Input Expression Stream
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {inputString.split('').map((char: string, cIdx: number) => {
              const isCurrent = activeCharIndex === cIdx;
              return (
                <div
                  key={cIdx}
                  className={cn(
                    'w-9 h-9 rounded-lg border flex flex-col items-center justify-center font-mono font-bold text-sm transition-all',
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/30 scale-110'
                      : activeCharIndex !== null && cIdx < activeCharIndex
                      ? 'bg-muted/40 border-border text-muted-foreground opacity-60'
                      : 'bg-card border-border text-foreground'
                  )}
                >
                  <span>{char}</span>
                  <span className="text-[8px] text-muted-foreground">[{cIdx}]</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RUNNING METRIC BANNER */}
      {runningMetric && (
        <div className="w-full p-2.5 rounded-lg bg-muted/60 border border-border font-mono text-xs text-foreground font-semibold flex items-center justify-between">
          <span>{runningMetric}</span>
        </div>
      )}

      {/* 4. MAIN VISUALIZATION BOARD */}
      <div className="w-full p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center min-h-[260px]">
        {isStack ? (
          /* VERTICAL STACK BUCKET */
          <div className="flex items-end justify-center gap-8 w-full max-w-lg">
            <div className="relative flex flex-col-reverse items-center justify-start w-40 min-h-[220px] p-2 border-b-4 border-x-4 border-primary/50 bg-muted/30 rounded-b-2xl shadow-inner">
              <AnimatePresence>
                {items.map((val, idx) => {
                  const isTop = idx === items.length - 1;
                  const isActionTarget = step.indices?.includes(idx);

                  return (
                    <motion.div
                      key={`${idx}-${val}`}
                      layout
                      initial={{ y: -30, opacity: 0, scale: 0.8 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -30, opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className={cn(
                        'w-full h-10 mb-1.5 rounded-lg border-2 flex items-center justify-between px-3 font-mono font-bold text-sm shadow-xs transition-all',
                        isTop
                          ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                          : 'bg-card border-border text-foreground',
                        isActionTarget && 'ring-4 ring-primary'
                      )}
                    >
                      <span>{val}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">[{idx}]</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {items.length === 0 && (
                <div className="text-xs text-muted-foreground font-mono self-center my-auto">
                  [ Empty Stack: top = -1 ]
                </div>
              )}
            </div>

            {/* Pointers Legend */}
            <div className="flex flex-col gap-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-border">
                <ArrowDown className="w-4 h-4 text-emerald-500" />
                <span>Push: Inserts at TOP</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-border">
                <ArrowUp className="w-4 h-4 text-rose-500" />
                <span>Pop: Removes from TOP</span>
              </div>
            </div>
          </div>
        ) : isCircularQueue ? (
          /* CIRCULAR QUEUE (RING BUFFER SLOTS) */
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <RotateCw className="w-3.5 h-3.5 text-primary" />
              <span>Modulo Capacity Ring Buffer: (idx + 1) % {capacity}</span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {items.map((val, idx) => {
                const isFront = frontIndex === idx;
                const isRear = rearIndex === idx;
                const isOccupied = val !== '-';

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Pointer indicator tags above slot */}
                    <div className="h-6 flex items-center gap-1 mb-1">
                      {isFront && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white shadow-xs">
                          FRONT
                        </span>
                      )}
                      {isRear && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500 text-white shadow-xs">
                          REAR
                        </span>
                      )}
                    </div>

                    {/* Slot Box */}
                    <motion.div
                      layout
                      className={cn(
                        'w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-sm shadow-xs transition-all relative',
                        isFront && isRear
                          ? 'border-primary bg-primary/15 ring-2 ring-primary/30'
                          : isFront
                          ? 'border-blue-500 bg-blue-500/15 ring-2 ring-blue-500/20'
                          : isRear
                          ? 'border-purple-500 bg-purple-500/15 ring-2 ring-purple-500/20'
                          : isOccupied
                          ? 'border-border bg-card text-foreground'
                          : 'border-dashed border-border bg-muted/20 text-muted-foreground'
                      )}
                    >
                      <span>{val}</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5 font-normal">[{idx}]</span>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* REGULAR QUEUE / PRIORITY QUEUE CONVEYOR */
          <div className="flex items-center justify-center gap-2 w-full max-w-xl p-4 rounded-2xl bg-muted/30 border-y-2 border-primary/40 shadow-sm overflow-x-auto">
            <span className="text-[11px] font-mono font-bold text-muted-foreground mr-2 shrink-0">
              OUT ← FRONT
            </span>

            <AnimatePresence>
              {items.map((val, idx) => {
                const isFront = idx === 0;
                const isRear = idx === items.length - 1;

                return (
                  <motion.div
                    key={`${idx}-${val}`}
                    layout
                    initial={{ x: 25, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -25, opacity: 0 }}
                    className={cn(
                      'min-w-[70px] h-16 px-2.5 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0',
                      isFront
                        ? 'bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400'
                        : isRear
                        ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'bg-card border-border text-foreground'
                    )}
                  >
                    <span className="truncate max-w-[120px]">{val}</span>
                    <span className="text-[9px] text-muted-foreground font-normal">[{idx}]</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="text-xs text-muted-foreground font-mono py-4">
                [ Container is Empty ]
              </div>
            )}

            <span className="text-[11px] font-mono font-bold text-muted-foreground ml-2 shrink-0">
              REAR ← IN
            </span>
          </div>
        )}
      </div>

      {/* 5. EMBEDDED WHY POPUP */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};
