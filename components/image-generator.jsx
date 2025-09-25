"use client";

import { useEffect, useState, useRef } from "react";
import { Wand2, Loader2, RefreshCw, Download, Copy } from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const lastPromptRef = useRef("");

  useEffect(() => {
    localStorage.setItem("ai_image_history", JSON.stringify(history));
  }, [history]);

  const generateImage = async () => {
    if (!prompt || prompt.trim().length === 0) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError("");
    setImageData(null);

    const payload = {
      prompt: prompt.trim(),
      width: 768,
      height: 768,
      steps: 20,
      guidance_scale: 7.5,
      seed: -1,
      negative_prompt: "",
    };

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setImageData({
        src: data.image,
        prompt: data.prompt,
        settings: data.settings,
        timestamp: Date.now(),
      });

      lastPromptRef.current = data.prompt;
      setHistory((h) => [
        {
          id: Date.now().toString(),
          image: data.image,
          prompt: data.prompt,
          settings: data.settings,
          createdAt: new Date().toISOString(),
        },
        ...h,
      ]);
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
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isGenerating) generateImage();
  };

  return (
    <div className="ai-generator-root w-full text-gray-50 pb-36">
      {/* Top bar title */}
      <header className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <h1 className="generator-title text-3xl md:text-4xl font-extrabold drop-shadow-sm">
          🎨 AI Creative Studio
        </h1>
        <p className="mt-1 text-white/80 text-sm md:text-base">
          Generate beautiful images from your imagination.
        </p>
      </header>

      {/* Central large preview */}
      <section className="w-full">
        <div className="max-w-5xl mx-auto px-4">
          <div className="preview-card bg-white/10 backdrop-blur rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="relative flex items-center justify-center h-[60vh] max-h-[720px]">
              {isGenerating && (
                <div className="flex flex-col items-center gap-3 animate-fade">
                  <Loader2 className="animate-spin text-white/90" size={40} />
                  <p className="text-sm text-white/80">Generating image…</p>
                  <div className="mt-2 grid grid-cols-6 gap-2 opacity-70">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} className="h-2 w-6 rounded-full bg-white/20 animate-pulse" />
                    ))}
                  </div>
                </div>
              )}

              {!isGenerating && imageData && (
                <img
                  src={imageData.src}
                  alt="Generated"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300"
                />
              )}

              {!isGenerating && !imageData && (
                <div className="text-center text-white/80 px-6">
                  <p className="text-base md:text-lg">Your image will appear here</p>
                  <p className="text-sm opacity-80 mt-1">
                    Describe what you want to see, then hit Generate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky bottom composer */}
      <form
        onSubmit={handleSubmit}
        className="composer-bar fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2"
      >
        <div className="max-w-5xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/30 dark:border-slate-700 rounded-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-end md:items-center gap-3 p-3 md:p-4">
            <label htmlFor="prompt" className="sr-only">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate…"
              rows={2}
              className="flex-1 w-full md:min-h-[56px] resize-none rounded-xl bg-white/70 dark:bg-slate-800/70 border border-white/40 dark:border-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 shadow-md p-4"
            />

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex flex-shrink-0 items-center gap-2 bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 hover:brightness-110 active:scale-[0.99] transition-all duration-200 text-white font-semibold px-5 py-3 rounded-full shadow-xl disabled:opacity-60 disabled:pointer-events-none"
                aria-label={isGenerating ? "Generating" : "Generate image"}
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                <span>{isGenerating ? "Generating" : "Generate"}</span>
              </button>

              <button
                type="button"
                onClick={() => !isGenerating && generateImage()}
                className="flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-md rounded-full text-gray-800 dark:text-gray-100 border border-white/40 dark:border-slate-700"
                aria-label="Regenerate"
                disabled={isGenerating || !prompt.trim()}
              >
                <RefreshCw size={18} />
              </button>

              <button
                type="button"
                onClick={copyPrompt}
                className="flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-md rounded-full text-gray-800 dark:text-gray-100 border border-white/40 dark:border-slate-700"
                aria-label="Copy prompt"
                disabled={!prompt.trim()}
              >
                <Copy size={18} />
              </button>

              <button
                type="button"
                onClick={downloadImage}
                className="flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-md rounded-full text-gray-800 dark:text-gray-100 border border-white/40 dark:border-slate-700"
                aria-label="Download image"
                disabled={!imageData}
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 pb-3 -mt-1">
              <p className="text-red-600 text-sm bg-red-50/80 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/50 rounded-lg px-3 py-2">
                {error}
              </p>
            </div>
          )}
        </div>
      </form>

      <style jsx>{`
        .animate-fade { opacity: 0; animation: fadeIn 0.3s ease forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>
    </div>
  );
}
