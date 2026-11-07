import React, { useState, useEffect } from 'react';
import {
  Search,
  School,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  GitFork,
  ArrowDownUp,
  Sliders,
  Tag,
  Hash,
  Compass,
  Play,
  RotateCcw,
} from 'lucide-react';
import { categories, fullCatalog } from '../algorithms/registry';
import { useAlgorithmStore } from '../store/useAlgorithmStore';
import { NavView } from '../components/layout/Navbar';

interface TopicsPageProps {
  onNavigate: (view: NavView) => void;
  onOpenCommandPalette: () => void;
}

export const TopicsPage: React.FC<TopicsPageProps> = ({
  onNavigate,
  onOpenCommandPalette,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'ds' | 'algo'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'coming'>('all');
  const { setAlgorithm } = useAlgorithmStore();

  // Shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('curriculum-search');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLaunchTopic = (catId: string) => {
    // Pick the most iconic algorithm for that category
    const algoMap: Record<string, string> = {
      arrays: 'two-sum',
      strings: 'kmp-search',
      'linked-lists': 'll-reverse',
      'stacks-queues': 'valid-parentheses',
      trees: 'bst-search',
      graphs: 'bfs',
      hashing: 'hash-table',
      heaps: 'min-heap',
      matrices: 'spiral-matrix',
      trie: 'trie-insert',
      'disjoint-set': 'dsu-union',
      searching: 'binary-search',
      sorting: 'merge-sort',
      'two-pointers': 'dutch-national-flag',
      recursion: 'n-queens',
      'divide-conquer': 'merge-sort-tree',
      dp: 'knapsack-01',
      greedy: 'activity-selection',
      bit: 'single-number',
    };
    const algoId = algoMap[catId] || 'bubble-sort';
    setAlgorithm(algoId);
    onNavigate('visualizer');
  };

  // Filter topics
  const filteredCategories = categories.filter((cat) => {
    const algosCount = fullCatalog.filter((a) => a.category === cat.id).length;
    const isComingSoon = algosCount === 0;
    if (scopeFilter !== 'all' && cat.part !== scopeFilter) return false;
    if (statusFilter === 'ready' && isComingSoon) return false;
    if (statusFilter === 'coming' && !isComingSoon) return false;

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = cat.title.toLowerCase().includes(query);
    const descMatch = cat.description.toLowerCase().includes(query);
    const algoMatch = fullCatalog.some(
      (a) => a.category === cat.id && a.name.toLowerCase().includes(query)
    );
    return titleMatch || descMatch || algoMatch;
  });

  const dsCategories = filteredCategories.filter((c) => c.part === 'ds');
  const algoCategories = filteredCategories.filter((c) => c.part === 'algo');

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-surface dark:bg-[#070b16] text-on-surface dark:text-[#eaf1ff] font-body-md select-none transition-colors">
      {/* Atmospheric Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[920px] h-[360px] bg-gradient-to-b from-primary-fixed/40 via-surface-container-high/30 to-transparent blur-[110px] -z-10" />
      <div className="pointer-events-none absolute top-72 -left-32 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-[90px] -z-10" />
      <div className="pointer-events-none absolute top-[900px] -right-32 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-[100px] -z-10" />

      {/* Curriculum Header Hub */}
      <section className="w-full px-4 sm:px-8 pt-8 pb-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Breadcrumbs & Status Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-label-md text-xs text-on-surface-variant dark:text-white/60">
              <span className="inline-flex items-center gap-1.5 text-primary dark:text-purple-300 font-bold">
                <School className="w-4 h-4" />
                Syllabus Engine
              </span>
              <span>/</span>
              <span className="text-on-surface dark:text-white font-semibold">Curriculum Directory</span>
              <span>/</span>
              <span className="font-code-sm text-[11px] text-secondary dark:text-cyan-300 bg-surface-container-high dark:bg-white/10 px-2.5 py-0.5 rounded-full font-bold">
                v2.4 Production Catalog
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-surface-container-lowest dark:bg-white/5 px-3 py-1.5 rounded-full shadow-sm border border-outline-variant/30 dark:border-white/10 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>84 Interactive Visualizers Live</span>
              </div>
              <span className="text-outline-variant dark:text-white/30">•</span>
              <span className="text-on-surface-variant dark:text-white/60">30 Pipeline Modules</span>
            </div>
          </div>

          {/* Headline & Editorial Lead */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-1">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-white/10 font-code-sm text-xs text-primary dark:text-purple-300 uppercase font-bold tracking-wider">
                <span>Full Computational Matrix</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>20 Core Knowledge Nodes</span>
              </div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-5xl text-on-surface dark:text-white tracking-tight font-extrabold">
                All Topics
              </h1>
              <p className="font-body-lg text-sm sm:text-base text-on-surface-variant dark:text-white/70 max-w-2xl leading-relaxed">
                Explore the complete Data Structures &amp; Algorithms curriculum. 20 core topics with 114 interactive visualizers engineered for sensory comprehension and pointer-accurate step execution.
              </p>
            </div>

            {/* Quick Jump Anchors */}
            <div className="flex items-center gap-2 shrink-0 bg-surface-container-low dark:bg-white/5 p-1 rounded-full border border-outline-variant/30 dark:border-white/10">
              <a
                href="#part-1-data-structures"
                className="px-4 py-2 rounded-full bg-surface-container-lowest dark:bg-white/15 text-primary dark:text-inverse-primary font-label-lg text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Part 1: Data Structures</span>
                <span className="font-code-sm text-[11px] px-2 py-0.2 rounded-full bg-surface-container dark:bg-white/10 text-primary dark:text-white">
                  12
                </span>
              </a>
              <a
                href="#part-2-algorithms"
                className="px-4 py-2 rounded-full text-on-surface-variant dark:text-white/70 hover:text-on-surface dark:hover:text-white hover:bg-surface-container dark:hover:bg-white/10 font-label-lg text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>Part 2: Algorithms</span>
                <span className="font-code-sm text-[11px] px-2 py-0.2 rounded-full bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70">
                  8
                </span>
              </a>
            </div>
          </div>

          {/* Metric Summary Strip (Bento Overview) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-surface-container-lowest dark:bg-[#0e1628] p-4 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60 font-medium">Curriculum Units</span>
                <Layers className="w-5 h-5 text-primary dark:text-purple-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-2xl font-black text-on-surface dark:text-white">20</span>
                <span className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">syllabus modules</span>
              </div>
              <div className="w-full bg-surface-container-high dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary dark:bg-purple-400 h-full w-full rounded-full" />
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-[#0e1628] p-4 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60 font-medium">Total Visualizers</span>
                <Sparkles className="w-5 h-5 text-secondary dark:text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-2xl font-black text-on-surface dark:text-white">114</span>
                <span className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">interactive modules</span>
              </div>
              <div className="w-full bg-surface-container-high dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary dark:bg-cyan-400 h-full w-[74%] rounded-full" />
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-[#0e1628] p-4 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60 font-medium">Operational Status</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-2xl font-black text-emerald-600 dark:text-emerald-400">84</span>
                <span className="font-body-sm text-xs text-emerald-600 dark:text-emerald-400">Ready to Launch</span>
              </div>
              <div className="w-full bg-surface-container-high dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[73.6%] rounded-full" />
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-[#0e1628] p-4 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs text-on-surface-variant dark:text-white/60 font-medium">Laboratory Pipeline</span>
                <Clock className="w-5 h-5 text-outline" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-2xl font-black text-on-surface-variant dark:text-white/60">30</span>
                <span className="font-body-sm text-xs text-on-surface-variant dark:text-white/60">Coming Soon</span>
              </div>
              <div className="w-full bg-surface-container-high dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-outline-variant dark:bg-white/20 h-full w-[26.4%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Search Bar & Modular Filter Deck */}
          <div className="bg-surface-container-lowest dark:bg-[#0e1628] p-5 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col gap-4">
            {/* Unified Search Input */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="curriculum-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any data structure, algorithm, or sub-topic (Ctrl+K)..."
                className="w-full pl-12 pr-24 py-3 bg-surface-container-low dark:bg-white/5 focus:bg-surface-container-lowest dark:focus:bg-[#131d33] text-on-surface dark:text-white font-body-md text-sm rounded-full outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 dark:border-white/10 transition-all placeholder:text-outline-variant"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="font-code-sm text-xs bg-surface-container dark:bg-white/10 px-2 py-0.5 rounded-md text-on-surface-variant dark:text-white/60 font-medium">
                  Ctrl + K
                </span>
              </div>
            </div>

            {/* Granular Filter Clusters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Scope Segmented Toggle */}
              <div className="flex flex-wrap items-center gap-1.5 font-label-md text-xs">
                <button
                  onClick={() => setScopeFilter('all')}
                  className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    scopeFilter === 'all'
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                  }`}
                >
                  <span>All Topics</span>
                  <span className="font-code-sm text-[11px] px-2 py-0.2 rounded-full bg-surface-container-lowest dark:bg-white/20 text-primary dark:text-white">
                    20
                  </span>
                </button>
                <button
                  onClick={() => setScopeFilter('ds')}
                  className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    scopeFilter === 'ds'
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                  }`}
                >
                  <span>Part 1: Data Structures</span>
                  <span className="font-code-sm text-[11px] px-2 py-0.2 rounded-full bg-surface-container-lowest dark:bg-white/20 text-primary dark:text-white">
                    12
                  </span>
                </button>
                <button
                  onClick={() => setScopeFilter('algo')}
                  className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    scopeFilter === 'algo'
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                  }`}
                >
                  <span>Part 2: Algorithms</span>
                  <span className="font-code-sm text-[11px] px-2 py-0.2 rounded-full bg-surface-container-lowest dark:bg-white/20 text-primary dark:text-white">
                    8
                  </span>
                </button>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 font-label-md text-xs">
                <button
                  onClick={() => setStatusFilter(statusFilter === 'ready' ? 'all' : 'ready')}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer border ${
                    statusFilter === 'ready'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-bold'
                      : 'bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/70 border-outline-variant/30 dark:border-white/10'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Ready to Launch (84)</span>
                </button>
                <button
                  onClick={() => setStatusFilter(statusFilter === 'coming' ? 'all' : 'coming')}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer border ${
                    statusFilter === 'coming'
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-500 font-bold'
                      : 'bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/70 border-outline-variant/30 dark:border-white/10'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-outline" />
                  <span>Pipeline (30)</span>
                </button>
              </div>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-outline-variant/20 dark:border-white/10">
              <span className="font-label-md text-xs text-outline dark:text-white/50">Quick filters:</span>
              {[
                'Hash Tables',
                'Two Pointers',
                'Dynamic Programming',
                'Binary Trees',
                'Dijkstra',
                'Monotonic Stack',
                'Backtracking',
                'Bit Manipulation',
              ].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSearchQuery(pill === searchQuery ? '' : pill)}
                  className={`font-code-sm text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    searchQuery.toLowerCase() === pill.toLowerCase()
                      ? 'bg-primary-container text-white font-bold'
                      : 'bg-surface-container-low dark:bg-white/10 hover:bg-surface-container text-on-surface dark:text-white/80'
                  }`}
                >
                  #{pill}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-label-md text-xs text-primary dark:text-purple-300 hover:underline cursor-pointer ml-auto"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM TOPICS CONTAINER */}
      <section className="w-full px-4 sm:px-8 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* PART 1: DATA STRUCTURES */}
          {(scopeFilter === 'all' || scopeFilter === 'ds') && dsCategories.length > 0 && (
            <div id="part-1-data-structures" className="space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/30 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-code-sm text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-purple-300 font-bold uppercase">
                      Part 1
                    </span>
                    <h2 className="font-headline-lg text-2xl font-extrabold text-on-surface dark:text-white">
                      Data Structures
                    </h2>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 mt-1">
                    Fundamental and advanced memory architectures, pointer nodes, spatial caches, and tree partitions.
                  </p>
                </div>
                <span className="font-code-sm text-xs font-bold text-secondary dark:text-cyan-400 bg-surface-container dark:bg-white/10 px-3 py-1 rounded-full">
                  {dsCategories.length} Units Available
                </span>
              </div>

              {/* Grid of DS Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {dsCategories.map((cat) => {
                  const algos = fullCatalog.filter((a) => a.category === cat.id);
                  const isComingSoon = algos.length === 0;
                  return (
                    <div
                      key={cat.id}
                      className="bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-5 shadow-sm border border-outline-variant/30 dark:border-white/10 hover:border-primary/50 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70 font-semibold">
                            Node {cat.id}
                          </span>
                          {isComingSoon ? (
                            <span className="inline-flex items-center gap-1 font-code-sm text-[11px] text-outline bg-surface-container-low dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              Coming Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-code-sm text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {algos.length} Visualizers
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                          {cat.title}
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/70 mt-1.5 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>

                        {/* Algorithm Tags & Modules */}
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-outline-variant/20 dark:border-white/10">
                          {algos.slice(0, 4).map((algo) => (
                            <span
                              key={algo.id}
                              className="font-code-sm text-[11px] px-2 py-0.5 rounded bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/70"
                            >
                              {algo.name}
                            </span>
                          ))}
                          {algos.length > 4 && (
                            <span className="font-code-sm text-[11px] px-1.5 py-0.5 rounded text-outline dark:text-white/40">
                              +{algos.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Launch Button Action */}
                      <div className="mt-5 pt-3 border-t border-outline-variant/20 dark:border-white/10 flex items-center justify-between">
                        <span className="font-code-sm text-xs text-outline dark:text-white/50">
                          Complexity: <strong className="text-on-surface dark:text-white">{cat.id === 'arrays' ? 'O(1) Access' : cat.id === 'trees' ? 'O(log n)' : 'O(1) Ops'}</strong>
                        </span>
                        <button
                          onClick={() => handleLaunchTopic(cat.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container dark:bg-white/10 group-hover:bg-primary group-hover:text-white text-primary dark:text-inverse-primary font-label-md text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Launch Visualizer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PART 2: ALGORITHMS */}
          {(scopeFilter === 'all' || scopeFilter === 'algo') && algoCategories.length > 0 && (
            <div id="part-2-algorithms" className="space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant/30 dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-code-sm text-xs px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary dark:text-cyan-300 font-bold uppercase">
                      Part 2
                    </span>
                    <h2 className="font-headline-lg text-2xl font-extrabold text-on-surface dark:text-white">
                      Algorithms
                    </h2>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 mt-1">
                    Sorting pipelines, graph pathfinding, dynamic programming matrices, divide &amp; conquer, and bit tricks.
                  </p>
                </div>
                <span className="font-code-sm text-xs font-bold text-secondary dark:text-cyan-400 bg-surface-container dark:bg-white/10 px-3 py-1 rounded-full">
                  {algoCategories.length} Units Available
                </span>
              </div>

              {/* Grid of Algo Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {algoCategories.map((cat) => {
                  const algos = fullCatalog.filter((a) => a.category === cat.id);
                  const isComingSoon = algos.length === 0;
                  return (
                    <div
                      key={cat.id}
                      className="bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-5 shadow-sm border border-outline-variant/30 dark:border-white/10 hover:border-secondary/50 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-code-sm text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-white/70 font-semibold">
                            Node {cat.id}
                          </span>
                          {isComingSoon ? (
                            <span className="inline-flex items-center gap-1 font-code-sm text-[11px] text-outline bg-surface-container-low dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              Coming Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-code-sm text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {algos.length} Visualizers
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white group-hover:text-secondary dark:group-hover:text-cyan-300 transition-colors">
                          {cat.title}
                        </h3>
                        <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/70 mt-1.5 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>

                        {/* Algorithm Tags & Modules */}
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-outline-variant/20 dark:border-white/10">
                          {algos.slice(0, 4).map((algo) => (
                            <span
                              key={algo.id}
                              className="font-code-sm text-[11px] px-2 py-0.5 rounded bg-surface-container-low dark:bg-white/5 text-on-surface-variant dark:text-white/70"
                            >
                              {algo.name}
                            </span>
                          ))}
                          {algos.length > 4 && (
                            <span className="font-code-sm text-[11px] px-1.5 py-0.5 rounded text-outline dark:text-white/40">
                              +{algos.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Launch Button Action */}
                      <div className="mt-5 pt-3 border-t border-outline-variant/20 dark:border-white/10 flex items-center justify-between">
                        <span className="font-code-sm text-xs text-outline dark:text-white/50">
                          Complexity: <strong className="text-on-surface dark:text-white">{cat.id === 'sorting' ? 'O(n log n)' : cat.id === 'searching' ? 'O(log n)' : 'O(V+E)'}</strong>
                        </span>
                        <button
                          onClick={() => handleLaunchTopic(cat.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-surface-container dark:bg-white/10 group-hover:bg-secondary group-hover:text-white text-secondary dark:text-cyan-300 font-label-md text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Launch Visualizer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
