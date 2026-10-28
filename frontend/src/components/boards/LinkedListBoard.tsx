import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepAction } from '../../types';
import { ArrowRight, ArrowLeft, RotateCw, AlertCircle, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';

export interface LinkedListNode {
  id: string | number;
  val: number | string;
  nextId?: string | number | null;
  prevId?: string | number | null;
}

interface LinkedListBoardProps {
  step: StepAction;
  onAskAI?: (stepReason: string) => void;
}

export const LinkedListBoard: React.FC<LinkedListBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || {};
  const nodes: LinkedListNode[] = data.nodes || [];
  const listType: 'singly' | 'doubly' | 'circular' | 'cycle' = data.listType || 'singly';
  const pointers: Record<string, string | number | null> = step.pointers || data.pointers || {};
  const cycleIndex = data.cycleIndex ?? null;
  const activeOp = data.activeOperation;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[420px] p-4 select-none space-y-4 max-w-5xl mx-auto">
      {/* Top Legend / Status Bar */}
      <div className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-xs flex-wrap text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-foreground font-mono">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Length: <strong>{nodes.length}</strong></span>
          </div>
          <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            {listType} List
          </span>
          {activeOp && (
            <span className="font-mono text-xs text-foreground font-medium hidden sm:inline-block">
              {activeOp}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <BadgePointers pointers={pointers} />
          {cycleIndex !== null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Cycle to [{cycleIndex}]</span>
            </div>
          )}
        </div>
      </div>

      {/* Nodes Chain Board */}
      <div className="w-full p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center min-h-[220px]">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground font-mono space-y-2">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-xs">
              NULL
            </div>
            <p className="text-sm font-semibold">Head = NULL (Empty Linked List)</p>
            <p className="text-xs text-muted-foreground">Allocate and link nodes to build the list live.</p>
          </div>
        ) : (
          <div className="flex items-center justify-start max-w-full overflow-x-auto py-6 px-4 gap-2 sm:gap-4">
            {nodes.map((node, idx) => {
              const isInspected = step.indices?.includes(idx);
              const activePointerNames = Object.entries(pointers)
                .filter(([_, ptrVal]) => ptrVal === idx || ptrVal === node.id || ptrVal === String(node.val))
                .map(([name]) => name);

              const isCycleTarget = cycleIndex === idx;

              return (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center relative">
                    {/* Floating pointer chips above node */}
                    <div className="h-8 flex items-end justify-center mb-1.5 gap-1">
                      <AnimatePresence>
                        {activePointerNames.map((name) => (
                          <motion.span
                            key={name}
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -6, opacity: 0 }}
                            className={cn(
                              'text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider',
                              name.toLowerCase().includes('slow') && 'bg-blue-500 text-white',
                              name.toLowerCase().includes('fast') && 'bg-purple-500 text-white',
                              name.toLowerCase().includes('head') && 'bg-emerald-500 text-white',
                              name.toLowerCase().includes('curr') && 'bg-amber-500 text-white',
                              name.toLowerCase().includes('prev') && 'bg-slate-500 text-white',
                              name.toLowerCase().includes('next') && 'bg-cyan-500 text-white',
                              !['slow', 'fast', 'head', 'curr', 'prev', 'next'].some((k) =>
                                name.toLowerCase().includes(k)
                              ) && 'bg-primary text-primary-foreground'
                            )}
                          >
                            {name}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Node Box */}
                    <motion.div
                      layout
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className={cn(
                        'w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold shadow-md transition-all duration-200 relative bg-card',
                        isInspected && 'border-amber-500 bg-amber-500/15 ring-4 ring-amber-500/20 scale-105',
                        activePointerNames.length > 0 && !isInspected && 'border-primary ring-2 ring-primary/20',
                        isCycleTarget && 'border-rose-500 bg-rose-500/15 ring-4 ring-rose-500/30'
                      )}
                    >
                      <span className="text-base text-foreground">{node.val}</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5 font-normal">
                        data
                      </span>

                      {/* Node Index label below */}
                      <span className="absolute -bottom-5 text-[10px] font-mono text-muted-foreground">
                        [{idx}]
                      </span>
                    </motion.div>
                  </div>

                  {/* Pointer Arrows between nodes */}
                  {idx < nodes.length - 1 && (
                    <div className="flex flex-col items-center justify-center text-muted-foreground px-1">
                      <ArrowRight className="w-5 h-5 text-primary stroke-[2.5]" />
                      {(listType === 'doubly' || listType === 'circular') && (
                        <ArrowLeft className="w-4 h-4 text-purple-500 stroke-[2] -mt-1" />
                      )}
                    </div>
                  )}

                  {/* End of list NULL or Circular Arrow */}
                  {idx === nodes.length - 1 && (
                    <div className="flex items-center gap-1.5 ml-1">
                      {listType === 'circular' ? (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Wrap to Head [0]</span>
                        </div>
                      ) : cycleIndex !== null ? (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-rose-500 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30">
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Loops to [{cycleIndex}]</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground border border-border">
                          NULL
                        </span>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Embedded WhyPopup */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};

function BadgePointers({ pointers }: { pointers: Record<string, string | number | null> }) {
  const entries = Object.entries(pointers).filter(([_, v]) => v !== null && v !== undefined);
  if (entries.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {entries.map(([k, v]) => (
        <span key={k} className="px-2 py-0.5 rounded-md bg-muted text-foreground border border-border font-mono text-xs">
          <strong>{k}</strong> → {v}
        </span>
      ))}
    </div>
  );
}
