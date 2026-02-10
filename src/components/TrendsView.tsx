import React, { useState } from "react";
import { ArrowLeft, Bell, Filter, Star, Binoculars } from "lucide-react";
import { fetchDigitalInsight } from "../geminiService";

interface TrendsViewProps {
  onBack: () => void;
}

const HexagonNode: React.FC<{
  title: string;
  count: string;
  score?: string;
  glowColor: string;
  style?: React.CSSProperties;
}> = ({ title, count, score, glowColor, style }) => (
  <div
    style={style}
    className="absolute w-36 h-48 md:w-44 md:h-56 flex flex-col items-center group transition-transform duration-500 hover:z-20"
  >
    <div className="flex items-center gap-1 mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
      <span className="text-sm md:text-base font-tech text-white tracking-tighter">
        {score || "0"}
      </span>
    </div>

    <div className="relative w-full aspect-[100/115] transition-transform duration-500 group-hover:scale-105">
      <div
        className={`absolute inset-4 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${glowColor}`}
      />
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
      >
        <defs>
          <linearGradient
            id={`grad-${title}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "rgba(255,255,255,0.08)", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255,255,255,0.02)", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d="M50 0 L100 28.8 L100 86.2 L50 115 L0 86.2 L0 28.8 Z"
          fill={`url(#grad-${title})`}
          className="backdrop-blur-sm"
        />
        <path
          d="M50 2 L98 30 L98 85 L50 113 L2 85 L2 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className={`opacity-30 group-hover:opacity-100 transition-opacity duration-500 ${glowColor.replace(
            "bg-",
            "text-"
          )}`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 z-10">
        <h4 className="text-[9px] md:text-xs font-tech font-bold text-white tracking-[0.12em] uppercase leading-tight mb-1">
          {title}
        </h4>
        <p className="text-[8px] text-cyan-400/60 uppercase tracking-widest font-medium group-hover:text-cyan-400 transition-colors">
          {count} Trends
        </p>
      </div>
    </div>
  </div>
);

const TrendsView: React.FC<TrendsViewProps> = ({ onBack }) => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const timelineLabels = ["All", "Short Term", "Medium Term", "Long Term"];

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
    <div className="relative w-full h-screen bg-[#020c14] flex flex-col font-sans animate-in fade-in duration-700 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,132,255,0.08)_0%,_transparent_70%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="flex justify-between items-center px-10 py-6 relative z-20 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full text-cyan-500/60 hover:text-cyan-400 bg-white/5 border border-white/5 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium text-white tracking-tight uppercase">
              Operating Environment
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Binoculars className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-[10px] text-cyan-400/60 font-tech tracking-widest uppercase">
                Trends
              </p>
            </div>
          </div>
        </div>
        <button className="p-3 text-cyan-500/40 hover:text-white transition-colors bg-white/5 rounded-full border border-white/5">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between px-10 pb-6 relative z-10 overflow-hidden">
        <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mt-2 shrink-0">
          {[
            { label: "Total Trends", value: "34" },
            { label: "Categories", value: "09" },
            { label: "Subcategories", value: "16" },
          ].map((card, i) => (
            <div
              key={i}
              className="relative group overflow-hidden bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center transition-all hover:bg-white/10 hover:border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-3xl font-tech font-bold text-white mb-1">
                {card.value}
              </p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-400/60 font-bold group-hover:text-cyan-400 transition-colors">
                {card.label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-5xl flex-1 mt-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-h-[400px]">
              <HexagonNode
                title="Technological"
                count="5"
                score="62.5"
                glowColor="bg-cyan-500"
                style={{ left: "0%", top: "0%" }}
              />
              <HexagonNode
                title="Environmental"
                count="3"
                score="29"
                glowColor="bg-emerald-500"
                style={{ left: "21%", top: "0%" }}
              />
              <HexagonNode
                title="Political"
                count="4"
                score="0"
                glowColor="bg-slate-500"
                style={{ left: "42%", top: "0%" }}
              />
              <HexagonNode
                title="Social"
                count="4"
                score="21"
                glowColor="bg-purple-500"
                style={{ left: "63%", top: "0%" }}
              />
              <HexagonNode
                title="Economic"
                count="5"
                score="16.5"
                glowColor="bg-blue-500"
                style={{ left: "84%", top: "0%" }}
              />
              <HexagonNode
                title="Legal"
                count="2"
                score="0"
                glowColor="bg-indigo-500"
                style={{ left: "10.5%", top: "40%" }}
              />
              <HexagonNode
                title="Ethical"
                count="2"
                score="0"
                glowColor="bg-violet-500"
                style={{ left: "31.5%", top: "40%" }}
              />
              <HexagonNode
                title="Strategic"
                count="4"
                score="0"
                glowColor="bg-teal-500"
                style={{ left: "52.5%", top: "40%" }}
              />
              <HexagonNode
                title="Financial"
                count="5"
                score="0"
                glowColor="bg-cyan-500"
                style={{ left: "73.5%", top: "40%" }}
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-sm flex items-center gap-10 shrink-0">
          <div className="flex-1 relative pt-3">
            <span className="absolute -top-4 left-0 text-[8px] uppercase tracking-[0.3em] text-cyan-400/40 font-bold">
              View impact for:
            </span>
            <div className="relative w-full h-0.5 bg-white/10 flex justify-between items-center px-1">
              <div
                className="absolute top-0 left-0 h-full bg-cyan-400/30 transition-all duration-300"
                style={{
                  width: `${
                    (sliderIndex / (timelineLabels.length - 1)) * 100
                  }%`,
                }}
              />
              {timelineLabels.map((label, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-center cursor-pointer group/marker"
                  onClick={() => setSliderIndex(idx)}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                      sliderIndex === idx
                        ? "bg-cyan-400 border-white scale-125 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        : "bg-slate-900 border-white/20 group-hover/marker:border-cyan-500"
                    }`}
                  />
                  <span
                    className={`absolute top-6 whitespace-nowrap text-[9px] font-tech tracking-widest uppercase transition-colors duration-300 ${
                      sliderIndex === idx
                        ? "text-white font-bold"
                        : "text-cyan-900"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2.5 px-6 py-2.5 bg-cyan-400/10 border border-cyan-400/20 rounded-xl text-cyan-400 text-[10px] font-tech tracking-widest hover:bg-cyan-400/20 transition-all active:scale-95 shadow-lg">
            <Filter className="w-3.5 h-3.5" />
            FILTER
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {assistantMessage && (
          <div className="bg-zinc-900/90 backdrop-blur-xl text-zinc-300 text-sm p-4 rounded-2xl rounded-br-none max-w-xs shadow-2xl animate-float border border-zinc-700/50 relative">
            {assistantMessage}
            <div className="absolute -bottom-2 right-0 w-3 h-3 bg-zinc-900/90 border-r border-b border-zinc-700/50 transform skew-x-12" />
          </div>
        )}
        <button
          onClick={handleOrbClick}
          className={`w-20 h-20 rounded-full relative group transition-transform hover:scale-110 active:scale-95 flex items-center justify-center ${
            loading ? "cursor-wait" : "cursor-pointer"
          }`}
        >
          <div className="absolute inset-[-10px] bg-cyan-500/20 rounded-full blur-xl opacity-60 animate-pulse transition-opacity duration-1000"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border border-white/20 shadow-xl">
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
  );
};

export default TrendsView;
