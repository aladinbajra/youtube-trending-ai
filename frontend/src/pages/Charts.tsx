import { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import ViewsOverTimeChart from '../components/charts/ViewsOverTimeChart';
import TopVideosChart from '../components/charts/TopVideosChart';
import ViralityDistributionChart from '../components/charts/ViralityDistributionChart';
import CountryPerformanceChart from '../components/charts/CountryPerformanceChart';
import EngagementScatterChart from '../components/charts/EngagementScatterChart';
import MultiVideoTimelineChart from '../components/charts/MultiVideoTimelineChart';
import PublishingHeatmap from '../components/charts/PublishingHeatmap';
import ViralityHistogram from '../components/charts/ViralityHistogram';
import { apiService } from '../services/api';
import type { Video } from '../types';

interface TimelineData {
  date?: string;
  [key: string]: string | number | undefined;
}

export const Charts = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(true);

    try {
      setError('');
      const data = await apiService.getAllVideos();
      setVideos(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to load charts.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Insights - Tube Virality';
    loadData();
  }, [loadData]);

  const viewsOverTimeData = timelineData.filter(point => Boolean(point.date)).map(point => ({
    date: point.date!, views: Object.entries(point).reduce((sum, [key, value]) => sum + (key.startsWith('video') && typeof value === 'number' ? value : 0), 0),
  }));

  // Prepare data for TopVideosChart
  const topVideosData = videos
    .filter(v => v.views)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)
    .map(v => ({
      title: v.title,
      views: v.views!,
      viralityScore: v.viralityScore || 0
    }));

  // Prepare data for ViralityDistributionChart
  const viralityDistData = [
    { name: 'Viral (75-100)', value: videos.filter(v => (v.viralityScore || 0) >= 75).length },
    { name: 'High (50-75)', value: videos.filter(v => (v.viralityScore || 0) >= 50 && (v.viralityScore || 0) < 75).length },
    { name: 'Medium (25-50)', value: videos.filter(v => (v.viralityScore || 0) >= 25 && (v.viralityScore || 0) < 50).length },
    { name: 'Low (0-25)', value: videos.filter(v => (v.viralityScore || 0) < 25).length }
  ];

  // Prepare data for CountryPerformanceChart
  const countryStats = videos.reduce((acc, v) => {
    const markets = v.countries?.length ? v.countries : [v.country || 'Unknown'];
    markets.forEach(country => {
    if (!acc[country]) {
      acc[country] = { videoCount: 0, totalViews: 0, totalEngagement: 0, count: 0 };
    }
    acc[country].videoCount += 1;
    acc[country].totalViews += (v.views || 0);
    acc[country].totalEngagement += (v.engagementRate || 0);
    acc[country].count += 1;
    });
    return acc;
  }, {} as Record<string, { videoCount: number; totalViews: number; totalEngagement: number; count: number }>);

  const countryData = Object.entries(countryStats)
    .map(([country, stats]) => ({
      country,
      videoCount: stats.videoCount,
      avgViews: Math.round(stats.totalViews / stats.videoCount),
      avgEngagement: stats.totalEngagement / stats.count
    }))
    .sort((a, b) => b.videoCount - a.videoCount);

  // Prepare data for EngagementScatterChart
  const scatterData = videos
    .filter(v => v.views && v.comments)
    .slice(0, 50)
    .map(v => ({
      views: v.views!,
      engagement: v.engagementRate || 0,
      comments: v.comments!,
      viralityScore: v.viralityScore || 0,
      title: v.title
    }));

  const top5Videos = useMemo(() => [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), [videos]);
  const videoTitles = top5Videos.map(video => video.title);
  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled(top5Videos.map(video => apiService.getVideoHistory(video.videoId, controller.signal))).then(results => {
      if (controller.signal.aborted) return;
      const dates = new Map<string, TimelineData>();
      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;
        result.value.timestamps.forEach((date, position) => {
          const point = dates.get(date) || { date };
          point[`video${index + 1}`] = result.value.views[position];
          dates.set(date, point);
        });
      });
      setTimelineData([...dates.values()].sort((a, b) => a.date!.localeCompare(b.date!)));
    });
    return () => controller.abort();
  }, [top5Videos]);

  // Prepare data for PublishingHeatmap - REAL DATA from publishedAt
  const heatmapData = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts: Record<string, Record<number, number>> = {};

    // Initialize counts
    days.forEach(day => {
      counts[day] = {};
      for (let hour = 0; hour < 24; hour++) {
        counts[day][hour] = 0;
      }
    });

    // Count actual publishing times
    videos.forEach(video => {
      if (video.publishedAt) {
        try {
          const date = new Date(video.publishedAt);
          if (!Number.isFinite(date.getTime())) return;
          const dayName = days[date.getUTCDay()]; // 0 = Sunday, 1 = Monday, etc.
          const hour = date.getUTCHours();
          counts[dayName][hour]++;
        } catch (e) {
          // Skip invalid dates
        }
      }
    });

    // Convert to array format
    const result = [];
    for (const day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      for (let hour = 0; hour < 24; hour++) {
        result.push({
          day,
          hour,
          count: counts[day]?.[hour] || 0
        });
      }
    }

    return result;
  })();

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
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-youtube flex items-center justify-center shadow-glow">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Data <span className="gradient-text">Insights</span>
              </h1>
              <p className="text-text-body text-lg max-w-3xl">
                Explore interactive visualizations and deep analytics for YouTube trending videos
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-youtube rounded-button hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              title="Refresh all data and charts"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Charts'}</span>
            </button>
          </div>
        </motion.div>

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-400/40 p-5"><p>{error}</p><button type="button" className="mt-3 underline" onClick={() => void loadData()}>Retry loading charts</button></div>}
        {/* Charts Grid */}
        <div className="space-y-8">
          {/* Row 1: Views Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ViewsOverTimeChart
              data={viewsOverTimeData}
              title="Recorded views — five leading videos"
              isLoading={loading}
            />
          </motion.div>

          {/* Row 2: Top Videos & Virality Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TopVideosChart
                data={topVideosData}
                isLoading={loading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ViralityDistributionChart
                data={viralityDistData}
                isLoading={loading}
              />
            </motion.div>
          </div>

          {/* Row 3: Country Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CountryPerformanceChart
              data={countryData}
              isLoading={loading}
            />
          </motion.div>

          {/* Row 4: Engagement Scatter & Histogram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <EngagementScatterChart
                data={scatterData}
                isLoading={loading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ViralityHistogram
                data={videos}
                isLoading={loading}
              />
            </motion.div>
          </div>

          {/* Row 5: Multi-Video Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <MultiVideoTimelineChart
              data={timelineData}
              videoTitles={videoTitles}
              isLoading={loading}
            />
          </motion.div>

          {/* Row 6: Publishing Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <PublishingHeatmap
              data={heatmapData}
              title="Publishing patterns (UTC)"
              isLoading={loading}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

