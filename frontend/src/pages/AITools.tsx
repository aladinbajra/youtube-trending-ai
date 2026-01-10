import { Brain, Wand2, TrendingUp, Lightbulb, Database, Zap, Target, Sparkles, BarChart3, Cpu, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { AITitleGenerator, AIInsightsPanel, AIVideoAnalyzer, AIScoreExplainer, AITrendingTopics } from '../components';
import { apiService } from '../services/api';
import type { Video } from '../types';

export const AITools = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [dataPoints, setDataPoints] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState<{ totalVideos: number; countries: number } | null>(null);

  const loadVideos = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await apiService.getVideos();
      setVideos(data);
      setRefreshKey(prev => prev + 1);
      const timestamp = Date.now();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const res = await fetch(`${apiUrl}/api/stats?_t=${timestamp}`, { cache: 'no-cache', headers: { 'Cache-Control': 'no-cache' } });
      if (res.ok) {
        const s = await res.json();
        setStats({ totalVideos: s.total_videos, countries: s.countries });
        setDataPoints(s.data_points ?? null);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'AI Tools - Tube Virality';
    loadVideos();
  }, [loadVideos]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-semibold">Powered by GPT-4o-mini</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI <span className="gradient-text">Content Tools</span>
              </h1>
              
              <p className="text-text-body text-lg max-w-3xl">
                Leverage artificial intelligence to optimize your content strategy and predict viral success
              </p>
            </div>
            <button
              onClick={loadVideos}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-youtube rounded-button hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              title="Refresh video data"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIInsightsPanel key={`insights-${refreshKey}`} />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card-gradient rounded-card border border-zinc-800 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Capabilities</h3>
                <p className="text-sm text-text-body">What our AI can do</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 bg-zinc-900/30 rounded-lg p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Title Generation</h4>
                  <p className="text-sm text-text-body">
                    Generate viral title suggestions with predicted success rates
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-zinc-900/30 rounded-lg p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                  <Brain className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Score Explanation</h4>
                  <p className="text-sm text-text-body">
                    Understand why videos succeed or fail with AI-powered analysis
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-zinc-900/30 rounded-lg p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Trend Detection</h4>
                  <p className="text-sm text-text-body">
                    Automatically identify emerging topics and patterns
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-zinc-900/30 rounded-lg p-4">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Smart Insights</h4>
                  <p className="text-sm text-text-body">
                    Get actionable recommendations distilled from {stats ? stats.totalVideos.toLocaleString() : 'thousands of'} real YouTube case studies.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {stats ? (stats.totalVideos >= 1000 ? `${(Math.round((stats.totalVideos / 1000) * 10) / 10).toString().replace(/\\.0$/, '')}K` : stats.totalVideos) : '—'}
                </div>
                <div className="text-xs text-text-body">Videos Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">GPT-4o</div>
                <div className="text-xs text-text-body">AI Model</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* All AI Tools Grid */}
        <div className="space-y-8">
          {/* Row 1: Title Generator + Trending Topics */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AITitleGenerator />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AITrendingTopics key={`topics-${refreshKey}`} />
            </motion.div>
          </div>

          {/* Row 2: Video Analyzer + Score Explainer */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AIVideoAnalyzer videos={videos} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <AIScoreExplainer videos={videos} />
            </motion.div>
          </div>
        </div>

        {/* How It Works - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-card border border-zinc-800 p-10 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-4"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Powered by Advanced AI
                </span>
              </motion.div>
              
              <h2 className="text-4xl font-bold mb-4">
                How <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">AI Powers</span> This Platform
              </h2>
              <p className="text-text-body text-lg max-w-2xl mx-auto">
                From daily data harvesting to explainable decisions, every stage is automated so you can move faster with confidence.
              </p>
            </div>
            
            {/* Process Steps */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-card p-6 border border-zinc-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Database className="w-10 h-10 text-purple-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-center">Massive Data Collection</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-body">Total Videos</span>
                      <span className="font-bold text-purple-400">
                        {stats ? stats.totalVideos.toLocaleString() : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-body">Countries</span>
                      <span className="font-bold text-purple-400">{stats ? stats.countries : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-body">Data Points</span>
                      <span className="font-bold text-purple-400">
                        {dataPoints != null
                          ? (dataPoints >= 1000
                              ? `${(Math.round((dataPoints / 1000) * 10) / 10).toString().replace(/\.0$/, '')}K+`
                              : `${dataPoints}+`)
                          : '—'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-text-body text-center leading-relaxed">
                    Automated daily sync with the YouTube Data API keeps the platform fresh across every tracked market.
                  </p>
                </div>
                
                {/* Arrow connector (hidden on mobile) */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <Zap className="w-8 h-8 text-purple-500/50" />
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-card p-6 border border-zinc-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-10 h-10 text-blue-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-center">AI Deep Analysis</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2 text-sm">
                      <Cpu className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-body">GPT-4o-mini processes patterns</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <BarChart3 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-body">Sentiment & trend detection</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-body">Predictive virality scoring</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-body text-center leading-relaxed">
                    GPT-4o-mini layers sentiment, trend velocity and correlation analysis over millions of data points.
                  </p>
                </div>
                
                {/* Arrow connector */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <Zap className="w-8 h-8 text-blue-500/50" />
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-card p-6 border border-zinc-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-10 h-10 text-green-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-center">Actionable Insights</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2 text-sm">
                      <Wand2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-body">Viral title suggestions</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-body">Content recommendations</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-body">Performance predictions</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-body text-center leading-relaxed">
                    Instantly receive recommendations you can script, schedule, and publish without additional research.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Tech Stack - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="pt-8 border-t border-zinc-800"
            >
              <div className="text-center mb-6">
                <p className="text-sm text-text-body mb-2">Powered by Industry-Leading Technology</p>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AI Technology Stack
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center hover:bg-purple-500/20 transition-colors"
                >
                  <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-purple-400 mb-1">OpenAI</p>
                  <p className="text-xs text-text-body">GPT-4o-mini</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center hover:bg-blue-500/20 transition-colors"
                >
                  <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-blue-400 mb-1">NLP</p>
                  <p className="text-xs text-text-body">Language Processing</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center hover:bg-green-500/20 transition-colors"
                >
                  <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-green-400 mb-1">ML Models</p>
                  <p className="text-xs text-text-body">Pattern Recognition</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center hover:bg-yellow-500/20 transition-colors"
                >
                  <Database className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-yellow-400 mb-1">Data Analytics</p>
                  <p className="text-xs text-text-body">{stats ? (stats.totalVideos >= 1000 ? `${(Math.round((stats.totalVideos / 1000) * 10) / 10).toString().replace(/\.0$/, '')}K` : stats.totalVideos) : '—'} Videos</p>
                </motion.div>
              </div>

              {/* Stats bar */}
              <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-lg p-4 border border-zinc-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-400">
                  {stats ? (stats.totalVideos >= 1000 ? `${(Math.round((stats.totalVideos / 1000) * 10) / 10).toString().replace(/\\.0$/, '')}K` : stats.totalVideos) : '—'}
                </p>
                <p className="text-xs text-text-body">Videos Analyzed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">{stats ? stats.countries : '—'}</p>
                <p className="text-xs text-text-body">Countries</p>
              </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">&lt;3s</p>
                    <p className="text-xs text-text-body">AI Response</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

