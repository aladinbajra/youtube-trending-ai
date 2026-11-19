"""Read recorded observations without inventing missing video history."""

from pathlib import Path
from threading import RLock

import pandas as pd

try:
    from .virality_calculator import ViralityCalculator
except ImportError:
    from virality_calculator import ViralityCalculator


class DataUnavailableError(RuntimeError):
    pass


class VideoDataStore:
    def __init__(self, trending_path, stats_path):
        self.trending_path = Path(trending_path)
        self.stats_path = Path(stats_path)
        self._frames = {}
        self._catalogs = {}
        self._lock = RLock()

    def _read(self, path, required, optional=False):
        with self._lock:
            try:
                stat = path.stat()
                signature = (stat.st_mtime_ns, stat.st_size)
                previous = self._frames.get(path)
                if previous and previous[0] == signature:
                    return previous[1].copy()
                frame = pd.read_csv(path, dtype=str, keep_default_na=False)
                if not set(required).issubset(frame.columns):
                    raise ValueError("Dataset is missing required columns")
                self._frames[path] = (signature, frame)
                return frame.copy()
            except (OSError, ValueError, pd.errors.ParserError) as error:
                self._frames.pop(path, None)
                if optional:
                    return pd.DataFrame(columns=required)
                raise DataUnavailableError(
                    "Recorded video data is unavailable. Run the data collection pipeline."
                ) from error

    def trending_frame(self, days=None):
        frame = self._read(self.trending_path, ("id", "collection_date", "title"))
        frame["id"] = frame["id"].str.strip()
        frame["collection_date"] = pd.to_datetime(
            frame["collection_date"], utc=True, errors="coerce"
        )
        frame = frame.loc[(frame["id"] != "") & frame["collection_date"].notna()].copy()
        for column in ("viewCount", "likeCount", "commentCount"):
            values = (
                frame[column] if column in frame else pd.Series(0, index=frame.index)
            )
            frame[column] = (
                pd.to_numeric(values, errors="coerce")
                .replace([float("inf"), -float("inf")], 0)
                .fillna(0)
                .clip(lower=0)
                .round()
                .astype("int64")
            )
        if days is not None and not frame.empty:
            cutoff = frame["collection_date"].max() - pd.Timedelta(days=days)
            frame = frame.loc[frame["collection_date"] >= cutoff]
        return frame

    def stats_frame(self):
        return self._read(
            self.stats_path, ("video_id", "collection_day", "view_count"), optional=True
        )

    def history(self, video_id):
        frame = self.stats_frame()
        frame = frame.loc[frame["video_id"] == video_id].copy()
        if frame.empty:
            try:
                observed = self.trending_frame()
                frame = observed.loc[
                    observed["id"] == video_id, ["collection_date", "viewCount"]
                ].rename(
                    columns={
                        "collection_date": "collection_day",
                        "viewCount": "view_count",
                    }
                )
            except DataUnavailableError:
                return {
                    "videoId": video_id,
                    "timestamps": [],
                    "views": [],
                    "historyAvailable": False,
                }
        frame["day"] = pd.to_datetime(
            frame["collection_day"], utc=True, errors="coerce"
        ).dt.floor("D")
        frame["view_count"] = pd.to_numeric(
            frame["view_count"], errors="coerce"
        ).replace([float("inf"), -float("inf")], float("nan"))
        frame = frame.dropna(subset=["day", "view_count"])
        frame = frame.loc[frame["view_count"] >= 0]
        # One observation per day; country duplicates must not multiply counters.
        daily = frame.groupby("day")["view_count"].max().sort_index()
        return {
            "videoId": video_id,
            "timestamps": daily.index.strftime("%Y-%m-%d").tolist(),
            "views": [int(value) for value in daily],
            "historyAvailable": not daily.empty,
        }

    def videos(self, days=None):
        with self._lock:
            try:
                stat = self.trending_path.stat()
            except OSError as error:
                raise DataUnavailableError(
                    "Recorded video data is unavailable. Run the data collection pipeline."
                ) from error
            key = (stat.st_mtime_ns, stat.st_size, days)
            if key not in self._catalogs:
                if len(self._catalogs) >= 8:
                    self._catalogs.pop(next(iter(self._catalogs)))
                self._catalogs[key] = self._build_videos(days)
            return [
                {**video, "countries": list(video["countries"])}
                for video in self._catalogs[key]
            ]

    def _build_videos(self, days=None):
        frame = self.trending_frame(days)
        if frame.empty:
            return []
        # Keep a whole latest row; groupby.first() can mix values from different dates.
        latest = frame.sort_values(
            ["collection_date", "id"], ascending=[False, True], kind="stable"
        ).drop_duplicates("id")
        date_groups = frame.groupby("id")["collection_date"].apply(
            lambda values: sorted({value.isoformat() for value in values})
        )
        country_groups = (
            frame.groupby("id")["country_code"].apply(
                lambda values: sorted(
                    {
                        str(value).strip().upper()
                        for value in values
                        if str(value).strip()
                    }
                )
            )
            if "country_code" in frame
            else {}
        )
        # Derive growth from the recorded snapshots already in memory.
        daily = (
            frame.assign(day=frame["collection_date"].dt.floor("D"))
            .groupby(["id", "day"])["viewCount"]
            .max()
        )
        histories = {
            str(key): [
                {"timestamp": day.isoformat(), "views": int(value)}
                for (_, day), value in group.items()
            ]
            for key, group in daily.groupby(level=0)
        }
        videos = []
        calculator = ViralityCalculator()
        for row in latest.to_dict("records"):
            video_id = row["id"]
            counts = {
                "views": int(row["viewCount"]),
                "likes": int(row["likeCount"]),
                "comments": int(row["commentCount"]),
            }
            history = histories.get(video_id, [])
            scores = calculator.calculate_virality_score(
                counts, view_history=history, collection_dates=date_groups[video_id]
            )
            video = {
                "videoId": video_id,
                "title": row["title"],
                "channelTitle": row.get("channelTitle", ""),
                "thumbnailUrl": row.get("thumbnail_url", ""),
                "description": row.get("description", ""),
                "categoryId": str(row.get("categoryId", "")).removesuffix(".0"),
                "tags": row.get("tags", ""),
                **counts,
                "country": str(row.get("country_code", "")).strip().upper(),
                "countries": country_groups.get(video_id, []),
                "publishedAt": row.get("publishedAt", ""),
                "collectedAt": row["collection_date"].isoformat(),
                "hasHistory": len(history) >= 2,
                "engagementRate": (
                    round(
                        (counts["likes"] + counts["comments"]) / counts["views"] * 100,
                        4,
                    )
                    if counts["views"]
                    else 0.0
                ),
                **{
                    key: scores[value]
                    for key, value in (
                        ("viralityScore", "virality_score"),
                        ("growthVelocity", "growth_velocity"),
                        ("engagementScore", "engagement_rate"),
                        ("trendingDuration", "trending_duration"),
                        ("audienceReach", "audience_reach"),
                    )
                },
            }
            videos.append(video)
        return videos

    def summary(self):
        frame = self.trending_frame()
        videos = self.videos()
        total_views = sum(video["views"] for video in videos)
        return {
            "total_videos": len(videos),
            "trending_videos": len(videos),
            "total_views": total_views,
            "total_likes": sum(video["likes"] for video in videos),
            "average_views": total_views // len(videos) if videos else 0,
            "countries": (
                int(
                    frame["country_code"]
                    .str.strip()
                    .replace("", pd.NA)
                    .dropna()
                    .nunique()
                )
                if "country_code" in frame
                else 0
            ),
            "data_points": len(frame),
            "latest_collection_at": (
                frame["collection_date"].max().isoformat() if not frame.empty else None
            ),
            "data_source": "recorded",
        }
