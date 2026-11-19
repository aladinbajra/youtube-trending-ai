import { afterEach, expect, it, vi } from 'vitest';
import { ApiService } from '../../src/services/api';
import { videosToCSV } from '../../src/utils/export';
afterEach(() => vi.unstubAllGlobals());

it('loads every page instead of silently limiting analytics to 100 videos', async () => {
  const fetch = vi.fn().mockResolvedValueOnce(Response.json([{ videoId: 'a', title: 'One' }], { headers: { 'X-Total-Count': '2' } })).mockResolvedValueOnce(Response.json([{ videoId: 'b', title: 'Two' }], { headers: { 'X-Total-Count': '2' } }));
  vi.stubGlobal('fetch', fetch);
  expect(await new ApiService('', false).getAllVideos()).toHaveLength(2);
  expect(fetch.mock.calls[1][0]).toContain('offset=1');
});

it('propagates live API failures and never substitutes demo records', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response('', { status: 503 }));
  vi.stubGlobal('fetch', fetch);
  await expect(new ApiService('', false).getVideos()).rejects.toThrow('503');
  expect(fetch).toHaveBeenCalledTimes(1);
});

it('detects a backend repeating the same page', async () => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => Response.json([{ videoId: 'a', title: 'One' }], { headers: { 'X-Total-Count': '10' } })));
  await expect(new ApiService('', false).getAllVideos()).rejects.toThrow('repeated page');
});

it('does not invent history in sample mode', async () => {
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  expect(await new ApiService('', true).getVideoHistory('video')).toEqual({ timestamps: [], views: [] });
  expect(fetch).not.toHaveBeenCalled();
});

it('rejects misaligned history arrays', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ timestamps: ['2026-11-19'], views: [] })));
  await expect(new ApiService('', false).getVideoHistory('video')).rejects.toThrow('Invalid history');
});

it('quotes all CSV fields and prevents spreadsheet formulas from video metadata', () => {
  const csv = videosToCSV([{ videoId: 'safe', title: '=SUM(1,2)', channelTitle: 'A "quoted", channel', country: '\t=bad', views: 0 }]);
  expect(csv.startsWith('\uFEFF')).toBe(true);
  expect(csv).toContain('"\'=SUM(1,2)"');
  expect(csv).toContain('"A ""quoted"", channel"');
  expect(csv).toContain('"\'\t=bad"');
  expect(csv).toContain('\r\n');
});
