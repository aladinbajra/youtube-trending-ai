type TooltipEntry = {
  color?: string;
  name?: string;
  value?: number;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  formatter?: (value: number) => string;
}

export function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-4 backdrop-blur-sm">
      {label && (
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-700">
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-3 text-sm py-1">
          <div 
            className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-800" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">{entry.name}:</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {formatter ? formatter(entry.value || 0) : entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

