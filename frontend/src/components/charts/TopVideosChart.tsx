import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatViews, truncate } from '../../lib/chartUtils';
import { CustomTooltip } from './CustomTooltip';

interface TopVideo {
  title: string;
  views: number;
  viralityScore: number;
}

interface TopVideosChartProps {
  data: TopVideo[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

export default function TopVideosChart({ 
  data, 
  title = "Top 10 Videos by Views", 
  height = 500,
  isLoading = false 
}: TopVideosChartProps) {
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400" style={{ height }}>
          No data available
        </div>
      </div>
    );
  }

  const top10 = data.slice(0, 10);

  return (
    <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"></div>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={top10} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            tickFormatter={formatViews}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
          />
          
          <YAxis 
            type="category" 
            dataKey="title" 
            width={150}
            tickFormatter={(value) => truncate(value, 20)}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
          />
          
          <Tooltip content={<CustomTooltip formatter={formatViews} />} />
          
          <Bar 
            dataKey="views" 
            radius={[0, 8, 8, 0]}
            animationDuration={800}
          >
            {top10.map((_, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={`url(#barGradient${index})`}
              />
            ))}
          </Bar>
          
          <defs>
            {top10.map((_, index) => {
              const colors = [
                ['#3b82f6', '#8b5cf6'],
                ['#8b5cf6', '#ec4899'],
                ['#ec4899', '#f59e0b'],
                ['#f59e0b', '#10b981'],
                ['#10b981', '#06b6d4'],
                ['#06b6d4', '#3b82f6'],
                ['#3b82f6', '#8b5cf6'],
                ['#8b5cf6', '#ec4899'],
                ['#ec4899', '#f59e0b'],
                ['#f59e0b', '#10b981'],
              ];
              const [start, end] = colors[index % colors.length];
              return (
                <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={start} />
                  <stop offset="100%" stopColor={end} />
                </linearGradient>
              );
            })}
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

