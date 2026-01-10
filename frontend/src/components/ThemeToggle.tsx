import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const label = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-button border border-zinc-800 bg-zinc-900/40 text-text-body hover:text-text-heading hover:border-youtube/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-youtube/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
    >
      {isLight ? (
        <Moon className="w-4 h-4 text-youtube" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-400" aria-hidden="true" />
      )}
      <span className="hidden sm:inline text-sm font-medium">
        {isLight ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
};

