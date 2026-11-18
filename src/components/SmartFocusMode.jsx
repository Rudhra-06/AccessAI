import React, { useState, useEffect } from 'react';
import {
  Eye,
  Sliders,
  Sparkles,
  Maximize2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Volume2,
  Command,
  Keyboard,
  CheckCircle2
} from 'lucide-react';
import { SmartFocusEngine } from '../content/smartFocus.js';
import { readAloudService } from '../speech/readAloudService.js';

export function SmartFocusMode({ currentProfile, onProfileUpdated }) {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState(0);
  const [focusStyle, setFocusStyle] = useState('sentence'); // 'sentence' | 'paragraph' | 'ruler'
  const [dimmingLevel, setDimmingLevel] = useState(60); // 20% to 80%
  const [focusWidth, setFocusWidth] = useState(720);
  const [rulerActive, setRulerActive] = useState(false);
  const [rulerPosition, setRulerPosition] = useState(160);
  const [notification, setNotification] = useState('');

  // Sample focus article split into paragraphs and sentences
  const paragraphs = [
    [
      "Modern web pages are flooded with competing visual stimuli.",
      "Popups, flashing sidebars, and dense multi-column grids constantly pull attention away from the core text.",
      "For readers with ADHD or dyslexia, this sensory overload significantly increases cognitive fatigue."
    ],
    [
      "Smart Focus Mode acts as a visual filter.",
      "By softly dimming peripheral content, your visual field naturally converges on a single sentence or paragraph at a time.",
      "This gentle isolation technique is called cognitive vignetting, and it reduces the effort needed to maintain your place."
    ],
    [
      "Use your keyboard arrow keys or the on-screen buttons below to navigate through each passage.",
      "Pressing the Down arrow or 'J' steps to the next sentence, while the Up arrow or 'K' steps back.",
      "You can also activate the Reading Ruler to follow your cursor as a guiding bar."
    ]
  ];

  // Flattened sentences list with paragraph references
  const flatSentences = [];
  paragraphs.forEach((p, pIdx) => {
    p.forEach((s, sIdx) => {
      flatSentences.push({ text: s, paragraphIndex: pIdx, sentenceIndex: sIdx });
    });
  });

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setActiveSentenceIndex(prev => Math.min(flatSentences.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setActiveSentenceIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'r') {
        e.preventDefault();
        toggleRuler();
      } else if (e.key === ' ') {
        e.preventDefault();
        // Read current sentence aloud
        const sentence = flatSentences[activeSentenceIndex]?.text;
        if (sentence) readAloudService.speak(sentence);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSentenceIndex]);

  const toggleRuler = () => {
    const next = !rulerActive;
    setRulerActive(next);
    SmartFocusEngine.toggleReadingRuler(next);
    setNotification(next ? 'Reading Ruler activated. Move your cursor to track.' : 'Reading Ruler hidden.');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleReadCurrent = () => {
    const sentence = flatSentences[activeSentenceIndex]?.text;
    if (sentence) {
      readAloudService.speak(sentence);
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

      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8E294B] uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            Distraction-Free Reading Workspace
          </div>
          <h2 className="text-xl font-bold text-[#291923] mt-0.5">
            Smart Focus Mode
          </h2>
          <p className="text-xs text-[#806C77] mt-0.5">
            Spotlight sentences, dim surrounding distractions, and guide your eyes with keyboard navigation.
          </p>
        </div>

        {/* Focus Mode Tool Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFocusStyle('sentence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              focusStyle === 'sentence' ? 'bg-[#421426] text-white' : 'bg-[#F9E8EE] text-[#421426] hover:bg-[#F4C7D5]'
            }`}
          >
            Sentence Spotlight
          </button>
          <button
            onClick={() => setFocusStyle('paragraph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              focusStyle === 'paragraph' ? 'bg-[#421426] text-white' : 'bg-[#F9E8EE] text-[#421426] hover:bg-[#F4C7D5]'
            }`}
          >
            Paragraph Spotlight
          </button>
          <button
            onClick={toggleRuler}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              rulerActive
                ? 'bg-[#D8FF56] text-[#421426] border-[#D8FF56]'
                : 'bg-[#F9E8EE] text-[#421426] border-[#F4C7D5] hover:bg-[#F4C7D5]'
            }`}
          >
            <span>{rulerActive ? 'Ruler Active' : 'Toggle Ruler (R)'}</span>
          </button>
          <button
            onClick={handleReadCurrent}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D8FF56]" />
            <span>Read Active</span>
          </button>
        </div>
      </div>

      {/* Focus Parameters Strip */}
      <div className="bg-white rounded-xl border border-[#F9E8EE] p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <div className="flex justify-between font-semibold text-[#806C77] mb-1">
            <span>Background Dimming</span>
            <span className="font-mono text-[#421426]">{dimmingLevel}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="85"
            step="5"
            value={dimmingLevel}
            onChange={(e) => setDimmingLevel(Number(e.target.value))}
            className="w-full accent-[#8E294B]"
          />
        </div>

        <div>
          <div className="flex justify-between font-semibold text-[#806C77] mb-1">
            <span>Focus Column Width</span>
            <span className="font-mono text-[#421426]">{focusWidth}px</span>
          </div>
          <input
            type="range"
            min="520"
            max="920"
            step="20"
            value={focusWidth}
            onChange={(e) => setFocusWidth(Number(e.target.value))}
            className="w-full accent-[#8E294B]"
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF8FA] border border-[#F9E8EE]">
          <div className="flex items-center gap-1.5 text-[#806C77]">
            <Keyboard className="w-4 h-4 text-[#8E294B]" />
            <span>Key Controls:</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#421426]">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#F4C7D5]">↓</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#F4C7D5]">↑</kbd>
            <span>Next/Prev</span>
          </div>
        </div>
      </div>

      {/* Focus Canvas Workspace */}
      <div
        className="relative bg-white rounded-2xl border border-[#F9E8EE] p-8 sm:p-12 shadow-sm min-h-[460px] transition-all"
        style={{
          maxWidth: `${focusWidth}px`,
          margin: '0 auto',
          fontFamily: currentProfile.fontFamily,
          fontSize: `${currentProfile.fontSize || 16}px`,
          lineHeight: currentProfile.lineSpacing || 1.5,
          letterSpacing: `${currentProfile.letterSpacing || 0}px`
        }}
      >
        <div className="space-y-6">
          {paragraphs.map((pSentences, pIdx) => {
            const isParagraphActive = flatSentences[activeSentenceIndex]?.paragraphIndex === pIdx;

            return (
              <p
                key={pIdx}
                onClick={() => {
                  const firstSentenceInP = flatSentences.findIndex(s => s.paragraphIndex === pIdx);
                  if (firstSentenceInP !== -1) setActiveSentenceIndex(firstSentenceInP);
                }}
                className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  focusStyle === 'paragraph'
                    ? isParagraphActive
                      ? 'bg-[#F9E8EE]/90 text-[#291923] shadow-sm ring-1 ring-[#8E294B]/30'
                      : 'text-[#806C77]'
                    : ''
                }`}
                style={{
                  opacity: focusStyle === 'paragraph' && !isParagraphActive ? (100 - dimmingLevel) / 100 : 1.0
                }}
              >
                {pSentences.map((sentence, sIdx) => {
                  const currentGlobalIndex = flatSentences.findIndex(
                    f => f.paragraphIndex === pIdx && f.sentenceIndex === sIdx
                  );
                  const isSentenceActive = activeSentenceIndex === currentGlobalIndex;

                  if (focusStyle === 'sentence') {
                    return (
                      <span
                        key={sIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSentenceIndex(currentGlobalIndex);
                        }}
                        className={`inline transition-all duration-200 rounded px-1 cursor-pointer ${
                          isSentenceActive
                            ? 'bg-[#D8FF56] text-[#291923] font-medium shadow-sm ring-2 ring-[#D8FF56]'
                            : 'hover:text-[#421426]'
                        }`}
                        style={{
                          opacity: isSentenceActive ? 1.0 : (100 - dimmingLevel) / 100
                        }}
                      >
                        {sentence}{' '}
                      </span>
                    );
                  }

                  return <span key={sIdx}>{sentence} </span>;
                })}
              </p>
            );
          })}
        </div>

        {/* Interactive Reading Position Stepper */}
        <div className="mt-8 pt-4 border-t border-[#F9E8EE] flex items-center justify-between text-xs text-[#806C77]">
          <span>
            Sentence {activeSentenceIndex + 1} of {flatSentences.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSentenceIndex(prev => Math.max(0, prev - 1))}
              disabled={activeSentenceIndex === 0}
              className="px-2.5 py-1 rounded bg-[#F9E8EE] text-[#421426] font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveSentenceIndex(prev => Math.min(flatSentences.length - 1, prev + 1))}
              disabled={activeSentenceIndex === flatSentences.length - 1}
              className="px-2.5 py-1 rounded bg-[#421426] text-white font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
