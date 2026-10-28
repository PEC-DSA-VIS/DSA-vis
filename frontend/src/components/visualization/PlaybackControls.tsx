import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Keyboard,
  Volume2,
  VolumeX,
  PauseCircle,
  HelpCircle,
} from 'lucide-react';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';

export const PlaybackControls: React.FC = () => {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    soundMuted,
    autoPauseImportant,
    whyDisplayMode,
    togglePlay,
    stepForward,
    stepBackward,
    jumpToStep,
    reset,
    setSpeed,
    toggleSound,
    toggleAutoPause,
    setWhyDisplayMode,
  } = useAlgorithmStore();

  const totalSteps = steps.length;
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reset();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, stepForward, stepBackward, reset, toggleSound]);

  // Interval-driven auto playback based on speed
  useEffect(() => {
    if (!isPlaying) return;

    const baseDelay = 1000; // 1 second at 1x
    const intervalTime = Math.max(25, Math.floor(baseDelay / speed));

    const timer = setInterval(() => {
      stepForward();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, stepForward]);

  return (
    <div className="w-full bg-[#0b1020]/80 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex flex-col gap-2.5 shadow-2xl select-none relative z-30">
      {/* Progress Scrubber Slider */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-xs font-mono text-cyan-400 font-semibold w-14 text-right">
          {currentStepIndex + 1}/{totalSteps}
        </span>
        <div className="flex-1 relative">
          <Slider
            min={0}
            max={Math.max(0, totalSteps - 1)}
            step={1}
            value={[currentStepIndex]}
            onValueChange={([val]) => jumpToStep(val)}
            className="w-full cursor-pointer py-1"
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground w-12">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Primary Control Buttons, Sound, Modes & Speed */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-black/30 border-white/10 hover:bg-white/10"
                  onClick={reset}
                >
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset (R)</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Step Back */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-black/30 border-white/10 hover:bg-white/10"
                  onClick={stepBackward}
                  disabled={currentStepIndex <= 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Step Back (←)</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Play / Pause Primary Button */}
          <Button
            size="sm"
            className="h-8 px-4 font-semibold gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current ml-0.5" />
                <span>{currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
              </>
            )}
          </Button>

          {/* Step Forward */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-black/30 border-white/10 hover:bg-white/10"
                  onClick={stepForward}
                  disabled={currentStepIndex >= totalSteps - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Step Forward (→)</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Skip to Backtrack */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[10px] font-mono border border-purple-500/25 text-purple-300 hover:bg-purple-500/10 hidden xl:flex cursor-pointer"
                  onClick={() => {
                    for (let i = currentStepIndex + 1; i < steps.length; i++) {
                      const st = steps[i];
                      const isBt =
                        (st.type as string) === 'backtrack' ||
                        st.reason?.action.toLowerCase().includes('backtrack') ||
                        st.reason?.rule.toLowerCase().includes('undo') ||
                        st.reason?.action.toLowerCase().includes('undo');
                      if (isBt) {
                        jumpToStep(i);
                        return;
                      }
                    }
                  }}
                  disabled={currentStepIndex >= totalSteps - 1}
                >
                  <span>Skip Backtrack</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Jump forward to next backtrack / undo phase</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Skip to Solution */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[10px] font-mono border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/10 hidden xl:flex cursor-pointer"
                  onClick={() => jumpToStep(totalSteps - 1)}
                  disabled={currentStepIndex >= totalSteps - 1}
                >
                  <span>Skip Solution</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Jump straight to final solution</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Audio Mute & Why Display Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-lg border transition-all cursor-pointer',
                    soundMuted
                      ? 'border-white/10 text-muted-foreground/60 hover:text-foreground'
                      : 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
                  )}
                  onClick={toggleSound}
                >
                  {soundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{soundMuted ? 'Unmute Sound FX (M)' : 'Mute Sound FX (M)'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Auto Pause On Important Steps */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 px-2.5 text-xs font-mono rounded-lg border gap-1.5 transition-all cursor-pointer',
                    autoPauseImportant
                      ? 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10'
                      : 'border-white/10 text-muted-foreground/70 hover:text-foreground'
                  )}
                  onClick={toggleAutoPause}
                >
                  <PauseCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Auto-Pause Key Steps</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Automatically pause when item is found, swapped, or rotated</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Why Display Mode (Beginner vs Minimal) */}
          <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-black/40 text-[11px] font-mono">
            <button
              onClick={() => setWhyDisplayMode('beginner')}
              className={cn(
                'px-2 py-0.5 rounded-md transition-colors cursor-pointer',
                whyDisplayMode === 'beginner'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Why: All
            </button>
            <button
              onClick={() => setWhyDisplayMode('minimal')}
              className={cn(
                'px-2 py-0.5 rounded-md transition-colors cursor-pointer',
                whyDisplayMode === 'minimal'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Minimal
            </button>
          </div>
        </div>

        {/* Speed Multiplier Slider */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-medium">Speed:</span>
            <span className="font-mono font-semibold text-cyan-300 w-9">{speed}x</span>
          </div>

          <div className="w-20 sm:w-28">
            <Slider
              min={0.25}
              max={20}
              step={0.25}
              value={[speed]}
              onValueChange={([val]) => setSpeed(val)}
            />
          </div>

          {/* Preset Speed Buttons */}
          <div className="hidden md:flex items-center gap-1">
            {[1, 2, 5, 20].map((s) => (
              <Button
                key={s}
                variant={speed === s ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'h-7 px-1.5 text-[11px] font-mono rounded cursor-pointer',
                  speed === s ? 'bg-cyan-500/20 text-cyan-300' : 'text-muted-foreground'
                )}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </Button>
            ))}
          </div>

          {/* Keyboard Shortcuts Hint */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden lg:flex items-center gap-1 text-[11px] text-muted-foreground bg-black/40 px-2 py-1 rounded-md border border-white/10 cursor-help">
                  <Keyboard className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Shortcuts</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-xs space-y-1 bg-[#0b1020] border-white/15">
                <div><strong>Space</strong>: Play / Pause</div>
                <div><strong>← / →</strong>: Step Back / Forward</div>
                <div><strong>R</strong>: Reset</div>
                <div><strong>M</strong>: Toggle Sound</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
