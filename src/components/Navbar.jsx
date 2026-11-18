import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  ShieldCheck,
  Eye,
  Volume2,
  Bot,
  Compass,
  Layers,
  Globe,
  Settings,
  Menu,
  X,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { extensionBridge } from '../extension/extensionBridge.js';

export function Navbar({ activeTab, onSelectTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState(false);

  useEffect(() => {
    extensionBridge.checkConnection().then(status => setExtensionStatus(status));
    const unsub = extensionBridge.subscribe(data => setExtensionStatus(data.isConnected));
    return () => unsub();
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sliders },
    { id: 'studio', label: 'Reading Studio', icon: Compass },
    { id: 'focus', label: 'Smart Focus', icon: Eye },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'speech', label: 'Read Aloud', icon: Volume2 },
    { id: 'fingerprint', label: 'Reading Fingerprint', icon: Sparkles },
    { id: 'journey', label: 'Reading Journey', icon: Layers },
    { id: 'extension', label: 'Extension', icon: Globe },
    { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#F4C7D5]/70 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            aria-label="AccessAI Home"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTab('dashboard'); }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#421426] text-[#FFF8FA] flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-[#70243E] transition-colors relative">
              <span>A</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D8FF56] border-2 border-white" title="AccessAI Engine Active" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#421426] text-lg tracking-tight">AccessAI</span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#70243E] border border-[#F4C7D5]">
                  Read Your Way
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-[#806C77]">
                Personalized Web Accessibility Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#421426] text-[#FFFFFF] shadow-sm'
                      : 'text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE]/70'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D8FF56]' : 'text-[#806C77]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Extension Badge Indicator */}
            <button
              onClick={() => onSelectTab('extension')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                extensionStatus
                  ? 'bg-[#D8FF56]/15 text-[#421426] border-[#D8FF56]/50'
                  : 'bg-[#F9E8EE] text-[#806C77] border-[#F4C7D5] hover:border-[#8E294B]'
              }`}
              title={extensionStatus ? 'Browser Extension Connected' : 'Extension Standalone Mode'}
            >
              <div className={`w-2 h-2 rounded-full ${extensionStatus ? 'bg-[#421426] animate-pulse' : 'bg-[#806C77]'}`} />
              <span>{extensionStatus ? 'Extension Connected' : 'Web Studio Mode'}</span>
            </button>

            {/* Assessment Button */}
            <button
              onClick={() => onSelectTab('fingerprint')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-xs font-bold transition border border-[#F4C7D5]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8E294B]" />
              <span>Assessment</span>
            </button>

            {/* Presentation Demo Link */}
            <a
              href="demo.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
              title="Launch Presentation Demo Scenario"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Demo</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-[#F9E8EE] text-[#421426] hover:bg-[#F4C7D5] transition"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Medium Screen Secondary Nav Pill Bar */}
        <div className="hidden lg:flex xl:hidden items-center gap-1 py-2 border-t border-[#F9E8EE] overflow-x-auto scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#421426] text-[#FFFFFF]'
                    : 'text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D8FF56]' : 'text-[#806C77]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FFFFFF] border-b border-[#F4C7D5] px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#421426] text-[#FFFFFF]'
                    : 'text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D8FF56]' : 'text-[#806C77]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-[#D8FF56]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
