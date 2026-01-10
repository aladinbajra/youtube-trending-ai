import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-card-gradient rounded-card p-6 border border-zinc-800 card-hover animate-float"
    >
      <div className="p-3 bg-viral rounded-lg w-fit mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-text-body">{description}</p>
    </motion.div>
  );
};

