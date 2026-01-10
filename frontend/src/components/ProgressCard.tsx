import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressCardProps {
  title: string;
  percentage: number;
  icon: LucideIcon;
  color?: string;
}

export const ProgressCard = ({ title, percentage, icon: Icon, color = 'bg-primary' }: ProgressCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card-gradient rounded-card p-6 border border-zinc-800"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold">{percentage}%</span>
      </div>
      
      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full ${color}`}
        />
      </div>
    </motion.div>
  );
};

