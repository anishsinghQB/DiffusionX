"use client";

import { useEffect, useState, useRef } from "react";
import {
  Wand2,
  Loader2,
  Download,
  Copy,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Zap
} from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const lastPromptRef = useRef("");

  // Simulate localStorage with in-memory storage
  const savedHistory = useRef([]);
  
  useEffect(() => {
    // Simulate saving to localStorage
    savedHistory.current = history;
  }, [history]);

  const generateImage = async (opts = {}) => {
    if (!prompt || prompt.trim().length === 0) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError("");
    setImageData(null);

    // Simulate API call with a placeholder image
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a placeholder image URL based on the prompt
      const encodedPrompt = encodeURIComponent(prompt.trim());
      const simulatedImageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
      
      const newImageData = {
        src: simulatedImageUrl,
        prompt: prompt.trim(),
        settings: {
          width: 512,
          height: 512,
          steps: 20,
          guidance_scale: 7.5
        },
        timestamp: Date.now(),
      };

      setImageData(newImageData);
      lastPromptRef.current = prompt.trim();

      setHistory((h) => [
        {
          id: Date.now().toString(),
          image: simulatedImageUrl,
          prompt: prompt.trim(),
          settings: {
            width: 512,
            height: 512,
            steps: 20,
            guidance_scale: 7.5
          },
          createdAt: new Date().toISOString(),
        },
        ...h.slice(0, 9) // Keep only last 10 items
      ]);
      
      setPrompt(""); // Clear prompt after successful generation
    } catch (err) {
      console.error("Generation error", err);
      setError(err.message || "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageData) return;
    const a = document.createElement("a");
    a.href = imageData.src;
    a.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const copyPrompt = async () => {
    if (!lastPromptRef.current) return;
    try {
      await navigator.clipboard.writeText(lastPromptRef.current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      generateImage();
    }
  };

  // Fixed: Handle clicking on history items
  const handleHistoryClick = (item) => {
    const historyImageData = {
      src: item.image,
      prompt: item.prompt,
      settings: item.settings,
      timestamp: new Date(item.createdAt).getTime(),
    };
    setImageData(historyImageData);
    lastPromptRef.current = item.prompt;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 transition-all duration-700">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎨 AI Creative Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Transform your imagination into stunning visuals with the power of AI
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Input Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 dark:border-slate-700/50 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Create Your Vision
              </h2>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="✨ Describe your dream image in detail... (Press Ctrl/Cmd + Enter to generate)"
                  className="w-full h-32 p-4 text-lg bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 resize-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                  rows={3}
                />
                <div className="absolute bottom-4 right-4 text-sm text-gray-400 dark:text-gray-500">
                  {prompt.length}/500
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  onClick={() => generateImage()}
                  disabled={isGenerating || !prompt.trim()}
                  className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <div className="relative flex items-center gap-3">
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    )}
                    <span className="text-lg">
                      {isGenerating ? "Generating..." : "Generate Image"}
                    </span>
                    {!isGenerating && <Sparkles className="w-4 h-4 animate-pulse" />}
                  </div>
                </button>

                <button
                  onClick={copyPrompt}
                  disabled={!lastPromptRef.current}
                  className="group bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border-2 border-gray-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>{copied ? "Copied!" : "Copy Prompt"}</span>
                </button>

                <button
                  onClick={downloadImage}
                  disabled={!imageData}
                  className="group bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border-2 border-gray-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Download</span>
                </button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-xl animate-shake">
                  <div className="flex items-center">
                    <div className="text-red-600 dark:text-red-400 font-medium">
                      {error}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20 dark:border-slate-700/50 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Preview
                  </h3>
                  {imageData && (
                    <div className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                      Generated
                    </div>
                  )}
                </div>

                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden shadow-inner">
                  {isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm z-10">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        <Zap className="absolute inset-0 w-8 h-8 m-auto text-indigo-500 animate-pulse" />
                      </div>
                      <div className="text-center animate-fade">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Generating image, please wait...
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          This may take a few moments
                        </p>
                      </div>
                    </div>
                  )}

                  {!isGenerating && imageData && (
                    <div className="absolute inset-0 animate-fade-in">
                      <img
                        src={imageData.src}
                        alt="Generated"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm font-medium line-clamp-2">
                          {imageData.prompt}
                        </p>
                      </div>
                    </div>
                  )}

                  {!isGenerating && !imageData && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                      <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Ready to create</p>
                      <p className="text-sm text-center px-4">
                        Preview will appear here after generation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-slate-700/50 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Recent Creations
                  </h3>
                  {history.length > 0 && (
                    <div className="ml-auto bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                      {history.length}
                    </div>
                  )}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No creations yet</p>
                    </div>
                  ) : (
                    history.map((item, index) => (
                      <div
                        key={item.id}
                        className="group bg-gray-50 dark:bg-slate-700 rounded-2xl p-3 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-700"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-indigo-300 dark:group-hover:ring-indigo-600 transition-all duration-300">
                            <img
                              src={item.image}
                              alt="History item"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                              {item.prompt}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade {
          animation: fade 2s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
}