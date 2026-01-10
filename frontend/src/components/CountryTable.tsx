import { motion } from 'framer-motion';

interface CountryData {
  rank: number;
  name: string;
  videoCount: number;
  engagement: number;
}

interface CountryTableProps {
  countries: CountryData[];
}

export const CountryTable = ({ countries }: CountryTableProps) => {
  return (
    <div className="bg-card-gradient rounded-card border border-zinc-800 overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-xl font-bold">Country Performance</h3>
        <p className="text-text-body text-sm mt-1">Top performing countries by video count</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                Videos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-body uppercase tracking-wider">
                Engagement
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {countries.map((country, index) => (
              <motion.tr
                key={country.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-zinc-900/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-2xl font-bold text-primary">
                    {country.rank}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-text-heading">
                    {country.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-body">
                  {country.videoCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 max-w-[100px]">
                      <div
                        className="bg-youtube h-full rounded-full"
                        style={{ width: `${country.engagement}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{country.engagement}%</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

