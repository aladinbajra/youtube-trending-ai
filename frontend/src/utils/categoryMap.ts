// YouTube Category ID to Name Mapping
export const YOUTUBE_CATEGORIES: Record<number, string> = {
  1: 'Film & Animation',
  2: 'Autos & Vehicles',
  10: 'Music',
  15: 'Pets & Animals',
  17: 'Sports',
  18: 'Short Movies',
  19: 'Travel & Events',
  20: 'Gaming',
  21: 'Videoblogging',
  22: 'People & Blogs',
  23: 'Comedy',
  24: 'Entertainment',
  25: 'News & Politics',
  26: 'Howto & Style',
  27: 'Education',
  28: 'Science & Technology',
  29: 'Nonprofits & Activism',
  30: 'Movies',
  31: 'Anime/Animation',
  32: 'Action/Adventure',
  33: 'Classics',
  34: 'Comedy (Movies)',
  35: 'Documentary',
  36: 'Drama',
  37: 'Family',
  38: 'Foreign',
  39: 'Horror',
  40: 'Sci-Fi/Fantasy',
  41: 'Thriller',
  42: 'Shorts',
  43: 'Shows',
  44: 'Trailers',
};

// Category colors for badges
export const CATEGORY_COLORS: Record<number, string> = {
  10: 'bg-purple-500/20 text-purple-400 border-purple-500/30', // Music
  20: 'bg-green-500/20 text-green-400 border-green-500/30',     // Gaming
  24: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', // Entertainment
  22: 'bg-blue-500/20 text-blue-400 border-blue-500/30',       // People & Blogs
  17: 'bg-orange-500/20 text-orange-400 border-orange-500/30', // Sports
  25: 'bg-red-500/20 text-red-400 border-red-500/30',          // News & Politics
  27: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', // Education
  28: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',       // Science & Technology
};

export const getCategoryName = (categoryId?: number): string => {
  if (!categoryId) return 'Unknown';
  return YOUTUBE_CATEGORIES[categoryId] || `Category ${categoryId}`;
};

export const getCategoryColor = (categoryId?: number): string => {
  if (!categoryId) return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
  return CATEGORY_COLORS[categoryId] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
};

