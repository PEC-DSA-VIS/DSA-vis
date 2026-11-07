import React, { useRef, useEffect } from 'react';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { StepAction } from '../../types';
import { History, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const StepLogPanel: React.FC = () => {
  const { steps, currentStepIndex, jumpToStep } = useAlgorithmStore();
  const activeStepRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStepIndex]);

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-xs select-none">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40 shrink-0">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Step Execution Log</span>
        </div>
        <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 font-bold">
          Step {currentStepIndex + 1} / {steps.length}
        </span>
      </div>

      <div className="flex-1 min-h-0 p-2 space-y-1.5 overflow-y-auto">
        {steps.map((step: StepAction, idx: number) => {
          const isActive = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;
          const reason = step.reason;

          return (
            <div
              key={idx}
              ref={isActive ? activeStepRef : null}
              onClick={() => jumpToStep(idx)}
              className={cn(
                'group flex items-start gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer border mb-1.5',
                isActive
                  ? 'bg-primary/10 border-primary text-foreground shadow-xs font-semibold'
                  : isPassed
                  ? 'bg-muted/30 border-border/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  : 'bg-muted/10 border-transparent text-muted-foreground/60 hover:bg-muted/40 hover:text-foreground'
              )}
            >
              {/* Step number badge */}
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 font-bold border',
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border'
                )}
              >
                {idx + 1}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-medium truncate',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {reason?.action || step.type.toUpperCase()}
                  </span>
                  {reason?.rule && (
                    <span className="text-[9px] font-mono text-muted-foreground bg-muted/60 px-1 py-0.2 rounded truncate max-w-[120px] border border-border/40">
                      {reason.rule}
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-tight line-clamp-2 text-foreground/90 font-mono">
                  {reason?.why || step.message}
                </p>
              </div>

              {isActive && <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 self-center" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
