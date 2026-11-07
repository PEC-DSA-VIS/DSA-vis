import React from 'react';
import { motion } from 'framer-motion';
import { StepAction } from '../../types';
import { Layers, ArrowDownUp, Database } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';

interface HeapDualBoardProps {
  step: StepAction;
  onAskAI?: (stepReason: string) => void;
}

// Dynamically compute non-overlapping x/y positions for any complete binary tree of size N
function computeHeapNodePositions(N: number, width = 360, height = 240) {
  const positions: { x: number; y: number }[] = [];
  const maxDepth = N > 0 ? Math.floor(Math.log2(N)) : 0;
  const levelHeight = maxDepth > 0 ? (height - 60) / maxDepth : 0;

  for (let i = 0; i < N; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const levelStart = Math.pow(2, depth) - 1;
    const levelCount = Math.pow(2, depth);
    const indexInLevel = i - levelStart;

    const slotWidth = width / (levelCount + 1);
    const x = Math.round(slotWidth * (indexInLevel + 1));
    const y = Math.round(35 + depth * levelHeight);

    positions.push({ x, y });
  }

  return positions;
}

export const HeapDualBoard: React.FC<HeapDualBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || {};
  const heapArray: number[] = data.heapArray || data.array || [40, 10, 30, 50, 60, 15, 25];
  const activeIndices = step.indices || [];
  const swapPair = data.swapPair || null;
  const heapSize = data.heapSize ?? heapArray.length;
  const heapType = data.heapType || 'Max-Heap';
  const operation = data.operation;
  const runningMetric = data.runningMetric;

  const nodePositions = computeHeapNodePositions(heapArray.length, 340, 220);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[440px] p-4 select-none space-y-4 max-w-5xl mx-auto">
      {/* 1. TOP HEADER & METRIC BAR */}
      <div className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-xs flex-wrap text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-bold">
            {heapType}: Synchronized Tree & Array View
          </span>
          {operation && (
            <span className="text-muted-foreground text-xs font-medium">
              {operation}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <span>Active Heap: <strong>{heapSize}</strong> / {heapArray.length}</span>
          <span>Parent: <strong>(i-1)/2</strong> | Left: <strong>2i+1</strong></span>
        </div>
      </div>

      {runningMetric && (
        <div className="w-full p-2.5 rounded-lg bg-muted/60 border border-border font-mono text-xs text-foreground font-semibold flex items-center justify-between">
          <span>{runningMetric}</span>
        </div>
      )}

      {/* 2. DUAL VIEW: TREE ON LEFT, ARRAY ON RIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Complete Binary Tree View */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col items-center justify-center min-h-[250px]">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 self-start font-mono flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            1. Binary Tree View
          </span>

          <svg viewBox="0 0 340 220" className="w-full max-w-[340px] h-[220px] overflow-visible" preserveAspectRatio="xMidYMid meet">
            {/* Tree Edges */}
            {heapArray.map((_, i) => {
              const leftChild = 2 * i + 1;
              const rightChild = 2 * i + 2;
              const pPos = nodePositions[i];
              if (!pPos) return null;

              return (
                <React.Fragment key={i}>
                  {leftChild < heapArray.length && nodePositions[leftChild] && (
                    <line
                      x1={pPos.x}
                      y1={pPos.y}
                      x2={nodePositions[leftChild].x}
                      y2={nodePositions[leftChild].y}
                      stroke="#94a3b8"
                      strokeWidth={2}
                    />
                  )}
                  {rightChild < heapArray.length && nodePositions[rightChild] && (
                    <line
                      x1={pPos.x}
                      y1={pPos.y}
                      x2={nodePositions[rightChild].x}
                      y2={nodePositions[rightChild].y}
                      stroke="#94a3b8"
                      strokeWidth={2}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {/* Tree Nodes */}
            {heapArray.map((val, i) => {
              const pos = nodePositions[i];
              if (!pos) return null;
              const isActive = activeIndices.includes(i);
              const isSwapped = swapPair && (swapPair[0] === i || swapPair[1] === i);
              const isSortedTail = i >= heapSize;

              return (
                <g key={i}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={17}
                    className={cn(
                      'stroke-2 transition-all duration-300',
                      isSwapped
                        ? 'fill-fuchsia-600 stroke-fuchsia-700 text-white'
                        : isActive
                        ? 'fill-amber-500 stroke-amber-600 text-white'
                        : isSortedTail
                        ? 'fill-muted stroke-border text-muted-foreground opacity-60'
                        : 'fill-card stroke-border text-foreground'
                    )}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    className={cn(
                      'font-mono font-bold text-xs select-none',
                      isActive || isSwapped ? 'fill-white' : 'fill-foreground'
                    )}
                  >
                    {val}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 24}
                    textAnchor="middle"
                    className="font-mono text-[9px] fill-muted-foreground"
                  >
                    [{i}]
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Synchronized Array Strip View */}
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col items-center justify-center min-h-[250px]">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 self-start font-mono flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-primary" />
            2. Contiguous Array View
          </span>

          <div className="flex items-center gap-2 flex-wrap justify-center w-full py-4">
            {heapArray.map((val, idx) => {
              const isActive = activeIndices.includes(idx);
              const isSwapped = swapPair && (swapPair[0] === idx || swapPair[1] === idx);
              const isSortedTail = idx >= heapSize;

              return (
                <motion.div
                  key={idx}
                  layout
                  className={cn(
                    'w-12 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-sm shadow-xs transition-all relative',
                    isSwapped
                      ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-300 ring-2 ring-fuchsia-500/30'
                      : isActive
                      ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30 scale-105'
                      : isSortedTail
                      ? 'bg-muted/40 border-border text-muted-foreground opacity-60'
                      : 'bg-card border-border text-foreground'
                  )}
                >
                  <span>{val}</span>
                  <span className="text-[10px] text-muted-foreground font-normal mt-0.5">[{idx}]</span>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground mt-4 pt-2 border-t border-border w-full justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Active/Comparing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></span>
              <span>Swap</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-muted border border-border"></span>
              <span>Sorted Boundary</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EMBEDDED WHY POPUP */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};
