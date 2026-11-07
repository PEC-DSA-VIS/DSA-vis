import React from 'react';
import { motion } from 'framer-motion';
import { StepAction } from '../../types';
import { DisjointSetDataState, KruskalEdge } from '../../algorithms/unionFindGenerators';
import { GitMerge, Network, CheckCircle2, XCircle, AlertTriangle, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';

interface DisjointSetBoardProps {
  step: StepAction<DisjointSetDataState>;
  onAskAI?: (stepReason: string) => void;
}

export const DisjointSetBoard: React.FC<DisjointSetBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || ({} as any);
  const parent: number[] = data.parent || [0, 1, 2, 3, 4, 5];
  const rank: number[] = data.rank || [0, 0, 0, 0, 0, 0];
  const components: number[][] = data.components || [];
  const kruskalEdges: KruskalEdge[] = data.kruskalEdges || [];
  const mstTotalWeight = data.mstTotalWeight ?? 0;
  const compressedNode = data.compressedNode ?? null;
  const operation = data.operation;
  const runningMetric = data.runningMetric;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[440px] p-4 select-none space-y-4 max-w-5xl mx-auto">
      {/* 1. TOP METRICS BAR */}
      <div className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-xs flex-wrap text-xs font-mono">
        <div className="flex items-center gap-3">
          <GitMerge className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">Union-Find (Path Compression & Rank)</span>
          {operation && (
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-bold text-[11px]">
              {operation}
            </span>
          )}
        </div>

        {mstTotalWeight > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Kruskal MST Weight:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
              {mstTotalWeight}
            </span>
          </div>
        )}
      </div>

      {runningMetric && (
        <div className="w-full p-2.5 rounded-lg bg-muted/60 border border-border font-mono text-xs text-foreground font-semibold flex items-center justify-between">
          <span>{runningMetric}</span>
        </div>
      )}

      {/* 2. MAIN LAYOUT: INTERNAL ARRAYS + KRUSKAL MST EDGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Parent & Rank Arrays */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block font-mono">
              1. Internal State Arrays (Parent & Rank)
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-2 text-muted-foreground text-[11px] text-left">Element i</th>
                    {parent.map((_, i) => (
                      <th key={i} className="p-2 text-primary font-bold">{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="p-2 text-muted-foreground text-[11px] text-left">Parent[i]</td>
                    {parent.map((p, i) => {
                      const isCompressed = compressedNode === i;
                      const isRoot = p === i;
                      return (
                        <td
                          key={i}
                          className={cn(
                            'p-2 font-bold transition-all',
                            isCompressed
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : isRoot
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-foreground'
                          )}
                        >
                          {p}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-2 text-muted-foreground text-[11px] text-left">Rank[i]</td>
                    {rank.map((r, i) => (
                      <td key={i} className="p-2 text-muted-foreground">
                        {r}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Connected Component Sets */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase font-mono block">
              Disjoint Sets ({components.length} Sets):
            </span>
            <div className="flex flex-wrap gap-2">
              {components.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted border border-border font-mono text-xs"
                >
                  <span className="text-primary font-bold">Root {comp[0]}:</span>
                  <span>[{comp.join(', ')}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kruskal's Minimum Spanning Tree Edge Evaluation */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block font-mono">
            2. Kruskal's MST Edge Queue (Cycle Detection)
          </span>

          <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
            {kruskalEdges.map((e, idx) => {
              const isConsidering = e.status === 'considering';
              const isAccepted = e.status === 'accepted';
              const isRejected = e.status === 'rejected';

              return (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-xl border font-mono text-xs transition-all',
                    isConsidering
                      ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/20'
                      : isAccepted
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                      : isRejected
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 opacity-60'
                      : 'bg-muted/40 border-border'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Edge ({e.u}, {e.v})</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                      Weight: {e.weight}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    {isAccepted && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACCEPTED (MST)
                      </span>
                    )}
                    {isRejected && (
                      <span className="flex items-center gap-1 text-rose-500">
                        <XCircle className="w-3.5 h-3.5" />
                        CYCLE REJECTED
                      </span>
                    )}
                    {isConsidering && (
                      <span className="text-amber-600 dark:text-amber-400">
                        EVALUATING...
                      </span>
                    )}
                    {!e.status && <span className="text-muted-foreground">QUEUED</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. EMBEDDED WHY POPUP */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};
