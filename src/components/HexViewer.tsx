import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff, Layers, FileCode, AlignLeft } from 'lucide-react';
import { formatBytesWithOffsets, bytesToAsciiSafe } from '../crypto/hmac';

interface HexViewerProps {
  title?: string;
  bytes: Uint8Array;
  hex?: string;
  showTextTab?: boolean;
  defaultExpanded?: boolean;
  highlightIndices?: number[];
  badge?: string;
  badgeColor?: 'emerald' | 'cyan' | 'amber' | 'purple' | 'slate' | 'rose';
}

export const HexViewer: React.FC<HexViewerProps> = ({
  title,
  bytes,
  hex: hexProp,
  showTextTab = true,
  defaultExpanded = false,
  highlightIndices = [],
  badge,
  badgeColor = 'cyan',
}) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'text'>('formatted');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hexString = hexProp || Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  const formattedOffsets = formatBytesWithOffsets(bytes, 16);
  const asciiText = bytesToAsciiSafe(bytes);

  const handleCopy = () => {
    let textToCopy = hexString;
    if (activeTab === 'formatted') textToCopy = formattedOffsets;
    if (activeTab === 'text') textToCopy = asciiText;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeColorMap = {
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-500/30',
    slate: 'bg-slate-900/80 text-slate-300 border-slate-700',
    rose: 'bg-rose-950/80 text-rose-300 border-rose-500/30',
  };

  const isLong = bytes.length > 32;
  const displayedBytes = isLong && !isExpanded ? bytes.slice(0, 32) : bytes;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm overflow-hidden shadow-lg transition-all duration-200 hover:border-slate-700">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/70 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {title && <span className="font-semibold text-slate-200">{title}</span>}
          {badge && (
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium ${badgeColorMap[badgeColor]}`}>
              {badge}
            </span>
          )}
          <span className="text-slate-400 font-mono">
            {bytes.length} bytes ({bytes.length * 8} bits)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab('formatted')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'formatted'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Formatted Hex with memory offsets"
            >
              <Layers className="w-3 h-3" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'raw'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Raw continuous Hex"
            >
              <FileCode className="w-3 h-3" />
              <span>Hex</span>
            </button>
            {showTextTab && (
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'text'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Decoded ASCII / Text preview"
              >
                <AlignLeft className="w-3 h-3" />
                <span>Text</span>
              </button>
            )}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs"
            title="Copy value"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 font-mono text-xs overflow-x-auto max-h-72 overflow-y-auto">
        {bytes.length === 0 ? (
          <div className="text-slate-500 italic py-2 text-center font-sans">
            (Empty byte array - 0 bytes)
          </div>
        ) : activeTab === 'formatted' ? (
          <div className="space-y-1">
            {/* Hex byte blocks */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 text-xs select-text">
              {Array.from({ length: Math.ceil(displayedBytes.length / 16) }).map((_, rowIndex) => {
                const rowStart = rowIndex * 16;
                const rowChunk = displayedBytes.slice(rowStart, rowStart + 16);
                const offset = rowStart.toString(16).padStart(4, '0').toUpperCase();

                return (
                  <React.Fragment key={rowIndex}>
                    {/* Memory Offset */}
                    <span className="text-slate-500 font-mono select-none">{offset}:</span>
                    {/* Bytes */}
                    <div className="flex flex-wrap gap-x-1.5 gap-y-1 font-mono">
                      {Array.from(rowChunk).map((byte, byteIdx) => {
                        const absoluteIndex = rowStart + byteIdx;
                        const isHighlighted = highlightIndices.includes(absoluteIndex);
                        const isZeroPad = byte === 0x00;
                        const isIpadByte = byte === 0x36;
                        const isOpadByte = byte === 0x5c;

                        let colorClass = 'text-cyan-200 bg-cyan-950/30';
                        if (isHighlighted) {
                          colorClass = 'text-amber-300 bg-amber-500/30 ring-1 ring-amber-400 font-bold';
                        } else if (isZeroPad) {
                          colorClass = 'text-slate-600 bg-slate-900/40';
                        } else if (isIpadByte) {
                          colorClass = 'text-emerald-300 bg-emerald-950/40';
                        } else if (isOpadByte) {
                          colorClass = 'text-purple-300 bg-purple-950/40';
                        }

                        return (
                          <span
                            key={byteIdx}
                            className={`px-1 py-0.5 rounded text-[11px] transition-colors ${colorClass}`}
                            title={`Byte #${absoluteIndex}: 0x${byte.toString(16).padStart(2, '0')} (${byte}) | Char: '${bytesToAsciiSafe(new Uint8Array([byte]))}'`}
                          >
                            {byte.toString(16).padStart(2, '0')}
                          </span>
                        );
                      })}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {isLong && !isExpanded && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-slate-900 text-cyan-400 hover:bg-slate-800 hover:text-cyan-300 border border-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Show remaining {bytes.length - 32} bytes...
                </button>
              </div>
            )}
            {isLong && isExpanded && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Collapse to 32 bytes
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'raw' ? (
          <div className="break-all text-cyan-300 leading-relaxed tracking-wider select-text bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
            {hexString}
          </div>
        ) : (
          <div className="text-slate-200 leading-relaxed font-mono whitespace-pre-wrap select-text bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
            {asciiText}
          </div>
        )}
      </div>
    </div>
  );
};
