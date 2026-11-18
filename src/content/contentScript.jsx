/**
 * AccessAI - Content Script & Website Personalization Engine
 * Injects non-destructive accessibility overrides and mounts the floating HUD.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { FloatingHUD } from './floatingHUD.jsx';
import { SmartFocusEngine } from './smartFocus.js';
import { sessionTracker } from '../analytics/readingSession.js';
import { adaptiveEngine } from '../learning/adaptiveEngine.js';
import { learningStorage, DEFAULT_INITIAL_PROFILE } from '../learning/learningStorage.js';
import {
  getEffectiveProfile,
  PROFILE_STORAGE_KEY,
  sanitizeProfile,
} from '../extension/profileSync.js';

let currentSiteOverride = false;
let activeProfile = DEFAULT_INITIAL_PROFILE;
let observer = null;

function getPersonalizationCSS(profile) {
  const themeStyles = {
    default: { background: 'transparent', color: 'inherit', link: 'inherit' },
    warm: { background: '#FAF4E6', color: '#2E241E', link: '#8E294B' },
    dark: { background: '#291923', color: '#F9E8EE', link: '#F4C7D5' },
    dyslexia: { background: '#F4EDD8', color: '#1A1E24', link: '#70243E' },
    'high-contrast': { background: '#000000', color: '#D8FF56', link: '#D5A5FF' },
  };

  const fontFamilies = {
    Inter: 'Inter, system-ui, sans-serif',
    Lexend: 'Lexend, system-ui, sans-serif',
    'Atkinson Hyperlegible': '"Atkinson Hyperlegible", sans-serif',
    Merriweather: 'Merriweather, Georgia, serif',
    OpenDyslexic: 'OpenDyslexic, sans-serif',
  };
  const safeProfile = sanitizeProfile(profile);
  const theme = themeStyles[safeProfile.theme];
  const chosenFont = fontFamilies[safeProfile.fontFamily];
  const themeDeclarations = safeProfile.theme === 'default'
    ? ''
    : `background-color: ${theme.background} !important; color: ${theme.color} !important;`;
  const textColor = safeProfile.theme === 'default' ? '' : `color: ${theme.color} !important;`;
  const linkRules = safeProfile.theme === 'default'
    ? ''
    : `
      .accessai-reading-root :is(a, a:visited),
      #mw-content-text .mw-parser-output :is(a, a:visited),
      article :is(a, a:visited),
      [role="main"] :is(a, a:visited) {
        color: ${theme.link} !important;
      }
    `;
  const focusRules = safeProfile.focusMode
    ? `
      .accessai-reading-root.accessai-focus-enabled :is(p, li, blockquote) {
        opacity: 0.35 !important;
        transition: opacity 120ms ease !important;
      }
      .accessai-reading-root.accessai-focus-enabled :is(p, li, blockquote):hover,
      .accessai-reading-root.accessai-focus-enabled :is(p, li, blockquote):focus-within {
        opacity: 1 !important;
      }
    `
    : '';
  const paragraphHighlight = safeProfile.paragraphHighlight
    ? '.accessai-reading-root p:hover { background-color: rgba(216, 255, 86, 0.24) !important; }'
    : '';

  return `
    .accessai-reading-root {
      ${themeDeclarations}
      ${safeProfile.contentWidth < 1600 ? `max-width: ${safeProfile.contentWidth}px !important; margin-inline: auto !important;` : ''}
      box-sizing: border-box !important;
    }

    .accessai-reading-root :is(p, li, dd, dt, blockquote, h1, h2, h3, h4, h5, h6),
    #mw-content-text .mw-parser-output :is(p, li, dd, dt, blockquote, h1, h2, h3, h4, h5, h6),
    article :is(p, li, dd, dt, blockquote, h1, h2, h3, h4, h5, h6),
    [role="main"] :is(p, li, dd, dt, blockquote, h1, h2, h3, h4, h5, h6) {
      font-family: ${chosenFont} !important;
      font-size: ${safeProfile.fontSize}px !important;
      line-height: ${safeProfile.lineSpacing} !important;
      letter-spacing: ${safeProfile.letterSpacing}px !important;
      word-spacing: ${safeProfile.wordSpacing}px !important;
      ${textColor}
    }

    ${linkRules}
    ${focusRules}
    ${paragraphHighlight}
    ${safeProfile.readingRuler ? '#accessai-reading-ruler { position: fixed !important; inset: 0 !important; pointer-events: none !important; z-index: 2147483640 !important; }' : ''}
    ${safeProfile.reducedMotion ? '.accessai-reading-root, .accessai-reading-root * { animation-duration: 0.001s !important; transition-duration: 0.001s !important; scroll-behavior: auto !important; }' : ''}
  `;
}

function findReadingRoot() {
  const selectors = [
    '#mw-content-text .mw-parser-output',
    '#mw-content-text',
    'article',
    '[role="main"]',
    'main',
    '.entry-content',
    '.post-content',
  ];

  for (const selector of selectors) {
    const root = document.querySelector(selector);
    if (root?.querySelector('p, h1, h2, h3')) return root;
  }

  return null;
}

function refreshReadingRoot() {
  document.querySelectorAll('.accessai-reading-root').forEach((root) => {
    if (root !== findReadingRoot()) root.classList.remove('accessai-reading-root');
  });
  const root = findReadingRoot();
  if (root) root.classList.add('accessai-reading-root');
  return root;
}

function applyProfile(profile) {
  const safeProfile = sanitizeProfile(profile);
  activeProfile = safeProfile;
  refreshReadingRoot();
  chrome.runtime.sendMessage({
    type: 'ACCESSAI_APPLY_STYLES',
    css: getPersonalizationCSS(safeProfile),
  }).then((response) => {
    if (response?.status !== 'ok') {
      throw new Error(response?.message || 'The background service worker rejected the page styles.');
    }
  }).catch((error) => console.error('[AccessAI] Failed to apply reading styles:', error));
  SmartFocusEngine.applyFocusMode(safeProfile.focusMode, 'article', false);
  SmartFocusEngine.toggleReadingRuler(safeProfile.readingRuler);
}

async function loadSynchronizedProfile() {
  const stored = await chrome.storage.local.get(PROFILE_STORAGE_KEY);
  let profiles = stored[PROFILE_STORAGE_KEY];

  if (!profiles?.globalProfile) {
    const legacyProfile = await learningStorage.getSetting('currentProfile', DEFAULT_INITIAL_PROFILE);
    const response = await chrome.runtime.sendMessage({
      type: 'ACCESSAI_SAVE_PROFILE',
      profile: legacyProfile,
    });
    if (response?.status !== 'ok') {
      throw new Error(response?.message || 'Could not migrate the saved reading profile.');
    }
    profiles = { ...profiles, globalProfile: legacyProfile };
  }

  const profile = getEffectiveProfile(profiles, window.location.hostname);
  const siteOverrides = profiles.siteOverrides || {};
  currentSiteOverride = Object.keys(siteOverrides).some((domain) => {
    const hostname = window.location.hostname.toLowerCase();
    return hostname === domain || hostname.endsWith(`.${domain}`);
  });
  return profile;
}

async function persistPageProfile(profile, domain = null) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'ACCESSAI_SAVE_PROFILE',
      profile,
      domain,
    });
    if (response?.status !== 'ok') {
      throw new Error(response?.message || 'The background service worker rejected the profile update.');
    }
  } catch (error) {
    console.error('[AccessAI] Failed to synchronize website preferences:', error);
  }
}

async function applySynchronizedProfile() {
  try {
    const profile = await loadSynchronizedProfile();
    applyProfile(profile);
    await adaptiveEngine.updateCurrentProfile(profile);
  } catch (error) {
    console.error('[AccessAI] Failed to load synchronized preferences:', error);
  }
}

function installProfileListeners() {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'ACCESSAI_PROFILES_UPDATED') {
      applySynchronizedProfile();
    }
  });

  window.addEventListener('accessai:apply_profile', (event) => {
    if (!event.detail) return;
    const profile = sanitizeProfile(event.detail);
    const changedProfile = Object.fromEntries(
      Object.entries(profile).filter(([field, value]) => value !== activeProfile[field]),
    );
    applyProfile(profile);
    learningStorage.setSetting('currentProfile', profile)
      .then(() => persistPageProfile(
        currentSiteOverride ? changedProfile : profile,
        currentSiteOverride ? window.location.hostname : null,
      ))
      .catch((error) => console.error('[AccessAI] Failed to persist page preferences:', error));
  });

  window.addEventListener('accessai:save_site_override', (event) => {
    const domain = event.detail?.domain;
    const profile = event.detail?.profile;
    if (domain && profile) persistPageProfile(profile, domain);
  });

  window.addEventListener('accessai:delete_site_override', (event) => {
    chrome.runtime.sendMessage({
      type: 'ACCESSAI_DELETE_SITE_OVERRIDE',
      domain: event.detail?.domain,
    }).then((response) => {
      if (response?.status !== 'ok') {
        throw new Error(response?.message || 'The website override could not be removed.');
      }
    }).catch((error) => console.error('[AccessAI] Failed to remove website override:', error));
  });

  window.addEventListener('accessai:clear_site_overrides', () => {
    chrome.runtime.sendMessage({
      type: 'ACCESSAI_SAVE_PROFILE',
      profile: DEFAULT_INITIAL_PROFILE,
      clearSiteOverrides: true,
    }).then((response) => {
      if (response?.status !== 'ok') {
        throw new Error(response?.message || 'Website overrides could not be cleared.');
      }
    }).catch((error) => console.error('[AccessAI] Failed to clear website overrides:', error));
  });
}

async function initContentScript() {
  if (window._accessaiInitialized) return;
  window._accessaiInitialized = true;
  installProfileListeners();

  const pageCategory = SmartFocusEngine.detectPageCategory();
  sessionTracker.startSession(pageCategory, window.location.hostname);

  const activeProfile = await loadSynchronizedProfile();
  await learningStorage.setSetting('currentProfile', activeProfile);
  const initialProfile = await learningStorage.getSetting('initialProfile', DEFAULT_INITIAL_PROFILE);
  applyProfile(activeProfile);

  // Mount Floating HUD
  const hudContainer = document.createElement('div');
  hudContainer.id = 'accessai-hud-container';
  document.body.appendChild(hudContainer);

  const root = createRoot(hudContainer);
  root.render(
    <FloatingHUD
      initialProfile={initialProfile}
      currentProfile={activeProfile}
      pageCategory={pageCategory}
    />
  );

  observer = new MutationObserver(() => refreshReadingRoot());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.dispatchEvent(new CustomEvent('accessai:extension_ready', {
    detail: { version: chrome.runtime.getManifest().version },
  }));

  // Handle session cleanup on page leave
  window.addEventListener('beforeunload', () => {
    sessionTracker.endSession();
    observer?.disconnect();
  });
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}
