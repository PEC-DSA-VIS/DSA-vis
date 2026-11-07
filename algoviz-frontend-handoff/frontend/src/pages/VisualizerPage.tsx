import React, { useState, useEffect } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { Sidebar } from '../components/layout/Sidebar';
import { InputPanel } from '../components/visualization/InputPanel';
import { PlaybackControls } from '../components/visualization/PlaybackControls';
import { ExplanationPanel } from '../components/visualization/ExplanationPanel';
import { StatsCard } from '../components/visualization/StatsCard';
import { Legend } from '../components/visualization/Legend';
import { ArraySearchBoard } from '../components/boards/ArraySearchBoard';
import { ArraySortBoard } from '../components/boards/ArraySortBoard';
import { GridBoard } from '../components/boards/GridBoard';
import { GraphBoard } from '../components/boards/GraphBoard';
import { LinkedListBoard } from '../components/boards/LinkedListBoard';
import { StackQueueBoard } from '../components/boards/StackQueueBoard';
import { BitBoard } from '../components/boards/BitBoard';
import { TreeGraphBoard } from '../components/boards/TreeGraphBoard';
import { HeapDualBoard } from '../components/boards/HeapDualBoard';
import { DPTableBoard } from '../components/boards/DPTableBoard';
import { StringBoard } from '../components/boards/StringBoard';
import { TrieBoard } from '../components/boards/TrieBoard';
import { DisjointSetBoard } from '../components/boards/DisjointSetBoard';
import { RecursionBoard } from '../components/boards/RecursionBoard';
import { DivideConquerBoard } from '../components/boards/DivideConquerBoard';
import { BacktrackingBoard } from '../components/boards/BacktrackingBoard';
import { ActivityTimelineBoard } from '../components/boards/ActivityTimelineBoard';
import { HashTableBoard } from '../components/boards/HashTableBoard';
import { FloatingAskButton } from '../components/chat/FloatingAskButton';
import { ChatDrawer } from '../components/chat/ChatDrawer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Share2,
  Check,
  PanelRightClose,
  PanelRightOpen,
  Bot,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Code2,
  X,
} from 'lucide-react';

/**
 * Intelligent Fit Scaler: Calculates optimal zoom scale for every algorithm.
 * Defaults to 0.75 (75%) as requested, ensuring the entire board (bars, numbers,
 * comparison indicators, why-popups) fits cleanly in the canvas without clipping.
 * Automatically adapts (0.70 - 0.80) for larger DP matrices, deep trees, or compact lists.
 */
export const getOptimalFitScale = (algo: { id?: string; category?: string } | null | undefined): number => {
  if (!algo) return 0.75;
  const id = (algo.id || '').toLowerCase();
  const cat = (algo.category || '').toLowerCase();

  // Multi-row / Multi-col DP grids or N-Queens boards need a little extra breathing room
  if (cat === 'dp' || id.includes('knapsack') || id.includes('lcs') || id.includes('matrix') || id.includes('nqueens') || id.includes('sudoku')) {
    return 0.70;
  }
  // Deep/wide branching trees or large segment trees
  if (cat.includes('tree') && (id.includes('segment') || id.includes('trie') || id.includes('red-black'))) {
    return 0.70;
  }
  // Linear horizontal structures (linked lists, sliding window, two-pointer)
  if (id.includes('linked') || id.includes('two-pointer') || id.includes('sliding-window')) {
    return 0.80;
  }
  // Sorting (Bubble, Quick, Merge, Heap), Graphs (Dijkstra, BFS/DFS), Trees (AVL, BST), Hash Tables
  // Exactly 75% (0.75) as requested by user
  return 0.75;
};

interface VisualizerPageProps {
  onOpenCommandPalette: () => void;
}

