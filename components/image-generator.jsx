"use client";

import { useEffect, useState, useRef } from "react";
import { Wand2, Loader2, RefreshCw, Download, Copy, Send } from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState([]); // [{src, id}]
  const [error, setError] = useState("");
  const [showConversation, setShowConversation] = useState(false);

  const lastPromptRef = useRef("");

  useEffect(() => {
    // hydrate history if needed later
  }, []);

  const generateMultiple = async (count = 4) => {
    if (!prompt || !prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setError("");
    setIsGenerating(true);
    setImages(Array.from({ length: count }).map((_, i) => ({ id: i, loading: true })));

    try {
      const payload = {
        prompt: prompt.trim(),
        width: 512,
        height: 512,
        steps: 20,
        guidance_scale: 7.5,
        seed: -1,
        negative_prompt: "",
      };

      // Fire requests in parallel
      const requests = Array.from({ length: count }).map(() =>
        fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Generation failed");
          return data.image;
        })
      );

      const results = await Promise.all(requests);

      setImages(results.map((src, i) => ({ id: i, src })));
      lastPromptRef.current = prompt.trim();
      setShowConversation(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate images");
      setImages([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!isGenerating) generateMultiple(4);
  };

  const copyPrompt = async () => {
    if (!lastPromptRef.current && !prompt) return;
    try {
      await navigator.clipboard.writeText(lastPromptRef.current || prompt);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  const downloadImage = (src) => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = `openxai-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const regenerate = () => {
    if (!lastPromptRef.current) return;
    setPrompt(lastPromptRef.current);
    generateMultiple(4);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 to-purple-600 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top bar with OpenXAI brand */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-indigo-600 font-bold">OX</div>
            <div className="text-white font-semibold">OpenXAI</div>
          </div>
          <div className="text-white/90 text-sm">AI Image Creator</div>
        </div>

        {/* Conversation area */}
        <div className="relative">
          {/* user blue bubble top-right when conversation present */}
          {showConversation && (
            <div className="flex justify-end mb-6">
              <div className="max-w-md bg-blue-500 text-white px-4 py-3 rounded-2xl shadow-lg">
                {lastPromptRef.current}
              </div>
            </div>
          )}

          {/* assistant reply bubble */}
          {showConversation && (
            <div className="flex justify-start mb-4">
              <div className="max-w-2xl bg-white rounded-2xl p-4 shadow-md text-gray-800">
                <p className="mb-3">Sure, I’ll use Image Creator to draw that for you.</p>

                {/* 2x2 grid */}
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {images.length === 0 && !isGenerating && (
                    <div className="col-span-2 text-sm text-gray-500">No images yet — generate to see results.</div>
                  )}

                  {isGenerating && images.length > 0 && (
                    Array.from({ length: images.length }).map((_, i) => (
                      <div key={i} className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500" />
                      </div>
                    ))
                  )}

                  {!isGenerating && images.map((im) => (
                    <div key={im.id} className="rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                      <img src={im.src} alt={`result-${im.id}`} className="w-full h-40 object-cover" />
                    </div>
                  ))}

                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Change the astronaut to a cat</button>
                  <button className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Change the sunflowers to roses</button>
                  <button className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Add a moon in the background</button>
                </div>

                <div className="mt-3 text-xs text-gray-400">Made with Image Creator</div>
              </div>
            </div>
          )}

          {/* If no conversation yet, show a centered mock similar to Bing blank state */}
          {!showConversation && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center text-white/80 shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">Welcome to OpenXAI</h2>
              <p className="max-w-2xl mx-auto">Type a prompt below to generate a set of creative images. Try: “An astronaut walking through a galaxy of sunflowers”.</p>
            </div>
          )}
        </div>

        {/* Utility row for download/copy when images present */}
        {images.length > 0 && (
          <div className="mt-4 flex gap-3">
            <button onClick={() => images.forEach((im) => im.src && downloadImage(im.src))} className="px-3 py-2 bg-white/90 rounded-md shadow">Download All</button>
            <button onClick={copyPrompt} className="px-3 py-2 bg-white/90 rounded-md shadow">Copy Prompt</button>
            <button onClick={regenerate} className="px-3 py-2 bg-white/90 rounded-md shadow">Regenerate</button>
          </div>
        )}
      </div>

      {/* Bottom centered pill input */}
      <form onSubmit={handleSubmit} className="fixed left-0 right-0 bottom-6 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-xl w-[min(880px,90%)]">
          <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white rounded-full p-3 shadow-md">
            <Wand2 size={18} />
          </button>

          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Can you create me an image of an astronaut walking through a galaxy of sunflowers?"
            className="flex-1 bg-transparent outline-none px-3 text-gray-800"
          />

          <button type="submit" disabled={isGenerating} className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold">
            {isGenerating ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2"><Send size={14}/> Generate</span>}
          </button>
        </div>
      </form>

      <div className="fixed left-6 bottom-6">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl">✦</div>
      </div>
    </div>
  );
}
