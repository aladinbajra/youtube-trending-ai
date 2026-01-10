import { Eye, ThumbsUp, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

export const VideoCard = ({ video, onClick }: VideoCardProps) => {
  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-card-gradient rounded-card overflow-hidden border border-zinc-800 cursor-pointer card-hover"
      data-testid="video-card"
      data-videoid={video.videoId}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-zinc-900">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect fill="%23222" width="320" height="180"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-12 h-12 text-zinc-700" />
          </div>
        )}
        
        {video.viralityScore && (
          <div className="absolute top-2 right-2 bg-youtube px-2 py-1 rounded text-white text-xs font-bold">
            {video.viralityScore.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-text-heading mb-2 line-clamp-2 min-h-[3rem]">
          {video.title}
        </h3>
        
        {video.channelTitle && (
          <p className="text-text-body text-sm mb-3">{video.channelTitle}</p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-text-body">
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{formatNumber(video.views)}</span>
          </div>
          
          {video.likes && (
            <div className="flex items-center space-x-1">
              <ThumbsUp size={14} />
              <span>{formatNumber(video.likes)}</span>
            </div>
          )}
          
          {video.comments && (
            <div className="flex items-center space-x-1">
              <MessageSquare size={14} />
              <span>{formatNumber(video.comments)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

