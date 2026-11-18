/**
 * AccessAI - Smart Content Focus & Context Detection Engine
 * Classifies page layout structurally without capturing text content.
 * Isolates readability zones, preserves code blocks, and manages the reading ruler.
 */

export class SmartFocusEngine {
  /**
   * Detect structural page category from DOM signals
   */
  static detectPageCategory() {
    if (typeof document === 'undefined') return 'general';

    // 1. Documentation detection
    const codeBlocks = document.querySelectorAll('pre, code, .highlight, .code-snippet, .hljs');
    const docSidebars = document.querySelectorAll('.sidebar, .docs-nav, .table-of-contents, [role="navigation"]');
    if (codeBlocks.length >= 3 || (codeBlocks.length >= 1 && docSidebars.length >= 1)) {
      return 'documentation';
    }

    // 2. Article / News / Blog detection
    const articles = document.querySelectorAll('article, [itemtype*="Article"], [role="article"], .article-body, .entry-content, .post-content');
    const paragraphs = document.querySelectorAll('p');
    if (articles.length >= 1 || (paragraphs.length >= 6 && document.querySelector('h1'))) {
      return 'article';
    }

    // 3. Dashboard / Data App detection
    const charts = document.querySelectorAll('canvas, svg.chart, .metric, .kpi, .dashboard-grid, [data-chart]');
    const tables = document.querySelectorAll('table, .data-grid');
    if (charts.length >= 2 || (charts.length >= 1 && tables.length >= 1)) {
      return 'dashboard';
    }

    // 4. Shopping / E-commerce detection
    const buyButtons = document.querySelectorAll('[class*="add-to-cart"], [id*="add-to-cart"], [class*="product-price"], [itemtype*="Product"]');
    if (buyButtons.length >= 1) {
      return 'shopping';
    }

    // 5. Education / Courseware detection
    const eduSignals = document.querySelectorAll('.quiz, .lesson, .course-outline, .lecture, [class*="exercise"]');
    if (eduSignals.length >= 1) {
      return 'education';
    }

    return 'general';
  }

  /**
   * Find main reading target element without storing text
   */
  static findPrimaryReadingContainer() {
    if (typeof document === 'undefined') return null;

    const candidates = [
      '#mw-content-text .mw-parser-output',
      '#mw-content-text',
      'article',
      '.entry-content',
      '.post-content',
      '[role="main"]',
      'main',
    ];
    for (const selector of candidates) {
      const candidate = document.querySelector(selector);
      if (candidate?.querySelector('p, h1, h2, h3')) return candidate;
    }

    return null;
  }

  static applyFocusMode(enabled, category = 'general', manageStyles = true) {
    const styleElement = document.getElementById('accessai-focus-style');
    if (styleElement) styleElement.remove();
    document.querySelectorAll('.accessai-focus-enabled').forEach((element) => {
      element.classList.remove('accessai-focus-enabled');
    });
    const primary = this.findPrimaryReadingContainer();
    if (primary) primary.classList.add('accessai-reading-root');
    if (enabled && primary) primary.classList.add('accessai-focus-enabled');
    if (enabled && manageStyles) {
      const style = document.createElement('style');
      style.id = 'accessai-focus-style';
      style.textContent = `
        .accessai-reading-root.accessai-focus-enabled :is(p, li, blockquote) { opacity: 0.35 !important; transition: opacity 120ms ease !important; }
        .accessai-reading-root.accessai-focus-enabled :is(p, li, blockquote):hover,
        .accessai-reading-root.accessai-focus-enabled :is(p, li, blockquote):focus-within { opacity: 1 !important; }
        .accessai-reading-root.accessai-focus-enabled :is(pre, code) { opacity: 1 !important; }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
  }

  static toggleReadingRuler(enabled) {
    let ruler = document.getElementById('accessai-reading-ruler');

    if (!enabled) {
      if (ruler) ruler.remove();
      if (window._accessaiRulerMove) window.removeEventListener('mousemove', window._accessaiRulerMove);
      window._accessaiRulerMove = null;
      return;
    }

    if (!ruler) {
      ruler = document.createElement('div');
      ruler.id = 'accessai-reading-ruler';
      ruler.setAttribute('aria-hidden', 'true');
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(`
        .track {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          height: 52px;
          box-sizing: border-box;
          background: rgba(216, 255, 86, 0.15);
          border-block: 2px solid #8E294B;
          box-shadow: 0 0 0 9999px rgba(41, 25, 35, 0.38);
          transition: top 50ms linear;
        }
      `);
      const shadow = ruler.attachShadow({ mode: 'closed' });
      shadow.adoptedStyleSheets = [sheet];
      const track = document.createElement('div');
      track.className = 'track';
      shadow.append(track);
      document.body.appendChild(ruler);

      window._accessaiRulerMove = (event) => {
        sheet.cssRules[0].style.top = `${Math.max(0, Math.min(window.innerHeight - 52, event.clientY - 26))}px`;
      };
      window.addEventListener('mousemove', window._accessaiRulerMove, { passive: true });
    }
  }
}
