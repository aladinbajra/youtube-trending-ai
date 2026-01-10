import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Eye, ThumbsUp, MessageSquare, Rocket, Users, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  StatCard, ProgressCard, CountryTable, VideoCard, VideoDetailModal,
  SearchBar, FilterBar, SortBar, ExportButton, Pagination, ViewToggle, VideoListItem,
  LoadingSpinner, AIInsightsPanel,
  type FilterOptions, type SortField, type SortDirection, type ViewMode
} from '../components';
import { apiService } from '../services/api';
import { getCountryName } from '../utils/countryMap';
import type { Video } from '../types';

const PAGE_SIZE = 20;
const CATEGORY_TABS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'ALL' },
  { key: 'music', label: 'Music' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'sports', label: 'Sports' },
  { key: 'news', label: 'News' },
  { key: 'tech', label: 'Tech' },
  { key: 'food', label: 'Food' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'education', label: 'Education' },
  { key: 'comedy', label: 'Comedy' },
  { key: 'culture', label: 'Culture' },
];

export const Analytics = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortField, setSortField] = useState<SortField>('views');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [category, setCategory] = useState<string>('all');
  const [appliedCategory, setAppliedCategory] = useState<string>('all');
  const categoryDebounceRef = useRef<number | null>(null);
    
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(true);
    
    try {
      console.log('[Analytics] Fetching videos for category:', appliedCategory);
      const data = await apiService.getVideos({ limit: 100, offset: 0, category: appliedCategory });
      const totalViews = data.reduce((sum, v) => sum + (v.views || 0), 0);
      const totalLikes = data.reduce((sum, v) => sum + (v.likes || 0), 0);
      const totalComments = data.reduce((sum, v) => sum + (v.comments || 0), 0);
      
        console.log('[Analytics] Loaded videos:', data.length);
      console.log('[Analytics] Total Views:', totalViews.toLocaleString(), `(${(totalViews / 1000000).toFixed(2)}M)`);
      console.log('[Analytics] Total Likes:', totalLikes.toLocaleString());
      console.log('[Analytics] Total Comments:', totalComments.toLocaleString());
      console.log('[Analytics] Engagement Rate:', totalViews > 0 ? (((totalLikes + totalComments) / totalViews) * 100).toFixed(2) + '%' : '0%');
      console.log('[Analytics] Avg Comments:', data.length > 0 ? Math.floor(totalComments / data.length).toLocaleString() : '0');
      
        setVideos(data);
      // Trigger refresh for AI components
      setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      setIsRefreshing(false);
      }
  }, [appliedCategory]);

  useEffect(() => {
    document.title = 'Analytics Dashboard - Tube Virality';
    loadData();
  }, [loadData]);

  useEffect(() => {
    return () => {
      if (categoryDebounceRef.current) {
        window.clearTimeout(categoryDebounceRef.current);
      }
    };
  }, []);

  const calculateMetrics = () => {
    if (videos.length === 0) return { totalViews: 0, avgEngagement: 0, avgComments: 0 };

    const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);
    const totalComments = videos.reduce((sum, v) => sum + (v.comments || 0), 0);
    
    // Engagement rate = (Likes + Comments) / Views * 100
    const totalEngagements = totalLikes + totalComments;
    const avgEngagement = totalViews > 0 ? (totalEngagements / totalViews) * 100 : 0;
    const avgComments = videos.length > 0 ? totalComments / videos.length : 0;

    // Format total views (round to nearest million with decimal if needed)
    const viewsInMillions = totalViews / 1000000;
    const formattedViews = viewsInMillions >= 1 
      ? Math.floor(viewsInMillions) 
      : Math.floor(viewsInMillions * 10) / 10;

    return {
      totalViews: formattedViews,
      avgEngagement: parseFloat(avgEngagement.toFixed(2)),
      avgComments: Math.floor(avgComments),
    };
  };

  const getViralityIndicators = () => {
    if (videos.length === 0) {
      return { growthVelocity: 0, audienceReach: 0, trendingDuration: 0 };
    }

    // Calculate averages from all videos
    const totalGrowth = videos.reduce((sum, v) => sum + (v.growthVelocity || 0), 0);
    const totalReach = videos.reduce((sum, v) => sum + (v.audienceReach || 0), 0);
    const totalDuration = videos.reduce((sum, v) => sum + (v.trendingDuration || 0), 0);

    return {
      growthVelocity: Math.round(totalGrowth / videos.length),
      audienceReach: Math.round(totalReach / videos.length),
      trendingDuration: Math.round(totalDuration / videos.length),
    };
  };

  const getCountryData = () => {
    type CountryAgg = {
      videoCount: number;
      weightedEngagementNumerator: number; // sum(engagementRate% * views)
      weightSum: number; // sum(views)
    };

    const MIN_VIEWS_FOR_STABILITY = 10000; // ignore tiny denominators
    const MAX_REASONABLE_ENGAGEMENT = 20; // cap at 20% to cut outliers

    const countryToAgg = new Map<string, CountryAgg>();
    
    videos.forEach(video => {
      const country = video.country;
      const views = video.views || 0;
      const likes = video.likes || 0;
      const comments = video.comments || 0;
      if (!country) return;

      const agg = countryToAgg.get(country) || {
        videoCount: 0,
        weightedEngagementNumerator: 0,
        weightSum: 0,
      };
      agg.videoCount += 1;

      // Robust per-video engagement rate (%) with guards & clamping
      if (views >= MIN_VIEWS_FOR_STABILITY) {
        let engagementRate = ((likes + comments) / views) * 100;
        if (Number.isFinite(engagementRate)) {
          // Clamp to a reasonable max to avoid skew from anomalies
          if (engagementRate < 0) engagementRate = 0;
          if (engagementRate > MAX_REASONABLE_ENGAGEMENT) engagementRate = MAX_REASONABLE_ENGAGEMENT;
          agg.weightedEngagementNumerator += engagementRate * views;
          agg.weightSum += views;
        }
      }

      countryToAgg.set(country, agg);
    });

    const sorted = Array.from(countryToAgg.entries())
      .sort((a, b) => b[1].videoCount - a[1].videoCount)
      .slice(0, 5);

    return sorted.map(([code, agg], index) => {
      const avgEngagement = agg.weightSum > 0
        ? agg.weightedEngagementNumerator / agg.weightSum
        : 0;
      return {
      rank: index + 1,
        name: getCountryName(code),
        videoCount: agg.videoCount,
        engagement: parseFloat(avgEngagement.toFixed(2)),
      };
    });
  };

  // Filter, search, and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    let result = [...videos];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.title?.toLowerCase().includes(query) ||
        v.channelTitle?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.country) {
      result = result.filter(v => v.country === filters.country);
    }
    if (filters.minViews) {
      result = result.filter(v => (v.views || 0) >= filters.minViews!);
    }
    if (filters.maxViews) {
      result = result.filter(v => (v.views || 0) <= filters.maxViews!);
    }
    if (filters.minVirality) {
      result = result.filter(v => (v.viralityScore || 0) >= filters.minVirality!);
    }

    // Apply sort
    result.sort((a, b) => {
      let aVal: number | string = (a[sortField] as number) || 0;
      let bVal: number | string = (b[sortField] as number) || 0;

      if (sortField === 'publishedAt') {
        const aDate = a.publishedAt || '';
        const bDate = b.publishedAt || '';
        aVal = new Date(aDate).getTime();
        bVal = new Date(bDate).getTime();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [videos, searchQuery, filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedVideos.length / PAGE_SIZE);
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredAndSortedVideos.slice(start, end);
  }, [filteredAndSortedVideos, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortField, sortDirection, appliedCategory]);

  const metrics = calculateMetrics();
  const countryData = getCountryData();

  const handleCategorySelect = useCallback((nextCategory: string) => {
    if (nextCategory === category) return;
    setCategory(nextCategory);
    if (categoryDebounceRef.current) {
      window.clearTimeout(categoryDebounceRef.current);
    }
    categoryDebounceRef.current = window.setTimeout(() => {
      setAppliedCategory(nextCategory);
    }, 150);
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Analytics <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-text-body text-lg">
            Comprehensive insights into YouTube video performance and trends
          </p>
            </div>
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-youtube rounded-button hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              title="Refresh all data"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Views"
              value={`${metrics.totalViews}M+`}
              icon={Eye}
              gradient="bg-youtube"
            />
            <StatCard
              title="Engagement Rate"
              value={`${metrics.avgEngagement.toFixed(2)}%`}
              icon={ThumbsUp}
              gradient="bg-viral"
            />
            <StatCard
              title="Avg Comments"
              value={metrics.avgComments.toLocaleString()}
              icon={MessageSquare}
              gradient="bg-gradient-to-r from-accent to-secondary"
            />
          </div>
        </section>

        {/* AI Insights Section */}
        <section className="mb-12">
          <AIInsightsPanel key={refreshKey} />
        </section>

        {/* Virality Indicators */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Virality Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressCard title="Growth Velocity" percentage={getViralityIndicators().growthVelocity} icon={Rocket} color="bg-youtube" />
            <ProgressCard title="Audience Reach" percentage={getViralityIndicators().audienceReach} icon={Users} color="bg-viral" />
            <ProgressCard title="Trending Duration" percentage={getViralityIndicators().trendingDuration} icon={Clock} color="bg-accent" />
          </div>
        </section>

        {/* Country Performance */}
        <section className="mb-12">
          {countryData.length > 0 && <CountryTable countries={countryData} />}
        </section>

        {/* Search, Filter, Sort & Export */}
        <section className="mb-8">
          <div className="overflow-x-auto mb-6">
            <div className="inline-flex items-center gap-2 bg-zinc-900/40 border border-zinc-800 rounded-button p-1">
              {CATEGORY_TABS.map((tab) => {
                const isActive = tab.key === category;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleCategorySelect(tab.key)}
                    className={`px-4 py-2 text-sm font-semibold rounded-button transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-youtube text-white shadow-glow'
                        : 'text-text-body hover:text-text-heading hover:bg-zinc-800/60'
                    }`}
                    aria-pressed={isActive}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} placeholder="Search videos by title or channel..." />
            </div>
            <div className="flex gap-4">
              <ExportButton videos={filteredAndSortedVideos} filename="analytics-export" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <FilterBar 
              videos={videos} 
              onFilterChange={setFilters} 
              activeFilters={filters}
            />
            <div className="flex gap-4">
              <SortBar
                sortField={sortField}
                sortDirection={sortDirection}
                onSortChange={(field, direction) => {
                  setSortField(field);
                  setSortDirection(direction);
                }}
              />
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-text-body">
            Showing <span className="text-primary font-semibold">{filteredAndSortedVideos.length}</span> of{' '}
            <span className="font-semibold">{videos.length}</span> videos
          </div>
        </section>

        {/* Videos Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Videos</h2>
          
          {filteredAndSortedVideos.length === 0 && !loading && (
            <div className="bg-card-gradient rounded-card border border-zinc-800 p-12 text-center">
              <p className="text-text-body text-lg">No videos match your filters</p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2 bg-youtube rounded-button hover:shadow-glow transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedVideos.map((video) => (
                <VideoCard 
                  key={video.videoId} 
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {paginatedVideos.map((video) => (
                <VideoListItem
                  key={video.videoId}
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredAndSortedVideos.length > PAGE_SIZE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={filteredAndSortedVideos.length}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </div>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

