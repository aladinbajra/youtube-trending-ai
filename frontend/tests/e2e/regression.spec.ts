import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/api/stats') return route.fulfill({ json: { total_videos: 140, countries: 2, latest_collection_at: '2026-11-19T00:00:00Z' } });
    if (url.pathname === '/api/videos') {
      const category = url.searchParams.get('category');
      const videos = Array.from({ length: category === 'gaming' ? 13 : 140 }, (_, index) => ({ videoId: `video-${index}`, title: `Recorded video ${index}`, channelTitle: 'Recorded channel', views: 1000 + index, likes: 10, comments: 2, country: 'US', countries: ['US', 'GB'], publishedAt: '2026-11-18T12:00:00Z', categoryId: category === 'gaming' ? '20' : '10', viralityScore: 50 }));
      return route.fulfill({ json: videos, headers: { 'X-Total-Count': String(videos.length) } });
    }
    if (url.pathname.endsWith('/history')) return route.fulfill({ json: { timestamps: [], views: [] } });
    return route.fulfill({ status: 503, json: { detail: 'AI not configured in regression tests' } });
  });
});

test('shows the complete catalog, filters and resets the visible search field', async ({ page }) => {
  await page.goto('/analytics');
  await expect(page.getByText('Showing 140 of 140 videos')).toBeVisible();
  const search = page.getByRole('searchbox', { name: 'Search videos' });
  await search.fill('no matching title');
  await expect(page.getByText('No videos match your filters')).toBeVisible();
  await page.getByRole('button', { name: 'Clear Filters', exact: true }).click();
  await expect(search).toHaveValue('');
  await page.getByRole('button', { name: 'Gaming', exact: true }).click();
  await expect(page.getByText('Showing 13 of 13 videos')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('surfaces failures and retries without silently loading samples', async ({ page }) => {
  let failed = true;
  await page.route('**/api/videos?**', route => failed ? route.fulfill({ status: 503, json: { detail: 'Offline' } }) : route.fulfill({ json: [] }));
  await page.goto('/analytics');
  await expect(page.getByRole('alert')).toContainText('503');
  failed = false;
  await page.getByRole('button', { name: 'Retry loading data' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByText('Showing 0 of 0 videos')).toBeVisible();
});

test('exports a CSV through a tap or keyboard and closes with Escape', async ({ page }) => {
  await page.goto('/analytics');
  const trigger = page.getByTestId('export-button');
  await expect(trigger).toContainText('140');
  await trigger.click();
  await expect(page.getByTestId('export-csv')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  const download = page.waitForEvent('download');
  await page.getByTestId('export-csv').click();
  expect((await download).suggestedFilename()).toMatch(/analytics-export_.*\.csv$/);
});

test('shows absent history honestly and keeps keyboard focus inside the dialog', async ({ page }) => {
  await page.goto('/analytics');
  await page.getByText('Recorded video 139', { exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('No historical data available for this video')).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.querySelector('[role="dialog"]')?.contains(document.activeElement)))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('homepage reports the collection date and avoids an invented AI accuracy claim', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Collected', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('AI Insights', { exact: true })).toBeVisible();
  await expect(page.getByText('99.2%')).toHaveCount(0);
});
