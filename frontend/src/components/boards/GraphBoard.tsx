import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Network,
  Table,
  ListOrdered,
  Layers,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { StepAction } from '../../types';
import { cn } from '../../lib/utils';
import { WhyPopup } from '../visualization/WhyPopup';
import {
  GraphNodeData,
  GraphEdgeData,
  DijkstraTableEntry,
  PQItem,
} from '../../algorithms/graphGenerators';

interface GraphBoardProps {
  step: StepAction;
  onAskAI?: (prompt: string) => void;
}

export const GraphBoard: React.FC<GraphBoardProps> = ({ step, onAskAI }) => {
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'canvas' | 'adj-list' | 'adj-matrix' | 'dist-table'>('all');

  const data = step.dataState || {};
  const mode = data.mode || 'bfs';
  const nodes: GraphNodeData[] = data.nodes || [];
  const edges: GraphEdgeData[] = data.edges || [];
  const activeNodeId: string | null = data.activeNodeId ?? null;
  const comparingNodeId: string | null = data.comparingNodeId ?? null;
  const queue: string[] = data.queue || [];
  const stack: string[] = data.stack || [];
  const pq: PQItem[] = data.pq || [];
  const distTable: DijkstraTableEntry[] = data.distTable || [];
  const adjList: Record<string, string[]> = data.adjList || {};
  const adjMatrix: Record<string, Record<string, number>> = data.adjMatrix || {};
  const visitedSequence: string[] = data.visitedSequence || [];
  const shortestPath: string[] = data.shortestPath || [];
  const stats = data.stats || {};

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoom(1);

  const hasAdjData = Object.keys(adjList).length > 0;
  const hasDistTable = distTable.length > 0;
  const isDijkstra = mode === 'dijkstra';
  const isMST = mode === 'mst-kruskal' || mode === 'mst-prim';

  return (
    <div className="flex flex-col w-full h-full min-h-0 overflow-y-auto p-4 gap-4 bg-background select-none">
      {/* 1. TOP STATS BAR */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs flex-wrap shrink-0">
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Network className="w-4 h-4 text-primary" />
            <span className="capitalize">{mode.replace('-', ' ')} Graph Explorer</span>
          </div>

          {/* Mode-specific counters */}
          {stats.visitedCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              <span>Visited:</span>
              <span className="font-bold">{stats.visitedCount}</span>
            </div>
          )}

          {stats.queueSize !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold font-mono">
              <span>Queue Size:</span>
              <span className="font-bold">{stats.queueSize}</span>
            </div>
          )}

          {stats.stackSize !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold font-mono">
              <span>Stack Depth:</span>
              <span className="font-bold">{stats.stackSize}</span>
            </div>
          )}

          {stats.relaxations !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold font-mono">
              <span>Relaxations:</span>
              <span className="font-bold">{stats.relaxations}</span>
            </div>
          )}

          {stats.finalizedCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              <span>Finalized:</span>
              <span className="font-bold">{stats.finalizedCount}/6</span>
            </div>
          )}

          {stats.mstWeight !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              <span>MST Weight:</span>
              <span className="font-bold">{stats.mstWeight}</span>
            </div>
          )}

          {stats.acceptedCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold font-mono">
              <span>Accepted Edges:</span>
              <span className="font-bold">{stats.acceptedCount} / {stats.targetEdges || 5}</span>
            </div>
          )}
        </div>

        {/* View Controls & Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 text-xs font-mono rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Fit to Screen"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Fit view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. LIVE DATA TAPE / QUEUE / CALL STACK / PRIORITY QUEUE STRIP */}
      {queue.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5" /> FIFO Queue:
          </span>
          {queue.map((val, idx) => (
            <span
              key={idx}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all',
                idx === 0
                  ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400 animate-pulse'
                  : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20'
              )}
            >
              {val} {idx === 0 && '← FRONT'}
            </span>
          ))}
        </div>
      )}

      {stack.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> LIFO Call Stack:
          </span>
          {stack.map((val, idx) => (
            <span
              key={idx}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all',
                idx === stack.length - 1
                  ? 'bg-purple-500 text-white border-purple-600 ring-2 ring-purple-400 animate-pulse'
                  : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
              )}
            >
              {val} {idx === stack.length - 1 && '← TOP'}
            </span>
          ))}
        </div>
      )}

      {pq.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Min-Heap PQ:
          </span>
          {pq.map((item, idx) => (
            <span
              key={idx}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all',
                idx === 0
                  ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
              )}
            >
              ({item.dist}, {item.node}) {idx === 0 && '← MIN'}
            </span>
          ))}
        </div>
      )}

      {/* 3. VISITED ORDER STRIP */}
      {visitedSequence.length > 0 && (
        <div className="w-full p-2.5 rounded-xl bg-card border border-border shadow-xs text-xs font-mono flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-muted-foreground font-bold shrink-0">Visited Order:</span>
          {visitedSequence.map((v, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-muted text-foreground border border-border font-bold text-[11px]">
                {v}
              </span>
              {idx < visitedSequence.length - 1 && (
                <span className="text-muted-foreground/60 text-xs">→</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* 4. MAIN INTERACTIVE GRAPH CANVAS (VIEWBOX: 0 0 840 440 with safe padding) */}
      <div className="relative w-full min-h-[360px] sm:min-h-[420px] rounded-2xl bg-card/60 border border-border shadow-inner overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox="0 0 840 440"
          className="w-full h-full max-h-[500px] transition-transform duration-200"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Glowing filter for active wavefront / path */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing emerald filter for shortest path */}
            <filter id="emeraldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw Edges */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isEdgeActive =
              edge.active ||
              (activeNodeId === edge.from && comparingNodeId === edge.to) ||
              (activeNodeId === edge.to && comparingNodeId === edge.from);

            const isShortestPath = edge.status === 'finalized' && isDijkstra && shortestPath.length > 0;
            const isMSTAccepted = edge.status === 'finalized' && isMST;
            const isMSTRejected = edge.status === 'rejected';

            const strokeColor = isShortestPath || isMSTAccepted
              ? '#10b981' // emerald
              : isMSTRejected
              ? '#94a3b8' // slate rejected
              : isEdgeActive
              ? '#f59e0b' // amber
              : edge.status === 'visited'
              ? '#2563eb' // blue
              : '#cbd5e1'; // light slate

            const strokeWidth = isShortestPath ? 5 : isMSTAccepted ? 4 : isEdgeActive ? 3.5 : 2;

            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;

            return (
              <g key={`edge-${idx}`} className="transition-all duration-300">
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isMSTRejected ? '5,5' : 'none'}
                  strokeOpacity={isMSTRejected ? 0.4 : 1}
                  filter={isShortestPath ? 'url(#emeraldGlow)' : undefined}
                />

                {/* Optional Weight Label badge */}
                {edge.weight !== undefined && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-14}
                      y={-10}
                      width={28}
                      height={20}
                      rx={6}
                      className={cn(
                        'fill-card stroke text-foreground transition-colors',
                        isEdgeActive
                          ? 'stroke-amber-500 fill-amber-500/10'
                          : isShortestPath || isMSTAccepted
                          ? 'stroke-emerald-500 fill-emerald-500/10'
                          : 'stroke-border'
                      )}
                      strokeWidth={1.5}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[11px] font-mono font-bold fill-foreground select-none"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Draw Nodes */}
          {nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isComparing = comparingNodeId === node.id;
            const isFinalized = node.status === 'finalized';
            const isVisited = node.status === 'visited' || visitedSequence.includes(node.id);
            const isInShortestPath = shortestPath.includes(node.id);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer transition-transform duration-300"
              >
                {/* Outer Glow Ring for Active Vertex */}
                {(isActive || isComparing || isInShortestPath) && (
                  <circle
                    r={28}
                    className={cn(
                      'fill-none stroke-2 animate-pulse',
                      isInShortestPath
                        ? 'stroke-emerald-500'
                        : isActive
                        ? 'stroke-amber-500'
                        : 'stroke-blue-500'
                    )}
                  />
                )}

                {/* Node Main Circle */}
                <circle
                  r={20}
                  className={cn(
                    'stroke-2 transition-all duration-300 shadow-lg',
                    isInShortestPath
                      ? 'fill-emerald-500 stroke-emerald-600 text-white'
                      : isFinalized
                      ? 'fill-emerald-600 stroke-emerald-700 text-white'
                      : isActive
                      ? 'fill-amber-500 stroke-amber-600 text-white'
                      : isComparing
                      ? 'fill-blue-500 stroke-blue-600 text-white'
                      : isVisited
                      ? 'fill-primary/20 stroke-primary text-foreground'
                      : 'fill-card stroke-border text-foreground'
                  )}
                />

                {/* Node ID Label */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    'font-mono font-bold text-sm select-none',
                    isInShortestPath || isFinalized || isActive || isComparing
                      ? 'fill-white'
                      : 'fill-foreground'
                  )}
                >
                  {node.val}
                </text>

                {/* Distance Subscript Badge for Dijkstra */}
                {isDijkstra && node.dist !== undefined && (
                  <g transform="translate(0, 32)">
                    <rect
                      x={-24}
                      y={-9}
                      width={48}
                      height={18}
                      rx={5}
                      className={cn(
                        'fill-card stroke transition-colors',
                        isFinalized
                          ? 'stroke-emerald-500/50 fill-emerald-500/10'
                          : isActive
                          ? 'stroke-amber-500/50 fill-amber-500/10'
                          : 'stroke-border'
                      )}
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[10px] font-mono font-bold fill-foreground"
                    >
                      d: {node.dist === Infinity ? '∞' : node.dist}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 5. SIDE-BY-SIDE / DUAL-VIEW PANELS: ADJACENCY LIST & MATRIX & DIJKSTRA DISTANCE TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full shrink-0">
        {/* ADJACENCY LIST VIEW */}
        {hasAdjData && (
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5 text-foreground">
                <ListOrdered className="w-4 h-4 text-primary" /> Adjacency List: O(V + E) Space
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Dynamic Arrays</span>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              {Object.entries(adjList).map(([vertex, neighbors]) => {
                const isVertexActive = activeNodeId === vertex;
                return (
                  <div
                    key={vertex}
                    className={cn(
                      'flex items-center gap-2 p-1.5 rounded-lg border transition-all',
                      isVertexActive
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-muted/40 border-border'
                    )}
                  >
                    <span className="w-6 h-6 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      {vertex}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {neighbors.length === 0 ? (
                        <span className="text-muted-foreground/60 text-[11px]">NULL (Empty)</span>
                      ) : (
                        neighbors.map((nbr, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-card border border-border text-[11px] font-bold text-foreground"
                          >
                            {nbr}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADJACENCY MATRIX VIEW */}
        {Object.keys(adjMatrix).length > 0 && (
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5 text-foreground">
                <Table className="w-4 h-4 text-primary" /> Adjacency Matrix: O(1) Edge Lookup
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">V × V Dense Grid</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-1 text-muted-foreground font-bold"></th>
                    {Object.keys(adjMatrix).map((col) => (
                      <th
                        key={col}
                        className={cn(
                          'p-1.5 font-bold rounded-t',
                          comparingNodeId === col ? 'bg-blue-500/15 text-blue-600' : 'text-muted-foreground'
                        )}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(adjMatrix).map(([rowKey, rowVals]) => (
                    <tr key={rowKey}>
                      <td
                        className={cn(
                          'p-1.5 font-bold rounded-l',
                          activeNodeId === rowKey ? 'bg-amber-500/15 text-amber-600' : 'text-muted-foreground'
                        )}
                      >
                        {rowKey}
                      </td>
                      {Object.entries(rowVals).map(([colKey, val]) => {
                        const isCellActive = activeNodeId === rowKey && comparingNodeId === colKey;
                        const isNonZero = val > 0;
                        return (
                          <td
                            key={colKey}
                            className={cn(
                              'p-1.5 border border-border/40 transition-colors',
                              isCellActive
                                ? 'bg-amber-500 text-white font-bold ring-2 ring-amber-400'
                                : isNonZero
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-muted-foreground/40'
                            )}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DIJKSTRA DISTANCE & PREDECESSOR TABLE */}
        {hasDistTable && (
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col gap-3 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5 text-foreground">
                <Table className="w-4 h-4 text-emerald-500" /> Dijkstra Distance & Predecessor Table
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">Relaxation Tracker</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="p-2 text-left">Vertex</th>
                    <th className="p-2">Tentative Dist</th>
                    <th className="p-2">Via Predecessor</th>
                    <th className="p-2">Finalized?</th>
                  </tr>
                </thead>
                <tbody>
                  {distTable.map((row) => (
                    <tr
                      key={row.vertex}
                      className={cn(
                        'border-b border-border/40 transition-colors',
                        row.highlight
                          ? 'bg-amber-500/15 font-bold'
                          : row.finalized
                          ? 'bg-emerald-500/10'
                          : ''
                      )}
                    >
                      <td className="p-2 text-left font-bold text-foreground flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-muted flex items-center justify-center font-mono text-[11px]">
                          {row.vertex}
                        </span>
                        {row.vertex === 'A' && <span className="text-[10px] text-muted-foreground">(Source)</span>}
                        {row.vertex === 'F' && <span className="text-[10px] text-emerald-600 font-bold">(Target)</span>}
                      </td>
                      <td className="p-2 font-bold">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded',
                            row.dist === '∞'
                              ? 'text-muted-foreground'
                              : row.finalized
                              ? 'text-emerald-600 bg-emerald-500/20'
                              : 'text-amber-600 bg-amber-500/20'
                          )}
                        >
                          {row.dist}
                        </span>
                      </td>
                      <td className="p-2 text-muted-foreground">{row.prev}</td>
                      <td className="p-2">
                        {row.finalized ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> YES
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-[11px]">
                            <XCircle className="w-3.5 h-3.5 opacity-40" /> NO
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 6. EMBEDDED WHY POPUP */}
      <WhyPopup step={step} onAskAI={onAskAI} />
    </div>
  );
};
