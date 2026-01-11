// Format large numbers (1234567 → "1.2M")
export function formatViews(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

// Format percentages
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Format dates
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Get color by virality score (modern hex colors)
export function getViralityColor(score: number): string {
  if (score >= 75) return '#10b981';  // Green
  if (score >= 50) return '#f59e0b';  // Orange
  if (score >= 25) return '#8b5cf6';  // Purple
  return '#ef4444';                   // Red
}

