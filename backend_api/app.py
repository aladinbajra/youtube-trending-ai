import logging
import re
import sys
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta, timezone
try:
    from .ai_analyzer import AIVideoAnalyzer
    from .data_store import VideoDataStore, DataUnavailableError
except ImportError:
    from ai_analyzer import AIVideoAnalyzer
    from data_store import VideoDataStore, DataUnavailableError

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
TRENDING_CSV = os.getenv("YOUTUBE_TRENDING_CSV", os.path.join(BASE_DIR, "db/ods/trending_videos.csv"))
VIDEO_STATS_CSV = os.getenv("YOUTUBE_STATS_CSV", os.path.join(BASE_DIR, "db/ods/merged_video_stats.csv"))

data_store = VideoDataStore(TRENDING_CSV, VIDEO_STATS_CSV)

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

def load_videos_data(days_filter=None):
    try:
        return data_store.videos(days_filter)
    except DataUnavailableError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

def load_stats_data():
    return data_store.stats_frame()

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
    limit: int = Query(default=50, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    days: Optional[int] = Query(default=None, ge=1, le=3650),
    published_days: Optional[int] = Query(default=None, ge=1, le=3650),
    category: Optional[str] = Query(default=None, description="Filter videos by category key (e.g., music, gaming)")
) -> List[Dict[str, Any]]:
    videos = load_videos_data(days_filter=days)


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
        now_utc = datetime.now(timezone.utc)
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
                        video_date = video_date.replace(tzinfo=timezone.utc)

                    if video_date >= cutoff_date:
                        filtered_videos.append(video)
                except Exception as e:
                    print(f"[API] Date parse error for {published_at}: {e}")
                    pass

        videos = filtered_videos
        print(f"[API] Filtered to {len(videos)} videos published in last {published_days} days (from {cutoff_date.strftime('%Y-%m-%d')})")

    end = offset + limit

    filtered_slice = videos[offset:end]
    return JSONResponse(content=filtered_slice, headers={"X-Category-Filter": category_header, "X-Total-Count": str(len(videos))})

@app.get("/api/videos/{video_id}/history")
def get_video_history(video_id: str) -> Dict[str, Any]:
    return data_store.history(video_id)

@app.get("/api/stats")
def get_stats() -> Dict[str, Any]:
    try:
        return data_store.summary()
    except DataUnavailableError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

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
def ai_generate_titles(topic: str = Query(min_length=1, max_length=500), count: int = Query(default=5, ge=1, le=10)) -> Dict[str, Any]:
    analyzer = get_ai_analyzer()
    if not analyzer:
        raise HTTPException(status_code=503, detail="AI service unavailable")


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

