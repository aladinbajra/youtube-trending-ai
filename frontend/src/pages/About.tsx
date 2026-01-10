import { TrendingUp, Target, Users, Globe, BarChart3, Brain, Zap, Award, Github, Database, Code, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const About = () => {
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

  const videosPretty =
    totalVideos != null
      ? (totalVideos >= 1000 ? `${(Math.round((totalVideos / 1000) * 10) / 10).toString().replace(/\\.0$/, '')}K+` : `${totalVideos}+`)
      : '—';

  const dataPointsPretty = dataPoints != null
    ? (dataPoints >= 1000 ? `${(Math.round((dataPoints / 1000) * 10) / 10).toString().replace(/\\.0$/, '')}K+` : `${dataPoints}+`)
    : '—';

  const stats = [
    { icon: BarChart3, title: 'Videos Analyzed', value: videosPretty, color: 'text-primary' },
    { icon: Globe, title: 'Countries Tracked', value: countries != null ? `${countries}` : '—', color: 'text-secondary' },
    { icon: Brain, title: 'AI Accuracy', value: '99.2%', color: 'text-accent' },
    { icon: Zap, title: 'Data Points', value: dataPointsPretty, color: 'text-yellow-400' },
  ];

  const techStack = [
    { icon: Code, name: 'React + TypeScript', description: 'Modern frontend framework for dynamic user interfaces' },
    { icon: Database, name: 'FastAPI + Python', description: 'High-performance backend API with async processing' },
    { icon: Brain, name: 'GPT-4o-mini AI', description: 'Advanced AI for virality prediction and insights' },
    { icon: Rocket, name: 'YouTube Data API v3', description: 'Real-time trending video data collection' },
    { icon: Award, name: 'Machine Learning', description: 'Predictive models for viral content analysis' },
    { icon: Github, name: 'Open Source', description: 'Built for research and educational purposes' },
  ];

  const features = [
    { icon: TrendingUp, title: 'Real-Time Analytics', description: `Track trending videos across ${countries != null ? countries : 'the latest'} countries with live updates and performance metrics.` },
    { icon: Brain, title: 'AI-Powered Insights', description: 'Advanced machine learning algorithms analyze patterns to predict video virality with high accuracy.' },
    { icon: Target, title: 'Virality Scoring', description: 'Proprietary scoring system rates videos based on engagement, growth velocity, and reach metrics.' },
    { icon: Users, title: 'Audience Intelligence', description: 'Understand viewer demographics, behavior patterns, and engagement across different regions.' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-youtube flex items-center justify-center shadow-glow mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">Tube Virality</span>
          </h1>
          <p className="text-xl text-text-body max-w-3xl mx-auto leading-relaxed">
            A cutting-edge research platform that leverages AI and machine learning to analyze 
            YouTube video performance and predict viral success patterns.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card-gradient rounded-card p-6 border border-zinc-800 hover:border-primary/50 transition-all text-center"
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold mb-2 gradient-text">{stat.value}</div>
                  <div className="text-sm text-text-body">{stat.title}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-viral rounded-card p-10 border-0 mission-highlight"
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg leading-relaxed mb-6">
              To democratize access to YouTube analytics and empower content creators with actionable 
              insights that help them understand what makes content go viral. By combining real-time 
              data collection, advanced machine learning, and comprehensive analytics, we provide 
              creators with the tools they need to optimize their content strategy.
            </p>
            <p className="text-lg leading-relaxed">
              This platform serves as a research tool for analyzing viral content patterns across 
              different countries and cultures, contributing to the broader understanding of digital 
              media trends and engagement dynamics.
            </p>
          </motion.div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">
            What Makes Us <span className="gradient-text">Unique</span>
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
                  className="bg-card-gradient rounded-card p-8 border border-zinc-800 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-youtube/10 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-text-body">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Powered By <span className="gradient-text">Modern Technology</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card-gradient rounded-card p-6 border border-zinc-800 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-zinc-800/50 rounded-lg group-hover:bg-youtube group-hover:shadow-glow transition-all light-icon-wrapper">
                      <Icon className="w-6 h-6 text-text-body light-icon group-hover:text-white transition-colors" />
                    </div>
                    <div className="font-semibold text-text-heading">{tech.name}</div>
                  </div>
                  <p className="text-sm text-text-body">{tech.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card-gradient rounded-card p-10 border border-zinc-800 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-text-body text-lg mb-8 max-w-2xl mx-auto">
              Start analyzing trending videos and discover what makes content go viral with our 
              advanced analytics platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analytics"
                className="inline-flex items-center justify-center px-8 py-4 bg-youtube rounded-button font-semibold hover:shadow-glow transition-all text-white"
              >
                View Dashboard
              </Link>
              <Link
                to="/ai-tools"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary rounded-button font-semibold hover:bg-primary/10 transition-all"
              >
                Try AI Tools
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

