import { useState, useEffect, useCallback } from 'react';
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

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    setLoading(true);
    
    try {
      const data = await apiService.getVideos();
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Insights - Tube Virality';
    loadData();
  }, [loadData]);

  // Prepare data for ViewsOverTimeChart - include all data up to Dec 7, 2025
  const viewsOverTimeData = videos
    .filter(v => {
      if (!v.publishedAt || !v.views) return false;
      const videoDate = new Date(v.publishedAt);
      const dec7 = new Date('2025-12-07');
      return videoDate <= dec7;
    })
    .map(v => ({
      date: v.publishedAt!,
      views: v.views!
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    const country = v.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = { videoCount: 0, totalViews: 0, totalEngagement: 0, count: 0 };
    }
    acc[country].videoCount += 1;
    acc[country].totalViews += (v.views || 0);
    acc[country].totalEngagement += (v.engagementRate || 0);
    acc[country].count += 1;
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

  // Prepare data for MultiVideoTimelineChart
  const top5Videos = videos
    .filter(v => v.views)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
  const videoTitles = top5Videos.map(v => v.title);
  
  // Generate timeline data from actual published dates
  const timelineData = (() => {
    // Get unique dates from all videos
    const allDates = videos
      .map(v => v.publishedAt?.split('T')[0])
      .filter((date): date is string => Boolean(date))
      .sort();
    
    const uniqueDates = Array.from(new Set(allDates)).slice(-30); // Last 30 days
    
    return uniqueDates.map(date => {
      const dataPoint: TimelineData = { date };
      top5Videos.forEach((video, idx) => {
        // For each video, use cumulative views up to that date
        // If video was published before or on this date, show views, otherwise 0
        const videoDate = video.publishedAt?.split('T')[0];
        dataPoint[`video${idx + 1}`] = (videoDate && date && videoDate <= date) ? (video.views || 0) : 0;
      });
      return dataPoint as TimelineData;
    });
  })();

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
          const dayName = days[date.getDay()]; // 0 = Sunday, 1 = Monday, etc.
          const hour = date.getHours();
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
              isLoading={loading}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

