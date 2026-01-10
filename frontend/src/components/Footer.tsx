import { Link } from "react-router-dom";
import { 
  TrendingUp, Database, Brain, Code, Sparkles, 
  Home, BarChart3, Wand2, Cpu, Info,
  CheckCircle2, Globe, Target
} from "lucide-react";
import { useEffect, useState } from "react";

const Footer = () => {
  const [totalVideos, setTotalVideos] = useState<number | null>(null);
  const [countries, setCountries] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ts = Date.now();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
        const res = await fetch(`${apiUrl}/api/stats?_t=${ts}`, {
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          setTotalVideos(data.total_videos ?? null);
          setCountries(data.countries ?? null);
        }
      } catch {
        // silent fallback
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { icon: CheckCircle2, value: totalVideos !== null ? totalVideos.toLocaleString() : "—", label: "Videos Analyzed" },
    { icon: Globe, value: countries !== null ? String(countries) : "—", label: "Countries Covered" },
    { icon: Target, value: "<3s", label: "Avg AI Response" },
  ];

  const quickLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Analytics Dashboard", path: "/analytics", icon: BarChart3 },
    { name: "AI Tools", path: "/ai-tools", icon: Wand2 },
    { name: "Insights", path: "/insights", icon: TrendingUp },
    { name: "Data Process", path: "/data-process", icon: Cpu },
    { name: "About", path: "/about", icon: Info },
  ];

  const techStack = [
    { icon: Code, name: "React + TypeScript" },
    { icon: Database, name: "FastAPI + Python" },
    { icon: Brain, name: "GPT-4o-mini AI" },
    { icon: Sparkles, name: "YouTube Data API" },
    { icon: Code, name: "Tailwind CSS" },
  ];

  return (
    <footer className="bg-card-start/80 backdrop-blur-xl border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section - Centered Logo & Title */}
        <div className="text-center mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-3 group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-youtube flex items-center justify-center shadow-glow group-hover:shadow-[0_0_50px_rgba(255,0,0,0.4)] transition-all duration-300">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-youtube">
              Tube Virality
            </span>
          </Link>
          <p className="text-text-body mt-3 text-sm max-w-2xl mx-auto">
            AI-powered YouTube analytics and virality forecasting platform engineered for creators, strategists, and analysts.
          </p>
        </div>

        {/* Main Content Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-8">
          
          {/* Column 1: Stats Section */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold mb-6 bg-clip-text text-transparent bg-viral flex items-center justify-center md:justify-start">
              Platform Stats
            </h3>
            <div className="space-y-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center md:justify-start space-x-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-youtube/20 transition-all duration-300 light-icon-wrapper">
                      <Icon className="w-4 h-4 text-primary light-icon group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-text-heading">{stat.value}</div>
                      <div className="text-xs text-text-body">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold mb-6 bg-clip-text text-transparent bg-viral flex items-center justify-center md:justify-start">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center justify-center md:justify-start space-x-2 text-sm text-text-body hover:text-primary transition-all duration-200 group"
                    >
                      <Icon className="w-4 h-4 opacity-60 light-icon group-hover:text-primary group-hover:opacity-100 transition-all duration-200 light-icon-wrapper" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Built With */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold mb-6 bg-clip-text text-transparent bg-viral flex items-center justify-center md:justify-start">
              Built With
            </h3>
            <ul className="space-y-3">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <li
                    key={index}
                    className="flex items-center justify-center md:justify-start space-x-3 text-sm text-text-body group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-youtube group-hover:shadow-glow transition-all duration-300 light-icon-wrapper">
                      <Icon className="w-4 h-4 text-text-body light-icon group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="group-hover:text-text-heading transition-colors duration-300">
                      {tech.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Gradient Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 mb-8"></div>

        {/* Bottom Bar - Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 text-xs text-text-body">
          <div className="flex items-center space-x-1">
            <span>© 2025 Tube Virality.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Brain className="w-3.5 h-3.5 text-secondary" />
            <span>AI-Powered YouTube Analytics Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
