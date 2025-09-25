"use client";

import { useEffect, useState, useRef } from "react";
import {
  Wand2,
  Loader2,
  RefreshCw,
  Download,
  Copy,
  Moon,
  Sun,
} from "lucide-react";

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

  const generateImage = async (opts = {}) => {
    if (!prompt || prompt.trim().length === 0) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError("");
    setImageData(null);

    const payload = {
      prompt: prompt.trim(),
      width: 512,
      height: 512,
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

  return (
    <div className="ai-generator-root w-[92%] m-auto flex flex-col items-center gap-6 py-6 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="controls-card w-full bg-gradient-to-r from-pink-100 via-indigo-100 to-teal-100 dark:from-slate-800 dark:via-slate-900 dark:to-black border border-transparent rounded-2xl p-6 shadow-2xl">
        <h2 className="generator-title text-2xl font-extrabold">
          🎨 AI Creative Studio
        </h2>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="✨ Describe the image you want to generate..."
          className="w-full p-4 rounded-xl bg-white shadow-md border border-gray-200 dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none text-gray-800 dark:text-gray-100"
          rows={3}
        />

        <div className=" flex flex-wrap items-center p-10 mt-5">
          <button
            onClick={() => generateImage()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 hover:scale-105 transition transform duration-200 text-white font-semibold px-5 py-2 rounded-full shadow-xl"
          >
            {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
            <span>{isGenerating ? "Generating..." : "Generate Image"}</span>
          </button>

          <button
            onClick={copyPrompt}
            className="flex items-center gap-2 px-3 py-2 bg-white/80 hover:bg-white shadow-md rounded-md text-gray-800"
          >
            <Copy size={16} /> <span className="text-sm">Copy Prompt</span>
          </button>

          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-3 py-2 bg-white/80 hover:bg-white shadow-md rounded-md text-gray-800"
          >
            <Download size={16} /> <span className="text-sm">Download</span>
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="preview-and-history w-full flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <div className="flex items-center justify-center h-[420px] bg-gradient-to-b from-white to-transparent dark:from-slate-800 rounded-lg overflow-hidden">
            {isGenerating && (
              <div className="flex flex-col items-center gap-3 animate-fade">
                <Loader2 className="animate-spin text-indigo-500" size={36} />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generating image, please wait...
                </p>
              </div>
            )}

            {!isGenerating && imageData && (
              <img
                src={imageData.src}
                alt="Generated"
                className="max-w-full max-h-full rounded-xl shadow-2xl border border-gray-200"
              />
            )}

            {!isGenerating && !imageData && (
              <div className="text-center text-sm text-gray-500">
                Preview will appear here after generation
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade {
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
