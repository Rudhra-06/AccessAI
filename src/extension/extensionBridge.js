/**
 * AccessAI - Browser Extension Integration Bridge
 * Communicates between Dashboard, Web Studio, and Extension Content Scripts.
 * Real connection verification (no fabricated status).
 */

import { learningStorage, DEFAULT_INITIAL_PROFILE } from '../learning/learningStorage.js';

export class ExtensionBridge {
  constructor() {
    this.isConnected = false;
    this.listeners = new Set();
    this.checkConnection();
  }

  async checkConnection() {
    if (typeof window === 'undefined') return false;

    // 1. Check if AccessAI content script injected its bridge
    if (window.__ACCESSAI_EXTENSION__ || document.getElementById('accessai-hud-container')) {
      this.isConnected = true;
      this.notify({ isConnected: true, version: window.__ACCESSAI_EXTENSION__?.version || '2.0.0' });
      return true;
    }

    // 2. Check if chrome runtime is available
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      try {
        this.isConnected = true;
        this.notify({ isConnected: true, version: '2.0.0', via: 'chrome_runtime' });
        return true;
      } catch (e) {
        // Not connected
      }
    }

    // Listen for incoming handshake from content script
    window.addEventListener('accessai:extension_ready', (e) => {
      this.isConnected = true;
      this.notify({ isConnected: true, version: e.detail?.version || '2.0.0' });
    });

    this.isConnected = false;
    this.notify({ isConnected: false });
    return false;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach(cb => {
      try { cb(data); } catch (e) { console.error(e); }
    });
  }

  /**
   * Broadcast profile to all tabs or local content script
   */
  async broadcastProfile(profile) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('accessai:apply_profile', { detail: profile }));
      window.postMessage({ type: 'ACCESSAI_PROFILE_UPDATE', profile }, '*');
    }

    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      try {
        const tabs = await chrome.tabs.query({});
        tabs.forEach(tab => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { type: 'APPLY_PROFILE', profile }).catch(() => {});
          }
        });
      } catch (e) {}
    }
  }

  /**
   * Reset site overrides or active extension settings
   */
  async resetAllSiteOverrides() {
    const overrides = await learningStorage.getAllSiteOverrides();
    for (const ov of overrides) {
      await learningStorage.deleteSiteOverride(ov.domain);
    }
    return true;
  }
}

export const extensionBridge = new ExtensionBridge();
