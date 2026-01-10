import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  gradient?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, gradient = 'bg-viral' }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card-gradient rounded-card p-6 border border-zinc-800 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${gradient} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-sm text-green-400 font-medium">
            {trend}
          </span>
        )}
      </div>
      
      <h3 className="text-text-body text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-text-heading">{value}</p>
    </motion.div>
  );
};

