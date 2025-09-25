"use client";

import { useEffect, useState, useRef } from "react";
import { Wand2, Loader2, RefreshCw, Download, Copy, Send } from "lucide-react";

const ATTACHMENT_URL = "https://cdn.builder.io/api/v1/image/assets%2Fbf673e2b595c4e9ab9cee164257af88b%2F014b69e053c840bd917a81bf631a92ea?format=webp&width=800";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState(() => (
    // Initialize with 2x2 thumbnails using the provided attachment to match the sample
    Array.from({ length: 4 }).map((_, i) => ({ id: i, src: ATTACHMENT_URL }))
  ));
  const [error, setError] = useState("");
  const [showConversation, setShowConversation] = useState(true);

  const lastPromptRef = useRef("Can you create me an image of an astronaut walking through a galaxy of sunflowers?");

  useEffect(() => {
    // no-op for now
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
    <div className="min-h-screen w-full bg-[linear-gradient(180deg,#eaf5ff_0%,#f3f8fb_100%)] text-slate-900 antialiased">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-sm">OX</div>
            <div>
              <div className="text-lg font-semibold text-slate-800">OpenXAI</div>
              <div className="text-xs text-slate-500">AI Image Creator</div>
            </div>
          </div>

          <div className="text-sm text-slate-600">Try: “An astronaut walking through a galaxy of sunflowers”</div>
        </div>

        {/* Conversation / Card area */}
        <div className="relative">
          {/* user bubble top-right */}
          {showConversation && (
            <div className="flex justify-end mb-4">
              <div className="max-w-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-2xl shadow-lg">
                {lastPromptRef.current}
              </div>
            </div>
          )}

          {/* assistant bubble with 2x2 grid */}
          <div className="flex justify-start">
            <div className="w-full md:w-[720px] bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <p className="text-slate-700 mb-3">Sure, I’ll use Image Creator to draw that for you.</p>

              <div className="grid grid-cols-2 gap-3">
                {images.map((im) => (
                  <div key={im.id} className="rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                    {im.loading ? (
                      <div className="h-40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-sky-500" />
                      </div>
                    ) : (
                      <img src={im.src} alt={`result-${im.id}`} className="w-full h-40 object-cover" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                <div>Made with <span className="text-sky-600 font-medium">Image Creator</span></div>
                <div className="flex gap-2">
                  <button className="text-xs text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Change the astronaut to a cat</button>
                  <button className="text-xs text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Change the sunflowers to roses</button>
                  <button className="text-xs text-sky-600 bg-sky-50 px-3 py-1 rounded-full">Add a moon in the background</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls below card */}
        <div className="mt-5 flex gap-3">
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

      {/* helper floating FAB */}
      <div className="fixed left-6 bottom-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-xl">✦</div>
      </div>

      <style jsx>{`
        .rounded-2xl { border-radius: 16px; }
      `}</style>
    </div>
  );
}
