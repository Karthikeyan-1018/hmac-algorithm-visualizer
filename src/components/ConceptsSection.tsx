import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  Hash,
  Key,
  Layers,
  Lock,
  FileCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';

interface ConceptItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  content: React.ReactNode;
}

export const ConceptsSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('what-is-hmac');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const concepts: ConceptItem[] = [
    {
      id: 'what-is-hmac',
      title: 'What is HMAC?',
      category: 'basics',
      icon: Shield,
      summary: 'Hash-based Message Authentication Code (RFC 2104 standard)',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>HMAC (Hash-based Message Authentication Code)</strong> is a cryptographic construction defined in <strong>RFC 2104</strong> that calculates a message authentication code (MAC) involving a cryptographic hash function in combination with a secret key.
          </p>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-cyan-300 text-center">
            HMAC(K, m) = H((K′ ⊕ opad) ∥ H((K′ ⊕ ipad) ∥ m))
          </div>
          <p>
            It is used to simultaneously verify both the <strong>data integrity</strong> (ensuring the message was not modified in transit) and the <strong>authenticity</strong> (ensuring the message genuinely originated from a party in possession of the secret key).
          </p>
        </div>
      ),
    },
    {
      id: 'what-is-hash',
      title: 'What is a Cryptographic Hash Function?',
      category: 'basics',
      icon: Hash,
      summary: 'One-way deterministic mathematical compression',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            A cryptographic hash function $H$ takes an arbitrary-length binary message and computes a fixed-length output string called a <em>digest</em> or <em>hash</em>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-cyan-300 block mb-1">1. Pre-image Resistance</strong>
              Given hash $h$, it is computationally infeasible to find message $m$ such that $H(m) = h$ (one-way).
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-emerald-300 block mb-1">2. Second Pre-image</strong>
              Given message $m_1$, it is infeasible to find $m_2 \neq m_1$ such that $H(m_1) = H(m_2)$.
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-purple-300 block mb-1">3. Collision Resistance</strong>
              It is infeasible to find any two arbitrary messages $a \neq b$ such that $H(a) = H(b)$.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'what-is-sha256',
      title: 'What is SHA-256, SHA-384, and SHA-512?',
      category: 'basics',
      icon: Layers,
      summary: 'NIST Secure Hash Algorithm 2 (SHA-2) family',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The <strong>SHA-2</strong> family was designed by the United States National Security Agency (NSA) and published by NIST. They process data in sequential blocks:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-2">Algorithm</th>
                  <th className="p-2">Block Size (B)</th>
                  <th className="p-2">Output Size (L)</th>
                  <th className="p-2">Security Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2 font-semibold text-cyan-400">SHA-256</td>
                  <td className="p-2">64 bytes (512 bits)</td>
                  <td className="p-2">32 bytes (256 bits)</td>
                  <td className="p-2">128 bits</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold text-cyan-400">SHA-384</td>
                  <td className="p-2">128 bytes (1024 bits)</td>
                  <td className="p-2">48 bytes (384 bits)</td>
                  <td className="p-2">192 bits</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold text-cyan-400">SHA-512</td>
                  <td className="p-2">128 bytes (1024 bits)</td>
                  <td className="p-2">64 bytes (512 bits)</td>
                  <td className="p-2">256 bits</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'what-is-secret-key',
      title: 'What is the Secret Key and Key Normalization?',
      category: 'architecture',
      icon: Key,
      summary: 'Why keys are hashed or zero-padded',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The secret key is a shared credential known only to the sender and receiver. Because HMAC uses bitwise XOR operations with fixed-size block arrays, the key must be normalized to block size $B$:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>
              <strong className="text-amber-300">If Key &gt; Block Size:</strong> It is compressed by hashing it first: $K' = H(K)$, and then right-padded with zero bytes to length $B$.
            </li>
            <li>
              <strong className="text-cyan-300">If Key &le; Block Size:</strong> It is right-padded with zero bytes ($0\times 00$) up to length $B$.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'what-is-ipad-opad',
      title: 'What are ipad (0x36) and opad (0x5C)?',
      category: 'architecture',
      icon: Layers,
      summary: 'The magic constants of RFC 2104',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <code className="text-emerald-300 font-mono">ipad</code> (Inner Pad) and <code className="text-purple-300 font-mono">opad</code> (Outer Pad) are repeating constant byte arrays of length $B$:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="p-3 bg-slate-950 rounded-lg border border-emerald-900/50">
              <span className="text-emerald-400 font-bold block mb-1">ipad = 0x36 × B</span>
              Binary: <code className="text-emerald-200">00110110</code>
              <p className="mt-1 text-[10px] text-slate-400 font-sans">Alternating repeating bit pairs.</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/50">
              <span className="text-purple-400 font-bold block mb-1">opad = 0x5C × B</span>
              Binary: <code className="text-purple-200">01011100</code>
              <p className="mt-1 text-[10px] text-slate-400 font-sans">Large Hamming distance from ipad.</p>
            </div>
          </div>
          <p>
            <strong>Why these values?</strong> The byte values 0x36 and 0x5C were carefully chosen by Mihir Bellare, Ran Canetti, and Hugo Krawczyk. They differ in 4 of their 8 bits (Hamming distance = 4) and feature high bit variance, guaranteeing that (K′ ⊕ ipad) and (K′ ⊕ opad) derive two statistically independent pseudo-keys without sharing state.
          </p>
        </div>
      ),
    },
    {
      id: 'why-two-hashes',
      title: 'Why are TWO Nested Hash Operations Used?',
      category: 'security',
      icon: AlertTriangle,
      summary: 'Defeating Length Extension Attacks on Merkle-Damgård hashes',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            You might wonder: <em>Why not just hash the key and message simply as H(K ∥ m)?</em>
          </p>
          <div className="p-3 bg-rose-950/40 rounded-lg border border-rose-900/60 text-slate-300 space-y-2">
            <div className="text-rose-400 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>The Length Extension Vulnerability in H(K ∥ m)</span>
            </div>
            <p className="text-[11px]">
              Most common hash algorithms (MD5, SHA-1, SHA-256, SHA-512) use the <strong>Merkle-Damgård construction</strong>. The final output of the hash is the exact internal state of the hash register after processing the last block!
            </p>
            <p className="text-[11px]">
              An attacker intercepting H(K ∥ m) can initialize a new hash state with that value and append extra data m_extra, generating a valid hash for H(K ∥ m ∥ padding ∥ m_extra) <strong>without ever knowing the secret key K!</strong>
            </p>
          </div>
          <p>
            <strong>How HMAC stops it:</strong> The outer hash pass H(K_o ∥ InnerHash) hashes the output of the inner hash. The attacker never sees the internal state of the outer hash, making length extension attacks mathematically impossible.
          </p>
        </div>
      ),
    },
    {
      id: 'hmac-vs-hash',
      title: 'HMAC vs Simple Hash: H(K ∥ m) vs H(m ∥ K)',
      category: 'security',
      icon: FileCheck,
      summary: 'Comparison of common authentication schemes',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-2">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-mono text-rose-400 font-bold">1. H(K ∥ m) — Prefix Construction (Insecure)</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Vulnerable to length extension attacks. Anyone can forge signatures for extended messages.
              </p>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-mono text-amber-400 font-bold">2. H(m ∥ K) — Suffix Construction (Weak)</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Vulnerable to collision attacks. If an attacker finds two messages $m_1, m_2$ such that $H(m_1) = H(m_2)$, then $H(m_1 \parallel K) = H(m_2 \parallel K)$.
              </p>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-emerald-900/60">
              <span className="font-mono text-emerald-400 font-bold">3. HMAC(K, m) — Nested Construction (Secure & Standard)</span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Immune to both length extension and simple collision attacks. Mathematically proven to remain secure as long as the underlying hash compression function is a pseudorandom function (PRF).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'hmac-vs-encryption',
      title: 'HMAC vs Symmetric Encryption (e.g. AES)',
      category: 'security',
      icon: Lock,
      summary: 'Integrity & Authentication vs Confidentiality',
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-1">HMAC (Authentication Tag)</span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• <strong>Goal:</strong> Authenticity & Integrity.</li>
                <li>• <strong>Visibility:</strong> Message remains in plaintext; anyone can read it.</li>
                <li>• <strong>Property:</strong> Verifies the sender has the key and message is untouched.</li>
              </ul>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-purple-400 block mb-1">AES Encryption (Ciphertext)</span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• <strong>Goal:</strong> Confidentiality & Privacy.</li>
                <li>• <strong>Visibility:</strong> Message is scrambled; unreadable without decryption key.</li>
                <li>• <strong>Modern standard:</strong> Authenticated Encryption (e.g. AES-GCM or AES-CBC + HMAC).</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredConcepts =
    filterCategory === 'all'
      ? concepts
      : concepts.filter((c) => c.category === filterCategory);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">
              HMAC Cryptography Knowledge Base & Concepts
            </h3>
            <p className="text-xs text-slate-400">
              Essential theoretical foundations, design rationale, and security properties.
            </p>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'basics', label: 'Basics' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'security', label: 'Security & Attacks' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterCategory === cat.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredConcepts.map((item) => {
          const isOpen = openId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-cyan-500/40 bg-slate-950 shadow-lg'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full p-4 flex items-center justify-between text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`p-2 rounded-lg border ${
                      isOpen
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-100">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{item.summary}</p>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 pt-0 border-t border-slate-900 mt-1">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
