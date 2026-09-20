import React, { useState } from 'react';
import { Binary, Sparkles, HelpCircle } from 'lucide-react';
import { bytesToAsciiSafe } from '../crypto/hmac';

interface XorVisualizerProps {
  kPrimeBytes: Uint8Array;
  ipadBytes: Uint8Array;
  opadBytes: Uint8Array;
  kPrimeXorIpadBytes: Uint8Array;
  kPrimeXorOpadBytes: Uint8Array;
}

export const XorVisualizer: React.FC<XorVisualizerProps> = ({
  kPrimeBytes,
  ipadBytes,
  opadBytes,
  kPrimeXorIpadBytes,
  kPrimeXorOpadBytes,
}) => {
  const [selectedPad, setSelectedPad] = useState<'ipad' | 'opad'>('ipad');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const [showAllBytes, setShowAllBytes] = useState(false);

  const padBytes = selectedPad === 'ipad' ? ipadBytes : opadBytes;
  const resultBytes = selectedPad === 'ipad' ? kPrimeXorIpadBytes : kPrimeXorOpadBytes;
  const padName = selectedPad === 'ipad' ? 'ipad (0x36)' : 'opad (0x5C)';

  // Limit initially displayed bytes to 16 for cleaner overview, expandable to all 64/128
  const maxInitial = 16;
  const totalLength = kPrimeBytes.length;
  const displayLength = showAllBytes ? totalLength : Math.min(totalLength, maxInitial);

  // Inspector calculations for the currently hovered byte
  const activeIdx = hoveredIndex !== null && hoveredIndex < totalLength ? hoveredIndex : 0;
  const byteK = kPrimeBytes[activeIdx] ?? 0;
  const byteP = padBytes[activeIdx] ?? 0;
  const byteR = resultBytes[activeIdx] ?? 0;

  const toBin = (num: number) => num.toString(2).padStart(8, '0');
  const binK = toBin(byteK);
  const binP = toBin(byteP);
  const binR = toBin(byteR);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md shadow-xl">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Binary className="w-4 h-4" />
            </span>
            <h4 className="font-semibold text-slate-100 text-base">
              Interactive Bitwise XOR Inspector
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click or hover on any byte column below to inspect its step-by-step binary XOR operation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedPad('ipad')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPad === 'ipad'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            K′ ⊕ ipad (Inner)
          </button>
          <button
            onClick={() => setSelectedPad('opad')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPad === 'opad'
                ? 'bg-purple-950 text-purple-300 border border-purple-500/30 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            K′ ⊕ opad (Outer)
          </button>
        </div>
      </div>

      {/* Main Byte Grid Visualization */}
      <div className="my-5 overflow-x-auto pb-2">
        <div className="min-w-max space-y-2">
          {/* Column Indices */}
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center">
            <div className="w-24 text-right pr-3 text-[11px] font-mono text-slate-500">
              Byte Index
            </div>
            {Array.from({ length: displayLength }).map((_, i) => (
              <button
                key={i}
                onClick={() => setHoveredIndex(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                className={`w-9 text-center text-[10px] font-mono rounded py-0.5 transition-colors ${
                  activeIdx === i ? 'text-amber-300 font-bold bg-amber-500/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                #{i}
              </button>
            ))}
          </div>

          {/* Row 1: K' (Key Padded) */}
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
            <div className="w-24 text-right pr-3 text-xs font-mono font-semibold text-cyan-400 flex items-center justify-end gap-1">
              <span>K′ (Key)</span>
            </div>
            {Array.from({ length: displayLength }).map((_, i) => {
              const b = kPrimeBytes[i] ?? 0;
              const isZero = b === 0;
              const isActive = activeIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => setHoveredIndex(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className={`w-9 h-8 flex items-center justify-center font-mono text-xs rounded transition-all ${
                    isActive
                      ? 'bg-cyan-500/30 text-cyan-200 ring-2 ring-cyan-400 font-bold'
                      : isZero
                      ? 'bg-slate-900/80 text-slate-600'
                      : 'bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60'
                  }`}
                >
                  {b.toString(16).padStart(2, '0')}
                </button>
              );
            })}
          </div>

          {/* Operation Symbol Row */}
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center">
            <div className="w-24 text-right pr-3 text-xs font-mono font-bold text-slate-500">
              ⊕ XOR
            </div>
            {Array.from({ length: displayLength }).map((_, i) => (
              <div
                key={i}
                className={`w-9 text-center text-xs font-bold transition-colors ${
                  activeIdx === i ? 'text-amber-400' : 'text-slate-600'
                }`}
              >
                ⊕
              </div>
            ))}
          </div>

          {/* Row 2: Pad (ipad or opad) */}
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
            <div
              className={`w-24 text-right pr-3 text-xs font-mono font-semibold flex items-center justify-end gap-1 ${
                selectedPad === 'ipad' ? 'text-emerald-400' : 'text-purple-400'
              }`}
            >
              <span>{selectedPad}</span>
            </div>
            {Array.from({ length: displayLength }).map((_, i) => {
              const b = padBytes[i] ?? 0;
              const isActive = activeIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => setHoveredIndex(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className={`w-9 h-8 flex items-center justify-center font-mono text-xs rounded transition-all ${
                    isActive
                      ? selectedPad === 'ipad'
                        ? 'bg-emerald-500/30 text-emerald-200 ring-2 ring-emerald-400 font-bold'
                        : 'bg-purple-500/30 text-purple-200 ring-2 ring-purple-400 font-bold'
                      : selectedPad === 'ipad'
                      ? 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/60'
                  }`}
                >
                  {b.toString(16).padStart(2, '0')}
                </button>
              );
            })}
          </div>

          {/* Equal Symbol Row */}
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center">
            <div className="w-24 text-right pr-3 text-xs font-mono font-bold text-slate-500">
              = Output
            </div>
            {Array.from({ length: displayLength }).map((_, i) => (
              <div
                key={i}
                className={`w-9 text-center text-xs font-bold transition-colors ${
                  activeIdx === i ? 'text-amber-400' : 'text-slate-600'
                }`}
              >
                =
              </div>
            ))}
          </div>

          {/* Row 3: Result (K' xor Pad) */}
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center bg-slate-950/80 p-1 rounded-lg border border-slate-700">
            <div className="w-24 text-right pr-3 text-xs font-mono font-semibold text-amber-300 flex items-center justify-end gap-1">
              <span>Result ({selectedPad === 'ipad' ? 'Kᵢ' : 'Kₒ'})</span>
            </div>
            {Array.from({ length: displayLength }).map((_, i) => {
              const b = resultBytes[i] ?? 0;
              const isActive = activeIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => setHoveredIndex(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className={`w-9 h-8 flex items-center justify-center font-mono text-xs rounded transition-all ${
                    isActive
                      ? 'bg-amber-500/40 text-amber-200 ring-2 ring-amber-400 font-bold shadow-lg'
                      : 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  {b.toString(16).padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expand / Collapse Toggle for all 64 or 128 bytes */}
      {totalLength > maxInitial && (
        <div className="flex justify-end pt-1 pb-3">
          <button
            onClick={() => setShowAllBytes(!showAllBytes)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4"
          >
            {showAllBytes
              ? `Collapse to first ${maxInitial} bytes`
              : `Show all ${totalLength} bytes for block size...`}
          </button>
        </div>
      )}

      {/* Bit-by-Bit Binary Breakdown Box for the Active Column */}
      <div className="mt-4 rounded-xl border border-slate-700/80 bg-slate-950 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-sm text-slate-200">
              Byte #{activeIdx} Binary Breakdown & Truth Table
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
            <span>
              K′[{activeIdx}] Char: <strong className="text-cyan-300 font-sans">'{bytesToAsciiSafe(new Uint8Array([byteK]))}'</strong>
            </span>
            <span>
              Hex: <strong className="text-cyan-300">0x{byteK.toString(16).padStart(2, '0')}</strong> ⊕ <strong className={selectedPad === 'ipad' ? 'text-emerald-300' : 'text-purple-300'}>0x{byteP.toString(16).padStart(2, '0')}</strong> = <strong className="text-amber-300">0x{byteR.toString(16).padStart(2, '0')}</strong>
            </span>
          </div>
        </div>

        {/* 8-Bit Alignment Visualizer */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Binary Grid */}
          <div className="space-y-2 font-mono text-xs">
            {/* Bit positions */}
            <div className="flex items-center">
              <span className="w-28 text-slate-500 text-[11px]">Bit Position:</span>
              <div className="flex gap-1.5">
                {[7, 6, 5, 4, 3, 2, 1, 0].map((pos) => (
                  <span key={pos} className="w-6 text-center text-[10px] text-slate-500">
                    b{pos}
                  </span>
                ))}
              </div>
            </div>

            {/* K' binary */}
            <div className="flex items-center">
              <span className="w-28 text-cyan-400 font-semibold">K′[{activeIdx}] Byte:</span>
              <div className="flex gap-1.5">
                {binK.split('').map((bit, bitIdx) => (
                  <span
                    key={bitIdx}
                    className="w-6 h-6 flex items-center justify-center rounded bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-800/50"
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>

            {/* Operator */}
            <div className="flex items-center pl-28 py-0.5 text-slate-500 font-bold">
              <span>⊕ (XOR bitwise)</span>
            </div>

            {/* Pad binary */}
            <div className="flex items-center">
              <span className={`w-28 font-semibold ${selectedPad === 'ipad' ? 'text-emerald-400' : 'text-purple-400'}`}>
                {padName}:
              </span>
              <div className="flex gap-1.5">
                {binP.split('').map((bit, bitIdx) => (
                  <span
                    key={bitIdx}
                    className={`w-6 h-6 flex items-center justify-center rounded font-bold border ${
                      selectedPad === 'ipad'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                        : 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                    }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800 my-1 ml-28 w-56"></div>

            {/* Result binary */}
            <div className="flex items-center">
              <span className="w-28 text-amber-300 font-bold">Output Byte:</span>
              <div className="flex gap-1.5">
                {binR.split('').map((bit, bitIdx) => (
                  <span
                    key={bitIdx}
                    className="w-6 h-6 flex items-center justify-center rounded bg-amber-950/70 text-amber-300 font-bold border border-amber-600/50 shadow-sm"
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>How Bitwise XOR Works</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              For each individual bit in the byte:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/80 p-2 rounded border border-slate-800">
              <div>0 ⊕ 0 = <span className="text-amber-400 font-bold">0</span> (Same)</div>
              <div>0 ⊕ 1 = <span className="text-amber-400 font-bold">1</span> (Different)</div>
              <div>1 ⊕ 0 = <span className="text-amber-400 font-bold">1</span> (Different)</div>
              <div>1 ⊕ 1 = <span className="text-amber-400 font-bold">0</span> (Same)</div>
            </div>
            <p className="text-[11px] text-slate-400">
              XOR acts as a reversible masking function. Because <code className="text-cyan-300">(A ⊕ B) ⊕ B = A</code>, it thoroughly blinds the secret key while ensuring no mathematical entropy or key information is lost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
