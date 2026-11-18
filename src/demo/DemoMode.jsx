import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Activity,
  Sliders,
  Eye,
  Sun,
  Type,
  AlignJustify,
  ShieldCheck,
  ChevronRight,
  Layers,
  Award,
  ArrowLeft
} from 'lucide-react';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { learningStorage } from '../learning/learningStorage.js';

export function DemoMode() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProfile, setActiveProfile] = useState({
    fontFamily: 'Inter',
    fontSize: 16,
    lineSpacing: 1.4,
    theme: 'default',
    focusMode: false,
    reducedMotion: false
  });
  const [confidenceData, setConfidenceData] = useState({
    fontSize: 0,
    lineSpacing: 0,
    theme: 0,
    focusMode: 0,
    overall: 65
  });
  const [logs, setLogs] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [evolvedNotice, setEvolvedNotice] = useState(null);

  const steps = [
    {
      id: 0,
      title: '1. Initial Baseline Fingerprint',
      user: 'Sarah',
      description: 'Sarah has just completed initial onboarding with standard 16px text and 1.4x line spacing.',
      action: 'Baseline Established',
      profile: { fontFamily: 'Inter', fontSize: 16, lineSpacing: 1.4, theme: 'default', focusMode: false },
      confidence: { fontSize: 15, lineSpacing: 15, theme: 20, focusMode: 10, overall: 60 },
      log: 'Initialized baseline profile: Inter, 16px, 1.4x, Default theme.'
    },
    {
      id: 1,
      title: '2. User Adjusts Text Size on Articles',
      user: 'Sarah',
      description: 'While reading dense multi-column tech news, Sarah manually increases text size to 18px multiple times.',
      action: 'Font Size: 16px → 18px (3 adjustments logged)',
      profile: { fontFamily: 'Inter', fontSize: 18, lineSpacing: 1.4, theme: 'default', focusMode: false },
      confidence: { fontSize: 62, lineSpacing: 25, theme: 20, focusMode: 15, overall: 72 },
      log: 'Observed repeated font_size_change to 18px across 3 articles. Confidence rising to 62%.'
    },
    {
      id: 2,
      title: '3. User Expands Line Spacing & Font Family',
      user: 'Sarah',
      description: 'Sarah consistently sets line spacing to 1.7x and tests Lexend for easier character distinction.',
      action: 'Spacing: 1.4x → 1.7x & Lexend Selected',
      profile: { fontFamily: 'Lexend', fontSize: 18, lineSpacing: 1.7, theme: 'default', focusMode: false },
      confidence: { fontSize: 78, lineSpacing: 84, theme: 35, focusMode: 20, overall: 81 },
      log: 'Observed line_spacing_change to 1.7x (5 sessions). Spacing confidence: 84%.'
    },
    {
      id: 3,
      title: '4. User Enables Warm Theme & Focus Mode',
      user: 'Sarah',
      description: 'During a 20-minute evening session, Sarah activates Focus Mode and switches to Warm parchment tone.',
      action: 'Theme: Warm Parchment & Focus Mode: ON',
      profile: { fontFamily: 'Lexend', fontSize: 18, lineSpacing: 1.7, theme: 'warm', focusMode: true },
      confidence: { fontSize: 87, lineSpacing: 91, theme: 76, focusMode: 82, overall: 89 },
      log: 'Extended reading session observed. Focus Mode & Warm theme pattern established.'
    },
    {
      id: 4,
      title: '5. AccessAI Generates Explainable Suggestion',
      user: 'Sarah',
      description: 'Confidence scores cross the 85% threshold. AccessAI presents a transparent, non-intrusive suggestion.',
      action: 'Suggestion Prompt Displayed',
      profile: { fontFamily: 'Lexend', fontSize: 18, lineSpacing: 1.7, theme: 'warm', focusMode: true },
      confidence: { fontSize: 87, lineSpacing: 91, theme: 76, focusMode: 82, overall: 89 },
      recommendation: {
        title: 'Update Reading Fingerprint?',
        explanation: 'AccessAI noticed that you frequently increase text size to 18px and use 1.7x spacing on articles (87% confidence).',
        buttonText: 'Approve Profile Evolution'
      },
      log: 'Explainable recommendation generated: evolve_fingerprint_sarah.'
    },
    {
      id: 5,
      title: '6. Reading Fingerprint Successfully Evolves',
      user: 'Sarah',
      description: 'Sarah approves the update. AccessAI now applies Lexend 18px with 1.7x spacing & Warm theme automatically across all websites!',
      action: 'Adaptive Evolution Complete',
      profile: { fontFamily: 'Lexend', fontSize: 18, lineSpacing: 1.7, theme: 'warm', focusMode: true },
      confidence: { fontSize: 94, lineSpacing: 96, theme: 88, focusMode: 90, overall: 94 },
      evolved: true,
      log: 'Personal Reading Fingerprint permanently evolved and saved to IndexedDB!'
    }
  ];

  const applyStep = (stepIdx) => {
    const s = steps[stepIdx];
    setCurrentStep(stepIdx);
    setActiveProfile(s.profile);
    setConfidenceData(s.confidence);
    setRecommendation(s.recommendation || null);
    if (s.evolved) {
      setEvolvedNotice('Reading Fingerprint updated: Lexend 18px, 1.7x Line Spacing, Warm Parchment Theme.');
    } else {
      setEvolvedNotice(null);
    }
    setLogs(prev => [
      { time: new Date().toLocaleTimeString(), text: s.log },
      ...prev.slice(0, 7)
    ]);
  };

  useEffect(() => {
    applyStep(0);
  }, []);

  // Auto-play timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            const next = prev + 1;
            applyStep(next);
            return next;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleApproveEvolution = async () => {
    await adaptiveEngine.updateCurrentProfile(activeProfile);
    applyStep(5);
  };

  const handleResetDemo = () => {
    setIsPlaying(false);
    applyStep(0);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#FFF8FA] text-[#291923] flex flex-col font-sans selection:bg-[#F4C7D5] selection:text-[#421426]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#F4C7D5]/70 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="index.html"
              className="w-10 h-10 rounded-xl bg-[#421426] text-white flex items-center justify-center font-bold text-base shadow-sm hover:bg-[#70243E] transition-colors relative"
            >
              <Play className="w-4 h-4 fill-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D8FF56] border-2 border-white" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <a href="index.html" className="font-extrabold text-[#421426] text-base hover:underline">
                  AccessAI Simulator
                </a>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#70243E] border border-[#F4C7D5]">
                  Live Scenario
                </span>
              </div>
              <p className="text-xs text-[#806C77]">
                Simulation of Sarah's adaptive reading evolution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#421426] hover:bg-[#70243E] text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Auto-Play Scenario'}</span>
            </button>

            <button
              onClick={handleResetDemo}
              className="p-2 rounded-xl bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] border border-[#F4C7D5] transition"
              title="Reset Demo to Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <a
              href="index.html"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-xs font-semibold border border-[#F4C7D5] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Studio</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Evolution Celebration Banner */}
        {evolvedNotice && (
          <div className="p-4 rounded-2xl bg-white border border-[#D8FF56] shadow-sm flex items-center justify-between gap-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D8FF56]/30 text-[#421426]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#291923]">
                  Personal Reading Fingerprint Evolved!
                </h3>
                <p className="text-xs text-[#806C77] mt-0.5">
                  {evolvedNotice}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D8FF56] text-[#421426]">
              Evolved Successfully
            </span>
          </div>
        )}

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsPlaying(false);
                applyStep(idx);
              }}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                currentStep === idx
                  ? 'bg-white border-[#8E294B] ring-2 ring-[#F4C7D5] shadow-sm'
                  : currentStep > idx
                  ? 'bg-[#F9E8EE]/50 border-[#F4C7D5] text-[#421426]'
                  : 'bg-white/60 border-[#F9E8EE] text-[#806C77]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase text-[#806C77]">Step {idx + 1}</span>
                {currentStep > idx ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8E294B]" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${currentStep === idx ? 'bg-[#8E294B] animate-pulse' : 'bg-[#F4C7D5]'}`} />
                )}
              </div>
              <div className="text-xs font-bold text-[#291923] truncate">{s.title.split('. ')[1]}</div>
            </button>
          ))}
        </div>

        {/* Core Demo Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Storyboard & Learning Engine Metrics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Storyboard Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Scenario Progression
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-mono font-semibold">
                  Reader: Sarah
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#291923]">
                  {steps[currentStep].title}
                </h2>
                <p className="text-xs text-[#806C77] leading-relaxed">
                  {steps[currentStep].description}
                </p>

                <div className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] flex items-center justify-between text-xs">
                  <span className="text-[#806C77] font-medium">Observed Action:</span>
                  <span className="font-mono text-[#421426] font-bold">{steps[currentStep].action}</span>
                </div>
              </div>

              {/* Suggestion Card if step 4 */}
              {recommendation && (
                <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#8E294B] shadow-sm space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center gap-1.5 text-[#8E294B] text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4 text-[#8E294B]" />
                    {recommendation.title}
                  </div>
                  <p className="text-xs text-[#806C77] leading-relaxed">
                    {recommendation.explanation}
                  </p>
                  <button
                    onClick={handleApproveEvolution}
                    className="w-full py-2 px-3 bg-[#421426] hover:bg-[#70243E] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D8FF56]" />
                    <span>{recommendation.buttonText}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Confidence Gauges Live Panel */}
            <div className="p-5 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#8E294B]" />
                  Learned Confidence Engine
                </h3>
                <span className="text-sm font-bold text-[#421426] font-mono">
                  {confidenceData.overall}% Total
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Font Size Gauge */}
                <div>
                  <div className="flex justify-between text-[#806C77] mb-1 font-semibold">
                    <span>Font Size (18px)</span>
                    <span className="font-mono font-bold text-[#421426]">{confidenceData.fontSize}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8E294B] rounded-full transition-all duration-700"
                      style={{ width: `${confidenceData.fontSize}%` }}
                    />
                  </div>
                </div>

                {/* Line Spacing Gauge */}
                <div>
                  <div className="flex justify-between text-[#806C77] mb-1 font-semibold">
                    <span>Line Spacing (1.7x)</span>
                    <span className="font-mono font-bold text-[#421426]">{confidenceData.lineSpacing}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8E294B] rounded-full transition-all duration-700"
                      style={{ width: `${confidenceData.lineSpacing}%` }}
                    />
                  </div>
                </div>

                {/* Theme Gauge */}
                <div>
                  <div className="flex justify-between text-[#806C77] mb-1 font-semibold">
                    <span>Warm Tone Alignment</span>
                    <span className="font-mono font-bold text-[#421426]">{confidenceData.theme}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#70243E] rounded-full transition-all duration-700"
                      style={{ width: `${confidenceData.theme}%` }}
                    />
                  </div>
                </div>

                {/* Focus Mode Gauge */}
                <div>
                  <div className="flex justify-between text-[#806C77] mb-1 font-semibold">
                    <span>Focus Mode Tendency</span>
                    <span className="font-mono font-bold text-[#421426]">{confidenceData.focusMode}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#421426] rounded-full transition-all duration-700"
                      style={{ width: `${confidenceData.focusMode}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Event Log Feed */}
            <div className="p-4 rounded-2xl bg-white border border-[#F9E8EE] text-[11px] font-mono space-y-1.5 max-h-40 overflow-y-auto">
              <div className="text-[10px] text-[#806C77] uppercase font-sans font-bold mb-1">
                Local Event Bus (Zero Cloud Sync)
              </div>
              {logs.map((l, i) => (
                <div key={i} className="text-[#806C77] flex items-start gap-2">
                  <span className="text-[#8E294B] shrink-0">[{l.time}]</span>
                  <span className="text-[#291923]">{l.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live In-Page Reading Experience (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#291923]">
                  <Eye className="w-4 h-4 text-[#8E294B]" />
                  <span>Simulated Web Article: Scientific American</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-mono font-bold">
                    {activeProfile.fontFamily}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-mono font-bold">
                    {activeProfile.fontSize}px
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-mono font-bold">
                    {activeProfile.lineSpacing}x
                  </span>
                </div>
              </div>

              {/* Simulated Article Body adhering to activeProfile */}
              <div
                className={`p-8 rounded-2xl border transition-all duration-500 min-h-[440px] flex flex-col justify-between ${
                  activeProfile.theme === 'warm'
                    ? 'bg-[#FAF4E6] text-[#2E241E] border-amber-300 shadow-sm'
                    : activeProfile.theme === 'dark'
                    ? 'bg-[#291923] text-[#F9E8EE] border-[#70243E]'
                    : 'bg-white text-[#291923] border-[#F4C7D5]'
                }`}
                style={{
                  fontFamily: activeProfile.fontFamily,
                  fontSize: `${activeProfile.fontSize}px`,
                  lineHeight: activeProfile.lineSpacing
                }}
              >
                <div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-60 mb-2">
                    Neuroscience & Cognitive Reading
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight mb-4" style={{ lineHeight: 1.25 }}>
                    Why Visual Typography Shapes Cognitive Endurance
                  </h1>
                  <div className="text-xs opacity-70 mb-6 font-mono">
                    Published Research • 6 min read
                  </div>

                  <p className="mb-4">
                    For decades, digital accessibility has been treated as a static checklist for web developers. A button in the corner would toggle high contrast or magnify the entire page, often breaking navigational layouts and creating visual friction.
                  </p>

                  <p className="mb-4">
                    When digital typography dynamically aligns with an individual's personal perceptual ergonomics, cognitive load drops significantly. Lexend and Atkinson letterforms reduce saccadic disorientation and crowding effects.
                  </p>

                  <p>
                    With AccessAI's continuous adaptive learning, the user never has to repeatedly tune sliders. The web becomes naturally tailored to their evolving comfort.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t opacity-40 text-xs flex justify-between">
                  <span>Simulated AccessAI Content Engine</span>
                  <span>100% In-Browser Adaptation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
