import { Download } from 'lucide-react';
import type { Video } from '../types';

interface ExportButtonProps {
  videos: Video[];
  filename?: string;
}

export const ExportButton = ({ videos, filename = 'tube-virality-data' }: ExportButtonProps) => {
  const exportToCSV = () => {
    if (videos.length === 0) return;

    // Create CSV headers
    const headers = ['Video ID', 'Title', 'Channel', 'Views', 'Likes', 'Comments', 'Country', 'Virality Score', 'Published At'];
    
    // Create CSV rows
    const rows = videos.map(v => [
      v.videoId,
      `"${v.title?.replace(/"/g, '""') || ''}"`, // Escape quotes
      `"${v.channelTitle?.replace(/"/g, '""') || ''}"`,
      v.views || 0,
      v.likes || 0,
      v.comments || 0,
      v.country || '',
      v.viralityScore || 0,
      v.publishedAt || '',
    ]);

    // Combine
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (videos.length === 0) return;

    const jsonContent = JSON.stringify(videos, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    const text = videos.map(v => 
      `${v.videoId}\t${v.title}\t${v.views}\t${v.likes}\t${v.country}`
    ).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied ${videos.length} videos to clipboard!`);
    });
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 px-4 py-2 bg-youtube rounded-button hover:shadow-glow transition-all font-semibold"
        data-testid="export-button"
      >
        <Download size={20} />
        <span>Export ({videos.length})</span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-card-gradient border border-zinc-800 rounded-card shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <button
          onClick={exportToCSV}
          className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors text-sm first:rounded-t-card"
          data-testid="export-csv"
        >
          Export as CSV
        </button>
        <button
          onClick={exportToJSON}
          className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors text-sm"
          data-testid="export-json"
        >
          Export as JSON
        </button>
        <button
          onClick={copyToClipboard}
          className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors text-sm last:rounded-b-card"
          data-testid="export-clipboard"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

