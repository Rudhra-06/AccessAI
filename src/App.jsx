import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  ShieldCheck,
  Activity,
  Heart,
  Globe,
  Compass,
  Eye,
  Bot,
  Volume2,
  Layers,
  Settings
} from 'lucide-react';
import { Navbar } from './components/Navbar.jsx';
import { HomeDashboard } from './components/HomeDashboard.jsx';
import { ReadingStudio } from './components/ReadingStudio.jsx';
import { SmartFocusMode } from './components/SmartFocusMode.jsx';
import { AIAssistant } from './components/AIAssistant.jsx';
import { ReadAloud } from './components/ReadAloud.jsx';
import { ReadingFingerprint } from './components/ReadingFingerprint.jsx';
import { ReadingJourney } from './components/ReadingJourney.jsx';
import { ExtensionIntegration } from './components/ExtensionIntegration.jsx';
import { SettingsPrivacy } from './components/SettingsPrivacy.jsx';
import { FloatingHUD } from './content/floatingHUD.jsx';
import { adaptiveEngine } from './learning/adaptiveEngine.js';
import { DEFAULT_INITIAL_PROFILE } from './learning/learningStorage.js';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(DEFAULT_INITIAL_PROFILE);
  const [adaptiveState, setAdaptiveState] = useState(null);

  useEffect(() => {
    // Handle initial state and subscription
    adaptiveEngine.getFullState().then(s => {
      setAdaptiveState(s);
      if (s.currentProfile) setProfile(s.currentProfile);
    });

    const unsub = adaptiveEngine.subscribe(s => {
      setAdaptiveState(s);
      if (s.currentProfile) setProfile(s.currentProfile);
    });

    // Check hash route if provided in URL (e.g. #studio, #ai, #focus)
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['dashboard', 'studio', 'focus', 'ai', 'speech', 'fingerprint', 'journey', 'extension', 'settings'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    }

    const handleApply = (e) => {
      if (e.detail) {
        setProfile(e.detail);
      }
    };
    window.addEventListener('accessai:apply_profile', handleApply);

    return () => {
      unsub();
      window.removeEventListener('accessai:apply_profile', handleApply);
    };
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF8FA] text-[#291923] flex flex-col font-sans selection:bg-[#F4C7D5] selection:text-[#421426]">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} onSelectTab={handleTabChange} />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {activeTab === 'dashboard' && (
          <HomeDashboard
            profile={profile}
            onNavigate={handleTabChange}
            onUpdateProfile={setProfile}
          />
        )}

        {activeTab === 'studio' && (
          <ReadingStudio
            currentProfile={profile}
            onProfileUpdated={setProfile}
          />
        )}

        {activeTab === 'focus' && (
          <SmartFocusMode
            currentProfile={profile}
            onProfileUpdated={setProfile}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistant />
        )}

        {activeTab === 'speech' && (
          <ReadAloud currentProfile={profile} />
        )}

        {activeTab === 'fingerprint' && (
          <ReadingFingerprint
            currentProfile={profile}
            onProfileUpdated={setProfile}
          />
        )}

        {activeTab === 'journey' && (
          <ReadingJourney currentProfile={profile} />
        )}

        {activeTab === 'extension' && (
          <ExtensionIntegration currentProfile={profile} />
        )}

        {activeTab === 'settings' && (
          <SettingsPrivacy
            currentProfile={profile}
            onProfileUpdated={setProfile}
          />
        )}
      </main>

      {/* Floating HUD Quick Controls */}
      <FloatingHUD
        initialProfile={adaptiveState?.initialProfile || DEFAULT_INITIAL_PROFILE}
        currentProfile={profile}
        pageCategory="article"
      />

      {/* Minimal Inclusive Footer */}
      <footer className="mt-auto border-t border-[#F9E8EE] bg-white py-8 text-xs text-[#806C77]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#421426] text-[#D8FF56] flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <span className="font-extrabold text-[#421426]">AccessAI</span>
              <span className="mx-2 text-[#F4C7D5]">|</span>
              <span className="italic font-medium">Read Your Way.</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => handleTabChange('fingerprint')} className="hover:text-[#421426]">Reading Fingerprint</button>
            <button onClick={() => handleTabChange('studio')} className="hover:text-[#421426]">Reading Studio</button>
            <button onClick={() => handleTabChange('focus')} className="hover:text-[#421426]">Focus Mode</button>
            <button onClick={() => handleTabChange('settings')} className="hover:text-[#421426]">Privacy Center</button>
            <a href="demo.html" target="_blank" rel="noreferrer" className="hover:text-[#421426] font-bold text-[#8E294B]">Demo Simulator</a>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#806C77]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8E294B]" />
            <span>100% In-Browser Privacy • Zero External Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
