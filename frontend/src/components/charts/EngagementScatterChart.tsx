import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { formatViews, formatPercent, getViralityColor, truncate } from '../../lib/chartUtils';

interface ScatterData {
  views: number;
  engagement: number;
  comments: number;
  viralityScore: number;
  title: string;
}

interface EngagementScatterChartProps {
  data: ScatterData[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

export default function EngagementScatterChart({ 
  data, 
  title = "Engagement vs Views", 
  height = 500,
  isLoading = false 
}: EngagementScatterChartProps) {
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
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
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400" style={{ height }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse"></div>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgb(161 161 170)" 
            className="dark:stroke-zinc-700"
            opacity={0.3} 
          />
          
          <XAxis 
            type="number" 
            dataKey="views" 
            scale="log" 
            domain={['auto', 'auto']}
            tickFormatter={formatViews}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            axisLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            label={{ 
              value: 'Views (log scale)', 
              position: 'insideBottom', 
              offset: -15, 
              fill: 'rgb(113 113 122)',
              className: 'dark:fill-zinc-400',
              style: { fontSize: '13px', fontWeight: 600 }
            }}
          />
          
          <YAxis 
            type="number" 
            dataKey="engagement"
            tickFormatter={formatPercent}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '12px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            axisLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            label={{ 
              value: 'Engagement %', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10,
              fill: 'rgb(113 113 122)',
              className: 'dark:fill-zinc-400',
              style: { fontSize: '13px', fontWeight: 600 }
            }}
          />
          
          <ZAxis type="number" dataKey="comments" range={[60, 500]} />
          
          <Tooltip 
            cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const item = payload[0].payload as ScatterData;
              const viralityColor = getViralityColor(item.viralityScore);
              return (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 backdrop-blur-sm max-w-xs">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    {truncate(item.title, 35)}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm py-1">
                      <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800 bg-blue-500"></div>
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">Views:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatViews(item.views)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm py-1">
                      <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800 bg-purple-500"></div>
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">Engagement:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatPercent(item.engagement)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm py-1">
                      <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800 bg-green-500"></div>
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">Comments:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm py-1">
                      <div 
                        className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800" 
                        style={{ backgroundColor: viralityColor }}
                      ></div>
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">Virality:</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.viralityScore.toFixed(1)}/100</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          
          <Scatter data={data} animationDuration={1200}>
            {data.map((entry, index) => {
              const color = getViralityColor(entry.viralityScore);
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={color}
                  opacity={0.75}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

