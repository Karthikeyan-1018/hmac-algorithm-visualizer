import React, { useState } from 'react';
import {
  Key,
  MessageSquare,
  Hash,
  Play,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import type {
  HashAlgorithm,
  PresetSample,
} from '../crypto/hmac';
import {
  ALGORITHM_SPECS,
  PRESET_SAMPLES,
  stringToUtf8,
} from '../crypto/hmac';

interface InputSectionProps {
  message: string;
  setMessage: (msg: string) => void;
  secretKey: string;
  setSecretKey: (key: string) => void;
  algo: HashAlgorithm;
  setAlgo: (algo: HashAlgorithm) => void;
  onGenerate: () => void;
  onReset: () => void;
  onLoadPreset: (preset: PresetSample) => void;
  isGenerating?: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  message,
  setMessage,
  secretKey,
  setSecretKey,
  algo,
  setAlgo,
  onGenerate,
  onReset,
  onLoadPreset,
  isGenerating = false,
}) => {
  const [showKey, setShowKey] = useState(true);

  const spec = ALGORITHM_SPECS[algo];
  const keyBytesLength = stringToUtf8(secretKey).length;
  const messageBytesLength = stringToUtf8(message).length;

  const isKeyShort = keyBytesLength < spec.blockSize;
  const isKeyLong = keyBytesLength > spec.blockSize;
  const isKeyExact = keyBytesLength === spec.blockSize;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-bold text-slate-100 text-lg flex items-center gap-2">
            <span>Cryptographic Input Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure the message, secret key, and hash function to step through the HMAC construction.
          </p>
        </div>

        {/* Presets Button & Dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Load Preset:</span>
          {/* Default quick sample button */}
          <button
            onClick={() => onLoadPreset(PRESET_SAMPLES[0])}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Load default sample: Hello HMAC / secret123"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample: Hello HMAC</span>
          </button>

          {/* Other presets selector */}
          <select
            onChange={(e) => {
              const selected = PRESET_SAMPLES.find((p) => p.id === e.target.value);
              if (selected) onLoadPreset(selected);
            }}
            value=""
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="" disabled>
              More Test Vectors...
            </option>
            {PRESET_SAMPLES.slice(1).map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message Input (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Message / Payload ($m$)</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {message.length} chars | <strong className="text-cyan-300">{messageBytesLength} bytes</strong>
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Enter plaintext message or payload..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all resize-none"
          />
        </div>

        {/* Secret Key Input (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Secret Key ($K$)</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showKey ? 'Hide' : 'Show'}</span>
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                <strong className="text-amber-300">{keyBytesLength} bytes</strong>
              </span>
            </div>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Key status vs block size indicator */}
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-0.5">
            <span>Block Size ($B$): {spec.blockSize}B</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                isKeyShort
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : isKeyLong
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {isKeyShort && `Short Key (< ${spec.blockSize}B: will zero-pad)`}
              {isKeyLong && `Long Key (> ${spec.blockSize}B: will hash first)`}
              {isKeyExact && `Exact Match (= ${spec.blockSize}B)`}
            </span>
          </div>
        </div>
      </div>

      {/* Algorithm Selector & Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        {/* Hash Algorithm Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300">Hash Algorithm:</span>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['SHA-256', 'SHA-384', 'SHA-512'] as HashAlgorithm[]).map((algorithm) => {
              const isSelected = algo === algorithm;
              return (
                <button
                  key={algorithm}
                  onClick={() => setAlgo(algorithm)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {algorithm}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            (Block: {spec.blockSize}B / Digest: {spec.outputSize}B [{spec.bitSize} bits])
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors text-xs font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isGenerating ? 'Computing...' : 'Generate HMAC'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
