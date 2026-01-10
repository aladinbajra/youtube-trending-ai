import { Brain, Sparkles, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AIInsightsPanelProps {
  className?: string;
}

export const AIInsightsPanel = ({ className = '' }: AIInsightsPanelProps) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [totalVideos, setTotalVideos] = useState<number | null>(null);

  useEffect(() => {
    loadStats();
    loadInsights();
  }, []);

  const loadStats = async () => {
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
      }
    } catch {
      // silent
    }
  };

  const loadInsights = async () => {
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/ai/insights`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights);
      } else {
        setError('AI insights unavailable');
      }
    } catch (err) {
      setError('Failed to load AI insights');
      console.error('AI insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseInsights = (text: string) => {
    // Split by numbered points or bullet points
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, idx) => ({
      id: idx,
      text: line.replace(/^\d+\.?\s*/, '').replace(/^[•-]\s*/, '').trim()
    }));
  };

  const videosText = totalVideos != null
    ? (totalVideos >= 1000 ? `${(Math.round((totalVideos / 1000) * 10) / 10).toString().replace(/\.0$/, '')}K+` : `${totalVideos}+`)
    : '—';

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-card p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3 py-8">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-text-body">AI is analyzing {videosText} videos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-yellow-500/10 border border-yellow-500/30 rounded-card p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <span className="text-yellow-400">{error}</span>
        </div>
      </div>
    );
  }

  const insightItems = parseInsights(insights);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-card p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center space-x-2">
              <span>AI Insights</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h3>
            <p className="text-xs text-text-body">Powered by GPT-4o-mini</p>
          </div>
        </div>
        
        <button
          onClick={loadInsights}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1"
        >
          <TrendingUp size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insightItems.slice(0, 5).map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 bg-zinc-900/30 rounded-lg p-3 hover:bg-zinc-900/50 transition-colors"
          >
            <div className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">
              {index + 1}
            </div>
            <p className="text-sm text-text-body leading-relaxed">
              {insight.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-purple-500/20 text-xs text-text-body text-center">
        <span className="opacity-60">AI-generated insights update every refresh</span>
      </div>
    </motion.div>
  );
};

