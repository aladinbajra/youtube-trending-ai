import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatViews, formatPercent } from '../../lib/chartUtils';
import { CustomTooltip } from './CustomTooltip';
import { getCountryName } from '../../utils/countryMap';

interface CountryData {
  country: string;
  videoCount: number;
  avgViews: number;
  avgEngagement: number;
}

interface CountryPerformanceChartProps {
  data: CountryData[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

export default function CountryPerformanceChart({ 
  data, 
  title = "Top Countries Performance", 
  height = 450,
  isLoading = false 
}: CountryPerformanceChartProps) {
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400" style={{ height }}>
          No data available
        </div>
      </div>
    );
  }

  // Convert country codes to full names and take top 8
  const top8 = data.slice(0, 8).map(item => ({
    ...item,
    countryName: getCountryName(item.country)
  }));

  return (
    <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={top8} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgb(161 161 170)" 
            className="dark:stroke-zinc-700"
            opacity={0.3} 
          />
          
          <XAxis 
            dataKey="countryName" 
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          
          <YAxis 
            yAxisId="left"
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            tickFormatter={formatViews}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
          />
          
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            tickFormatter={formatPercent}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
          />
          
          <Tooltip 
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const countryData = top8.find(c => c.countryName === label);
              return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    {label}
                  </p>
                  <div className="space-y-2">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm py-1">
                        <div 
                          className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800" 
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-zinc-600 dark:text-zinc-400 font-medium">{entry.name}:</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {entry.name === 'Avg Engagement %' 
                            ? formatPercent(entry.value as number)
                            : entry.name === 'Video Count'
                            ? (entry.value as number).toLocaleString()
                            : formatViews(entry.value as number)
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
          />
          
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {value}
              </span>
            )}
          />
          
          <defs>
            <linearGradient id="videoCountGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="avgViewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="avgEngagementGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          
          <Bar 
            yAxisId="left"
            dataKey="videoCount" 
            fill="url(#videoCountGradient)"
            radius={[8, 8, 0, 0]}
            name="Video Count"
            animationDuration={1200}
          />
          
          <Bar 
            yAxisId="left"
            dataKey="avgViews" 
            fill="url(#avgViewsGradient)"
            radius={[8, 8, 0, 0]}
            name="Avg Views"
            animationDuration={1200}
          />
          
          <Bar 
            yAxisId="right"
            dataKey="avgEngagement" 
            fill="url(#avgEngagementGradient)"
            radius={[8, 8, 0, 0]}
            name="Avg Engagement %"
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

