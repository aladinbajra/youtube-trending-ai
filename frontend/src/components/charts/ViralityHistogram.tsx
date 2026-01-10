import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';

interface Video {
  viralityScore?: number;
}

interface ViralityHistogramProps {
  data: Video[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

export default function ViralityHistogram({ 
  data, 
  title = "Virality Score Distribution", 
  height = 350,
  isLoading = false 
}: ViralityHistogramProps) {
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400" style={{ height }}>
          No data available
        </div>
      </div>
    );
  }

  const histogramData = [
    { 
      range: '0-20', 
      count: data.filter(v => (v.viralityScore || 0) < 20).length, 
      color: '#ef4444' 
    },
    { 
      range: '20-40', 
      count: data.filter(v => (v.viralityScore || 0) >= 20 && (v.viralityScore || 0) < 40).length, 
      color: '#f59e0b' 
    },
    { 
      range: '40-60', 
      count: data.filter(v => (v.viralityScore || 0) >= 40 && (v.viralityScore || 0) < 60).length, 
      color: '#8b5cf6' 
    },
    { 
      range: '60-80', 
      count: data.filter(v => (v.viralityScore || 0) >= 60 && (v.viralityScore || 0) < 80).length, 
      color: '#3b82f6' 
    },
    { 
      range: '80-100', 
      count: data.filter(v => (v.viralityScore || 0) >= 80).length, 
      color: '#10b981' 
    }
  ];

  return (
    <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-pulse"></div>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={histogramData} margin={{ top: 40, right: 30, left: 30, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgb(161 161 170)" 
            className="dark:stroke-zinc-700"
            opacity={0.3} 
          />
          
          <XAxis 
            dataKey="range"
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '13px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            axisLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
          />
          
          <YAxis 
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            axisLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            label={{ 
              value: 'Number of Videos', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10,
              fill: 'rgb(113 113 122)',
              className: 'dark:fill-zinc-400',
              style: { fontSize: '13px', fontWeight: 600 }
            }}
          />
          
          <Tooltip 
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const entry = payload[0].payload as typeof histogramData[0];
              const total = histogramData.reduce((sum, item) => sum + item.count, 0);
              const percentage = total > 0 ? ((entry.count / total) * 100).toFixed(1) : '0';
              return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    Score Range: {entry.range}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm py-1">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">Videos:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{entry.count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm py-1">
                      <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800 bg-blue-500"></div>
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">Percentage:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{percentage}%</span>
                    </div>
                  </div>
                </div>
              );
            }}
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          
          <defs>
            {histogramData.map((entry, index) => {
              const gradients: Record<string, [string, string]> = {
                '#ef4444': ['#ef4444', '#dc2626'],
                '#f59e0b': ['#f59e0b', '#d97706'],
                '#8b5cf6': ['#8b5cf6', '#7c3aed'],
                '#3b82f6': ['#3b82f6', '#2563eb'],
                '#10b981': ['#10b981', '#059669']
              };
              const [start, end] = gradients[entry.color] || [entry.color, entry.color];
              return (
                <linearGradient key={index} id={`histogramGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={start} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={end} stopOpacity={0.7} />
                </linearGradient>
              );
            })}
          </defs>
          
          <Bar 
            dataKey="count" 
            radius={[10, 10, 0, 0]}
            animationDuration={1200}
          >
            {histogramData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#histogramGradient${index})`} />
            ))}
            
            <LabelList 
              dataKey="count" 
              position="top" 
              style={{ 
                fill: 'rgb(113 113 122)',
                fontSize: '13px', 
                fontWeight: 700 
              }}
              formatter={(value: number) => value > 0 ? value.toLocaleString() : ''}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

