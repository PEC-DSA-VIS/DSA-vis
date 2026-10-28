import React, { useState, useEffect } from 'react';
import {
  Scale,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Shuffle,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  HelpCircle,
  Copy,
  ChevronDown,
} from 'lucide-react';

interface ProblemPreset {
  id: string;
  name: string;
  subtitle: string;
  codeNumber: string;
  target: number;
  array: number[];
  solAName: string;
  solBName: string;
  solATime: string;
  solASpace: string;
  solBTime: string;
  solBSpace: string;
}

const PRESETS: ProblemPreset[] = [
  {
    id: 'two-sum',
    name: 'Two Sum — Pair Sum Matching',
    subtitle: 'Brute Force Exploration vs Hash Table Inversion',
    codeNumber: 'LeetCode #1',
    target: 9,
    array: [2, 7, 11, 15, 3, 6, 8, 1],
    solAName: 'Brute Force Exploration',
    solBName: 'Hash Table Inversion',
    solATime: 'O(n²)',
    solASpace: 'O(1)',
    solBTime: 'O(n)',
    solBSpace: 'O(n)',
  },
  {
    id: 'max-subarray',
    name: 'Maximum Subarray — Contiguous Sum',
    subtitle: 'Nested Window Enumeration vs Kadane Dynamic Invariant',
    codeNumber: 'LeetCode #53',
    target: 6,
    array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    solAName: 'All Pairs Window Scan',
    solBName: "Kadane's Dynamic Program",
    solATime: 'O(n²)',
    solASpace: 'O(1)',
    solBTime: 'O(n)',
    solBSpace: 'O(1)',
  },
  {
    id: 'search-sorted',
    name: 'Search in Sorted Array',
    subtitle: 'Exhaustive Linear Scan vs Binary Divide & Conquer',
    codeNumber: 'LeetCode #704',
    target: 15,
    array: [1, 2, 3, 6, 7, 8, 11, 15],
    solAName: 'Linear Traversal',
    solBName: 'Binary Bisect Search',
    solATime: 'O(n)',
    solASpace: 'O(1)',
    solBTime: 'O(log n)',
    solBSpace: 'O(1)',
  },
  {
    id: 'find-duplicates',
    name: 'Find Duplicates in Array',
    subtitle: 'Nested Pair Scan vs Hash Set Invariant',
    codeNumber: 'LeetCode #217',
    target: 0,
    array: [4, 5, 6, 7, 5, 9, 1, 2],
    solAName: 'Nested Double Loop',
    solBName: 'Hash Set Memory Filter',
    solATime: 'O(n²)',
    solASpace: 'O(1)',
    solBTime: 'O(n)',
    solBSpace: 'O(n)',
  },
];

