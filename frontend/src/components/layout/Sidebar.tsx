import React, { useState } from 'react';
import {
  categories,
  fullCatalog,
  getCategoriesByPart,
} from '../../algorithms/registry';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  LayoutGrid,
  Type,
  GitCommit,
  Layers,
  ArrowRightLeft,
  GitFork,
  Network,
  Hash,
  ArrowDownUp,
  Sparkles,
  GitMerge,
  Grid,
  Repeat,
  Search,
  ArrowUpDown,
  Split,
  Table,
  Zap,
  Undo2,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Complete Icon mapping
const categoryIcons: Record<string, React.ElementType> = {
  LayoutGrid,
  Type,
  GitCommit,
  Layers,
  ArrowRightLeft,
  GitFork,
  Network,
  Hash,
  ArrowDownUp,
  Sparkles,
  GitMerge,
  Grid,
  Repeat,
  Search,
  ArrowUpDown,
  Split,
  Table,
  Zap,
  Undo2,
  Cpu,
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectAlgorithm?: (algoId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onSelectAlgorithm,
}) => {
  const { currentAlgorithmId, setAlgorithm } = useAlgorithmStore();
  const [filterText, setFilterText] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleChooseAlgorithm = (algoId: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    setAlgorithm(algoId);
    if (onSelectAlgorithm) onSelectAlgorithm(algoId);
  };

  const dsCategories = getCategoriesByPart('ds');
  const algoCategories = getCategoriesByPart('algo');

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-card transition-all duration-300 select-none z-30 shrink-0',
        isOpen ? 'w-80' : 'w-14'
      )}
    >
      {/* Sidebar Header & Toggle */}
      <div className="flex h-12 items-center justify-between px-3 border-b border-border">
        {isOpen && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              DSA Curriculum
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md ml-auto text-muted-foreground hover:text-foreground"
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search Input when open */}
      {isOpen && (
        <div className="p-2.5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter topics or ops..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 h-8 text-xs bg-muted/40"
            />
          </div>
        </div>
      )}

      {/* Categories & Algorithms Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* PART 1: DATA STRUCTURES */}
        <div className="space-y-1">
          {isOpen && (
            <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary/80">
              Part 1: Data Structures (12 Topics)
            </div>
          )}
          {dsCategories.map((cat) => (
            <CategoryItem
              key={cat.id}
              cat={cat}
              isOpen={isOpen}
              filterText={filterText}
              isCollapsed={Boolean(collapsedCategories[cat.id])}
              currentAlgorithmId={currentAlgorithmId}
              onToggleCollapse={() => toggleCategoryCollapse(cat.id)}
              onSelect={handleChooseAlgorithm}
            />
          ))}
        </div>

        {/* PART 2: ALGORITHMS */}
        <div className="space-y-1 pt-2 border-t border-border">
          {isOpen && (
            <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-purple-500/80">
              Part 2: Algorithms (8 Topics)
            </div>
          )}
          {algoCategories.map((cat) => (
            <CategoryItem
              key={cat.id}
              cat={cat}
              isOpen={isOpen}
              filterText={filterText}
              isCollapsed={Boolean(collapsedCategories[cat.id])}
              currentAlgorithmId={currentAlgorithmId}
              onToggleCollapse={() => toggleCategoryCollapse(cat.id)}
              onSelect={handleChooseAlgorithm}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

function CategoryItem({
  cat,
  isOpen,
  filterText,
  isCollapsed,
  currentAlgorithmId,
  onToggleCollapse,
  onSelect,
}: any) {
  const Icon = categoryIcons[cat.iconName] || Layers;
  const algorithms = fullCatalog.filter((a) => a.category === cat.id);

  const filteredAlgorithms = filterText
    ? algorithms.filter((a) =>
        a.name.toLowerCase().includes(filterText.toLowerCase()) ||
        cat.title.toLowerCase().includes(filterText.toLowerCase())
      )
    : algorithms;

  if (filterText && filteredAlgorithms.length === 0) {
    return null;
  }

  if (!isOpen) {
    return (
      <div
        className="flex items-center justify-center p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
        title={cat.title}
        onClick={onToggleCollapse}
      >
        <Icon className="w-4 h-4 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      <button
        onClick={onToggleCollapse}
        className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2 truncate pr-1">
          <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{cat.title}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground/80 px-1 rounded bg-muted">
            {filteredAlgorithms.length}
          </span>
          <ChevronDown
            className={cn(
              'w-3 h-3 transition-transform text-muted-foreground',
              isCollapsed && '-rotate-90'
            )}
          />
        </div>
      </button>

      {!isCollapsed && (
        <div className="space-y-0.5 pl-4">
          {filteredAlgorithms.map((algo) => {
            const isSelected = currentAlgorithmId === algo.id;

            return (
              <button
                key={algo.id}
                onClick={() => onSelect(algo.id, true)}
                className={cn(
                  'flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer group',
                  isSelected
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-foreground/90 hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span className="truncate pr-2">{algo.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={cn(
                      'text-[9px] px-1 rounded font-mono font-medium',
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    )}
                  >
                    Free
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
