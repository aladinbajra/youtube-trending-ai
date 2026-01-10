import { ArrowUp, ArrowDown } from 'lucide-react';

export type SortField = 'views' | 'likes' | 'comments' | 'viralityScore' | 'publishedAt';
export type SortDirection = 'asc' | 'desc';

interface SortBarProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export const SortBar = ({ sortField, sortDirection, onSortChange }: SortBarProps) => {
  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'views', label: 'Views' },
    { value: 'likes', label: 'Likes' },
    { value: 'comments', label: 'Comments' },
    { value: 'viralityScore', label: 'Virality Score' },
    { value: 'publishedAt', label: 'Date Published' },
  ];

  const toggleDirection = () => {
    onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-text-body">Sort by:</span>
      
      <select
        value={sortField}
        onChange={(e) => onSortChange(e.target.value as SortField, sortDirection)}
        className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-button text-text-heading focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        data-testid="sort-select"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={toggleDirection}
        className="p-2 bg-zinc-900 border border-zinc-800 rounded-button hover:border-primary transition-colors"
        aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
        data-testid="sort-direction"
      >
        {sortDirection === 'asc' ? (
          <ArrowUp size={20} className="text-text-heading" />
        ) : (
          <ArrowDown size={20} className="text-text-heading" />
        )}
      </button>

      <span className="text-xs text-text-body">
        {sortDirection === 'asc' ? 'Lowest first' : 'Highest first'}
      </span>
    </div>
  );
};

