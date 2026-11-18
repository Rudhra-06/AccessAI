import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Square,
  RotateCcw,
  Sliders,
  Settings,
  Sparkles,
  VolumeX,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { readAloudService } from '../speech/readAloudService.js';

export function ReadAloud({ currentProfile }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [highlightedCharRange, setHighlightedCharRange] = useState({ start: -1, end: -1 });

  const defaultText = `Reading aloud bridges the visual and auditory processing systems. When words are spoken simultaneously with real-time highlighting, cognitive fatigue drops significantly. This multi-sensory synchronization allows individuals with dyslexia, ADHD, or visual strain to absorb information at their own natural speed without losing track of their position on the page.`;

  const [textToRead, setTextToRead] = useState(defaultText);

  // Split text into tokens/words for synchronized highlighting
  const words = textToRead.split(/(\s+)/);

  useEffect(() => {
    // Populate available system voices
    const available = readAloudService.getVoices();
    setVoices(available);
    if (available.length > 0 && !selectedVoiceURI) {
      setSelectedVoiceURI(readAloudService.selectedVoice?.voiceURI || available[0].voiceURI);
    }

    const unsub = readAloudService.subscribe((event) => {
      if (event.type === 'start') {
        setIsPlaying(true);
        setIsPaused(false);
      } else if (event.type === 'pause') {
        setIsPaused(true);
      } else if (event.type === 'resume') {
        setIsPaused(false);
      } else if (event.type === 'end' || event.type === 'stop') {
        setIsPlaying(false);
        setIsPaused(false);
        setHighlightedCharRange({ start: -1, end: -1 });
      } else if (event.type === 'voices_loaded') {
        setVoices(event.voices || []);
      } else if (event.type === 'boundary') {
        const start = event.charIndex;
        const end = event.charIndex + (event.charLength || 1);
        setHighlightedCharRange({ start, end });
      }
    });

    return () => {
      unsub();
      readAloudService.stop();
    };
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying && !isPaused) {
      readAloudService.pause();
    } else if (isPaused) {
      readAloudService.resume();
    } else {
      readAloudService.speak(textToRead, { rate: speed });
    }
  };

  const handleStop = () => {
    readAloudService.stop();
    setHighlightedCharRange({ start: -1, end: -1 });
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    readAloudService.setRate(newSpeed);
  };

  const handleVoiceChange = (uri) => {
    setSelectedVoiceURI(uri);
    readAloudService.setVoice(uri);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8E294B] uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-[#8E294B]" />
            Auditory Accessibility
          </div>
          <h2 className="text-xl font-bold text-[#291923] mt-0.5">
            Read Aloud Player
          </h2>
          <p className="text-xs text-[#806C77] mt-0.5">
            Synchronized text-to-speech engine with live word boundary spotlighting.
          </p>
        </div>

        {/* Speed Quick Selector */}
        <div className="flex items-center gap-1 bg-[#FFF8FA] p-1 rounded-xl border border-[#F4C7D5]">
          {[0.75, 1.0, 1.25, 1.5].map(s => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                speed === s ? 'bg-[#421426] text-white shadow-sm' : 'text-[#806C77] hover:text-[#421426]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Player & Interactive Synchronized Highlight Reader */}
      <div className="bg-white rounded-2xl border border-[#F9E8EE] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Playback Controls Strip */}
        <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayToggle}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition shadow-sm ${
                isPlaying && !isPaused
                  ? 'bg-[#70243E] hover:bg-[#421426]'
                  : 'bg-[#421426] hover:bg-[#70243E]'
              }`}
              aria-label={isPlaying && !isPaused ? 'Pause speech' : 'Play speech'}
            >
              {isPlaying && !isPaused ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="w-10 h-10 rounded-xl bg-white border border-[#F4C7D5] text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE] flex items-center justify-center transition disabled:opacity-40"
              title="Stop playback"
              aria-label="Stop playback"
            >
              <Square className="w-4 h-4" />
            </button>

            <div>
              <div className="text-xs font-bold text-[#291923]">
                {isPlaying && !isPaused ? 'Speaking...' : isPaused ? 'Paused' : 'Ready to Read'}
              </div>
              <div className="text-[11px] text-[#806C77]">
                Speed: {speed}x • Web Speech Synthesis
              </div>
            </div>
          </div>

          {/* Voice Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#806C77] font-semibold">Voice:</span>
            <select
              value={selectedVoiceURI}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="bg-white border border-[#F4C7D5] rounded-xl px-3 py-1.5 text-xs text-[#291923] max-w-[220px] truncate focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
            >
              {voices.length === 0 ? (
                <option value="">Default Browser Voice</option>
              ) : (
                voices.map((v, i) => (
                  <option key={v.voiceURI || i} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Synchronized Reading Surface */}
        <div
          className="p-6 sm:p-8 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] leading-relaxed text-sm text-[#291923] min-h-[220px]"
          style={{
            fontFamily: currentProfile.fontFamily,
            fontSize: `${Math.max(16, currentProfile.fontSize)}px`,
            lineHeight: currentProfile.lineSpacing || 1.6
          }}
        >
          {highlightedCharRange.start === -1 ? (
            <p>{textToRead}</p>
          ) : (
            <p>
              <span>{textToRead.slice(0, highlightedCharRange.start)}</span>
              <span className="accessai-word-highlight">
                {textToRead.slice(highlightedCharRange.start, highlightedCharRange.end)}
              </span>
              <span>{textToRead.slice(highlightedCharRange.end)}</span>
            </p>
          )}
        </div>

        {/* Custom Text Ingestion Field */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-[#421426] block">
            Custom Reading Material
          </label>
          <textarea
            rows={3}
            placeholder="Type or paste any text to read aloud..."
            value={textToRead}
            onChange={(e) => {
              handleStop();
              setTextToRead(e.target.value);
            }}
            className="w-full bg-[#FFF8FA] border border-[#F4C7D5] rounded-xl p-3 text-xs text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
