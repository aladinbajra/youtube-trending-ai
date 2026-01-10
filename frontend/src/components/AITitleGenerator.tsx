import { Wand2, Copy, Check, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface TitleSuggestion {
  title: string;
  predicted_virality: number;
}

export const AITitleGenerator = () => {
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const generateTitles = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    if (topic.trim().length < 3) {
      setError('Topic too short - be more specific (e.g., "AI tutorial for beginners")');
      return;
    }
    
    setLoading(true);
    setSuggestions([]);
    setError('');
    
    try {
      console.log('[AI] Generating titles for:', topic);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${apiUrl}/api/ai/generate-titles?topic=${encodeURIComponent(topic)}&count=5`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[AI] Response:', data);
      
      if (data.success && data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setError('No suggestions generated. Try a more specific topic.');
      }
    } catch (err) {
      console.error('Title generation error:', err);
      setError('Failed to generate titles. Make sure backend is running and OpenAI API key is set.');
    } finally {
      setLoading(false);
    }
  };

  const copyTitle = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (score >= 65) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  return (
    <div className="bg-card-gradient rounded-card border border-zinc-800 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
          <Wand2 className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <span>AI Title Generator</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </h3>
          <p className="text-sm text-text-body">Generate viral title suggestions with GPT-4o-mini</p>
        </div>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          What's your video about? <span className="text-text-body text-xs">(Be specific for better results)</span>
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(''); }}
            onKeyPress={(e) => e.key === 'Enter' && generateTitles()}
            placeholder="e.g., AI tutorial for beginners, Minecraft survival tips, cooking pasta recipe..."
            className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-button text-text-heading focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <button
            onClick={generateTitles}
            disabled={loading || !topic.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-button hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}
        
        {/* Helper text */}
        {!error && !loading && suggestions.length === 0 && (
          <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-400">
            💡 Tip: Be specific! Describe your video's niche, audience, and value proposition for better title suggestions.
          </div>
        )}
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 text-sm text-text-body mb-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>AI generated {suggestions.length} viral title suggestions:</span>
            </div>

            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 hover:border-purple-500/30 transition-colors group"
              >
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-purple-400">#{index + 1}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getScoreColor(suggestion.predicted_virality)}`}>
                        {suggestion.predicted_virality}% viral potential
                      </span>
                    </div>
                    <p className="text-text-heading font-medium leading-relaxed">
                      {suggestion.title}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => copyTitle(suggestion.title, index)}
                    className="flex-shrink-0 p-2 hover:bg-zinc-800 rounded transition-colors"
                    title="Copy title"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-text-body group-hover:text-purple-400 transition-colors" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Best suggestion highlight */}
            {suggestions.length > 0 && suggestions[0].predicted_virality >= 80 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-400">
                  <strong>Top pick:</strong> First suggestion has highest viral potential!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && suggestions.length === 0 && topic && (
        <div className="text-center py-8 text-text-body">
          <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Click "Generate" to get AI-powered title suggestions</p>
        </div>
      )}
    </div>
  );
};

