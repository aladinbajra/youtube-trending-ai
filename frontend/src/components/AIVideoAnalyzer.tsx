import { Brain, Search, Loader2, Sparkles, ThumbsUp, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Video } from '../types';

interface AIVideoAnalyzerProps {
  videos: Video[];
}

export const AIVideoAnalyzer = ({ videos }: AIVideoAnalyzerProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = videos.filter(v =>
    v.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const analyzeVideo = async (video: Video) => {
    setSelectedVideo(video);
    setLoading(true);
    setAnalysis('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/ai/analyze-video?video_id=${video.videoId}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis('Analysis unavailable');
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      setAnalysis('Failed to analyze video');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-card-gradient rounded-card border border-zinc-800 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
          <Brain className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <span>AI Video Analyzer</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </h3>
          <p className="text-sm text-text-body">Get AI-powered analysis for any video</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Search from trending videos
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-body" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search from 100 trending videos by title or channel..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-button text-text-heading focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <p className="mt-2 text-xs text-text-body opacity-70">
          💡 Tip: Browse the Analytics page to see all available videos, then copy their titles here
        </p>
      </div>

      {/* Video List */}
      {searchQuery && filteredVideos.length > 0 && (
        <div className="mb-6 space-y-2 max-h-64 overflow-y-auto">
          {filteredVideos.map((video) => (
            <button
              key={video.videoId}
              onClick={() => analyzeVideo(video)}
              className="w-full text-left bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{video.title}</p>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-text-body">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(video.views)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{formatNumber(video.likes)}</span>
                    </span>
                    {video.viralityScore && (
                      <span className="text-purple-400">
                        {video.viralityScore.toFixed(0)}% viral
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    Analyze
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Analysis Result */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-blue-400">AI Analysis Results</h4>
              <span className="text-xs text-blue-400/60">Powered by GPT-4o-mini</span>
            </div>

            <div className="bg-zinc-900/50 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-2 text-sm">{selectedVideo.title}</p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-text-body">Views</div>
                  <div className="font-bold text-cyan-400">{formatNumber(selectedVideo.views)}</div>
                </div>
                <div>
                  <div className="text-text-body">Likes</div>
                  <div className="font-bold text-green-400">{formatNumber(selectedVideo.likes)}</div>
                </div>
                <div>
                  <div className="text-text-body">Virality</div>
                  <div className="font-bold text-purple-400">
                    {selectedVideo.viralityScore?.toFixed(1) || 'N/A'}%
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin mr-2" />
                <span className="text-text-body">AI is analyzing...</span>
              </div>
            ) : analysis ? (
              <div className="bg-zinc-900/30 rounded-lg p-4">
                <p className="text-sm text-text-body leading-relaxed">{analysis}</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!searchQuery && !selectedVideo && (
        <div className="text-center py-12 text-text-body">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2 font-semibold">Ready to analyze any trending video?</p>
          <p className="text-sm opacity-60 max-w-md mx-auto mb-3">
            Search from our collection of 100 top trending videos. You can find video titles on the Analytics page, then paste them here for detailed AI analysis.
          </p>
        </div>
      )}
    </div>
  );
};

