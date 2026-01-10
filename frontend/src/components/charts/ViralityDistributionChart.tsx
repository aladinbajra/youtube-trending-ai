import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';

interface ViralitySegment {
  name: string;
  value: number;
}

interface ViralityDistributionChartProps {
  data: ViralitySegment[];
  title?: string;
  height?: number;
  isLoading?: boolean;
}

const VIRALITY_COLORS: Record<string, string> = {
  'Viral (75-100)': 'hsl(142, 76%, 36%)',
  'High (50-75)': 'hsl(38, 92%, 50%)',
  'Medium (25-50)': 'hsl(280, 100%, 70%)',
  'Low (0-25)': 'hsl(0, 84%, 60%)'
};

export default function ViralityDistributionChart({ 
  data, 
  title = "Virality Distribution", 
  height = 400,
  isLoading = false 
}: ViralityDistributionChartProps) {
  
  if (isLoading) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
          {title}
        </h3>
        <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400" style={{ height }}>
          No data available
        </div>
      </div>
    );
  }

  const totalVideos = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card-gradient dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={VIRALITY_COLORS[entry.name]} 
                stroke="hsl(224, 71%, 4%)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value: string, entry: { payload?: { value?: number } }) => {
              const count = entry?.payload?.value ?? 0;
              return (
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {value}: <span className="font-bold">{count}</span> videos
                </span>
              );
            }}
          />
          
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="fill-zinc-900 dark:fill-zinc-100"
            style={{ fontSize: '28px', fontWeight: 'bold' }}
          >
            {totalVideos.toLocaleString()}
          </text>
          <text 
            x="50%" 
            y="56%" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="fill-zinc-600 dark:fill-zinc-400"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Total Videos
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

