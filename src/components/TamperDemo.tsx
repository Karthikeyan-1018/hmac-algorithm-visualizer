import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  HelpCircle,
} from 'lucide-react';
import type { HashAlgorithm } from '../crypto/hmac';
import {
  calculateHMACOverview,
  calculateAvalancheEffect,
} from '../crypto/hmac';

interface TamperDemoProps {
  originalMessage: string;
  originalKey: string;
  originalHmacHex: string;
  algo: HashAlgorithm;
}

export const TamperDemo: React.FC<TamperDemoProps> = ({
  originalMessage,
  originalKey,
  originalHmacHex,
  algo,
}) => {
  const [tamperedMessage, setTamperedMessage] = useState(
    originalMessage ? `${originalMessage}!` : 'Hello HMAC!'
  );
  const [tamperedHmacHex, setTamperedHmacHex] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Synchronize initial modified message when original changes
  useEffect(() => {
    if (!tamperedMessage.startsWith(originalMessage) || tamperedMessage === originalMessage) {
      setTamperedMessage(originalMessage ? `${originalMessage}!` : 'Hello HMAC!');
    }
  }, [originalMessage]);

  // Compute HMAC for tampered message whenever modified text, key, or algo changes
  useEffect(() => {
    let isCurrent = true;
    setIsCalculating(true);

    calculateHMACOverview(tamperedMessage, originalKey, algo)
      .then((res) => {
        if (isCurrent) {
          setTamperedHmacHex(res.step7.finalHmacHex);
          setIsCalculating(false);
        }
      })
      .catch((err) => {
        console.error('Tamper demo calculation error:', err);
        if (isCurrent) setIsCalculating(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [tamperedMessage, originalKey, algo]);

  const avalanche = calculateAvalancheEffect(originalHmacHex, tamperedHmacHex);
  const isIdentical = originalMessage === tamperedMessage;

  // Preset tamper helpers
  const applyPreset = (type: 'append_exclamation' | 'flip_case' | 'trailing_space' | 'alter_char') => {
    if (!originalMessage) {
      setTamperedMessage('Hello HMAC!');
      return;
    }
    if (type === 'append_exclamation') {
      setTamperedMessage(`${originalMessage}!`);
    } else if (type === 'trailing_space') {
      setTamperedMessage(`${originalMessage} `);
    } else if (type === 'flip_case') {
      const firstChar = originalMessage.charAt(0);
      const flipped =
        firstChar === firstChar.toUpperCase()
          ? firstChar.toLowerCase()
          : firstChar.toUpperCase();
      setTamperedMessage(`${flipped}${originalMessage.slice(1)}`);
    } else if (type === 'alter_char') {
      if (originalMessage.length > 0) {
        const lastCode = originalMessage.charCodeAt(originalMessage.length - 1);
        const newLast = String.fromCharCode(lastCode ^ 1); // flip 1 bit
        setTamperedMessage(`${originalMessage.slice(0, -1)}${newLast}`);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">
              Tamper Detection & Avalanche Effect Demonstration
            </h3>
            <p className="text-xs text-slate-400">
              Observe how changing even a single bit or character completely changes the entire HMAC tag.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono">
            Secret Key: <strong className="text-cyan-400 font-semibold">[Protected]</strong>
          </span>
        </div>
      </div>

      {/* Quick Tamper Modifier Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Quick Modifiers:</span>
        <button
          onClick={() => applyPreset('append_exclamation')}
          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors cursor-pointer"
        >
          Append '!'
        </button>
        <button
          onClick={() => applyPreset('trailing_space')}
          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors cursor-pointer"
        >
          Add Space
        </button>
        <button
          onClick={() => applyPreset('flip_case')}
          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors cursor-pointer"
        >
          Flip Letter Case
        </button>
        <button
          onClick={() => applyPreset('alter_char')}
          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors cursor-pointer"
        >
          Flip 1 Bit in Last Char
        </button>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Message & HMAC Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Original Authentic Message
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {originalMessage.length} chars
            </span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Message Content:</label>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 select-all">
              "{originalMessage}"
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Generated Authentic HMAC:</label>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-900/40 font-mono text-xs text-emerald-300 break-all select-all">
              {originalHmacHex}
            </div>
          </div>
        </div>

        {/* Modified / Tampered Message Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Modified / Tampered Message
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {tamperedMessage.length} chars
            </span>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Modify message here (Type freely):
            </label>
            <input
              type="text"
              value={tamperedMessage}
              onChange={(e) => setTamperedMessage(e.target.value)}
              placeholder="Enter modified message..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Resulting Modified HMAC:</label>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-rose-900/40 font-mono text-xs text-rose-300 break-all select-all">
              {isCalculating ? 'Computing...' : tamperedHmacHex}
            </div>
          </div>
        </div>
      </div>

      {/* Avalanche Effect Metrics Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              Avalanche Effect & Bit Diffusion Analysis
            </span>
          </div>

          {!isIdentical && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">
                Flipped Bits: <strong className="text-rose-400">{avalanche.flippedBits}</strong> / {avalanche.totalBits}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                {avalanche.percentage}% Difference
              </span>
            </div>
          )}
        </div>

        {/* Visual Diff of the two HMAC digests */}
        {!isIdentical ? (
          <div>
            <span className="text-[11px] text-slate-500 block mb-1">
              Character-by-character difference heatmap (Changed positions highlighted in red):
            </span>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs break-all flex flex-wrap gap-x-0.5">
              {tamperedHmacHex.split('').map((char, idx) => {
                const origChar = originalHmacHex[idx];
                const isDiff = char !== origChar;
                return (
                  <span
                    key={idx}
                    className={`px-0.5 rounded ${
                      isDiff
                        ? 'bg-rose-950 text-rose-300 font-bold border-b-2 border-rose-500'
                        : 'text-slate-500'
                    }`}
                    title={`Index ${idx}: Modified '${char}' vs Original '${origChar || ''}'`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-xs text-amber-400/90 italic py-1 text-center font-sans">
            The messages are currently identical. Modify the text above to view tamper detection in action!
          </div>
        )}

        {/* Educational Takeaway */}
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Why Tampering Fails:</strong> Even a 1-bit alteration causes roughly <strong>50% of the output bits</strong> to change unpredictably (the Avalanche Effect). Since the attacker does not know the secret key, they cannot forge a matching valid HMAC for modified messages.
          </p>
        </div>
      </div>
    </div>
  );
};
