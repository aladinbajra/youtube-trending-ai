# Verification — 19 November 2026

The catalogue is no longer truncated to 100 videos before filtering. Latest observations preserve complete rows and all recorded markets. Recorded histories are sorted and deduplicated by UTC day; absent history stays empty. CSV changes invalidate bounded catalogue caches. Failed live requests are visible and never replaced silently with samples.

`engagementRate` now means the actual percentage of likes plus comments relative to views. The normalized virality component remains available as `engagementScore`. Global totals count each video once, while market tables retain every observed country.

The frontend has bounded requests, complete catalogue pagination, request cancellation on filter changes, retry states, controlled search reset, keyboard/touch exports, spreadsheet-safe CSV fields, object-URL cleanup, and an accessible focus-managed video dialog. Timeline charts use recorded observations rather than projecting current counters backwards to publication. The December 2025 cutoff and unmeasured accuracy/latency claims were removed. Page bundles load on demand.

## Passed checks

- 15 backend regression tests using temporary CSV datasets.
- 6 frontend service/export unit tests.
- TypeScript and ESLint.
- Vite production build with separate page bundles.
- 10 Playwright checks across desktop and mobile: full catalogue, category/search reset, request failure/retry, CSV download by keyboard/touch, modal focus/Escape, missing history and homepage data provenance.

The browser suite uses mocked API responses. It makes no paid AI requests and does not modify the original local datasets. The small opt-in demo dataset is illustrative and labelled accordingly.

## Limits

Live collection and AI-provider output still require the intended credentials and a separate real-provider check. Scores are descriptive heuristics. Market presence does not provide a geographic breakdown of each video's viewers. A static deployment needs API routing and appropriate access/rate limits before exposing AI endpoints publicly.