export const ComparePage: React.FC = () => {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const activePreset = PRESETS.find((p) => p.id === selectedProblemId) || PRESETS[0];

  const [target, setTarget] = useState<number>(activePreset.target);
  const [arrayStr, setArrayStr] = useState<string>(`[${activePreset.array.join(', ')}]`);
  const [nums, setNums] = useState<number[]>(activePreset.array);

  // Playback state
  const [step, setStep] = useState<number>(2);
  const totalSteps = 12;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Update preset
  const handleSelectProblem = (id: string) => {
    setSelectedProblemId(id);
    const p = PRESETS.find((item) => item.id === id) || PRESETS[0];
    setTarget(p.target);
    setNums(p.array);
    setArrayStr(`[${p.array.join(', ')}]`);
    setStep(1);
    setIsPlaying(false);
  };

  const handleRandomize = () => {
    const randomized = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1);
    const newTarget = randomized[0] + randomized[1];
    setNums(randomized);
    setArrayStr(`[${randomized.join(', ')}]`);
    setTarget(newTarget);
    setStep(1);
    setIsPlaying(false);
  };

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = Math.max(200, 1400 / speed);
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          return totalSteps;
        }
        return prev + 1;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps]);

  // Derived state for Two Sum Brute Force
  // At step 1: i=0, j=1 -> 2+7=9 (Matches target 9!)
  // If we advance, we demonstrate how brute force continues to check all pairs
  const iIdx = Math.min(nums.length - 2, Math.floor((step - 1) / 3));
  const jIdx = Math.min(nums.length - 1, iIdx + 1 + ((step - 1) % 3));
  const valI = nums[iIdx] ?? 2;
  const valJ = nums[jIdx] ?? 7;
  const currentSum = valI + valJ;
  const isBfMatch = currentSum === target;

  // Derived state for Two Sum Hash Map
  // Found at step 2!
  const isOptimalFound = step >= 2;

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-surface dark:bg-[#070b16] text-on-surface dark:text-[#eaf1ff] font-body-md select-none transition-colors">
      {/* Dynamic Atmospheric Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-48 right-10 w-80 h-80 bg-secondary-container/20 dark:bg-cyan-900/10 rounded-full blur-3xl -z-10" />

      {/* Top Command Strip: Problem Configuration Bar */}
      <section className="w-full px-4 sm:px-8 pt-6 pb-3">
        <div className="flex flex-col gap-4 bg-surface-container-lowest dark:bg-[#0e1628] p-5 sm:p-6 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10">
          {/* Header Row: Problem Title & Selector */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary-fixed dark:bg-purple-900/40 text-primary dark:text-purple-300 font-bold shadow-sm shrink-0">
                <Scale className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-code-sm text-[11px] uppercase px-2.5 py-0.5 bg-surface-container dark:bg-white/10 text-secondary dark:text-cyan-300 rounded-full font-bold">
                    Dual Trace Lab
                  </span>
                  <span className="font-body-sm text-xs text-outline dark:text-white/50">{activePreset.codeNumber}</span>
                  <span className="inline-flex items-center gap-1 font-label-md text-xs text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Lockstep
                  </span>
                </div>
                <h1 className="font-headline-lg text-xl sm:text-2xl font-extrabold text-on-surface dark:text-white tracking-tight mt-1">
                  {activePreset.name}
                </h1>
              </div>
            </div>

            {/* Problem Switcher Dropdown & Action Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative min-w-[260px]">
                <select
                  value={selectedProblemId}
                  onChange={(e) => handleSelectProblem(e.target.value)}
                  className="w-full appearance-none bg-surface-container-low dark:bg-white/10 text-on-surface dark:text-white font-label-lg text-xs pl-4 pr-10 py-2.5 rounded-full outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30 dark:border-white/10 cursor-pointer font-semibold transition-all"
                >
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id} className="dark:bg-[#0e1628]">
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              </div>

              <button
                type="button"
                onClick={handleRandomize}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-low dark:bg-white/10 text-on-surface dark:text-white hover:bg-surface-container rounded-full font-label-md text-xs font-semibold border border-outline-variant/30 dark:border-white/10 transition-colors cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Randomize Input</span>
              </button>
            </div>
          </div>

          {/* Parameter Input Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
            {/* Target Input */}
            <div className="md:col-span-3 flex items-center bg-surface-container-low dark:bg-white/5 px-4 py-1.5 rounded-full border border-outline-variant/20 dark:border-white/10">
              <span className="font-code-md text-xs text-outline mr-2 shrink-0">target =</span>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full bg-transparent font-code-md text-sm text-on-surface dark:text-white outline-none font-bold"
              />
              <span className="font-label-md text-[11px] text-outline-variant dark:text-white/40 bg-surface-container-lowest dark:bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                int
              </span>
            </div>

            {/* Dataset Array Input */}
            <div className="md:col-span-6 flex items-center bg-surface-container-low dark:bg-white/5 px-4 py-1.5 rounded-full border border-outline-variant/20 dark:border-white/10">
              <span className="font-code-md text-xs text-outline mr-2 shrink-0">nums =</span>
              <input
                type="text"
                value={arrayStr}
                onChange={(e) => {
                  setArrayStr(e.target.value);
                  try {
                    const parsed = JSON.parse(e.target.value);
                    if (Array.isArray(parsed)) setNums(parsed);
                  } catch {
                    // ignore until valid
                  }
                }}
                className="w-full bg-transparent font-code-md text-xs text-on-surface dark:text-white outline-none tracking-wide"
              />
              <span className="font-code-sm text-xs text-outline shrink-0 ml-2">
                N = {nums.length}
              </span>
            </div>

            {/* Run CTA */}
            <div className="md:col-span-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setIsPlaying(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white font-label-lg text-xs font-bold rounded-full shadow-md shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Run in Lockstep</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Synchronized Playback Scrubber Deck */}
      <section className="w-full px-4 sm:px-8 py-2">
        <div className="bg-surface-container-lowest dark:bg-[#0e1628] px-5 py-3.5 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Play / Step Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() => {
                setStep(1);
                setIsPlaying(false);
              }}
              className="w-9 h-9 rounded-full bg-surface-container-low dark:bg-white/10 text-on-surface-variant dark:text-white/80 hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="w-9 h-9 rounded-full bg-surface-container-low dark:bg-white/10 text-on-surface-variant dark:text-white/80 hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
              title="Step Backward"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-9 px-4 rounded-full bg-primary-container text-white font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => setStep((prev) => Math.min(totalSteps, prev + 1))}
              className="w-9 h-9 rounded-full bg-surface-container-low dark:bg-white/10 text-on-surface-variant dark:text-white/80 hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Slider */}
          <div className="flex-1 w-full max-w-xl px-2 flex flex-col gap-1">
            <div className="flex items-center justify-between text-code-sm text-xs font-semibold">
              <span className="text-on-surface dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary dark:bg-purple-400 animate-pulse" />
                Synchronized Cursor: Step <strong className="text-primary dark:text-purple-300 font-bold">{step}</strong> of {totalSteps}
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full text-[11px]">
                {isOptimalFound ? 'Optimal Solved at Step 2' : 'Searching for Target...'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={totalSteps}
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="w-full h-2 bg-surface-container dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Velocity Multipliers */}
          <div className="flex items-center gap-1 bg-surface-container-low dark:bg-white/10 p-1 rounded-full shrink-0">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                className={`px-3 py-1 rounded-full font-code-sm text-xs font-bold transition-all cursor-pointer ${
                  speed === spd
                    ? 'bg-surface-container-lowest dark:bg-primary-container text-primary dark:text-white shadow-sm'
                    : 'text-on-surface-variant dark:text-white/70 hover:text-on-surface'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL CHAMBER STAGE: Side-by-Side Synchronized Chambers */}
      <section className="w-full px-4 sm:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT CHAMBER: Solution A - Brute Force */}
          <div className="flex flex-col bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 dark:border-white/10 justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 gap-3 border-b border-outline-variant/20 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-full font-code-sm text-xs font-bold">
                      Solution A: Nested Search
                    </span>
                    <span className="text-outline dark:text-white/50 font-label-md text-xs">Exhaustive Iterations</span>
                  </div>
                  <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white">
                    {activePreset.solAName}
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 mt-1">
                    Tests every distinct pair combination sequentially until a sum matches the target.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 font-code-sm text-xs font-bold">
                  <span className="px-2.5 py-0.5 bg-surface-container dark:bg-white/10 text-on-surface dark:text-white rounded-md">
                    Time: {activePreset.solATime}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-md">
                    Space: {activePreset.solASpace}
                  </span>
                </div>
              </div>

              {/* Step Metrics Gauges */}
              <div className="grid grid-cols-3 gap-2 my-4 text-center">
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl">
                  <span className="font-label-md text-xs text-outline dark:text-white/50 block">Comparisons</span>
                  <span className="font-code-lg text-sm font-bold text-on-surface dark:text-white">
                    {step * 2 + 1} checks
                  </span>
                </div>
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl">
                  <span className="font-label-md text-xs text-outline dark:text-white/50 block">Memory Alloc</span>
                  <span className="font-code-lg text-sm font-bold text-emerald-600 dark:text-emerald-400">0 bytes</span>
                </div>
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl">
                  <span className="font-label-md text-xs text-outline dark:text-white/50 block">Scan Status</span>
                  <span className={`font-code-sm text-xs font-bold px-2 py-0.5 rounded-full ${isBfMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary-fixed text-on-secondary-fixed'}`}>
                    {isBfMatch ? 'Pair Matched!' : 'Scanning...'}
                  </span>
                </div>
              </div>

              {/* Array Grid with Pointer Badges */}
              <div className="relative bg-surface-container-low dark:bg-white/5 rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/20 dark:border-white/10">
                <div className="flex items-center justify-between font-code-sm text-xs text-outline dark:text-white/60">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Outer Pointer (i)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> Inner Pointer (j)
                  </span>
                </div>

                <div className="grid grid-cols-8 gap-2 relative pt-7 pb-2">
                  {nums.map((val, idx) => {
                    const isI = idx === iIdx;
                    const isJ = idx === jIdx;
                    const isActive = isI || isJ;
                    return (
                      <div key={idx} className="flex flex-col items-center relative">
                        {isI && (
                          <div className="absolute -top-7 px-2 py-0.5 bg-secondary text-white rounded-full font-code-sm text-[10px] font-bold shadow-sm">
                            i={idx}
                          </div>
                        )}
                        {isJ && (
                          <div className="absolute -top-7 px-2 py-0.5 bg-primary-container text-white rounded-full font-code-sm text-[10px] font-bold shadow-sm">
                            j={idx}
                          </div>
                        )}
                        <div
                          className={`w-full aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all ${
                            isActive
                              ? isBfMatch
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-extrabold scale-105 shadow-md'
                                : 'bg-primary-fixed dark:bg-purple-900/40 text-primary dark:text-purple-200 border-primary font-bold scale-105'
                              : 'bg-surface-container-lowest dark:bg-white/5 text-on-surface dark:text-white/80 border-outline-variant/30 dark:border-white/10'
                          }`}
                        >
                          <span className="font-code-sm text-[10px] opacity-60">#{idx}</span>
                          <span className="font-code-lg text-sm font-bold">{val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Arithmetic Operational Bubble */}
                <div className="bg-surface-container-lowest dark:bg-[#131d33] p-3 rounded-xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-code-sm text-xs text-outline dark:text-white/60">Active Sum Evaluation:</div>
                    <div className="font-code-md text-sm font-bold text-on-surface dark:text-white">
                      nums[{iIdx}] + nums[{jIdx}] = <span className="text-secondary dark:text-cyan-300 font-extrabold">{valI}</span> + <span className="text-primary dark:text-purple-300 font-extrabold">{valJ}</span> = <strong>{currentSum}</strong>
                    </div>
                  </div>
                  <span className={`font-code-sm text-xs px-2.5 py-1 rounded-full font-bold ${isBfMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {isBfMatch ? `Match Target ${target}!` : `!= Target ${target}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Synchronized Pseudocode */}
            <div className="mt-4 bg-surface-container-low dark:bg-white/5 rounded-xl p-3 border border-outline-variant/20 dark:border-white/10 font-code-sm text-xs">
              <div className="flex items-center justify-between pb-1 text-outline dark:text-white/50 font-semibold">
                <span>BRUTE_FORCE_ITERATOR</span>
                <span>Line 3 active</span>
              </div>
              <div className="space-y-0.5 text-on-surface-variant dark:text-white/70">
                <div className="opacity-50">1 for i in range(len(nums)):</div>
                <div className="opacity-50">2 &nbsp;&nbsp;for j in range(i + 1, len(nums)):</div>
                <div className="bg-primary-fixed dark:bg-purple-900/60 text-primary dark:text-purple-200 font-bold px-2 py-0.5 rounded">
                  3 &nbsp;&nbsp;&nbsp;&nbsp;if nums[i] + nums[j] == target: return [i, j]
                </div>
                <div className="opacity-50">4 return []</div>
              </div>
            </div>
          </div>

          {/* RIGHT CHAMBER: Solution B - Optimal Hash Map */}
          <div className="flex flex-col bg-surface-container-lowest dark:bg-[#0e1628] rounded-2xl p-5 sm:p-6 shadow-sm border border-outline-variant/30 dark:border-white/10 justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 gap-3 border-b border-outline-variant/20 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-code-sm text-xs font-bold">
                      Solution B: Single-Pass
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-label-md text-xs font-semibold">
                      Complement Inversion
                    </span>
                  </div>
                  <h2 className="font-headline-md text-lg font-bold text-on-surface dark:text-white">
                    {activePreset.solBName}
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 mt-1">
                    Precomputes requirement <code className="bg-surface-container dark:bg-white/10 px-1 py-0.5 rounded">target - current</code> to resolve match in $O(1)$ constant time lookup.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 font-code-sm text-xs font-bold">
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md">
                    Time: {activePreset.solBTime}
                  </span>
                  <span className="px-2.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/50 text-secondary dark:text-cyan-300 rounded-md">
                    Space: {activePreset.solBSpace}
                  </span>
                </div>
              </div>

              {/* Step Metrics Gauges */}
              <div className="grid grid-cols-3 gap-2 my-4 text-center">
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl">
                  <span className="font-label-md text-xs text-outline dark:text-white/50 block">Lookups</span>
                  <span className="font-code-lg text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.min(step, 2)} lookups
                  </span>
                </div>
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl">
                  <span className="font-label-md text-xs text-outline dark:text-white/50 block">Allocations</span>
                  <span className="font-code-lg text-sm font-bold text-secondary dark:text-cyan-400">
                    {Math.min(step, 2) * 8} bytes
                  </span>
                </div>
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl">
                  <span className="font-label-md text-xs text-outline dark:text-white/50 block">Hash State</span>
                  <span className="font-code-sm text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {isOptimalFound ? 'Target Resolved (2)' : 'Inserting Map...'}
                  </span>
                </div>
              </div>

              {/* Array Grid + Hash Table Representation */}
              <div className="relative bg-surface-container-low dark:bg-white/5 rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/20 dark:border-white/10">
                <div className="flex items-center justify-between font-code-sm text-xs text-outline dark:text-white/60">
                  <span>Array Traversal (Terminated at index 1)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Solved in 2 Steps</span>
                </div>

                <div className="grid grid-cols-8 gap-2 relative pt-7 pb-2">
                  {nums.map((val, idx) => {
                    const isSolvedIdx = idx === 0 || idx === 1;
                    return (
                      <div key={idx} className={`flex flex-col items-center relative ${!isSolvedIdx ? 'opacity-35' : ''}`}>
                        {idx === 1 && (
                          <div className="absolute -top-7 px-2 py-0.5 bg-emerald-600 text-white rounded-full font-code-sm text-[10px] font-bold shadow-sm">
                            Match!
                          </div>
                        )}
                        <div
                          className={`w-full aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all ${
                            isSolvedIdx
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500 font-extrabold shadow-sm'
                              : 'bg-surface-container-lowest dark:bg-white/5 text-on-surface dark:text-white/80 border-outline-variant/30 dark:border-white/10'
                          }`}
                        >
                          <span className="font-code-sm text-[10px] opacity-60">#{idx}</span>
                          <span className="font-code-lg text-sm font-bold">{val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Hash Table Bucket Layout */}
                <div className="bg-surface-container-lowest dark:bg-[#131d33] p-3 rounded-xl shadow-sm border border-outline-variant/30 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-md text-xs text-outline dark:text-white/60 uppercase tracking-wider font-semibold">
                      Auxiliary In-Memory Hash Map
                    </span>
                    <span className="font-code-sm text-xs text-secondary dark:text-cyan-300 font-semibold">
                      map&lt;key: value, val: index&gt;
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap font-code-sm text-xs">
                    {/* Entry #0 */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container dark:bg-white/10 border border-outline-variant/30 dark:border-white/10">
                      <span className="font-bold text-primary dark:text-purple-300">key: 2</span>
                      <span className="text-outline">→</span>
                      <span className="bg-surface-container-lowest dark:bg-black/30 px-2 py-0.2 rounded-full font-semibold">
                        idx: 0
                      </span>
                    </div>

                    {/* Instant match notification */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Complement 2 exists!</span>
                    </div>
                  </div>
                </div>

                {/* Arithmetic Operational Bubble */}
                <div className="bg-surface-container-lowest dark:bg-[#131d33] p-3 rounded-xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-code-sm text-xs text-outline dark:text-white/60">Complement Calculation:</div>
                    <div className="font-code-md text-sm font-bold text-on-surface dark:text-white">
                      {target} - 7 = <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">2</span> → Found in Hash Map at index #0!
                    </div>
                  </div>
                  <span className="font-code-sm text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-full font-bold">
                    O(1) Instant Match
                  </span>
                </div>
              </div>
            </div>

            {/* Synchronized Pseudocode */}
            <div className="mt-4 bg-surface-container-low dark:bg-white/5 rounded-xl p-3 border border-outline-variant/20 dark:border-white/10 font-code-sm text-xs">
              <div className="flex items-center justify-between pb-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>HASH_MAP_OPTIMAL</span>
                <span>Terminated at Line 4</span>
              </div>
              <div className="space-y-0.5 text-on-surface-variant dark:text-white/70">
                <div className="opacity-50">1 seen = {}</div>
                <div className="opacity-50">2 for i, num in enumerate(nums):</div>
                <div className="opacity-50">3 &nbsp;&nbsp;complement = target - num</div>
                <div className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                  4 &nbsp;&nbsp;if complement in seen: return [seen[complement], i]
                </div>
                <div className="opacity-50">5 &nbsp;&nbsp;seen[num] = i</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL VERDICT BANNER */}
      <section className="w-full px-4 sm:px-8 py-3">
        <div className="bg-surface-container-lowest dark:bg-[#0e1628] p-6 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white shrink-0 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-code-sm text-[11px] uppercase px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-bold">
                  Complexity Verdict
                </span>
                <span className="font-label-md text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Hash Map achieves 14x step reduction
                </span>
              </div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white mt-1">
                Spatial Inversion beats Iterative Exhaustion
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/70 mt-1 max-w-2xl leading-relaxed">
                By investing $O(n)$ space in a hash table, each candidate complement is checked in $O(1)$ amortized time, completely bypassing the quadratic nested traversal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE SUMMARY & COMPLEXITY SCALING CHARTS */}
      <section className="w-full px-4 sm:px-8 pt-3 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Telemetry Table (7 Cols) */}
          <div className="xl:col-span-7 bg-surface-container-lowest dark:bg-[#0e1628] p-6 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 dark:border-white/10">
                <div>
                  <span className="font-code-sm text-xs text-outline dark:text-white/50 uppercase font-semibold">Head-to-Head Telemetry</span>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white mt-0.5">
                    Empirical Execution Breakdown
                  </h3>
                </div>
                <span className="font-label-md text-xs bg-surface-container dark:bg-white/10 px-3 py-1 rounded-full text-secondary dark:text-cyan-300 font-bold">
                  Synchronized Seed #88219
                </span>
              </div>

              <div className="w-full overflow-x-auto mt-2">
                <table className="w-full text-left font-body-sm text-xs">
                  <thead>
                    <tr className="text-outline dark:text-white/50 font-label-md border-b border-outline-variant/20 dark:border-white/10">
                      <th className="py-2.5 font-semibold">Benchmark Dimension</th>
                      <th className="py-2.5 font-semibold text-rose-600 dark:text-rose-400">Brute Force O(n²)</th>
                      <th className="py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">Hash Map O(n)</th>
                      <th className="py-2.5 font-semibold text-right">Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface dark:text-white/80 divide-y divide-outline-variant/10 dark:divide-white/5">
                    <tr>
                      <td className="py-2.5 font-medium">Instruction Steps to Solve</td>
                      <td className="py-2.5 font-code-md">28 Steps</td>
                      <td className="py-2.5 font-code-md font-bold text-emerald-600 dark:text-emerald-400">2 Steps</td>
                      <td className="py-2.5 font-code-md font-bold text-emerald-600 dark:text-emerald-400 text-right">14.0x Faster</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Comparison / Query Ops</td>
                      <td className="py-2.5 font-code-md">11 Checks</td>
                      <td className="py-2.5 font-code-md font-bold text-emerald-600 dark:text-emerald-400">2 Hash Probes</td>
                      <td className="py-2.5 font-code-md font-bold text-emerald-600 dark:text-emerald-400 text-right">5.5x Fewer</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Auxiliary Memory Overhead</td>
                      <td className="py-2.5 font-code-md font-bold text-emerald-600 dark:text-emerald-400">0 Bytes</td>
                      <td className="py-2.5 font-code-md">O(n) Map (~24 Bytes)</td>
                      <td className="py-2.5 font-code-md text-secondary dark:text-cyan-400 text-right">Tradeoff Accepted</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Worst-Case Termination</td>
                      <td className="py-2.5 font-code-md">n(n - 1) / 2 comparisons</td>
                      <td className="py-2.5 font-code-md font-bold text-emerald-600 dark:text-emerald-400">n lookups</td>
                      <td className="py-2.5 font-code-md font-bold text-emerald-600 dark:text-emerald-400 text-right">Dominant</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Asymptotic Scaling Projections (5 Cols) */}
          <div className="xl:col-span-5 bg-surface-container-lowest dark:bg-[#0e1628] p-6 rounded-2xl shadow-sm border border-outline-variant/30 dark:border-white/10 flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-outline-variant/20 dark:border-white/10">
                <span className="font-code-sm text-xs text-outline dark:text-white/50 uppercase font-semibold">Scaling Divergence</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white mt-0.5">
                  Input Growth: n=10 to n=1,000
                </h3>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant dark:text-white/60 my-3">
                As arrays scale, quadratic comparisons skyrocket exponentially while linear lookups grow smoothly.
              </p>

              <div className="space-y-2.5">
                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-code-md font-bold text-on-surface dark:text-white block">n = 10 items</span>
                    <span className="text-outline text-[11px]">Small Array</span>
                  </div>
                  <div className="flex items-center gap-3 font-code-sm">
                    <span className="text-rose-600 dark:text-rose-400">45 ops</span>
                    <span className="text-outline">vs</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">10 ops</span>
                  </div>
                </div>

                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-code-md font-bold text-on-surface dark:text-white block">n = 100 items</span>
                    <span className="text-outline text-[11px]">Medium Input</span>
                  </div>
                  <div className="flex items-center gap-3 font-code-sm">
                    <span className="text-rose-600 dark:text-rose-400">4,950 ops</span>
                    <span className="text-outline">vs</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100 ops</span>
                  </div>
                </div>

                <div className="bg-surface-container-low dark:bg-white/5 p-3 rounded-xl flex items-center justify-between text-xs border border-primary/20">
                  <div>
                    <span className="font-code-md font-bold text-on-surface dark:text-white block">n = 1,000 items</span>
                    <span className="text-outline text-[11px]">Production Scale</span>
                  </div>
                  <div className="flex items-center gap-3 font-code-sm">
                    <span className="text-rose-600 dark:text-rose-400">499,500 ops</span>
                    <span className="text-outline">vs</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">1,000 ops (500x!)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
