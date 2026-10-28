import React from 'react';
import { motion } from 'framer-motion';
import { StepAction } from '../../types';
import { WhyPopup } from '../visualization/WhyPopup';
import { Cpu, Binary, Hash, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BitBoardProps {
  step: StepAction;
  onAskAI?: (reason: string) => void;
}

export const BitBoard: React.FC<BitBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || {};
  const aVal = data.a ?? 25;
  const bVal = data.b;
  const resultVal = data.result ?? 0;
  const operation = data.operation || 'AND';
  const activeBitIndex = step.bitIndex ?? data.activeBitIndex ?? null;
  const computedBits: number[] = data.computedBits || [0, 1, 2, 3, 4, 5, 6, 7];
  const setBitsCount = data.setBitsCount;

  // Convert to 8-bit binary arrays (index 0 = MSB bit 7, index 7 = LSB bit 0)
  const toBits = (val: number): number[] => {
    const bits: number[] = [];
    for (let i = 7; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
    return bits;
  };

  const aBits = toBits(aVal);
  const bBits = bVal !== undefined ? toBits(bVal) : null;
  const resBits = toBits(resultVal);

  const bitWeights = [128, 64, 32, 16, 8, 4, 2, 1];

  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-0 p-3 sm:p-5 select-none overflow-y-auto">
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
        {/* Top Op Banner & Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full text-xs font-mono">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
            <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Operation</span>
              <span className="font-bold text-foreground truncate">{operation}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
            <Binary className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Active Bit</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {activeBitIndex !== null ? `Bit ${activeBitIndex} (2^${activeBitIndex})` : 'Word-level'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs col-span-2 sm:col-span-1">
            <Hash className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Set Bits / Result</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {setBitsCount !== undefined ? `${setBitsCount} bits (Val: ${resultVal})` : `Val: ${resultVal}`}
              </span>
            </div>
          </div>
        </div>

        {/* Bit Matrix Grid */}
        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border shadow-md w-full">
          {/* Bit Weights Header Row */}
          <div className="grid grid-cols-9 gap-1.5 text-center text-[10px] font-mono text-muted-foreground pb-1 border-b border-border">
            <span className="text-left font-bold text-foreground">Bit / Weight</span>
            {bitWeights.map((w, idx) => {
              const bitPos = 7 - idx;
              const isActive = activeBitIndex === bitPos;
              return (
                <span
                  key={idx}
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-amber-500 font-bold scale-110' : 'text-muted-foreground'
                  )}
                >
                  2^{bitPos} ({w})
                </span>
              );
            })}
          </div>

          {/* Row A */}
          <BitRow label={`A (${aVal})`} bits={aBits} activeIdx={activeBitIndex} color="blue" />

          {/* Row B */}
          {bBits && (
            <BitRow label={`B (${bVal})`} bits={bBits} activeIdx={activeBitIndex} color="purple" />
          )}

          {/* Divider with Operation Symbol */}
          <div className="relative py-1 border-t-2 border-primary/40 flex items-center justify-end">
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground absolute -top-3 right-4 shadow-sm">
              {operation}
            </span>
          </div>

          {/* Result Row (Forms bit-by-bit!) */}
          <BitRow
            label={`Result (${resultVal})`}
            bits={resBits}
            activeIdx={activeBitIndex}
            computedBits={computedBits}
            color="emerald"
            isResult
          />
        </div>
      </div>

      {/* Why Decision Callout */}
      <div className="w-full max-w-xl shrink-0 mt-3">
        <WhyPopup step={step} onAskAI={onAskAI} />
      </div>
    </div>
  );
};

function BitRow({
  label,
  bits,
  activeIdx,
  computedBits,
  color,
  isResult = false,
}: {
  label: string;
  bits: number[];
  activeIdx: number | null;
  computedBits?: number[];
  color: 'blue' | 'purple' | 'emerald';
  isResult?: boolean;
}) {
  return (
    <div className="grid grid-cols-9 gap-1.5 items-center">
      <span className="text-xs font-mono font-semibold text-foreground truncate pr-1">
        {label}
      </span>
      {bits.map((bit, idx) => {
        const bitPosition = 7 - idx;
        const isActive = activeIdx === bitPosition;
        const isComputed = !isResult || (computedBits && computedBits.includes(bitPosition));

        return (
          <motion.div
            key={idx}
            layout
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className={cn(
              'h-11 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-base transition-all duration-200',
              !isComputed
                ? 'bg-muted/20 border-dashed border-border/50 text-muted-foreground/30'
                : bit === 1
                ? color === 'blue'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400'
                  : color === 'purple'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'bg-emerald-500/25 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'bg-muted/40 border-border/80 text-muted-foreground',
              isActive && 'ring-4 ring-amber-400 scale-105 z-10 border-amber-500'
            )}
          >
            {isComputed ? bit : '·'}
          </motion.div>
        );
      })}
    </div>
  );
}
