import React from 'react';
import {
  Shield,
  CheckCircle2,
  HelpCircle,
  Info,
  Sparkles,
} from 'lucide-react';
import type { HMACCalculationResult, HashAlgorithm } from '../crypto/hmac';
import { ALGORITHM_SPECS } from '../crypto/hmac';
import { HexViewer } from './HexViewer';
import { XorVisualizer } from './XorVisualizer';

interface StepCardProps {
  stepNumber: number;
  result: HMACCalculationResult;
  algo: HashAlgorithm;
}

export const StepCard: React.FC<StepCardProps> = ({ stepNumber, result, algo }) => {
  const spec = ALGORITHM_SPECS[algo];
  const B = spec.blockSize;

  switch (stepNumber) {
    case 1: {
      // STEP 1: Input
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
          {/* Step Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-lg">
                1
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">
                  STEP 1 — Inputs & Cryptographic Parameters
                </h3>
                <p className="text-xs text-slate-400">
                  HMAC takes two arbitrary binary or text inputs: the Secret Key and the Message.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono">
              Hash Algorithm: {algo}
            </span>
          </div>

          {/* Educational 5-Section Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What happens? */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1.5">
                <Info className="w-4 h-4" />
                <span>What happens?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The user provides a <strong>Secret Key ($K$)</strong> and a <strong>Message ($m$)</strong>. Both are encoded from UTF-8 strings into raw binary byte arrays.
              </p>
            </div>

            {/* Why do we do this? */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Why do we do this?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                HMAC operates directly on binary byte buffers. Converting strings to standard UTF-8 ensures cryptographic consistency across different operating systems and programming languages.
              </p>
            </div>
          </div>

          {/* Input & Operation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Input Parameters:</span>
              <ul className="mt-1 space-y-1 text-slate-300">
                <li>• Message length: <strong className="text-cyan-300 font-mono">{result.step1.messageBytes.length} bytes</strong> ({result.step1.message.length} chars)</li>
                <li>• Secret Key length: <strong className="text-cyan-300 font-mono">{result.step1.keyBytes.length} bytes</strong> ({result.step1.key.length} chars)</li>
              </ul>
            </div>
            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Selected Hash Specifications:</span>
              <ul className="mt-1 space-y-1 text-slate-300">
                <li>• Block Size ($B$): <strong className="text-amber-300 font-mono">{B} bytes</strong> ({B * 8} bits)</li>
                <li>• Output Digest Size ($L$): <strong className="text-emerald-300 font-mono">{spec.outputSize} bytes</strong> ({spec.bitSize} bits)</li>
              </ul>
            </div>
          </div>

          {/* Hex Viewers */}
          <div className="space-y-4">
            <HexViewer
              title="Secret Key (K) Bytes"
              bytes={result.step1.keyBytes}
              badge="Secret Key"
              badgeColor="cyan"
            />
            <HexViewer
              title="Message (m) Bytes"
              bytes={result.step1.messageBytes}
              badge="Payload"
              badgeColor="slate"
            />
          </div>
        </div>
      );
    }

    case 2: {
      // STEP 2: Normalize the Key (K')
      const { keyLength, blockSize, isKeyLong, isKeyShort, isKeyExact, hashedKeyBytes, kPrimeBytes } =
        result.step2;

      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-lg">
                2
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">
                  STEP 2 — Normalize the Key ($K'$)
                </h3>
                <p className="text-xs text-slate-400">
                  Adjust the secret key to exactly match the hash function's block size ($B = {blockSize}$ bytes).
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono">
              Target: {blockSize} Bytes ({blockSize * 8} bits)
            </span>
          </div>

          {/* Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1.5">
                <Info className="w-4 h-4" />
                <span>What happens?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isKeyLong ? (
                  <>
                    Because the key length (<strong className="text-amber-300">{keyLength} B</strong>) is <strong>greater</strong> than the block size ({blockSize} B), it is first hashed with <strong className="text-cyan-300">{algo}</strong> to reduce it to {spec.outputSize} bytes, then padded with zeros to {blockSize} bytes.
                  </>
                ) : isKeyShort ? (
                  <>
                    Because the key length (<strong className="text-amber-300">{keyLength} B</strong>) is <strong>shorter</strong> than the block size ({blockSize} B), it is padded with <strong className="text-cyan-300">{blockSize - keyLength} zero bytes (0x00)</strong> on the right to reach exactly {blockSize} bytes.
                  </>
                ) : (
                  <>
                    The key length (<strong className="text-emerald-300">{keyLength} B</strong>) is <strong>exactly equal</strong> to the block size ({blockSize} B), so no hashing or padding is needed.
                  </>
                )}
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Why do we do this?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                HMAC performs bitwise XOR operations between the key and fixed-size constant pads (<code className="text-cyan-300 font-mono">ipad</code> and <code className="text-purple-300 font-mono">opad</code>). Bitwise XOR requires both operands to have the <strong>exact same length</strong> ($B$).
              </p>
            </div>
          </div>

          {/* Key Normalization Status Alert */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Key Normalization Strategy:
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Original Key: <strong className="text-cyan-300">{keyLength} bytes</strong> | Hash Block Size: <strong className="text-emerald-300">{blockSize} bytes</strong>
                </div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-200">
              {isKeyLong && (
                <span className="text-amber-300">Strategy: Hash with {algo} → Pad with {blockSize - spec.outputSize} zeros</span>
              )}
              {isKeyShort && (
                <span className="text-cyan-300">Strategy: Raw Key + {blockSize - keyLength} Zero Bytes (0x00)</span>
              )}
              {isKeyExact && (
                <span className="text-emerald-300">Strategy: Exact Fit (No padding needed)</span>
              )}
            </div>
          </div>

          {/* If key was hashed, display the intermediate hashed key */}
          {hashedKeyBytes && (
            <HexViewer
              title={`Hashed Key H(K) [${algo}]`}
              bytes={hashedKeyBytes}
              badge="Pre-hash"
              badgeColor="amber"
            />
          )}

          {/* Normalized Key K' */}
          <HexViewer
            title={`Normalized Key (K′) [${kPrimeBytes.length} Bytes]`}
            bytes={kPrimeBytes}
            badge="K′ Buffer"
            badgeColor="emerald"
            defaultExpanded={true}
          />
        </div>
      );
    }

    case 3: {
      // STEP 3: Create ipad and opad
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-lg">
                3
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">
                  STEP 3 — Inner and Outer Constant Pads (ipad & opad)
                </h3>
                <p className="text-xs text-slate-400">
                  Generate two constant byte arrays of length $B = {result.step3.blockSize}$ bytes according to RFC 2104.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono">
              Constants: 0x36 & 0x5C
            </span>
          </div>

          {/* Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1.5">
                <Info className="w-4 h-4" />
                <span>What happens?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Two static byte patterns are created:
                <br />
                • <strong className="text-emerald-300 font-mono">ipad</strong> = byte <code className="text-emerald-300 font-mono">0x36</code> (binary <code className="text-emerald-300 font-mono">00110110</code>) repeated {result.step3.blockSize} times.
                <br />
                • <strong className="text-purple-300 font-mono">opad</strong> = byte <code className="text-purple-300 font-mono">0x5C</code> (binary <code className="text-purple-300 font-mono">01011100</code>) repeated {result.step3.blockSize} times.
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Why do we do this?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                These constants create two completely independent, decorrelated derived keys from the single master key (K′ ⊕ ipad and K′ ⊕ opad). The Hamming distance between <code className="text-emerald-300 font-mono">0x36</code> and <code className="text-purple-300 font-mono">0x5C</code> is 4 bits out of 8, creating maximum cryptographic bit dispersion.
              </p>
            </div>
          </div>

          {/* Constant Hex Viewers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HexViewer
              title={`ipad (Inner Pad) [${result.step3.blockSize} Bytes]` }
              bytes={result.step3.ipadBytes}
              badge="0x36 × B"
              badgeColor="emerald"
            />
            <HexViewer
              title={`opad (Outer Pad) [${result.step3.blockSize} Bytes]` }
              bytes={result.step3.opadBytes}
              badge="0x5C × B"
              badgeColor="purple"
            />
          </div>
        </div>
      );
    }

    case 4: {
      // STEP 4: XOR Operations
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-lg">
                4
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">
                  STEP 4 — Bitwise XOR Operations (K_i and K_o)
                </h3>
                <p className="text-xs text-slate-400">
                  Compute K_i = K′ ⊕ ipad and K_o = K′ ⊕ opad byte-by-byte.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono">
              Key Masking Stage
            </span>
          </div>

          {/* Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1.5">
                <Info className="w-4 h-4" />
                <span>What happens?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The normalized key $K'$ is bitwise XORed with the inner pad (<code className="text-emerald-300 font-mono">ipad</code>) to produce <strong>$K_i$</strong>, and separately with the outer pad (<code className="text-purple-300 font-mono">opad</code>) to produce <strong>$K_o$</strong>.
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Why do we do this?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This separates the single master key into two distinct cryptographic sub-keys for the inner and outer hash passes. Because XOR is invertible and linear, it does not destroy any key entropy.
              </p>
            </div>
          </div>

          {/* Interactive XOR Visualizer */}
          <XorVisualizer
            kPrimeBytes={result.step2.kPrimeBytes}
            ipadBytes={result.step3.ipadBytes}
            opadBytes={result.step3.opadBytes}
            kPrimeXorIpadBytes={result.step4.kPrimeXorIpadBytes}
            kPrimeXorOpadBytes={result.step4.kPrimeXorOpadBytes}
          />

          {/* Output Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HexViewer
              title="Inner Key Mask (K′ ⊕ ipad)"
              bytes={result.step4.kPrimeXorIpadBytes}
              badge="K_i Buffer"
              badgeColor="emerald"
            />
            <HexViewer
              title="Outer Key Mask (K′ ⊕ opad)"
              bytes={result.step4.kPrimeXorOpadBytes}
              badge="K_o Buffer"
              badgeColor="purple"
            />
          </div>
        </div>
      );
    }

    case 5: {
      // STEP 5: Inner Hash
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-lg">
                5
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">
                  STEP 5 — Inner Hash Computation
                </h3>
                <p className="text-xs text-slate-400">
                  Concatenate $K_i$ with the message and pass the result through {algo}.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono">
              H((K′ ⊕ ipad) ∥ Message)
            </span>
          </div>

          {/* Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1.5">
                <Info className="w-4 h-4" />
                <span>What happens?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The inner key mask ($K_i$) and the message ($m$) are concatenated into a single continuous byte stream of length <strong className="text-cyan-300 font-mono">{result.step5.innerConcatBytes.length} bytes</strong> ({B} B + {result.step1.messageBytes.length} B), then hashed with {algo}.
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Why do we do this?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This embeds the secret key at the beginning of the message stream. The cryptographic hash function absorbs the key and message together into an avalanche of irreversible internal state.
              </p>
            </div>
          </div>

          {/* Concatenation Stream Visual Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300">
              Inner Byte Stream Assembly:
            </span>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <div className="px-3 py-2 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300">
                <span>K′ ⊕ ipad ({B} bytes)</span>
              </div>
              <span className="text-slate-500 font-bold text-sm">∥ (Concatenate)</span>
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                <span>Message ({result.step1.messageBytes.length} bytes)</span>
              </div>
              <span className="text-cyan-400 font-bold text-sm">➔</span>
              <div className="px-3 py-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300">
                <span>Total Stream: {result.step5.innerConcatBytes.length} bytes</span>
              </div>
            </div>
          </div>

          {/* Concatenated input hex */}
          <HexViewer
            title={`Concatenated Inner Stream [(K′ ⊕ ipad) ∥ m]`}
            bytes={result.step5.innerConcatBytes}
            badge="Inner Input"
            badgeColor="cyan"
          />

          {/* Resulting Inner Hash */}
          <HexViewer
            title={`Inner Hash Output [${algo}]`}
            bytes={result.step5.innerHashBytes}
            badge={`${spec.outputSize} Bytes / ${spec.bitSize} Bits`}
            badgeColor="amber"
          />
        </div>
      );
    }

    case 6: {
      // STEP 6: Outer Hash
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-lg">
                6
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">
                  STEP 6 — Outer Hash Computation
                </h3>
                <p className="text-xs text-slate-400">
                  Concatenate $K_o$ with the Inner Hash output and hash the combined stream.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-xs font-mono">
              H((K′ ⊕ opad) ∥ InnerHash)
            </span>
          </div>

          {/* Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1.5">
                <Info className="w-4 h-4" />
                <span>What happens?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The outer key mask (K_o = K′ ⊕ opad) and the Inner Hash ({spec.outputSize} B) are concatenated into a stream of <strong className="text-purple-300 font-mono">{result.step6.outerConcatBytes.length} bytes</strong> ({B} B + {spec.outputSize} B), then hashed with {algo} to produce the final HMAC authentication code.
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Why do we do this?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Prevents Length Extension Attacks:</strong> Simple Merkle-Damgård hashes like H(K ∥ m) allow an attacker to append data and forge valid hashes without knowing K. The outer hash pass wraps the inner hash in a second layer of keyed hashing, completely neutralizing length extension attacks!
              </p>
            </div>
          </div>

          {/* Concatenation Stream Visual Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300">
              Outer Byte Stream Assembly:
            </span>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <div className="px-3 py-2 rounded-lg bg-purple-950/70 border border-purple-800 text-purple-300">
                <span>K′ ⊕ opad ({B} bytes)</span>
              </div>
              <span className="text-slate-500 font-bold text-sm">∥ (Concatenate)</span>
              <div className="px-3 py-2 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-300">
                <span>Inner Hash ({spec.outputSize} bytes)</span>
              </div>
              <span className="text-purple-400 font-bold text-sm">➔</span>
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                <span>Total Stream: {result.step6.outerConcatBytes.length} bytes</span>
              </div>
            </div>
          </div>

          {/* Concatenated Outer Input */}
          <HexViewer
            title={`Concatenated Outer Stream [(K′ ⊕ opad) ∥ Inner Hash]`}
            bytes={result.step6.outerConcatBytes}
            badge="Outer Input"
            badgeColor="purple"
          />

          {/* Final Hash Output */}
          <HexViewer
            title={`Final HMAC Output [${algo}]`}
            bytes={result.step6.outerHashBytes}
            badge={`${spec.outputSize} Bytes / ${spec.bitSize} Bits`}
            badgeColor="emerald"
          />
        </div>
      );
    }

    case 7: {
      // STEP 7: Final HMAC Output & Verification
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-lg">
                7
              </span>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">
                  STEP 7 — Final HMAC Authentication Code & Verification
                </h3>
                <p className="text-xs text-slate-400">
                  The complete cryptographic authentication tag is ready for transmission or signature validation.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WebCrypto Validated</span>
              </span>
            </div>
          </div>

          {/* Prominent Final Output Display Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Computed HMAC Signature
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span>{spec.outputSize} Bytes</span>
                <span>•</span>
                <span>{spec.bitSize} Bits</span>
                <span>•</span>
                <span className="text-cyan-400 font-semibold">{algo}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-sm sm:text-base text-cyan-300 break-all select-all tracking-wider font-semibold shadow-inner">
              {result.step7.finalHmacHex}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Exact match with Native Browser Web Crypto API (SubtleCrypto.sign)
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.step7.finalHmacHex);
                  alert('HMAC copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                Copy Final HMAC
              </button>
            </div>
          </div>

          {/* Full Summary Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200">
              Summary of All Pipeline Stages:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="py-2 pr-4 font-sans">Stage</th>
                    <th className="py-2 pr-4 font-sans">Formula</th>
                    <th className="py-2 font-sans">Output Snippet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400 font-sans">1. Raw Inputs</td>
                    <td className="py-2 pr-4 text-slate-400">K, m</td>
                    <td className="py-2 truncate max-w-xs">{result.step1.keyHex.slice(0, 16)}...</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-emerald-400 font-sans">2. Normalize Key</td>
                    <td className="py-2 pr-4 text-slate-400">K′ (padded)</td>
                    <td className="py-2 truncate max-w-xs">{result.step2.kPrimeHex.slice(0, 16)}...</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-purple-400 font-sans">3. Pads</td>
                    <td className="py-2 pr-4 text-slate-400">ipad, opad</td>
                    <td className="py-2 truncate max-w-xs">363636... | 5c5c5c...</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-amber-400 font-sans">4. XOR Masking</td>
                    <td className="py-2 pr-4 text-slate-400">Kᵢ, Kₒ</td>
                    <td className="py-2 truncate max-w-xs">{result.step4.kPrimeXorIpadHex.slice(0, 16)}...</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cyan-400 font-sans">5. Inner Hash</td>
                    <td className="py-2 pr-4 text-slate-400">H(Kᵢ ∥ m)</td>
                    <td className="py-2 truncate max-w-xs">{result.step5.innerHashHex.slice(0, 16)}...</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-purple-400 font-sans">6. Outer Hash</td>
                    <td className="py-2 pr-4 text-slate-400">H(Kₒ ∥ InnerHash)</td>
                    <td className="py-2 truncate max-w-xs">{result.step6.outerHashHex.slice(0, 16)}...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
