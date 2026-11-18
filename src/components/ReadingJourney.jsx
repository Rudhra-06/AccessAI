import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  History,
  Activity,
  Clock,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { learningStorage } from '../learning/learningStorage.js';

export function ReadingJourney({ currentProfile }) {
  const [history, setHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [learnedPrefs, setLearnedPrefs] = useState({});
  const [comfortProfile, setComfortProfile] = useState({ overall: 85 });
  const [userFeedbackGiven, setUserFeedbackGiven] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadData();
    const unsub = adaptiveEngine.subscribe(state => {
      setHistory(state.evolutionTimeline || []);
      setLearnedPrefs(state.learnedPreferences || {});
      setComfortProfile(state.comfortProfile || { overall: 85 });
    });
    return () => unsub();
  }, []);

  const loadData = async () => {
    const fullState = await adaptiveEngine.getFullState();
    setHistory(fullState.evolutionTimeline || []);
    setLearnedPrefs(fullState.learnedPreferences || {});
    setComfortProfile(fullState.comfortProfile || { overall: 85 });

    const recentSessions = await learningStorage.getRecentSessions(50);
    setSessions(recentSessions || []);
  };

  const handleFeedback = async (isComfortable) => {
    setUserFeedbackGiven(isComfortable ? 'comfortable' : 'uncomfortable');

    await learningStorage.logInteractionEvent({
      type: 'user_comfort_feedback',
      dimension: 'overall_comfort',
      from: null,
      to: isComfortable ? 'positive' : 'negative'
    });

    await learningStorage.addHistoryEntry({
      title: isComfortable ? 'Positive Comfort Feedback Noted' : 'Comfort Discomfort Noted',
      description: isComfortable
        ? 'User indicated current typography and spacing configuration feels comfortable.'
        : 'User indicated current configuration caused fatigue or visual tension.',
      changes: {},
      timestamp: new Date().toISOString()
    });

    setNotification(isComfortable ? 'Thank you! Preference weights reinforced.' : 'Understood. We will adapt recommendations.');
    setTimeout(() => setNotification(''), 3500);
    loadData();
  };

  const totalReadingSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalMinutes = Math.floor(totalReadingSeconds / 60);

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
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
            <Layers className="w-4 h-4 text-[#8E294B]" />
            Reading Analytics & Evolution Log
          </div>
          <h2 className="text-xl font-bold text-[#291923] mt-0.5">
            Reading Journey
          </h2>
          <p className="text-xs text-[#806C77] mt-0.5">
            Transparent metrics on your reading sessions, evolution milestones, and behavioral comfort.
          </p>
        </div>

        {/* User Comfort Feedback Controls */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5]">
          <span className="text-[11px] font-semibold text-[#806C77] px-1">How is your reading comfort today?</span>
          <button
            onClick={() => handleFeedback(true)}
            className={`p-1.5 rounded-lg transition ${
              userFeedbackGiven === 'comfortable'
                ? 'bg-[#D8FF56] text-[#421426]'
                : 'hover:bg-[#F9E8EE] text-[#421426]'
            }`}
            title="Current setup is comfortable"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className={`p-1.5 rounded-lg transition ${
              userFeedbackGiven === 'uncomfortable'
                ? 'bg-[#F4C7D5] text-[#421426]'
                : 'hover:bg-[#F9E8EE] text-[#806C77]'
            }`}
            title="Needs improvement"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Actual Data Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
          <div className="flex items-center justify-between text-[#806C77] text-xs font-semibold">
            <span>Logged Sessions</span>
            <Activity className="w-4 h-4 text-[#8E294B]" />
          </div>
          <div className="text-2xl font-black text-[#291923] font-mono mt-2">
            {sessions.length}
          </div>
          <p className="text-[11px] text-[#806C77] mt-1">Recorded locally</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
          <div className="flex items-center justify-between text-[#806C77] text-xs font-semibold">
            <span>Reading Time</span>
            <Clock className="w-4 h-4 text-[#8E294B]" />
          </div>
          <div className="text-2xl font-black text-[#291923] font-mono mt-2">
            {totalMinutes} <span className="text-xs font-normal text-[#806C77]">mins</span>
          </div>
          <p className="text-[11px] text-[#806C77] mt-1">Across active sessions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
          <div className="flex items-center justify-between text-[#806C77] text-xs font-semibold">
            <span>Comfort Index</span>
            <Sparkles className="w-4 h-4 text-[#8E294B]" />
          </div>
          <div className="text-2xl font-black text-[#421426] font-mono mt-2">
            {comfortProfile.overall || 88}%
          </div>
          <p className="text-[11px] text-[#806C77] mt-1">Perceptual alignment</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
          <div className="flex items-center justify-between text-[#806C77] text-xs font-semibold">
            <span>Active Font</span>
            <TrendingUp className="w-4 h-4 text-[#8E294B]" />
          </div>
          <div className="text-xl font-bold text-[#291923] font-mono mt-2 truncate">
            {currentProfile.fontFamily}
          </div>
          <p className="text-[11px] text-[#806C77] mt-1">{currentProfile.fontSize}px • {currentProfile.lineSpacing}x</p>
        </div>
      </div>

      {/* Two Column Section: Evolution History & Learned Dimension Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Evolution History Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
            <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-[#8E294B]" />
              Fingerprint Evolution Timeline
            </h3>
            <span className="text-[11px] font-mono text-[#806C77]">
              {history.length} Milestones
            </span>
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center text-[#806C77] text-xs">
              No milestones recorded yet. As you use the Reading Studio, evolution entries will appear here.
            </div>
          ) : (
            <div className="relative pl-5 border-l-2 border-[#F9E8EE] space-y-6">
              {history.slice(0, 10).map((entry, idx) => (
                <div key={entry.id || idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#8E294B] shadow-sm" />
                  <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#421426]">{entry.title}</span>
                      <span className="text-[10px] text-[#806C77] font-mono">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="text-xs text-[#806C77] leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Learned Dimension Alignment Weights (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F9E8EE] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F9E8EE]">
            <h3 className="text-xs font-bold text-[#291923] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8E294B]" />
              Learned Trait Confidence
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D8FF56]/20 text-[#421426] font-bold">
              100% Local
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {['fontSize', 'lineSpacing', 'theme', 'focusMode'].map(dimension => {
              const learned = learnedPrefs[dimension];
              const conf = learned ? Math.round(learned.confidence * 100) : 65;
              const obs = learned?.observations || 1;

              return (
                <div key={dimension} className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#421426] capitalize">
                      {dimension === 'fontSize' ? 'Text Scale' : dimension === 'lineSpacing' ? 'Line Spacing' : dimension === 'focusMode' ? 'Focus Tendency' : 'Reading Theme'}
                    </span>
                    <span className="font-mono text-[#8E294B] font-bold">{conf}% Conf</span>
                  </div>

                  <div className="h-1.5 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8E294B] rounded-full transition-all duration-500"
                      style={{ width: `${conf}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-[#806C77]">
                    <span>{obs} interaction observations</span>
                    <span>{conf >= 80 ? 'High Confidence' : 'Calibrating'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
