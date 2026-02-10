import React, { useState } from "react";
import { fetchDigitalInsight } from "../geminiService";
import { Bell, Sparkles, Menu } from "lucide-react";

interface UIOverlayProps {
  scrollProgress?: number;
  hideHeaderFooter?: boolean;
  isModalOpen?: boolean;
  setIsModalOpen?: (value: boolean) => void;
  setIsConstraintModalOpen?: (value: boolean) => void;
  setIsBlindSpotsModalOpen?: (value: boolean) => void;
  onGoToDashboard?: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  scrollProgress = 0,
  isModalOpen: isModalOpenProp,
  setIsModalOpen: setIsModalOpenProp,
  setIsConstraintModalOpen,
  setIsBlindSpotsModalOpen,
  onGoToDashboard,
}) => {
  // Use parent state if provided, otherwise use local state as fallback
  const [localModalOpen, setLocalModalOpen] = useState(false);
  const isModalOpen = isModalOpenProp ?? localModalOpen;
  const setIsModalOpen = setIsModalOpenProp ?? setLocalModalOpen;

  const [assistantMessage, setAssistantMessage] = useState(
    "I can help you understand the pulse of your organization and more..."
  );
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

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConstraintClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setIsConstraintModalOpen) {
      setIsConstraintModalOpen(true);
    }
  };

  const handleBlindSpotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setIsBlindSpotsModalOpen) {
      setIsBlindSpotsModalOpen(true);
    }
  };

  // localExit tracks the departure from the first layer (0.0 to 1.0)
  const localExit = Math.min(Math.max(scrollProgress / 0.35, 0), 1);
  const titleScale = 1 + Math.pow(localExit * 3.5, 3);
  const titleBlur = localExit * 50;

  // Exponential dispersion for the cards
  const cardExitX = Math.pow(localExit * 2.2, 2.5) * 500;
  const cardExitY = Math.pow(localExit * 2.2, 2.5) * 250;

  // Smoother dispersion for the connecting lines and nodes
  const lineDispersionX = Math.pow(localExit * 1.8, 2) * 60;
  const lineDispersionY = Math.pow(localExit * 1.8, 2) * 40;

  const headerExitY = Math.pow(localExit * 2, 1.5) * -150;
  const footerExitY = Math.pow(localExit * 2, 1.5) * 150;

  return (
    <>
      <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-8 md:p-12 pointer-events-none text-white overflow-hidden selection:bg-blue-500/30">
        {/* DYNAMIC CONNECTING LINES LAYER */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-100"
        >
          <defs>
            <filter
              id="node-glow-blue-v5"
              x="-300%"
              y="-300%"
              width="700%"
              height="700%"
            >
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="node-glow-red-v5"
              x="-300%"
              y="-300%"
              width="700%"
              height="700%"
            >
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lines and Nodes - Restored red accent for the top right path */}
          <g
            style={{
              transform: `translate(${-lineDispersionX}px, ${-lineDispersionY}px)`,
              opacity: 1 - localExit * 2.5,
            }}
            className="will-change-transform"
          >
            <path
              d="M 21 26 L 34 32"
              fill="none"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="0.06"
              className="drop-shadow-[0_0_1px_rgba(59,130,246,0.3)]"
            />
            <circle
              cx="34"
              cy="32"
              r="0.35"
              fill="#3b82f6"
              filter="url(#node-glow-blue-v5)"
              className="animate-pulse"
            />
          </g>

          <g
            style={{
              transform: `translate(${lineDispersionX}px, ${-lineDispersionY}px)`,
              opacity: 1 - localExit * 2.5,
            }}
            className="will-change-transform"
          >
            <path
              d="M 79 26 L 66 32"
              fill="none"
              stroke="rgba(239, 68, 68, 0.4)"
              strokeWidth="0.06"
              className="drop-shadow-[0_0_1px_rgba(239,68,68,0.3)]"
            />
            <circle
              cx="66"
              cy="32"
              r="0.35"
              fill="#ef4444"
              filter="url(#node-glow-red-v5)"
              className="animate-pulse"
            />
          </g>

          <g
            style={{
              transform: `translate(${-lineDispersionX}px, ${lineDispersionY}px)`,
              opacity: 1 - localExit * 2.5,
            }}
            className="will-change-transform"
          >
            <path
              d="M 22 78 L 34 68"
              fill="none"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="0.06"
              className="drop-shadow-[0_0_1px_rgba(59,130,246,0.3)]"
            />
            <circle
              cx="34"
              cy="68"
              r="0.35"
              fill="#3b82f6"
              filter="url(#node-glow-blue-v5)"
              className="animate-pulse"
            />
          </g>
        </svg>

        {/* HEADER */}
        <div
          style={{
            transform: `translateY(${headerExitY}px)`,
            opacity: 1 - localExit * 2,
            filter: `blur(${localExit * 10}px)`,
          }}
          className="flex justify-between items-start pointer-events-auto transition-all duration-1000 ease-out z-10"
        >
          <div className="cursor-pointer group" onClick={onGoToDashboard}>
            <h1 className="text-3xl font-medium text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">
              DOH AUSTRALIA
            </h1>
            <p className="text-lg text-gray-400 font-normal mt-0.5 font-sans group-hover:text-gray-200 transition-colors">
              Experience Gateway
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button className="flex items-center gap-2 bg-gray-950/80 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-white/10 hover:bg-gray-800 transition-colors">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200 font-medium">Org Summary</span>
            </button>
          </div>
        </div>

        {/* GLASS TITLE SECTION */}
        <div
          style={{
            transform: `scale(${titleScale})`,
            filter: `blur(${titleBlur}px)`,
            opacity: 1 - localExit * 2,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 transition-all duration-75"
        >
          <div className="relative group flex flex-col items-center">
            {/* Ambient Background Glow for the Glass Text */}
            <div className="absolute inset-[-40px] bg-blue-500/10 rounded-full blur-[80px] opacity-50 transition-opacity duration-1000"></div>

            <h2 className="text-5xl md:text-8xl font-tech uppercase select-none text-center px-4 flex flex-col items-center gap-2 relative z-10">
              {/* Top Word: DIGITAL */}
              <span className="relative tracking-[0.2em] pl-[0.2em] inline-block py-2">
                <span className="bg-gradient-to-b from-white via-white/40 to-white/10 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)]">
                  Digital
                </span>
              </span>

              {/* Bottom Word: INTELLIGENCE */}
              <span className="relative tracking-[0.25em] pl-[0.25em] inline-block py-2">
                <span className="bg-gradient-to-b from-white via-white/50 to-white/5 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(59,130,246,0.4)]">
                  Intelligence
                </span>
              </span>
            </h2>
          </div>
        </div>

        {/* Strategic Alignment & Drift Card */}
        <div
          style={{
            transform: `translateX(${-cardExitX}px) translateY(${-cardExitY}px)`,
            opacity: 1 - localExit * 4,
            zIndex: 50,
          }}
          className="absolute top-[18%] left-[2%] md:left-[5%] w-80 bg-slate-950/90 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/10 border-l-4 border-l-blue-500 transition-all hover:bg-slate-900 cursor-pointer active:scale-95 group pointer-events-auto"
          onClick={handleCardClick}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Strategic Alignment & Drift
            </h3>
            <Sparkles className="w-4 h-4 text-blue-500/50 group-hover:text-blue-400" />
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            <span className="text-white font-bold">82%</span> of Initiatives
            Aligned to Enterprise Priorities —{" "}
            <span className="text-blue-400">2 Strategic Domains</span> Showing
            Drift
          </p>
        </div>

        {/* Intelligence & Decision Blind Spots - Reverted Card Theme to RED */}
        <div
          style={{
            transform: `translateX(${cardExitX}px) translateY(${-cardExitY}px)`,
            opacity: 1 - localExit * 4,
            zIndex: 50,
          }}
          className="absolute top-[18%] right-[2%] md:right-[5%] w-80 bg-slate-950/90 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/10 border-r-4 border-r-red-500 pointer-events-auto text-right transition-all group hover:bg-slate-900 hover:border-r-red-400 cursor-pointer active:scale-95 z-10"
          onClick={handleBlindSpotsClick}
        >
          <div className="flex items-center justify-between mb-3 flex-row-reverse">
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
              Intelligence & Decision Blind Spots
            </h3>
            <Sparkles className="w-4 h-4 text-red-500/50 group-hover:text-red-400" />
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            <span className="text-red-500 font-bold">35%</span> of Strategic
            Decisions Made with Limited or Delayed Intelligence
          </p>
        </div>

        {/* Execution Constraints */}
        <div
          style={{
            transform: `translateX(${-cardExitX}px) translateY(${cardExitY}px)`,
            opacity: 1 - localExit * 4,
            zIndex: 50,
          }}
          className="absolute bottom-[15%] left-[2%] md:left-[7%] w-80 bg-slate-950/90 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/10 border-l-4 border-l-blue-500 pointer-events-auto transition-all group hover:bg-slate-900 cursor-pointer active:scale-95 z-10"
          onClick={handleConstraintClick}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Execution Constraints
            </h3>
            <Sparkles className="w-4 h-4 text-blue-500/50 group-hover:text-blue-400" />
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            <span className="text-white font-bold">
              3 Critical Capabilities
            </span>{" "}
            at Capacity — <span className="text-blue-400 font-bold">41%</span>{" "}
            of Enterprise Initiatives Depend on Them
          </p>
        </div>

        {/* FOOTER */}
        <div
          style={{
            transform: `translateY(${footerExitY}px)`,
            opacity: 1 - localExit * 2,
            filter: `blur(${localExit * 10}px)`,
          }}
          className="flex justify-between items-end pointer-events-auto transition-all duration-1000 ease-out z-10"
        >
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <a
              href="https://www.gravityone.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase hover:text-blue-500 transition-colors pointer-events-auto"
            >
              powered by GravityONE
            </a>
          </div>
          <div className="flex flex-col items-end gap-2 relative">
            <div className="bg-zinc-900/90 backdrop-blur-xl text-zinc-300 text-base p-5 rounded-2xl rounded-br-none max-w-sm shadow-2xl relative animate-float border border-zinc-700/50">
              {assistantMessage}
              <div className="absolute -bottom-2 right-0 w-4 h-4 bg-zinc-900/90 border-r border-b border-zinc-700/50 transform skew-x-12" />
            </div>

            <button
              onClick={handleOrbClick}
              className={`w-20 h-20 rounded-full relative group transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                loading ? "cursor-wait" : "cursor-pointer"
              }`}
            >
              <div className="absolute inset-[-10px] bg-blue-500/20 rounded-full blur-2xl opacity-60 group-hover:opacity-90 animate-pulse transition-opacity duration-1000"></div>

              <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/20 group-hover:border-white/40">
                <img
                  src="https://raw.githubusercontent.com/hannahmariam01/images/main/ai-assistant%20(1).gif"
                  alt="Assistant Orb"
                  className={`w-full h-full object-cover select-none ${
                    loading ? "animate-pulse opacity-80" : "animate-none"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIOverlay;
