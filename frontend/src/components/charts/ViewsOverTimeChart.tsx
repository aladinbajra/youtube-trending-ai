import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatViews } from '../../lib/chartUtils';

interface ViewsData {
  date: string;
  views: number;
}

interface ViewsOverTimeChartProps {
  data: ViewsData[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

export default function ViewsOverTimeChart({ 
  data, 
  title = "Views Over Time", 
  height = 400,
  isLoading = false 
}: ViewsOverTimeChartProps) {
  
  // Process data: group by date and sum views, then sort and filter to Dec 7
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Group by date (YYYY-MM-DD format)
    const grouped = data.reduce((acc, item) => {
      const dateStr = item.date.split('T')[0]; // Get YYYY-MM-DD part
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, views: 0, count: 0 };
      }
      acc[dateStr].views += item.views || 0;
      acc[dateStr].count += 1;
      return acc;
    }, {} as Record<string, { date: string; views: number; count: number }>);
    
    // Convert to array, sort by date, and filter to Dec 7, 2025
    const result = Object.values(grouped)
      .map(item => ({ date: item.date, views: item.views }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter(item => {
        const itemDate = new Date(item.date);
        const dec7 = new Date('2025-12-07');
        return itemDate <= dec7;
      });
    
    return result;
  }, [data]);
  
  // Smart tick formatter to show fewer labels
  const formatXAxisTick = (dateString: string, index: number, total: number) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    
    // Show every 3rd label or important dates (1st, 15th, last)
    const shouldShow = index % Math.max(1, Math.floor(total / 8)) === 0 || 
                      day === 1 || 
                      day === 15 || 
                      index === total - 1;
    
    if (shouldShow) {
      return `${month} ${day}`;
    }
    return '';
  };
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!processedData || processedData.length === 0) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          {title}
        </h3>
        <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Up to Dec 7, 2025
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <defs>
            <linearGradient id="viewsGradientLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="viewsGradientDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgb(161 161 170)" 
            className="dark:stroke-zinc-700"
            opacity={0.3}
          />
          
          <XAxis 
            dataKey="date" 
            tickFormatter={(value, index) => formatXAxisTick(value, index, processedData.length)}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '11px', fontWeight: 600 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            tickFormatter={formatViews}
            stroke="rgb(113 113 122)"
            className="dark:stroke-zinc-400"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickLine={{ stroke: 'rgb(161 161 170)', className: 'dark:stroke-zinc-600' }}
            width={70}
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
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    {formattedDate}
                  </p>
                  <div className="flex items-center gap-3 text-sm py-1">
                    <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800 bg-blue-500"></div>
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Views:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {formatViews(payload[0].value as number)}
                    </span>
                  </div>
                </div>
              );
            }}
            cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fill="url(#viewsGradientLight)"
            animationDuration={1200}
            dot={{ fill: '#3b82f6', r: 3, opacity: 0.6 }}
            activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

