import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Type,
  AlignJustify,
  Sun,
  Eye,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Save,
  Info
} from 'lucide-react';
import { learningStorage, DEFAULT_INITIAL_PROFILE } from '../learning/learningStorage.js';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';

export function ReadingFingerprint({ currentProfile, onProfileUpdated }) {
  const [mode, setMode] = useState('view'); // 'view' | 'assessment' | 'edit'
  const [step, setStep] = useState(1);
  const [tempProfile, setTempProfile] = useState({ ...currentProfile });
  const [notification, setNotification] = useState('');

  // Assessment Sample Comparisons
  const fontOptions = [
    {
      id: 'Inter',
      name: 'Inter',
      tag: 'Clean & Modern',
      desc: 'Balanced geometric proportions for everyday clarity.'
    },
    {
      id: 'Lexend',
      name: 'Lexend',
      tag: 'Cognitive Science Design',
      desc: 'Engineered specifically to reduce visual crowding and increase reading speed.'
    },
    {
      id: 'Atkinson Hyperlegible',
      name: 'Atkinson Hyperlegible',
      tag: 'High Letter Distinction',
      desc: 'Distinctive glyph shapes to prevent character confusion (b vs d, 0 vs O).'
    },
    {
      id: 'OpenDyslexic',
      name: 'OpenDyslexic',
      tag: 'Dyslexia Weighted',
      desc: 'Gravity-weighted letter bottoms to prevent letter rotation and inversion.'
    },
    {
      id: 'Merriweather',
      name: 'Merriweather',
      tag: 'Serif Warmth',
      desc: 'Traditional editorial serifs tailored for extended long-form reading.'
    }
  ];

  const scaleOptions = [
    { size: 14, label: 'Compact (14px)', desc: 'Fits more words per glance on large monitors' },
    { size: 16, label: 'Balanced (16px)', desc: 'Industry standard comfortable reading scale' },
    { size: 18, label: 'Enlarged (18px)', desc: 'Reduced eye strain for fatigue-prone sessions' },
    { size: 21, label: 'High Legibility (21px)', desc: 'Maximizes character clarity and distinction' }
  ];

  const spacingOptions = [
    { line: 1.35, letter: 0, word: 0, label: 'Standard Density', desc: 'Default web density' },
    { line: 1.55, letter: 0.3, word: 1, label: 'Comfortable Breathing Room', desc: 'Separates words and lines clearly' },
    { line: 1.8, letter: 0.8, word: 2.5, label: 'Wide Saccadic Guides', desc: 'Prevents skipping lines during tracking' }
  ];

  const widthOptions = [
    { width: 580, label: 'Narrow Column (580px)', desc: 'Minimizes horizontal eye travel back and forth' },
    { width: 740, label: 'Balanced Column (740px)', desc: 'Optimal 65-75 characters per line' },
    { width: 920, label: 'Wide Layout (920px)', desc: 'Accommodates multi-column articles' }
  ];

  const themeOptions = [
    {
      id: 'default',
      name: 'Crisp White',
      bgClass: 'bg-white text-[#291923] border-[#F4C7D5]',
      desc: 'Crisp standard white surface with deep berry typography.'
    },
    {
      id: 'warm',
      name: 'Warm Parchment',
      bgClass: 'bg-[#FAF4E6] text-[#2E241E] border-amber-300',
      desc: 'Soft amber/sepia tone reduces blue-light glare and visual stress.'
    },
    {
      id: 'dyslexia',
      name: 'Dyslexia Peach Tint',
      bgClass: 'bg-[#F4EDD8] text-[#1A1E24] border-amber-400',
      desc: 'Gentle peach hue to calm high-contrast perceptual jitter.'
    },
    {
      id: 'dark',
      name: 'Dark Berry Slate',
      bgClass: 'bg-[#291923] text-[#F9E8EE] border-[#70243E]',
      desc: 'Deep burgundy-charcoal for evening and low-light environments.'
    },
    {
      id: 'high-contrast',
      name: 'High Contrast Lime',
      bgClass: 'bg-black text-[#D8FF56] border-[#D8FF56]',
      desc: 'Extreme boundary distinction with vibrant lime typography.'
    }
  ];

  const focusOptions = [
    { id: 'spotlight', label: 'Sentence Spotlight', desc: 'Dims neighboring sentences when reading' },
    { id: 'ruler', label: 'Reading Ruler', desc: 'Horizontal guide band tracks your reading position' },
    { id: 'paragraph', label: 'Paragraph Highlight', desc: 'Gently illuminates active paragraph block' },
    { id: 'none', label: 'Unobtrusive Clean View', desc: 'Clean page view without overlays' }
  ];

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleCompleteAssessment = async () => {
    await adaptiveEngine.updateCurrentProfile(tempProfile);
    await learningStorage.setSetting('initialProfile', { ...tempProfile });
    await learningStorage.addHistoryEntry({
      title: 'Personal Reading Fingerprint Calibrated',
      description: `Assessment completed: ${tempProfile.fontFamily}, ${tempProfile.fontSize}px, ${tempProfile.lineSpacing}x spacing, ${tempProfile.theme} theme.`,
      changes: tempProfile,
      timestamp: new Date().toISOString()
    });

    if (onProfileUpdated) onProfileUpdated(tempProfile);
    setMode('view');
    notify('Your Personal Reading Fingerprint is saved and active!');
  };

  const handleSaveEdits = async () => {
    await adaptiveEngine.updateCurrentProfile(tempProfile);
    if (onProfileUpdated) onProfileUpdated(tempProfile);
    setMode('view');
    notify('Reading preferences updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-[#F9E8EE] border border-[#F4C7D5] text-[#421426] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#8E294B]" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIEW MODE: VISUAL READING FINGERPRINT CARD */}
      {mode === 'view' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-[#F9E8EE] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Personal Reading Identity
                </div>
                <h2 className="text-2xl font-extrabold text-[#291923] mt-1">
                  Your Personal Reading Fingerprint
                </h2>
                <p className="text-sm text-[#806C77] mt-1 max-w-xl leading-relaxed">
                  Every person processes typography differently. Your fingerprint synthesizes your individual spacing, contrast, font, and focus preferences into a portable profile.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setTempProfile({ ...currentProfile });
                    setMode('edit');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-xs font-bold transition border border-[#F4C7D5]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Preferences</span>
                </button>
                <button
                  onClick={() => {
                    setTempProfile({ ...currentProfile });
                    setStep(1);
                    setMode('assessment');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D8FF56]" />
                  <span>Retake Assessment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Core Fingerprint Attributes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Typography Preference */}
            <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Typography
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-semibold">
                  {currentProfile.fontSize}px
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#291923]" style={{ fontFamily: currentProfile.fontFamily }}>
                  {currentProfile.fontFamily}
                </h3>
                <p className="text-xs text-[#806C77] mt-1">
                  Optimized for character recognition with reduced letter confusion.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] text-xs text-[#421426]" style={{ fontFamily: currentProfile.fontFamily }}>
                "The quick brown fox jumps over the lazy dog."
              </div>
            </div>

            {/* 2. Spacing Preference */}
            <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Spacing & Clearance
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-semibold">
                  {currentProfile.lineSpacing}x
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#291923]">
                  {currentProfile.lineSpacing >= 1.7 ? 'Generous Air' : currentProfile.lineSpacing >= 1.5 ? 'Balanced Clearance' : 'Compact Lines'}
                </h3>
                <p className="text-xs text-[#806C77] mt-1">
                  Letter: +{currentProfile.letterSpacing || 0}px • Word: +{currentProfile.wordSpacing || 0}px
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] text-xs text-[#806C77]">
                Line clearance guides saccadic return sweeps effortlessly.
              </div>
            </div>

            {/* 3. Contrast & Theme */}
            <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Contrast & Tone
                </span>
                <span className="text-[11px] capitalize font-mono px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-semibold">
                  {currentProfile.theme}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#291923] capitalize">
                  {currentProfile.theme === 'warm' ? 'Warm Parchment' : currentProfile.theme === 'dyslexia' ? 'Dyslexia Peach' : currentProfile.theme === 'dark' ? 'Dark Berry' : currentProfile.theme === 'high-contrast' ? 'High Contrast Lime' : 'Crisp White'}
                </h3>
                <p className="text-xs text-[#806C77] mt-1">
                  Luminance balanced to mitigate screen glare and visual fatigue.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-[#F4C7D5] bg-[#FFF8FA]" title="Background" />
                <div className="w-5 h-5 rounded-full border border-[#F4C7D5] bg-[#421426]" title="Primary Text" />
                <div className="w-5 h-5 rounded-full border border-[#F4C7D5] bg-[#D8FF56]" title="Indicator" />
                <span className="text-[11px] text-[#806C77] font-mono">Palette Match</span>
              </div>
            </div>

            {/* 4. Reading Layout & Column Width */}
            <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Reading Width
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-semibold">
                  {currentProfile.contentWidth || 760}px
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#291923]">
                  {currentProfile.contentWidth <= 640 ? 'Focused Column' : currentProfile.contentWidth <= 800 ? 'Standard Column' : 'Expanded View'}
                </h3>
                <p className="text-xs text-[#806C77] mt-1">
                  Prevents lines from stretching beyond comfortable peripheral view.
                </p>
              </div>
              <div className="h-2 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8E294B]"
                  style={{ width: `${Math.min(100, ((currentProfile.contentWidth || 760) / 1000) * 100)}%` }}
                />
              </div>
            </div>

            {/* 5. Focus Preference */}
            <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Focus Mechanism
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#421426] font-semibold">
                  {currentProfile.readingRuler ? 'Ruler' : currentProfile.sentenceHighlight ? 'Spotlight' : currentProfile.focusMode ? 'Smart Focus' : 'Standard'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#291923]">
                  {currentProfile.readingRuler ? 'Reading Ruler Active' : currentProfile.focusMode ? 'Background Dimming' : 'Unobtrusive'}
                </h3>
                <p className="text-xs text-[#806C77] mt-1">
                  Distraction reduction level tailored to your reading style.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] text-xs text-[#806C77]">
                Assists focus during dense articles and multi-column web layouts.
              </div>
            </div>

            {/* 6. Reading Environment */}
            <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                  Environment
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#D8FF56]/30 text-[#421426] font-semibold border border-[#D8FF56]">
                  Adaptive
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#291923]">Adaptive Learning Active</h3>
                <p className="text-xs text-[#806C77] mt-1">
                  Adjustments made in the Reading Studio subtly calibrate this fingerprint over time.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#421426] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#8E294B]" />
                <span>100% In-Browser Privacy</span>
              </div>
            </div>
          </div>

          {/* Non-Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-[#F9E8EE]/60 border border-[#F4C7D5] flex items-start gap-3 text-xs text-[#806C77]">
            <Info className="w-5 h-5 text-[#8E294B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#421426]">Accessibility Notice:</strong> AccessAI creates an ergonomic reading profile tailored to your subjective visual comfort. It is not an assessment, diagnosis, or clinical evaluation of dyslexia, ADHD, or any medical condition.
            </p>
          </div>
        </div>
      )}

      {/* ASSESSMENT MODE: INTERACTIVE SAMPLE COMPARISON */}
      {mode === 'assessment' && (
        <div className="bg-white rounded-2xl border border-[#F9E8EE] p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F9E8EE]">
            <div>
              <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                Reading Calibration Step {step} of 5
              </span>
              <h2 className="text-xl font-bold text-[#291923] mt-0.5">
                {step === 1 && 'Which typography feels most comfortable to your eyes?'}
                {step === 2 && 'Calibrate your comfortable text scale'}
                {step === 3 && 'Choose your optimal line & letter breathing room'}
                {step === 4 && 'Select your preferred reading width'}
                {step === 5 && 'Choose a calming background and contrast tone'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(s => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? 'w-8 bg-[#421426]' : s < step ? 'w-3 bg-[#8E294B]' : 'w-3 bg-[#F9E8EE]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: TYPOGRAPHY COMPARISON */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#806C77]">
                Click the typography sample that feels easiest to read without straining or stumbling on letters:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {fontOptions.map(font => (
                  <div
                    key={font.id}
                    onClick={() => setTempProfile({ ...tempProfile, fontFamily: font.id })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      tempProfile.fontFamily === font.id
                        ? 'border-[#8E294B] bg-[#FFF8FA] ring-2 ring-[#F4C7D5]'
                        : 'border-[#F9E8EE] hover:border-[#F4C7D5] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#421426]">{font.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#8E294B]">
                        {font.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#806C77] mb-3">{font.desc}</p>
                    <div
                      className="p-3 rounded-lg bg-[#FFF8FA] border border-[#F9E8EE] text-sm text-[#291923]"
                      style={{ fontFamily: font.id }}
                    >
                      Accessible web reading allows every mind to absorb knowledge effortlessly and with joy.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: FONT SIZE COMPARISON */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[#806C77]">
                Select the text size where sentences feel comfortable without leaning toward the screen:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {scaleOptions.map(scale => (
                  <div
                    key={scale.size}
                    onClick={() => setTempProfile({ ...tempProfile, fontSize: scale.size })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      tempProfile.fontSize === scale.size
                        ? 'border-[#8E294B] bg-[#FFF8FA] ring-2 ring-[#F4C7D5]'
                        : 'border-[#F9E8EE] hover:border-[#F4C7D5] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#421426]">{scale.label}</span>
                      {tempProfile.fontSize === scale.size && (
                        <Check className="w-4 h-4 text-[#8E294B]" />
                      )}
                    </div>
                    <p className="text-xs text-[#806C77] mb-2">{scale.desc}</p>
                    <div
                      className="p-3 rounded-lg bg-[#FFF8FA] border border-[#F9E8EE] text-[#291923]"
                      style={{
                        fontFamily: tempProfile.fontFamily,
                        fontSize: `${scale.size}px`,
                        lineHeight: 1.45
                      }}
                    >
                      Clear character scaling reduces the cognitive effort required to recognize unfamiliar words.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SPACING COMPARISON */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-[#806C77]">
                Compare line and word clearance. Which allows your eyes to glide without line jumping?
              </p>
              <div className="space-y-3">
                {spacingOptions.map((spacing, idx) => (
                  <div
                    key={idx}
                    onClick={() => setTempProfile({
                      ...tempProfile,
                      lineSpacing: spacing.line,
                      letterSpacing: spacing.letter,
                      wordSpacing: spacing.word
                    })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      tempProfile.lineSpacing === spacing.line
                        ? 'border-[#8E294B] bg-[#FFF8FA] ring-2 ring-[#F4C7D5]'
                        : 'border-[#F9E8EE] hover:border-[#F4C7D5] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#421426]">{spacing.label}</span>
                      <span className="text-xs font-mono text-[#806C77]">{spacing.line}x line height</span>
                    </div>
                    <p className="text-xs text-[#806C77] mb-3">{spacing.desc}</p>
                    <div
                      className="p-3 rounded-lg bg-[#FFF8FA] border border-[#F9E8EE] text-sm text-[#291923]"
                      style={{
                        fontFamily: tempProfile.fontFamily,
                        fontSize: `${tempProfile.fontSize}px`,
                        lineHeight: spacing.line,
                        letterSpacing: `${spacing.letter}px`,
                        wordSpacing: `${spacing.word}px`
                      }}
                    >
                      When paragraphs have ample breathing room, visual crowding diminishes. Your gaze can track each line from start to finish without getting lost in adjacent text.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: READING WIDTH COMPARISON */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-[#806C77]">
                Choose how wide your reading column should span:
              </p>
              <div className="space-y-3">
                {widthOptions.map(opt => (
                  <div
                    key={opt.width}
                    onClick={() => setTempProfile({ ...tempProfile, contentWidth: opt.width })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      tempProfile.contentWidth === opt.width
                        ? 'border-[#8E294B] bg-[#FFF8FA] ring-2 ring-[#F4C7D5]'
                        : 'border-[#F9E8EE] hover:border-[#F4C7D5] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#421426]">{opt.label}</span>
                      {tempProfile.contentWidth === opt.width && (
                        <Check className="w-4 h-4 text-[#8E294B]" />
                      )}
                    </div>
                    <p className="text-xs text-[#806C77] mb-2">{opt.desc}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-[#8E294B] rounded-full" style={{ width: `${(opt.width / 1000) * 100}%` }} />
                      <span className="text-[11px] font-mono text-[#806C77]">{opt.width}px</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: THEME & CONTRAST */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-[#806C77]">
                Select the background tone and contrast level that feels softest on your eyes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {themeOptions.map(theme => (
                  <div
                    key={theme.id}
                    onClick={() => setTempProfile({ ...tempProfile, theme: theme.id })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${theme.bgClass} ${
                      tempProfile.theme === theme.id
                        ? 'ring-2 ring-[#8E294B] shadow-md scale-[1.01]'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>{theme.name}</span>
                      {tempProfile.theme === theme.id && <Check className="w-4 h-4 text-[#8E294B]" />}
                    </div>
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">{theme.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#F9E8EE]">
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else setMode('view');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#806C77] hover:text-[#421426] transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCompleteAssessment}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D8FF56]" />
                <span>Save Reading Fingerprint</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODE: DIRECT PREFERENCE EDITING */}
      {mode === 'edit' && (
        <div className="bg-white rounded-2xl border border-[#F9E8EE] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F9E8EE]">
            <div>
              <h2 className="text-xl font-bold text-[#291923]">Edit Reading Preferences</h2>
              <p className="text-xs text-[#806C77] mt-0.5">
                Fine-tune individual parameters directly without going through the step-by-step assessment.
              </p>
            </div>
            <button
              onClick={() => setMode('view')}
              className="text-xs font-semibold text-[#806C77] hover:text-[#421426]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Font Family */}
            <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] space-y-2">
              <label className="font-bold text-[#421426] block">Font Family</label>
              <select
                value={tempProfile.fontFamily}
                onChange={(e) => setTempProfile({ ...tempProfile, fontFamily: e.target.value })}
                className="w-full bg-white border border-[#F4C7D5] rounded-lg px-3 py-2 text-xs text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
              >
                {fontOptions.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] space-y-2">
              <div className="flex justify-between font-bold text-[#421426]">
                <span>Font Size</span>
                <span className="font-mono text-[#8E294B]">{tempProfile.fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="26"
                step="1"
                value={tempProfile.fontSize}
                onChange={(e) => setTempProfile({ ...tempProfile, fontSize: Number(e.target.value) })}
                className="w-full accent-[#8E294B]"
              />
            </div>

            {/* Line Spacing */}
            <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] space-y-2">
              <div className="flex justify-between font-bold text-[#421426]">
                <span>Line Spacing</span>
                <span className="font-mono text-[#8E294B]">{tempProfile.lineSpacing}x</span>
              </div>
              <input
                type="range"
                min="1.2"
                max="2.3"
                step="0.05"
                value={tempProfile.lineSpacing}
                onChange={(e) => setTempProfile({ ...tempProfile, lineSpacing: Number(e.target.value) })}
                className="w-full accent-[#8E294B]"
              />
            </div>

            {/* Reading Column Width */}
            <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] space-y-2">
              <div className="flex justify-between font-bold text-[#421426]">
                <span>Reading Width</span>
                <span className="font-mono text-[#8E294B]">{tempProfile.contentWidth}px</span>
              </div>
              <input
                type="range"
                min="500"
                max="1000"
                step="20"
                value={tempProfile.contentWidth}
                onChange={(e) => setTempProfile({ ...tempProfile, contentWidth: Number(e.target.value) })}
                className="w-full accent-[#8E294B]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F9E8EE]">
            <button
              onClick={() => setMode('view')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806C77] hover:text-[#421426]"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
            >
              <Save className="w-4 h-4 text-[#D8FF56]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
