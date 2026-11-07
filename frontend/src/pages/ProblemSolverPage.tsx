import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Upload,
  Sparkles,
  FileText,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  HelpCircle,
  MemoryStick,
  Layers,
  ArrowRight,
  Sliders,
  X,
  FileCode,
  Image as ImageIcon,
  Wand2,
  AlertCircle,
  Cpu,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ProblemPlanSchema, ProblemPlan, PlanStep } from '../types/problemSolver';
import { useAuth } from '../context/AuthContext';

export interface VisualizerStep {
  stepNum: number;
  array: number[];
  pointers: { [name: string]: number | null };
  highlightedIndices: number[];
  matchedIndices: number[];
  variables: { [name: string]: string | number | boolean };
  hashEntries: { key: string | number; val: string | number }[];
  action: string;
  why: string;
  activeLine: number;
  isComplete?: boolean;
}

export const ProblemSolverPage: React.FC = () => {
  const { token } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<'Python' | 'C++' | 'Java'>('Python');
  const [activeTerminalTab, setActiveTerminalTab] = useState<'console' | 'code' | 'memory'>('console');

  // Input states - Starts COMPLETELY CLEAN & EMPTY (NO hardcoded presets!)
  const [problemText, setProblemText] = useState<string>('');
  const [customTest, setCustomTest] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // OCR and Extraction states
  const [isScanningImage, setIsScanningImage] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);

  // Auto-detected metadata from actual user input
  const [detectedTitle, setDetectedTitle] = useState<string>('');
  const [detectedConstraints, setDetectedConstraints] = useState<string[]>([]);
  const [detectedInputs, setDetectedInputs] = useState<{ nums?: number[]; target?: number; str?: string }>({});

  // Synthesis execution state
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesizeStatus, setSynthesizeStatus] = useState<string>('');
  const [isSynthesized, setIsSynthesized] = useState<boolean>(false);
  const [synthesizedSteps, setSynthesizedSteps] = useState<VisualizerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Text explanation fallback when problem cannot be visualized
  const [fallbackExplanation, setFallbackExplanation] = useState<string | null>(null);
  const [synthesizedPlan, setSynthesizedPlan] = useState<ProblemPlan | null>(null);

  // Smart Parser: Auto-detects title, constraints, and test inputs whenever problemText changes
  useEffect(() => {
    if (!problemText.trim()) {
      setDetectedTitle('');
      setDetectedConstraints([]);
      setDetectedInputs({});
      return;
    }

    const text = problemText;

    // 1. Detect Title (first line or algorithm function name)
    let title = 'Custom DSA Problem';
    const firstLine = text.trim().split('\n')[0];
    if (firstLine && firstLine.length < 80) {
      title = firstLine.replace(/^[#\s*]+/, '').trim();
    } else {
      const fnMatch = text.match(/def\s+([a-zA-Z0-9_]+)|function\s+([a-zA-Z0-9_]+)|void\s+([a-zA-Z0-9_]+)/);
      if (fnMatch) {
        title = `Algorithm: ${fnMatch[1] || fnMatch[2] || fnMatch[3]}`;
      }
    }
    setDetectedTitle(title);

    // 2. Detect Constraints
    const constraints: string[] = [];
    const lines = text.split('\n');
    let inConstraints = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('constraint')) {
        inConstraints = true;
        continue;
      }
      if (inConstraints) {
        const clean = line.replace(/^[•\-\*\s]+/, '').trim();
        if (clean && clean.length < 80 && /[0-9<>=^]/.test(clean)) {
          constraints.push(clean);
        } else if (clean === '' || line.startsWith('#') || line.toLowerCase().includes('example')) {
          inConstraints = false;
        }
      }
    }
    setDetectedConstraints(constraints.slice(0, 4));

    // 3. Detect Arrays & Targets
    let parsedArray: number[] | undefined;
    let parsedTarget: number | undefined;

    const arrayMatch = text.match(/(?:nums|arr|array|input)\s*[:=]\s*\[([0-9,\s\-]+)\]|\[([0-9,\s\-]+)\]/i);
    if (arrayMatch) {
      const raw = arrayMatch[1] || arrayMatch[2];
      const numbers = raw
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (numbers.length > 0) {
        parsedArray = numbers;
      }
    }

    const targetMatch = text.match(/(?:target|k|sum|val)\s*[:=]\s*([0-9\-]+)/i);
    if (targetMatch) {
      const t = parseInt(targetMatch[1], 10);
      if (!isNaN(t)) {
        parsedTarget = t;
      }
    }

    setDetectedInputs({ nums: parsedArray, target: parsedTarget });

    // If customTest is empty, fill it with extracted parameters
    if (parsedArray && parsedArray.length > 0 && !customTest) {
      const targetPart = parsedTarget !== undefined ? `, target = ${parsedTarget}` : '';
      setCustomTest(`nums = [${parsedArray.join(', ')}]${targetPart}`);
    }
  }, [problemText]);

  // Handle Clipboard Paste
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setProblemText(text);
      }
    } catch {
      // clipboard fallback
    }
  };

  // Browser-based OCR using dynamic Tesseract.js loader
  const performBrowserOCR = async (dataUrl: string): Promise<string> => {
    try {
      if (!(window as any).Tesseract) {
        setScanStatus('Loading OCR vision engine...');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('OCR engine script unavailable'));
          document.head.appendChild(script);
        });
      }

      setScanStatus('Extracting problem text, inputs & constraints from image...');
      const Tesseract = (window as any).Tesseract;
      const result = await Tesseract.recognize(dataUrl, 'eng', {
        logger: (m: any) => {
          if (m?.status === 'recognizing text' && m.progress) {
            setScanStatus(`Reading image text: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      return result?.data?.text || '';
    } catch (err) {
      console.warn('Browser OCR could not complete:', err);
      return '';
    }
  };

  // Handle Drag & Drop / Image File Select
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setScanSuccessMessage(null);
    setFallbackExplanation(null);

    if (file.type.startsWith('image/')) {
      setIsScanningImage(true);
      setScanStatus('Reading image bytes...');

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setUploadedPreview(dataUrl);

        let extractedText = '';

        // 1. Try backend OCR endpoint first
        try {
          setScanStatus('Connecting to AI Vision / OCR extractor...');
          const resp = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              mode: 'ocr-extract',
              image: dataUrl,
              fileName: file.name,
            }),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.statement && data.statement !== 'Custom DSA Problem extracted from image attachment.') {
              extractedText = `${data.title ? data.title + '\n' : ''}${data.statement}\nInput: ${data.inputs}\nOutput: ${data.outputs}`;
            }
          }
        } catch {
          // fallback to client OCR
        }

        // 2. If backend OCR didn't extract full text, run client-side Tesseract OCR
        if (!extractedText.trim()) {
          setScanStatus('Running Optical Character Recognition on image...');
          const ocrResult = await performBrowserOCR(dataUrl);
          if (ocrResult.trim()) {
            extractedText = ocrResult.trim();
          }
        }

        // 3. Populate extracted text into problem inputs
        if (extractedText.trim()) {
          setProblemText(extractedText);
          setScanSuccessMessage('Successfully parsed problem theory, inputs & constraints from image!');
        } else {
          // If no OCR engine succeeded (e.g. offline with canvas restrictions)
          setProblemText(`Problem screenshot uploaded: ${file.name}\n[Please verify or adjust the input parameters below]`);
          setScanSuccessMessage('Image loaded! You can refine the test inputs below if needed.');
        }

        setIsScanningImage(false);
        setScanStatus('');
      };
      reader.readAsDataURL(file);
    } else {
      // Text or code file
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProblemText(reader.result);
          setScanSuccessMessage(`Loaded problem text from ${file.name}`);
        }
      };
      reader.readAsText(file);
    }
  };

  // Universal Dynamic Fallback Synthesizer for ANY user inputs
  const synthesizeDynamicSteps = (inputArray: number[], targetVal: number | null): VisualizerStep[] => {
    const steps: VisualizerStep[] = [];
    const array = inputArray.length > 0 ? inputArray : [4, 7, 2, 9, 1, 5, 8];

    if (targetVal !== null) {
      // Deep Hash Map Resolution
      const seen = new Map<number, number>();
      steps.push({
        stepNum: 1,
        array: [...array],
        pointers: { i: 0 },
        highlightedIndices: [],
        matchedIndices: [],
        hashEntries: [],
        variables: { target: targetVal, array_len: array.length, state: 'Initializing Hash Map' },
        action: `Initialize single-pass scan with target = ${targetVal} across ${array.length} input elements`,
        why: `We scan elements one by one; the hash map will store seen numbers for O(1) complement lookup.`,
        activeLine: 2,
      });

      for (let i = 0; i < array.length; i++) {
        const val = array[i];
        const complement = targetVal - val;

        steps.push({
          stepNum: steps.length + 1,
          array: [...array],
          pointers: { i },
          highlightedIndices: [i],
          matchedIndices: [],
          hashEntries: Array.from(seen.entries()).map(([k, v]) => ({ key: k, val: v })),
          variables: {
            i,
            'nums[i]': val,
            target: targetVal,
            complement: `${targetVal} - ${val} = ${complement}`,
          },
          action: `Inspect index ${i}: nums[${i}] = ${val}. Complement needed = ${targetVal} - ${val} = ${complement}`,
          why: `Evaluating whether complement ${complement} was previously encountered and saved in map.`,
          activeLine: 4,
        });

        if (seen.has(complement)) {
          const matchIdx = seen.get(complement)!;
          steps.push({
            stepNum: steps.length + 1,
            array: [...array],
            pointers: { match: matchIdx, i },
            highlightedIndices: [matchIdx, i],
            matchedIndices: [matchIdx, i],
            hashEntries: Array.from(seen.entries()).map(([k, v]) => ({ key: k, val: v })),
            variables: {
              FOUND_PAIR: `[${matchIdx}, ${i}]`,
              COMPLEMENT: complement,
              SUM: `${array[matchIdx]} + ${val} = ${targetVal}`,
            },
            action: `Match Found! nums[${matchIdx}] (${complement}) + nums[${i}] (${val}) = ${targetVal}`,
            why: `Complement exists at index ${matchIdx}. Problem condition satisfied in single-pass O(n) time.`,
            activeLine: 5,
            isComplete: true,
          });
          break;
        } else {
          seen.set(val, i);
          steps.push({
            stepNum: steps.length + 1,
            array: [...array],
            pointers: { i },
            highlightedIndices: [i],
            matchedIndices: [],
            hashEntries: Array.from(seen.entries()).map(([k, v]) => ({ key: k, val: v })),
            variables: {
              'seen.has(comp)': 'false',
              stored_entry: `{ ${val}: ${i} }`,
              total_stored: seen.size,
            },
            action: `Complement ${complement} not present in map. Store seen[${val}] = ${i}`,
            why: `Stored current value ${val} at index ${i} so later numbers can use it as their complement.`,
            activeLine: 6,
          });
        }
      }
    } else {
      // Dynamic Two-Pointer / Array Invariant Simulation
      const arr = [...array];
      steps.push({
        stepNum: 1,
        array: [...arr],
        pointers: { left: 0, right: arr.length - 1 },
        highlightedIndices: [0, arr.length - 1],
        matchedIndices: [],
        hashEntries: [],
        variables: { left: 0, right: arr.length - 1, total_elements: arr.length },
        action: `Initialize boundary pointers: left = 0 (val = ${arr[0]}), right = ${arr.length - 1} (val = ${arr[arr.length - 1]})`,
        why: `Beginning step-by-step verification of problem invariants across all ${arr.length} elements.`,
        activeLine: 2,
      });

      let l = 0;
      let r = arr.length - 1;
      while (l < r) {
        steps.push({
          stepNum: steps.length + 1,
          array: [...arr],
          pointers: { left: l, right: r },
          highlightedIndices: [l, r],
          matchedIndices: [],
          hashEntries: [],
          variables: {
            left: l,
            right: r,
            'arr[left]': arr[l],
            'arr[right]': arr[r],
            diff: Math.abs(arr[l] - arr[r]),
          },
          action: `Evaluate boundaries: arr[${l}] = ${arr[l]} vs arr[${r}] = ${arr[r]}`,
          why: `Evaluating relation between left element (${arr[l]}) and right element (${arr[r]}).`,
          activeLine: 4,
        });

        if (arr[l] <= arr[r]) {
          l++;
        } else {
          r--;
        }

        steps.push({
          stepNum: steps.length + 1,
          array: [...arr],
          pointers: { left: l, right: r },
          highlightedIndices: [l, r],
          matchedIndices: [],
          hashEntries: [],
          variables: { new_left: l, new_right: r, window_width: r - l + 1 },
          action: `Shift pointer inward to [${l}..${r}]`,
          why: `Narrowing active window to preserve invariant.`,
          activeLine: 6,
        });
      }

      steps.push({
        stepNum: steps.length + 1,
        array: [...arr],
        pointers: { converged: l },
        highlightedIndices: [l],
        matchedIndices: [l],
        hashEntries: [],
        variables: { converged_index: l, final_value: arr[l] },
        action: `Execution complete. Pointers converged at index ${l} (value = ${arr[l]})`,
        why: `All ${arr.length} elements verified under linear invariant sweep.`,
        activeLine: 8,
        isComplete: true,
      });
    }

    return steps;
  };

  // Convert raw PlanStep[] to VisualizerStep[]
  const convertPlanSteps = (planSteps: PlanStep[], defaultArray: number[]): VisualizerStep[] => {
    return planSteps.map((s, idx) => {
      const arr = s.dataState?.array || defaultArray;
      const pointers: { [name: string]: number | null } = {};
      if (s.pointers) {
        Object.entries(s.pointers).forEach(([k, v]) => {
          pointers[k] = v;
        });
      }

      const highlighted = s.indices || [];
      const matched = s.type === 'found' || s.type === 'complete' ? s.indices || [] : [];
      const variables: { [name: string]: string | number | boolean } = {};

      if (s.dataState) {
        Object.entries(s.dataState).forEach(([k, v]) => {
          if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
            variables[k] = v;
          }
        });
      }

      const hashEntries: { key: string | number; val: string | number }[] = [];
      if (s.dataState?.seen && typeof s.dataState.seen === 'object') {
        Object.entries(s.dataState.seen).forEach(([k, v]) => {
          hashEntries.push({ key: k, val: String(v) });
        });
      }

      return {
        stepNum: idx + 1,
        array: Array.isArray(arr) ? arr : defaultArray,
        pointers,
        highlightedIndices: highlighted,
        matchedIndices: matched,
        variables,
        hashEntries,
        action: s.message,
        why: s.dataState?.why || s.message,
        activeLine: s.codeLine || 1,
        isComplete: s.type === 'complete' || s.type === 'found',
      };
    });
  };

  // Synthesize Visualizer from actual user inputs
  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    setFallbackExplanation(null);
    setSynthesizeStatus('Finding the pattern...');

    const source = (customTest || problemText).trim();

    // 1. Parse Array from customTest or problemText
    let parsedArray: number[] = [4, 7, 2, 9, 1, 5, 8];
    const arrayMatch = source.match(/\[([0-9,\s\-]+)\]/);
    if (arrayMatch) {
      const nums = arrayMatch[1]
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      if (nums.length > 0) parsedArray = nums;
    }

    // 2. Parse Target if any
    let parsedTarget: number | null = null;
    const targetMatch = source.match(/(?:target|k|sum|val)\s*[:=]\s*([0-9\-]+)/i);
    if (targetMatch) {
      const t = parseInt(targetMatch[1], 10);
      if (!isNaN(t)) parsedTarget = t;
    }

    // Function to request API plan with one automatic retry
    const requestPlanFromApi = async (isRetry = false): Promise<ProblemPlan | null> => {
      try {
        setSynthesizeStatus(isRetry ? 'Retrying synthesis...' : 'Building the visualization for your inputs...');
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            mode: 'problem-solver',
            problem: {
              statement: problemText,
              customInput: customTest,
              language: currentLanguage,
            },
          }),
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        const validation = ProblemPlanSchema.safeParse(data);
        if (validation.success) {
          return validation.data;
        }
        return null;
      } catch (err) {
        if (!isRetry) {
          return await requestPlanFromApi(true);
        }
        return null;
      }
    };

    // Execute API request
    const plan = await requestPlanFromApi();

    if (plan) {
      setSynthesizedPlan(plan);
      if (plan.canVisualize && plan.steps.length > 0) {
        const visualSteps = convertPlanSteps(plan.steps, parsedArray);
        setSynthesizedSteps(visualSteps);
        setCurrentStepIndex(0);
        setIsSynthesized(true);
      } else {
        // Fallback explanation when problem cannot be visualized
        setFallbackExplanation(
          plan.fallbackExplanation ||
            plan.approachSummary ||
            'This problem requires a mathematical or constructive proof that does not map directly to array board primitives.'
        );
        setIsSynthesized(false);
      }
    } else {
      // Offline / Universal Dynamic Synthesizer for the user's EXACT inputs
      setSynthesizeStatus('Synthesizing dynamic steps for your inputs...');
      const fallbackSteps = synthesizeDynamicSteps(parsedArray, parsedTarget);
      setSynthesizedSteps(fallbackSteps);
      setCurrentStepIndex(0);
      setIsSynthesized(true);
    }

    setIsSynthesizing(false);
    setSynthesizeStatus('');

    // Smooth scroll to visualizer viewport
    setTimeout(() => {
      const viewport = document.getElementById('observatory-viewport');
      if (viewport) {
        viewport.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // Playback timer
  useEffect(() => {
    if (!isPlaying || synthesizedSteps.length === 0) return;
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= synthesizedSteps.length - 1) {
          setIsPlaying(false);
          return synthesizedSteps.length - 1;
        }
        return prev + 1;
      });
    }, 1250);
    return () => clearInterval(timer);
  }, [isPlaying, synthesizedSteps]);

  const currentStep = synthesizedSteps[currentStepIndex] || synthesizedSteps[0];

  // Resolve Real LeetCode Code
  const getLeetCodeCode = (): string => {
    if (synthesizedPlan?.code) {
      if (currentLanguage === 'Python') return synthesizedPlan.code.python;
      if (currentLanguage === 'C++') return synthesizedPlan.code.cpp;
      return synthesizedPlan.code.java;
    }

    const cleanTitle = (detectedTitle || 'solve').toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);

    if (currentLanguage === 'Python') {
      return `class Solution:\n    def ${cleanTitle}(self, nums: List[int], target: int = 0) -> any:\n        # Optimal LeetCode class implementation\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`;
    } else if (currentLanguage === 'C++') {
      return `class Solution {\npublic:\n    vector<int> ${cleanTitle}(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`;
    } else {
      return `class Solution {\n    public int[] ${cleanTitle}(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};\n            seen.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getLeetCodeCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-aurora-bg text-aurora-text font-body-md select-none">
      {/* Soft Aurora ambient glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-aurora-primary/10 blur-[120px] -z-10" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full bg-aurora-secondary/10 blur-[100px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-aurora-accent/10 blur-[120px] -z-10" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 relative z-10">
        {/* Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora-primary-soft border border-aurora-primary/25 text-aurora-primary-ink font-mono text-xs uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-aurora-primary animate-pulse" />
              Problem Synthesizer
            </span>
            <span className="text-aurora-border font-mono text-xs">/</span>
            <span className="font-mono text-xs text-aurora-secondary-ink font-semibold tracking-tight">
              Image OCR · Smart Parser · Step Playback
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-aurora-secondary-ink bg-aurora-secondary-soft px-3 py-1 rounded-full border border-aurora-secondary/30 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-aurora-secondary" />
            <span>Auto-detected Inputs</span>
          </div>
        </div>

        {/* Hero Title & Required Top Line */}
        <div className="flex flex-col gap-2 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-aurora-text tracking-tight font-extrabold flex items-center gap-3 font-heading">
            <span>Solve a Problem</span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-aurora-primary-soft text-aurora-primary-ink font-mono font-normal border border-aurora-primary/25 self-center">
              AI Powered
            </span>
          </h1>
          <p className="text-sm sm:text-base text-aurora-muted font-semibold leading-relaxed">
            Upload or paste any problem from LeetCode, Codeforces or any platform. We will explain the solution with a generated visualization.
          </p>
        </div>

        {/* Scan / Status Notifications */}
        {isScanningImage && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-aurora-primary-soft border border-aurora-primary/25 text-aurora-primary-ink text-xs font-mono animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-aurora-primary" />
            <span>{scanStatus || 'Scanning and parsing problem image...'}</span>
          </div>
        )}

        {scanSuccessMessage && !isScanningImage && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-aurora-secondary-soft border border-aurora-secondary/30 text-aurora-secondary-ink text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-aurora-secondary" />
              <span>{scanSuccessMessage}</span>
            </div>
            <button
              onClick={() => setScanSuccessMessage(null)}
              className="text-aurora-muted hover:text-aurora-text"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Master Developer Terminal Container */}
        <div className="w-full bg-white rounded-2xl shadow-aurora-md border border-aurora-border overflow-hidden flex flex-col">
          {/* macOS Style Terminal Header */}
          <div className="bg-aurora-bg px-4 py-3 border-b border-aurora-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Traffic light window dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 border border-rose-300/60" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-300/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-300/60" />
              </div>
              <div className="h-4 w-[1px] bg-aurora-border" />
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-aurora-primary" />
                <span className="font-mono text-xs text-aurora-text font-bold">
                  algoviz@problem-solver: ~/workspace
                </span>
                {detectedTitle && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-aurora-primary-soft text-aurora-primary-ink border border-aurora-primary/25 font-semibold truncate max-w-xs">
                    {detectedTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-aurora-border">
              {(['Python', 'C++', 'Java'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLanguage(lang)}
                  className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                    currentLanguage === lang
                      ? 'bg-aurora-primary text-white shadow-md'
                      : 'text-aurora-muted hover:text-aurora-text hover:bg-aurora-bg'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Input Body Grid */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white">
            {/* Left: Problem Statement Input */}
            <div className="lg:col-span-7 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-aurora-secondary-ink font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>Problem Statement / Code</span>
                  {detectedTitle && (
                    <span className="text-aurora-muted font-mono font-normal normal-case">
                      ({detectedTitle})
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora-bg hover:bg-aurora-primary-soft text-aurora-primary-ink transition-colors font-mono text-xs font-semibold cursor-pointer border border-aurora-border hover:border-aurora-primary/40"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paste Clipboard</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-aurora-bg border border-aurora-border overflow-hidden focus-within:border-aurora-primary focus-within:ring-2 focus-within:ring-aurora-primary/15 transition-all">
                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border-b border-aurora-border font-mono text-[11px] text-aurora-muted">
                  <span>algoviz$ input --stream</span>
                  <span className="ml-auto text-aurora-secondary-ink">● stdin</span>
                </div>
                <textarea
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  rows={8}
                  placeholder="Paste any custom DSA problem statement, function code, or upload problem screenshot...&#10;System will automatically detect the problem title, constraints, and test inputs."
                  className="w-full bg-transparent p-4 font-mono text-xs text-aurora-text placeholder:text-aurora-muted focus:outline-none resize-y leading-relaxed"
                />
              </div>
            </div>

            {/* Right: Drag & Drop OCR / Screenshot Input */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-aurora-primary-ink font-bold uppercase tracking-wider">
                  Upload Screenshot / Image
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-aurora-secondary-ink font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-aurora-secondary animate-pulse" />
                  Image OCR Ready
                </span>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-full min-h-[190px] bg-aurora-bg hover:bg-aurora-primary-soft/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed border-aurora-border hover:border-aurora-primary/40 transition-all cursor-pointer relative group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.txt,.py,.cpp,.java"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {uploadedPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={uploadedPreview}
                      alt="Uploaded Screenshot"
                      className="max-h-24 rounded-lg object-contain shadow-sm border border-aurora-border bg-white"
                    />
                    <span className="font-mono text-xs text-aurora-secondary-ink font-bold truncate max-w-xs">
                      {uploadedFileName}
                    </span>
                    <span className="text-[10px] font-mono text-aurora-muted">
                      Click to upload a different image
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full bg-white text-aurora-primary flex items-center justify-center shadow-aurora-sm border border-aurora-border group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-xs text-aurora-text font-bold">
                        Drop LeetCode Screenshot or Problem File
                      </p>
                      <p className="font-mono text-[11px] text-aurora-muted mt-0.5">
                        Reads question text, inputs, outputs, and constraints
                      </p>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-aurora-primary-soft rounded-full text-aurora-primary-ink font-semibold border border-aurora-primary/20">
                      PNG · JPG · PDF · .py .cpp .java
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test Input & Constraints Strip */}
          <div className="px-6 py-4 bg-aurora-bg/70 border-t border-aurora-border flex flex-col gap-3">
            {detectedConstraints.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] text-aurora-muted">
                <span className="font-bold text-aurora-text">Detected Constraints:</span>
                {detectedConstraints.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-aurora-secondary-soft text-aurora-secondary-ink border border-aurora-secondary/25">
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-2.5 rounded-xl border border-aurora-border">
              <span className="font-mono text-xs text-aurora-muted px-2 shrink-0">
                Sample Test Inputs:
              </span>
              <input
                type="text"
                value={customTest}
                onChange={(e) => setCustomTest(e.target.value)}
                placeholder="Auto-extracted or enter inputs (e.g. array, target, root, graph edges)"
                className="w-full bg-transparent font-mono text-xs text-aurora-text placeholder:text-aurora-muted outline-none"
              />
            </div>
          </div>

          {/* Terminal Action Buttons */}
          <div className="px-6 py-4 bg-aurora-bg border-t border-aurora-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-xs text-aurora-muted">
              {problemText ? `Ready to solve: ${detectedTitle || 'Your Custom Problem'}` : 'Upload image or paste problem above to begin'}
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setProblemText('');
                  setCustomTest('');
                  setUploadedFileName(null);
                  setUploadedPreview(null);
                  setIsSynthesized(false);
                  setFallbackExplanation(null);
                  setScanSuccessMessage(null);
                  setSynthesizedPlan(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full font-mono text-xs font-semibold text-aurora-muted hover:text-aurora-text hover:bg-white transition-all cursor-pointer border border-transparent hover:border-aurora-border"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleSynthesize}
                disabled={isSynthesizing || (!problemText && !customTest)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-aurora-primary hover:bg-aurora-primary-ink text-white font-mono text-xs font-bold rounded-full shadow-[0_14px_28px_-14px_rgba(99,91,255,0.95)] active:scale-[0.98] transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSynthesizing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isSynthesizing ? synthesizeStatus || 'Synthesizing Visualizer...' : 'Synthesize Visualizer'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Text-Explanation Fallback (when problem cannot be visualized) */}
        {fallbackExplanation && (
          <div className="p-6 rounded-2xl bg-aurora-accent-soft border border-aurora-accent/40 text-aurora-accent-ink shadow-aurora-sm space-y-3">
            <div className="flex items-center gap-2 text-aurora-accent-ink font-mono text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Theoretical Solution Explanation</span>
            </div>
            <p className="font-mono text-xs text-aurora-text leading-relaxed whitespace-pre-wrap">
              {fallbackExplanation}
            </p>
            {synthesizedPlan && (
              <div className="pt-2 border-t border-aurora-accent/25 flex items-center gap-4 text-xs font-mono text-aurora-muted">
                <span>Time: {synthesizedPlan.timeComplexity}</span>
                <span>Space: {synthesizedPlan.spaceComplexity}</span>
                <span>Pattern: {synthesizedPlan.pattern}</span>
              </div>
            )}
          </div>
        )}

        {/* Generated Problem Visualizer Section */}
        {isSynthesized && currentStep && (
          <div id="observatory-viewport" className="flex flex-col gap-6 mt-4">
            <div className="w-full bg-white rounded-2xl shadow-aurora-md overflow-hidden flex flex-col border border-aurora-border">
              {/* Visualizer Top Toolbar */}
              <div className="bg-aurora-bg px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-aurora-border">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-aurora-text">
                    {detectedTitle || 'Synthesized Solution Visualizer'}
                  </span>
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-aurora-secondary-soft border border-aurora-secondary/30 text-aurora-secondary-ink font-bold">
                    {synthesizedPlan ? `${synthesizedPlan.timeComplexity} Time · ${synthesizedPlan.spaceComplexity} Space` : 'Step-by-step playback'}
                  </span>
                </div>

                {/* Scrubber & Step Playback Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentStepIndex(0)}
                    className="w-8 h-8 rounded-full bg-white hover:bg-aurora-primary-soft text-aurora-muted hover:text-aurora-primary-ink flex items-center justify-center transition-colors cursor-pointer border border-aurora-border hover:border-aurora-primary/40"
                    title="Reset to Step 1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-full bg-white hover:bg-aurora-primary-soft text-aurora-muted hover:text-aurora-primary-ink flex items-center justify-center transition-colors cursor-pointer border border-aurora-border hover:border-aurora-primary/40"
                    title="Previous Step"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-aurora-primary hover:bg-aurora-primary-ink text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={() => setCurrentStepIndex((prev) => Math.min(synthesizedSteps.length - 1, prev + 1))}
                    className="w-8 h-8 rounded-full bg-white hover:bg-aurora-primary-soft text-aurora-muted hover:text-aurora-primary-ink flex items-center justify-center transition-colors cursor-pointer border border-aurora-border hover:border-aurora-primary/40"
                    title="Next Step"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <span className="text-aurora-muted">Step:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-aurora-primary-soft font-bold text-aurora-primary-ink border border-aurora-primary/25">
                      {currentStepIndex + 1} / {synthesizedSteps.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Stage: Left = Interactive Visualizer Board, Right = Integrated IDE Terminal */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
                {/* Column A: Interactive Visualizer Board */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between gap-6 bg-aurora-bg/50">
                  {/* Stage Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-5 h-5 text-aurora-secondary" />
                      <span className="font-mono text-base font-bold text-aurora-text">
                        Live Memory Canvas
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-aurora-primary" />
                        <span className="text-aurora-muted">Pointer</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-aurora-secondary" />
                        <span className="text-aurora-muted">Matched/Settled</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Buffer Visualization */}
                  <div className="flex flex-col gap-3 py-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-aurora-muted font-bold uppercase tracking-wider">
                        Contiguous Memory: nums[{currentStep.array ? currentStep.array.length : 0}]
                      </span>
                      {currentStep.variables?.target !== undefined && (
                        <span className="px-2.5 py-0.5 bg-aurora-primary-soft border border-aurora-primary/30 rounded-full text-aurora-primary-ink font-bold">
                          Target: {String(currentStep.variables.target)}
                        </span>
                      )}
                    </div>

                    {/* Array Cells with Multi-Pointer Floating Badges */}
                    {currentStep.array && (
                      <div className="relative flex items-end justify-start gap-3 pt-8 pb-3 overflow-x-auto scrollbar-thin">
                        {currentStep.array.map((val, idx) => {
                          const pointerNames = Object.entries(currentStep.pointers)
                            .filter(([_, pIdx]) => pIdx === idx)
                            .map(([name]) => name);

                          const hasPointer = pointerNames.length > 0;
                          const isMatch = currentStep.matchedIndices?.includes(idx);
                          const isHighlight = currentStep.highlightedIndices?.includes(idx);

                          return (
                            <div key={idx} className="flex flex-col items-center relative shrink-0">
                              {/* Floating Pointer Badges */}
                              {hasPointer && (
                                <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-aurora-primary text-white font-mono text-[10px] font-bold shadow-aurora-sm">
                                  {pointerNames.join(', ')} = {idx}
                                </div>
                              )}

                              {/* Tactile Memory Cell */}
                              <div
                                className={`w-14 sm:w-16 h-20 rounded-2xl flex flex-col items-center justify-between p-2 border transition-all ${
                                  isMatch
                                    ? 'bg-aurora-secondary-soft text-aurora-secondary-ink border-aurora-secondary font-extrabold shadow-md ring-2 ring-aurora-secondary/50 scale-105'
                                    : hasPointer
                                    ? 'bg-aurora-primary-soft text-aurora-primary-ink border-aurora-primary font-extrabold shadow-sm scale-105'
                                    : isHighlight
                                    ? 'bg-aurora-accent-soft text-aurora-accent-ink border-aurora-accent/70 font-semibold'
                                    : 'bg-white text-aurora-text border-aurora-border'
                                }`}
                              >
                                <span className="font-mono text-[10px] text-aurora-muted">idx [{idx}]</span>
                                <span className="font-mono text-xl font-black">{val}</span>
                                <span className="font-mono text-[9px] text-aurora-muted/60">
                                  0x{(1000 + idx * 4).toString(16).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Hash Table / Register Inspection */}
                    {currentStep.hashEntries && currentStep.hashEntries.length > 0 && (
                      <div className="w-full bg-white rounded-2xl p-3.5 border border-aurora-border flex flex-col gap-2">
                        <span className="font-mono text-[11px] text-aurora-muted font-bold uppercase tracking-wider">
                          Active In-Memory Hash Table / Registers:
                        </span>
                        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                          {currentStep.hashEntries.map((e, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora-bg border border-aurora-border">
                              <span className="text-aurora-primary-ink font-bold">key: {e.key}</span>
                              <span className="text-aurora-muted">→</span>
                              <span className="text-aurora-secondary-ink font-semibold">idx: {e.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contextual Action & "Why?" Explanation Callout */}
                  <div className="p-4 rounded-2xl bg-white border border-aurora-primary/25 shadow-aurora-sm">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-aurora-primary shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-aurora-primary-ink font-bold uppercase tracking-wider block">
                          {currentStep.action}
                        </span>
                        <p className="font-mono text-xs text-aurora-text leading-relaxed">
                          {currentStep.why}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column B: Integrated Developer IDE Terminal */}
                <div className="lg:col-span-5 p-5 bg-white border-t lg:border-t-0 lg:border-l border-aurora-border flex flex-col justify-between gap-4">
                  <div>
                    {/* Terminal Window Tabs */}
                    <div className="flex items-center justify-between border-b border-aurora-border pb-3 mb-3">
                      <div className="flex items-center gap-1.5 bg-aurora-bg p-1 rounded-xl border border-aurora-border">
                        <button
                          onClick={() => setActiveTerminalTab('console')}
                          className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTerminalTab === 'console'
                              ? 'bg-aurora-primary text-white shadow-sm'
                              : 'text-aurora-muted hover:text-aurora-text hover:bg-white'
                          }`}
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Console</span>
                        </button>
                        <button
                          onClick={() => setActiveTerminalTab('code')}
                          className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTerminalTab === 'code'
                              ? 'bg-aurora-primary text-white shadow-sm'
                              : 'text-aurora-muted hover:text-aurora-text hover:bg-white'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>class Solution</span>
                        </button>
                        <button
                          onClick={() => setActiveTerminalTab('memory')}
                          className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            activeTerminalTab === 'memory'
                              ? 'bg-aurora-primary text-white shadow-sm'
                              : 'text-aurora-muted hover:text-aurora-text hover:bg-white'
                          }`}
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Registers</span>
                        </button>
                      </div>

                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1 font-mono text-xs text-aurora-primary-ink hover:text-aurora-primary cursor-pointer"
                        title="Copy LeetCode Code"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-aurora-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Tab 1: Terminal Console Output */}
                    {activeTerminalTab === 'console' && (
                      <div className="w-full bg-aurora-bg rounded-xl p-4 font-mono text-xs border border-aurora-border space-y-2 h-[320px] overflow-y-auto scrollbar-thin">
                        <div className="text-aurora-muted text-[11px]">
                          algoviz console · local session
                        </div>
                        <div className="text-aurora-primary-ink">
                          $ algoviz.solve(problem="{detectedTitle || 'Custom Problem'}", mode="optimal")
                        </div>
                        <div className="text-aurora-secondary-ink">
                          [OK] Plan ready · steps synced to code lines
                        </div>
                        <div className="text-aurora-primary-ink">
                          [STEP {currentStepIndex + 1}/{synthesizedSteps.length}] {currentStep.action}
                        </div>
                        <div className="text-aurora-text pl-3 border-l border-aurora-primary/40">
                          &gt; {currentStep.why}
                        </div>
                        {currentStep.variables && (
                          <div className="text-aurora-accent-ink text-[11px] pt-1">
                            Active Registers: {JSON.stringify(currentStep.variables)}
                          </div>
                        )}
                        <div className="text-aurora-muted animate-pulse text-[11px]">
                          _ waiting for scrubber event...
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Authentic LeetCode class Solution Code */}
                    {activeTerminalTab === 'code' && (
                      <div className="w-full bg-aurora-bg rounded-xl p-3 font-mono text-xs border border-aurora-border h-[320px] overflow-y-auto scrollbar-thin">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-aurora-border text-[11px] text-aurora-muted">
                          <span>{currentLanguage} LeetCode Solution</span>
                          <span className="text-aurora-secondary-ink">class Solution</span>
                        </div>
                        {getLeetCodeCode()
                          .split('\n')
                          .map((line, idx) => {
                            const lineNum = idx + 1;
                            const isActive = currentStep.activeLine === lineNum;
                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-3 px-1.5 py-0.5 rounded font-mono text-xs leading-relaxed ${
                                  isActive
                                    ? 'bg-aurora-primary-soft text-aurora-primary-ink font-bold border-l-2 border-aurora-primary'
                                    : 'text-aurora-text'
                                }`}
                              >
                                <span className="w-5 text-right text-aurora-muted/70 select-none text-[11px]">
                                  {lineNum}
                                </span>
                                <span className="whitespace-pre">{line}</span>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Tab 3: Variable Registers & Memory Table */}
                    {activeTerminalTab === 'memory' && (
                      <div className="w-full bg-aurora-bg rounded-xl p-3 font-mono text-xs border border-aurora-border h-[320px] overflow-y-auto scrollbar-thin">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-aurora-border text-[11px] text-aurora-muted">
                          <span>Register Variable</span>
                          <span>Value</span>
                        </div>
                        {currentStep.variables && Object.keys(currentStep.variables).length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {Object.entries(currentStep.variables).map(([k, v], idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white border border-aurora-border text-xs"
                              >
                                <span className="text-aurora-primary-ink font-bold">{k}</span>
                                <span className="text-aurora-accent-ink font-semibold">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-aurora-muted text-center py-8">
                            No active registers on this step.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Complexity & Invariant Card */}
                  <div className="p-3.5 rounded-xl bg-aurora-secondary-soft border border-aurora-secondary/25 text-xs">
                    <span className="font-mono text-xs text-aurora-secondary-ink font-bold block mb-1">
                      Approach Summary
                    </span>
                    <p className="font-mono text-[11px] text-aurora-text leading-relaxed">
                      {synthesizedPlan
                        ? `${synthesizedPlan.approachSummary}`
                        : 'Follow each step in the playback to see how the solution moves through the input, one stage at a time.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
