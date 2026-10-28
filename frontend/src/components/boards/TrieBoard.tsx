import React from 'react';
import { motion } from 'framer-motion';
import { StepAction } from '../../types';
import { TrieDataState, TrieNodeInfo } from '../../algorithms/trieGenerators';
import { Search, Sparkles, FolderTree, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';

interface TrieBoardProps {
  step: StepAction<TrieDataState>;
  onAskAI?: (stepReason: string) => void;
}

export const TrieBoard: React.FC<TrieBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || ({} as any);
  const nodes: TrieNodeInfo[] = data.nodes || [];
  const words: string[] = data.words || [];
  const searchPrefix = data.searchPrefix || null;
  const foundMatches = data.foundMatches || [];
  const activeNodeId = data.activeNodeId || null;
  const activeChar = data.activeChar || null;
  const operation = data.operation;
  const runningMetric = data.runningMetric;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[440px] p-4 select-none space-y-4 max-w-5xl mx-auto">
      {/* 1. TOP QUERY & AUTOCOMPLETE BANNER */}
      <div className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-xs flex-wrap text-xs font-mono">
        <div className="flex items-center gap-3">
          <FolderTree className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">Trie (Prefix Tree)</span>
          {operation && (
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-bold text-[11px]">
              {operation}
            </span>
          )}
        </div>

        {searchPrefix && (
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Prefix Query: <strong className="text-primary text-sm font-bold">"{searchPrefix}"</strong></span>
          </div>
        )}
      </div>

      {runningMetric && (
        <div className="w-full p-2.5 rounded-lg bg-muted/60 border border-border font-mono text-xs text-foreground font-semibold flex items-center justify-between">
          <span>{runningMetric}</span>
          {foundMatches.length > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Matches: [{foundMatches.join(', ')}]
            </span>
          )}
        </div>
      )}

      {/* 2. VISUAL TRIE BOARD */}
      <div className="w-full p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-start min-h-[280px] space-y-6">
        {/* Dictionary Word Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center text-xs font-mono">
          <span className="text-muted-foreground font-bold mr-1">Stored Words:</span>
          {words.map((w, idx) => {
            const isMatched = foundMatches.includes(w);
            return (
              <span
                key={idx}
                className={cn(
                  'px-2.5 py-1 rounded-lg border font-bold text-xs transition-all',
                  isMatched
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 scale-105'
                    : 'bg-muted text-foreground border-border'
                )}
              >
                {w}
              </span>
            );
          })}
        </div>

        {/* Tree Node Representation */}
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center gap-3 flex-wrap max-w-3xl">
            {nodes.map((node) => {
              const isActive = activeNodeId === node.id;
              const isRoot = node.id === 'root';

              return (
                <motion.div
                  key={node.id}
                  layout
                  className={cn(
                    'flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all font-mono min-w-[64px] min-h-[64px] relative shadow-xs',
                    isActive
                      ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30 scale-110'
                      : node.isEndOfWord
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : isRoot
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-card border-border text-foreground'
                  )}
                >
                  <span className="text-base font-bold">{node.char}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {node.isEndOfWord ? `★ "${node.word}"` : node.parentId ? `↑ ${node.parentId.split('-').pop()}` : 'root'}
                  </span>
                </motion.div>
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
