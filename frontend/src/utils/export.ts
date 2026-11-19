import type { Video } from '../types';

function csvCell(value: unknown): string {
  let text = String(value ?? '');
  if (/^\s*[=+\-@]/u.test(text) || /^[\t\r]/u.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function videosToCSV(videos: Video[]): string {
  const headers = ['Video ID', 'Title', 'Channel', 'Views', 'Likes', 'Comments', 'Country', 'Virality Score', 'Published At'];
  const rows = videos.map(video => [video.videoId, video.title, video.channelTitle, video.views ?? 0, video.likes ?? 0, video.comments ?? 0, video.country, video.viralityScore ?? 0, video.publishedAt]);
  return '\uFEFF' + [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
}

export function downloadFile(content: string, type: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  try { link.click(); } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
}
