import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { Video } from '../types';
import { getCountryName } from '../utils/countryMap';

interface FilterBarProps {
  videos: Video[];
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export interface FilterOptions {
  country?: string;
  minViews?: number;
  maxViews?: number;
  minVirality?: number;
}

export const FilterBar = ({ videos, onFilterChange, activeFilters }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique countries from videos
  const countries = Array.from(new Set(videos.map(v => v.country).filter(Boolean))).sort();

  const handleCountryChange = (country: string) => {
    onFilterChange({ ...activeFilters, country: country || undefined });
  };

  const handleViewsChange = (min: number, max: number) => {
    onFilterChange({
      ...activeFilters,
      minViews: min || undefined,
      maxViews: max || undefined,
    });
  };

  const handleViralityChange = (min: number) => {
    onFilterChange({
      ...activeFilters,
      minVirality: min || undefined,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="bg-card-gradient rounded-card border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-text-heading font-semibold"
        >
          <Filter size={20} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-text-body hover:text-primary transition-colors flex items-center space-x-1"
          >
            <X size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          {/* Country Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={activeFilters.country || ''}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-button text-text-heading focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              data-testid="country-filter"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{getCountryName(country)}</option>
              ))}
            </select>
          </div>

          {/* Views Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Views: {activeFilters.minViews ? formatNumber(activeFilters.minViews) : 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={activeFilters.minViews || 0}
              onChange={(e) => handleViewsChange(Number(e.target.value), activeFilters.maxViews || 10000000)}
              className="w-full accent-primary"
              data-testid="views-slider"
            />
          </div>

          {/* Virality Score */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Virality Score: {activeFilters.minVirality || 0}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={activeFilters.minVirality || 0}
              onChange={(e) => handleViralityChange(Number(e.target.value))}
              className="w-full accent-primary"
              data-testid="virality-slider"
            />
          </div>
        </div>
      )}

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && !isExpanded && (
        <div className="flex flex-wrap gap-2 mt-3">
          {activeFilters.country && (
            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>Country: {activeFilters.country}</span>
              <button
                onClick={() => handleCountryChange('')}
                className="hover:text-primary"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {activeFilters.minViews && (
            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>Views: {formatNumber(activeFilters.minViews)}+</span>
              <button
                onClick={() => handleViewsChange(0, activeFilters.maxViews || 10000000)}
                className="hover:text-primary"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {activeFilters.minVirality && (
            <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span>Virality: {activeFilters.minVirality}%+</span>
              <button
                onClick={() => handleViralityChange(0)}
                className="hover:text-primary"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

