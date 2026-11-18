import { DEFAULT_INITIAL_PROFILE } from '../learning/profileDefaults.js';

export const PROFILE_STORAGE_KEY = 'accessaiProfiles';
export const FONT_FAMILIES = [
  'Inter',
  'Lexend',
  'Atkinson Hyperlegible',
  'Merriweather',
  'OpenDyslexic',
];
export const READING_THEMES = ['default', 'warm', 'dark', 'dyslexia', 'high-contrast'];

const numericRanges = {
  fontSize: [12, 40],
  lineSpacing: [1, 3],
  letterSpacing: [-2, 20],
  wordSpacing: [-2, 30],
  contentWidth: [320, 1600],
  contrast: [50, 200],
  ttsSpeed: [0.5, 3],
};
const booleanFields = [
  'focusMode',
  'readingRuler',
  'paragraphHighlight',
  'sentenceHighlight',
  'dimBackground',
  'reducedMotion',
];

export function sanitizeProfile(profile, fallback = DEFAULT_INITIAL_PROFILE) {
  const safeProfile = { ...fallback };
  if (!profile || typeof profile !== 'object') return safeProfile;

  if (FONT_FAMILIES.includes(profile.fontFamily)) {
    safeProfile.fontFamily = profile.fontFamily;
  }
  if (READING_THEMES.includes(profile.theme)) {
    safeProfile.theme = profile.theme;
  }

  for (const [field, [minimum, maximum]] of Object.entries(numericRanges)) {
    const value = Number(profile[field]);
    if (Number.isFinite(value)) {
      safeProfile[field] = Math.min(maximum, Math.max(minimum, value));
    }
  }

  for (const field of booleanFields) {
    if (typeof profile[field] === 'boolean') safeProfile[field] = profile[field];
  }

  return safeProfile;
}

export function normalizeDomain(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.hostname.toLowerCase().replace(/\.$/, '');
  } catch {
    return '';
  }
}

export function getEffectiveProfile(storedProfiles, hostname, fallback = DEFAULT_INITIAL_PROFILE) {
  const globalProfile = sanitizeProfile(storedProfiles?.globalProfile, fallback);
  return sanitizeProfile({
    ...globalProfile,
    ...getSiteOverride(storedProfiles, hostname),
  }, globalProfile);
}

export function getSiteOverride(storedProfiles, hostname) {
  const domain = normalizeDomain(hostname);
  if (!domain) return {};

  const overrides = storedProfiles?.siteOverrides || {};
  const domainParts = domain.split('.');
  const candidates = [domain];

  for (let index = 1; index < domainParts.length - 1; index += 1) {
    candidates.push(domainParts.slice(index).join('.'));
  }

  return candidates.reverse().reduce((profile, candidate) => ({
    ...profile,
    ...(overrides[candidate] || {}),
  }), {});
}
