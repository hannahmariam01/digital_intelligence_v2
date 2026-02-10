import React from "react";
import { View } from "../types";
import {
  MessageSquare,
  Image as ImageIcon,
  Mic,
  LayoutGrid,
} from "lucide-react";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: View.CHAT, label: "Chat", icon: MessageSquare },
    { view: View.IMAGE, label: "Image Gen", icon: ImageIcon },
    { view: View.LIVE, label: "Live Voice", icon: Mic },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <LayoutGrid className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl text-slate-100 hidden md:block tracking-tight">
          Gemini Omni
        </span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-lg shadow-blue-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-blue-400" : "group-hover:text-slate-200"
                }`}
              />
              <span className="hidden md:block font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 hidden md:block shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 hidden md:block">
          <p className="text-xs text-slate-500 font-medium">Powered by</p>
          <p className="text-sm text-slate-300 font-semibold mt-1">
            Google Gemini API
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
