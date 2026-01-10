import logging
import re
import sys
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
from virality_calculator import ViralityCalculator
from ai_analyzer import AIVideoAnalyzer

# Country code to full name mapping
COUNTRY_NAMES = {
    'AR': 'Argentina', 'BD': 'Bangladesh', 'BR': 'Brazil', 'CA': 'Canada',
    'CL': 'Chile', 'CO': 'Colombia', 'DE': 'Germany', 'EG': 'Egypt',
    'ES': 'Spain', 'FR': 'France', 'GB': 'United Kingdom', 'GR': 'Greece',
    'ID': 'Indonesia', 'IN': 'India', 'IT': 'Italy', 'JP': 'Japan',
    'KE': 'Kenya', 'KR': 'South Korea', 'MX': 'Mexico', 'MY': 'Malaysia',
    'NG': 'Nigeria', 'PH': 'Philippines', 'PK': 'Pakistan', 'PL': 'Poland',
    'SA': 'Saudi Arabia', 'TH': 'Thailand', 'TR': 'Turkey', 'US': 'United States',
    'VN': 'Vietnam', 'ZA': 'South Africa'
}

def get_country_name(code: str) -> str:
    return COUNTRY_NAMES.get(code.upper(), code)

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except ValueError:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except ValueError:
        pass

app = FastAPI(title="Tube Virality API", version="1.0.0")

