import { Eye, ThumbsUp, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Video } from '../types';
import { getCountryName } from '../utils/countryMap';

interface VideoListItemProps {
  video: Video;
  onClick?: () => void;
}

export const VideoListItem = ({ video, onClick }: VideoListItemProps) => {
  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="flex items-center gap-4 bg-card-gradient rounded-card p-4 border border-zinc-800 cursor-pointer hover:border-primary/50 transition-all"
      data-testid="video-list-item"
      data-videoid={video.videoId}
    >
      {/* Thumbnail */}
      <div className="relative w-32 h-20 flex-shrink-0 bg-zinc-900 rounded overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="80"%3E%3Crect fill="%23222" width="128" height="80"/%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-zinc-700" />
          </div>
        )}
        
        {video.viralityScore && (
          <div className="absolute top-1 right-1 bg-youtube px-2 py-0.5 rounded text-white text-xs font-bold">
            {video.viralityScore.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-text-heading mb-1 line-clamp-2">
          {video.title}
        </h3>
        
        {video.channelTitle && (
          <p className="text-text-body text-sm mb-2">{video.channelTitle}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-body">
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

          {video.publishedAt && (
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDate(video.publishedAt)}</span>
            </div>
          )}

          {video.country && (
            <div className="text-xs bg-zinc-800 px-2 py-0.5 rounded">
              {getCountryName(video.country)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

