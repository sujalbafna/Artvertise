import React, { useState } from 'react';
import { Send, Sparkles, History, Trash2 } from 'lucide-react';
import ImageDisplay from './components/ImageDisplay';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');
  const [history, setHistory] = useState<{ prompt: string; imageUrl: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const generateImage = async (promptText: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: promptText,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });

      const generatedImageUrl = response.data[0].url;
      setImageUrl(generatedImageUrl);
      setLastPrompt(promptText);
      setHistory(prev => [...prev, { prompt: promptText, imageUrl: generatedImageUrl }]);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateImage(prompt.trim());
    }
  };

  const handleGenerateNew = () => {
    setImageUrl('');
    setLastPrompt('');
  };

  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
  };

  const loadFromHistory = (item: { prompt: string; imageUrl: string }) => {
    setImageUrl(item.imageUrl);
    setLastPrompt(item.prompt);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-rose-500 to-violet-600 p-2.5 rounded-2xl shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent">
              Artvertise
              </h1>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 shadow-md hover:shadow-lg transition-all text-gray-700 hover:text-violet-600 border border-white/50"
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">History</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          <div className="space-y-8">
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20">
              <div className="space-y-6">
                <label className="block text-lg font-medium text-gray-700">
                  Describe your imagination
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A serene landscape with mountains reflecting in a crystal-clear lake at sunset..."
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none h-40 bg-white/50 backdrop-blur-sm text-gray-700 placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-violet-600 text-white px-8 py-4 rounded-2xl hover:from-rose-600 hover:to-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg font-medium"
                  disabled={isLoading || !prompt.trim()}
                >
                  <Send className="w-6 h-6" />
                  Generate Image
                </button>
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 animate-fade-in">
                {error}
              </div>
            )}

            {/* Image Display */}
            {(imageUrl || isLoading) && (
              <ImageDisplay
                imageUrl={imageUrl}
                prompt={lastPrompt}
                onGenerateNew={handleGenerateNew}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* History Sidebar */}
          <div className={`lg:w-[380px] transition-all duration-300 ${showHistory ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} ${showHistory ? 'fixed lg:relative inset-0 z-50 bg-white/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none' : ''}`}>
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20 h-full lg:max-h-[calc(100vh-2rem)] sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Generation History</h2>
                <button
                  onClick={clearHistory}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                  title="Clear history"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No generations yet</p>
                  <p className="text-gray-400 text-sm mt-2">Your generated images will appear here</p>
                </div>
              ) : (
                <div className="space-y-6 overflow-auto max-h-[calc(100vh-12rem)] pr-2 custom-scrollbar">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left group"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100 shadow-lg group-hover:shadow-xl transition-all">
                        <img
                          src={item.imageUrl}
                          alt={item.prompt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-violet-600 transition-colors px-2">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;