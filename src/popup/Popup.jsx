import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Sun,
  Eye,
  Settings,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Zap,
  Activity,
  Play,
  Compass
} from 'lucide-react';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { DEFAULT_INITIAL_PROFILE, learningStorage } from '../learning/learningStorage.js';
import {
  getEffectiveProfile,
  getSiteOverride,
  normalizeDomain,
  PROFILE_STORAGE_KEY,
  sanitizeProfile,
} from '../extension/profileSync.js';

export function Popup() {
  const [profile, setProfile] = useState(DEFAULT_INITIAL_PROFILE);
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [learnedPrefs, setLearnedPrefs] = useState({});
  const [comfortProfile, setComfortProfile] = useState({ overall: 85 });
  const [activeDomain, setActiveDomain] = useState('');
  const [scope, setScope] = useState('global');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    const loadState = async () => {
      try {
        const [state, tabs] = await Promise.all([
          adaptiveEngine.getFullState(),
          chrome.tabs.query({ active: true, lastFocusedWindow: true }),
        ]);
        if (!active) return;

        const domain = normalizeDomain(tabs[0]?.url || '');
        const stored = await chrome.storage.local.get(PROFILE_STORAGE_KEY);
        const profiles = stored[PROFILE_STORAGE_KEY] || {};
        const globalProfile = profiles.globalProfile || state.currentProfile;
        if (!profiles.globalProfile) {
          await chrome.runtime.sendMessage({
            type: 'ACCESSAI_SAVE_PROFILE',
            profile: globalProfile,
          });
        }

        setActiveDomain(domain);
        setProfile(scope === 'site'
          ? getEffectiveProfile({ ...profiles, globalProfile }, domain)
          : sanitizeProfile(globalProfile));
        setAdaptiveEnabled(state.adaptiveLearningEnabled);
        setLearnedPrefs(state.learnedPreferences);
        setComfortProfile(state.comfortProfile);
      } catch (error) {
        console.error('[AccessAI] Failed to load popup preferences:', error);
        if (active) setErrorMessage('Could not load saved preferences.');
      }
    };

    loadState();

    const unsub = adaptiveEngine.subscribe(state => {
      if (scope === 'global') setProfile(state.currentProfile);
      setAdaptiveEnabled(state.adaptiveLearningEnabled);
      setLearnedPrefs(state.learnedPreferences);
      setComfortProfile(state.comfortProfile);
    });

    const handleStorageChange = (changes, areaName) => {
      if (areaName !== 'local' || !changes[PROFILE_STORAGE_KEY]) return;
      chrome.storage.local.get(PROFILE_STORAGE_KEY).then((stored) => {
        if (active) {
          setProfile(scope === 'site'
            ? getEffectiveProfile(stored[PROFILE_STORAGE_KEY], activeDomain)
            : sanitizeProfile(stored[PROFILE_STORAGE_KEY]?.globalProfile));
        }
      }).catch((error) => console.error('[AccessAI] Failed to refresh popup preferences:', error));
    };
    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      active = false;
      unsub();
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [scope, activeDomain]);

  const handleToggleAdaptive = async () => {
    const next = !adaptiveEnabled;
    setAdaptiveEnabled(next);
    await adaptiveEngine.setAdaptiveLearningEnabled(next);
  };

  const handleAdjust = async (dimension, val, eventType) => {
    const fromVal = profile[dimension];
    const updated = { ...profile, [dimension]: val };
    setProfile(updated);
    setErrorMessage('');

    try {
      let profileToSync = updated;
      if (scope === 'site' && activeDomain) {
        const stored = await chrome.storage.local.get(PROFILE_STORAGE_KEY);
        const currentOverride = getSiteOverride(stored[PROFILE_STORAGE_KEY], activeDomain);
        profileToSync = { ...currentOverride, [dimension]: val };
        await learningStorage.saveSiteOverride(activeDomain, updated);
      } else {
        await adaptiveEngine.updateCurrentProfile({ [dimension]: val });
        await adaptiveEngine.recordInteraction({
          type: eventType || `${dimension}_change`,
          dimension,
          from: fromVal,
          to: val
        });
      }

      const response = await chrome.runtime.sendMessage({
        type: 'ACCESSAI_SAVE_PROFILE',
        profile: profileToSync,
        domain: scope === 'site' ? activeDomain : null,
      });
      if (response?.status !== 'ok') {
        throw new Error(response?.message || 'Background could not save the profile.');
      }
    } catch (error) {
      console.error('[AccessAI] Failed to save popup preferences:', error);
      setErrorMessage('Could not sync this change to your website.');
    }
  };

  const themes = [
    { id: 'default', label: 'Std', bg: 'bg-white', text: 'text-[#291923]', border: 'border-[#F4C7D5]' },
    { id: 'warm', label: 'Warm', bg: 'bg-[#FAF4E6]', text: 'text-[#2E241E]', border: 'border-amber-300' },
    { id: 'dark', label: 'Dark', bg: 'bg-[#291923]', text: 'text-[#F9E8EE]', border: 'border-[#70243E]' },
    { id: 'dyslexia', label: 'Peach', bg: 'bg-[#F4EDD8]', text: 'text-[#1A1E24]', border: 'border-amber-400' },
    { id: 'high-contrast', label: 'Contrast', bg: 'bg-black', text: 'text-[#D8FF56]', border: 'border-[#D8FF56]' },
  ];

  return (
    <div className="w-[360px] bg-[#FFF8FA] text-[#291923] p-4 font-sans select-none border border-[#F4C7D5] rounded-2xl shadow-xl selection:bg-[#F4C7D5]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#421426] text-white flex items-center justify-center font-bold text-xs shadow-sm relative">
            <span>A</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D8FF56] border border-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#421426] flex items-center gap-1.5">
              AccessAI
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#F9E8EE] text-[#70243E] border border-[#F4C7D5]">
                Read Your Way
              </span>
            </h1>
            <p className="text-[11px] text-[#806C77]">Adaptive Reading Fingerprint</p>
          </div>
        </div>

        <a
          href="index.html"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-[#F9E8EE] text-[#421426] border border-[#F4C7D5] transition shadow-sm"
          title="Open AccessAI Web Studio"
          aria-label="Open AccessAI Web Studio"
        >
          <Compass className="w-4 h-4 text-[#8E294B]" />
        </a>
      </div>

      {/* Adaptive Intelligence Pill */}
      <div className="mt-3 p-3 rounded-xl bg-white border border-[#F9E8EE] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${adaptiveEnabled ? 'bg-[#D8FF56] border border-[#421426]' : 'bg-[#806C77]'}`} />
          <div>
            <div className="text-xs font-bold text-[#291923]">Adaptive Personalization</div>
            <div className="text-[10px] text-[#806C77]">
              {adaptiveEnabled ? 'Gradually learning your reading habits' : 'Using fixed baseline fingerprint'}
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleAdaptive}
          role="switch"
          aria-checked={adaptiveEnabled}
          aria-label="Toggle Adaptive Personalization"
          className={`w-10 h-5 rounded-full transition-colors relative ${adaptiveEnabled ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
        >
          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${adaptiveEnabled ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[10px]">
        <span className="font-semibold text-[#806C77]">Apply preferences to</span>
        <div className="flex items-center rounded-lg border border-[#F4C7D5] overflow-hidden">
          <button
            type="button"
            onClick={() => setScope('global')}
            className={`px-2.5 py-1 font-semibold ${scope === 'global' ? 'bg-[#421426] text-white' : 'bg-white text-[#421426]'}`}
          >
            All websites
          </button>
          <button
            type="button"
            onClick={() => setScope('site')}
            disabled={!activeDomain}
            className={`px-2.5 py-1 font-semibold disabled:opacity-40 ${scope === 'site' ? 'bg-[#421426] text-white' : 'bg-white text-[#421426]'}`}
            title={activeDomain ? `Only ${activeDomain}` : 'Open an http or https website to enable this'}
          >
            {activeDomain || 'This website'}
          </button>
        </div>
      </div>
      {errorMessage && (
        <p role="alert" className="mt-2 text-[10px] text-rose-700">{errorMessage}</p>
      )}

      {/* Reading Comfort & Confidence Summary */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-white border border-[#F9E8EE] shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-[#806C77] font-semibold">
            <span>Comfort Index</span>
            <Activity className="w-3.5 h-3.5 text-[#8E294B]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-bold text-[#421426] font-mono">{comfortProfile.overall || 88}%</span>
            <span className="text-[10px] text-[#806C77]">Optimal</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-[#F9E8EE] shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-[#806C77] font-semibold">
            <span>Font & Scale</span>
            <span className="text-[10px] font-mono text-[#8E294B] font-bold">
              {learnedPrefs.fontSize ? `${Math.round(learnedPrefs.fontSize.confidence * 100)}% conf` : 'calibrated'}
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-bold text-[#291923] font-mono">{profile.fontSize}px</span>
            <span className="text-[10px] text-[#806C77] truncate">{profile.fontFamily}</span>
          </div>
        </div>
      </div>

      {/* Quick Personalization Sliders */}
      <div className="mt-3 space-y-3 p-3 rounded-xl bg-white border border-[#F9E8EE] shadow-sm text-xs">
        <div>
          <label htmlFor="accessai-font-family" className="text-[#806C77] font-semibold block mb-1">Font Family</label>
          <select
            id="accessai-font-family"
            value={profile.fontFamily}
            onChange={(e) => handleAdjust('fontFamily', e.target.value, 'font_change')}
            className="w-full rounded-lg border border-[#F4C7D5] bg-white px-2.5 py-1.5 text-xs text-[#291923]"
          >
            {['Inter', 'Lexend', 'Atkinson Hyperlegible', 'Merriweather', 'OpenDyslexic'].map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex justify-between text-[#806C77] font-semibold mb-1">
            <span>Text Scale</span>
            <span className="font-mono text-[#8E294B] font-bold">{profile.fontSize}px</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleAdjust('fontSize', Math.max(12, profile.fontSize - 1), 'font_size_change')}
              className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] flex items-center justify-center font-bold text-xs"
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
              className="w-full accent-[#8E294B] cursor-pointer"
            />
            <button
              onClick={() => handleAdjust('fontSize', Math.min(28, profile.fontSize + 1), 'font_size_change')}
              className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] flex items-center justify-center font-bold text-xs"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            ['letterSpacing', 'Letter spacing', -2, 8, 0.5],
            ['wordSpacing', 'Word spacing', -2, 12, 0.5],
          ].map(([dimension, label, min, max, step]) => (
            <label key={dimension} className="text-[10px] font-semibold text-[#806C77]">
              <span className="flex justify-between mb-1">
                <span>{label}</span>
                <span className="font-mono text-[#8E294B]">{profile[dimension] || 0}px</span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={profile[dimension] || 0}
                onChange={(e) => handleAdjust(dimension, Number(e.target.value))}
                className="w-full accent-[#8E294B]"
              />
            </label>
          ))}
        </div>

        {/* Line Spacing */}
        <div>
          <div className="flex justify-between text-[#806C77] font-semibold mb-1">
            <span>Line Spacing</span>
            <span className="font-mono text-[#8E294B] font-bold">{profile.lineSpacing}x</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleAdjust('lineSpacing', Math.max(1.1, +(profile.lineSpacing - 0.1).toFixed(2)), 'line_spacing_change')}
              className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] flex items-center justify-center font-bold text-xs"
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
              className="w-full accent-[#8E294B] cursor-pointer"
            />
            <button
              onClick={() => handleAdjust('lineSpacing', Math.min(2.4, +(profile.lineSpacing + 0.1).toFixed(2)), 'line_spacing_change')}
              className="w-6 h-6 rounded bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] flex items-center justify-center font-bold text-xs"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          {[
            ['focusMode', 'Smart Focus'],
            ['readingRuler', 'Reading Ruler'],
          ].map(([dimension, label]) => (
            <button
              key={dimension}
              type="button"
              aria-pressed={!!profile[dimension]}
              onClick={() => handleAdjust(dimension, !profile[dimension], `${dimension}_toggle`)}
              className={`rounded-lg border px-2 py-1.5 font-semibold ${profile[dimension] ? 'border-[#421426] bg-[#421426] text-white' : 'border-[#F4C7D5] bg-white text-[#421426]'}`}
            >
              {label}: {profile[dimension] ? 'On' : 'Off'}
            </button>
          ))}
        </div>

        {/* Theme Buttons */}
        <div>
          <span className="text-[#806C77] font-semibold block mb-1">Reading Tone</span>
          <div className="grid grid-cols-5 gap-1">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => handleAdjust('theme', t.id, 'theme_change')}
                className={`py-1.5 rounded-lg border text-center text-[10px] font-bold transition ${t.bg} ${t.text} ${t.border} ${
                  profile.theme === t.id ? 'ring-2 ring-[#8E294B] scale-105 shadow-sm' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launch Actions */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <a
          href="index.html"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white font-bold transition shadow-sm"
        >
          <Compass className="w-3.5 h-3.5 text-[#D8FF56]" />
          <span>Web Studio</span>
        </a>

        <a
          href="dashboard.html"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#F9E8EE] text-[#421426] border border-[#F4C7D5] font-semibold transition"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </a>
      </div>

      {/* Footer Privacy Guarantee */}
      <div className="mt-3 pt-2.5 border-t border-[#F9E8EE] flex items-center justify-between text-[10px] text-[#806C77]">
        <span className="flex items-center gap-1 text-[#421426] font-semibold">
          <ShieldCheck className="w-3 h-3 text-[#8E294B]" />
          100% In-Browser Privacy
        </span>
        <a
          href="index.html#settings"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[#421426] hover:underline"
        >
          Privacy Center
        </a>
      </div>
    </div>
  );
}
