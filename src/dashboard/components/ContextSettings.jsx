import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Code,
  LayoutDashboard,
  GraduationCap,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { learningStorage } from '../../learning/learningStorage.js';

export function ContextSettings({ siteOverrides, onOverridesUpdated }) {
  const [newDomain, setNewDomain] = useState('');
  const [newFontSize, setNewFontSize] = useState(18);
  const [newTheme, setNewTheme] = useState('warm');
  const [statusMsg, setStatusMsg] = useState('');

  const contextRules = [
    {
      category: 'article',
      title: 'Long Articles & News',
      icon: FileText,
      behavior: 'Prioritize reading comfort: enables distraction dimming and optimal paragraph column width.',
      active: true
    },
    {
      category: 'documentation',
      title: 'Technical Documentation',
      icon: Code,
      behavior: 'Preserve code syntax blocks, sidebars, and API tables while enhancing body copy readability.',
      active: true
    },
    {
      category: 'dashboard',
      title: 'Web Dashboards & Portals',
      icon: LayoutDashboard,
      behavior: 'Avoid modifying dense interactive controls and charts; apply soft font scaling to readable blocks only.',
      active: true
    },
    {
      category: 'education',
      title: 'Learning & Courseware',
      icon: GraduationCap,
      behavior: 'Enable Reading Ruler assistance and warm background tint by default.',
      active: true
    },
    {
      category: 'shopping',
      title: 'E-Commerce & Shopping',
      icon: ShoppingBag,
      behavior: 'Maintain strict product card and button dimensions; personalize item descriptions and reviews.',
      active: true
    },
  ];

  const handleAddOverride = async (e) => {
    e.preventDefault();
    if (!newDomain) return;

    let clean = newDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim().toLowerCase();
    if (!clean) return;

    await learningStorage.saveSiteOverride(clean, {
      fontSize: Number(newFontSize),
      theme: newTheme
    });

    setNewDomain('');
    setStatusMsg(`Saved custom override for ${clean}`);
    setTimeout(() => setStatusMsg(''), 3000);
    if (onOverridesUpdated) onOverridesUpdated();
  };

  const handleDeleteOverride = async (domain) => {
    await learningStorage.deleteSiteOverride(domain);
    setStatusMsg(`Deleted override for ${domain}`);
    setTimeout(() => setStatusMsg(''), 3000);
    if (onOverridesUpdated) onOverridesUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Status Msg */}
      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-[#F9E8EE] border border-[#F4C7D5] text-[#421426] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8E294B]" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Structural Context Heuristics */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
        <div className="pb-4 border-b border-[#F9E8EE]">
          <div className="flex items-center gap-2 text-[#8E294B] text-xs font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            Smart Structural Adaptation
          </div>
          <h2 className="text-xl font-bold text-[#291923] mt-1">
            Site Context Rules
          </h2>
          <p className="text-xs text-[#806C77] mt-1">
            AccessAI recognizes page structures (articles, docs, dashboards) and tailors its accessibility enhancements without reading webpage text.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {contextRules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.category}
                className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white text-[#8E294B] border border-[#F4C7D5] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider">{rule.title}</h3>
                    <p className="text-xs text-[#806C77] mt-1 leading-relaxed">{rule.behavior}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D8FF56]/30 text-[#421426] font-bold border border-[#D8FF56] shrink-0">
                  Active
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Site Overrides Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-bold text-[#291923] uppercase tracking-wider">
            Per-Website Custom Overrides
          </h3>
          <p className="text-xs text-[#806C77] mt-0.5">
            Specify fixed preferences for specific websites that take precedence over the global fingerprint.
          </p>
        </div>

        {/* Add Override Form */}
        <form onSubmit={handleAddOverride} className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs">
          <div>
            <label className="text-[11px] text-[#806C77] font-semibold block mb-1">Domain</label>
            <input
              type="text"
              placeholder="e.g. github.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="w-full bg-white border border-[#F4C7D5] text-[#291923] rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#806C77] font-semibold block mb-1">Font Size</label>
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
            <label className="text-[11px] text-[#806C77] font-semibold block mb-1">Theme</label>
            <select
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              className="w-full bg-white border border-[#F4C7D5] text-[#291923] rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
            >
              <option value="default">Crisp White</option>
              <option value="warm">Warm Parchment</option>
              <option value="dark">Dark Berry Slate</option>
              <option value="dyslexia">Dyslexia Peach</option>
              <option value="high-contrast">High Contrast Lime</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-1.5 px-3 bg-[#421426] hover:bg-[#70243E] text-white rounded-lg font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Override</span>
          </button>
        </form>

        {/* Overrides Table */}
        <div className="space-y-2">
          {siteOverrides.length === 0 ? (
            <div className="p-4 text-center text-[#806C77] text-xs">
              No custom site overrides configured. Global reading fingerprint applies everywhere.
            </div>
          ) : (
            siteOverrides.map((override) => (
              <div
                key={override.domain}
                className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#291923]">{override.domain}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#F4C7D5] text-[#421426] font-mono">
                    {override.settings?.fontSize}px
                  </span>
                  <span className="text-[11px] text-[#806C77] capitalize">
                    {override.settings?.theme} theme
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteOverride(override.domain)}
                  className="p-1.5 text-[#806C77] hover:text-rose-600 transition"
                  title="Remove override"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
