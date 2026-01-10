import { Database, Zap, Globe, Brain, CheckCircle, ArrowRight, TrendingUp, BarChart3, Sparkles, Clock, Shield, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const DataProcess = () => {
  const [totalVideos, setTotalVideos] = useState<number | null>(null);
  const [countries, setCountries] = useState<number | null>(null);
  const [dataPoints, setDataPoints] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Data Pipeline - Tube Virality';
    const fetchStats = async () => {
      try {
        const ts = Date.now();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const res = await fetch(`${apiUrl}/api/stats?_t=${ts}`, {
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const s = await res.json();
          setTotalVideos(s.total_videos ?? null);
          setCountries(s.countries ?? null);
          setDataPoints(s.data_points ?? null);
        }
      } catch {
        // silent
      }
    };
    fetchStats();
  }, []);

  const videosPretty = totalVideos != null
    ? (totalVideos >= 1_000 ? `${(Math.round((totalVideos / 1_000) * 10) / 10).toString().replace(/\.0$/, '')}K` : String(totalVideos))
    : '—';

  const metrics = [
    { icon: Database, value: videosPretty, label: 'Videos Tracked', color: 'text-blue-400' },
    { icon: Globe, value: countries != null ? String(countries) : '—', label: 'Global Markets', color: 'text-purple-400' },
    { icon: Zap, value: '<50ms', label: 'API Response', color: 'text-green-400' },
    { icon: Brain, value: '99.2%', label: 'AI Accuracy', color: 'text-yellow-400' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Automated daily collection and processing ensures fresh data every 24 hours with minimal latency.',
      highlight: 'Updated Daily'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: `Track ${totalVideos != null ? totalVideos.toLocaleString() : '—'} trending videos across ${countries != null ? countries : '—'} countries simultaneously for comprehensive market insights.`,
      highlight: countries != null ? `${countries} Countries` : 'Multiple Countries'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'GPT-4o-mini generates insights, scores virality, and identifies trends automatically.',
      highlight: 'GPT-4o-mini'
    },
    {
      icon: Shield,
      title: 'Reliable & Scalable',
      description: 'Built on FastAPI and optimized data structures for fast queries and seamless scaling.',
      highlight: dataPoints != null
        ? (dataPoints >= 1000
            ? `${(Math.round((dataPoints / 1000) * 10) / 10).toString().replace(/\.0$/, '')}K+ Data Points`
            : `${dataPoints}+ Data Points`)
        : '— Data Points'
    },
  ];

  const pipeline = [
    {
      step: '01',
      title: 'Data Collection',
      description: `Automated YouTube API integration captures trending videos from ${countries != null ? countries : 'multiple'} countries.`,
      items: [
        `${countries != null ? countries : 'multiple'} country feeds`,
        `${totalVideos != null ? totalVideos.toLocaleString() : '—'} videos tracked`,
        'Video metadata extraction',
        'Engagement metrics'
      ],
      icon: Database,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      step: '02',
      title: 'Processing & Enrichment',
      description: 'Advanced algorithms process and enrich raw data with virality scores and insights.',
      items: ['Virality scoring engine', 'Growth velocity calculation', 'Engagement rate analysis', 'Trending duration tracking'],
      icon: Layers,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      step: '03',
      title: 'AI Analysis',
      description: 'GPT-4o-mini analyzes patterns, generates insights, and optimizes content recommendations.',
      items: ['Deep content analysis', 'Trend prediction', 'Title optimization', 'Audience insights'],
      icon: Brain,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      step: '04',
      title: 'API Delivery',
      description: 'High-performance REST API serves processed data to dashboards and applications instantly.',
      items: ['Sub-50ms response time', '5 optimized endpoints', 'Real-time data access', 'Scalable architecture'],
      icon: Zap,
      gradient: 'from-yellow-500 to-orange-500'
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-zinc-900 px-4 py-2 rounded-full mb-6 border border-zinc-800">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Automated Data Pipeline</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Enterprise-Grade <br />
            <span className="gradient-text">Data Infrastructure</span>
          </h1>

          <p className="text-xl text-text-body max-w-3xl mx-auto mb-8">
            Automated collection, AI-powered analysis, and real-time delivery of YouTube trending data 
            from {countries != null ? countries : 'multiple'} countries. Built for scale, speed, and reliability. Currently tracking {totalVideos != null ? totalVideos.toLocaleString() : 'thousands of'} unique videos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/analytics"
              className="inline-flex items-center justify-center px-8 py-4 bg-youtube rounded-button font-semibold hover:shadow-glow transition-all text-white"
            >
              View Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/insights"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-700 rounded-button font-semibold hover:border-primary transition-all"
            >
              Explore Data
              <BarChart3 className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-card-gradient rounded-xl p-6 border border-zinc-800 text-center hover:border-primary/50 transition-all"
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
                  <div className="text-3xl font-bold mb-2 gradient-text">{metric.value}</div>
                  <div className="text-sm text-text-body">{metric.label}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why Choose Our <span className="gradient-text">Platform</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card-gradient rounded-xl p-8 border border-zinc-800 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-xl bg-youtube/20 flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-all">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-text-heading">{feature.title}</h3>
                        <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
                          {feature.highlight}
                        </span>
                      </div>
                      <p className="text-text-body">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How It Works - Pipeline */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-text-body text-center mb-12 max-w-2xl mx-auto">
            Our automated 4-stage pipeline ensures you always have access to the freshest trending data
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {pipeline.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="bg-card-gradient rounded-xl p-8 border border-zinc-800 hover:border-primary/50 transition-all relative overflow-hidden group"
                >
                  {/* Gradient accent */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${stage.gradient}`} />
                  
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stage.gradient} flex items-center justify-center flex-shrink-0 relative group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-sm font-bold border-2 border-zinc-800">
                        {stage.step}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 text-text-heading">{stage.title}</h3>
                      <p className="text-text-body mb-4">{stage.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {stage.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-text-body">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-viral rounded-xl p-10 text-center performance-highlight"
          >
            <h2 className="text-3xl font-bold mb-4">Built for Performance</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Our infrastructure is optimized for speed, reliability, and scale
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 performance-stats">
              <div className="performance-stat bg-black/20 rounded-lg p-6 backdrop-blur-sm">
                <Clock className="w-10 h-10 mx-auto mb-3 text-white" />
                <div className="text-4xl font-bold mb-2">Daily</div>
                <div className="text-sm opacity-90">Automated Updates</div>
              </div>
              
              <div className="performance-stat bg-black/20 rounded-lg p-6 backdrop-blur-sm">
                <Zap className="w-10 h-10 mx-auto mb-3 text-white" />
                <div className="text-4xl font-bold mb-2">&lt;50ms</div>
                <div className="text-sm opacity-90">API Response Time</div>
              </div>
              
              <div className="performance-stat bg-black/20 rounded-lg p-6 backdrop-blur-sm">
                <Shield className="w-10 h-10 mx-auto mb-3 text-white" />
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-90">Data Availability</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card-gradient rounded-xl p-10 border border-zinc-800 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Access Real-Time Data?</h2>
            <p className="text-text-body text-lg mb-8 max-w-2xl mx-auto">
              Start exploring trending videos, virality insights, and AI-powered analytics today
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analytics"
                className="inline-flex items-center justify-center px-8 py-4 bg-youtube rounded-button font-semibold hover:shadow-glow transition-all text-white"
              >
                View Analytics
                <TrendingUp className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary rounded-button font-semibold hover:bg-primary/10 transition-all"
              >
                Explore Insights
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
