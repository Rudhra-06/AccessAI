import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sliders,
  RotateCcw,
  Save,
  Sparkles,
  Eye,
  Sun,
  Type,
  AlignJustify,
  Maximize2,
  Minimize2,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Volume2
} from 'lucide-react';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { learningStorage, DEFAULT_INITIAL_PROFILE } from '../learning/learningStorage.js';
import { SmartFocusEngine } from '../content/smartFocus.js';

export function ReadingStudio({ currentProfile, onProfileUpdated }) {
  const [profile, setProfile] = useState({ ...currentProfile });
  const [previousProfile, setPreviousProfile] = useState(null);
  const [sampleType, setSampleType] = useState('science'); // 'science' | 'story' | 'technical' | 'custom'
  const [customText, setCustomText] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    setProfile({ ...currentProfile });
  }, [currentProfile]);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleUpdate = async (dimension, value, eventType) => {
    const fromVal = profile[dimension];
    if (!previousProfile) {
      setPreviousProfile({ ...profile });
    }
    const updated = { ...profile, [dimension]: value };
    setProfile(updated);

    // Apply live style event to page / preview
    window.dispatchEvent(new CustomEvent('accessai:apply_profile', { detail: updated }));

    // Record interaction in adaptive engine
    await adaptiveEngine.updateCurrentProfile({ [dimension]: value });
    await adaptiveEngine.recordInteraction({
      type: eventType || `${dimension}_change`,
      dimension,
      from: fromVal,
      to: value,
      category: 'studio'
    });

    if (onProfileUpdated) onProfileUpdated(updated);
  };

  const handleResetToDefault = async () => {
    setPreviousProfile({ ...profile });
    setProfile({ ...DEFAULT_INITIAL_PROFILE });
    await adaptiveEngine.updateCurrentProfile(DEFAULT_INITIAL_PROFILE);
    if (onProfileUpdated) onProfileUpdated(DEFAULT_INITIAL_PROFILE);
    notify('Reset to default standard reading settings.');
  };

  const handleApplyFingerprint = async () => {
    const initial = await learningStorage.getSetting('initialProfile', DEFAULT_INITIAL_PROFILE);
    setPreviousProfile({ ...profile });
    setProfile({ ...initial });
    await adaptiveEngine.updateCurrentProfile(initial);
    if (onProfileUpdated) onProfileUpdated(initial);
    notify('Applied your calibrated Personal Reading Fingerprint.');
  };

  const handleRestorePrevious = async () => {
    if (!previousProfile) return;
    const restored = { ...previousProfile };
    setPreviousProfile(null);
    setProfile(restored);
    await adaptiveEngine.updateCurrentProfile(restored);
    if (onProfileUpdated) onProfileUpdated(restored);
    notify('Restored previous settings.');
  };

  const handleSavePreferences = async () => {
    await learningStorage.setSetting('initialProfile', { ...profile });
    await learningStorage.setSetting('currentProfile', { ...profile });
    await learningStorage.addHistoryEntry({
      title: 'Studio Preferences Saved as Baseline',
      description: `Manual studio calibration saved: ${profile.fontFamily}, ${profile.fontSize}px, ${profile.lineSpacing}x spacing.`,
      changes: profile,
      timestamp: new Date().toISOString()
    });
    notify('Saved active studio settings to your Reading Fingerprint!');
  };

  const fonts = [
    { id: 'Inter', name: 'Inter (Sans)' },
    { id: 'Lexend', name: 'Lexend (Cognitive)' },
    { id: 'Atkinson Hyperlegible', name: 'Atkinson Hyperlegible' },
    { id: 'OpenDyslexic', name: 'OpenDyslexic' },
    { id: 'Merriweather', name: 'Merriweather (Serif)' },
  ];

  const themes = [
    { id: 'default', name: 'Crisp White', bg: 'bg-white', text: 'text-[#291923]', border: 'border-[#F4C7D5]' },
    { id: 'warm', name: 'Warm Parchment', bg: 'bg-[#FAF4E6]', text: 'text-[#2E241E]', border: 'border-amber-300' },
    { id: 'dark', name: 'Dark Berry Slate', bg: 'bg-[#291923]', text: 'text-[#F9E8EE]', border: 'border-[#70243E]' },
    { id: 'dyslexia', name: 'Dyslexia Peach', bg: 'bg-[#F4EDD8]', text: 'text-[#1A1E24]', border: 'border-amber-400' },
    { id: 'high-contrast', name: 'High Contrast Lime', bg: 'bg-black', text: 'text-[#D8FF56]', border: 'border-[#D8FF56]' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-[#F9E8EE] border border-[#F4C7D5] text-[#421426] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#8E294B]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header and Action Bar */}
      <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8E294B] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Interactive Customization Studio
          </div>
          <h2 className="text-xl font-bold text-[#291923] mt-0.5">
            Reading Studio
          </h2>
          <p className="text-xs text-[#806C77] mt-0.5">
            Calibrate typography, spacing, width, and guides with live instant preview.
          </p>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleApplyFingerprint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-xs font-bold transition border border-[#F4C7D5]"
            title="Load your saved fingerprint"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8E294B]" />
            <span>Apply Fingerprint</span>
          </button>

          {previousProfile && (
            <button
              onClick={handleRestorePrevious}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-xs font-medium transition"
              title="Undo last change"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Previous</span>
            </button>
          )}

          <button
            onClick={handleResetToDefault}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE] transition"
          >
            Reset
          </button>

          <button
            onClick={handleSavePreferences}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5 text-[#D8FF56]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Main Studio Two-Column Grid: Controls & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Comprehensive Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
            <span className="font-bold text-[#291923] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#8E294B]" />
              Visual Parameters
            </span>
            <span className="text-[10px] font-mono text-[#806C77]">Live Synchronized</span>
          </div>

          {/* Typography Choice */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#421426] block">Typography Font</label>
            <select
              value={profile.fontFamily}
              onChange={(e) => handleUpdate('fontFamily', e.target.value, 'font_change')}
              className="w-full bg-[#FFF8FA] border border-[#F4C7D5] rounded-xl px-3 py-2 text-xs text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
            >
              {fonts.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Font Size Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-[#421426]">
              <span>Font Size</span>
              <span className="font-mono text-[#8E294B]">{profile.fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate('fontSize', Math.max(12, profile.fontSize - 1), 'font_size_change')}
                className="w-7 h-7 rounded-lg bg-[#F9E8EE] text-[#421426] font-bold flex items-center justify-center hover:bg-[#F4C7D5]"
              >
                -
              </button>
              <input
                type="range"
                min="12"
                max="28"
                step="1"
                value={profile.fontSize}
                onChange={(e) => handleUpdate('fontSize', Number(e.target.value), 'font_size_change')}
                className="w-full accent-[#8E294B]"
              />
              <button
                onClick={() => handleUpdate('fontSize', Math.min(28, profile.fontSize + 1), 'font_size_change')}
                className="w-7 h-7 rounded-lg bg-[#F9E8EE] text-[#421426] font-bold flex items-center justify-center hover:bg-[#F4C7D5]"
              >
                +
              </button>
            </div>
          </div>

          {/* Line Spacing Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-[#421426]">
              <span>Line Spacing</span>
              <span className="font-mono text-[#8E294B]">{profile.lineSpacing}x</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate('lineSpacing', Math.max(1.1, +(profile.lineSpacing - 0.1).toFixed(2)), 'line_spacing_change')}
                className="w-7 h-7 rounded-lg bg-[#F9E8EE] text-[#421426] font-bold flex items-center justify-center hover:bg-[#F4C7D5]"
              >
                -
              </button>
              <input
                type="range"
                min="1.1"
                max="2.4"
                step="0.05"
                value={profile.lineSpacing}
                onChange={(e) => handleUpdate('lineSpacing', Number(e.target.value), 'line_spacing_change')}
                className="w-full accent-[#8E294B]"
              />
              <button
                onClick={() => handleUpdate('lineSpacing', Math.min(2.4, +(profile.lineSpacing + 0.1).toFixed(2)), 'line_spacing_change')}
                className="w-7 h-7 rounded-lg bg-[#F9E8EE] text-[#421426] font-bold flex items-center justify-center hover:bg-[#F4C7D5]"
              >
                +
              </button>
            </div>
          </div>

          {/* Letter & Word Spacing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#806C77] font-semibold">
                <span>Letter Space</span>
                <span className="font-mono text-[#421426]">{profile.letterSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.2"
                value={profile.letterSpacing || 0}
                onChange={(e) => handleUpdate('letterSpacing', Number(e.target.value), 'letter_spacing_change')}
                className="w-full accent-[#8E294B]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[#806C77] font-semibold">
                <span>Word Space</span>
                <span className="font-mono text-[#421426]">{profile.wordSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={profile.wordSpacing || 0}
                onChange={(e) => handleUpdate('wordSpacing', Number(e.target.value), 'word_spacing_change')}
                className="w-full accent-[#8E294B]"
              />
            </div>
          </div>

          {/* Reading Column Width */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-[#421426]">
              <span>Reading Width</span>
              <span className="font-mono text-[#8E294B]">{profile.contentWidth || 760}px</span>
            </div>
            <input
              type="range"
              min="480"
              max="960"
              step="20"
              value={profile.contentWidth || 760}
              onChange={(e) => handleUpdate('contentWidth', Number(e.target.value), 'content_width_change')}
              className="w-full accent-[#8E294B]"
            />
          </div>

          {/* Themes Palette */}
          <div className="space-y-2">
            <label className="font-bold text-[#421426] block">Reading Tone & Theme</label>
            <div className="grid grid-cols-5 gap-1.5">
              {themes.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleUpdate('theme', t.id, 'theme_change')}
                  className={`py-2 rounded-xl border text-center text-[10px] font-semibold transition ${t.bg} ${t.text} ${t.border} ${
                    profile.theme === t.id ? 'ring-2 ring-[#8E294B] scale-105 shadow-sm' : 'opacity-85 hover:opacity-100'
                  }`}
                  title={t.name}
                >
                  {t.id === 'default' ? 'Std' : t.id === 'warm' ? 'Warm' : t.id === 'dark' ? 'Dark' : t.id === 'dyslexia' ? 'Peach' : 'Lime'}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Helper Toggles */}
          <div className="pt-3 border-t border-[#F9E8EE] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#291923] block">Smart Focus Mode</span>
                <span className="text-[10px] text-[#806C77]">Calms surrounding clutter</span>
              </div>
              <button
                onClick={() => {
                  const next = !profile.focusMode;
                  handleUpdate('focusMode', next, 'focus_mode_toggle');
                  SmartFocusEngine.applyFocusMode(next, 'article');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative ${profile.focusMode ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${profile.focusMode ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#291923] block">Reading Ruler Guide</span>
                <span className="text-[10px] text-[#806C77]">Horizontal visual tracker</span>
              </div>
              <button
                onClick={() => {
                  const next = !profile.readingRuler;
                  handleUpdate('readingRuler', next, 'ruler_toggle');
                  SmartFocusEngine.toggleReadingRuler(next);
                }}
                className={`w-11 h-6 rounded-full transition-colors relative ${profile.readingRuler ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${profile.readingRuler ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#291923] block">Paragraph Highlighting</span>
                <span className="text-[10px] text-[#806C77]">Emphasizes active paragraph</span>
              </div>
              <button
                onClick={() => handleUpdate('paragraphHighlight', !profile.paragraphHighlight, 'paragraph_highlight_toggle')}
                className={`w-11 h-6 rounded-full transition-colors relative ${profile.paragraphHighlight ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${profile.paragraphHighlight ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Reading Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Sample Switcher Tabs */}
          <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#F9E8EE] text-xs">
            <span className="text-[11px] font-bold text-[#806C77] uppercase px-2">Sample Content:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSampleType('science')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  sampleType === 'science' ? 'bg-[#421426] text-white' : 'text-[#806C77] hover:text-[#421426]'
                }`}
              >
                Science & Mind
              </button>
              <button
                onClick={() => setSampleType('story')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  sampleType === 'story' ? 'bg-[#421426] text-white' : 'text-[#806C77] hover:text-[#421426]'
                }`}
              >
                Narrative
              </button>
              <button
                onClick={() => setSampleType('custom')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  sampleType === 'custom' ? 'bg-[#421426] text-white' : 'text-[#806C77] hover:text-[#421426]'
                }`}
              >
                Custom Text
              </button>
            </div>
          </div>

          {/* Custom Text Area if selected */}
          {sampleType === 'custom' && (
            <textarea
              rows={3}
              placeholder="Paste or write custom text here to test your reading style live..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-white border border-[#F4C7D5] rounded-xl p-3 text-xs text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
            />
          )}

          {/* The Live Reading Surface Canvas */}
          <div
            className={`p-8 sm:p-10 rounded-2xl border transition-all duration-300 shadow-sm min-h-[500px] flex flex-col justify-between ${
              profile.theme === 'warm'
                ? 'bg-[#FAF4E6] text-[#2E241E] border-amber-300'
                : profile.theme === 'dark'
                ? 'bg-[#291923] text-[#F9E8EE] border-[#70243E]'
                : profile.theme === 'dyslexia'
                ? 'bg-[#F4EDD8] text-[#1A1E24] border-amber-400'
                : profile.theme === 'high-contrast'
                ? 'bg-black text-[#D8FF56] border-[#D8FF56]'
                : 'bg-white text-[#291923] border-[#F4C7D5]'
            }`}
            style={{
              maxWidth: `${profile.contentWidth || 760}px`,
              margin: '0 auto',
              width: '100%'
            }}
          >
            <div
              style={{
                fontFamily: profile.fontFamily,
                fontSize: `${profile.fontSize}px`,
                lineHeight: profile.lineSpacing,
                letterSpacing: `${profile.letterSpacing || 0}px`,
                wordSpacing: `${profile.wordSpacing || 0}px`
              }}
              className="space-y-4"
            >
              {sampleType === 'science' && (
                <>
                  <div className="text-[11px] font-mono uppercase tracking-widest opacity-60">
                    Cognitive Perception & Typography
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ lineHeight: 1.25 }}>
                    Why Spacing Shapes Reading Endurance
                  </h1>
                  <p className={profile.paragraphHighlight ? 'bg-amber-100/30 p-2 rounded-lg' : ''}>
                    Digital typography isn't just aesthetic styling; it is an ergonomic bridge between visual processing and cognitive comprehension. When letters crowd together on an uneven line, the brain expends excessive energy simply distinguishing adjacent characters.
                  </p>
                  <p className={profile.paragraphHighlight ? 'hover:bg-amber-100/20 p-2 rounded-lg transition' : ''}>
                    Adjusting word spacing and line clearance relieves perceptual fatigue. Readers with dyslexia or ADHD report a noticeable drop in mental tension when lines have ample breathing room.
                  </p>
                  <blockquote className="p-3 border-l-4 border-[#8E294B] my-4 italic opacity-90">
                    "When software adapts to the human visual system, reading stops being an obstacle and becomes effortless."
                  </blockquote>
                  <p>
                    Notice how this preview updates in real time with every slider adjustment.
                  </p>
                </>
              )}

              {sampleType === 'story' && (
                <>
                  <div className="text-[11px] font-mono uppercase tracking-widest opacity-60">
                    Chapter 1 • The Horizon Explorer
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ lineHeight: 1.25 }}>
                    A Quiet Evening Along the Coast
                  </h1>
                  <p>
                    The amber lighthouse cast its rhythm across the dark water. Down on the salt-bleached pier, Marcus folded the nautical map and took a deep breath of the ocean breeze.
                  </p>
                  <p>
                    For hours he had studied the coastal currents, navigating through layers of navigational charts. With comfortable typography, every marker stood out cleanly against the soft parchment page.
                  </p>
                </>
              )}

              {sampleType === 'custom' && (
                <div>
                  <h2 className="text-xl font-bold mb-3">Custom Reading Preview</h2>
                  <p>
                    {customText || 'Type or paste your own study materials, article drafts, or documentation in the box above to see how your personalized Reading Studio settings render.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t opacity-40 text-[11px] flex justify-between font-mono">
              <span>{profile.fontFamily} • {profile.fontSize}px • {profile.lineSpacing}x</span>
              <span>AccessAI Studio Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
