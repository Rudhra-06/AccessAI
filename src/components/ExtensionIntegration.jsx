import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Radio,
  Sliders,
  Copy,
  Download
} from 'lucide-react';
import { extensionBridge } from '../extension/extensionBridge.js';
import { learningStorage } from '../learning/learningStorage.js';

export function ExtensionIntegration({ currentProfile }) {
  const [isConnected, setIsConnected] = useState(false);
  const [overrides, setOverrides] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [newFontSize, setNewFontSize] = useState(18);
  const [newTheme, setNewTheme] = useState('warm');
  const [notification, setNotification] = useState('');
  const [adaptationEnabled, setAdaptationEnabled] = useState(true);

  useEffect(() => {
    loadOverrides();
    extensionBridge.checkConnection().then(status => setIsConnected(status));
    const unsub = extensionBridge.subscribe(data => setIsConnected(data.isConnected));
    return () => unsub();
  }, []);

  const loadOverrides = async () => {
    const list = await learningStorage.getAllSiteOverrides();
    setOverrides(list || []);
  };

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleAddOverride = async (e) => {
    e.preventDefault();
    if (!newDomain) return;

    let clean = newDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim().toLowerCase();
    if (!clean) return;

    await learningStorage.saveSiteOverride(clean, {
      fontSize: Number(newFontSize),
      theme: newTheme
    });
    extensionBridge.saveSiteOverride(clean, {
      fontSize: Number(newFontSize),
      theme: newTheme,
    });

    setNewDomain('');
    notify(`Saved custom override rule for ${clean}`);
    loadOverrides();
  };

  const handleDeleteOverride = async (domain) => {
    await learningStorage.deleteSiteOverride(domain);
    extensionBridge.deleteSiteOverride(domain);
    notify(`Deleted override rule for ${domain}`);
    loadOverrides();
  };

  const handleResetAllOverrides = async () => {
    await extensionBridge.resetAllSiteOverrides();
    notify('Reset all per-website custom overrides.');
    loadOverrides();
  };

  const handleSyncFingerprint = async () => {
    await extensionBridge.broadcastProfile(currentProfile);
    notify('Broadcasted Reading Fingerprint to all active browser tabs.');
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

      {/* Header and Connection Status Banner */}
      <div className="bg-white rounded-2xl border border-[#F9E8EE] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#F9E8EE]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8E294B] uppercase tracking-wider">
              <Globe className="w-4 h-4 text-[#8E294B]" />
              Multi-Website Personalization
            </div>
            <h2 className="text-xl font-bold text-[#291923] mt-0.5">
              Browser Extension Integration
            </h2>
            <p className="text-xs text-[#806C77] mt-0.5 max-w-xl">
              AccessAI adapts external websites (like Wikipedia, news outlets, and documentation) to your Personal Reading Fingerprint in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5]">
            <div className="text-right">
              <div className="text-[10px] text-[#806C77] uppercase font-semibold">Extension Status</div>
              <div className="text-xs font-bold text-[#421426] flex items-center gap-1.5 justify-end">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#D8FF56] animate-pulse' : 'bg-[#806C77]'}`} />
                <span>{isConnected ? 'Connected & Active' : 'Standalone Web Mode'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Controls Row */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncFingerprint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
            >
              <Radio className="w-3.5 h-3.5 text-[#D8FF56]" />
              <span>Broadcast Fingerprint to All Tabs</span>
            </button>

            <button
              onClick={() => {
                const next = !adaptationEnabled;
                setAdaptationEnabled(next);
                notify(next ? 'Live web adaptation enabled.' : 'Live web adaptation paused.');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-xs font-semibold transition border border-[#F4C7D5]"
            >
              <span>{adaptationEnabled ? 'Pause Adaptation' : 'Resume Adaptation'}</span>
            </button>
          </div>

          <div className="text-xs text-[#806C77] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8E294B]" />
            <span>Zero telemetry transmitted to external servers</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Per-Website Overrides & Chrome Setup Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Per-Website Rules Manager (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
            <div>
              <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider">
                Per-Website Custom Overrides
              </h3>
              <p className="text-[11px] text-[#806C77] mt-0.5">
                Set custom reading styles for specific websites (e.g. github.com, nytimes.com).
              </p>
            </div>
            {overrides.length > 0 && (
              <button
                onClick={handleResetAllOverrides}
                className="text-[11px] font-semibold text-rose-600 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Add Override Form */}
          <form onSubmit={handleAddOverride} className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-[#806C77] block mb-1">Domain Name</label>
              <input
                type="text"
                placeholder="e.g. wikipedia.org"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full bg-white border border-[#F4C7D5] text-[#291923] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#806C77] block mb-1">Scale</label>
              <select
                value={newFontSize}
                onChange={(e) => setNewFontSize(Number(e.target.value))}
                className="w-full bg-white border border-[#F4C7D5] text-[#291923] rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
              >
                {[14, 16, 18, 20, 22, 24].map(s => (
                  <option key={s} value={s}>{s}px</option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-1.5 px-3 bg-[#421426] hover:bg-[#70243E] text-white rounded-lg font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Overrides Table */}
          <div className="space-y-2">
            {overrides.length === 0 ? (
              <div className="p-6 text-center text-[#806C77] text-xs">
                No custom site overrides configured. Your global Reading Fingerprint applies across all websites.
              </div>
            ) : (
              overrides.map(ov => (
                <div
                  key={ov.domain}
                  className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#291923]">{ov.domain}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#F4C7D5] text-[#421426] font-mono">
                      {ov.settings?.fontSize}px
                    </span>
                    <span className="text-[11px] text-[#806C77] capitalize">
                      {ov.settings?.theme} theme
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteOverride(ov.domain)}
                    className="p-1 text-[#806C77] hover:text-rose-600 transition"
                    title="Remove override"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Chrome Extension Installation Guide (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F9E8EE]">
            <Download className="w-4 h-4 text-[#8E294B]" />
            <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider">
              Install in Chrome
            </h3>
          </div>

          <p className="text-[#806C77] leading-relaxed">
            To adapt external third-party websites beyond this web dashboard, load the unpacked AccessAI extension into Google Chrome:
          </p>

          <ol className="space-y-2.5 pl-4 list-decimal text-[#291923]">
            <li className="leading-relaxed">
              Open Chrome and go to <code className="bg-[#FFF8FA] px-1.5 py-0.5 rounded border border-[#F4C7D5] font-mono text-[11px]">chrome://extensions</code>
            </li>
            <li className="leading-relaxed">
              Enable the <strong className="text-[#421426]">Developer mode</strong> toggle in the top-right corner.
            </li>
            <li className="leading-relaxed">
              Run <code className="bg-[#FFF8FA] px-1.5 py-0.5 rounded border border-[#F4C7D5] font-mono text-[11px]">npm run build:extension</code>, then click <strong className="text-[#421426]">Load unpacked</strong> and select the <code className="bg-[#FFF8FA] px-1.5 py-0.5 rounded border border-[#F4C7D5] font-mono text-[11px]">dist-extension</code> folder.
            </li>
            <li className="leading-relaxed">
              Pin AccessAI to your toolbar. Your Personal Reading Fingerprint will immediately personalize any web page you visit!
            </li>
          </ol>

          <div className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] text-[11px] text-[#806C77]">
            <strong className="text-[#421426] block mb-0.5">Standalone Web Studio Mode:</strong>
            Even without installing the extension, all features in this web application (Reading Studio, AI Assistant, Smart Focus, Read Aloud) are 100% active and functional.
          </div>
        </div>
      </div>
    </div>
  );
}
