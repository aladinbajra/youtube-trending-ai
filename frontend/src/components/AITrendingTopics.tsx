import { TrendingUp, Loader2, Sparkles, RefreshCw, Music, Gamepad2, Radio, Users, Zap, Film, Mic, Video, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Topic {
  name: string;
  percentage: number;
  reason: string;
}

export const AITrendingTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/ai/trending-topics?limit=100`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.topics) {
        setTopics(data.topics);
      } else {
        setError('No topics detected');
      }
    } catch (err) {
      console.error('Trending topics error:', err);
      setError('Failed to load trending topics');
    } finally {
      setLoading(false);
    }
  };

  const getTopicColor = (index: number) => {
    const colors = [
      'from-red-500/20 to-orange-500/20 border-red-500/30',
      'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
      'from-green-500/20 to-emerald-500/20 border-green-500/30',
      'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    ];
    return colors[index % colors.length];
  };

  const getTopicIcon = (index: number, topicName: string) => {
    const name = topicName.toLowerCase();
    
    // Map topic names to appropriate icons
    if (name.includes('music') || name.includes('song') || name.includes('remix')) {
      return <Music className="w-6 h-6 text-red-400" />;
    }
    if (name.includes('gaming') || name.includes('game') || name.includes('roblox')) {
      return <Gamepad2 className="w-6 h-6 text-purple-400" />;
    }
    if (name.includes('remix') || name.includes('remixes')) {
      return <Radio className="w-6 h-6 text-pink-400" />;
    }
    if (name.includes('challenge') || name.includes('challenges')) {
      return <Zap className="w-6 h-6 text-yellow-400" />;
    }
    if (name.includes('anime') || name.includes('animation')) {
      return <Film className="w-6 h-6 text-blue-400" />;
    }
    if (name.includes('karaoke')) {
      return <Mic className="w-6 h-6 text-green-400" />;
    }
    if (name.includes('live') || name.includes('performance')) {
      return <Video className="w-6 h-6 text-orange-400" />;
    }
    if (name.includes('roblox')) {
      return <Gamepad2 className="w-6 h-6 text-cyan-400" />;
    }
    
    // Default icons based on index
    const defaultIcons = [
      <TrendingUp className="w-6 h-6 text-red-400" />,
      <Zap className="w-6 h-6 text-purple-400" />,
      <Sparkles className="w-6 h-6 text-yellow-400" />,
      <BarChart3 className="w-6 h-6 text-blue-400" />,
    ];
    return defaultIcons[index % defaultIcons.length];
  };

  return (
    <div className="bg-card-gradient rounded-card border border-zinc-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <span>Trending Topics Detector</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </h3>
            <p className="text-sm text-text-body">AI identifies emerging topics from 100 newest videos</p>
          </div>
        </div>

        <button
          onClick={loadTopics}
          disabled={loading}
          className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-button transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin mr-3" />
          <span className="text-text-body">AI is analyzing trending topics...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Topics Grid */}
      {!loading && !error && topics.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {topics.slice(0, 8).map((topic, index) => (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br ${getTopicColor(index)} border rounded-lg p-4 hover:scale-105 transition-transform`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getTopicIcon(index, topic.name)}
                  </div>
                  <h4 className="font-bold text-lg">{topic.name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{topic.percentage}%</div>
                  <div className="text-xs text-text-body">of videos</div>
                </div>
              </div>
              <p className="text-xs text-text-body leading-relaxed">{topic.reason}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && topics.length === 0 && (
        <div className="text-center py-12 text-text-body">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2">No topics detected yet</p>
          <p className="text-sm opacity-60">Click "Refresh" to analyze current trending topics</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-800 text-xs text-text-body text-center">
        <span className="opacity-60">AI analyzes video titles to identify trending themes and patterns</span>
      </div>
    </div>
  );
};