logger = logging.getLogger("tube_virality_api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRENDING_CSV = os.path.join(BASE_DIR, "db/ods/trending_videos.csv")
VIDEO_STATS_CSV = os.path.join(BASE_DIR, "db/ods/merged_video_stats.csv")

_videos_cache = None
_stats_cache = None
_cache_timestamp = None

def _compile_keywords(keywords: List[str]) -> List[re.Pattern]:
    patterns: List[re.Pattern] = []
    for keyword in keywords:
        escaped = re.escape(keyword.strip())
        if not escaped:
            continue
        patterns.append(re.compile(rf"\b{escaped}\b", re.IGNORECASE))
    return patterns

RAW_CATEGORY_FILTERS: Dict[str, Dict[str, Any]] = {
    "music": {
        "category_ids": {"10"},
        "include": [
            "music", "song", "single", "album", "artist", "lyrics",
            "official video", "remix", "mv"
        ],
    },
    "gaming": {
        "category_ids": {"20"},
        "include": [
            "gaming", "gameplay", "playthrough", "walkthrough",
            "let's play", "speedrun", "roblox", "minecraft",
            "valorant", "fortnite", "gta", "call of duty", "csgo", "pubg"
        ],
        "exclude": [
            "match", "league", "cup", "goal", "highlights", "tournament"
        ],
    },
    "sports": {
        "category_ids": {"17"},
        "include": [
            "sport", "match", "league", "goal", "highlights", "tournament",
            "nba", "nfl", "fifa", "world cup", "uefa", "mlb", "cricket",
            "soccer", "game highlights"
        ],
        "exclude": [
            "gaming", "gameplay", "minecraft", "roblox", "fortnite"
        ],
    },
    "news": {
        "category_ids": {"25"},
        "include": [
            "news", "breaking news", "headline", "press conference",
            "update", "report", "journal", "newscast", "bulletin"
        ],
    },
    "tech": {
        "category_ids": {"28"},
        "include": [
            "tech", "technology", "gadget", "smartphone", "iphone", "android",
            "review", "unboxing", "pc build", "software", "hardware", "ai",
            "robot", "electronics", "laptop"
        ],
    },
    "food": {
        "category_ids": {"26"},
        "include": [
            "recipe", "kitchen", "cook", "cooking", "food", "chef", "baking",
            "dessert", "meal", "restaurant", "cuisine", "eat", "tasting"
        ],
    },
    "lifestyle": {
        "category_ids": {"22", "26"},
        "include": [
            "lifestyle", "daily vlog", "vlog", "routine", "morning routine",
            "night routine", "beauty", "fashion", "makeup", "self care",
            "travel vlog", "home decor"
        ],
    },
    "education": {
        "category_ids": {"27"},
        "include": [
            "education", "lesson", "tutorial", "learn", "explained", "lecture",
            "course", "class", "study", "school", "how to", "teacher", "science lesson"
        ],
    },
    "comedy": {
        "category_ids": {"23"},
        "include": [
            "comedy", "funny", "sketch", "prank", "stand-up", "parody",
            "humor", "laugh", "comedian", "joke"
        ],
    },
    "culture": {
        "category_ids": {"24", "29"},
        "include": [
            "culture", "entertainment", "festival", "art", "heritage",
            "tradition", "documentary", "music video", "dance",
            "museum", "theatre", "history"
        ],
    },
}

CATEGORY_FILTERS: Dict[str, Dict[str, Any]] = {}

for key, config in RAW_CATEGORY_FILTERS.items():
    CATEGORY_FILTERS[key] = {
        "category_ids": config.get("category_ids", set()),
        "include": _compile_keywords(config.get("include", [])),
        "exclude": _compile_keywords(config.get("exclude", [])),
    }

def load_videos_data(days_filter: int = None):
    global _videos_cache
    if days_filter is not None or _videos_cache is None:
        try:
            df = pd.read_csv(TRENDING_CSV)
            
            df['collection_date'] = pd.to_datetime(df['collection_date'])
            
            if days_filter is not None:
                last_date = df['collection_date'].max()
                cutoff_date = last_date - timedelta(days=days_filter)
                df = df[df['collection_date'] >= cutoff_date]
                print(f"[Backend] Filtering to last {days_filter} days: {cutoff_date.strftime('%Y-%m-%d')} to {last_date.strftime('%Y-%m-%d')}")
            
            df_grouped = df.sort_values('collection_date', ascending=False).groupby('id').first().reset_index()
            
            df_grouped['viewCount'] = pd.to_numeric(df_grouped['viewCount'], errors='coerce').fillna(0)
            
            df_top = df_grouped.sort_values('collection_date', ascending=False).head(100)
            
            print(f"[Backend] Loading TOP 100 NEWEST TRENDING videos (from {len(df_grouped):,} unique videos)...")
            print(f"[Backend] Most recent collection: {df_top.iloc[0]['collection_date']}")
            if len(df_top) > 0:
                print(f"[Backend] #1 trending: {df_top.iloc[0]['title']} - {df_top.iloc[0]['viewCount']:,.0f} views")
            
            videos = []
            for _, row in df_top.iterrows():
                video_id = str(row['id'])
                
                video_collections = df[df['id'] == row['id']]['collection_date']
                collection_dates_list = [pd.Timestamp(d).strftime('%Y-%m-%dT%H:%M:%SZ') if hasattr(d, 'strftime') else str(d) for d in sorted(video_collections.unique())]
                
                video_data = {
                    'views': int(row.get('viewCount', 0)) if pd.notna(row.get('viewCount')) else 0,
                    'likes': int(row.get('likeCount', 0)) if pd.notna(row.get('likeCount')) else 0,
                    'comments': int(row.get('commentCount', 0)) if pd.notna(row.get('commentCount')) else 0,
                }
                
                calculator = ViralityCalculator()
                virality_result = calculator.calculate_virality_score(
                    video_data,
                    collection_dates=collection_dates_list
                )
                
                video = {
                    "videoId": str(row['id']),
                    "title": str(row['title']),
                    "channelTitle": str(row.get('channelTitle', '')),
                    "thumbnailUrl": str(row.get('thumbnail_url', '')),
                    "description": str(row.get('description', '')),
                    "categoryId": str(row.get('categoryId', '')).strip(),
                    "tags": row.get('tags'),
                    "views": video_data['views'],
                    "likes": video_data['likes'],
                    "comments": video_data['comments'],
                    "country": str(row.get('country_code', '')),
                    "publishedAt": str(row.get('publishedAt', '')),
                    "viralityScore": virality_result['virality_score'],
                    "growthVelocity": virality_result['growth_velocity'],
                    "engagementRate": virality_result['engagement_rate'],
                    "trendingDuration": virality_result['trending_duration'],
                    "audienceReach": virality_result['audience_reach']
                }
                videos.append(video)
            
            if days_filter is None:
                _videos_cache = videos
            return videos
        except Exception as e:
            print(f"Error loading videos: {e}")
            return []
    
    return _videos_cache

def load_stats_data():
    global _stats_cache
    if _stats_cache is not None:
        return _stats_cache
    
    try:
        df = pd.read_csv(VIDEO_STATS_CSV)
        _stats_cache = df
        return df
    except Exception as e:
        print(f"Error loading stats: {e}")
        return pd.DataFrame()

@app.get("/")
def root():
    return {
        "message": "Tube Virality API",
        "version": "1.0.0",
        "endpoints": {
            "videos": "/api/videos",
            "video_history": "/api/videos/{videoId}/history",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "data_available": {
            "trending_videos": os.path.exists(TRENDING_CSV),
            "video_stats": os.path.exists(VIDEO_STATS_CSV)
        }
    }

@app.get("/api/videos")
def get_videos(
    limit: int = 50, 
    offset: int = 0, 
    days: int = None,
    published_days: int = None,
    category: Optional[str] = Query(default=None, description="Filter videos by category key (e.g., music, gaming)")
) -> List[Dict[str, Any]]:
    videos = load_videos_data(days_filter=days)
    
    if not videos:
        raise HTTPException(status_code=503, detail="Video data not available")

    category_key = (category or "all").strip().lower()

    category_header = category_key or "all"

    if category_key and category_key != "all":
        filter_config = CATEGORY_FILTERS.get(category_key)
        if filter_config:
            pre_count = len(videos)

            def matches_category(video: Dict[str, Any]) -> bool:
                raw_category_id = video.get('categoryId') or video.get('category_id')
                category_id = str(raw_category_id).strip() if raw_category_id is not None else ''
                if category_id and category_id in filter_config["category_ids"]:
                    return True

                include_patterns: List[re.Pattern] = filter_config["include"]
                exclude_patterns: List[re.Pattern] = filter_config["exclude"]

                text_parts: List[str] = [
                    str(video.get('title') or ''),
                    str(video.get('description') or ''),
                ]

                tags_value = video.get('tags')
                if isinstance(tags_value, list):
                    text_parts.extend(str(tag) for tag in tags_value)
                elif isinstance(tags_value, str):
                    text_parts.append(tags_value)
                elif tags_value is not None:
                    text_parts.append(str(tags_value))

                text_blob = ' '.join(text_parts)
                if not text_blob.strip():
                    return False

                if exclude_patterns and any(pattern.search(text_blob) for pattern in exclude_patterns):
                    return False

                if include_patterns and any(pattern.search(text_blob) for pattern in include_patterns):
                    return True

                return False

            videos = [video for video in videos if matches_category(video)]
            logger.info("Filtering videos by category=%s, count_pre=%d, count_post=%d", category_key, pre_count, len(videos))
        else:
            logger.info("Category filter skipped - unknown category=%s", category_key)
            category_header = "all"
    
    # Filter by published date if specified
    if published_days is not None:
        from datetime import datetime, timedelta
        import pytz
        
        now_utc = datetime.now(pytz.UTC)
        cutoff_date = now_utc - timedelta(days=published_days)
        
        print(f"[API] Filtering published videos: cutoff={cutoff_date.strftime('%Y-%m-%d')}, now={now_utc.strftime('%Y-%m-%d')}")
        
        filtered_videos = []
        for video in videos:
            published_at = video.get('publishedAt', '')
            if published_at:
                try:
                    if published_at.endswith('Z'):
                        video_date = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                    else:
                        video_date = datetime.fromisoformat(published_at)
                    
                    if video_date.tzinfo is None:
                        video_date = pytz.UTC.localize(video_date)
                    
                    if video_date >= cutoff_date:
                        filtered_videos.append(video)
                except Exception as e:
                    print(f"[API] Date parse error for {published_at}: {e}")
                    pass
        
        videos = filtered_videos
        print(f"[API] Filtered to {len(videos)} videos published in last {published_days} days (from {cutoff_date.strftime('%Y-%m-%d')})")
    
    limit = min(limit, 100)
    end = offset + limit
    
    filtered_slice = videos[offset:end]
    return JSONResponse(content=filtered_slice, headers={"X-Category-Filter": category_header})

@app.get("/api/videos/{video_id}/history")
def get_video_history(video_id: str) -> Dict[str, Any]:
    df = load_stats_data()
    
    if df.empty:
        return generate_sample_history(video_id)
    
    video_data = df[df['video_id'] == video_id].copy()
    
    if video_data.empty:
        return generate_sample_history(video_id)
    
    video_data['collection_day'] = pd.to_datetime(video_data['collection_day'])
    video_data = video_data.sort_values('collection_day')
    
    timestamps = video_data['collection_day'].dt.strftime('%Y-%m-%d').tolist()
    views = video_data['view_count'].tolist()
    
    return {
        "videoId": video_id,
        "timestamps": timestamps,
        "views": views
    }

def generate_sample_history(video_id: str, days: int = 30) -> Dict[str, Any]:
    timestamps = []
    views = []
    
    base_views = random.randint(100000, 10000000)
    
    for i in range(days):
        date = datetime.now() - timedelta(days=days - i)
        timestamps.append(date.strftime('%Y-%m-%d'))
        
        growth = base_views * (0.1 * i / days) + random.randint(-50000, 100000)
        views.append(max(0, int(base_views + growth)))
    
    return {
        "videoId": video_id,
        "timestamps": timestamps,
        "views": views
    }

@app.get("/api/stats")
def get_stats() -> Dict[str, Any]:
    videos = load_videos_data()
    
    try:
        df_full = pd.read_csv(TRENDING_CSV)
        total_unique_videos = df_full['id'].nunique()
        unique_countries = df_full['country_code'].dropna().nunique()
        print(f"[Stats] Total unique videos: {total_unique_videos:,}, Countries: {unique_countries}")
    except Exception as e:
        print(f"[Stats] Error reading full CSV: {e}")
        total_unique_videos = len(videos)
        unique_countries = len(set(v.get('country', '') for v in videos if v.get('country')))
    
    total_views = sum(v.get('views', 0) for v in videos)
    total_likes = sum(v.get('likes', 0) for v in videos)
    avg_views = total_views / len(videos) if videos else 0
    
    try:
        total_data_points = len(df_full)
        print(f"[Stats] Total data points: {total_data_points:,}")
    except:
        total_data_points = len(videos)
    
    return {
        "total_videos": total_unique_videos,
        "trending_videos": len(videos),
        "total_views": total_views,
        "total_likes": total_likes,
        "average_views": int(avg_views),
        "countries": unique_countries,
        "data_points": total_data_points
    }

_ai_analyzer = None

def get_ai_analyzer():
    global _ai_analyzer
    if _ai_analyzer is None:
        try:
            _ai_analyzer = AIVideoAnalyzer()
            print("[AI] OpenAI analyzer initialized")
        except Exception as e:
            print(f"[AI] Warning: Could not initialize AI analyzer: {e}")
            _ai_analyzer = False
    return _ai_analyzer if _ai_analyzer else None

@app.post("/api/ai/analyze-video")
def ai_analyze_video(video_id: str) -> Dict[str, Any]:
    analyzer = get_ai_analyzer()
    if not analyzer:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    
    videos = load_videos_data()
    video = next((v for v in videos if v['videoId'] == video_id), None)
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    result = analyzer.analyze_video(video)
    
    return {
        "videoId": video_id,
        "analysis": result.get('analysis', 'Analysis unavailable'),
        "success": result.get('success', False),
        "tokens_used": result.get('tokens_used', 0)
    }

@app.post("/api/ai/generate-titles")
def ai_generate_titles(topic: str, count: int = 5) -> Dict[str, Any]:
    analyzer = get_ai_analyzer()
    if not analyzer:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    
    count = min(count, 10)
    
    result = analyzer.generate_title_suggestions(topic, count)
    
    return {
        "topic": topic,
        "suggestions": result.get('suggestions', []),
        "success": result.get('success', False),
        "tokens_used": result.get('tokens_used', 0)
    }

@app.get("/api/ai/trending-topics")
def ai_trending_topics(limit: int = 100) -> Dict[str, Any]:
    analyzer = get_ai_analyzer()
    if not analyzer:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    
    videos = load_videos_data()[:min(limit, 200)]
    
    result = analyzer.extract_trending_topics(videos, top_n=10)
    
    return {
        "topics": result.get('topics', []),
        "analyzed_videos": len(videos),
        "success": result.get('success', False),
        "tokens_used": result.get('tokens_used', 0)
    }

@app.get("/api/ai/insights")
def ai_insights() -> Dict[str, Any]:
    analyzer = get_ai_analyzer()
    if not analyzer:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    
    videos = load_videos_data()
    
    total_views = sum(v.get('views', 0) for v in videos)
    avg_engagement = sum(
        ((v.get('likes', 0) + v.get('comments', 0)) / max(v.get('views', 1), 1)) * 100 
        for v in videos
    ) / len(videos) if videos else 0
    
    countries = list(set(v.get('country', '') for v in videos if v.get('country')))
    top_countries = sorted(
        [(c, sum(1 for v in videos if v.get('country') == c)) for c in countries],
        key=lambda x: x[1],
        reverse=True
    )[:5]
    
    top_countries_full_names = [get_country_name(c[0]) for c in top_countries]
    
    try:
        df = pd.read_csv(TRENDING_CSV)
        df['collection_date'] = pd.to_datetime(df['collection_date'])
        earliest_date = df['collection_date'].min()
        latest_date = df['collection_date'].max()
        
        earliest_str = earliest_date.strftime('%b %Y')
        latest_str = latest_date.strftime('%b %Y')
        
        if earliest_str == latest_str:
            date_range = latest_str
        else:
            date_range = f'{earliest_str} - {latest_str}'
    except:
        date_range = 'Feb 2025 - Dec 2025'
    
    summary = {
        'total_videos': len(videos),
        'avg_views': total_views // len(videos) if videos else 0,
        'top_countries': top_countries_full_names,
        'date_range': date_range,
        'avg_engagement': avg_engagement
    }
    
    result = analyzer.generate_insights(summary)
    
    return {
        "insights": result.get('insights', 'Insights unavailable'),
        "success": result.get('success', False),
        "tokens_used": result.get('tokens_used', 0),
        "dataset_summary": summary
    }

@app.post("/api/ai/explain-score")
def ai_explain_score(video_id: str) -> Dict[str, Any]:
    analyzer = get_ai_analyzer()
    if not analyzer:
        raise HTTPException(status_code=503, detail="AI service unavailable")
    
    videos = load_videos_data()
    video = next((v for v in videos if v['videoId'] == video_id), None)
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    result = analyzer.explain_virality_score(video)
    
    return {
        "videoId": video_id,
        "explanation": result.get('explanation', 'Explanation unavailable'),
        "success": result.get('success', False),
        "tokens_used": result.get('tokens_used', 0)
    }

if __name__ == "__main__":
    import uvicorn
    print("Starting Tube Virality API Server...")
    print(f"Base directory: {BASE_DIR}")
    print(f"Trending CSV: {TRENDING_CSV}")
    print(f"Stats CSV: {VIDEO_STATS_CSV}")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")

