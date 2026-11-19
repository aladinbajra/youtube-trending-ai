import sys
from pathlib import Path

import pandas as pd
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from backend_api.data_store import VideoDataStore, DataUnavailableError
from backend_api import app as api


def row(video="one", date="2026-11-19", views=100, **values):
    return {
        "id": video,
        "title": f"Video {video}",
        "collection_date": date,
        "viewCount": views,
        "likeCount": 10,
        "commentCount": 2,
        "country_code": "US",
        "categoryId": "10",
        "publishedAt": "2026-11-18T00:00:00Z",
        **values,
    }


@pytest.fixture
def store(tmp_path, monkeypatch):
    store = VideoDataStore(tmp_path / "trending.csv", tmp_path / "stats.csv")
    monkeypatch.setattr(api, "data_store", store)
    return store


def save(store, rows):
    pd.DataFrame(rows).to_csv(store.trending_path, index=False)


def test_catalog_is_not_truncated_before_filtering_or_pagination(store):
    save(
        store,
        [
            row(str(index), categoryId="20" if index == 149 else "10")
            for index in range(150)
        ],
    )
    client = TestClient(api.app)
    all_videos = client.get("/api/videos", params={"limit": 1000})
    assert len(all_videos.json()) == 150
    assert all_videos.headers["X-Total-Count"] == "150"
    assert (
        client.get("/api/videos", params={"category": "gaming"}).json()[0]["videoId"]
        == "149"
    )
    assert (
        len(client.get("/api/videos", params={"limit": 20, "offset": 140}).json()) == 10
    )


def test_latest_observation_and_all_countries_are_preserved(store):
    save(
        store,
        [
            row(date="2026-11-18", country_code="GB", title="Old title"),
            row(date="2026-11-19", views=500, channelTitle="", title="New title"),
        ],
    )
    video = store.videos()[0]
    assert video["title"] == "New title"
    assert video["views"] == 500
    assert video["channelTitle"] == ""
    assert video["countries"] == ["GB", "US"]
    assert video["hasHistory"] is True


def test_file_changes_and_removal_invalidate_cached_data(store):
    save(store, [row(views=100)])
    assert store.videos()[0]["views"] == 100
    save(store, [row(views=98765)])
    assert store.videos()[0]["views"] == 98765
    store.trending_path.unlink()
    with pytest.raises(DataUnavailableError):
        store.videos()


def test_daily_history_is_recorded_and_never_random(store):
    save(
        store,
        [
            row(date="2026-11-18", views=100),
            row(date="2026-11-18", views=120, country_code="GB"),
            row(date="2026-11-19", views=200),
        ],
    )
    assert store.history("one")["views"] == [120, 200]
    assert store.history("one")["timestamps"] == ["2026-11-18", "2026-11-19"]
    assert store.history("missing") == {
        "videoId": "missing",
        "timestamps": [],
        "views": [],
        "historyAvailable": False,
    }


def test_stats_history_is_sorted_deduplicated_and_refreshes(store):
    pd.DataFrame(
        [
            {"video_id": "one", "collection_day": "2026-11-19", "view_count": 500},
            {"video_id": "one", "collection_day": "2026-11-18", "view_count": 100},
            {"video_id": "one", "collection_day": "2026-11-18", "view_count": 150},
            {"video_id": "one", "collection_day": "invalid", "view_count": 900},
        ]
    ).to_csv(store.stats_path, index=False)
    assert store.history("one")["views"] == [150, 500]
    pd.DataFrame(
        [{"video_id": "one", "collection_day": "2026-11-20", "view_count": 9000}]
    ).to_csv(store.stats_path, index=False)
    assert store.history("one")["views"] == [9000]


def test_summary_uses_all_unique_videos_without_multiplying_countries(store):
    save(
        store,
        [
            row("one", views=100),
            row("one", country_code="GB", views=100),
            row("two", views=200),
        ],
    )
    summary = store.summary()
    assert summary["total_videos"] == 2
    assert summary["total_views"] == 300
    assert summary["data_points"] == 3
    assert summary["countries"] == 2
    assert summary["latest_collection_at"].startswith("2026-11-19")


def test_empty_valid_dataset_and_missing_dataset_are_different(store):
    client = TestClient(api.app)
    assert client.get("/api/videos").status_code == 503
    pd.DataFrame(columns=["id", "title", "collection_date"]).to_csv(
        store.trending_path, index=False
    )
    assert client.get("/api/videos").status_code == 200
    assert client.get("/api/videos").json() == []


@pytest.mark.parametrize(
    "params",
    [
        {"limit": -1},
        {"limit": 1001},
        {"offset": -1},
        {"days": 0},
        {"published_days": -1},
    ],
)
def test_query_bounds(store, params):
    assert TestClient(api.app).get("/api/videos", params=params).status_code == 422


def test_invalid_dates_and_counters_do_not_break_json(store):
    save(
        store,
        [
            row("valid", views="not-a-number", likeCount=-5),
            row("invalid", date="not-a-date"),
        ],
    )
    videos = TestClient(api.app).get("/api/videos").json()
    assert len(videos) == 1
    assert videos[0]["views"] == 0
    assert videos[0]["likes"] == 0


def test_days_window_uses_the_last_recorded_day(store):
    save(store, [row("old", date="2024-01-01"), row("recent", date="2024-02-01")])
    assert [video["videoId"] for video in store.videos(days=7)] == ["recent"]


def test_engagement_percentage_is_separate_from_the_normalized_component(store):
    save(store, [row(views=100, likeCount=10, commentCount=2)])
    video = store.videos()[0]
    assert video["engagementRate"] == 12.0
    assert video["engagementScore"] > video["engagementRate"]
