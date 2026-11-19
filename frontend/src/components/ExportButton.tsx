import { Download } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { Video } from '../types';
import { downloadFile, videosToCSV } from '../utils/export';

interface ExportButtonProps { videos: Video[]; filename?: string }

export const ExportButton = ({ videos, filename = 'tube-virality-data' }: ExportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    container.current?.querySelector<HTMLButtonElement>('[data-testid="export-csv"]')?.focus();
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  const exportFile = (format: 'csv' | 'json') => {
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(format === 'csv' ? videosToCSV(videos) : JSON.stringify(videos, null, 2), format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json', `${filename}_${date}.${format}`);
    setOpen(false);
    trigger.current?.focus();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(videos.map(video => [video.videoId, video.title, video.views ?? 0, video.likes ?? 0, video.country ?? ''].join('\t')).join('\n'));
      setMessage(`Copied ${videos.length} videos.`);
    } catch { setMessage('Clipboard access failed. Please export a file instead.'); }
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <div className="relative" ref={container}>
      <button type="button" ref={trigger} disabled={videos.length === 0} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)} className="flex items-center space-x-2 px-4 py-3 bg-youtube rounded-button font-semibold disabled:opacity-50" data-testid="export-button">
        <Download size={20} /><span>Export ({videos.length})</span>
      </button>
      {open && <div id={id} aria-label="Export formats" className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-card shadow-card z-30 p-1">
        <button type="button" onClick={() => exportFile('csv')} className="w-full text-left px-4 py-3 hover:bg-zinc-800 focus:bg-zinc-800" data-testid="export-csv">Export as CSV</button>
        <button type="button" onClick={() => exportFile('json')} className="w-full text-left px-4 py-3 hover:bg-zinc-800 focus:bg-zinc-800" data-testid="export-json">Export as JSON</button>
        <button type="button" onClick={() => void copy()} className="w-full text-left px-4 py-3 hover:bg-zinc-800 focus:bg-zinc-800" data-testid="export-clipboard">Copy to Clipboard</button>
      </div>}
      <span role="status" className="sr-only">{message}</span>
    </div>
  );
};
