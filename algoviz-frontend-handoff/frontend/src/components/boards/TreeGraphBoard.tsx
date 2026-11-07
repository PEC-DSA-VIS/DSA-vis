import React from 'react';
import { motion } from 'framer-motion';
import { StepAction } from '../../types';
import { GitFork, Network, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';

export interface TreeGraphNode {
  id: string | number;
  val: number | string;
  leftId?: string | number | null;
  rightId?: string | number | null;
  parentId?: string | number | null;
  height?: number;
  balanceFactor?: number;
  x?: number;
  y?: number;
  highlighted?: boolean;
  status?: string;
}

interface TreeGraphBoardProps {
  step: StepAction;
  onAskAI?: (stepReason: string) => void;
}

// Compute non-overlapping tree layout using in-order position for X and depth for Y
function computeTreeLayout(rawNodes: TreeGraphNode[], width = 680, height = 360): TreeGraphNode[] {
  if (!rawNodes || rawNodes.length === 0) return [];

  const nodeMap = new Map<string, TreeGraphNode>();
  rawNodes.forEach((n) => nodeMap.set(String(n.id), { ...n }));

  // Find root: node with no parent or whose parent is not in nodeMap
  let root = rawNodes[0];
  for (const n of rawNodes) {
    if (n.parentId === null || n.parentId === undefined || !nodeMap.has(String(n.parentId))) {
      root = n;
      break;
    }
  }

  // Calculate depths and max depth
  const depths = new Map<string, number>();
  let maxDepth = 0;
  function calcDepth(currId: string | number | undefined | null, d: number) {
    if (currId === null || currId === undefined || !nodeMap.has(String(currId))) return;
    depths.set(String(currId), d);
    if (d > maxDepth) maxDepth = d;
    const n = nodeMap.get(String(currId))!;
    if (n.leftId !== null && n.leftId !== undefined) calcDepth(n.leftId, d + 1);
    if (n.rightId !== null && n.rightId !== undefined) calcDepth(n.rightId, d + 1);
  }
  calcDepth(root.id, 0);

  // In-order traversal to assign X positions
  const inOrderList: string[] = [];
  function inOrder(currId: string | number | undefined | null) {
    if (currId === null || currId === undefined || !nodeMap.has(String(currId))) return;
    const n = nodeMap.get(String(currId))!;
    if (n.leftId !== null && n.leftId !== undefined) inOrder(n.leftId);
    inOrderList.push(String(n.id));
    if (n.rightId !== null && n.rightId !== undefined) inOrder(n.rightId);
  }
  inOrder(root.id);

  // If any nodes weren't visited in tree traversal, append them
  rawNodes.forEach((n) => {
    if (!inOrderList.includes(String(n.id))) {
      inOrderList.push(String(n.id));
      depths.set(String(n.id), depths.get(String(n.id)) ?? 0);
    }
  });

  const padX = 55;
  const padY = 50;
  const usableWidth = width - padX * 2;
  const usableHeight = height - padY * 2;
  const levelHeight = maxDepth > 0 ? usableHeight / Math.max(maxDepth, 1) : 0;
  const totalNodes = inOrderList.length;

  return rawNodes.map((n) => {
    const sId = String(n.id);
    const inOrderIdx = inOrderList.indexOf(sId);
    const rawX = totalNodes > 1 ? padX + (inOrderIdx * usableWidth) / (totalNodes - 1) : width / 2;
    const d = depths.get(sId) ?? 0;
    const rawY = padY + d * levelHeight;

    return {
      ...n,
      x: isNaN(rawX) ? width / 2 : Math.round(rawX),
      y: isNaN(rawY) ? padY : Math.round(rawY),
    };
  });
}

// Circular layout for general graphs
function computeGraphLayout(rawNodes: TreeGraphNode[], width = 680, height = 360): TreeGraphNode[] {
  if (!rawNodes || rawNodes.length === 0) return [];
  const N = rawNodes.length;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 55;

  return rawNodes.map((node, i) => {
    const angle = (2 * Math.PI * i) / N - Math.PI / 2;
    const rawX = centerX + radius * Math.cos(angle);
    const rawY = centerY + radius * Math.sin(angle);
    return {
      ...node,
      x: isNaN(rawX) ? centerX : Math.round(rawX),
      y: isNaN(rawY) ? centerY : Math.round(rawY),
    };
  });
}

export const TreeGraphBoard: React.FC<TreeGraphBoardProps> = ({ step, onAskAI }) => {
  const data = step.dataState || {};
  const isGraph = data.structure === 'graph';

  const rawNodes: TreeGraphNode[] = data.nodes || [];
  let edges: { from: string | number; to: string | number; weight?: number; active?: boolean }[] =
    data.edges || [];

  // Auto-derive edges if not explicitly provided
  if (edges.length === 0 && rawNodes.length > 0) {
    for (const n of rawNodes) {
      if (n.leftId !== null && n.leftId !== undefined) {
        edges.push({ from: n.id, to: n.leftId });
      }
      if (n.rightId !== null && n.rightId !== undefined) {
        edges.push({ from: n.id, to: n.rightId });
      }
    }
  }

  const activeNodeIds = (step.indices || []).map(String);
  if (data.activeNodeId !== undefined && data.activeNodeId !== null) {
    activeNodeIds.push(String(data.activeNodeId));
  }

  const traversalOutput: (string | number)[] = data.traversalOutput || data.visitedSequence || [];
  const callStack = data.callStack;
  const queueState = data.queueState;
  const runningMetric = data.runningMetric;

  // Compute Layout with safe fallbacks
  const nodes = isGraph
    ? computeGraphLayout(rawNodes, 680, 360)
    : computeTreeLayout(rawNodes, 680, 360);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-[440px] p-4 select-none space-y-4 max-w-5xl mx-auto">
      {/* 1. TOP STATUS & OPERATION BAR */}
      <div className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border shadow-xs flex-wrap text-xs font-mono">
        <div className="flex items-center gap-2.5">
          {isGraph ? <Network className="w-4 h-4 text-primary" /> : <GitFork className="w-4 h-4 text-primary" />}
          <span className="font-bold text-foreground">
            {isGraph ? 'Graph Structure' : 'Binary Tree / BST / AVL View'}
          </span>
          {data.operation && (
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-bold text-[11px]">
              {data.operation}
            </span>
          )}
        </div>

        {/* Balance factor indicator for AVL */}
        {data.balanceFactor !== undefined && (
          <div
            className={cn(
              'px-2.5 py-0.5 rounded-md font-bold text-xs border',
              data.balanced
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
            )}
          >
            BF: {data.balanceFactor} ({data.balanced ? 'Balanced' : `Imbalance: ${data.imbalanceType ?? 'Yes'}`})
          </div>
        )}
      </div>

      {/* 2. RUNNING METRIC / TRAVERSAL OUTPUT STRIP */}
      {(traversalOutput.length > 0 || runningMetric) && (
        <div className="w-full p-2.5 rounded-xl bg-muted/60 border border-border font-mono text-xs flex items-center justify-between flex-wrap gap-2">
          {traversalOutput.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-[11px]">Output Strip:</span>
              <div className="flex items-center gap-1">
                {traversalOutput.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-card border border-border font-bold text-xs text-primary shadow-2xs"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          )}

          {runningMetric && (
            <span className="text-muted-foreground text-xs font-medium ml-auto">
              {runningMetric}
            </span>
          )}
        </div>
      )}

      {/* 3. MAIN CANVAS: SVG TREE WITH AUTO-FIT VIEWBOX */}
      <div className="w-full p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground font-mono space-y-2">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
              NULL
            </div>
            <p className="text-sm font-semibold text-foreground">Root = NULL (Empty Tree)</p>
            <p className="text-xs text-muted-foreground">Tree will grow live node-by-node from this empty board.</p>
          </div>
        ) : (
          <svg
            viewBox="0 0 680 360"
            className="w-full h-full max-h-[380px] overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Draw Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => String(n.id) === String(edge.from));
              const toNode = nodes.find((n) => String(n.id) === String(edge.to));
              if (
                !fromNode ||
                !toNode ||
                fromNode.x === undefined ||
                fromNode.y === undefined ||
                toNode.x === undefined ||
                toNode.y === undefined
              ) {
                return null;
              }

              const isEdgeActive =
                edge.active ||
                (activeNodeIds.includes(String(edge.from)) && activeNodeIds.includes(String(edge.to)));

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isEdgeActive ? '#2563eb' : '#94a3b8'}
                    strokeWidth={isEdgeActive ? 3.5 : 2}
                    strokeOpacity={isEdgeActive ? 1 : 0.6}
                  />
                  {edge.weight !== undefined && (
                    <text
                      x={(fromNode.x + toNode.x) / 2 + 8}
                      y={(fromNode.y + toNode.y) / 2 - 4}
                      fill="currentColor"
                      className="text-primary font-bold font-mono text-[11px]"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              if (node.x === undefined || node.y === undefined) return null;
              const sId = String(node.id);
              const isActive = activeNodeIds.includes(sId);
              const isFound = step.type === 'found' && isActive;
              const isInserted = node.status === 'inserted' && isActive;
              const isComparing = step.type === 'compare' && isActive;

              return (
                <g key={sId} className="cursor-pointer transition-transform duration-200">
                  {/* Outer glow ring for active node */}
                  {isActive && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={24}
                      className={cn(
                        'fill-none stroke-2 animate-pulse',
                        isFound
                          ? 'stroke-emerald-500'
                          : isComparing
                          ? 'stroke-amber-500'
                          : 'stroke-primary'
                      )}
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={18}
                    className={cn(
                      'stroke-2 transition-all duration-300',
                      isFound
                        ? 'fill-emerald-500 stroke-emerald-600 text-white'
                        : isComparing
                        ? 'fill-amber-500 stroke-amber-600 text-white'
                        : isActive
                        ? 'fill-primary stroke-primary text-white'
                        : 'fill-card stroke-border text-foreground'
                    )}
                  />

                  {/* Node Value Label */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    className={cn(
                      'font-mono font-bold text-xs select-none',
                      isActive ? 'fill-white' : 'fill-foreground'
                    )}
                  >
                    {node.val}
                  </text>

                  {/* Optional Balance Factor tag above node for AVL */}
                  {node.balanceFactor !== undefined && (
                    <text
                      x={node.x}
                      y={node.y - 22}
                      textAnchor="middle"
                      className="font-mono text-[9px] font-bold fill-muted-foreground"
                    >
                      bf={node.balanceFactor}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* 4. CALL STACK / QUEUE DRAWER (IF ACTIVE IN TRAVERSAL) */}
      {callStack && callStack.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto">
          <span className="text-muted-foreground font-bold shrink-0">Call Stack:</span>
          {callStack.map((frame: { name?: string; args?: string }, fIdx: number) => (
            <span
              key={fIdx}
              className="px-2 py-0.5 rounded bg-muted text-foreground border border-border text-[11px]"
            >
              {frame.name}({frame.args})
            </span>
          ))}
        </div>
      )}

      {queueState && queueState.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto">
          <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">BFS Queue:</span>
          {queueState.map((val: string | number, qIdx: number) => (
            <span
              key={qIdx}
              className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-[11px]"
            >
              Node({val})
            </span>
          ))}
        </div>
      )}

      {/* 5. EMBEDDED WHY POPUP */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};
