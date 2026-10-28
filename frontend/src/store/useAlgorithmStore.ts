import { create } from 'zustand';
import { StepAction, AlgorithmDefinition } from '../types';
import { algorithmRegistry, getAlgorithmById } from '../algorithms/registry';
import { ensureStepReason } from '../lib/reasonUtils';
import { soundEffects } from '../lib/audio';

interface AlgorithmStoreState {
  // Current active algorithm
  currentAlgorithmId: string;
  currentAlgorithm: AlgorithmDefinition;

  // Custom Input State
  input: any;
  inputError: string | null;

  // Step History & Precomputed Execution
  steps: StepAction[];
  currentStepIndex: number;

  // Playback Control
  isPlaying: boolean;
  speed: number; // 0.25 to 4.0 (multiplier)
  isCompleted: boolean;

  // Counters accumulated up to currentStepIndex
  comparisons: number;
  swaps: number;

  // Stats over time for complexity chart
  chartData: { step: number; comparisons: number; swaps: number }[];

  // Settings & Upgraded Experience
  soundMuted: boolean;
  autoPauseImportant: boolean; // Auto-pause on found, swap, rotation
  whyDisplayMode: 'beginner' | 'minimal';
  reduceMotion: boolean;

  // Comparison mode (for side-by-side mode)
  compareAlgorithmId: string | null;

  // Actions
  setAlgorithm: (algorithmId: string, initialInput?: any) => void;
  setInput: (newInput: any) => void;
  generateRandomInput: () => void;
  setPreset: (presetIndex: number) => void;

  // Playback actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStep: (stepIndex: number) => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setCompareAlgorithm: (id: string | null) => void;

  // Settings toggles
  toggleSound: () => void;
  toggleAutoPause: () => void;
  setWhyDisplayMode: (mode: 'beginner' | 'minimal') => void;
  toggleReduceMotion: () => void;

  // Sync with URL & localStorage
  syncToUrl: () => void;
  loadFromUrlOrStorage: () => void;
}

const LOCAL_STORAGE_KEY = 'algoviz_last_state';

// Pre-compute all steps from the generator for instant scrubbing, step-back, and stats
function computeSteps<TInput, TData>(
  algo: AlgorithmDefinition<TInput, TData>,
  input: TInput
): StepAction<TData>[] {
  const steps: StepAction<TData>[] = [];
  try {
    const generator = algo.run(input);
    let result = generator.next();
    let compCount = 0;
    let swapCount = 0;

    while (!result.done) {
      const step = result.value;
      if (step.type === 'compare') compCount++;
      if (step.type === 'swap') swapCount++;

      // Ensure every step has an ironclad reason object
      const normalizedReason = ensureStepReason(step);

      steps.push({
        ...step,
        reason: normalizedReason,
        comparisonsCount: compCount,
        swapsCount: swapCount,
      });

      result = generator.next();
    }
  } catch (err) {
    console.error('Error generating algorithm steps:', err);
  }
  return steps;
}

function buildChartData(steps: StepAction[], maxIndex: number) {
  const data: { step: number; comparisons: number; swaps: number }[] = [];
  for (let i = 0; i <= maxIndex && i < steps.length; i++) {
    data.push({
      step: i + 1,
      comparisons: steps[i].comparisonsCount || 0,
      swaps: steps[i].swapsCount || 0,
    });
  }
  return data;
}

function playStepSound(type: string) {
  switch (type) {
    case 'compare':
      soundEffects.playCompare();
      break;
    case 'swap':
      soundEffects.playSwap();
      break;
    case 'found':
    case 'sorted':
    case 'complete':
      soundEffects.playSuccess();
      break;
    case 'discard':
      soundEffects.playDiscard();
      break;
    default:
      soundEffects.playTick();
      break;
  }
}

const defaultAlgoId = 'binary-search';
const initialAlgo = getAlgorithmById(defaultAlgoId) || algorithmRegistry[0];
const initialSteps = computeSteps(initialAlgo, initialAlgo.defaultInput);

