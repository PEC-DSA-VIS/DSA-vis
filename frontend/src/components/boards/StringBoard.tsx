import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { StringData } from '../../algorithms/stringGenerators';
import { WhyPopup } from '../visualization/WhyPopup';
import { Hash, Check, X, ArrowDown, ArrowUp, Sparkles, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StringBoardProps {
  step: StepAction;
  onAskAI?: (reason: string) => void;
}

export const StringBoard: React.FC<StringBoardProps> = ({ step, onAskAI }) => {
  const data = (step.dataState || {}) as Partial<StringData>;
  const text = data.text || '';
  const pattern = data.pattern || '';
  const textChars = Array.from(text);
  const patternChars = Array.from(pattern);
  const lps = data.lps || [];
  const textPointer = data.textPointer ?? (step.pointers?.i !== undefined ? Number(step.pointers.i) : 0);
  const patPointer = data.patPointer ?? (step.pointers?.j !== undefined ? Number(step.pointers.j) : 0);
  const patternOffset = data.patternOffset ?? 0;
  const isMatch = data.isMatch;
  const leftPointer = data.leftPointer ?? (step.pointers?.left !== undefined ? Number(step.pointers.left) : null);
  const rightPointer = data.rightPointer ?? (step.pointers?.right !== undefined ? Number(step.pointers.right) : null);
  const rollingHash = data.rollingHash;
  const patternHash = data.patternHash;
  const isPalindromeMode = data.phase === 'palindrome';
  const matchIndices = data.matchIndices || [];

  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-0 p-3 sm:p-5 select-none overflow-y-auto">
      <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between w-full gap-2 flex-wrap text-xs font-mono">
          {/* Rolling Hash Pill if in hash mode */}
          {patternHash !== undefined && rollingHash !== undefined && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
              <Hash className="w-4 h-4 text-purple-500 shrink-0" />
              <span>
                Pattern Hash: <strong className="text-purple-600 dark:text-purple-400">{patternHash}</strong> | Window Hash:{' '}
                <strong className={cn(rollingHash === patternHash ? 'text-emerald-500' : 'text-foreground')}>
                  {rollingHash}
                </strong>
              </span>
            </div>
          )}

          {/* Match Counter if present */}
          {matchIndices.length > 0 && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold ml-auto">
              <Check className="w-4 h-4" />
              <span>Matches Found: {matchIndices.length}</span>
            </div>
          )}
        </div>

        {/* Text & Sliding Pattern Box */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-md w-full space-y-4">
          {/* 1. Source Text Row */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              <span>{isPalindromeMode ? 'Palindrome String' : 'Source Text (T)'}</span>
              <span className="font-mono text-[11px] text-foreground lowercase">length: {text.length}</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {textChars.map((ch, idx) => {
                const isCurrentText = !isPalindromeMode && idx === textPointer;
                const isLeft = isPalindromeMode && leftPointer === idx;
                const isRight = isPalindromeMode && rightPointer === idx;
                const isMatchedOccurrence = matchIndices.some((m) => idx >= m && idx < m + patternChars.length);

                return (
                  <div key={idx} className="flex flex-col items-center relative min-w-8">
                    {/* Character Card */}
                    <motion.div
                      layout
                      className={cn(
                        'w-8 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm transition-all',
                        isCurrentText &&
                          (isMatch === true
                            ? 'bg-emerald-500 text-white border-emerald-600 ring-3 ring-emerald-400 scale-105 z-10'
                            : isMatch === false
                            ? 'bg-rose-500 text-white border-rose-600 ring-3 ring-rose-400 scale-105 z-10'
                            : 'bg-amber-500 text-white border-amber-600 ring-3 ring-amber-400 scale-105 z-10'),
                        (isLeft || isRight) &&
                          (isMatch === true
                            ? 'bg-emerald-500 text-white border-emerald-600 ring-3 ring-emerald-400 scale-105 z-10'
                            : isMatch === false
                            ? 'bg-rose-500 text-white border-rose-600 ring-3 ring-rose-400 scale-105 z-10'
                            : 'bg-blue-500 text-white border-blue-600 ring-3 ring-blue-400 scale-105 z-10'),
                        isMatchedOccurrence &&
                          !isCurrentText &&
                          'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500',
                        !isCurrentText && !isLeft && !isRight && !isMatchedOccurrence && 'bg-muted/50 text-foreground border-border'
                      )}
                    >
                      {ch}
                    </motion.div>

                    {/* Pointer Indicator */}
                    <span className="text-[9px] font-mono text-muted-foreground mt-0.5">{idx}</span>
                    {isCurrentText && (
                      <ArrowUp className="w-3.5 h-3.5 text-amber-500 mt-0.5 animate-bounce" />
                    )}
                    {isLeft && (
                      <span className="text-[9px] font-bold text-blue-500 uppercase mt-0.5">L</span>
                    )}
                    {isRight && (
                      <span className="text-[9px] font-bold text-purple-500 uppercase mt-0.5">R</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Sliding Pattern Row (Aligned dynamically by patternOffset!) */}
          {patternChars.length > 0 && !isPalindromeMode && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                <span>Pattern String (P) [Offset: {patternOffset}]</span>
                <span className="font-mono text-[11px] text-foreground lowercase">length: {pattern.length}</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {/* Spacer pads before pattern offset so pattern visually lines up with text! */}
                {Array.from({ length: Math.max(0, patternOffset) }).map((_, i) => (
                  <div key={`pad-${i}`} className="min-w-8 h-10 select-none opacity-0" />
                ))}

                {patternChars.map((ch, idx) => {
                  const isCurrentPat = idx === patPointer;

                  return (
                    <div key={idx} className="flex flex-col items-center min-w-8">
                      <motion.div
                        layout
                        className={cn(
                          'w-8 h-10 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm transition-all',
                          isCurrentPat &&
                            (isMatch === true
                              ? 'bg-emerald-500 text-white border-emerald-600 ring-3 ring-emerald-400 scale-105 z-10'
                              : isMatch === false
                              ? 'bg-rose-500 text-white border-rose-600 ring-3 ring-rose-400 scale-105 z-10'
                              : 'bg-blue-500 text-white border-blue-600 ring-3 ring-blue-400 scale-105 z-10'),
                          !isCurrentPat && 'bg-muted/30 text-foreground border-border'
                        )}
                      >
                        {ch}
                      </motion.div>
                      <span className="text-[9px] font-mono text-muted-foreground mt-0.5">p[{idx}]</span>
                      {isCurrentPat && (
                        <ArrowDown className="w-3.5 h-3.5 text-blue-500 -mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. KMP LPS Table (Live cell-by-cell construction) */}
          {lps.length > 0 && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs font-bold text-primary mb-2">
                <span>KMP LPS (Longest Prefix Suffix) Table:</span>
                <span className="text-[10px] text-muted-foreground font-mono">lps[i] = length of longest proper prefix</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {lps.map((val, idx) => {
                  const isPatActive = idx === patPointer;
                  const isBlank = val === null || val === undefined;

                  return (
                    <div key={idx} className="flex flex-col items-center min-w-8">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-xs transition-all',
                          isBlank && 'bg-muted/20 border-dashed border-border/70 text-muted-foreground/30',
                          !isBlank && 'bg-primary/10 text-primary border-primary/40 font-extrabold',
                          isPatActive && 'ring-2 ring-amber-400 scale-105 border-amber-500'
                        )}
                      >
                        {isBlank ? '·' : val}
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground mt-0.5">
                        {patternChars[idx] ? `${patternChars[idx]}` : idx}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why Decision Callout */}
      <div className="w-full max-w-xl shrink-0 mt-3">
        <WhyPopup step={step} onAskAI={onAskAI} />
      </div>
    </div>
  );
};
