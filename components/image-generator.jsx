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
    // placeholder for potential hydration
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

  const downloadAll = () => {
    images.forEach((im) => im.src && downloadImage(im.src));
  };

  const regenerate = () => {
    if (!lastPromptRef.current) return;
    setPrompt(lastPromptRef.current);
    generateMultiple(4);
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#f3f7fb_0%,#eef5fb_50%)] text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md">OX</div>
            <div>
              <div className="text-lg font-semibold text-slate-800">OpenXAI</div>
              <div className="text-xs text-slate-500">AI Image Creator</div>
            </div>
          </div>

          <div className="text-sm text-slate-600">Try: “An astronaut walking through a galaxy of sunflowers”</div>
        </div>

        {/* Conversation / Cards area */}
        <div className="relative">
          {showConversation ? (
            <>
              {/* user bubble (right) */}
              <div className="flex justify-end mb-4">
                <div className="max-w-md text-white bg-blue-500 px-4 py-3 rounded-2xl shadow-lg">
                  {lastPromptRef.current}
                </div>
              </div>

              {/* assistant card with 2x2 grid */}
              <div className="flex justify-start mb-6">
                <div className="w-full md:w-[720px] bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <p className="text-slate-700 mb-3">Sure, I’ll use Image Creator to draw that for you.</p>

                  <div className="grid grid-cols-2 gap-3">
                    {images.length === 0 && (
                      <div className="col-span-2 text-sm text-slate-400">No results yet</div>
                    )}

                    {isGenerating && images.length > 0 && images.map((_, i) => (
                      <div key={i} className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                        <Loader2 className="animate-spin text-sky-500" />
                      </div>
                    ))}

                    {!isGenerating && images.map((im) => (
                      <div key={im.id} className="rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                        <img src={im.src} alt={`result-${im.id}`} className="w-full h-40 object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="text-sm text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Change the astronaut to a cat</button>
                    <button className="text-sm text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Change the sunflowers to roses</button>
                    <button className="text-sm text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Add a moon in the background</button>
                  </div>

                  <div className="mt-3 text-xs text-slate-400">Made with Image Creator</div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/60 rounded-2xl p-12 text-center shadow-md">
              <h2 className="text-2xl font-semibold mb-2 text-slate-800">Welcome to OpenXAI</h2>
              <p className="text-slate-600">Type a prompt below to generate a set of creative images.</p>
            </div>
          )}
        </div>

        {/* Controls below card */}
        <div className="mt-4 flex gap-3">
          <button onClick={downloadAll} className="px-3 py-2 bg-white rounded-md shadow hover:scale-[1.01] transition">Download All</button>
          <button onClick={copyPrompt} className="px-3 py-2 bg-white rounded-md shadow hover:scale-[1.01] transition">Copy Prompt</button>
          <button onClick={regenerate} className="px-3 py-2 bg-white rounded-md shadow hover:scale-[1.01] transition">Regenerate</button>
        </div>

      </div>

      {/* Bottom pill composer */}
      <form onSubmit={handleSubmit} className="fixed left-0 right-0 bottom-6 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-2xl w-[min(920px,92%)]">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white shadow">✦</div>

          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Can you create me an image of an astronaut walking through a galaxy of sunflowers?"
            className="flex-1 bg-transparent outline-none px-3 text-slate-700 placeholder:text-slate-400"
          />

          <button type="button" onClick={() => generateMultiple(4)} className="rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white px-4 py-2 shadow-md flex items-center gap-2">
            {isGenerating ? <Loader2 className="animate-spin" /> : <Send size={16} />}
            <span className="font-semibold">Generate</span>
          </button>
        </div>
      </form>

      {/* subtle helper floating button */}
      <div className="fixed left-6 bottom-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-xl">✦</div>
      </div>

      {/* small animations */}
      <style jsx>{`
        @keyframes pulseFast { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        button:hover { transform: translateZ(0); }
      `}</style>
    </div>
  );
}
