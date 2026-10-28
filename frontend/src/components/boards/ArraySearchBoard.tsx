import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { StepAction } from '../../types';
import { BinarySearchData } from '../../algorithms/searching/binarySearch';
import { WhyPopup } from '../visualization/WhyPopup';
import { cn } from '../../lib/utils';
import { CheckCircle2, XCircle, Target, Sparkles } from 'lucide-react';

interface ArraySearchBoardProps {
  step: StepAction<BinarySearchData>;
  onAskAI?: (context: string) => void;
}

export const ArraySearchBoard: React.FC<ArraySearchBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState;
  const array = data?.array || [];
  const target = data?.target;
  const pointers = step.pointers || {};
  const low = pointers.low ?? (data ? data.low : null);
  const mid = pointers.mid ?? (data ? data.mid : null);
  const high = pointers.high ?? (data ? data.high : null);
  const discarded = step.discardedIndices || data?.discarded || [];
  const isFound = step.type === 'found';
  const isNotFound = step.type === 'not-found';

  // Supernova celestial burst when target is found
  useEffect(() => {
    if (isFound) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#fbbf24', '#f59e0b', '#22d3ee', '#ec4899', '#ffffff'],
        });
      } catch (e) {
        // safe ignore
      }
    }
  }, [isFound]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[300px] flex-1 p-4 sm:p-6 select-none relative">
      {/* Target & Comet Pointers Status Bar */}
      <div className="flex items-center gap-4 sm:gap-6 mb-4 flex-wrap justify-center z-10">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card border border-border shadow-sm">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Target:</span>
          <span className="font-mono text-base font-bold text-primary">{target}</span>
        </div>

        {/* Labeled Comet Markers Legend */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>low = {low !== null && low !== undefined ? low : '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-amber-500/50 text-amber-700 dark:text-amber-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span>mid = {mid !== null && mid !== undefined ? mid : '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-fuchsia-500/40 text-fuchsia-700 dark:text-fuchsia-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            <span>high = {high !== null && high !== undefined ? high : '—'}</span>
          </div>
        </div>

        {/* Supernova Found Status Badge */}
        <AnimatePresence>
          {isFound && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
              <span>Supernova Match at index {mid}!</span>
            </motion.div>
          )}
          {isNotFound && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40 text-xs font-bold shadow-sm"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Target not found in range</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating "WHY?" Pop-up Callout anchored above active element */}
      <WhyPopup step={step} onAskAI={onAskAI} />

      {/* Array Cosmic Tile Row */}
      <div className="flex items-end justify-center gap-2 sm:gap-3 flex-wrap max-w-full overflow-x-auto py-8 px-4 z-10">
        {array.map((val, idx) => {
          const isDiscarded = discarded.includes(idx);
          const isMid = mid === idx;
          const isLow = low === idx;
          const isHigh = high === idx;
          const activeIndices = step.indices || [];
          const isIndexActive = activeIndices.includes(idx);
          const customPointers = Object.entries(pointers)
            .filter(([k, pos]) => pos === idx && k !== 'low' && k !== 'mid' && k !== 'high')
            .map(([k]) => k);
          const isCurrentFound = (isFound && (mid === idx || isIndexActive)) || step.type === 'found';
          const isComparing = (step.type === 'compare' && (isMid || isIndexActive));
          const isSwap = step.type === 'swap' && isIndexActive;

          return (
            <div key={idx} className="flex flex-col items-center relative">
              {/* Comet Marker Badges Gliding Above */}
              <div className="h-8 flex items-center justify-center mb-1">
                <div className="flex gap-1 items-center flex-wrap justify-center">
                  {isLow && (
                    <motion.div
                      layoutId="comet-low"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                    >
                      <span>L</span>
                    </motion.div>
                  )}
                  {isMid && (
                    <motion.div
                      layoutId="comet-mid"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.9)] animate-pulse"
                    >
                      <span>M</span>
                    </motion.div>
                  )}
                  {isHigh && (
                    <motion.div
                      layoutId="comet-high"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-fuchsia-500 text-white shadow-[0_0_12px_rgba(217,70,239,0.9)]"
                    >
                      <span>H</span>
                    </motion.div>
                  )}
                  {customPointers.map((pName) => (
                    <motion.div
                      key={pName}
                      layoutId={`comet-${pName}`}
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-blue-600 text-white shadow-sm"
                    >
                      <span>{pName}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Glass Orb / Tile Element with Spring Physics */}
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className={cn(
                  'relative flex items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-2xl font-mono text-base sm:text-lg font-bold transition-all duration-300 select-none',
                  // Default Active State
                  !isDiscarded && !isComparing && !isSwap && !isIndexActive && !isCurrentFound && 'bg-card text-card-foreground border border-border shadow-sm hover:border-primary/40',
                  // Active Pointer Element
                  isIndexActive && !isComparing && !isSwap && !isCurrentFound && 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-2 border-blue-500 shadow-md scale-105 z-10',
                  // Comparing Element (Amber Pulse)
                  isComparing && !isCurrentFound && 'bg-amber-500/25 text-amber-700 dark:text-amber-300 border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105 z-10 animate-pulse',
                  // Swap Element (Fuchsia)
                  isSwap && 'bg-fuchsia-500/25 text-fuchsia-700 dark:text-fuchsia-300 border-2 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-105 z-10',
                  // Found State (Emerald Radiant Orb)
                  isCurrentFound && 'bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 font-extrabold border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-110 z-20',
                  // Discarded Zone
                  isDiscarded && 'opacity-40 text-muted-foreground scale-90 border-dashed border-border'
                )}
              >
                {val}

                {/* Found Ring Flare */}
                {isCurrentFound && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-2xl border-2 border-emerald-400 pointer-events-none"
                  />
                )}
              </motion.div>

              {/* Subscript Index Label */}
              <span className="mt-2 text-[10px] font-mono text-muted-foreground/80">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Live Calculation Formula Card */}
      {mid !== null && low !== null && high !== null && (
        <div className="mt-4 text-xs text-muted-foreground font-mono bg-card px-4 py-2 rounded-xl border border-border z-10 shadow-sm">
          Calculation: mid = floor(({low} + {high}) / 2) ={' '}
          <strong className="text-amber-600 dark:text-amber-400 font-bold">{mid}</strong> → Value arr[{mid}] ={' '}
          <strong className="text-primary font-bold">
            {typeof mid === 'number' ? array[mid] : ''}
          </strong>
        </div>
      )}
    </div>
  );
};
