import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, ZAxis } from 'recharts';
import { motion } from 'framer-motion';
import type { Video } from '../types';
import { getCountryName } from '../utils/countryMap';

interface ChartsSectionProps {
  videos: Video[];
}

export const ChartsSection = ({ videos }: ChartsSectionProps) => {
  // Country distribution data
  const countryData = videos.reduce((acc, video) => {
    if (video.country) {
      acc[video.country] = (acc[video.country] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const countryChartData = Object.entries(countryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, value]) => ({ name: getCountryName(code), value }));

  // Engagement rate data
  const engagementData = videos
    .filter(v => v.views && v.likes)
    .slice(0, 10)
    .map(v => ({
      name: v.title?.substring(0, 20) + '...' || 'Unknown',
      rate: ((v.likes! / v.views!) * 100).toFixed(2),
    }));

  // Views vs Likes scatter
  const scatterData = videos
    .filter(v => v.views && v.likes)
    .slice(0, 50)
    .map(v => ({
      views: v.views,
      likes: v.likes,
      title: v.title?.substring(0, 30) || '',
    }));

  const COLORS = ['#FF0000', '#9333EA', '#3B82F6', '#F59E0B', '#10B981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Country Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-gradient rounded-card border border-zinc-800 p-6"
      >
        <h3 className="text-xl font-bold mb-4">Country Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={countryChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {countryChartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Engagement Rate Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card-gradient rounded-card border border-zinc-800 p-6"
      >
        <h3 className="text-xl font-bold mb-4">Top 10 Engagement Rates</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="name"
              stroke="#888"
              style={{ fontSize: '10px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#888"
              style={{ fontSize: '12px' }}
              label={{ value: 'Engagement %', angle: -90, position: 'insideLeft', fill: '#888' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="rate" fill="#FF0000" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Views vs Likes Scatter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card-gradient rounded-card border border-zinc-800 p-6 lg:col-span-2"
      >
        <h3 className="text-xl font-bold mb-4">Views vs Likes Correlation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              type="number"
              dataKey="views"
              name="Views"
              stroke="#888"
              tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`}
            />
            <YAxis
              type="number"
              dataKey="likes"
              name="Likes"
              stroke="#888"
              tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`}
            />
            <ZAxis range={[50, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'views' || name === 'likes') {
                  return value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `${(value / 1000).toFixed(0)}K`;
                }
                return value;
              }}
            />
            <Scatter name="Videos" data={scatterData} fill="#FF0000" />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-sm text-text-body text-center mt-2">
          Showing correlation between view count and like count for top 50 videos
        </p>
      </motion.div>
    </div>
  );
};

