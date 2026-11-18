/**
 * AccessAI - Read Aloud / Text-to-Speech Service
 * Built-in browser-native Web Speech API with synchronized boundary highlighting
 */

export class ReadAloudService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.currentText = '';
    this.isPlaying = false;
    this.isPaused = false;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.selectedVoice = null;
    this.voices = [];
    this.listeners = new Set();

    if (this.synth) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
    if (!this.selectedVoice && this.voices.length > 0) {
      // Prefer clear natural English voices
      const natural = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      this.selectedVoice = natural || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }
    this.notify({ type: 'voices_loaded', voices: this.voices });
  }

  getVoices() {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices() || [];
    }
    return this.voices;
  }

  setVoice(voiceURI) {
    const v = this.voices.find(item => item.voiceURI === voiceURI || item.name === voiceURI);
    if (v) this.selectedVoice = v;
  }

  setRate(newRate) {
    this.rate = Math.min(2.5, Math.max(0.5, newRate));
    if (this.isPlaying && !this.isPaused) {
      // To adjust rate on the fly, restart from current position or restart text
      const remaining = this.currentText;
      this.speak(remaining, { rate: this.rate });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    this.listeners.forEach(cb => {
      try { cb(event); } catch (e) { console.error(e); }
    });
  }

  speak(text, options = {}) {
    if (!this.synth) {
      this.notify({ type: 'error', message: 'Speech Synthesis is not supported in this browser.' });
      return;
    }

    if (!text || text.trim().length === 0) {
      return;
    }

    this.stop();

    this.currentText = text.trim();
    const rate = options.rate || this.rate;
    const utterance = new SpeechSynthesisUtterance(this.currentText);

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = this.pitch;

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.notify({ type: 'start', text: this.currentText });
    };

    utterance.onboundary = (e) => {
      // Synchronized word or sentence boundary
      if (e.name === 'word' || e.name === 'sentence') {
        const charIndex = e.charIndex;
        // Find word slice
        const textSlice = this.currentText.slice(charIndex);
        const match = textSlice.match(/^[\w'-]+/);
        const word = match ? match[0] : '';
        const charLength = e.charLength || word.length;

        this.notify({
          type: 'boundary',
          boundaryName: e.name,
          charIndex,
          charLength,
          word
        });
      }
    };

    utterance.onpause = () => {
      this.isPaused = true;
      this.notify({ type: 'pause' });
    };

    utterance.onresume = () => {
      this.isPaused = false;
      this.notify({ type: 'resume' });
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify({ type: 'end' });
    };

    utterance.onerror = (err) => {
      // 'interrupted' is common on stop()
      if (err.error !== 'interrupted') {
        console.warn('[AccessAI ReadAloud]', err);
        this.notify({ type: 'error', error: err.error });
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify({ type: 'pause' });
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify({ type: 'resume' });
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify({ type: 'stop' });
    }
  }

  toggle(text) {
    if (this.isPlaying && !this.isPaused) {
      this.pause();
    } else if (this.isPaused) {
      this.resume();
    } else {
      this.speak(text);
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const readAloudService = new ReadAloudService();
