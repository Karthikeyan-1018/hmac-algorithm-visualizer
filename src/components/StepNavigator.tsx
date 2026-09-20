import React, { useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, ListFilter, Sliders } from 'lucide-react';

interface StepNavigatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showAllSteps: boolean;
  onToggleShowAll: () => void;
  animationSpeedMs: number;
  onSpeedChange: (speed: number) => void;
}

export const STEP_NAMES = [
  { step: 1, name: 'Input', subtitle: 'Key & Message' },
  { step: 2, name: 'Normalize Key', subtitle: 'Pad to Block Size' },
  { step: 3, name: 'ipad / opad', subtitle: 'Generate Constants' },
  { step: 4, name: 'XOR Operations', subtitle: 'K′ ⊕ ipad & K′ ⊕ opad' },
  { step: 5, name: 'Inner Hash', subtitle: 'H(Kᵢ ∥ Message)' },
  { step: 6, name: 'Outer Hash', subtitle: 'H(Kₒ ∥ InnerHash)' },
  { step: 7, name: 'Final HMAC', subtitle: 'Verified Output' },
];

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  currentStep,
  totalSteps = 7,
  onStepChange,
  isPlaying,
  onTogglePlay,
  showAllSteps,
  onToggleShowAll,
  animationSpeedMs,
  onSpeedChange,
}) => {
  // Handle animation timer loop
  useEffect(() => {
    let timer: number | undefined;
    if (isPlaying && !showAllSteps) {
      timer = window.setInterval(() => {
        onStepChange(currentStep >= totalSteps ? 1 : currentStep + 1);
      }, animationSpeedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentStep, totalSteps, animationSpeedMs, showAllSteps, onStepChange]);

  const handlePrev = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 backdrop-blur-md shadow-xl">
      {/* Control Buttons & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Step Counter & Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStep <= 1 || showAllSteps}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="font-mono text-xs text-slate-300 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            Step <strong className="text-cyan-400">{currentStep}</strong> / {totalSteps}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStep >= totalSteps || showAllSteps}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold border border-cyan-400 shadow-md shadow-cyan-600/20 disabled:opacity-40 disabled:pointer-events-none transition-all text-xs"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Animation and View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Animation Play/Pause */}
          <button
            onClick={onTogglePlay}
            disabled={showAllSteps}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            } disabled:opacity-40 disabled:pointer-events-none`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px]">
            <Sliders className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500 mr-1">Speed:</span>
            {[
              { label: 'Slow', ms: 3500 },
              { label: 'Normal', ms: 2200 },
              { label: 'Fast', ms: 1200 },
            ].map((s) => (
              <button
                key={s.ms}
                onClick={() => onSpeedChange(s.ms)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  animationSpeedMs === s.ms
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Show All Steps Toggle */}
          <button
            onClick={onToggleShowAll}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showAllSteps
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{showAllSteps ? 'Focus Single Step' : 'Show All Steps'}</span>
          </button>
        </div>
      </div>

      {/* Progress Track & Connected Step Pills */}
      <div className="mt-4 pt-2 overflow-x-auto">
        <div className="min-w-[650px] relative flex items-center justify-between pb-2">
          {/* Background Connecting Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />

          {/* Active Progress Bar fill */}
          {!showAllSteps && (
            <div
              className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-400 -z-0 transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
              }}
            />
          )}

          {/* Step Nodes */}
          {STEP_NAMES.map((item) => {
            const isCurrent = currentStep === item.step && !showAllSteps;
            const isCompleted = currentStep > item.step && !showAllSteps;

            let pillStyle =
              'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200';
            if (isCurrent) {
              pillStyle =
                'border-cyan-400 bg-cyan-950 text-cyan-200 ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30 font-bold scale-105';
            } else if (isCompleted) {
              pillStyle = 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
            } else if (showAllSteps) {
              pillStyle = 'border-slate-700 bg-slate-900 text-slate-300';
            }

            return (
              <button
                key={item.step}
                onClick={() => onStepChange(item.step)}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                {/* Numbered Circle Badge */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 ${pillStyle}`}
                >
                  {item.step}
                </div>

                {/* Step Title */}
                <span
                  className={`text-[11px] font-semibold mt-1.5 transition-colors whitespace-nowrap ${
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-emerald-400/90' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.name}
                </span>

                {/* Subtitle */}
                <span className="text-[9px] text-slate-500 hidden sm:block">
                  {item.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
