import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { BubbleSortData } from '../../algorithms/sorting/bubbleSort';
import { WhyPopup } from '../visualization/WhyPopup';
import { cn } from '../../lib/utils';
import { Sparkles, ArrowRightLeft } from 'lucide-react';

interface ArraySortBoardProps {
  step: StepAction<BubbleSortData | any>;
  onAskAI?: (context: string) => void;
}

export const ArraySortBoard: React.FC<ArraySortBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState;
  const array: number[] = data?.array || [];
  const comparingIndices = step.indices && step.type === 'compare' ? step.indices : (data?.comparing || []);
  const swappedIndices = step.indices && step.type === 'swap' ? step.indices : (data?.swapped || []);
  const sortedIndices: number[] = data?.sortedIndices || (step.type === 'complete' ? array.map((_, i) => i) : []);
  const isSwap = step.type === 'swap';

  const pointers = step.pointers || {};
  const pivotIdx = pointers.pivot ?? pointers.pivotFinal ?? (data?.pivotIndex ?? null);
  const pointerI = pointers.i ?? null;
  const pointerJ = pointers.j ?? null;
  const keyVal = data?.keyVal ?? null;
  const currentKeyIndex = data?.currentIndex ?? null;
  const comparingIndex = data?.comparingIndex ?? null;

  const maxValue = Math.max(...array, 100);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[280px] flex-1 p-2 sm:p-4 select-none relative">
      {/* Floating Insertion Sort Key Held Above Banner */}
      {keyVal !== null && (
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-2 px-3.5 py-1 mb-2 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold shadow-sm z-10"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Key Held Above Array: {keyVal}</span>
          <span className="text-muted-foreground text-[11px] font-normal">(comparing backwards for insert slot)</span>
        </motion.div>
      )}

      {/* Floating "WHY?" Pop-up Callout */}
      <WhyPopup step={step} onAskAI={onAskAI} />

      {/* Main Cosmic Bars Canvas - Elevated with generous height */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 w-full h-[320px] sm:h-[380px] px-4 pb-2 border-b border-border relative z-10 mt-1">
        {array.map((val, idx) => {
          const isComparing = comparingIndices.includes(idx);
          const isSwapped = swappedIndices.includes(idx);
          const isSorted = sortedIndices.includes(idx);
          const isPivot = idx === pivotIdx;
          const isKeySlot = keyVal !== null && (idx === comparingIndex || (comparingIndex === null && idx === currentKeyIndex));

          // Calculate percentage height
          const heightPercent = Math.max((val / maxValue) * 100, 14);

          let barStyle = 'bg-primary/10 border-primary/30 text-foreground font-semibold';
          let glowEffect = '';

          if (isPivot) {
            barStyle = 'bg-amber-500/25 border-amber-500 text-amber-800 dark:text-amber-200 ring-2 ring-amber-500/50';
            glowEffect = 'shadow-[0_0_20px_rgba(245,158,11,0.35)]';
          } else if (isComparing) {
            barStyle = 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30';
            glowEffect = 'shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse';
          } else if (isSwapped) {
            barStyle = 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-200 ring-2 ring-fuchsia-500/40';
            glowEffect = 'shadow-[0_0_25px_rgba(217,70,239,0.4)]';
          } else if (isSorted) {
            barStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300';
            glowEffect = 'shadow-[0_0_15px_rgba(16,185,129,0.25)]';
          }

          return (
            <div
              key={idx}
              className="flex flex-col items-center flex-1 max-w-[64px] min-w-[32px] h-full justify-end group relative"
            >
              {/* Swapping Arc Curved Movement */}
              <motion.div
                layout
                initial={{ y: 0 }}
                animate={{
                  y: isSwapped ? -24 : 0,
                  scale: isSwapped ? 1.08 : isComparing ? 1.04 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 340,
                  damping: 24,
                }}
                className="w-full flex flex-col items-center justify-end h-full"
              >
                {/* Active Swap Arc Trail Indicator */}
                {isSwapped && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-7 text-[10px] font-mono font-bold text-fuchsia-300 bg-fuchsia-950/80 px-1.5 py-0.5 rounded-full border border-fuchsia-400/40 shadow-[0_0_10px_rgba(217,70,239,0.5)] flex items-center gap-1"
                  >
                    <ArrowRightLeft className="w-2.5 h-2.5" />
                    <span>Arc</span>
                  </motion.div>
                )}

                {/* Pivot Clearly Marked Badge */}
                {isPivot && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-7 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500 shadow-sm flex items-center gap-1 z-20"
                  >
                    <span>Pivot</span>
                  </motion.div>
                )}

                {/* Insertion Sort Key Held Above Indicator */}
                {isKeySlot && (
                  <motion.div
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -top-11 text-[10px] font-mono font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-md border border-primary/40 shadow-sm flex items-center gap-1 z-20 whitespace-nowrap"
                  >
                    <span>Key: {keyVal}</span>
                  </motion.div>
                )}

                {/* Value Indicator Label */}
                <motion.span
                  layout
                  className={cn(
                    'text-xs font-mono font-bold mb-1.5 transition-colors',
                    isPivot && 'text-amber-500 scale-110 font-extrabold',
                    isComparing && 'text-amber-500 scale-110 font-extrabold',
                    isSwapped && 'text-fuchsia-500 scale-115 font-extrabold',
                    isSorted && 'text-emerald-500',
                    !isComparing && !isSwapped && !isSorted && !isPivot && 'text-muted-foreground'
                  )}
                >
                  {val}
                </motion.span>

                {/* Animated Glass Column Bar */}
                <motion.div
                  layout
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className={cn(
                    'w-full rounded-t-xl border-t border-x flex items-center justify-center relative overflow-hidden backdrop-blur-md transition-all duration-300',
                    barStyle,
                    glowEffect
                  )}
                >
                  {/* Subtle inner sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />
                </motion.div>
              </motion.div>

              {/* Subscript Index & Pointers (i, j) */}
              <div className="flex flex-col items-center mt-1">
                <span className="text-[10px] font-mono text-muted-foreground/80">
                  [{idx}]
                </span>
                <div className="flex gap-1 items-center mt-0.5 min-h-[16px]">
                  {idx === pointerI && (
                    <span className="px-1 text-[9px] font-mono font-bold rounded bg-blue-600 text-white shadow-sm">
                      i
                    </span>
                  )}
                  {idx === pointerJ && (
                    <span className="px-1 text-[9px] font-mono font-bold rounded bg-fuchsia-600 text-white shadow-sm">
                      j
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
