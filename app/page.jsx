import ImageGenerator from "../components/image-generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-4">� AI Creative Studio</h1>
          <p className="text-xl opacity-90">
            Generate stunning images with AI-powered creativity!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
          <div className="w-full md:w-1/2 mx-auto">
            <ImageGenerator />
          </div>
        </div>
      </div>
    </main>
  );
}
