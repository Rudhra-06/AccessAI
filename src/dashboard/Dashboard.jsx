import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Layers,
  History,
  ShieldCheck,
  Globe,
  Play,
  RotateCcw,
  Sliders,
  ExternalLink,
  Check,
  Info,
  Menu,
  X,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { FingerprintEvolution } from './components/FingerprintEvolution.jsx';
import { ConfidenceGauges } from './components/ConfidenceGauges.jsx';
import { LearningInsights } from './components/LearningInsights.jsx';
import { TimelineView } from './components/TimelineView.jsx';
import { PrivacyCenter } from './components/PrivacyCenter.jsx';
import { ContextSettings } from './components/ContextSettings.jsx';
import { DEFAULT_INITIAL_PROFILE } from '../learning/learningStorage.js';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('evolution');
  const [state, setState] = useState({
    initialProfile: DEFAULT_INITIAL_PROFILE,
    currentProfile: DEFAULT_INITIAL_PROFILE,
    learnedPreferences: {},
    comfortProfile: { overall: 88 },
    insights: [],
    evolutionTimeline: [],
    adaptiveLearningEnabled: true,
    siteOverrides: []
  });
  const [notification, setNotification] = useState('');

  const loadState = async () => {
    const fullState = await adaptiveEngine.getFullState();
    setState(fullState);
  };

  useEffect(() => {
    loadState();
    const unsub = adaptiveEngine.subscribe(updated => {
      setState(updated);
    });

    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['evolution', 'comfort', 'insights', 'timeline', 'context', 'privacy'].includes(hash)) {
        setActiveTab(hash);
      }
    }

    return () => unsub();
  }, []);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleToggleAdaptive = async () => {
    const next = !state.adaptiveLearningEnabled;
    await adaptiveEngine.setAdaptiveLearningEnabled(next);
    notify(next ? 'Adaptive personalization enabled.' : 'Adaptive personalization paused.');
  };

  const handleRevertTrait = async (dimension, originalValue) => {
    await adaptiveEngine.updateCurrentProfile({ [dimension]: originalValue });
    notify(`Reverted ${dimension} to baseline ${originalValue}.`);
  };

  const handleRestoreInitial = async () => {
    await adaptiveEngine.restoreInitialFingerprint();
    notify('Restored initial reading fingerprint.');
  };

  const handleResetLearning = async () => {
    await adaptiveEngine.resetLearnedPreferences();
    notify('Reset learned preferences while keeping initial fingerprint.');
  };

  const handleResetAll = async () => {
    await adaptiveEngine.resetEverything();
    notify('Reset all AccessAI data.');
  };

  const tabs = [
    { id: 'evolution', label: 'Fingerprint Evolution', icon: Sparkles },
    { id: 'comfort', label: 'Comfort Profile', icon: Activity },
    { id: 'insights', label: 'Learned Insights', icon: Layers },
    { id: 'timeline', label: 'Evolution Timeline', icon: History },
    { id: 'context', label: 'Site Context Rules', icon: Globe },
    { id: 'privacy', label: 'Privacy Center', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8FA] text-[#291923] flex flex-col font-sans selection:bg-[#F4C7D5] selection:text-[#421426]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F4C7D5]/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="index.html"
              className="w-10 h-10 rounded-xl bg-[#421426] text-[#FFF8FA] flex items-center justify-center font-bold text-base shadow-sm hover:bg-[#70243E] transition-colors relative"
              title="Return to Main Studio"
            >
              <span>A</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D8FF56] border-2 border-white" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <a href="index.html" className="font-extrabold text-[#421426] text-lg tracking-tight hover:underline">
                  AccessAI
                </a>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F9E8EE] text-[#70243E] border border-[#F4C7D5]">
                  Dashboard
                </span>
              </div>
              <p className="text-xs text-[#806C77]">
                Personal Reading Evolution & Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <a
              href="index.html"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] font-semibold border border-[#F4C7D5] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Web Studio</span>
            </a>
            <a
              href="demo.html"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#421426] hover:bg-[#70243E] text-white font-bold transition shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Demo Mode</span>
            </a>
            <a
              href="onboarding.html"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] font-semibold border border-[#F4C7D5] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Assessment</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Toast Notification */}
        {notification && (
          <div className="p-3.5 rounded-xl bg-[#F9E8EE] border border-[#F4C7D5] text-[#421426] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
            <Check className="w-4 h-4 text-[#8E294B]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#F9E8EE]">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.location.hash = tab.id;
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-[#421426] text-white shadow-sm'
                    : 'bg-white text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE] border border-[#F9E8EE]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D8FF56]' : 'text-[#8E294B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div className="transition-all duration-200">
          {activeTab === 'evolution' && (
            <FingerprintEvolution
              initialProfile={state.initialProfile}
              currentProfile={state.currentProfile}
              learnedPreferences={state.learnedPreferences}
              onRevertTrait={handleRevertTrait}
              onRestoreInitial={handleRestoreInitial}
            />
          )}

          {activeTab === 'comfort' && (
            <ConfidenceGauges comfortProfile={state.comfortProfile} />
          )}

          {activeTab === 'insights' && (
            <LearningInsights insights={state.insights} />
          )}

          {activeTab === 'timeline' && (
            <TimelineView history={state.evolutionTimeline} />
          )}

          {activeTab === 'context' && (
            <ContextSettings
              siteOverrides={state.siteOverrides}
              onOverridesUpdated={loadState}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacyCenter
              adaptiveEnabled={state.adaptiveLearningEnabled}
              onToggleAdaptive={handleToggleAdaptive}
              onResetLearning={handleResetLearning}
              onResetAll={handleResetAll}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-[#F9E8EE] bg-white text-center text-xs text-[#806C77]">
        <p>
          AccessAI • Read Your Way. Accessibility is no longer attached to websites. It is attached to people.
        </p>
      </footer>
    </div>
  );
}