export const useAlgorithmStore = create<AlgorithmStoreState>((set, get) => ({
  currentAlgorithmId: initialAlgo.id,
  currentAlgorithm: initialAlgo,
  input: initialAlgo.defaultInput,
  inputError: null,
  steps: initialSteps,
  currentStepIndex: 0,
  isPlaying: false,
  speed: 1,
  isCompleted: initialSteps.length <= 1,
  comparisons: initialSteps[0]?.comparisonsCount || 0,
  swaps: initialSteps[0]?.swapsCount || 0,
  chartData: buildChartData(initialSteps, 0),
  compareAlgorithmId: 'bubble-sort',

  // Settings
  soundMuted: soundEffects.isMuted(),
  autoPauseImportant: true,
  whyDisplayMode: 'beginner',
  reduceMotion: false,

  setAlgorithm: (algorithmId: string, initialInput?: any) => {
    const algo = getAlgorithmById(algorithmId);
    if (!algo) return;

    const inputToUse = initialInput !== undefined ? initialInput : algo.defaultInput;
    const computedSteps = computeSteps(algo, inputToUse);

    set({
      currentAlgorithmId: algo.id,
      currentAlgorithm: algo,
      input: inputToUse,
      inputError: null,
      steps: computedSteps,
      currentStepIndex: 0,
      isPlaying: false,
      isCompleted: computedSteps.length <= 1,
      comparisons: computedSteps[0]?.comparisonsCount || 0,
      swaps: computedSteps[0]?.swapsCount || 0,
      chartData: buildChartData(computedSteps, 0),
    });

    get().syncToUrl();
  },

  setInput: (newInput: any) => {
    const { currentAlgorithm } = get();
    if (currentAlgorithm.validateInput) {
      const validation = currentAlgorithm.validateInput(newInput);
      if (!validation.valid) {
        set({ inputError: validation.error || 'Invalid input' });
        return;
      }
    }

    const computedSteps = computeSteps(currentAlgorithm, newInput);
    set({
      input: newInput,
      inputError: null,
      steps: computedSteps,
      currentStepIndex: 0,
      isPlaying: false,
      isCompleted: computedSteps.length <= 1,
      comparisons: computedSteps[0]?.comparisonsCount || 0,
      swaps: computedSteps[0]?.swapsCount || 0,
      chartData: buildChartData(computedSteps, 0),
    });

    get().syncToUrl();
  },

  generateRandomInput: () => {
    const { currentAlgorithm } = get();
    const randomInput = currentAlgorithm.generateRandomInput();
    get().setInput(randomInput);
  },

  setPreset: (presetIndex: number) => {
    const { currentAlgorithm } = get();
    if (currentAlgorithm.presets && currentAlgorithm.presets[presetIndex]) {
      get().setInput(currentAlgorithm.presets[presetIndex].value);
    }
  },

  play: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex >= steps.length - 1) {
      set({ currentStepIndex: 0, isPlaying: true, isCompleted: false });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },

  stepForward: () => {
    const { currentStepIndex, steps, autoPauseImportant, isPlaying } = get();
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const step = steps[nextIndex];

      playStepSound(step.type);

      // Auto-pause on important steps if enabled
      let shouldStopPlaying = false;
      if (isPlaying && autoPauseImportant && ['found', 'swap', 'rotate'].includes(step.type)) {
        shouldStopPlaying = true;
      }

      set({
        currentStepIndex: nextIndex,
        isPlaying: shouldStopPlaying ? false : isPlaying,
        isCompleted: nextIndex === steps.length - 1,
        comparisons: step.comparisonsCount || 0,
        swaps: step.swapsCount || 0,
        chartData: buildChartData(steps, nextIndex),
      });
    } else {
      set({ isPlaying: false, isCompleted: true });
    }
  },

  stepBackward: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const step = steps[prevIndex];
      playStepSound(step.type);

      set({
        currentStepIndex: prevIndex,
        isCompleted: false,
        comparisons: step.comparisonsCount || 0,
        swaps: step.swapsCount || 0,
        chartData: buildChartData(steps, prevIndex),
      });
    }
  },

  jumpToStep: (stepIndex: number) => {
    const { steps } = get();
    const validIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
    const step = steps[validIndex];
    if (step) playStepSound(step.type);

    set({
      currentStepIndex: validIndex,
      isCompleted: validIndex === steps.length - 1,
      comparisons: step?.comparisonsCount || 0,
      swaps: step?.swapsCount || 0,
      chartData: buildChartData(steps, validIndex),
    });
  },

  reset: () => {
    const { steps } = get();
    set({
      currentStepIndex: 0,
      isPlaying: false,
      isCompleted: false,
      comparisons: steps[0]?.comparisonsCount || 0,
      swaps: steps[0]?.swapsCount || 0,
      chartData: buildChartData(steps, 0),
    });
  },

  setSpeed: (speed: number) => {
    set({ speed });
  },

  setCompareAlgorithm: (id: string | null) => {
    set({ compareAlgorithmId: id });
  },

  toggleSound: () => {
    const newMuted = soundEffects.toggleMute();
    set({ soundMuted: newMuted });
  },

  toggleAutoPause: () => {
    set((s) => ({ autoPauseImportant: !s.autoPauseImportant }));
  },

  setWhyDisplayMode: (mode: 'beginner' | 'minimal') => {
    set({ whyDisplayMode: mode });
  },

  toggleReduceMotion: () => {
    set((s) => ({ reduceMotion: !s.reduceMotion }));
  },

  syncToUrl: () => {
    try {
      const { currentAlgorithmId, input } = get();
      const params = new URLSearchParams(window.location.search);
      params.set('algo', currentAlgorithmId);
      if (input !== undefined) {
        params.set('input', encodeURIComponent(JSON.stringify(input)));
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);

      // Save to localStorage
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ algoId: currentAlgorithmId, input })
      );
    } catch (e) {
      // Ignored in non-browser env
    }
  },

  loadFromUrlOrStorage: () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlAlgo = params.get('algo');
      const urlInput = params.get('input');

      if (urlAlgo && getAlgorithmById(urlAlgo)) {
        let parsedInput;
        if (urlInput) {
          try {
            parsedInput = JSON.parse(decodeURIComponent(urlInput));
          } catch (e) {
            // fallback
          }
        }
        get().setAlgorithm(urlAlgo, parsedInput);
        return;
      }

      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const { algoId, input } = JSON.parse(stored);
        if (algoId && getAlgorithmById(algoId)) {
          get().setAlgorithm(algoId, input);
        }
      }
    } catch (e) {
      // ignore
    }
  },
}));
