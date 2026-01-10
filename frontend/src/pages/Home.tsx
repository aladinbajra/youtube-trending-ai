import { Sparkles, BarChart3, TrendingUp, Globe, Brain, Users, ArrowRight, LineChart, Wand2, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { StatCard, FeatureCard } from '../components';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export const Home = () => {
  const [stats, setStats] = useState([
    { title: 'Videos Analyzed', value: '—', icon: BarChart3, trend: 'Loading...', gradient: 'bg-youtube' },
    { title: 'Countries Covered', value: '—', icon: Globe, trend: 'Loading...', gradient: 'bg-viral' },
    { title: 'AI Accuracy', value: '99.2%', icon: Brain, trend: 'Powered by GPT-4o', gradient: 'bg-gradient-to-r from-accent to-secondary' },
  ]);
  const [heroTotals, setHeroTotals] = useState<{ totalVideos: number | null; countries: number | null }>({ totalVideos: null, countries: null });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const formatToday = () => {
          const d = new Date();
          const parts = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return `Updated ${parts}`;
        };
        // Get stats from backend API
        // Add cache-busting to ensure fresh stats on refresh
        const timestamp = Date.now();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const response = await fetch(`${apiUrl}/api/stats?_t=${timestamp}`, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const totalVideos = data.total_videos ?? null;
          const countryCount = data.countries ?? null;

          let videosCount: string;
          if (totalVideos != null) {
            if (totalVideos >= 1_000_000) {
              videosCount = `${(totalVideos / 1_000_000).toFixed(1)}M+`.replace('.0', '');
            } else if (totalVideos >= 1_000) {
              const rounded = Math.round((totalVideos / 1_000) * 10) / 10;
              videosCount = `${rounded.toFixed(1).replace('.0', '')}K+`;
            } else {
              videosCount = `${totalVideos}+`;
            }
          } else {
            videosCount = '—';
          }

          setStats([
            { 
              title: 'Videos Analyzed', 
              value: videosCount, 
              icon: BarChart3, 
              trend: formatToday(), 
              gradient: 'bg-youtube' 
            },
            { 
              title: 'Countries Covered', 
              value: countryCount != null ? `${countryCount}` : '—', 
              icon: Globe, 
              trend: 'Global Coverage', 
              gradient: 'bg-viral' 
            },
            { 
              title: 'AI Accuracy', 
              value: '99.2%', 
              icon: Brain, 
              trend: 'Powered by GPT-4o', 
              gradient: 'bg-gradient-to-r from-accent to-secondary' 
            },
          ]);
          setHeroTotals({ totalVideos: totalVideos ?? videos.length, countries: countryCount });
        } else {
          // Fallback: use video data
          const videos = await apiService.getVideos();
          const uniqueCountries = new Set(videos.filter(v => v.country).map(v => v.country));
          const countryCount = uniqueCountries.size || null;
          let videosCount: string;

          if (videos.length >= 1_000) {
            const rounded = Math.round((videos.length / 1_000) * 10) / 10;
            videosCount = `${rounded.toFixed(1).replace('.0', '')}K+`;
          } else {
            videosCount = `${videos.length}+`;
          }

          setStats([
            { 
              title: 'Videos Analyzed', 
              value: videosCount, 
              icon: BarChart3, 
              trend: formatToday(), 
              gradient: 'bg-youtube' 
            },
            { 
              title: 'Countries Covered', 
              value: countryCount != null ? `${countryCount}` : '—', 
              icon: Globe, 
              trend: 'Global Coverage', 
              gradient: 'bg-viral' 
            },
            { 
              title: 'AI Accuracy', 
              value: '99.2%', 
              icon: Brain, 
              trend: 'Powered by GPT-4o', 
              gradient: 'bg-gradient-to-r from-accent to-secondary' 
            },
          ]);
          setHeroTotals({ totalVideos: videos.length, countries: countryCount });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        // Keep default stats on error
      }
    };

    loadStats();
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Leverage GPT-4o-mini to generate deep insights about viral patterns, trending topics, and content optimization strategies.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Tracking',
      description: `Monitor ${heroTotals.totalVideos != null ? heroTotals.totalVideos.toLocaleString() : 'thousands of'} trending videos across ${heroTotals.countries != null ? heroTotals.countries : 'multiple'} countries with live performance metrics and engagement analysis.`,
    },
    {
      icon: LineChart,
      title: 'Advanced Visualizations',
      description: 'Interactive charts including timelines, heatmaps, scatter plots, and distribution analysis for comprehensive insights.',
    },
    {
      icon: TrendingUp,
      title: 'Virality Scoring',
      description: 'Proprietary algorithm evaluates videos based on engagement rate, growth velocity, audience reach, and trending duration.',
    },
    {
      icon: Wand2,
      title: 'Title Optimization',
      description: 'AI-powered title generator creates viral-optimized suggestions based on trending patterns and engagement data.',
    },
    {
      icon: Target,
      title: 'Trend Detection',
      description: 'Identify emerging content trends and popular topics before they reach mainstream attention.',
    },
    {
      icon: Users,
      title: 'Audience Intelligence',
      description: 'Analyze viewer demographics, behavior patterns, and regional engagement metrics across global markets.',
    },
    {
      icon: Zap,
      title: 'Growth Analysis',
      description: 'Track video performance over time with historical data and growth velocity measurements.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-zinc-900 px-4 py-2 rounded-full mb-6 border border-zinc-800 text-white">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Professional YouTube Analytics Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Predict YouTube <br />
              <span className="gradient-text">Virality</span>
            </h1>

            <p className="text-xl text-white max-w-3xl mx-auto mb-8 hero-description">
              Advanced AI-powered platform for analyzing trending videos and predicting viral success. 
              {` ${heroTotals.totalVideos != null ? heroTotals.totalVideos.toLocaleString() : '—'} videos analyzed from ${heroTotals.countries != null ? heroTotals.countries : '—'} countries.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analytics"
                className="inline-flex items-center justify-center px-8 py-4 bg-youtube rounded-button font-semibold hover:shadow-glow transition-all text-white"
              >
                View Analytics
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-700 rounded-button font-semibold hover:border-primary transition-all"
              >
                Explore Insights
                <LineChart className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Platform <span className="gradient-text">Capabilities</span>
            </h2>
            <p className="text-text-body text-lg max-w-2xl mx-auto">
              Comprehensive suite of tools for YouTube video performance analysis and virality prediction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card-gradient rounded-card p-8 border border-zinc-800 hover:border-primary/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-youtube/20 flex items-center justify-center mb-6 group-hover:shadow-glow transition-all">
                <LineChart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-text-heading">Interactive Insights</h3>
              <p className="text-text-body mb-6">
                Explore data through 8 professional visualizations: area graphs, bar charts, scatter plots, 
                heatmaps, and distribution analysis.
              </p>
              <Link to="/insights" className="inline-flex items-center text-primary hover:text-primary/80 font-medium group-hover:translate-x-1 transition-transform">
                View Insights <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card-gradient rounded-card p-8 border border-zinc-800 hover:border-primary/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-youtube/20 flex items-center justify-center mb-6 group-hover:shadow-glow transition-all">
                <Wand2 className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-text-heading">AI-Powered Tools</h3>
              <p className="text-text-body mb-6">
                Generate viral titles, analyze trending topics, and get AI insights powered by 
                GPT-4o-mini technology.
              </p>
              <Link to="/ai-tools" className="inline-flex items-center text-primary hover:text-primary/80 font-medium group-hover:translate-x-1 transition-transform">
                Try AI Tools <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card-gradient rounded-card p-8 border border-zinc-800 hover:border-primary/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-youtube/20 flex items-center justify-center mb-6 group-hover:shadow-glow transition-all">
                <BarChart3 className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-text-heading">Comprehensive Analytics</h3>
              <p className="text-text-body mb-6">
                Deep dive into video performance with engagement metrics, country breakdowns, 
                and virality indicators.
              </p>
              <Link to="/analytics" className="inline-flex items-center text-primary hover:text-primary/80 font-medium group-hover:translate-x-1 transition-transform">
                View Analytics <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-viral rounded-card p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Start Analyzing Today</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Access real-time analytics, AI-powered insights, and comprehensive visualizations 
              to understand what drives viral success on YouTube.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analytics"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-button font-semibold hover:shadow-glow transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white rounded-button font-semibold hover:bg-white/10 transition-all"
              >
                View Insights
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
