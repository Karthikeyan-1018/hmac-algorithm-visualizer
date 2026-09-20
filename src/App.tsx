import { useState, useEffect, useCallback } from 'react';
import type {
  HashAlgorithm,
  HMACCalculationResult,
  PresetSample,
} from './crypto/hmac';
import {
  calculateHMACOverview,
  PRESET_SAMPLES,
} from './crypto/hmac';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { FlowDiagram } from './components/FlowDiagram';
import { StepNavigator } from './components/StepNavigator';
import { StepCard } from './components/StepCard';
import { TamperDemo } from './components/TamperDemo';
import { ConceptsSection } from './components/ConceptsSection';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
} from 'lucide-react';

export function App() {
  // Application State
  const [message, setMessage] = useState<string>('Hello HMAC');
  const [secretKey, setSecretKey] = useState<string>('secret123');
  const [algo, setAlgo] = useState<HashAlgorithm>('SHA-256');

  // Step state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(false);
  const [animationSpeedMs, setAnimationSpeedMs] = useState<number>(2200);

  // Calculation results
  const [result, setResult] = useState<HMACCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [copiedHmac, setCopiedHmac] = useState<boolean>(false);

  // Trigger calculation whenever inputs change
  const computeHMAC = useCallback(async (msg: string, key: string, algorithm: HashAlgorithm) => {
    setIsCalculating(true);
    try {
      const res = await calculateHMACOverview(msg, key, algorithm);
      setResult(res);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  useEffect(() => {
    computeHMAC(message, secretKey, algo);
  }, [message, secretKey, algo, computeHMAC]);

  // Handler to load preset
  const handleLoadPreset = (preset: PresetSample) => {
    setMessage(preset.message);
    setSecretKey(preset.key);
    setAlgo(preset.algo);
    setCurrentStep(1);
    setIsPlaying(false);
  };

  // Handler to reset inputs to default sample
  const handleReset = () => {
    setMessage(PRESET_SAMPLES[0].message);
    setSecretKey(PRESET_SAMPLES[0].key);
    setAlgo(PRESET_SAMPLES[0].algo);
    setCurrentStep(1);
    setIsPlaying(false);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyFinalHmac = () => {
    if (result) {
      navigator.clipboard.writeText(result.step7.finalHmacHex);
      setCopiedHmac(true);
      setTimeout(() => setCopiedHmac(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Header */}
      <Header onScrollToSection={scrollToSection} />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Intro banner */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span> Easy Cryptography Learning </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Explore HMAC Internals Step-by-Step
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Understand how normalized keys, constants (<code className="text-emerald-400">ipad</code> &amp; <code className="text-purple-400">opad</code>), bitwise XOR operations, and nested hashing produce tamper-proof authentication tags.
          </p>
        </div>

        {/* 2. Input Section */}
        <section id="input-section" className="scroll-mt-20">
          <InputSection
            message={message}
            setMessage={setMessage}
            secretKey={secretKey}
            setSecretKey={setSecretKey}
            algo={algo}
            setAlgo={setAlgo}
            onGenerate={() => computeHMAC(message, secretKey, algo)}
            onReset={handleReset}
            onLoadPreset={handleLoadPreset}
            isGenerating={isCalculating}
          />
        </section>

        {/* 3. HMAC Flow Diagram */}
        <section id="diagram-section" className="scroll-mt-20">
          <FlowDiagram
            currentStep={currentStep}
            onSelectStep={(step) => {
              setCurrentStep(step);
              setIsPlaying(false);
              scrollToSection('step-details-section');
            }}
            result={result}
            algo={algo}
          />
        </section>

        {/* 4. Step-by-Step Stepper & Animation Controller */}
        <section id="stepper-section" className="scroll-mt-20">
          <StepNavigator
            currentStep={currentStep}
            totalSteps={7}
            onStepChange={(step) => setCurrentStep(step)}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            showAllSteps={showAllSteps}
            onToggleShowAll={() => {
              setShowAllSteps(!showAllSteps);
              setIsPlaying(false);
            }}
            animationSpeedMs={animationSpeedMs}
            onSpeedChange={(speed) => setAnimationSpeedMs(speed)}
          />
        </section>

        {/* 5 & 6. Current Step Details / Hex & Byte Viewers */}
        <section id="step-details-section" className="scroll-mt-20 space-y-6">
          {result && (
            <>
              {showAllSteps ? (
                <div className="space-y-8">
                  {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                    <div key={step} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center">
                          {step}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Stage {step} of 7
                        </span>
                      </div>
                      <StepCard stepNumber={step} result={result} algo={algo} />
                    </div>
                  ))}
                </div>
              ) : (
                <StepCard stepNumber={currentStep} result={result} algo={algo} />
              )}
            </>
          )}
        </section>

        {/* 7. Final HMAC Output Callout */}
        {result && (
          <section id="final-hmac-section" className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base text-slate-100">
                    Final HMAC Authentication Result
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated in-browser via pure JavaScript and validated with SubtleCrypto.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>RFC 2104 Validated</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>HMAC Hex ({result.step7.outputLengthBytes} bytes / {result.step7.outputLengthBits} bits):</span>
                <span>Algorithm: <strong className="text-cyan-300">{algo}</strong></span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm sm:text-base text-emerald-300 break-all select-all font-semibold tracking-wider flex items-center justify-between gap-3 shadow-inner">
                <span>{result.step7.finalHmacHex}</span>
                <button
                  onClick={handleCopyFinalHmac}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-sans transition-colors cursor-pointer"
                  title="Copy HMAC to clipboard"
                >
                  {copiedHmac ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 8. Tamper Detection Demo */}
        {result && (
          <section id="tamper-section" className="scroll-mt-20">
            <TamperDemo
              originalMessage={message}
              originalKey={secretKey}
              originalHmacHex={result.step7.finalHmacHex}
              algo={algo}
            />
          </section>
        )}

        {/* 9. Concepts & Knowledge Base Section */}
        <section id="concepts-section" className="scroll-mt-20">
          <ConceptsSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-medium">
          <span>HMAC: Keyed-Hashing for Message Authentication</span>
          <span>•</span>
          <span>RFC 2104 / RFC 4231 Standard</span>
          <span>•</span>
          <span>Pure Client-Side WebCrypto Execution</span>
        </div>
        <p className="text-slate-600 text-[11px]">
          Created for Applied Cryptography Interactive Demonstration & Education.
        </p>
      </footer>
    </div>
  );
}

export default App;
