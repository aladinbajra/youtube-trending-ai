import type { Video, VideoHistory } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const USE_SAMPLE_DATA = import.meta.env.VITE_USE_SAMPLE_DATA === 'true';

type VideoQueryOptions = {
  limit?: number;
  offset?: number;
  category?: string;
  signal?: AbortSignal;
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

export class ApiService {
  constructor(private baseUrl = API_URL, private useSampleData = USE_SAMPLE_DATA) {}

  private async request<T>(path: string, signal?: AbortSignal): Promise<{ data: T; total: number | null }> {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 20_000);
    try {
      const response = await fetch(path, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`Data service returned ${response.status}. Please retry.`);
      const header = response.headers.get('X-Total-Count');
      return { data: await response.json() as T, total: header !== null && /^\d+$/.test(header) ? Number(header) : null };
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }

  async getVideos({ limit = 100, offset = 0, category = 'all', signal }: VideoQueryOptions = {}): Promise<Video[]> {
    if (this.useSampleData) {
      const { data } = await this.request<Video[]>('/data/videos.json', signal);
      if (!Array.isArray(data)) throw new Error('Invalid sample dataset.');
      return this.filterVideosByCategory(data, category).slice(offset, offset + limit);
    }
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset), category });
    const { data } = await this.request<Video[]>(`${this.baseUrl}/api/videos?${params}`, signal);
    if (!Array.isArray(data)) throw new Error('Invalid video response.');
    return data;
  }

  async getAllVideos(options: Omit<VideoQueryOptions, 'limit' | 'offset'> = {}): Promise<Video[]> {
    if (this.useSampleData) return this.getVideos({ ...options, limit: Number.MAX_SAFE_INTEGER });
    const videos = new Map<string, Video>();
    const pageSize = 1000;
    let offset = 0;
    let more = true;
    while (more) {
      const params = new URLSearchParams({ limit: String(pageSize), offset: String(offset), category: options.category || 'all' });
      const { data, total } = await this.request<Video[]>(`${this.baseUrl}/api/videos?${params}`, options.signal);
      if (!Array.isArray(data)) throw new Error('Invalid video response.');
      const previous = videos.size;
      for (const video of data) videos.set(video.videoId, video);
      offset += data.length;
      more = data.length > 0 && (total !== null ? offset < total : data.length >= pageSize);
      if (more && videos.size === previous) throw new Error('The data service returned a repeated page.');
    }
    return [...videos.values()];
  }

  async getVideoHistory(videoId: string, signal?: AbortSignal): Promise<VideoHistory> {
    if (this.useSampleData) return { timestamps: [], views: [] };
    const { data } = await this.request<VideoHistory>(`${this.baseUrl}/api/videos/${encodeURIComponent(videoId)}/history`, signal);
    if (!Array.isArray(data.timestamps) || !Array.isArray(data.views) || data.timestamps.length !== data.views.length) throw new Error('Invalid history response.');
    return data;
  }

  async getStats(): Promise<{ total_videos: number; countries: number; latest_collection_at: string | null; data_points?: number }> {
    if (this.useSampleData) {
      const videos = await this.getAllVideos();
      return { total_videos: videos.length, countries: new Set(videos.map(video => video.country).filter(Boolean)).size, latest_collection_at: null };
    }
    return (await this.request<{ total_videos: number; countries: number; latest_collection_at: string | null }>(`${this.baseUrl}/api/stats`)).data;
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

  isUsingSampleData(): boolean { return this.useSampleData; }
  getApiUrl(): string { return this.baseUrl; }
}

export const apiService = new ApiService();
