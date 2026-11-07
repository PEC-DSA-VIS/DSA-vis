import React, { useState, useEffect } from 'react';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Shuffle,
  Sparkles,
  SlidersHorizontal,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const InputPanel: React.FC = () => {
  const {
    currentAlgorithm,
    input,
    inputError,
    setInput,
    generateRandomInput,
    setPreset,
  } = useAlgorithmStore();

  const isSearchAlgo = currentAlgorithm.boardType === 'array-search';

  // Local state for text input editing
  const [arrayStr, setArrayStr] = useState<string>('');
  const [targetStr, setTargetStr] = useState<string>('');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  useEffect(() => {
    if (input) {
      if (Array.isArray(input.array)) {
        setArrayStr(input.array.join(', '));
      }
      if (input.target !== undefined) {
        setTargetStr(String(input.target));
      }
    }
  }, [input]);

  const handleApplyCustom = () => {
    try {
      const parsedArray = arrayStr
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => Number(s));

      if (parsedArray.some((n) => isNaN(n))) {
        useAlgorithmStore.setState({ inputError: 'All array values must be valid numbers' });
        return;
      }

      if (isSearchAlgo) {
        const parsedTarget = Number(targetStr);
        if (isNaN(parsedTarget)) {
          useAlgorithmStore.setState({ inputError: 'Target must be a valid number' });
          return;
        }
        setInput({ array: parsedArray, target: parsedTarget });
      } else {
        setInput({ array: parsedArray });
      }

      setIsEditingCustom(false);
    } catch (err) {
      useAlgorithmStore.setState({ inputError: 'Failed to parse custom array' });
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-card border-b border-border select-none">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Input editing toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Input:</span>
          </div>

          {/* Preset Buttons */}
          {currentAlgorithm.presets && currentAlgorithm.presets.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentAlgorithm.presets.slice(0, 3).map((preset, idx) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2.5 rounded-md hover:bg-muted"
                  onClick={() => setPreset(idx)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}

          {/* Random Generate Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2.5 rounded-md gap-1.5"
            onClick={generateRandomInput}
          >
            <Shuffle className="w-3 h-3 text-primary" />
            <span>Randomize</span>
          </Button>

          {/* Custom Input Toggle Button */}
          <Button
            variant={isEditingCustom ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 text-xs px-2.5 rounded-md"
            onClick={() => setIsEditingCustom(!isEditingCustom)}
          >
            {isEditingCustom ? 'Cancel Custom' : 'Custom Input'}
          </Button>
        </div>

        {/* Right Info: Tags / Current Input summary */}
        <div className="text-xs text-muted-foreground font-mono hidden md:flex items-center gap-2">
          <span>Array ({input?.array?.length || 0} items)</span>
          {isSearchAlgo && <span>• Target: {input?.target}</span>}
        </div>
      </div>

      {/* Expanded Custom Input Form */}
      {isEditingCustom && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border mt-1 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[11px] text-muted-foreground block mb-1">
              Array Elements (comma separated, max 20 items):
            </label>
            <Input
              value={arrayStr}
              onChange={(e) => setArrayStr(e.target.value)}
              placeholder="e.g. 5, 12, 23, 45, 67"
              className="font-mono text-xs h-8"
            />
          </div>

          {isSearchAlgo && (
            <div className="w-28">
              <label className="text-[11px] text-muted-foreground block mb-1">
                Target Value:
              </label>
              <Input
                value={targetStr}
                onChange={(e) => setTargetStr(e.target.value)}
                placeholder="Target"
                className="font-mono text-xs h-8"
              />
            </div>
          )}

          <div className="flex items-end gap-2 pt-4">
            <Button size="sm" className="h-8 text-xs px-3" onClick={handleApplyCustom}>
              Apply Custom Input
            </Button>
          </div>
        </div>
      )}

      {/* Input Validation Error Banner */}
      {inputError && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-destructive/15 text-destructive border border-destructive/30 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}
    </div>
  );
};
