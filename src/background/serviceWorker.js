/**
 * AccessAI - Background Service Worker (Manifest V3)
 */

import {
  getSiteOverride,
  normalizeDomain,
  PROFILE_STORAGE_KEY,
  sanitizeProfile,
} from '../extension/profileSync.js';

const styleOperations = new Map();

function applyTabStyles(tabId, documentId, css) {
  const key = `${tabId}:${documentId || 'main'}`;
  const previous = styleOperations.get(key) || Promise.resolve();
  const operation = previous.catch(() => {}).then(async () => {
    const storageKey = `accessaiStyles:${key}`;
    const stored = await chrome.storage.session.get(storageKey);
    const target = documentId
      ? { tabId, documentIds: [documentId] }
      : { tabId, frameIds: [0] };

    if (stored[storageKey]) {
      try {
        await chrome.scripting.removeCSS({
          target,
          css: stored[storageKey],
          origin: 'USER',
        });
      } catch (error) {
        console.warn('[AccessAI] Previous page styles could not be removed:', error);
      }
    }

    await chrome.scripting.insertCSS({ target, css, origin: 'USER' });
    await chrome.storage.session.set({ [storageKey]: css });
  });
  styleOperations.set(key, operation);
  const clearOperation = () => {
    if (styleOperations.get(key) === operation) styleOperations.delete(key);
  };
  operation.then(clearOperation, clearOperation);
  return operation;
}

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Open Onboarding Reading Assessment on initial install
    chrome.tabs.create({
      url: chrome.runtime.getURL('onboarding.html')
    });
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' || !changes[PROFILE_STORAGE_KEY]) return;

  chrome.tabs.query({}).then((tabs) => {
    for (const tab of tabs) {
      if (!tab.id || !/^https?:/.test(tab.url || '')) continue;
      chrome.tabs.sendMessage(tab.id, { type: 'ACCESSAI_PROFILES_UPDATED' }).catch(() => {});
    }
  }).catch((error) => {
    console.error('[AccessAI] Failed to notify tabs about profile changes:', error);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_DASHBOARD') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('dashboard.html')
    });
    sendResponse({ status: 'ok' });
    return false;
  }

  if (message.type === 'ACCESSAI_SAVE_PROFILE') {
    (async () => {
      const domain = normalizeDomain(message.domain);
      const stored = await chrome.storage.local.get(PROFILE_STORAGE_KEY);
      const profiles = stored[PROFILE_STORAGE_KEY] || {};

      if (message.clearSiteOverrides) {
        profiles.siteOverrides = {};
      } else if (domain) {
        const baseProfile = {
          ...(profiles.globalProfile || {}),
          ...getSiteOverride(profiles, domain),
        };
        const profile = sanitizeProfile({ ...baseProfile, ...message.profile }, baseProfile);
        profiles.siteOverrides = {
          ...(profiles.siteOverrides || {}),
          [domain]: profile,
        };
      } else {
        profiles.globalProfile = sanitizeProfile(message.profile);
      }

      await chrome.storage.local.set({ [PROFILE_STORAGE_KEY]: profiles });
      sendResponse({ status: 'ok', domain: domain || null });
    })().catch((error) => {
      console.error('[AccessAI] Failed to save synchronized preferences:', error);
      sendResponse({ status: 'error', message: error.message });
    });
    return true;
  }

  if (message.type === 'ACCESSAI_DELETE_SITE_OVERRIDE') {
    (async () => {
      const domain = normalizeDomain(message.domain);
      if (!domain) throw new Error('A valid website domain is required.');

      const stored = await chrome.storage.local.get(PROFILE_STORAGE_KEY);
      const profiles = stored[PROFILE_STORAGE_KEY] || {};
      const siteOverrides = { ...(profiles.siteOverrides || {}) };
      delete siteOverrides[domain];
      await chrome.storage.local.set({
        [PROFILE_STORAGE_KEY]: { ...profiles, siteOverrides },
      });
      sendResponse({ status: 'ok' });
    })().catch((error) => {
      console.error('[AccessAI] Failed to remove website preferences:', error);
      sendResponse({ status: 'error', message: error.message });
    });
    return true;
  }

  if (message.type === 'ACCESSAI_APPLY_STYLES') {
    if (!sender.tab?.id || typeof message.css !== 'string' || message.css.length > 20000) {
      sendResponse({ status: 'error', message: 'A valid page and stylesheet are required.' });
      return false;
    }

    applyTabStyles(sender.tab.id, sender.documentId, message.css).then(() => {
      sendResponse({ status: 'ok' });
    }).catch((error) => {
      console.error('[AccessAI] Failed to apply styles to the website:', error);
      sendResponse({ status: 'error', message: error.message });
    });
    return true;
  }

  return true;
});
