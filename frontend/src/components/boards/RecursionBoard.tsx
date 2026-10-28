import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { Layers, ArrowRight, CornerDownLeft, Disc } from 'lucide-react';
import { WhyPopup } from '../visualization/WhyPopup';
import { cn } from '../../lib/utils';

interface RecursionBoardProps {
  step: StepAction;
  onAskAI?: (context: string) => void;
}

export const RecursionBoard: React.FC<RecursionBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || {};
  const isHanoi = data.type === 'hanoi';
  const callStack: { name: string; args: string; returnValue?: string | number }[] =
    step.callStack || data.callStack || [];

  // Tower of Hanoi Pegs View with Live Side-by-Side Call Stack
  if (isHanoi) {
    const pegs: Record<'A' | 'B' | 'C', number[]> = data.pegs || { A: [3, 2, 1], B: [], C: [] };
    const diskColors = [
      'bg-blue-600 dark:bg-blue-500 shadow-blue-500/20',
      'bg-amber-600 dark:bg-amber-500 shadow-amber-500/20',
      'bg-fuchsia-600 dark:bg-fuchsia-500 shadow-fuchsia-500/20',
      'bg-emerald-600 dark:bg-emerald-500 shadow-emerald-500/20',
    ];
    const moveNumber = data.moveNumber ?? 0;
    const totalMoves = data.totalMoves ?? 7;

    return (
      <div className="flex flex-col items-center justify-between w-full min-h-[340px] flex-1 p-3 sm:p-5 select-none space-y-4 relative">
        {/* Top Header Badge & Live Move Counter */}
        <div className="flex items-center justify-between w-full flex-wrap gap-2 text-xs font-mono z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-card border border-border shadow-sm text-foreground">
            <Disc className="w-4 h-4 text-primary animate-spin" />
            <span className="font-bold">Tower of Hanoi</span>
            <span className="text-muted-foreground">(Peg A → Peg C via Peg B)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold shadow-sm">
            <span>Move Counter:</span>
            <span className="text-sm font-extrabold">{moveNumber} / {totalMoves}</span>
          </div>
        </div>

        {/* Floating "WHY?" Pop-up Callout */}
        <WhyPopup step={step} onAskAI={onAskAI} />

        {/* Side-by-Side Area: Pegs on Left, Recursion Call Stack on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full flex-1 items-stretch z-10">
          {/* Left Column: The 3 Pegs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-end p-4 rounded-2xl bg-card border border-border shadow-sm min-h-[240px]">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full h-48 items-end justify-center">
              {(['A', 'B', 'C'] as const).map((pegKey) => {
                const disks = pegs[pegKey] || [];
                const isFrom = data.fromPeg === pegKey;
                const isTo = data.toPeg === pegKey;

                return (
                  <div key={pegKey} className="flex flex-col items-center h-full justify-end relative">
                    {/* Peg Indicator Tag */}
                    {(isFrom || isTo) && (
                      <span
                        className={cn(
                          'absolute -top-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase',
                          isFrom && 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30',
                          isTo && 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        )}
                      >
                        {isFrom ? 'FROM' : 'TO'}
                      </span>
                    )}

                    {/* Vertical Peg Stick */}
                    <div className="w-2.5 h-36 bg-muted-foreground/30 rounded-t-full absolute bottom-4 z-0" />

                    {/* Stack of Disks */}
                    <div className="flex flex-col-reverse items-center gap-1.5 z-10 w-full mb-4">
                      <AnimatePresence>
                        {disks.map((diskSize) => {
                          const widthPct = 30 + diskSize * 22;
                          const color = diskColors[(diskSize - 1) % diskColors.length];
                          const isBeingMoved = data.activeDisk === diskSize && isTo;

                          return (
                            <motion.div
                              key={diskSize}
                              layout
                              initial={{ y: -35, opacity: 0 }}
                              animate={{ y: 0, opacity: 1, scale: isBeingMoved ? [1, 1.08, 1] : 1 }}
                              exit={{ y: -35, opacity: 0 }}
                              transition={{ type: 'spring', damping: 24, stiffness: 340 }}
                              style={{ width: `${widthPct}%` }}
                              className={cn(
                                'h-6 rounded-md shadow-sm flex items-center justify-center font-mono font-bold text-xs text-white border border-white/20 select-none',
                                color
                              )}
                            >
                              <span>Disk {diskSize}</span>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {/* Base Plate & Peg Label */}
                    <div className="w-full h-5 rounded-md bg-muted border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground z-10 shadow-sm">
                      Peg {pegKey}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Recursion Call Stack Beside It (5 cols) */}
          <div className="lg:col-span-5 flex flex-col p-4 rounded-2xl bg-card border border-border shadow-sm min-h-[240px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border text-xs font-mono font-bold text-primary">
              <Layers className="w-4 h-4 text-primary" />
              <span>Recursion Call Stack</span>
              <span className="text-[10px] text-muted-foreground font-normal ml-auto">LIFO Depth: {callStack.length}</span>
            </div>

            <div className="flex flex-col-reverse justify-start gap-2 flex-1 overflow-y-auto pr-1">
              {callStack.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground font-mono">
                  Call stack empty. All recursive frames completed!
                </div>
              ) : (
                callStack.map((frame, idx) => {
                  const isTop = idx === callStack.length - 1;

                  return (
                    <motion.div
                      key={`${idx}-${frame.name}-${frame.args}`}
                      layout
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      className={cn(
                        'p-2.5 rounded-xl border font-mono text-xs shadow-sm flex items-center justify-between transition-all',
                        isTop
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-800 dark:text-amber-200 ring-2 ring-amber-500/20 font-bold'
                          : 'bg-muted/40 border-border text-muted-foreground'
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] opacity-60">#{idx + 1}</span>
                        <span className="font-bold text-primary">{frame.name}</span>
                        <span className="text-[11px]">({frame.args})</span>
                      </div>
                      {isTop && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-black">
                          ACTIVE
                        </span>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Call Stack Frames View (Factorial / Fibonacci)
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[380px] p-4 select-none space-y-4">
      <div className="text-xs font-mono font-bold text-primary px-3 py-1 rounded bg-primary/10 border border-primary/20">
        Call Stack Frames & Recursion Unwinding
      </div>

      <div className="flex flex-col-reverse items-center justify-start w-full max-w-md min-h-[260px] p-4 rounded-2xl bg-card border-2 border-primary/40 shadow-inner">
        <AnimatePresence>
          {callStack.map((frame, idx) => {
            const isTop = idx === callStack.length - 1;

            return (
              <motion.div
                key={`${idx}-${frame.name}-${frame.args}`}
                layout
                initial={{ y: -30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -30, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={cn(
                  'w-full p-2.5 mb-2 rounded-xl border-2 flex items-center justify-between font-mono text-xs shadow-sm transition-all',
                  isTop
                    ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/30 font-bold'
                    : 'bg-muted/50 border-border text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-primary">{frame.name}</span>
                  <span className="text-muted-foreground">({frame.args})</span>
                </div>
                {frame.returnValue !== undefined && (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <CornerDownLeft className="w-3 h-3" /> = {frame.returnValue}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
