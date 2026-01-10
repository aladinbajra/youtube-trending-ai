import os
import json
import time
from dotenv import load_dotenv
from googleapiclient.discovery import build
from datetime import datetime
from typing import Any, Dict

load_dotenv()

class YouTubeTrending:

    def __init__(self, api_key: str, config_path: str, country_code: str):
        self.api_key = api_key
        self.country_code = country_code
        self.config = self.load_config(config_path)
        base_dir = os.path.dirname(config_path)
        self.metadata_loc = os.path.join(base_dir, self.config.get("TRENDING_METADATA_LOC"))
        self.youtube = build("youtube", "v3", developerKey=self.api_key)

        os.makedirs(self.metadata_loc, exist_ok=True)

    def load_config(self, config_path: str) -> Dict[str, Any]:
        with open(config_path, mode="r", encoding="utf-8") as file:
            return json.load(file)

    def get_trending_videos(self) -> Dict[str, Any]:
        request = self.youtube.videos().list(
            part="snippet,statistics",
            chart="mostPopular",
            regionCode=self.country_code,
            maxResults=50
        )
        response = request.execute()
        return response

    def save_to_json(self, data: Dict[str, Any], filename: str = "trending_videos.json") -> None:
        date_str = datetime.now().strftime("_%Y%m%d")
        filename = os.path.splitext(filename)[0] + f"_{self.country_code}" + date_str + os.path.splitext(filename)[1]
        filename = os.path.join(self.metadata_loc, filename)

        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, mode="w") as json_file:
            json.dump(data, json_file, indent=4)

        print(f"Trending videos saved to {filename}")


if __name__ == "__main__":
    CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../config.json"))

    api_key = os.getenv("YOUTUBE_API_KEY")
    if not api_key:
        print("Error: YOUTUBE_API_KEY environment variable not set.")
        exit(1)

    with open(CONFIG_PATH, "r", encoding="utf-8") as config_file:
        config = json.load(config_file)

    country_codes = config.get("TRENDING_COUNTRY_CODES", [])

    success_count = 0
    fail_count = 0

    for country_code in country_codes:
        print(f"Fetching trending videos for country: {country_code}")
        try:
            yt_trending = YouTubeTrending(api_key, CONFIG_PATH, country_code)
            trending_videos = yt_trending.get_trending_videos()
            yt_trending.save_to_json(trending_videos)
            print(f"[OK] Saved trending videos for {country_code}\n")
            success_count += 1
            time.sleep(2)
        except Exception as e:
            print(f"[FAIL] ERROR for {country_code}: {str(e)[:80]}...")
            print(f"       Skipping to next country.\n")
            fail_count += 1
            time.sleep(5)
            continue
    
    print(f"\n{'='*50}")
    print(f"COLLECTION SUMMARY:")
    print(f"  [OK] Success: {success_count}/{len(country_codes)} countries")
    print(f"  [FAIL] Failed: {fail_count}/{len(country_codes)} countries")
    print(f"{'='*50}\n")
