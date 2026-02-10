import React, { useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { fetchDigitalInsight } from "../geminiService";

interface BusinessEcosystemProps {
  scrollProgress?: number;
  hideHeaderFooter?: boolean;
  onSelectOverlay?: (name: string) => void;
}

const BusinessEcosystem: React.FC<BusinessEcosystemProps> = ({
  scrollProgress = 0,
  hideHeaderFooter = false,
  onSelectOverlay,
}) => {
  const [assistantMessage, setAssistantMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrbClick = async () => {
    if (loading) return;
    setLoading(true);
    setAssistantMessage("Analyzing ecosystem alignment...");
    try {
      const insight = await fetchDigitalInsight();
      setAssistantMessage(`${insight.title}: ${insight.content}`);
    } catch (e) {
      setAssistantMessage("Neural link check failed.");
    } finally {
      setLoading(false);
    }
  };

  const entranceProgress = Math.min(
    Math.max((scrollProgress - 0.45) / 0.15, 0),
    1
  );
  const exitProgress = Math.min(Math.max((scrollProgress - 0.7) / 0.15, 0), 1);
  const localActiveProgress = entranceProgress * (1 - exitProgress);

  const containerScale = 0.98 + localActiveProgress * 0.02;
  const containerBlur = Math.pow(1 - localActiveProgress, 2) * 15;
  const xOffset = (1 - entranceProgress) * -40 + exitProgress * 40;
  const yOffset = (1 - entranceProgress) * 10 + exitProgress * -20;

  const handleItemClick = (title: string) => {
    if (onSelectOverlay) {
      onSelectOverlay(title);
    }
  };

  return (
    <div
      style={{
        transform: `scale(${containerScale}) translateY(${yOffset}px) translateZ(0)`,
        filter: `blur(${containerBlur}px)`,
        opacity: localActiveProgress,
      }}
      className="absolute inset-0 w-full h-full flex flex-col justify-center p-8 md:p-12 pointer-events-auto transition-all duration-300 ease-out will-change-transform"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
        <div
          style={{ transform: `translateX(${xOffset}px)` }}
          className="flex flex-col items-start transition-transform duration-300 ease-out"
        >
          <div className="w-full">
            <h2 className="text-4xl md:text-7xl font-tech text-white mb-10 tracking-tighter leading-[0.9] uppercase">
              Business <br />
              <span className="text-blue-500">Ecosystem</span>
            </h2>
            <div className="space-y-6 text-lg md:text-2xl text-gray-300 font-light leading-relaxed max-w-xl text-left">
              <p className="p-0 m-0">
                A{" "}
                <span className="font-semibold text-white">
                  unified intelligence layer
                </span>{" "}
                mapping your organization's position within its market context.
              </p>
              <div className="pt-2">
                <p className="text-base md:text-lg text-gray-400 leading-relaxed p-0 m-0">
                  Synchronizing the{" "}
                  <span
                    className="text-white cursor-pointer hover:text-blue-400 transition-colors underline decoration-blue-500/30 underline-offset-4"
                    onClick={() => handleItemClick("Operating Environment")}
                  >
                    Operating Environment
                  </span>
                  ,{" "}
                  <span
                    className="text-white cursor-pointer hover:text-blue-400 transition-colors underline decoration-blue-500/30 underline-offset-4"
                    onClick={() => handleItemClick("Operating Model")}
                  >
                    Operating Model
                  </span>
                  , and{" "}
                  <span
                    className="text-white cursor-pointer hover:text-blue-400 transition-colors underline decoration-blue-500/30 underline-offset-4"
                    onClick={() => handleItemClick("Strategic Landscape")}
                  >
                    Strategic Landscape
                  </span>
                  .
                  <span className="text-blue-500 font-bold ml-3 cursor-pointer hover:text-blue-400 transition-colors uppercase">
                    WHY IS THAT IMPORTANT?
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 md:text-right flex flex-col items-end">
          {[
            {
              id: "01",
              title: "Operating Environment",
              desc: "External market forces & trends",
            },
            {
              id: "02",
              title: "Operating Model",
              desc: "Internal capacity & capabilities",
            },
            {
              id: "03",
              title: "Strategic Landscape",
              desc: "Value domains & outcomes",
            },
          ].map((item, idx) => (
            <div
              key={item.id}
              style={{
                transform: `translateX(${-xOffset * 0.5 + idx * 5}px)`,
                opacity: entranceProgress,
              }}
              className={`group space-y-1 transition-all duration-500 max-w-md cursor-pointer`}
              onClick={() => handleItemClick(item.title)}
            >
              <span className="text-blue-500 font-tech text-xs tracking-[0.5em]">
                {item.id}
              </span>
              <h3 className="text-2xl md:text-4xl font-tech text-white group-hover:text-blue-400 transition-colors leading-tight uppercase">
                {item.title}
              </h3>
              <p className="text-gray-500 text-base md:text-lg group-hover:text-gray-300 transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 flex justify-between w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] items-end">
        <a
          href="https://www.gravityone.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-gray-500 font-bold tracking-[0.3em] uppercase hover:text-blue-500 transition-colors pointer-events-auto"
        >
          powered by GravityONE
        </a>

        <div className="flex flex-col items-end gap-2 relative pointer-events-auto">
          {assistantMessage && (
            <div className="bg-zinc-900/95 backdrop-blur-xl text-zinc-300 text-sm p-4 rounded-2xl rounded-br-none max-w-xs shadow-2xl relative animate-float border border-zinc-700/50 leading-relaxed mb-2">
              {assistantMessage}
              <div className="absolute -bottom-2 right-0 w-3 h-3 bg-zinc-900 border-r border-b border-zinc-700/50 transform skew-x-12" />
            </div>
          )}
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
  );
};

export default BusinessEcosystem;
