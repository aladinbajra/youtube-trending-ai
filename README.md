# YouTube Trending AI

A React and FastAPI workspace for exploring recorded YouTube trends, comparing markets, and requesting AI-assisted analysis. Virality scores are descriptive heuristics, not probabilities or guaranteed forecasts.

## What works

- Browse the complete recorded catalogue with search, category/country filters, sorting and pagination.
- Compare recorded view histories, engagement, publication patterns in UTC, and market presence.
- Export CSV/JSON using touch or keyboard. CSV text is quoted and spreadsheet formula prefixes are escaped.
- Ask for title suggestions and video explanations when an OpenAI API key is configured on the server.
- Clear loading, unavailable-data and retry states. Live failures never silently switch to demo data; missing history stays empty.

## Local setup

Use Python 3.11+ and Node 20.9+.

```sh
python -m venv .venv
# Activate .venv using the command for your shell.
python -m pip install -r backend_api/requirements.txt
python -m uvicorn backend_api.app:app --host 127.0.0.1 --port 8001
```

In a second terminal:

```sh
cd frontend
npm ci
npm run dev
```

Open http://127.0.0.1:5173. The development server forwards `/api` to port 8001. `VITE_API_URL` can point to another backend when needed; set it before building. A static production host must route `/api` to the backend or configure that public origin with an appropriate CORS allowlist.

### Recorded data

The backend reads `db/ods/trending_videos.csv` and optional `db/ods/merged_video_stats.csv`, relative to the repository. Override locations with `YOUTUBE_TRENDING_CSV` and `YOUTUBE_STATS_CSV`.

Trending CSV requires `id`, `title` and `collection_date`. Optional fields include `viewCount`, `likeCount`, `commentCount`, `country_code`, `categoryId`, `channelTitle`, `publishedAt`, `thumbnail_url`, `description` and `tags`. The history CSV uses `video_id`, `collection_day` and `view_count`.

Records are deduplicated by video using the latest complete observation. All recorded countries remain attached to the video; counters are counted once in global totals. Catalogue caches refresh when source files change. The API supports bounded `limit`/`offset` pagination and reports `X-Total-Count`. It no longer limits the catalogue to 100 records before filtering.

Use the collection and processing scripts under `src/` to populate data with your own YouTube API configuration. The collection scripts have their own `src/requirements.txt`. No API key or personal dataset is included.

### Demo without API keys

Set `VITE_USE_SAMPLE_DATA=true` in `frontend/.env.local`, then restart Vite. The included small illustrative dataset is clearly labelled. Demo records do not pretend to provide historical observations.

### AI features

Set `OPENAI_API_KEY` on the backend. API keys never belong in `VITE_*` variables. AI calls have a 30-second timeout and one retry. Generated suggestions require human review. The app does not advertise an unmeasured accuracy percentage.

## Verification

```sh
python -m pip install pytest
python -m pytest backend_api/tests -q
cd frontend
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The current browser regressions start their own frontend on port 3719 and mock external responses. They cover desktop/mobile filtering, complete catalogue loading, failures and retry, CSV export, keyboard focus and missing history. Older manual harnesses remain in `frontend/tests/`; they are not the deterministic regression suite.

Page bundles load on demand, so the home page no longer downloads all charts and AI tools upfront. See [the verification record](docs/verification-2026-11-19.md) for results and remaining limits.

## License

MIT; see [LICENSE](LICENSE).
