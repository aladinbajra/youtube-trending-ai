import type { Video, VideoHistory } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/data';
const USE_SAMPLE_DATA = !import.meta.env.VITE_API_URL;

console.log('[API Service] VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('[API Service] API_URL:', API_URL);
console.log('[API Service] USE_SAMPLE_DATA:', USE_SAMPLE_DATA);

type VideoQueryOptions = {
  limit?: number;
  offset?: number;
  category?: string;
};

type CategoryFilterConfig = {
  categoryIds: Set<string>;
  includePatterns: RegExp[];
  excludePatterns: RegExp[];
};

type VideoWithExtras = Video & {
  categoryId?: string | number | null;
  category_id?: string | number | null;
  tags?: string[] | string | null;
  description?: string | null;
};

type CategoryDefinition = {
  categoryIds: string[];
  include: string[];
  exclude?: string[];
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const makePatterns = (keywords: string[]): RegExp[] =>
  keywords
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .map((word) => new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i'));

const CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  music: {
    categoryIds: ['10'],
    include: ['music', 'song', 'single', 'album', 'artist', 'lyrics', 'official video', 'remix', 'mv'],
  },
  gaming: {
    categoryIds: ['20'],
    include: [
      'gaming',
      'gameplay',
      'playthrough',
      'walkthrough',
      "let's play",
      'speedrun',
      'roblox',
      'minecraft',
      'valorant',
      'fortnite',
      'gta',
      'call of duty',
      'csgo',
      'pubg',
    ],
    exclude: ['match', 'league', 'cup', 'goal', 'highlights', 'tournament'],
  },
  sports: {
    categoryIds: ['17'],
    include: [
      'sport',
      'match',
      'league',
      'goal',
      'highlights',
      'tournament',
      'nba',
      'nfl',
      'fifa',
      'world cup',
      'uefa',
      'mlb',
      'cricket',
      'soccer',
      'game highlights',
    ],
    exclude: ['gaming', 'gameplay', 'minecraft', 'roblox', 'fortnite'],
  },
  news: {
    categoryIds: ['25'],
    include: ['news', 'breaking news', 'headline', 'press conference', 'update', 'report', 'journal', 'newscast', 'bulletin'],
  },
  tech: {
    categoryIds: ['28'],
    include: [
      'tech',
      'technology',
      'gadget',
      'smartphone',
      'iphone',
      'android',
      'review',
      'unboxing',
      'pc build',
      'software',
      'hardware',
      'ai',
      'robot',
      'electronics',
      'laptop',
    ],
  },
  food: {
    categoryIds: ['26'],
    include: [
      'recipe',
      'kitchen',
      'cook',
      'cooking',
      'food',
      'chef',
      'baking',
      'dessert',
      'meal',
      'restaurant',
      'cuisine',
      'eat',
      'tasting',
    ],
  },
  lifestyle: {
    categoryIds: ['22', '26'],
    include: [
      'lifestyle',
      'daily vlog',
      'vlog',
      'routine',
      'morning routine',
      'night routine',
      'beauty',
      'fashion',
      'makeup',
      'self care',
      'travel vlog',
      'home decor',
    ],
  },
  education: {
    categoryIds: ['27'],
    include: [
      'education',
      'lesson',
      'tutorial',
      'learn',
      'explained',
      'lecture',
      'course',
      'class',
      'study',
      'school',
      'how to',
      'teacher',
      'science lesson',
    ],
  },
  comedy: {
    categoryIds: ['23'],
    include: ['comedy', 'funny', 'sketch', 'prank', 'stand-up', 'parody', 'humor', 'laugh', 'comedian', 'joke'],
  },
  culture: {
    categoryIds: ['24', '29'],
    include: [
      'culture',
      'entertainment',
      'festival',
      'art',
      'heritage',
      'tradition',
      'documentary',
      'music video',
      'dance',
      'museum',
      'theatre',
      'history',
    ],
  },
};

const CATEGORY_FILTERS: Record<string, CategoryFilterConfig> = Object.fromEntries(
  Object.entries(CATEGORY_DEFINITIONS).map(([key, definition]) => [
    key,
    {
      categoryIds: new Set(definition.categoryIds),
      includePatterns: makePatterns(definition.include),
      excludePatterns: makePatterns(definition.exclude ?? []),
    },
  ]),
);

class ApiService {
  private baseUrl: string;
  private useSampleData: boolean;

  constructor() {
    this.baseUrl = API_URL;
    this.useSampleData = USE_SAMPLE_DATA;
    console.log('[API Service] Initialized with baseUrl:', this.baseUrl);
    console.log('[API Service] Using sample data:', this.useSampleData);
  }

  async getVideos(options: VideoQueryOptions = {}): Promise<Video[]> {
    const {
      limit = 100,
      offset = 0,
      category = 'all',
    } = options;

    try {
      if (this.useSampleData) {
        console.log('[API] Loading SAMPLE data from /data/videos.json');
        const response = await fetch('/data/videos.json');
        if (!response.ok) {
          throw new Error('Failed to load sample data');
        }
        const data: Video[] = await response.json();
        console.log('[API] Loaded', data.length, 'videos from SAMPLE data');
        const filtered = this.filterVideosByCategory(data, category);
        return filtered.slice(offset, offset + limit);
      }

      const timestamp = Date.now();
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        _t: String(timestamp),
      });
      if (category && category !== 'all') {
        params.append('category', category);
      }

      const url = `${this.baseUrl}/api/videos?${params.toString()}`;
      console.log('[API] Fetching REAL data from backend:', url);
      const response = await fetch(url, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data: Video[] = await response.json();
      console.log('[API] Loaded', data.length, 'videos from BACKEND');
      console.log('[API] Total Views in dataset:', data.reduce((sum: number, v: Video) => sum + (v.views || 0), 0));
      return data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      try {
        const response = await fetch('/data/videos.json');
        const data: Video[] = await response.json();
        const filtered = this.filterVideosByCategory(data, category);
        return filtered.slice(offset, offset + limit);
      } catch (fallbackError) {
        console.error('Error loading fallback data:', fallbackError);
        return [];
      }
    }
  }

  async getVideoHistory(videoId: string): Promise<VideoHistory> {
    try {
      if (this.useSampleData) {
        return this.generateSampleHistory();
      }

      const timestamp = Date.now();
      const response = await fetch(`${this.baseUrl}/api/videos/${videoId}/history?_t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching video history:', error);
      return this.generateSampleHistory();
    }
  }

  private filterVideosByCategory(videos: Video[], category: string): Video[] {
    const normalized = (category || 'all').toLowerCase();
    if (normalized === 'all' || !CATEGORY_FILTERS[normalized]) {
      return videos;
    }

    const config = CATEGORY_FILTERS[normalized];

    return videos.filter((video) => {
      const videoData = video as VideoWithExtras;
      const rawCategoryId = videoData.categoryId ?? videoData.category_id;
      const categoryId = rawCategoryId !== undefined && rawCategoryId !== null ? String(rawCategoryId).trim() : '';
      if (categoryId && config.categoryIds.has(categoryId)) {
        return true;
      }

      const textParts: string[] = [
        video.title ?? '',
        (videoData.description ?? '') ?? '',
      ];

      const tags = videoData.tags;
      if (Array.isArray(tags)) {
        textParts.push(...tags.map((tag) => String(tag)));
      } else if (typeof tags === 'string') {
        textParts.push(tags);
      } else if (tags != null) {
        textParts.push(String(tags));
      }

      const textBlob = textParts.join(' ');
      if (!textBlob.trim()) {
        return false;
      }

      if (config.excludePatterns.some((pattern) => pattern.test(textBlob))) {
        return false;
      }

      return config.includePatterns.some((pattern) => pattern.test(textBlob));
    });
  }

  private generateSampleHistory(): VideoHistory {
    const days = 30;
    const timestamps: string[] = [];
    const views: number[] = [];
    const baseViews = Math.floor(Math.random() * 1000000);
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      timestamps.push(date.toISOString().split('T')[0]);
      views.push(Math.floor(baseViews + (baseViews * 0.1 * i) + Math.random() * 50000));
    }

    return { timestamps, views };
  }

  isUsingSampleData(): boolean {
    return this.useSampleData;
  }

  getApiUrl(): string {
    return this.baseUrl;
  }
}

export const apiService = new ApiService();

