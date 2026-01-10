import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatViews, formatDate, truncate } from '../../lib/chartUtils';
import { CustomTooltip } from './CustomTooltip';

interface TimelineData {
  date?: string;
  [key: string]: string | number | undefined;
}

interface MultiVideoTimelineChartProps {
  data: TimelineData[];
  videoTitles: string[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

const VIDEO_COLORS = [
  '#3b82f6',   // Blue
  '#8b5cf6',   // Purple
  '#10b981',   // Green
  '#f59e0b',   // Orange
  '#ef4444'    // Red
];

export default function MultiVideoTimelineChart({ 
  data, 
  videoTitles,
  title = "Top 5 Videos Growth", 
  height = 450,
  isLoading = false 
}: MultiVideoTimelineChartProps) {
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400" style={{ height }}>
          No data available
        </div>
      </div>
    );
  }

  // Smart tick formatter for X-axis
  const formatXAxisTick = (dateString: string, index: number, total: number) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    
    // Show every 3rd label or important dates (1st, 15th, last)
    const shouldShow = index % Math.max(1, Math.floor(total / 10)) === 0 || 
                      day === 1 || 
                      day === 15 || 
                      index === total - 1;
    
    if (shouldShow) {
      return `${month} ${day}`;
    }
    return '';
  };

  return (
    <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 60 }}>
          <defs>
            {[1, 2, 3, 4, 5].map((num, idx) => (
              <linearGradient key={num} id={`lineGradient${num}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VIDEO_COLORS[idx]} stopOpacity={0.8} />
                <stop offset="100%" stopColor={VIDEO_COLORS[idx]} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgb(161 161 170)" 
            className="dark:stroke-zinc-700"
            opacity={0.3} 
          />
          
          <XAxis 
            dataKey="date" 
            tickFormatter={(value, index) => formatXAxisTick(value, index, data.length)}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '11px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            axisLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            tickFormatter={formatViews}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            axisLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            width={80}
            label={{ 
              value: 'Views', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10,
              fill: 'rgb(113 113 122)',
              className: 'dark:fill-zinc-400',
              style: { fontSize: '13px', fontWeight: 600 }
            }}
          />
          
          <Tooltip 
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const date = new Date(label);
              const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              });
              return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 backdrop-blur-sm max-w-sm">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    {formattedDate}
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {payload
                      .filter(entry => (entry.value as number) > 0)
                      .map((entry, index) => {
                        const videoIndex = parseInt(entry.dataKey?.toString().replace('video', '') || '0') - 1;
                        const videoTitle = videoTitles[videoIndex] || `Video ${videoIndex + 1}`;
                        return (
                          <div key={index} className="flex items-center gap-3 text-sm py-1">
                            <div 
                              className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800" 
                              style={{ backgroundColor: VIDEO_COLORS[videoIndex] || '#3b82f6' }}
                            ></div>
                            <span className="text-zinc-600 dark:text-zinc-400 font-medium flex-1 truncate">
                              {truncate(videoTitle, 30)}:
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              {formatViews(entry.value as number)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            }}
            cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          
          <Legend 
            wrapperStyle={{ paddingTop: '30px' }}
            iconType="line"
            formatter={(_value: string, _entry: unknown, index: number) => (
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {truncate(videoTitles[index] || `Video ${index + 1}`, 30)}
              </span>
            )}
          />
          
          {[1, 2, 3, 4, 5].map((num, idx) => (
            <Line
              key={num}
              type="monotone"
              dataKey={`video${num}`}
              stroke={VIDEO_COLORS[idx]}
              strokeWidth={3}
              dot={{ fill: VIDEO_COLORS[idx], r: 4, strokeWidth: 2, stroke: '#ffffff', className: 'opacity-70' }}
              activeDot={{ r: 7, stroke: VIDEO_COLORS[idx], strokeWidth: 2, fill: '#ffffff', className: 'shadow-lg' }}
              animationDuration={1200}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

