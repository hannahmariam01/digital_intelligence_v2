import React, { useState } from "react";
import { generateImage } from "../geminiService";
import {
  Sparkles,
  Image as ImageIcon,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImage(null);

    try {
      const result = await generateImage(prompt);
      setImage(result);
    } catch (err) {
      setError(
        "Failed to generate image. Please try again with a different prompt."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-purple-500" />
            Image Generation
          </h1>
          <p className="text-slate-400 text-lg">
            Create stunning visuals using the Gemini Flash Image model.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">
                Describe your imagination
              </label>
              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city with flying cars at sunset, cyberpunk style..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none h-32"
                />
                <div className="absolute bottom-4 right-4">
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {image && (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative group rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950/50 aspect-square md:aspect-video flex items-center justify-center">
                <img
                  src={image}
                  alt={prompt}
                  className="max-w-full max-h-full object-contain"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={image}
                    download={`gemini-generated-${Date.now()}.png`}
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </a>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-500 px-1">
                <span>Generated with Gemini 2.5 Flash</span>
                <span>1024 x 1024</span>
              </div>
            </div>
          )}

          {!image && !isLoading && !error && (
            <div className="mt-12 flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 space-y-4">
              <div className="p-4 bg-slate-900 rounded-full">
                <ImageIcon className="w-8 h-8 opacity-50" />
              </div>
              <p>Your generated masterpiece will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageView;
