import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Settings,
  Download,
  Trash2,
  RefreshCw,
  Key,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileText,
  User,
  Bot
} from 'lucide-react';
import { PrivacyManager } from '../privacy/privacyManager.js';
import { learningStorage, DEFAULT_INITIAL_PROFILE } from '../learning/learningStorage.js';
import { AIAssistantService } from '../ai/aiAssistantService.js';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';

export function SettingsPrivacy({ currentProfile, onProfileUpdated }) {
  const [profileName, setProfileName] = useState('Reader');
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [aiProvider, setAiProvider] = useState('local');
  const [aiApiKey, setAiApiKey] = useState('');
  const [confirmModal, setConfirmModal] = useState(null); // 'learning' | 'all' | null
  const [exportLoading, setExportLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const checklist = PrivacyManager.getPrivacyChecklist();

  useEffect(() => {
    learningStorage.getSetting('reader_name', 'Reader').then(name => setProfileName(name));
    learningStorage.getSetting('adaptiveLearningEnabled', true).then(val => setAdaptiveEnabled(val));
    AIAssistantService.getAPIConfig().then(cfg => {
      setAiProvider(cfg.provider || 'local');
      setAiApiKey(cfg.apiKey || '');
    });
  }, []);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSaveProfileSettings = async (e) => {
    e.preventDefault();
    await learningStorage.setSetting('reader_name', profileName);
    await AIAssistantService.saveAPIConfig({
      provider: aiProvider,
      apiKey: aiApiKey
    });
    notify('Settings and AI preferences saved.');
  };

  const handleToggleAdaptive = async () => {
    const next = !adaptiveEnabled;
    setAdaptiveEnabled(next);
    await adaptiveEngine.setAdaptiveLearningEnabled(next);
    notify(next ? 'Adaptive learning enabled.' : 'Adaptive learning paused.');
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const data = await PrivacyManager.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AccessAI-Data-Export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      notify('Export downloaded successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setExportLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (confirmModal === 'learning') {
      await adaptiveEngine.resetLearnedPreferences();
      notify('Reset learned weights. Baseline reading fingerprint retained.');
    } else if (confirmModal === 'all') {
      await adaptiveEngine.resetEverything();
      if (onProfileUpdated) onProfileUpdated(DEFAULT_INITIAL_PROFILE);
      notify('Factory reset all AccessAI profiles and local storage.');
    }
    setConfirmModal(null);
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

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8E294B] uppercase tracking-wider">
            <Settings className="w-4 h-4 text-[#8E294B]" />
            Preferences, Privacy & Data Sovereignty
          </div>
          <h2 className="text-xl font-bold text-[#291923] mt-0.5">
            Settings & Privacy Center
          </h2>
          <p className="text-xs text-[#806C77] mt-0.5">
            Control your profile, configure optional AI endpoints, and export or purge your local data at any time.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5]">
          <div className="text-right text-xs">
            <div className="text-[10px] text-[#806C77] uppercase font-semibold">Adaptive Learning</div>
            <div className={`font-bold ${adaptiveEnabled ? 'text-[#421426]' : 'text-[#806C77]'}`}>
              {adaptiveEnabled ? 'Active (Local)' : 'Paused'}
            </div>
          </div>
          <button
            onClick={handleToggleAdaptive}
            role="switch"
            aria-checked={adaptiveEnabled}
            aria-label="Toggle adaptive learning"
            className={`w-11 h-6 rounded-full transition-colors relative ${adaptiveEnabled ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${adaptiveEnabled ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Two Column Grid: Profile & AI Settings vs Privacy Guarantees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile & AI Settings (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Reader Profile Box */}
          <div className="bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F9E8EE]">
              <User className="w-4 h-4 text-[#8E294B]" />
              <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider">
                Reader Identity & Display
              </h3>
            </div>

            <form onSubmit={handleSaveProfileSettings} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#806C77] block mb-1">
                  Reader Display Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#FFF8FA] border border-[#F4C7D5] rounded-xl px-3 py-2 text-xs text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
                  placeholder="e.g. Reader, Sarah, Alex"
                />
              </div>

              {/* AI Processing Preferences */}
              <div className="pt-2 border-t border-[#F9E8EE] space-y-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#8E294B]" />
                  <span className="text-xs font-bold text-[#291923] uppercase tracking-wider">
                    AI Processing Preferences
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#806C77] block mb-1">
                    AI Processing Engine
                  </label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full bg-[#FFF8FA] border border-[#F4C7D5] rounded-xl px-3 py-2 text-xs text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
                  >
                    <option value="local">Local Cognitive Engine (100% In-Browser & Private)</option>
                    <option value="gemini">Google Gemini API (Custom API Key)</option>
                    <option value="openai">OpenAI API (Custom API Key)</option>
                  </select>
                </div>

                {aiProvider !== 'local' && (
                  <div>
                    <label className="text-[11px] font-semibold text-[#806C77] block mb-1">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={aiApiKey}
                      onChange={(e) => setAiApiKey(e.target.value)}
                      placeholder="Paste your API key here (kept locally only)"
                      className="w-full bg-[#FFF8FA] border border-[#F4C7D5] rounded-xl px-3 py-2 text-xs text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
                    />
                    <p className="text-[10px] text-[#806C77] mt-1">
                      Your key is saved only in local browser IndexedDB storage and is never sent to any intermediary server.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#421426] hover:bg-[#70243E] text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Save Profile & AI Preferences
              </button>
            </form>
          </div>

          {/* Data Export and Purge Tools */}
          <div className="bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider">
              Data Sovereignty & Purge Tools
            </h3>
            <p className="text-xs text-[#806C77]">
              Export your full reading logs as JSON, or erase learned preferences at any time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <button
                onClick={handleExportData}
                disabled={exportLoading}
                className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] hover:border-[#8E294B] text-left transition space-y-1"
              >
                <Download className="w-4 h-4 text-[#8E294B]" />
                <div className="font-bold text-[#421426]">Export JSON</div>
                <div className="text-[10px] text-[#806C77]">Download all data</div>
              </button>

              <button
                onClick={() => setConfirmModal('learning')}
                className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] hover:border-amber-400 text-left transition space-y-1"
              >
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <div className="font-bold text-amber-700">Reset Weights</div>
                <div className="text-[10px] text-[#806C77]">Keep initial profile</div>
              </button>

              <button
                onClick={() => setConfirmModal('all')}
                className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] hover:border-rose-400 text-left transition space-y-1"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <div className="font-bold text-rose-700">Delete Profile</div>
                <div className="text-[10px] text-[#806C77]">Factory reset</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Privacy Architecture & Extension Permissions Info (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F9E8EE]">
            <ShieldCheck className="w-4 h-4 text-[#8E294B]" />
            <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider">
              Privacy by Design Architecture
            </h3>
          </div>

          <div className="space-y-3">
            {checklist.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex items-start gap-3">
                <div className="p-1 rounded-md bg-[#F9E8EE] text-[#8E294B] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#291923]">{item.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#F4C7D5] text-[#421426]">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#806C77] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Extension Permissions Transparency */}
          <div className="pt-3 border-t border-[#F9E8EE] space-y-2">
            <h4 className="font-bold text-[#421426] text-[11px] uppercase tracking-wider">
              Extension Permissions Explained
            </h4>
            <div className="space-y-1.5 text-[11px] text-[#806C77]">
              <div>
                <strong className="text-[#291923] font-mono">storage:</strong> Used strictly to save your reading profile locally in your browser.
              </div>
              <div>
                <strong className="text-[#291923] font-mono">activeTab & scripting:</strong> Used solely to inject non-destructive CSS typography rules onto the page when you request it.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-[#F4C7D5] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#291923]">
                  {confirmModal === 'learning' ? 'Reset Learned Weights?' : 'Delete Reading Profile?'}
                </h3>
                <p className="text-xs text-[#806C77] mt-0.5">
                  {confirmModal === 'learning'
                    ? 'This clears recorded adjustment history. Your baseline profile remains intact.'
                    : 'This permanently erases all personal profiles, site overrides, and history from IndexedDB.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F9E8EE]">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806C77] hover:bg-[#F9E8EE]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
