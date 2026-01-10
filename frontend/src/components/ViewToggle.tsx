import { Grid3x3, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-button p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded transition-all ${
          viewMode === 'grid'
            ? 'bg-youtube text-white'
            : 'text-text-body hover:text-text-heading'
        }`}
        aria-label="Grid view"
        data-testid="view-grid"
      >
        <Grid3x3 size={20} />
      </button>
      
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded transition-all ${
          viewMode === 'list'
            ? 'bg-youtube text-white'
            : 'text-text-body hover:text-text-heading'
        }`}
        aria-label="List view"
        data-testid="view-list"
      >
        <List size={20} />
      </button>
    </div>
  );
};

