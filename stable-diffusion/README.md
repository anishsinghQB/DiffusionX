# 🎨 DiffusionX - AI Image Generator

A full-stack Next.js application that generates stunning images using AI-powered Stable Diffusion technology through OpenAI-compatible APIs. Simply enter a text prompt and watch AI create beautiful artwork for you!

![AI Creative Studio](https://img.shields.io/badge/AI-Stable%20Diffusion-purple)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![Nix](https://img.shields.io/badge/Nix-Flakes-blue)

## ✨ Features

- **🎨 AI Image Generation**: Generate stunning images from text prompts using Stable Diffusion
- **🎛️ Advanced Controls**: Customize image dimensions, generation steps, guidance scale, and more
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **📊 Generation History**: Keep track of your recent generations and reuse prompts
- **⬇️ Download Images**: Save your generated artwork locally
- **🎯 Negative Prompts**: Specify what you don't want in your images
- **🎵 Voice Recording**: Bonus audio recording functionality
- **⚡ OpenAI-Compatible APIs**: Support for Hugging Face and Replicate APIs
- **📦 Nix Flakes Support**: Reproducible builds and deployments with Nix
- **🐧 NixOS Module**: Easy deployment on NixOS systems
- **🔧 Zero Configuration**: Fallback mode works without API keys

## 🚀 Quick Start

### Option 1: Using Nix Flakes (Recommended)

If you have Nix with flakes enabled:

```bash
# Clone the repository
git clone https://github.com/anishsinghQB/DiffusionX.git
cd DiffusionX/stable-diffusion

# Run directly with nix (will build and start the app)
nix run

# Or build and install
nix build
./result/bin/stable-diffusion-image-generator
```

**Configure API keys**: Create a `.env.local` file or set environment variables:
```bash
export HUGGINGFACE_API_KEY="your_api_key_here"
# or
export REPLICATE_API_TOKEN="your_api_token_here"
```

### Option 2: Traditional Node.js Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anishsinghQB/DiffusionX.git
   cd DiffusionX/stable-diffusion
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

## 📦 NixOS Deployment

### Using the NixOS Module

Add to your NixOS configuration:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    diffusionx.url = "github:anishsinghQB/DiffusionX?dir=stable-diffusion";
  };

  outputs = { self, nixpkgs, diffusionx, ... }: {
    nixosConfigurations.your-host = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        diffusionx.nixosModules.default
        {
          services.stable-diffusion-app = {
            enable = true;
            port = 3000;
            hostname = "0.0.0.0";
            # Optional: Add your API keys here or use environment variables
            huggingfaceApiKey = "your_huggingface_api_key";
            # replicateApiToken = "your_replicate_api_token";
          };
        }
      ];
    };
  };
}
```

### Direct Flake Usage

```bash
# Add to your system flake inputs
inputs.diffusionx.url = "github:anishsinghQB/DiffusionX?dir=stable-diffusion";

# Then in your modules:
imports = [ diffusionx.nixosModules.default ];
```

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
stable-diffusion/
├── app/
│   ├── api/
│   │   └── generate-image/
│   │       └── route.js          # AI image generation API
│   ├── globals.css               # Global styles
│   ├── layout.jsx               # Root layout
│   └── page.jsx                 # Main page component
├── nix/
│   ├── package.nix              # Nix package definition
│   └── nixos-module.nix         # NixOS service module
├── public/                      # Static assets
├── flake.nix                    # Nix flake configuration
├── package.json                 # Node.js dependencies
└── README.md
```

## 🔧 Nix Development

### Development Shell

```bash
# Enter development environment with all dependencies
nix develop

# Build the package
nix build

# Run the application
nix run
```

### Package Details

The Nix package (`nix/package.nix`) creates:
- **Binary**: `stable-diffusion-image-generator` 
- **Service**: Systemd service for NixOS
- **Cache**: Automatic Next.js cache management
- **Dependencies**: All Node.js dependencies included

### Available Nix Outputs

- `nix run` - Run the application directly
- `nix build .#dockerImage` - Build Docker container
- `nix develop` - Enter development shell
- `nix build .#stable-diffusion-app` - Build just the app package

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

### NixOS (Recommended)

Use the provided NixOS module for production deployments:

```nix
services.stable-diffusion-app = {
  enable = true;
  port = 8080;
  hostname = "127.0.0.1";  # Internal only
  openFirewall = false;    # Use reverse proxy
  huggingfaceApiKey = config.age.secrets.huggingface-api-key.path;
};
```

### Docker with Nix

```bash
# Build Docker image with Nix
nix build .#dockerImage
docker load < result

# Run container
docker run -p 3000:3000 -e HUGGINGFACE_API_KEY=your_key stable-diffusion-app
```

### Traditional Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### Other Platforms

- **Netlify**: Configure build command `npm run build`
- **Railway**: Auto-deploys from GitHub  
- **Fly.io**: Use `flyctl` for deployment
- **NixOS**: Use the provided flake and module

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

4. **Nix build failures**
   - Ensure you have Nix with flakes enabled
   - Run `nix flake update` to update inputs
   - Check that `package-lock.json` is present

5. **NixOS service not starting**
   - Check `journalctl -u stable-diffusion-app`
   - Verify API keys are properly set
   - Ensure port is not already in use

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

- [Stability AI](https://stability.ai/) for Stable Diffusion technology
- [Hugging Face](https://huggingface.co/) for their amazing AI infrastructure and free tier
- [Replicate](https://replicate.com/) for easy AI model deployment
- [Next.js](https://nextjs.org/) team for the incredible React framework
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling system
- [NixOS](https://nixos.org/) community for reproducible builds and deployments
- [OpenAI](https://openai.com/) for pioneering API-compatible AI services

## 📚 Learn More

- [Stable Diffusion Guide](https://huggingface.co/docs/diffusers/using-diffusers/conditional_image_generation)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prompt Engineering Tips](https://prompthero.com/stable-diffusion-prompt-guide)

---

Made with ❤️ and AI magic ✨
