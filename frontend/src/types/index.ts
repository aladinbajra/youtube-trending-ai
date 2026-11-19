export interface Video {
  videoId: string;
  title: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  views?: number;
  likes?: number;
  comments?: number;
  subscribers?: number;
  country?: string;
  countries?: string[];
  collectedAt?: string;
  hasHistory?: boolean;
  publishedAt?: string;
  viralityScore?: number;
  // Individual virality components
  growthVelocity?: number;
  engagementRate?: number;
  engagementScore?: number;
  trendingDuration?: number;
  audienceReach?: number;
  [key: string]: unknown; // Allow extra fields
}

export interface VideoHistory {
  timestamps: string[];
  views: number[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

