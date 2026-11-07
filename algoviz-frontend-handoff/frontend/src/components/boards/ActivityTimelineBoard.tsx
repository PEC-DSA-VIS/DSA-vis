import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { ActivityTimelineData, ActivityItem } from '../../algorithms/greedyGenerators';
import { WhyPopup } from '../visualization/WhyPopup';
import { Calendar, CheckCircle2, XCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActivityTimelineBoardProps {
  step: StepAction;
  onAskAI?: (reason: string) => void;
}

export const ActivityTimelineBoard: React.FC<ActivityTimelineBoardProps> = ({ step, onAskAI }) => {
  const data = (step.dataState || {}) as Partial<ActivityTimelineData>;
  const activities: ActivityItem[] = data.sortedActivities?.length ? data.sortedActivities : (data.activities || []);
  const timelineMax = data.timelineMax || 12;
  const lastFinishTime = data.lastFinishTime ?? 0;
  const currentIndex = data.currentIndex ?? null;
  const acceptedCount = data.acceptedCount ?? 0;
  const rejectedCount = data.rejectedCount ?? 0;
  const phase = data.phase || 'evaluating';

  const timeTicks = Array.from({ length: timelineMax + 1 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full min-h-0 p-3 sm:p-5 select-none overflow-y-auto">
      <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-xs font-mono">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
            <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Phase</span>
              <span className="font-bold text-foreground capitalize truncate">{phase}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Accepted</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{acceptedCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Rejected</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{rejectedCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border shadow-xs">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase">Resource Busy Until</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">T = {lastFinishTime}</span>
            </div>
          </div>
        </div>

        {/* Timeline Visualization Card */}
        <div className="w-full p-4 rounded-2xl bg-card border border-border shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pb-2 border-b border-border">
            <span>Interval Scheduling Timeline (Hours 0 to {timelineMax})</span>
            <span className="text-[11px] text-primary font-semibold">Greedy Sort: Earliest Finish First</span>
          </div>

          {/* Timeline Axis Header with tick marks */}
          <div className="relative w-full h-8 flex items-end">
            {timeTicks.map((tick) => (
              <div
                key={tick}
                className="absolute flex flex-col items-center -translate-x-1/2"
                style={{ left: `${(tick / timelineMax) * 100}%` }}
              >
                <span className="text-[10px] font-mono font-semibold text-muted-foreground">{tick}</span>
                <div className="w-px h-2 bg-border mt-0.5" />
              </div>
            ))}
          </div>

          {/* Activities Stacked Bars */}
          <div className="relative flex flex-col gap-2.5 w-full py-2 min-h-[220px]">
            {/* Vertical resource finish line */}
            {lastFinishTime > 0 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10 pointer-events-none transition-all duration-300"
                style={{ left: `${(lastFinishTime / timelineMax) * 100}%` }}
              >
                <span className="absolute -top-3 left-1 text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap bg-background/80 px-1 rounded">
                  Lock: T={lastFinishTime}
                </span>
              </div>
            )}

            {activities.map((act, idx) => {
              const isCurrent = currentIndex === idx;
              const leftPercent = (act.start / timelineMax) * 100;
              const widthPercent = ((act.end - act.start) / timelineMax) * 100;

              return (
                <div key={act.id} className="relative w-full h-8 flex items-center">
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className={cn(
                      'absolute h-8 rounded-lg border-2 flex items-center px-2 text-xs font-mono font-bold transition-all duration-200 select-none overflow-hidden',
                      // Status colors
                      act.status === 'accepted' &&
                        'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-emerald-500/20 z-10',
                      act.status === 'rejected' &&
                        'bg-rose-500/10 border-rose-500/30 text-rose-600/70 dark:text-rose-400/60 line-through opacity-50',
                      act.status === 'comparing' &&
                        'bg-amber-500/25 border-amber-500 text-amber-700 dark:text-amber-300 ring-4 ring-amber-400/50 scale-[1.02] z-20',
                      act.status === 'pending' && 'bg-muted/50 border-border text-muted-foreground'
                    )}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(widthPercent, 8)}%`,
                    }}
                  >
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="truncate">{act.name}</span>
                      <span className="text-[10px] opacity-80 shrink-0 ml-1">
                        [{act.start}..{act.end}]
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Decision Callout */}
      <div className="w-full max-w-xl shrink-0 mt-3">
        <WhyPopup step={step} onAskAI={onAskAI} />
      </div>
    </div>
  );
};
