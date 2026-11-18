# AccessAI — Read Your Way

> **"Accessibility is no longer attached to websites. It is attached to people."**

AccessAI is an AI-powered personalized web accessibility platform and browser extension designed for individuals with:
- **Dyslexia**
- **ADHD**
- **Reading Difficulties & Fatigue**
- **Visual Reading Discomfort & Photophobia**

AccessAI learns individual reading preferences through interactive calibration, generates a **Personal Reading Fingerprint**, and personalizes the reading experience across supported websites.

Deployed Live Web Application: [https://accessai-red.vercel.app/](https://accessai-red.vercel.app/)

---

## 🎨 Visual Identity & Design System

Minimal + Premium + Modern AI + Accessibility-First.

### Official Color Palette
- **Deep Burgundy**: `#421426` (Primary navigation, buttons, brand anchors)
- **Dark Berry**: `#70243E` (Interactive hover states, secondary accents)
- **Accent Burgundy**: `#8E294B` (Focus rings, key metrics, sliders)
- **Light Pink**: `#F4C7D5` (Soft structural borders and badges)
- **Pale Pink**: `#F9E8EE` (Subtle container backgrounds, divider lines)
- **Background**: `#FFF8FA` (Soft warm page background, anti-glare)
- **White**: `#FFFFFF` (Content surfaces and reading canvas)
- **Neon Lime**: `#D8FF56` (Active AI states, progress indicators, selected elements)
- **Electric Lilac**: `#D5A5FF` (AI-generated cognitive insights)
- **Primary Text**: `#291923` (High-contrast accessible dark plum)
- **Secondary Text**: `#806C77` (Muted readable secondary guidance)

---

## 🌟 Core Application Sections

### 1. 🏠 Home Dashboard
- Personalized greeting and profile calibration status.
- Prominent section: *"Your reading experience, evolving."* showcasing compact visualization of current typography, scale, clearance, width, and contrast.
- Real-time browser extension connection detector.
- Actionable AI-generated suggestions supported by actual interaction rules.
- Recent reading session telemetry.

### 2. 🧬 Personal Reading Fingerprint
- Interactive onboarding assessment comparing reading samples across:
  - Font families (Inter, Lexend, Atkinson Hyperlegible, OpenDyslexic, Merriweather)
  - Text scales (14px to 21px)
  - Line and letter breathing room (1.35x to 1.8x)
  - Column widths (580px to 920px)
  - Background tones (Crisp White, Warm Parchment, Dark Berry, Dyslexia Peach, High Contrast Lime)
- Visual fingerprint card summarizing typography, spacing, contrast, background, focus, and environment.
- Full retake assessment and direct preference editing tools.
- *Strict non-medical diagnosis principle.*

### 3. 🎨 Reading Studio
- Comprehensive live reading customization workspace.
- Controls for font family, text scale, line spacing, letter spacing, word spacing, column width, and themes.
- Reading ruler and paragraph highlighting toggles.
- Real-time preview updating on every slider adjustment.
- Toolbar: Apply Fingerprint, Save Preferences, Reset to Default, Restore Previous.

### 4. 🎯 Smart Focus Mode
- Dedicated focus workspace with sentence spotlighting and paragraph highlighting.
- Adjustable peripheral background dimming (20% to 85%).
- Adjustable column width.
- Keyboard navigation (Arrow keys / `J`-`K` for sentence advancement, `R` for reading ruler, `Space` for speech).

### 5. 🤖 AI Reading Assistant
- Dual-mode architecture:
  - **Local Cognitive Engine**: 100% offline in-browser cognitive linguistic simplifier, sentence explainer, dictionary, summarizer, and key points extractor.
  - **Optional API Connector**: Supports user-provided Gemini or OpenAI API keys stored locally in IndexedDB.
- Features:
  1. *Simplify Text*: Rewrites into plain, accessible everyday words.
  2. *Explain This*: Breaks down dense clauses and decodes jargon.
  3. *Define Word*: Instant dictionary definition with phonetic pronunciation and examples.
  4. *Summarize*: Concise essential summary with percentage reduction.
  5. *Key Points*: Structured takeaway list for quick scanning.

### 6. 🔊 Read Aloud (Text-to-Speech)
- Native Web Speech API integration.
- Play, pause, resume, and stop controls.
- Speech speed selector (0.75x to 2.0x).
- System voice picker with natural language voice matching.
- Real-time synchronized word boundary spotlighting (`accessai-word-highlight`).

### 7. 📈 Reading Journey & Adaptive Insights
- Real logged reading sessions and duration telemetry.
- Learned dimension confidence gauges (Text Scale, Spacing, Warm Tone, Focus Tendency).
- User-reported comfort feedback buttons to reinforce adaptive weights.
- Chronological evolution timeline.

### 8. 🌐 Browser Extension Integration
- Live connection handshake detection (`window.__ACCESSAI_EXTENSION__` / `chrome.runtime`).
- Per-website custom override manager (e.g. `github.com`, `wikipedia.org`).
- One-click broadcast of Reading Fingerprint to all open tabs.
- Chrome extension unpacked installation instructions.

### 9. 🛡️ Settings & Privacy Center
- Reader profile name and display identifier.
- AI processing engine selection (Local In-Browser vs Custom API Key).
- 100% Client-Side Privacy Guarantee checklist.
- One-click data export as structured JSON.
- Reset learned weights or factory reset profile.

---

## 🚀 Getting Started

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

### Loading the Extension into Chrome
1. Run `npm run build`.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `dist/` directory.

---

## 🛡️ Privacy Guarantee

AccessAI is built with **Privacy by Design**:
- Zero server telemetry or analytics tracking.
- All fingerprint weights and reading sessions are stored locally in IndexedDB.
- No page content, passwords, form fields, or browsing URLs are ever transmitted.
