import { TrendingUp, Target, Users, Clock, Flame, BarChart3, Database, Brain, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Methodology = () => {
  const [totalVideos, setTotalVideos] = useState<number | null>(null);
  const [countries, setCountries] = useState<number | null>(null);
  const [dataPoints, setDataPoints] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ts = Date.now();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const res = await fetch(`${apiUrl}/api/stats?_t=${ts}`, {
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          setTotalVideos(data.total_videos ?? null);
          setCountries(data.countries ?? null);
          setDataPoints(data.data_points ?? null);
        }
      } catch {
        // silent
      }
    };
    fetchStats();
  }, []);
  const viralityMetrics = [
    { icon: TrendingUp, title: 'Engagement Rate', description: 'Likes, comments, and shares relative to views', importance: 'High' },
    { icon: Flame, title: 'Growth Velocity', description: 'How quickly a video gains views in first hours/days', importance: 'Critical' },
    { icon: Users, title: 'Audience Reach', description: 'Views relative to channel subscriber count', importance: 'High' },
    { icon: Target, title: 'Subscriber Growth', description: 'New subscribers gained after video publication', importance: 'Medium' },
    { icon: Clock, title: 'Trending Duration', description: 'How long a video remains on trending lists', importance: 'Medium' },
    { icon: BarChart3, title: 'View Consistency', description: 'Sustained view count over time periods', importance: 'High' },
  ];

  const researchSteps = [
    `Data Collection: Retrieve daily trending videos across ${countries != null ? countries : 'multiple'} countries`,
    'Data Cleaning & Preprocessing: Handle missing values and standardize data',
    'Exploratory Analysis: Identify key trends and patterns',
    'Feature Engineering: Extract growth rate and engagement scores',
    'Model Development: Train ML models for virality prediction',
    'Evaluation & Interpretation: Validate predictions and refine models',
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Methodology</span>
          </h1>
          <p className="text-text-body text-lg max-w-3xl mx-auto">
            Scientific approach to predicting and analyzing YouTube video virality
          </p>
        </motion.div>

        {/* Defining Virality */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Defining Video Virality</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card-gradient rounded-card p-8 border border-zinc-800"
            >
              <div className="inline-block bg-zinc-900 px-4 py-2 rounded-button mb-4">
                <span className="text-text-body font-semibold">Expected Performance</span>
              </div>
              <p className="text-text-body text-lg mb-4">
                A YouTuber with <span className="text-primary font-semibold">1M subscribers</span> getting{' '}
                <span className="text-primary font-semibold">20M views</span>
              </p>
              <p className="text-sm text-text-body">
                While impressive, this aligns with expected performance based on subscriber base.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-viral rounded-card p-8 border-0"
            >
              <div className="inline-block bg-black/30 px-4 py-2 rounded-button mb-4">
                <span className="font-semibold">🔥 Viral Breakthrough</span>
              </div>
              <p className="text-lg mb-4">
                A YouTuber with <span className="font-semibold">10K subscribers</span> getting{' '}
                <span className="font-semibold">2M views</span>
              </p>
              <p className="text-sm opacity-90">
                This represents extraordinary viral reach, exceeding expected performance by 200x!
              </p>
            </motion.div>
          </div>

          <div className="mt-8 bg-zinc-900/50 rounded-card p-6 border border-zinc-800">
            <p className="text-text-body text-center">
              Our models classify videos as <span className="text-green-400 font-semibold">"Viral Success"</span> or{' '}
              <span className="text-text-body font-semibold">"Expected Performance"</span> based on the ratio of actual 
              views to expected views given the channel's subscriber count and historical performance.
            </p>
          </div>
        </section>

        {/* Key Virality Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Virality Metrics</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viralityMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card-gradient rounded-card p-6 border border-zinc-800 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-viral rounded-lg">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    metric.importance === 'Critical' ? 'bg-red-500/20 text-red-400' :
                    metric.importance === 'High' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {metric.importance}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{metric.title}</h3>
                <p className="text-text-body text-sm">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Research Methodology */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Research Methodology</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                className="bg-card-gradient rounded-card p-6 border border-zinc-800"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-viral rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <p className="text-text-body flex-1 pt-1">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-viral rounded-card p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Technologies Utilized</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: Database, label: 'YouTube API v3' },
                { icon: Brain, label: 'Machine Learning' },
                { icon: Zap, label: 'Real-time Processing' },
                { icon: BarChart3, label: 'Advanced Analytics' },
              ].map((tech) => (
                <div key={tech.label} className="bg-black/30 rounded-card p-6">
                  <tech.icon className="w-10 h-10 mx-auto mb-3" />
                  <p className="font-semibold">{tech.label}</p>
                </div>
              ))}
            </div>

            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Combining Python 3.9+, pandas for data processing, and advanced ML algorithms 
              to analyze <span className="font-bold">
                {dataPoints != null
                  ? (dataPoints >= 1000
                      ? `${(Math.round((dataPoints / 1000) * 10) / 10).toString().replace(/\.0$/, '')}K+`
                      : `${dataPoints}+`)
                  : '—'} video statistics</span> across{' '}
              <span className="font-bold">{countries != null ? countries : 'multiple'} countries</span>
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                to="/data-process"
                className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-button font-semibold hover:shadow-glow transition-all"
              >
                <span>View Data Pipeline</span>
                <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

