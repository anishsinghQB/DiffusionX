'use client'

import { useState } from 'react'
import { Wand2, Loader2 } from 'lucide-react'

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [error, setError] = useState('')

  const generateImage = async () => {
    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to generate image')

      setGeneratedImage(data.image)
    } catch (error) {
      console.error('Error generating image:', error)
      setError(error.message || 'Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black p-10 space-y-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-white tracking-wide">
        AI Image Generator
      </h1>

      {/* Prompt Box */}
      <div className="w-full max-w-2xl space-y-4">
        <label
          htmlFor="prompt"
          className="block text-lg font-semibold text-white"
        >
          Image Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full p-4 bg-black border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white resize-none"
          rows="3"
        />
      </div>

      <button
        onClick={generateImage}
        className="flex items-center justify-center space-x-3 bg-white text-black font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-200"
      >
        {isGenerating ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Wand2 size={22} />
            <span>Generate Image</span>
          </>
        )}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Generated Image */}
      {generatedImage && (
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-black border border-white/20 rounded-xl p-6 shadow-xl">
            <div className="text-center">
              <img
                src={generatedImage}
                alt="Generated artwork"
                className="max-w-full h-auto rounded-lg border border-white/20 shadow-lg mx-auto"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
