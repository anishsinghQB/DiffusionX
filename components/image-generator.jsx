'use client'

import { useEffect, useState, useRef } from 'react'
import { Wand2, Loader2, RefreshCw, Download, Copy, Moon, Sun } from 'lucide-react'

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageData, setImageData] = useState(null)
  const [error, setError] = useState('')

  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [steps, setSteps] = useState(20)
  const [guidanceScale, setGuidanceScale] = useState(7.5)
  const [seed, setSeed] = useState(-1)

  const [history, setHistory] = useState([])
  const [theme, setTheme] = useState('dark')

  const lastPromptRef = useRef('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai_image_history')
      if (stored) setHistory(JSON.parse(stored))
    } catch (e) {
      console.error('Failed to load history', e)
    }

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) setTheme(savedTheme)
    applyTheme(savedTheme || 'dark')
  }, [])

  useEffect(() => {
    localStorage.setItem('ai_image_history', JSON.stringify(history))
  }, [history])

  function applyTheme(t) {
    const html = document.documentElement
    if (t === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    applyTheme(next)
  }

  const generateImage = async (opts = {}) => {
    if (!prompt || prompt.trim().length === 0) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError('')
    setImageData(null)

    const payload = {
      prompt: prompt.trim(),
      width: opts.width ?? width,
      height: opts.height ?? height,
      steps: opts.steps ?? steps,
      guidance_scale: opts.guidance_scale ?? guidanceScale,
      seed: opts.seed ?? seed,
      negative_prompt: '',
    }

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Generation failed')

      setImageData({
        src: data.image,
        prompt: data.prompt,
        settings: data.settings,
        timestamp: Date.now(),
      })

      lastPromptRef.current = data.prompt

      // push to history
      setHistory((h) => [
        {
          id: Date.now().toString(),
          image: data.image,
          prompt: data.prompt,
          settings: data.settings,
          createdAt: new Date().toISOString(),
        },
        ...h,
      ])
    } catch (err) {
      console.error('Generation error', err)
      setError(err.message || 'Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!imageData) return
    const a = document.createElement('a')
    a.href = imageData.src
    a.download = `ai-image-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const copyPrompt = async () => {
    if (!lastPromptRef.current) return
    try {
      await navigator.clipboard.writeText(lastPromptRef.current)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  const refreshImage = () => {
    // re-run with same prompt and settings
    if (!imageData) return
    const s = imageData.settings || { width, height, steps, guidance_scale: guidanceScale, seed }
    generateImage({
      width: s.width,
      height: s.height,
      steps: s.steps || s.num_inference_steps,
      guidance_scale: s.guidance_scale || guidanceScale,
      seed: s.seed || seed,
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('ai_image_history')
  }

  const selectHistoryItem = (item) => {
    setImageData({ src: item.image, prompt: item.prompt, settings: item.settings, timestamp: Date.now() })
  }

  return (
    <div className="ai-generator-root w-full flex flex-col items-center gap-6 text-gray-900 dark:text-gray-100">
      <div className="controls-card w-full bg-white/6 dark:bg-black/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6">
        <div className="header flex items-center justify-between mb-4">
          <h2 className="generator-title text-2xl font-semibold">Create artwork</h2>
          <div className="header-actions flex items-center gap-2">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="icon-btn p-2 rounded-md bg-white/5 hover:bg-white/10">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <label htmlFor="prompt" className="block text-sm font-medium mb-2">Image Prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="prompt-input w-full p-4 rounded-xl bg-white/5 border border-white/8 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          rows={3}
        />

        <div className="options-grid grid grid-cols-2 gap-4 mt-4">
          <div className="option">
            <label className="block text-sm mb-1">Width</label>
            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="input-field w-full p-2 rounded-md bg-white/4 border border-white/6" />
          </div>
          <div className="option">
            <label className="block text-sm mb-1">Height</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="input-field w-full p-2 rounded-md bg-white/4 border border-white/6" />
          </div>
          <div className="option">
            <label className="block text-sm mb-1">Steps</label>
            <input type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="input-field w-full p-2 rounded-md bg-white/4 border border-white/6" />
          </div>
          <div className="option">
            <label className="block text-sm mb-1">Guidance</label>
            <input step="0.1" type="number" value={guidanceScale} onChange={(e) => setGuidanceScale(Number(e.target.value))} className="input-field w-full p-2 rounded-md bg-white/4 border border-white/6" />
          </div>
          <div className="option col-span-2">
            <label className="block text-sm mb-1">Seed (-1 for random)</label>
            <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} className="input-field w-full p-2 rounded-md bg-white/4 border border-white/6" />
          </div>
        </div>

        <div className="actions flex items-center gap-3 mt-5">
          <button onClick={() => generateImage()} className="generate-btn inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-full">
            {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
            <span>{isGenerating ? 'Generating...' : 'Generate Image'}</span>
          </button>

          <button onClick={refreshImage} className="inline-flex items-center gap-2 bg-white/6 hover:bg-white/10 text-white px-3 py-2 rounded-md">
            <RefreshCw size={16} />
            <span className="text-sm">Refresh</span>
          </button>

          <button onClick={copyPrompt} className="inline-flex items-center gap-2 bg-white/6 hover:bg-white/10 text-white px-3 py-2 rounded-md">
            <Copy size={16} />
            <span className="text-sm">Copy Prompt</span>
          </button>

          <button onClick={downloadImage} className="inline-flex items-center gap-2 bg-white/6 hover:bg-white/10 text-white px-3 py-2 rounded-md">
            <Download size={16} />
            <span className="text-sm">Download</span>
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      <div className="preview-and-history w-full flex flex-col lg:flex-row gap-6">
        <div className="preview-card flex-1 bg-white/6 dark:bg-black/60 border border-white/6 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-4">Preview</h3>

          <div className="preview-inner flex items-center justify-center h-[420px]">
              {isGenerating && (
                <div key="loader" className="loader-box flex flex-col items-center gap-3 animate-fade">
                  <Loader2 className="animate-spin" size={36} />
                  <p className="text-sm">Generating image, this may take a moment...</p>
                </div>
              )}

              {!isGenerating && imageData && (
                <img
                  key={imageData.src}
                  src={imageData.src}
                  alt="Generated"
                  className="generated-image max-w-full max-h-full rounded-xl shadow-lg border border-white/10 opacity-100 transition-all duration-300"
                />
              )}

              {!isGenerating && !imageData && (
                <div key="empty" className="empty-state text-center text-sm text-white/60 opacity-100">
                  <p>Preview will appear here after generation</p>
                </div>
              )}
          </div>
        </div>

        <div className="history-card w-full lg:w-96 bg-white/6 dark:bg-black/60 border border-white/6 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">History</h3>
            <button onClick={clearHistory} className="text-sm text-red-400 hover:underline">Clear</button>
          </div>

          <div className="history-list flex flex-col gap-3 max-h-[420px] overflow-auto">
            {history.length === 0 && <p className="text-sm text-white/60">No generated images yet.</p>}

            {history.map((item) => (
              <div key={item.id} className="history-item flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer" onClick={() => selectHistoryItem(item)}>
                <img src={item.image} alt={item.prompt} className="w-16 h-10 object-cover rounded-md border border-white/10" />
                <div className="flex-1 text-sm">
                  <div className="text-white/90 truncate">{item.prompt}</div>
                  <div className="text-xs text-white/60">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .prompt-input { min-height: 72px }
        .generated-image { max-height: 420px }
        .animate-fade { opacity: 0; animation: fadeIn 0.25s ease forwards }
        @keyframes fadeIn { to { opacity: 1 } }
      `}</style>
    </div>
  )
}
