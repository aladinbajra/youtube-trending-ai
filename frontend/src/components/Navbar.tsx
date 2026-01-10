import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/ai-tools', label: 'AI Tools' },
    { to: '/insights', label: 'Insights' },
    { to: '/data-process', label: 'Data Process' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card-gradient border-b border-zinc-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-youtube rounded-lg group-hover:shadow-glow transition-all">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-text-heading">
              Tube <span className="gradient-text">Virality</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex space-x-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-button transition-all ${
                    isActive(link.to)
                      ? 'bg-youtube text-white shadow-glow'
                      : 'text-text-body hover:text-text-heading hover:bg-zinc-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-text-body hover:text-text-heading"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-button transition-all mb-1 ${
                  isActive(link.to)
                    ? 'bg-youtube text-white'
                    : 'text-text-body hover:text-text-heading hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <ThemeToggle className="w-full justify-center" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