export const VisualizerPage: React.FC<VisualizerPageProps> = ({
  onOpenCommandPalette: _onOpenCommandPalette,
}) => {
  const { currentAlgorithm, steps, currentStepIndex, isPlaying, comparisons, swaps } = useAlgorithmStore();
  const currentStep = steps[currentStepIndex] || steps[0];

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExplanationOpen, setIsExplanationOpen] = useState(true);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);

  // Fit Option is ON by default: set to 75% (0.75) per user request
  const [isFitActive, setIsFitActive] = useState(true);
  const [zoomScale, setZoomScale] = useState(() => getOptimalFitScale(currentAlgorithm));

  // Automatically adapt optimal fit scale whenever algorithm changes
  useEffect(() => {
    if (isFitActive) {
      setZoomScale(getOptimalFitScale(currentAlgorithm));
    }
  }, [currentAlgorithm?.id, isFitActive]);

  // Auto-collapse DSA curriculum sidebar when Play is started
  useEffect(() => {
    if (isPlaying) {
      setIsSidebarOpen(false);
    }
  }, [isPlaying]);

  const handleZoomIn = () => {
    setIsFitActive(false);
    setZoomScale((z) => Math.min(Number((z + 0.1).toFixed(2)), 2.2));
  };
  const handleZoomOut = () => {
    setIsFitActive(false);
    setZoomScale((z) => Math.max(Number((z - 0.1).toFixed(2)), 0.4));
  };
  const handleToggleFit = () => {
    if (isFitActive) {
      setIsFitActive(false);
      setZoomScale(1.0);
    } else {
      setIsFitActive(true);
      setZoomScale(getOptimalFitScale(currentAlgorithm));
    }
  };

  const handleAskAIAboutStep = (prompt: string) => {
    setChatPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  // Render proper board according to boardType
  const renderBoard = () => {
    switch (currentAlgorithm.boardType) {
      case 'array-search':
      case 'array-pattern':
        return <ArraySearchBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'array-sort':
        return <ArraySortBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'linked-list':
        return <LinkedListBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'stack-board':
      case 'queue-board':
        return <StackQueueBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'hash-table':
        return <HashTableBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'bit-cells':
        return <BitBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'activity-timeline':
        return <ActivityTimelineBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'backtracking-board':
        return <BacktrackingBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'heap-dual':
        return <HeapDualBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'dp-table':
        return <DPTableBoard step={currentStep} />;
      case 'string-ops':
        return <StringBoard step={currentStep} />;
      case 'tree-board':
        return <TreeGraphBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'graph-board':
        return <GraphBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'trie-board':
        return <TrieBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'disjoint-set':
        return <DisjointSetBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'recursion-tree':
        return <RecursionBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'divide-conquer-tree':
      case 'merge-sort-tree':
        return <DivideConquerBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      case 'grid-matrix':
        if (
          currentAlgorithm.id === 'n-queens-solver' ||
          currentAlgorithm.id === 'sudoku-backtrack' ||
          currentStep.dataState?.queensPlaced !== undefined ||
          currentStep.dataState?.n !== undefined ||
          currentStep.dataState?.size !== undefined
        ) {
          return <BacktrackingBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
        }
        return <GridBoard step={currentStep} onAskAI={handleAskAIAboutStep} />;
      default:
        return <ArraySortBoard step={currentStep} />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background relative select-none">
      {/* Top Input & Preset Bar - Auto-hides when running so visualizer board moves right to the top */}
      {!isPlaying && (
        <div className="shrink-0 transition-all duration-300">
          <InputPanel />
        </div>
      )}

      {/* Main Content Area (flex-1 min-h-0) */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Center: The Visualization Canvas Board */}
        <main className="flex-1 min-h-0 flex flex-col min-w-0 overflow-y-auto bg-muted/10 p-2 sm:p-2.5 space-y-1.5">
          {/* Header Row: On Start/Play, automatically slides & collapses into a sleek single line */}
          {isPlaying ? (
            <div className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-card border border-border/80 shadow-xs shrink-0 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  {currentAlgorithm.name}
                </span>
                <span className="font-code-sm text-[10px] px-2 py-0.2 rounded-full bg-primary/10 text-primary font-semibold">
                  {currentAlgorithm.difficulty}
                </span>
              </div>

              {/* Live Inline Telemetry Chips - Takes minimal space, elevates the board */}
              <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
                <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                  {comparisons} comps
                </span>
                <span className="text-fuchsia-600 dark:text-fuchsia-400 font-bold bg-fuchsia-500/10 px-2 py-0.5 rounded">
                  {swaps} swaps
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                  Step {currentStepIndex + 1}/{steps.length}
                </span>
                <span className="text-muted-foreground hidden sm:inline bg-muted px-2 py-0.5 rounded">
                  Avg: {currentAlgorithm.complexity.time.average}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 hidden sm:inline bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                  Space: {currentAlgorithm.complexity.space.worst}
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Paused state Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-border/60 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    {currentAlgorithm.name}
                  </h1>
                  <Badge variant="outline" className="text-[10px] font-semibold py-0">
                    {currentAlgorithm.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] py-0 hidden sm:inline-flex">
                    {currentAlgorithm.part === 'ds' ? 'Part 1: Data Structures' : 'Part 2: Algorithms'} • {currentAlgorithm.categoryName}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 md:hidden border-white/20"
                    onClick={() => setIsMobilePanelOpen(true)}
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Code</span>
                  </Button>

                  <Button
                    variant={isChatOpen ? 'secondary' : 'outline'}
                    size="sm"
                    className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{isChatOpen ? 'Close' : 'Ask AI'}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handleShare}
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Share</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground hidden lg:flex"
                    onClick={() => setIsExplanationOpen(!isExplanationOpen)}
                    aria-label="Toggle explanation tab"
                  >
                    {isExplanationOpen ? (
                      <PanelRightClose className="w-4 h-4" />
                    ) : (
                      <PanelRightOpen className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Compact Stats Bar */}
              <div className="shrink-0">
                <StatsCard />
              </div>
            </>
          )}

          {/* Canvas Box (Takes maximum vertical height now) */}
          <div className="flex-1 min-h-[380px] rounded-2xl border border-white/10 bg-card/60 backdrop-blur-md shadow-sm flex flex-col justify-between overflow-hidden relative">
            {/* Top Toolbar: Legend + Zoom & Pan Controls */}
            <div className="p-1.5 sm:p-2 border-b border-border/80 bg-muted/30 flex items-center justify-between flex-wrap gap-2 shrink-0">
              <Legend />

              <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-0.5 text-xs">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] text-cyan-300 px-1 min-w-[36px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                {/* Fit Option Button (Active Highlight) */}
                <button
                  onClick={handleToggleFit}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer flex items-center gap-1 transition-all ${
                    isFitActive
                      ? 'bg-primary text-white font-bold shadow-xs ring-1 ring-primary/40'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                  }`}
                  title={`Fit to Window (${Math.round(zoomScale * 100)}%)`}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Fit</span>
                </button>
              </div>
            </div>

            {/* Algorithm Board Element with Zoom Scaling */}
            <div className="flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4 overflow-auto">
              <div
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s ease-out',
                }}
                className="w-full flex items-center justify-center"
              >
                {renderBoard()}
              </div>
            </div>
          </div>
        </main>

        {/* Desktop Right Explanation & Pseudocode Terminal Panel (at least 35% width) */}
        {isExplanationOpen && (
          <aside className="w-[35%] lg:w-[38%] min-w-[340px] max-w-[560px] shrink-0 h-full hidden md:flex flex-col overflow-hidden">
            <ExplanationPanel />
          </aside>
        )}

        {/* Mobile Slide-Up Drawer for Explanation / Code */}
        {isMobilePanelOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex flex-col justify-end">
            <div className="bg-card border-t border-border rounded-t-2xl h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
                <span className="text-xs font-bold font-mono text-cyan-400">
                  {currentAlgorithm.name} — Code & Explanation
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={() => setIsMobilePanelOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <ExplanationPanel />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Playback Control Bar (shrink-0) */}
      <div className="shrink-0 sticky bottom-0 z-30">
        <PlaybackControls />
      </div>

      {/* Floating Ask AI Button */}
      <FloatingAskButton
        onClick={() => setIsChatOpen(true)}
        isOpen={isChatOpen}
      />

      {/* Context-Aware AI Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatPrompt(null);
        }}
        externalPrompt={chatPrompt}
        onClearExternalPrompt={() => setChatPrompt(null)}
      />
    </div>
  );
};
