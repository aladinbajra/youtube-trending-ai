import { X, Eye, ThumbsUp, MessageSquare, Calendar, TrendingUp, Brain, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Video, VideoHistory } from '../types';
import { apiService } from '../services/api';
import { getCountryName } from '../utils/countryMap';

interface VideoDetailModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoDetailModal = ({ video, isOpen, onClose }: VideoDetailModalProps) => {
  const [history, setHistory] = useState<VideoHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getVideoHistory(video.videoId);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [video.videoId]);

  useEffect(() => {
    if (isOpen && video.videoId) {
      void loadHistory();
    }
  }, [isOpen, video.videoId, loadHistory]);

  const loadAIExplanation = async () => {
    setAiLoading(true);
    setShowAI(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/ai/explain-score?video_id=${video.videoId}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation('AI explanation unavailable');
      }
    } catch (error) {
      console.error('AI explanation error:', error);
      setAiExplanation('Failed to load AI explanation');
    } finally {
      setAiLoading(false);
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const chartData = history?.timestamps.map((timestamp, index) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: history.views[index],
  })) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            data-testid="modal-backdrop"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative bg-card-gradient rounded-card border border-zinc-800 w-full max-w-4xl shadow-card"
                onClick={(e) => e.stopPropagation()}
                data-testid="video-modal"
                data-videoid={video.videoId}
              >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-zinc-800">
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-bold text-text-heading mb-2">
                      {video.title}
                    </h2>
                    {video.channelTitle && (
                      <p className="text-text-body">{video.channelTitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-zinc-900/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-text-body text-sm mb-1">
                        <Eye size={16} />
                        <span>Views</span>
                      </div>
                      <p className="text-2xl font-bold">{formatNumber(video.views)}</p>
                    </div>

                    <div className="bg-zinc-900/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-text-body text-sm mb-1">
                        <ThumbsUp size={16} />
                        <span>Likes</span>
                      </div>
                      <p className="text-2xl font-bold">{formatNumber(video.likes)}</p>
                    </div>

                    <div className="bg-zinc-900/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-text-body text-sm mb-1">
                        <MessageSquare size={16} />
                        <span>Comments</span>
                      </div>
                      <p className="text-2xl font-bold">{formatNumber(video.comments)}</p>
                    </div>

                    <div className="bg-zinc-900/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2 text-text-body text-sm">
                          <TrendingUp size={16} />
                          <span>Virality</span>
                        </div>
                        <button
                          onClick={loadAIExplanation}
                          disabled={aiLoading}
                          className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-2 py-1 rounded flex items-center space-x-1 transition-colors disabled:opacity-50"
                          title="AI Explain"
                        >
                          <Brain size={12} />
                          <span>AI</span>
                        </button>
                      </div>
                      <p className="text-2xl font-bold">
                        {video.viralityScore ? `${video.viralityScore.toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  {showAI && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <h4 className="font-bold text-purple-400">AI Explanation</h4>
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                      </div>
                      {aiLoading ? (
                        <div className="flex items-center space-x-2 text-text-body">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                          <span className="text-sm">AI is analyzing...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-text-body leading-relaxed">{aiExplanation}</p>
                      )}
                      <div className="mt-2 text-xs text-purple-400/60">Powered by GPT-4o-mini</div>
                    </motion.div>
                  )}

                  {/* Additional Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {video.publishedAt && (
                      <div className="flex items-center space-x-2 text-text-body">
                        <Calendar size={16} />
                        <span>Published: {formatDate(video.publishedAt)}</span>
                      </div>
                    )}
                    {video.country && (
                      <div className="text-text-body">
                        <span>Country: {getCountryName(video.country)}</span>
                      </div>
                    )}
                  </div>

                  {/* View History Chart */}
                  <div className="bg-zinc-900/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Views Over Time</h3>
                    
                    {loading && (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    )}

                    {!loading && chartData.length > 0 && (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#888"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke="#888"
                            style={{ fontSize: '12px' }}
                            tickFormatter={(value) => formatNumber(value)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1C1C1C',
                              border: '1px solid #333',
                              borderRadius: '8px',
                            }}
                            formatter={(value: number) => [formatNumber(value), 'Views']}
                          />
                          <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#FF0000"
                            strokeWidth={2}
                            dot={{ fill: '#FF0000', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                    {!loading && chartData.length === 0 && (
                      <div className="text-center text-text-body py-12">
                        No historical data available for this video
                      </div>
                    )}

                    {history && chartData.length > 0 && (


<div className="mt-4 text-sm text-text-body text-right">
                        <span>
                          Range: {history.timestamps[0]} - {history.timestamps[history.timestamps.length - 1]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-youtube rounded-button hover:shadow-glow transition-all font-semibold"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

