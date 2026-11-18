import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  Eye,
  Sliders,
  Bot,
  Volume2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Globe,
  TrendingUp,
  Award
} from 'lucide-react';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { learningStorage } from '../learning/learningStorage.js';
import { extensionBridge } from '../extension/extensionBridge.js';

export function HomeDashboard({ profile, onNavigate, onUpdateProfile }) {
  const [greeting, setGreeting] = useState('Welcome');
  const [adaptiveState, setAdaptiveState] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [extensionStatus, setExtensionStatus] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Dynamic time-of-day greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Load actual adaptive state from IndexedDB
    adaptiveEngine.getFullState().then(state => {
      setAdaptiveState(state);
      setRecommendations(state.recommendations || []);
    });

    learningStorage.getRecentSessions(5).then(sessions => {
      setRecentSessions(sessions || []);
    });

    extensionBridge.checkConnection().then(status => {
      setExtensionStatus(status);
    });

    const unsub = adaptiveEngine.subscribe(state => {
      setAdaptiveState(state);
      setRecommendations(state.recommendations || []);
    });

    return () => unsub();
  }, []);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleApplyRecommendation = async (rec) => {
    await adaptiveEngine.applyRecommendation(
      rec.id,
      rec.targetDimension,
      rec.suggestedValue,
      rec.type === 'profile_evolution'
    );
    notify(`Applied recommendation: updated ${rec.targetDimension} to ${rec.suggestedValue}`);
  };

  const handleDismissRecommendation = async (rec) => {
    await adaptiveEngine.dismissRecommendation(rec.id);
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds < 60) return `${seconds || 0}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m ${seconds % 60}s`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-[#F9E8EE] border border-[#F4C7D5] text-[#421426] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#8E294B]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Welcome & Profile Status */}
      <section className="bg-white rounded-2xl border border-[#F9E8EE] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8E294B] uppercase tracking-wider">
                Personal Accessibility Engine
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#D8FF56]/30 text-[#421426] border border-[#D8FF56]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#421426] animate-pulse" />
                Adaptive Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#291923] tracking-tight">
              {greeting}, Reader.
            </h1>
            <p className="text-sm text-[#806C77] max-w-xl leading-relaxed">
              AccessAI conforms the web to your natural reading comfort. Explore your personalized reading studio, focus workspace, or adjust your Reading Fingerprint below.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('studio')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#D8FF56]" />
              <span>Open Reading Studio</span>
            </button>
            <button
              onClick={() => onNavigate('focus')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-xs font-bold transition border border-[#F4C7D5]"
            >
              <Eye className="w-4 h-4 text-[#8E294B]" />
              <span>Smart Focus Mode</span>
            </button>
          </div>
        </div>

        {/* Quick System Telemetry Row */}
        <div className="mt-8 pt-6 border-t border-[#F9E8EE] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE]">
            <div className="text-[11px] font-semibold text-[#806C77] uppercase">Active Font</div>
            <div className="text-sm font-bold text-[#291923] mt-0.5 font-mono">{profile.fontFamily}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE]">
            <div className="text-[11px] font-semibold text-[#806C77] uppercase">Scale & Spacing</div>
            <div className="text-sm font-bold text-[#291923] mt-0.5 font-mono">
              {profile.fontSize}px • {profile.lineSpacing}x
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE]">
            <div className="text-[11px] font-semibold text-[#806C77] uppercase">Reading Theme</div>
            <div className="text-sm font-bold text-[#291923] mt-0.5 capitalize">
              {profile.theme}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE]">
            <div className="text-[11px] font-semibold text-[#806C77] uppercase">Extension Status</div>
            <div className="text-sm font-bold text-[#291923] mt-0.5 flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${extensionStatus ? 'bg-[#421426]' : 'bg-[#806C77]'}`} />
              <span className="text-xs">{extensionStatus ? 'Connected' : 'Standalone'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Section: "Your reading experience, evolving." */}
      <section className="bg-white rounded-2xl border border-[#F9E8EE] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F9E8EE]">
          <div>
            <div className="flex items-center gap-2 text-[#8E294B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#8E294B]" />
              Continuous Behavioral Calibration
            </div>
            <h2 className="text-xl font-bold text-[#291923] mt-1">
              Your reading experience, evolving.
            </h2>
            <p className="text-xs text-[#806C77] mt-1">
              A compact visual representation of how your reading preferences are calibrated across your digital workspace.
            </p>
          </div>

          <button
            onClick={() => onNavigate('fingerprint')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#421426] hover:bg-[#F9E8EE] border border-[#F4C7D5] transition self-start md:self-auto"
          >
            <span>Calibrate Fingerprint</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Preference Visualization Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#806C77] uppercase">Typography</span>
            <div className="my-2">
              <div className="text-base font-bold text-[#421426] truncate" style={{ fontFamily: profile.fontFamily }}>
                {profile.fontFamily}
              </div>
              <p className="text-[10px] text-[#806C77] mt-0.5">Primary typeface</p>
            </div>
            <div className="h-1 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
              <div className="h-full bg-[#8E294B] w-full" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#806C77] uppercase">Text Size</span>
            <div className="my-2">
              <div className="text-base font-bold text-[#421426] font-mono">{profile.fontSize}px</div>
              <p className="text-[10px] text-[#806C77] mt-0.5">Perceptual scale</p>
            </div>
            <div className="h-1 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8E294B]"
                style={{ width: `${Math.min(100, Math.max(20, ((profile.fontSize - 12) / 16) * 100))}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#806C77] uppercase">Line Clearance</span>
            <div className="my-2">
              <div className="text-base font-bold text-[#421426] font-mono">{profile.lineSpacing}x</div>
              <p className="text-[10px] text-[#806C77] mt-0.5">Vertical breathing</p>
            </div>
            <div className="h-1 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8E294B]"
                style={{ width: `${Math.min(100, Math.max(20, ((profile.lineSpacing - 1.1) / 1.3) * 100))}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#806C77] uppercase">Reading Width</span>
            <div className="my-2">
              <div className="text-base font-bold text-[#421426] font-mono">{profile.contentWidth || 760}px</div>
              <p className="text-[10px] text-[#806C77] mt-0.5">Optimal column</p>
            </div>
            <div className="h-1 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8E294B]"
                style={{ width: `${Math.min(100, Math.max(20, ((profile.contentWidth - 500) / 500) * 100))}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#806C77] uppercase">Contrast Harmony</span>
            <div className="my-2">
              <div className="text-base font-bold text-[#421426] capitalize">{profile.theme}</div>
              <p className="text-[10px] text-[#806C77] mt-0.5">Background tone</p>
            </div>
            <div className="h-1 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
              <div className="h-full bg-[#8E294B] w-4/5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-[#806C77] uppercase">Focus State</span>
            <div className="my-2">
              <div className="text-base font-bold text-[#421426]">
                {profile.focusMode ? 'Active' : 'Standard'}
              </div>
              <p className="text-[10px] text-[#806C77] mt-0.5">Distraction filter</p>
            </div>
            <div className="h-1 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
              <div className={`h-full ${profile.focusMode ? 'bg-[#D8FF56]' : 'bg-[#F4C7D5]'} w-full`} />
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Suggestions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI-Generated Suggestions (Supported by actual recommendation rules) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#8E294B]" />
              <h3 className="text-sm font-bold text-[#291923] uppercase tracking-wider">
                Adaptive AI Suggestions
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#806C77]">
              {recommendations.length} Active
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#F9E8EE] text-[#8E294B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#291923]">Fingerprint is in harmony</h4>
              <p className="text-xs text-[#806C77] max-w-sm mx-auto leading-relaxed">
                AccessAI is observing non-sensitive reading interactions in the background. As you tune typography or switch themes in the Reading Studio, actionable suggestions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] space-y-2 transition-all hover:border-[#8E294B]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#421426] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D5A5FF]" />
                      {rec.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D8FF56]/30 text-[#421426] font-semibold border border-[#D8FF56]/60">
                      {Math.round(rec.confidence * 100)}% match
                    </span>
                  </div>
                  <p className="text-xs text-[#806C77] leading-relaxed">
                    {rec.explanation}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleApplyRecommendation(rec)}
                      className="px-3 py-1.5 rounded-lg bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D8FF56]" />
                      <span>{rec.actions[0]?.label || 'Apply'}</span>
                    </button>
                    <button
                      onClick={() => handleDismissRecommendation(rec)}
                      className="px-3 py-1.5 rounded-lg bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#806C77] text-xs font-medium transition"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actual Recent Reading Activity */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8E294B]" />
              <h3 className="text-sm font-bold text-[#291923] uppercase tracking-wider">
                Recent Reading Activity
              </h3>
            </div>
            <button
              onClick={() => onNavigate('journey')}
              className="text-[11px] font-semibold text-[#8E294B] hover:underline"
            >
              View Journey
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#F9E8EE] text-[#806C77] flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#291923]">No recorded sessions yet</h4>
              <p className="text-xs text-[#806C77] leading-relaxed">
                Reading duration and context adaptations are tracked locally when browsing or using the Reading Studio.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentSessions.map((session, idx) => (
                <div
                  key={session.id || idx}
                  className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#291923] capitalize">
                      {session.category || 'Article'} Reading
                    </div>
                    <div className="text-[11px] text-[#806C77] font-mono">
                      {session.domain || 'Local Studio'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-[#421426]">
                      {formatDuration(session.duration)}
                    </div>
                    <div className="text-[10px] text-[#806C77]">
                      {session.adjustmentsCount || 0} adjustments
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
