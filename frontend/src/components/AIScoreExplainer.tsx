import { Lightbulb, Search, Loader2, Sparkles, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Video } from '../types';

interface AIScoreExplainerProps {
  videos: Video[];
}

export const AIScoreExplainer = ({ videos }: AIScoreExplainerProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = videos.filter(v =>
    v.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const explainScore = async (video: Video) => {
    setSelectedVideo(video);
    setLoading(true);
    setExplanation('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/ai/explain-score?video_id=${video.videoId}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        setExplanation(data.explanation);
      } else {
        setExplanation('Explanation unavailable');
      }
    } catch (error) {
      console.error('AI explanation error:', error);
      setExplanation('Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-gradient rounded-card border border-zinc-800 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <span>AI Score Explainer</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </h3>
          <p className="text-sm text-text-body">Understand why videos succeed or fail</p>
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
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-button text-text-heading focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
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
              onClick={() => explainScore(video)}
              className="w-full text-left bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{video.title}</p>
                  <div className="mt-1 text-xs text-text-body">
                    Virality Score: <span className="text-yellow-400 font-bold">
                      {video.viralityScore?.toFixed(1) || 'N/A'}%
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    Explain
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Explanation Result */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-yellow-400 flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Why This Score?</span>
              </h4>
              <span className="text-xs text-yellow-400/60">Powered by GPT-4o-mini</span>
            </div>

            <div className="bg-zinc-900/50 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-3 text-sm">{selectedVideo.title}</p>
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-zinc-800"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (selectedVideo.viralityScore || 0) / 100)}`}
                      className="text-yellow-400 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {selectedVideo.viralityScore?.toFixed(0) || 0}
                      </div>
                      <div className="text-xs text-text-body">/ 100</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-yellow-400 animate-spin mr-2" />
                <span className="text-text-body">AI is explaining...</span>
              </div>
            ) : explanation ? (
              <div className="bg-zinc-900/30 rounded-lg p-4">
                <p className="text-sm text-text-body leading-relaxed whitespace-pre-line">{explanation}</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!searchQuery && !selectedVideo && (
        <div className="text-center py-12 text-text-body">
          <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2 font-semibold">Understand what makes videos go viral</p>
          <p className="text-sm opacity-60 max-w-md mx-auto mb-3">
            Search from our collection of 100 top trending videos. Find video titles on the Analytics page, then paste them here to get an AI explanation of their virality scores.
          </p>
        </div>
      )}
    </div>
  );
};

