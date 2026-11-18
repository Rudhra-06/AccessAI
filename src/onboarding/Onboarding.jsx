import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Type,
  Sun,
  Eye,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { learningStorage, DEFAULT_INITIAL_PROFILE } from '../learning/learningStorage.js';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ ...DEFAULT_INITIAL_PROFILE });
  const [isCompleted, setIsCompleted] = useState(false);

  const fonts = [
    { id: 'Inter', name: 'Inter', desc: 'Modern, balanced geometric sans-serif for general clarity.' },
    { id: 'Lexend', name: 'Lexend', desc: 'Scientifically designed to reduce visual crowding and increase reading speed.' },
    { id: 'Atkinson Hyperlegible', name: 'Atkinson Hyperlegible', desc: 'Specially shaped glyphs to distinguish ambiguous characters.' },
    { id: 'OpenDyslexic', name: 'OpenDyslexic', desc: 'Weighted gravity bottoms to minimize letter inversion and rotation.' },
    { id: 'Merriweather', name: 'Merriweather', desc: 'Warm serif typography optimized for extended long-form reading.' }
  ];

  const themes = [
    { id: 'default', name: 'Crisp White', desc: 'Crisp, modern standard contrast.', bg: 'bg-white', text: 'text-[#291923]', border: 'border-[#F4C7D5]' },
    { id: 'warm', name: 'Warm Parchment', desc: 'Soft sepia tone reduces blue-light glare during long reading.', bg: 'bg-[#FAF4E6]', text: 'text-[#2E241E]', border: 'border-amber-300' },
    { id: 'dyslexia', name: 'Dyslexia Peach', desc: 'Gentle peach/cream tint to soften high-contrast visual stress.', bg: 'bg-[#F4EDD8]', text: 'text-[#1A1E24]', border: 'border-amber-400' },
    { id: 'dark', name: 'Dark Berry Slate', desc: 'Deep charcoal-burgundy background for low-light comfort.', bg: 'bg-[#291923]', text: 'text-[#F9E8EE]', border: 'border-[#70243E]' },
    { id: 'high-contrast', name: 'High Contrast Lime', desc: 'Pure black & vibrant lime for maximum boundary distinction.', bg: 'bg-black', text: 'text-[#D8FF56]', border: 'border-[#D8FF56]' },
  ];

  const handleFinishAssessment = async () => {
    await learningStorage.setSetting('initialProfile', profile);
    await learningStorage.setSetting('currentProfile', { ...profile });
    await learningStorage.setSetting('adaptiveLearningEnabled', true);
    await learningStorage.addHistoryEntry({
      title: 'Initial Reading Fingerprint Calibrated',
      description: `Baseline established via interactive reading assessment: ${profile.fontFamily}, ${profile.fontSize}px, ${profile.lineSpacing}x spacing, ${profile.theme} theme.`,
      changes: profile,
      timestamp: new Date().toISOString()
    });
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8FA] text-[#291923] flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#F4C7D5] selection:text-[#421426]">
      <div className="max-w-2xl w-full">
        {/* Step Indicator */}
        {!isCompleted && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#421426] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                A
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#421426]">AccessAI Setup</span>
                <span className="text-[10px] text-[#806C77] block">Read Your Way</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-[#421426]' : s < step ? 'w-3 bg-[#8E294B]' : 'w-3 bg-[#F9E8EE]'
                    }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F9E8EE] shadow-sm">
          {/* STEP 1: Welcome & Philosophy */}
          {step === 1 && !isCompleted && (
            <div className="space-y-6">
              <div className="p-3 w-fit rounded-2xl bg-[#F9E8EE] text-[#8E294B] border border-[#F4C7D5]">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Personal Reading Calibration
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#291923] tracking-tight mt-1">
                  Accessibility attached to people, not websites.
                </h1>
                <p className="text-sm text-[#806C77] mt-2 leading-relaxed">
                  Welcome to AccessAI. Instead of forcing you to struggle through dense, fatiguing web pages, AccessAI creates a personal <span className="text-[#8E294B] font-bold">Reading Fingerprint</span> that seamlessly adapts websites to how you read best.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F4C7D5] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#421426] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#8E294B]" />
                  <span>100% In-Browser Privacy Guarantee</span>
                </div>
                <p className="text-[#806C77] leading-relaxed">
                  All learning models and preference evolution run completely in your local browser. No page text, browsing URLs, or passwords are ever captured or shared.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 px-4 bg-[#421426] hover:bg-[#70243E] text-white rounded-xl text-sm font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>Begin Quick Reading Calibration</span>
                <ArrowRight className="w-4 h-4 text-[#D8FF56]" />
              </button>
            </div>
          )}

          {/* STEP 2: Typography Selection */}
          {step === 2 && !isCompleted && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">Step 1 of 3</span>
                <h2 className="text-xl font-bold text-[#291923] mt-1">
                  Which typography feels most effortless to read?
                </h2>
                <p className="text-xs text-[#806C77] mt-1">
                  Select a font style. Notice how character weights and letterforms affect your visual comfort.
                </p>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {fonts.map(f => (
                  <div
                    key={f.id}
                    onClick={() => setProfile({ ...profile, fontFamily: f.id })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start justify-between gap-3 ${profile.fontFamily === f.id
                        ? 'bg-[#FFF8FA] border-[#8E294B] ring-2 ring-[#F4C7D5]'
                        : 'bg-white border-[#F9E8EE] hover:border-[#F4C7D5]'
                      }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-[#291923]" style={{ fontFamily: f.id }}>
                        {f.name} — The quick brown fox jumps over the lazy dog.
                      </div>
                      <div className="text-xs text-[#806C77] mt-1">{f.desc}</div>
                    </div>
                    {profile.fontFamily === f.id && (
                      <Check className="w-5 h-5 text-[#8E294B] shrink-0 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F9E8EE]">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806C77] hover:text-[#421426]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#421426] hover:bg-[#70243E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#D8FF56]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Scale & Spacing */}
          {step === 3 && !isCompleted && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">Step 2 of 3</span>
                <h2 className="text-xl font-bold text-[#291923] mt-1">
                  Calibrate Text Size & Line Spacing
                </h2>
                <p className="text-xs text-[#806C77] mt-1">
                  Adjust the sliders to find the optimal paragraph breathing room.
                </p>
              </div>

              {/* Live Preview Box */}
              <div
                className="p-5 rounded-2xl bg-[#FFF8FA] border border-[#F4C7D5] text-[#291923] transition-all"
                style={{
                  fontFamily: profile.fontFamily,
                  fontSize: `${profile.fontSize}px`,
                  lineHeight: profile.lineSpacing
                }}
              >
                AccessAI observes your reading habits unobtrusively. When you zoom into dense articles or switch to warm parchment themes, your profile learns without requiring manual reconfiguration.
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-white border border-[#F9E8EE]">
                  <div className="flex justify-between text-xs text-[#421426] font-semibold mb-2">
                    <span>Text Size</span>
                    <span className="text-[#8E294B] font-mono">{profile.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="24"
                    step="1"
                    value={profile.fontSize}
                    onChange={(e) => setProfile({ ...profile, fontSize: Number(e.target.value) })}
                    className="w-full accent-[#8E294B]"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#F9E8EE]">
                  <div className="flex justify-between text-xs text-[#421426] font-semibold mb-2">
                    <span>Line Spacing</span>
                    <span className="text-[#8E294B] font-mono">{profile.lineSpacing}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.2"
                    max="2.2"
                    step="0.05"
                    value={profile.lineSpacing}
                    onChange={(e) => setProfile({ ...profile, lineSpacing: Number(e.target.value) })}
                    className="w-full accent-[#8E294B]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F9E8EE]">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806C77] hover:text-[#421426]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-[#421426] hover:bg-[#70243E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#D8FF56]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Theme & Contrast */}
          {step === 4 && !isCompleted && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">Step 3 of 3</span>
                <h2 className="text-xl font-bold text-[#291923] mt-1">
                  Choose your Preferred Reading Tone
                </h2>
                <p className="text-xs text-[#806C77] mt-1">
                  Choose a background tone that feels most calming on your eyes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setProfile({ ...profile, theme: t.id })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${t.bg} ${t.text} ${t.border} ${profile.theme === t.id ? 'ring-2 ring-[#8E294B] scale-[1.02] shadow-sm' : 'opacity-85 hover:opacity-100'
                      }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>{t.name}</span>
                      {profile.theme === t.id && <Check className="w-4 h-4 text-[#8E294B]" />}
                    </div>
                    <p className="text-xs opacity-80 mt-1">{t.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F9E8EE]">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806C77] hover:text-[#421426]"
                >
                  Back
                </button>
                <button
                  onClick={handleFinishAssessment}
                  className="px-6 py-2.5 bg-[#421426] hover:bg-[#70243E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#D8FF56]" />
                  <span>Generate Reading Fingerprint</span>
                </button>
              </div>
            </div>
          )}

          {/* COMPLETED SCREEN */}
          {isCompleted && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#F9E8EE] text-[#421426] border border-[#F4C7D5] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-[#8E294B]" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#291923]">
                  Your Reading Fingerprint is Active!
                </h2>
                <p className="text-sm text-[#806C77] mt-2 max-w-md mx-auto">
                  Baseline calibrated to <strong className="text-[#421426]">{profile.fontFamily}</strong> at <strong className="text-[#421426]">{profile.fontSize}px</strong> with <strong className="text-[#421426]">{profile.lineSpacing}x</strong> spacing.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F4C7D5] text-left space-y-2 text-xs">
                <div className="font-bold text-[#421426] uppercase tracking-wider">What happens next?</div>
                <p className="text-[#806C77] leading-relaxed">
                  As you browse the web or use the Reading Studio, AccessAI automatically personalizes page styling. If you adjust settings via the floating HUD, AccessAI will gradually learn your context-specific preferences.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <a
                  href="index.html"
                  className="w-full sm:w-auto px-6 py-3 bg-[#421426] hover:bg-[#70243E] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#D8FF56]" />
                  <span>Open Reading Studio</span>
                </a>
                <a
                  href="dashboard.html"
                  className="w-full sm:w-auto px-6 py-3 bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] rounded-xl text-xs font-bold border border-[#F4C7D5] transition flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Open Dashboard</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
