import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Compass,
  Layers,
  ArrowRight,
  HelpCircle,
  Sliders,
  Terminal,
  Grid,
  Network,
  CheckCircle2,
  Clock,
  Zap,
  Code2,
  BookOpen,
  Lock,
  User,
  Shield,
} from 'lucide-react';
import { categories, fullCatalog } from '../algorithms/registry';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { NavView } from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  slidingWindowSteps,
  dpKnapsackSteps,
  avlTreeSteps,
  dijkstraSteps,
  ObservatoryStep,
} from '../data/observatorySteps';

interface HomePageProps {
  onNavigate: (view: NavView) => void;
  onOpenCommandPalette: () => void;
}

type ParadigmTab = 'pointer' | 'dp' | 'tree' | 'graph';

const paradigmMap: Record<ParadigmTab, { name: string; algoId: string; steps: ObservatoryStep[] }> = {
  pointer: { name: 'Sliding Window', algoId: 'sliding-window-max', steps: slidingWindowSteps },
  dp: { name: 'DP Matrix (0/1 Knapsack)', algoId: 'knapsack-01-table', steps: dpKnapsackSteps },
  tree: { name: 'Balanced AVL Tree', algoId: 'avl-tree-rotations', steps: avlTreeSteps },
  graph: { name: 'Dijkstra Shortest Path', algoId: 'dijkstra-shortest', steps: dijkstraSteps },
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenCommandPalette,
}) => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [activeParadigm, setActiveParadigm] = useState<ParadigmTab>('pointer');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(4); // Default to Peak step of Sliding Window
  const { setAlgorithm } = useAlgorithmStore();

  const handleProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      openLoginModal('user');
      return;
    }
    action();
  };

  const currentConfig = paradigmMap[activeParadigm];
  const currentSteps = currentConfig.steps;
  const safeStepIndex = Math.min(stepIndex, currentSteps.length - 1);
  const currentStep = currentSteps[safeStepIndex];

  // Playback timer for the active paradigm showcase
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= currentSteps.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying, currentSteps.length]);

  const handleSwitchParadigm = (tab: ParadigmTab) => {
    setActiveParadigm(tab);
    setStepIndex(0);
    setIsPlaying(false);
  };

  const handleLaunchTopic = (algoId: string) => {
    setAlgorithm(algoId);
    onNavigate('visualizer');
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-surface dark:bg-[#070b16] text-on-surface dark:text-[#eaf1ff] font-body-md transition-colors select-none">
      {/* Atmospheric Glow Backdrop Elements */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[72rem] h-[36rem] bg-gradient-to-tr from-primary/10 via-secondary-container/20 to-tertiary-fixed/15 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-96 -left-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-[40rem] -right-24 w-[32rem] h-[32rem] bg-secondary-fixed/30 dark:bg-primary/10 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="w-full px-4 sm:px-8 pt-12 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container dark:bg-white/10 shadow-sm mb-6 border border-outline-variant/30 dark:border-white/10">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-code-sm text-xs text-secondary dark:text-cyan-400 uppercase font-bold tracking-wider">
              AlgoViz Observatory 2.4
            </span>
            <span className="text-outline-variant dark:text-white/30">•</span>
            <span className="font-label-md text-xs text-on-surface-variant dark:text-white/70 font-medium">
              Kinetic Computer Science Laboratory
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface dark:text-white max-w-4xl text-balance leading-tight">
            See every step.{' '}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container dark:from-purple-400 dark:to-cyan-400">
              Understand every why.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-base sm:text-lg text-on-surface-variant dark:text-white/70 max-w-3xl mt-4 text-balance">
            Interactive algorithmic laboratory translating abstract computation, dynamic memory layouts,
            and pointer traversal into tactile visual understanding.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={() => handleProtectedAction(() => onNavigate('topics'))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-label-lg text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Topics</span>
            </button>
            <button
              onClick={() => handleProtectedAction(() => onNavigate('solver'))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-white rounded-full font-label-lg text-sm font-bold shadow-sm hover:bg-surface-container-low dark:hover:bg-white/15 border border-outline-variant/30 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-primary dark:text-purple-300" />
              <span>Solve a Problem</span>
            </button>
            <button
              onClick={() => handleProtectedAction(() => onNavigate('compare'))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-white rounded-full font-label-lg text-sm font-bold shadow-sm hover:bg-surface-container-low dark:hover:bg-white/15 border border-outline-variant/30 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Compare Solutions</span>
            </button>
          </div>

          {/* Stats Strip */}
          <div className="w-full max-w-4xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container-lowest/80 dark:bg-white/5 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-outline-variant/30 dark:border-white/10">
            <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-surface-container-low/60 dark:bg-white/5">
              <span className="font-headline-lg text-2xl font-black text-primary dark:text-purple-400">20</span>
              <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60">Core Topics</span>
            </div>
            <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-surface-container-low/60 dark:bg-white/5">
              <span className="font-headline-lg text-2xl font-black text-secondary dark:text-cyan-400">114</span>
              <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60">Interactive Visualizers</span>
            </div>
            <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-surface-container-low/60 dark:bg-white/5">
              <span className="font-headline-lg text-2xl font-black text-emerald-600 dark:text-emerald-400">0-Setup</span>
              <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60">Instant Execution</span>
            </div>
            <div className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-surface-container-low/60 dark:bg-white/5">
              <span className="font-headline-lg text-2xl font-black text-primary dark:text-purple-400">Dynamic</span>
              <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60">Step Reasoning</span>
            </div>
          </div>

          {/* Dedicated Sign In Portal Gateway - Visible when not logged in */}
          {!isAuthenticated && (
            <div className="w-full max-w-4xl mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-surface-container to-secondary/10 dark:from-purple-950/40 dark:via-[#0e1628] dark:to-cyan-950/30 border border-primary/25 dark:border-white/15 shadow-xl text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30 dark:border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 dark:bg-purple-500/20 text-primary dark:text-purple-300 font-code-sm text-xs font-bold uppercase tracking-wider mb-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authentication Gateway</span>
                  </div>
                  <h2 className="font-display-lg text-2xl font-extrabold text-on-surface dark:text-white">
                    AlgoViz Student &amp; Faculty Portal
                  </h2>
                  <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant dark:text-white/70 mt-1">
                    Sign in to unlock interactive step simulations, 114+ algorithm visualizers, and the AI problem solver.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Student Portal Card */}
                <div
                  onClick={() => openLoginModal('user')}
                  className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 hover:border-primary/60 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 flex items-center justify-center mb-3">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white group-hover:text-primary transition-colors">
                      Student Log In &amp; Access (Password / OTP)
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 mt-1.5 leading-relaxed">
                      Instant log in with your College ID and password, or register with college email OTP to access 114+ visualizers and LeetCode solver.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-label-md text-xs font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2 group-hover:opacity-95"
                  >
                    <span>Log In as Student</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Faculty & Admin Portal Card */}
                <div
                  onClick={() => openLoginModal('admin')}
                  className="p-5 rounded-2xl bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/30 dark:border-white/10 hover:border-purple-500/60 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-3">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white group-hover:text-purple-500 transition-colors">
                      Faculty &amp; Admin Log In Console
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 mt-1.5 leading-relaxed">
                      Instant password login for administrators and instructors to review student registrations, class section telemetry, and access logs.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-label-md text-xs font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
                  >
                    <span>Log In as Admin</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HERO PREVIEW SHOWCASE: Multi-Paradigm Interactive Observatory */}
          <div className="w-full max-w-5xl mt-12 bg-surface-container-lowest dark:bg-[#0e1628] rounded-3xl shadow-xl border border-outline-variant/40 dark:border-white/10 overflow-hidden text-left flex flex-col">
            {/* Top Control Header & Paradigm Tabs */}
            <div className="w-full bg-surface-container-low dark:bg-white/5 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-primary dark:bg-purple-400 animate-ping" />
                <span className="font-code-sm text-xs font-bold uppercase tracking-wider text-primary dark:text-purple-300">
                  Observatory Live Trace
                </span>
                <span className="text-outline-variant dark:text-white/30 hidden sm:inline">•</span>
                <span className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 hidden sm:inline">
                  Rotating Multi-Paradigm Engine
                </span>
              </div>

              {/* Paradigm Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['pointer', 'dp', 'tree', 'graph'] as const).map((tab) => {
                  const info = paradigmMap[tab];
                  const isActive = activeParadigm === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => handleSwitchParadigm(tab)}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-white shadow-sm ring-2 ring-primary/40'
                          : 'bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70 hover:text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {tab === 'pointer' && <Sliders className="w-3.5 h-3.5" />}
                      {tab === 'dp' && <Grid className="w-3.5 h-3.5" />}
                      {tab === 'tree' && <Network className="w-3.5 h-3.5" />}
                      {tab === 'graph' && <Compass className="w-3.5 h-3.5" />}
                      <span>{info.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Observatory Stage Body */}
            <div className="p-4 sm:p-6 lg:p-7 relative min-h-[440px] flex flex-col justify-between bg-surface-bright/50 dark:bg-transparent">
              <div className="flex flex-col lg:flex-row gap-5 items-stretch">
                {/* LEFT: INTERACTIVE ALGORITHM CANVAS */}
                <div className="flex-1 min-w-0 flex flex-col justify-between bg-surface-container-lowest dark:bg-black/30 rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 dark:border-white/10">
                  {/* Visual Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-outline-variant/20 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-sm sm:text-base font-bold text-on-surface dark:text-white">
                        {currentStep.title}
                      </span>
                      <span className="font-code-sm text-xs px-2.5 py-0.5 bg-primary/10 text-primary dark:text-purple-300 border border-primary/20 rounded-md font-semibold">
                        {currentStep.badge}
                      </span>
                    </div>
                    <span className="font-code-sm text-xs font-bold text-secondary dark:text-cyan-400 bg-secondary/10 px-2.5 py-0.5 rounded-full">
                      {currentStep.metric}
                    </span>
                  </div>

                  {/* 1. SLIDING WINDOW CANVAS */}
                  {activeParadigm === 'pointer' && (
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-8 max-w-full px-2">
                        {currentStep.data.array.map((num: number, idx: number) => {
                          const inWindow = idx >= currentStep.data.windowStart && idx <= currentStep.data.windowEnd;
                          const isL = idx === currentStep.data.windowStart;
                          const isR = idx === currentStep.data.windowEnd;
                          const isIncoming = currentStep.data.incoming === num && isR;
                          const isOutgoing = currentStep.data.outgoing === num && idx === currentStep.data.windowStart - 1;

                          return (
                            <div key={idx} className="flex flex-col items-center relative select-none">
                              {/* Left Pointer Pill */}
                              {isL && (
                                <span className="absolute -top-7 px-2 py-0.5 rounded-full bg-cyan-600 text-white font-code-sm text-[10px] font-extrabold shadow-md animate-bounce">
                                  L
                                </span>
                              )}
                              {/* Right Pointer Pill */}
                              {isR && (
                                <span className="absolute -top-7 px-2 py-0.5 rounded-full bg-purple-600 text-white font-code-sm text-[10px] font-extrabold shadow-md animate-bounce">
                                  R
                                </span>
                              )}

                              {/* Index */}
                              <span className={`font-code-sm text-[11px] mb-1.5 ${inWindow ? 'text-primary dark:text-purple-300 font-bold' : 'text-outline-variant'}`}>
                                [{idx}]
                              </span>

                              {/* Number Card */}
                              <div
                                className={`w-11 sm:w-13 h-14 sm:h-16 rounded-2xl flex items-center justify-center font-code-lg text-base sm:text-lg font-black border transition-all duration-300 ${
                                  inWindow
                                    ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-200 border-purple-500 shadow-md scale-105 ring-2 ring-purple-400/40'
                                    : 'bg-surface-container-low dark:bg-white/5 text-outline dark:text-white/40 border-outline-variant/30'
                                }`}
                              >
                                {num}
                              </div>

                              {/* Outgoing/Incoming indicators */}
                              {isOutgoing && (
                                <span className="mt-1 text-[10px] font-mono text-rose-500 font-bold animate-pulse">
                                  -drop
                                </span>
                              )}
                              {isIncoming && (
                                <span className="mt-1 text-[10px] font-mono text-emerald-500 font-bold animate-pulse">
                                  +add
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Status Summary Banner */}
                      <div className="w-full max-w-lg mt-3 p-3 rounded-xl bg-surface-container dark:bg-white/5 flex flex-wrap items-center justify-between gap-2 font-code-sm text-xs">
                        <span className="text-on-surface dark:text-white/90">
                          Window: <strong className="text-primary dark:text-purple-300">[{currentStep.data.windowStart}..{currentStep.data.windowEnd}]</strong> (Sum: <strong>{currentStep.data.currentSum}</strong>)
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>Global Peak: {currentStep.data.maxSum}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. DP MATRIX CANVAS */}
                  {activeParadigm === 'dp' && (
                    <div className="flex-1 flex flex-col justify-center overflow-x-auto py-2">
                      <div className="min-w-[460px] text-center font-code-sm text-xs">
                        {/* Header Row */}
                        <div className="grid grid-cols-9 gap-1 mb-1 font-bold">
                          <div className="text-outline p-1.5">item \ w</div>
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((w) => (
                            <div key={w} className="p-1.5 bg-surface-container-low dark:bg-white/5 rounded-md text-on-surface-variant dark:text-white/70">
                              {w}
                            </div>
                          ))}
                        </div>

                        {/* 4 Rows */}
                        {currentStep.data.table.map((row: (number | null)[], rIdx: number) => {
                          const itemLabels = ['0 (Base)', '1 (w:2, v:12)', '2 (w:3, v:18)', '3 (w:4, v:14)'];
                          return (
                            <div key={rIdx} className="grid grid-cols-9 gap-1 mb-1 items-center">
                              <div className="text-[10px] font-bold text-outline text-left px-1 truncate" title={itemLabels[rIdx]}>
                                {itemLabels[rIdx]}
                              </div>
                              {row.map((cellVal: number | null, cIdx: number) => {
                                const isActive = currentStep.data.activeRow === rIdx && currentStep.data.activeCol === cIdx;
                                const isSkip = currentStep.data.skipCell && currentStep.data.skipCell[0] === rIdx && currentStep.data.skipCell[1] === cIdx;
                                const isTake = currentStep.data.takeCell && currentStep.data.takeCell[0] === rIdx && currentStep.data.takeCell[1] === cIdx;
                                const isSelected = currentStep.data.selectedItems && ((rIdx === 3 && cIdx === 7) || (rIdx === 2 && cIdx === 3));

                                return (
                                  <div
                                    key={cIdx}
                                    className={`p-2 rounded-lg font-mono text-xs transition-all duration-200 ${
                                      isActive
                                        ? 'bg-primary-container text-white font-extrabold ring-4 ring-primary/40 shadow-lg scale-105'
                                        : isSelected
                                        ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400'
                                        : isTake
                                        ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500'
                                        : isSkip
                                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500'
                                        : cellVal !== null
                                        ? 'bg-surface-container-low dark:bg-white/5 text-on-surface dark:text-white/80'
                                        : 'bg-surface-container-lowest dark:bg-white/[0.02] text-outline-variant border border-dashed border-outline-variant/30'
                                    }`}
                                  >
                                    {cellVal !== null ? cellVal : '·'}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>

                      {/* Recurrence Rule Banner */}
                      <div className="mt-3 p-2.5 rounded-xl bg-surface-container dark:bg-white/5 flex flex-wrap items-center justify-between gap-2 font-code-sm text-xs">
                        <span className="text-on-surface dark:text-white/90">
                          dp[i][w] = max( dp[i-1][w], val[i] + dp[i-1][w - wt[i]] )
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {currentStep.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 3. BALANCED TREE CANVAS */}
                  {activeParadigm === 'tree' && (
                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[240px] py-2">
                      <svg className="w-full h-56 max-w-lg stroke-outline-variant dark:stroke-white/30 stroke-2">
                        {currentStep.data.edges.map((edge: { from: number; to: number }, idx: number) => {
                          const nFrom = currentStep.data.nodes.find((n: any) => n.id === edge.from);
                          const nTo = currentStep.data.nodes.find((n: any) => n.id === edge.to);
                          if (!nFrom || !nTo) return null;
                          return (
                            <line
                              key={idx}
                              x1={nFrom.x}
                              y1={nFrom.y}
                              x2={nTo.x}
                              y2={nTo.y}
                              className={edge.from === 45 || edge.from === 60 ? 'stroke-primary dark:stroke-purple-400 stroke-[2.5px]' : ''}
                            />
                          );
                        })}
                      </svg>

                      {/* HTML Nodes positioned over SVG */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-full h-56 max-w-lg">
                          {currentStep.data.nodes.map((node: any) => {
                            const isImbalanced = node.bf === -2;
                            const isPivot = node.status === 'pivot' || node.status === 'rotatedRoot';

                            return (
                              <div
                                key={node.id}
                                style={{ left: `${node.x - 22}px`, top: `${node.y - 22}px` }}
                                className={`absolute w-11 h-11 rounded-full flex flex-col items-center justify-center font-code-sm text-xs font-black shadow-md transition-all duration-300 pointer-events-auto ${
                                  isImbalanced
                                    ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 scale-110'
                                    : isPivot
                                    ? 'bg-primary-container text-white ring-4 ring-primary/40 scale-105'
                                    : 'bg-surface-container-low dark:bg-white/10 text-on-surface dark:text-white border border-outline-variant/40'
                                }`}
                              >
                                <span>{node.val}</span>
                                <span className={`text-[9px] ${isImbalanced ? 'text-rose-200' : 'text-outline dark:text-white/60'}`}>
                                  {node.bf >= 0 ? `+${node.bf}` : node.bf}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tree Status Banner */}
                      <div className="w-full max-w-md mt-2 p-2.5 rounded-xl bg-surface-container dark:bg-white/5 flex items-center justify-between font-code-sm text-xs">
                        <span className="text-on-surface dark:text-white/80">
                          Invariant: Height-Balanced (|BF| &le; 1)
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          currentStep.data.nodes.some((n: any) => n.bf === -2)
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {currentStep.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 4. GRAPH FRONTIER CANVAS */}
                  {activeParadigm === 'graph' && (
                    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[240px] py-2">
                      <svg className="w-full h-56 max-w-lg stroke-outline-variant dark:stroke-white/20 stroke-2">
                        {/* Static Edges with weights */}
                        <line x1="80" y1="130" x2="220" y2="60" className={currentStep.data.relaxedEdges.includes('A-C') ? 'stroke-primary stroke-[3px]' : ''} />
                        <line x1="80" y1="130" x2="220" y2="200" className={currentStep.data.relaxedEdges.includes('A-B') ? 'stroke-primary stroke-[3px]' : ''} />
                        <line x1="220" y1="60" x2="360" y2="60" className={currentStep.data.relaxedEdges.includes('C-D') ? 'stroke-primary stroke-[3px]' : ''} />
                        <line x1="360" y1="60" x2="480" y2="130" className={currentStep.data.relaxedEdges.includes('D-E') ? 'stroke-primary stroke-[3px]' : ''} />
                        <line x1="220" y1="200" x2="480" y2="130" className={currentStep.data.relaxedEdges.includes('B-E') ? 'stroke-emerald-500 stroke-[3.5px]' : ''} />

                        {/* Edge weight labels */}
                        <text x="140" y="85" className="fill-primary font-mono text-xs font-bold">4</text>
                        <text x="140" y="180" className="fill-outline font-mono text-xs">7</text>
                        <text x="290" y="50" className="fill-primary font-mono text-xs font-bold">2</text>
                        <text x="430" y="85" className="fill-outline font-mono text-xs">6</text>
                        <text x="360" y="180" className="fill-emerald-500 font-mono text-xs font-bold">3</text>
                      </svg>

                      {/* HTML Nodes positioned over SVG */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-full h-56 max-w-lg">
                          {[
                            { id: 'A', x: 80, y: 130 },
                            { id: 'C', x: 220, y: 60 },
                            { id: 'B', x: 220, y: 200 },
                            { id: 'D', x: 360, y: 60 },
                            { id: 'E', x: 480, y: 130 },
                          ].map((node) => {
                            const isSettled = currentStep.data.settled.includes(node.id);
                            const isActive = currentStep.data.activeNode === node.id;
                            const dist = currentStep.data.distances[node.id];

                            return (
                              <div
                                key={node.id}
                                style={{ left: `${node.x - 20}px`, top: `${node.y - 20}px` }}
                                className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-code-sm text-xs font-bold shadow-md transition-all duration-300 pointer-events-auto ${
                                  isSettled
                                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                                    : isActive
                                    ? 'bg-primary-container text-white ring-4 ring-primary/40 scale-110'
                                    : 'bg-surface-container-low dark:bg-white/10 text-on-surface dark:text-white border border-outline-variant/30'
                                }`}
                              >
                                <span>{node.id}</span>
                                <span className="text-[9px] opacity-80">{dist}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Priority Queue Strip */}
                      <div className="w-full max-w-md mt-2 p-2.5 rounded-xl bg-surface-container dark:bg-white/5 flex items-center justify-between font-code-sm text-xs">
                        <span className="text-on-surface dark:text-white/80">
                          Priority Queue: [ {currentStep.data.pq.map((p: any) => `(${p.node}, ${p.dist})`).join(', ') || 'EMPTY'} ]
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/30">
                          {currentStep.badge}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT: DEVELOPER TERMINAL EMULATOR (NO CLIPPING, AMPLE WIDTH) */}
                <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
                  {/* Terminal Header Bar */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300 tracking-tight ml-1 flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5 text-purple-400" />
                        <span>algoviz-trace</span>
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase tracking-wider border border-purple-500/30">
                      STEP {safeStepIndex + 1}/{currentSteps.length}
                    </span>
                  </div>

                  {/* Shell Command Prompt */}
                  <div className="px-3.5 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 text-[11px] text-emerald-400 font-bold">
                    <span className="text-slate-500 select-none">$</span>
                    <span className="text-purple-300 shrink-0">exec &gt;</span>
                    <span className="text-emerald-300 font-mono truncate">{currentStep.terminalCmd}</span>
                  </div>

                  {/* Pseudocode Execution Area */}
                  <div className="p-3 bg-slate-950 border-b border-slate-800/80 space-y-0.5 overflow-x-auto text-[11px] leading-relaxed">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                      <span>Synchronized Code</span>
                      <span className="text-purple-400">Line {currentStep.codeLine}</span>
                    </div>
                    {currentStep.pseudocode.map((line, idx) => {
                      const lineNo = idx + 1;
                      const isCurrent = lineNo === currentStep.codeLine;
                      return (
                        <div
                          key={idx}
                          className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                            isCurrent
                              ? 'bg-purple-950/80 text-purple-200 border-l-2 border-purple-500 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className="w-5 shrink-0 text-slate-600 text-right mr-2 select-none font-mono">
                            {lineNo}
                          </span>
                          <span className="whitespace-pre">{line}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Memory Register Grid (Live Variables) */}
                  <div className="p-3 bg-slate-900/40 border-b border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-cyan-400" />
                      <span>Live Memory Registers</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                      {Object.entries(currentStep.liveVariables).map(([k, v]) => (
                        <div key={k} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">{k}:</span>
                          <span className="font-bold text-cyan-300 truncate ml-1">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why & Rule Callout */}
                  <div className="p-3 bg-slate-950 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Why This Action?</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                        {currentStep.action}
                      </p>
                      <div className="mt-2 p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-200 font-mono">
                        <span className="text-purple-400 font-bold mr-1">Rule:</span>
                        <span>{currentStep.rule}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Status: <strong className="text-emerald-400">ACTIVE TRACE</strong></span>
                      <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-purple-300 font-bold border border-slate-800">
                        O(1) Memory
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Playback Scrubber & Live Controls */}
              <div className="mt-6 pt-4 border-t border-outline-variant/20 dark:border-white/10 flex flex-col items-stretch gap-3">
                {!isAuthenticated && (
                  <div className="w-full p-2.5 rounded-xl bg-primary/10 dark:bg-purple-950/40 border border-primary/20 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-primary dark:text-purple-300 font-medium">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Sign in required to run interactive scrubbing, edit code &amp; test custom inputs.</span>
                    </div>
                    <button
                      onClick={() => openLoginModal('user')}
                      className="px-3.5 py-1 rounded-full bg-primary text-white font-bold text-[11px] shadow-xs hover:opacity-95 cursor-pointer shrink-0"
                    >
                      Sign In Now
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleProtectedAction(() => setStepIndex((prev) => Math.max(0, prev - 1)))}
                      disabled={safeStepIndex === 0}
                      className="w-9 h-9 rounded-full bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-white flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/30 dark:border-white/10 disabled:opacity-40"
                      title="Previous Step"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleProtectedAction(() => setIsPlaying(!isPlaying))}
                      className="px-4 py-1.5 rounded-full bg-primary-container text-white flex items-center gap-1.5 font-label-md text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? 'Pause' : 'Play Trace'}</span>
                    </button>
                    <button
                      onClick={() => handleProtectedAction(() => setStepIndex((prev) => Math.min(currentSteps.length - 1, prev + 1)))}
                      disabled={safeStepIndex === currentSteps.length - 1}
                      className="w-9 h-9 rounded-full bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-white flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/30 dark:border-white/10 disabled:opacity-40"
                      title="Next Step"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleProtectedAction(() => {
                        setIsPlaying(false);
                        setStepIndex(0);
                      })}
                      className="w-9 h-9 rounded-full bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-white flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/30 dark:border-white/10"
                      title="Reset to Step 1"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrubber slider bar */}
                  <div className="flex-1 w-full max-w-md flex items-center gap-3">
                    <span className="font-code-sm text-xs font-bold text-primary dark:text-purple-300 shrink-0">
                      Step {safeStepIndex + 1} / {currentSteps.length}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={currentSteps.length - 1}
                      value={safeStepIndex}
                      onChange={(e) => {
                        handleProtectedAction(() => {
                          setIsPlaying(false);
                          setStepIndex(Number(e.target.value));
                        });
                      }}
                      className="w-full accent-primary h-2 bg-surface-container-low dark:bg-white/10 rounded-full cursor-pointer"
                    />
                  </div>

                  {/* Direct Launch Button */}
                  <button
                    onClick={() => handleProtectedAction(() => handleLaunchTopic(currentConfig.algoId))}
                    className="inline-flex items-center gap-1.5 font-label-md text-xs text-primary dark:text-purple-300 font-bold hover:underline cursor-pointer bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20"
                  >
                    <span>Open Full {currentConfig.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: 3 Steps to Algorithmic Intuition */}
      <section className="w-full px-4 sm:px-8 py-16 bg-surface-container-low/40 dark:bg-white/5 border-y border-outline-variant/30 dark:border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-code-sm text-xs text-secondary dark:text-cyan-400 font-bold uppercase tracking-widest">
              Methodology
            </span>
            <h2 className="font-display-lg text-2xl sm:text-3xl font-extrabold mt-1 text-on-surface dark:text-white">
              Three steps to algorithmic intuition
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant dark:text-white/70 mt-2">
              Transform passive memorization into active mental models through kinetic interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-white/10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-primary dark:text-purple-300 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">
                Inject Your Custom Inputs
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/70 mt-2 leading-relaxed">
                Test corner cases, randomized stress tests, or LeetCode examples directly. Watch the engine adapt its execution in real-time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-white/10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-secondary dark:text-cyan-300 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">
                Scrub Through Memory Layers
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/70 mt-2 leading-relaxed">
                Step backwards or forward through the call stack, heap memory, and pointer movements with tactile precision.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-6 shadow-sm border border-outline-variant/30 dark:border-white/10 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">
                Inspect Dynamic "Why?" Prompts
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/70 mt-2 leading-relaxed">
                Every single pointer move, array swap, or partition cut surfaces an instant causal explanation anchored to algorithmic invariants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Quick Jump & Topics Matrix Preview */}
      <section className="w-full px-4 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-code-sm text-xs text-primary dark:text-purple-400 font-bold uppercase tracking-wider">
                Curriculum Matrix
              </span>
              <h2 className="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-surface dark:text-white mt-1">
                Complete Syllabus &amp; Topic Matrix
              </h2>
              <p className="font-body-sm text-sm text-on-surface-variant dark:text-white/70 mt-1">
                20 core units covering Data Structures &amp; Advanced Algorithms.
              </p>
            </div>
            <button
              onClick={() => handleProtectedAction(() => onNavigate('topics'))}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-surface-container dark:bg-white/10 hover:bg-surface-container-high text-primary dark:text-inverse-primary rounded-full font-label-lg text-xs font-bold transition-all cursor-pointer border border-outline-variant/30 dark:border-white/10"
            >
              <span>View Full 20-Topic Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => {
              const count = fullCatalog.filter((a) => a.category === cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleProtectedAction(() => handleLaunchTopic(cat.id === 'arrays' ? 'two-sum' : cat.id === 'trees' ? 'bst-search' : cat.id === 'graphs' ? 'bfs' : 'bubble-sort'))}
                  className="bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-5 shadow-sm border border-outline-variant/30 dark:border-white/10 hover:border-primary/50 hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-code-sm text-[11px] px-2 py-0.5 bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70 rounded-full font-semibold">
                        {cat.part === 'ds' ? 'Data Structure' : 'Algorithm'}
                      </span>
                      <span className="font-code-sm text-xs text-secondary dark:text-cyan-400 font-bold">
                        {count} visualizers
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-base font-bold text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                      {cat.title}
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-outline-variant/20 dark:border-white/10 flex items-center justify-between text-xs text-primary dark:text-purple-300 font-bold">
                    <span>Launch Visualizer</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Why Engine Spotlight */}
      <section className="w-full px-4 sm:px-8 py-16 bg-gradient-to-b from-surface-container-low/50 to-surface dark:from-white/5 dark:to-transparent">
        <div className="max-w-4xl mx-auto bg-surface-container-lowest dark:bg-[#0e1628] rounded-3xl p-8 sm:p-12 shadow-xl border border-outline-variant/40 dark:border-white/10 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center shadow-md shadow-primary/30 mb-6">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-display-lg text-2xl sm:text-4xl font-extrabold text-on-surface dark:text-white">
            The "Why Engine": Explanations that follow the computation
          </h2>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant dark:text-white/70 max-w-2xl mt-4 leading-relaxed">
            Unlike static slides, every step dynamically answers: <em>"Why this swap?"</em>, <em>"Why move the left pointer?"</em>, and <em>"Why does this guarantee asymptotic optimality?"</em>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handleProtectedAction(() => onNavigate('visualizer'))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-full font-label-lg text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Launch Interactive Visualizer</span>
            </button>
            <button
              onClick={() => handleProtectedAction(() => onNavigate('topics'))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container dark:bg-white/10 text-on-surface dark:text-white rounded-full font-label-lg text-sm font-bold hover:bg-surface-container-high dark:hover:bg-white/15 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Full Curriculum</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
