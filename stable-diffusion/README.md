# 🎨 AI Creative Studio - Stable Diffusion Image Generator

A full-stack Next.js application that allows users to generate stunning images using AI-powered Stable Diffusion technology. Simply enter a text prompt and watch AI create beautiful artwork for you!

![AI Creative Studio](https://img.shields.io/badge/AI-Stable%20Diffusion-purple)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

- **🎨 AI Image Generation**: Generate stunning images from text prompts using Stable Diffusion
- **🎛️ Advanced Controls**: Customize image dimensions, generation steps, guidance scale, and more
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **📊 Generation History**: Keep track of your recent generations and reuse prompts
- **⬇️ Download Images**: Save your generated artwork locally
- **🎯 Negative Prompts**: Specify what you don't want in your images
- **🎵 Voice Recording**: Bonus audio recording functionality
- **⚡ Multiple AI Providers**: Support for Hugging Face and Replicate APIs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd genai-starter-pack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your AI service** (Choose one):

   **Option A: Hugging Face (Recommended - Free tier available)**
   - Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
   - Create a new access token
   - Add to `.env.local`:
     ```bash
     HUGGINGFACE_API_KEY=your_api_key_here
     ```

   **Option B: Replicate (Alternative)**
   - Go to [Replicate Account](https://replicate.com/account/api-tokens)
   - Create a new API token
   - Add to `.env.local`:
     ```bash
     REPLICATE_API_TOKEN=your_api_token_here
     ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ API Configuration

### Hugging Face Setup (Free Option)

1. Create account at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens
3. Create a new token with "Read" permission
4. Add to your `.env.local` file

**Pros**: Free tier available, good for testing and development
**Cons**: May have rate limits, occasional cold starts

### Replicate Setup (Premium Option)

1. Create account at [Replicate](https://replicate.com/)
2. Go to Account → API tokens
3. Create a new API token
4. Add to your `.env.local` file

**Pros**: Faster, more reliable, higher quality models
**Cons**: Pay per generation (typically $0.01-0.05 per image)

### Fallback Mode

If no API keys are configured, the app will generate placeholder images with your prompt text. This is perfect for development and testing the UI before setting up AI services.

## 🎯 Usage

1. **Enter your prompt**: Describe the image you want to generate
2. **Optional negative prompt**: Specify what you don't want
3. **Adjust settings**: Configure dimensions, steps, and guidance scale
4. **Generate**: Click the generate button and wait for AI magic
5. **Download**: Save your favorite generations

### Example Prompts

- `"A beautiful sunset over a mountain lake, digital art, highly detailed"`
- `"Cyberpunk cityscape at night, neon lights, futuristic, 4k"`
- `"Portrait of a wise owl wearing glasses, oil painting style"`
- `"Abstract geometric patterns, vibrant colors, modern art"`

## 🏗️ Project Structure

```
genai-starter-pack/
├── app/
│   ├── api/
│   │   └── generate-image/
│   │       └── route.js          # AI image generation API
│   ├── globals.css               # Global styles
│   ├── layout.jsx               # Root layout
│   └── page.jsx                 # Main page
├── components/
│   ├── image-generator.jsx      # Main image generation component
│   └── voice-recorder.jsx       # Voice recording component
├── public/                      # Static assets
├── .env.example                 # Environment template
└── package.json
```

## 🔧 Advanced Configuration

### Custom Models

You can modify the API route to use different Stable Diffusion models:

```javascript
// In app/api/generate-image/route.js
const MODEL_URL = "https://api-inference.huggingface.co/models/your-model-here"
```

Popular models:
- `runwayml/stable-diffusion-v1-5` (Default)
- `stabilityai/stable-diffusion-2-1`
- `CompVis/stable-diffusion-v1-4`

### Generation Parameters

Customize these in the advanced settings:

- **Width/Height**: Output image dimensions
- **Steps**: More steps = higher quality but slower generation
- **Guidance Scale**: How closely to follow the prompt (1-20)
- **Seed**: Set for reproducible results

## 🎨 Styling

The app uses Tailwind CSS with a beautiful gradient design. Key design elements:

- Purple to indigo gradient background
- Glass morphism effects with backdrop blur
- Responsive grid layouts
- Smooth animations and transitions
- Dark theme optimized for image viewing

## 📝 Development

### Adding New Features

1. **New AI Providers**: Add to `app/api/generate-image/route.js`
2. **UI Components**: Add to `components/` directory
3. **Styling**: Modify Tailwind classes or `app/globals.css`

### Environment Variables

Required for production:
- `HUGGINGFACE_API_KEY` or `REPLICATE_API_TOKEN`

Optional:
- `NEXT_PUBLIC_APP_URL` for absolute URLs

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### Other Platforms

- **Netlify**: Configure build command `npm run build`
- **Railway**: Auto-deploys from GitHub
- **Docker**: Use included configuration

## 🔍 Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Check your `.env.local` file
   - Ensure the key is valid and has correct permissions

2. **"Failed to generate image"**
   - Check API service status
   - Verify your account has credits (for paid services)
   - Try a simpler prompt

3. **Slow generation**
   - Reduce image dimensions
   - Lower the steps count
   - Try different time of day (less API load)

### Debug Mode

Set `NODE_ENV=development` to see detailed error logs in the console.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Stability AI](https://stability.ai/) for Stable Diffusion
- [Hugging Face](https://huggingface.co/) for their amazing AI infrastructure
- [Replicate](https://replicate.com/) for easy AI model deployment
- [Next.js](https://nextjs.org/) team for the incredible framework
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling system

## 📚 Learn More

- [Stable Diffusion Guide](https://huggingface.co/docs/diffusers/using-diffusers/conditional_image_generation)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prompt Engineering Tips](https://prompthero.com/stable-diffusion-prompt-guide)

---

Made with ❤️ and AI magic ✨
