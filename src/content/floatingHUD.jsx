import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Type,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Compass,
  Sliders,
  Check,
  X,
  Eye,
  Settings,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { SmartFocusEngine } from './smartFocus.js';
import { sessionTracker } from '../analytics/readingSession.js';

export function FloatingHUD({ initialProfile, currentProfile, pageCategory = 'general' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(currentProfile || initialProfile);
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [activeRecommendation, setActiveRecommendation] = useState(null);
  const [showLearningFeedback, setShowLearningFeedback] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Subscribe to engine state updates
    const unsubscribe = adaptiveEngine.subscribe((state) => {
      if (state.currentProfile) {
        setProfile(state.currentProfile);
      }
      setAdaptiveEnabled(state.adaptiveLearningEnabled);
      if (state.recommendations && state.recommendations.length > 0) {
        setActiveRecommendation(state.recommendations[0]);
      } else {
        setActiveRecommendation(null);
      }
    });

    // Initial load
    adaptiveEngine.getFullState(pageCategory, sessionTracker.getCurrentSession()).then(state => {
      setProfile(state.currentProfile);
      setAdaptiveEnabled(state.adaptiveLearningEnabled);
      if (state.recommendations && state.recommendations.length > 0) {
        setActiveRecommendation(state.recommendations[0]);
      }
    });

    return () => unsubscribe();
  }, [pageCategory]);

  const handleAdjust = async (dimension, value, eventType) => {
    const fromVal = profile[dimension];
    const newProfile = { ...profile, [dimension]: value };
    setProfile(newProfile);

    // Track session adjustment count
    sessionTracker.recordAdjustment();

    // Trigger visual style injection immediately
    window.dispatchEvent(new CustomEvent('accessai:apply_profile', { detail: newProfile }));

    // Record interaction event into Adaptive Learning Engine
    const result = await adaptiveEngine.recordInteraction({
      type: eventType || `${dimension}_change`,
      dimension,
      from: fromVal,
      to: value,
      category: pageCategory
    });

    // Provide subtle learning feedback if confidence increased
    if (result && result.learned && adaptiveEnabled) {
      const confPercent = Math.round((result.learnedData?.confidence || 0.5) * 100);
      setShowLearningFeedback({
        dimension,
        text: `Learned preference (${confPercent}% confidence)`,
        evolved: result.profileUpdated
      });
      setTimeout(() => setShowLearningFeedback(null), 3200);
    }
  };

  const handleAcceptRecommendation = async (rec) => {
    await adaptiveEngine.applyRecommendation(rec.id, rec.targetDimension, rec.suggestedValue, rec.type === 'profile_evolution');
    setActiveRecommendation(null);
    setShowLearningFeedback({
      dimension: rec.targetDimension,
      text: 'Reading Fingerprint updated!',
      evolved: true
    });
    setTimeout(() => setShowLearningFeedback(null), 3500);
  };

  const handleDismissRecommendation = async (rec) => {
    await adaptiveEngine.dismissRecommendation(rec.id);
    setActiveRecommendation(null);
  };

  const themes = [
    { id: 'default', label: 'Std', bg: 'bg-white', text: 'text-[#291923]', border: 'border-[#F4C7D5]' },
    { id: 'warm', label: 'Warm', bg: 'bg-[#FAF4E6]', text: 'text-[#2E241E]', border: 'border-amber-300' },
    { id: 'dark', label: 'Dark', bg: 'bg-[#291923]', text: 'text-[#F9E8EE]', border: 'border-[#70243E]' },
    { id: 'dyslexia', label: 'Peach', bg: 'bg-[#F4EDD8]', text: 'text-[#1A1E24]', border: 'border-amber-400' },
    { id: 'high-contrast', label: 'Lime', bg: 'bg-black', text: 'text-[#D8FF56]', border: 'border-[#D8FF56]' },
  ];

  const fonts = [
    { id: 'Inter', name: 'Inter (Sans)' },
    { id: 'Lexend', name: 'Lexend (Cognitive)' },
    { id: 'Atkinson Hyperlegible', name: 'Atkinson Hyperlegible' },
    { id: 'OpenDyslexic', name: 'OpenDyslexic' },
    { id: 'Merriweather', name: 'Merriweather (Serif)' },
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[2147483647] font-sans">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#421426] text-white rounded-full shadow-lg border border-[#70243E] hover:bg-[#70243E] transition-all group"
          aria-label="Expand AccessAI controls"
        >
          <div className="w-5 h-5 rounded-full bg-[#D8FF56] text-[#421426] flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="text-xs font-bold text-white">AccessAI</span>
          <ChevronUp className="w-3.5 h-3.5 text-[#D8FF56]" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[2147483647] font-sans antialiased text-[#291923] select-none">
      {/* Dynamic Recommendation Toast */}
      {activeRecommendation && (
        <div
          role="alert"
          className="mb-3 max-w-sm p-4 rounded-2xl bg-white border border-[#F4C7D5] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#F9E8EE] text-[#8E294B] shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#8E294B] uppercase tracking-wider">
                  Adaptive Suggestion
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D8FF56]/30 text-[#421426] font-mono font-bold">
                  {Math.round(activeRecommendation.confidence * 100)}% match
                </span>
              </div>
              <p className="text-xs font-bold text-[#291923] mt-1">
                {activeRecommendation.title}
              </p>
              <p className="text-xs text-[#806C77] mt-1 leading-relaxed">
                {activeRecommendation.explanation}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => handleAcceptRecommendation(activeRecommendation)}
                  className="px-3 py-1.5 bg-[#421426] hover:bg-[#70243E] text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-[#D8FF56]" />
                  <span>{activeRecommendation.actions[0]?.label || 'Apply'}</span>
                </button>
                <button
                  onClick={() => handleDismissRecommendation(activeRecommendation)}
                  className="px-2.5 py-1.5 bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#806C77] rounded-lg text-xs font-medium transition"
                >
                  {activeRecommendation.actions[1]?.label || 'Dismiss'}
                </button>
              </div>
            </div>
            <button
              onClick={() => handleDismissRecommendation(activeRecommendation)}
              className="text-[#806C77] hover:text-[#421426]"
              aria-label="Close suggestion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Real-time Learning Feedback Badge */}
      {showLearningFeedback && (
        <div className="mb-2 flex items-center justify-end">
          <div className="px-3 py-1.5 rounded-full text-xs font-bold shadow-md border flex items-center gap-2 transition-all bg-[#421426] text-white border-[#70243E]">
            <Sparkle className="w-3.5 h-3.5 text-[#D8FF56] animate-spin" />
            <span>{showLearningFeedback.text}</span>
          </div>
        </div>
      )}

      {/* Expanded Control Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 p-5 rounded-2xl bg-white border border-[#F4C7D5] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#421426] text-[#D8FF56] flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-bold text-sm text-[#291923]">AccessAI HUD</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-semibold capitalize">
                {pageCategory}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE] transition"
                title="Minimize HUD"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE] transition"
                title="Close drawer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 py-3 text-xs max-h-96 overflow-y-auto pr-1">
            {/* Typography Choice */}
            <div>
              <label className="text-[#806C77] font-semibold block mb-1">Typography Font</label>
              <select
                value={profile.fontFamily}
                onChange={(e) => handleAdjust('fontFamily', e.target.value, 'font_change')}
                className="w-full bg-[#FFF8FA] border border-[#F4C7D5] text-[#291923] rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
              >
                {fonts.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Font Size & Line Spacing Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[#806C77] font-semibold mb-1">
                  <span>Size</span>
                  <span className="font-mono text-[#8E294B]">{profile.fontSize}px</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjust('fontSize', Math.max(12, profile.fontSize - 1), 'font_size_change')}
                    className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] font-bold text-xs"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    step="1"
                    value={profile.fontSize}
                    onChange={(e) => handleAdjust('fontSize', Number(e.target.value), 'font_size_change')}
                    className="w-full accent-[#8E294B]"
                  />
                  <button
                    onClick={() => handleAdjust('fontSize', Math.min(28, profile.fontSize + 1), 'font_size_change')}
                    className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#806C77] font-semibold mb-1">
                  <span>Spacing</span>
                  <span className="font-mono text-[#8E294B]">{profile.lineSpacing}x</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjust('lineSpacing', Math.max(1.1, +(profile.lineSpacing - 0.1).toFixed(2)), 'line_spacing_change')}
                    className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] font-bold text-xs"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1.1"
                    max="2.4"
                    step="0.05"
                    value={profile.lineSpacing}
                    onChange={(e) => handleAdjust('lineSpacing', Number(e.target.value), 'line_spacing_change')}
                    className="w-full accent-[#8E294B]"
                  />
                  <button
                    onClick={() => handleAdjust('lineSpacing', Math.min(2.4, +(profile.lineSpacing + 0.1).toFixed(2)), 'line_spacing_change')}
                    className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Reading Themes Palette */}
            <div>
              <label className="text-[#806C77] font-semibold block mb-1">Reading Tone</label>
              <div className="grid grid-cols-5 gap-1">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleAdjust('theme', t.id, 'theme_change')}
                    className={`h-8 rounded-lg border text-center text-[10px] font-bold transition ${t.bg} ${t.text} ${t.border} ${
                      profile.theme === t.id ? 'ring-2 ring-[#8E294B] scale-105 shadow-sm' : 'opacity-85 hover:opacity-100'
                    }`}
                    title={t.label}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-[#F9E8EE] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#291923] font-medium">Smart Focus Mode</span>
                <button
                  onClick={() => {
                    const next = !profile.focusMode;
                    handleAdjust('focusMode', next, 'focus_mode_toggle');
                    SmartFocusEngine.applyFocusMode(next, pageCategory);
                  }}
                  className={`w-9 h-5 rounded-full transition-colors relative ${profile.focusMode ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${profile.focusMode ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#291923] font-medium">Reading Ruler</span>
                <button
                  onClick={() => {
                    const next = !profile.readingRuler;
                    handleAdjust('readingRuler', next, 'ruler_toggle');
                    SmartFocusEngine.toggleReadingRuler(next);
                  }}
                  className={`w-9 h-5 rounded-full transition-colors relative ${profile.readingRuler ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${profile.readingRuler ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#F9E8EE] flex items-center justify-between text-[11px] text-[#806C77]">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${adaptiveEnabled ? 'bg-[#D8FF56] border border-[#421426]' : 'bg-[#806C77]'}`} />
              <span>{adaptiveEnabled ? 'Adaptive Learning Active' : 'Fixed Fingerprint'}</span>
            </div>
            <a
              href="dashboard.html"
              target="_blank"
              rel="noreferrer"
              className="text-[#8E294B] font-bold hover:underline flex items-center gap-0.5"
            >
              Dashboard
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Quick Dock Pill */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#421426] text-white border border-[#70243E] shadow-xl">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs transition ${
            isOpen ? 'bg-[#70243E] text-white' : 'hover:bg-[#70243E]'
          }`}
          aria-expanded={isOpen}
          aria-label="AccessAI Quick Tuning Menu"
        >
          <div className="w-4 h-4 rounded-full bg-[#D8FF56] text-[#421426] flex items-center justify-center text-[10px] font-bold">
            A
          </div>
          <span>AccessAI</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#D8FF56]" /> : <ChevronUp className="w-3.5 h-3.5 text-[#D8FF56]" />}
        </button>

        {/* Quick Text Increase */}
        <button
          onClick={() => handleAdjust('fontSize', Math.min(28, profile.fontSize + 1), 'font_size_change')}
          className="w-8 h-8 rounded-full hover:bg-[#70243E] text-white flex items-center justify-center text-xs font-bold transition"
          title="Increase font size"
          aria-label="Increase text size"
        >
          A+
        </button>

        {/* Quick Text Decrease */}
        <button
          onClick={() => handleAdjust('fontSize', Math.max(12, profile.fontSize - 1), 'font_size_change')}
          className="w-8 h-8 rounded-full hover:bg-[#70243E] text-white flex items-center justify-center text-xs font-bold transition"
          title="Decrease font size"
          aria-label="Decrease text size"
        >
          A-
        </button>

        {/* Quick Theme Cycle */}
        <button
          onClick={() => {
            const currentIdx = themes.findIndex(t => t.id === profile.theme);
            const nextIdx = (currentIdx + 1) % themes.length;
            handleAdjust('theme', themes[nextIdx].id, 'theme_change');
          }}
          className="w-8 h-8 rounded-full hover:bg-[#70243E] text-[#D8FF56] flex items-center justify-center transition"
          title="Cycle reading theme"
          aria-label="Cycle reading theme"
        >
          <Sun className="w-4 h-4" />
        </button>

        {/* Quick Focus Toggle */}
        <button
          onClick={() => {
            const next = !profile.focusMode;
            handleAdjust('focusMode', next, 'focus_mode_toggle');
            SmartFocusEngine.applyFocusMode(next, pageCategory);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
            profile.focusMode ? 'bg-[#D8FF56] text-[#421426]' : 'hover:bg-[#70243E] text-white'
          }`}
          title="Toggle Smart Focus Mode"
          aria-label="Toggle Focus Mode"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
