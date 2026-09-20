import React from 'react';
import { Key, Shield, Hash, ArrowDown, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import type { HMACCalculationResult, HashAlgorithm } from '../crypto/hmac';

interface FlowDiagramProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  result: HMACCalculationResult | null;
  algo: HashAlgorithm;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  currentStep,
  onSelectStep,
  result,
  algo,
}) => {
  const getStepStatusClass = (step: number) => {
    const isActive = currentStep === step;
    if (isActive) {
      return 'ring-2 ring-cyan-400 bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20 scale-[1.03]';
    }
    return 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500 hover:bg-slate-800/90';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Background cryptographic grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-slate-100 text-lg">
              Interactive HMAC Cryptographic Flow Diagram
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any block below to jump to that exact stage and inspect its intermediate values.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Hash: <strong className="text-cyan-400">{algo}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Active: <strong className="text-amber-400">Step {currentStep} of 7</strong>
          </span>
        </div>
      </div>

      {/* Flowchart Layout */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Node: Secret Key (Step 1) */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => onSelectStep(1)}
            className={`group relative px-5 py-3 rounded-xl border text-center transition-all duration-200 cursor-pointer min-w-[240px] ${getStepStatusClass(
              1
            )}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm">STEP 1: Secret Key (K) & Message (m)</span>
            </div>
            {result && (
              <div className="mt-1 text-[11px] font-mono text-slate-400 truncate max-w-[220px] mx-auto">
                Key: "{result.step1.key}" | Msg: "{result.step1.message}"
              </div>
            )}
            <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow">
              1
            </span>
          </button>

          {/* Down Connector */}
          <div className="w-0.5 h-6 bg-slate-700 relative flex items-center justify-center">
            <ArrowDown className="w-3.5 h-3.5 text-slate-500 absolute -bottom-2" />
          </div>
        </div>

        {/* Node 2: Key Normalization (Step 2) */}
        <div className="flex flex-col items-center mt-2">
          <button
            onClick={() => onSelectStep(2)}
            className={`group relative px-5 py-3 rounded-xl border text-center transition-all duration-200 cursor-pointer min-w-[240px] ${getStepStatusClass(
              2
            )}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm">STEP 2: Normalize Key (K′)</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Zero-pad to block size ({result?.step2.blockSize || 64} bytes)
            </div>
            <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow">
              2
            </span>
          </button>

          {/* Fork Splitter Line */}
          <div className="relative w-full max-w-[620px] h-8 mt-1">
            {/* Center stem down */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-4 bg-slate-700" />
            {/* Horizontal bar */}
            <div className="absolute left-[25%] right-[25%] top-4 h-0.5 bg-slate-700" />
            {/* Left drop */}
            <div className="absolute left-[25%] top-4 w-0.5 h-4 bg-slate-700 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-slate-500 absolute -bottom-2" />
            </div>
            {/* Right drop */}
            <div className="absolute right-[25%] top-4 w-0.5 h-4 bg-slate-700 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-slate-500 absolute -bottom-2" />
            </div>
          </div>
        </div>

        {/* 2-Column Split: Inner Path (Left) vs Outer Path (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-1">
          {/* LEFT COLUMN: INNER HASH PIPELINE */}
          <div className="flex flex-col items-center space-y-4 p-4 rounded-2xl bg-emerald-950/10 border border-emerald-900/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
              Inner Hash Stage
            </span>

            {/* Step 3: ipad */}
            <button
              onClick={() => onSelectStep(3)}
              className={`w-full p-3 rounded-xl border text-center transition-all cursor-pointer relative ${getStepStatusClass(
                3
              )}`}
            >
              <div className="font-bold text-xs text-emerald-300">STEP 3: Inner Pad (ipad)</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                0x36 repeated ({result?.step3.blockSize || 64} bytes)
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                3
              </span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-600" />

            {/* Step 4: Inner XOR */}
            <button
              onClick={() => onSelectStep(4)}
              className={`w-full p-3 rounded-xl border text-center transition-all cursor-pointer relative ${getStepStatusClass(
                4
              )}`}
            >
              <div className="font-bold text-xs text-cyan-300">STEP 4: XOR with ipad</div>
              <div className="text-[11px] font-mono text-amber-300 font-semibold mt-0.5">
                Kᵢ = K′ ⊕ ipad
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                4
              </span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-600" />

            {/* Step 5: Inner Input Concatenation */}
            <div className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs">
              <span className="text-slate-400">Concatenate Inner Stream:</span>
              <div className="font-mono text-cyan-300 font-semibold mt-0.5">
                (K′ ⊕ ipad) ∥ Message
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-600" />

            {/* Step 5 Hash */}
            <button
              onClick={() => onSelectStep(5)}
              className={`w-full p-3.5 rounded-xl border text-center transition-all cursor-pointer relative ${getStepStatusClass(
                5
              )}`}
            >
              <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-amber-300">
                <Hash className="w-4 h-4 text-amber-400" />
                <span>STEP 5: Hash ({algo})</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 mt-1 font-semibold">
                Result: Inner Hash
              </div>
              {result && (
                <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                  {result.step5.innerHashHex.slice(0, 16)}...
                </div>
              )}
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                5
              </span>
            </button>
          </div>

          {/* RIGHT COLUMN: OUTER HASH PIPELINE */}
          <div className="flex flex-col items-center space-y-4 p-4 rounded-2xl bg-purple-950/10 border border-purple-900/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/50">
              Outer Hash Stage
            </span>

            {/* Step 3: opad */}
            <button
              onClick={() => onSelectStep(3)}
              className={`w-full p-3 rounded-xl border text-center transition-all cursor-pointer relative ${getStepStatusClass(
                3
              )}`}
            >
              <div className="font-bold text-xs text-purple-300">STEP 3: Outer Pad (opad)</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                0x5C repeated ({result?.step3.blockSize || 64} bytes)
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                3
              </span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-600" />

            {/* Step 4: Outer XOR */}
            <button
              onClick={() => onSelectStep(4)}
              className={`w-full p-3 rounded-xl border text-center transition-all cursor-pointer relative ${getStepStatusClass(
                4
              )}`}
            >
              <div className="font-bold text-xs text-purple-300">STEP 4: XOR with opad</div>
              <div className="text-[11px] font-mono text-purple-300 font-semibold mt-0.5">
                Kₒ = K′ ⊕ opad
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                4
              </span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-600" />

            {/* Step 6: Outer Input Concatenation with Inner Hash */}
            <div className="w-full p-2.5 rounded-xl bg-slate-950 border border-purple-800/50 text-center text-xs">
              <span className="text-slate-400">Concatenate Outer Stream:</span>
              <div className="font-mono text-purple-300 font-semibold mt-0.5">
                (K′ ⊕ opad) ∥ Inner Hash
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-600" />

            {/* Step 6 Hash */}
            <button
              onClick={() => onSelectStep(6)}
              className={`w-full p-3.5 rounded-xl border text-center transition-all cursor-pointer relative ${getStepStatusClass(
                6
              )}`}
            >
              <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-purple-300">
                <Hash className="w-4 h-4 text-purple-400" />
                <span>STEP 6: Hash ({algo})</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 mt-1 font-semibold">
                Outer Hash Computation
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                6
              </span>
            </button>
          </div>
        </div>

        {/* Bridge Arrow between Left (Inner Hash) and Right (Outer Concatenation) */}
        <div className="hidden md:flex items-center justify-center gap-2 text-xs font-mono text-slate-400 my-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
          <span className="text-amber-400">Inner Hash Output</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span className="text-purple-400">Fed into Outer Hash Input</span>
        </div>

        {/* Bottom Node: Final HMAC (Step 7) */}
        <div className="flex flex-col items-center mt-4 w-full max-w-lg">
          <ArrowDown className="w-5 h-5 text-slate-600 mb-2" />
          <button
            onClick={() => onSelectStep(7)}
            className={`w-full group relative p-4 rounded-2xl border text-center transition-all duration-200 cursor-pointer shadow-xl ${getStepStatusClass(
              7
            )}`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-base text-cyan-300">
                STEP 7: Final HMAC Output
              </span>
            </div>
            {result ? (
              <div className="mt-2 font-mono text-xs text-cyan-200 bg-slate-950/90 py-1.5 px-3 rounded-lg border border-cyan-800/40 break-all select-all">
                {result.step7.finalHmacHex}
              </div>
            ) : (
              <div className="mt-1 text-xs text-slate-400 font-mono">
                HMAC(K, m) = H((K′ ⊕ opad) ∥ H((K′ ⊕ ipad) ∥ m))
              </div>
            )}
            <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow">
              7
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
