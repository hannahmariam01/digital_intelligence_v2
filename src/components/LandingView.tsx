import React, { useState } from "react";
import { fetchDigitalInsight } from "../geminiService";
import Globe from "./Globe";
import { ArrowRight, Sparkles } from "lucide-react";

interface LandingViewProps {
  onEnterSandbox: () => void;
  onEnterLive: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({
  onEnterSandbox,
  onEnterLive,
}) => {
  const [assistantMessage, setAssistantMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrbClick = async () => {
    if (loading) return;
    setLoading(true);
    setAssistantMessage("Analyzing enterprise data streams...");

    try {
      const insight = await fetchDigitalInsight();
      setAssistantMessage(`${insight.title}: ${insight.content}`);
    } catch (e) {
      setAssistantMessage("System alignment check failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#030712] relative overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Globe />
      </div>

      <div className="absolute inset-0 z-10 w-full h-full flex flex-col justify-between p-8 md:p-12 pointer-events-none text-white">
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="text-3xl font-medium text-white tracking-tight">
              DOH Australia
            </h1>
            <p className="text-lg text-gray-400 font-normal mt-0.5">
              Experience Gateway
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-800 transition-colors">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200 font-medium">My Priority Hub</span>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h2 className="text-5xl md:text-8xl text-white font-tech uppercase select-none drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] opacity-100 text-center px-4 flex flex-col items-center gap-2">
            <span className="tracking-widest pl-[0.1em]">Digital</span>
            <span className="tracking-widest pl-[0.1em]">Intelligence</span>
          </h2>
        </div>

        <div className="flex justify-between items-end pointer-events-auto relative">
          <div className="flex items-center gap-4">
            <button
              onClick={onEnterSandbox}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium tracking-wide bg-blue-950/30 px-4 py-2 rounded border border-blue-900/50 transition-colors"
            >
              Open Sandbox <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-end gap-2 relative">
            {assistantMessage && (
              <div className="bg-zinc-900/90 backdrop-blur-xl text-zinc-300 text-base p-5 rounded-2xl rounded-br-none max-w-sm shadow-2xl relative animate-float border border-zinc-700/50">
                {assistantMessage}
                <div className="absolute -bottom-2 right-0 w-4 h-4 bg-zinc-900/90 border-r border-b border-zinc-700/50 transform skew-x-12" />
              </div>
            )}

            <button
              onClick={handleOrbClick}
              className={`w-20 h-20 rounded-full relative group transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                loading ? "cursor-wait" : "pointer-events-auto cursor-pointer"
              }`}
            >
              <div className="absolute inset-[-10px] bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10 group-hover:border-white/30 transition-colors">
                <img
                  src="https://raw.githubusercontent.com/hannahmariam01/images/main/ai-assistant%20(1).gif"
                  alt="Assistant Orb"
                  className={`w-full h-full object-cover select-none ${
                    loading
                      ? "animate-pulse scale-95 opacity-80"
                      : "animate-none"
                  }`}
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
