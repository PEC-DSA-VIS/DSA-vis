import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import {
  HelpCircle,
  Sparkles,
  ChevronDown,
  Bot,
  Scale,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface WhyPopupProps {
  step: StepAction;
  onAskAI?: (stepReason: string) => void;
  // Optional anchor reference or target index
  activeAnchorIndex?: number | null;
}

export const WhyPopup: React.FC<WhyPopupProps> = ({ step, onAskAI }) => {
  const { isPlaying, speed, whyDisplayMode } = useAlgorithmStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  const reason = step.reason;
  const stepType = step.type;

  // In Minimal mode, only show why popups on key decision steps
  const isKeyStep = ['compare', 'swap', 'found', 'discard', 'rotate', 'mismatch', 'complete'].includes(stepType);
  const shouldRender = whyDisplayMode === 'beginner' || isKeyStep;

  // Duration in play mode scales with speed
  useEffect(() => {
    setVisible(true);
    setIsExpanded(false);

    if (isPlaying) {
      // In fast play, show briefly then fade
      const displayMs = Math.max(900, 2200 / speed);
      const timer = setTimeout(() => {
        if (isPlaying) {
          setVisible(false);
        }
      }, displayMs);
      return () => clearTimeout(timer);
    }
  }, [step, isPlaying, speed]);

  if (!shouldRender || !visible || !reason) {
    return null;
  }

  // Type-based aesthetic cosmic styling
  const getTypeConfig = () => {
    switch (stepType) {
      case 'compare':
        return {
          icon: Scale,
          color: 'text-amber-400',
          border: 'border-amber-500/40',
          bg: 'from-amber-950/40 to-slate-950/80',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'swap':
        return {
          icon: ArrowRightLeft,
          color: 'text-fuchsia-400',
          border: 'border-fuchsia-500/40',
          bg: 'from-fuchsia-950/40 to-slate-950/80',
          badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
        };
      case 'found':
      case 'sorted':
        return {
          icon: CheckCircle2,
          color: 'text-yellow-400',
          border: 'border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.25)]',
          bg: 'from-yellow-950/40 to-slate-950/90',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        };
      case 'discard':
        return {
          icon: Trash2,
          color: 'text-slate-400',
          border: 'border-slate-600/40',
          bg: 'from-slate-950/80 to-black/90',
          badge: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
        };
      case 'mismatch':
        return {
          icon: ShieldAlert,
          color: 'text-rose-400',
          border: 'border-rose-500/40',
          bg: 'from-rose-950/40 to-slate-950/80',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        };
      case 'backtrack':
        return {
          icon: ShieldAlert,
          color: 'text-purple-400',
          border: 'border-purple-500/40',
          bg: 'from-purple-950/40 to-slate-950/80',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        };
      case 'pointer':
        return {
          icon: ArrowRight,
          color: 'text-cyan-400',
          border: 'border-cyan-500/40',
          bg: 'from-cyan-950/40 to-slate-950/80',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        };
      default:
        return {
          icon: Sparkles,
          color: 'text-indigo-400',
          border: 'border-indigo-500/30',
          bg: 'from-indigo-950/30 to-slate-950/80',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div className="w-full max-w-xl mx-auto my-2 select-none relative z-20">
      {/* Hidden ARIA announcer for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {reason.action}: {reason.why} Triggered by rule {reason.rule}.
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${stepType}-${step.codeLine}-${reason.action}`}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={cn(
            'relative overflow-hidden rounded-xl border p-3.5 backdrop-blur-xl shadow-xl bg-gradient-to-b',
            config.bg,
            config.border
          )}
        >
          {/* Subtle pointer anchor arrow */}
          <div className="absolute -top-1.5 left-8 w-3 h-3 rotate-45 border-l border-t border-inherit bg-[#0b1020]" />

          {/* Top Row: Action Chip + Condition Rule Badge */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <div className="flex items-center gap-1.5">
              <Icon className={cn('w-4 h-4 shrink-0', config.color)} />
              <span className={cn('text-[11px] font-mono font-semibold px-2 py-0.5 rounded border', config.badge)}>
                {reason.action}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-black/40 px-2 py-0.5 rounded border border-white/5">
              <span className="text-muted-foreground/60">Rule:</span>
              <span className="text-cyan-300 font-medium">{reason.rule}</span>
            </div>
          </div>

          {/* Reason in Plain Sentence with Real Values */}
          <p className="text-xs sm:text-sm font-medium text-foreground leading-snug tracking-tight mb-2">
            {reason.why}
          </p>

          {/* Bottom Bar: "More why" expander + "Ask AI about this step" button */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5 gap-2 flex-wrap">
            {reason.details ? (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11px] text-muted-foreground hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer group"
              >
                <span>{isExpanded ? 'Less' : 'More why'}</span>
                <ChevronDown
                  className={cn('w-3 h-3 transition-transform text-muted-foreground/70 group-hover:text-cyan-400', isExpanded && 'rotate-180')}
                />
              </button>
            ) : (
              <span />
            )}

            {onAskAI && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] font-mono px-2 gap-1 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
                onClick={() => onAskAI(`Explain step: ${reason.action}. Why: ${reason.why} (Rule: ${reason.rule})`)}
              >
                <Bot className="w-3 h-3" />
                <span>Ask AI about this step</span>
              </Button>
            )}
          </div>

          {/* Deeper Intuition Expanded View */}
          <AnimatePresence>
            {isExpanded && reason.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden mt-2 pt-2 border-t border-white/5"
              >
                <p className="text-[11px] text-muted-foreground/90 font-mono leading-relaxed bg-black/30 p-2 rounded-lg border border-white/5">
                  💡 {reason.details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
