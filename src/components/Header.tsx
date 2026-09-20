import React from 'react';
import { ShieldCheck, BookOpen } from 'lucide-react';

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToSection }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Title and Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-emerald-300">
                HMAC Algorithm Visualizer
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                RFC 2104
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive visualization of Hash-based Message Authentication Code
            </p>
          </div>
        </div>

        {/* Fast Navigation Quick Links */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onScrollToSection('input-section')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            Inputs
          </button>
          <button
            onClick={() => onScrollToSection('diagram-section')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            Flowchart
          </button>
          <button
            onClick={() => onScrollToSection('tamper-section')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            Tamper Lab
          </button>
          <button
            onClick={() => onScrollToSection('concepts-section')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 transition-colors cursor-pointer font-medium"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Concepts</span>
          </button>
        </div>
      </div>
    </header>
  );
};
