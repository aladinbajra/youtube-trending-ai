import { useState } from 'react';

interface HeatmapData {
  day: string;
  hour: number;
  count: number;
}

interface PublishingHeatmapProps {
  data: HeatmapData[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

export default function PublishingHeatmap({ 
  data, 
  title = "Best Publishing Times", 
  height = 400,
  isLoading = false 
}: PublishingHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; count: number } | null>(null);
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400" style={{ height }}>
          No data available
        </div>
      </div>
    );
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const maxCount = Math.max(...data.map(d => d.count));
  
  // Beautiful blue gradient: Light Blue -> Blue -> Dark Blue
  const getColorIntensity = (count: number) => {
    if (maxCount === 0 || count === 0) {
      return 'rgb(241 245 249)'; // Light gray for empty cells
    }
    const intensity = count / maxCount;
    
    // Gradient: Light Blue -> Blue -> Dark Blue
    // Using HSL for smooth blue gradient
    const lightness = 95 - (intensity * 50); // From 95% (very light) to 45% (dark)
    const saturation = 60 + (intensity * 40); // From 60% to 100%
    return `hsl(210, ${saturation}%, ${lightness}%)`;
  };

  const getDarkModeColor = (count: number) => {
    if (maxCount === 0 || count === 0) {
      return 'rgb(39 39 42)'; // Dark gray for empty cells
    }
    const intensity = count / maxCount;
    
    // Gradient for dark mode: Dark Blue -> Blue -> Bright Blue
    const lightness = 30 + (intensity * 50); // From 30% (dark) to 80% (bright)
    const saturation = 70 + (intensity * 30); // From 70% to 100%
    return `hsl(210, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-pulse"></div>
        {title}
      </h3>
      
      {/* Tooltip */}
      {hoveredCell && (
        <div className="mb-4 p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {hoveredCell.day} {hoveredCell.hour}:00
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              - {hoveredCell.count} {hoveredCell.count === 1 ? 'video' : 'videos'}
            </span>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Hours header */}
          <div className="flex mb-2">
            <div className="w-16" />
            {hours.map(hour => (
              <div 
                key={hour} 
                className="w-10 text-center text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {hour}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          {days.map(day => (
            <div key={day} className="flex items-center mb-2">
              <div className="w-16 text-sm text-zinc-800 dark:text-zinc-200 font-bold pr-2">
                {day}
              </div>
              {hours.map(hour => {
                const cell = data.find(d => d.day === day && d.hour === hour);
                const count = cell?.count || 0;
                const isHovered = hoveredCell?.day === day && hoveredCell?.hour === hour;
                
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="w-10 h-10 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 relative group"
                    style={{ 
                      backgroundColor: count > 0 
                        ? (document.documentElement.classList.contains('dark') 
                            ? getDarkModeColor(count) 
                            : getColorIntensity(count))
                        : (document.documentElement.classList.contains('dark') 
                            ? 'rgb(39 39 42)' 
                            : 'rgb(241 245 249)'),
                      boxShadow: isHovered 
                        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                        : count > 0 
                          ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
                          : 'none',
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      zIndex: isHovered ? 10 : 1,
                    }}
                    onMouseEnter={() => setHoveredCell({ day, hour, count })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {count > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                          {count}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Less</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, idx) => {
                const sampleCount = Math.round(intensity * maxCount);
                return (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 shadow-sm"
                    style={{ 
                      backgroundColor: document.documentElement.classList.contains('dark')
                        ? getDarkModeColor(sampleCount)
                        : getColorIntensity(sampleCount)
                    }}
                  />
                );
              })}
            </div>
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

