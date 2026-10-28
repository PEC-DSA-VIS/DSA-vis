import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { searchAlgorithms, PlannedAlgorithm } from '../../algorithms/registry';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { Search, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAlgorithm?: (algoId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  onSelectAlgorithm,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlannedAlgorithm[]>([]);
  const { setAlgorithm } = useAlgorithmStore();

  useEffect(() => {
    setResults(searchAlgorithms(query));
  }, [query]);

  // Global key combo listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (algo: PlannedAlgorithm) => {
    if (!algo.isAvailable) return;
    setAlgorithm(algo.id);
    onOpenChange(false);
    if (onSelectAlgorithm) onSelectAlgorithm(algo.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xl overflow-hidden border border-border shadow-2xl bg-card">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Type an algorithm name (e.g., 'Binary Search', 'Bubble Sort')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
            autoFocus
          />
        </div>

        {/* Algorithm Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching algorithms found for "{query}".
            </div>
          ) : (
            results.map((algo) => (
              <button
                key={algo.id}
                disabled={!algo.isAvailable}
                onClick={() => handleSelect(algo)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs transition-colors text-left group',
                  algo.isAvailable
                    ? 'hover:bg-accent cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles
                    className={cn(
                      'w-3.5 h-3.5',
                      algo.isAvailable ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors block">
                      {algo.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {algo.category} • {algo.difficulty} • Time {algo.timeComplexity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {algo.isAvailable ? (
                    <Badge variant="success" className="text-[9px]">
                      Interactive
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[9px]">
                      Coming Soon
                    </Badge>
                  )}
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>Navigation:</span>
            <kbd className="px-1 py-0.5 rounded border border-border bg-card">Esc</kbd> to close
          </div>
          <div className="flex items-center gap-1.5">
            <CornerDownLeft className="w-3 h-3" />
            <span>Select to launch visualizer</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
