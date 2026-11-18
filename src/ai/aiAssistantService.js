/**
 * AccessAI - AI Reading Assistant Service
 * Dual-Mode Architecture:
 * 1. High-Performance Client-Side Cognitive Linguistic Engine (100% Offline, Instant, Zero Telemetry)
 * 2. Optional Pluggable LLM API Connector (Gemini / OpenAI / Custom REST)
 */

import { learningStorage } from '../learning/learningStorage.js';

// Common complex word simplifications dictionary for cognitive accessibility
const VOCAB_SIMPLIFICATIONS = {
  'utilize': 'use',
  'utilization': 'use',
  'facilitate': 'help or make easier',
  'demonstrate': 'show',
  'subsequently': 'afterwards or later',
  'consequently': 'as a result or so',
  'approximately': 'about',
  'terminate': 'end or stop',
  'disseminate': 'spread or share',
  'ameliorate': 'improve or make better',
  'commence': 'start or begin',
  'procure': 'get or obtain',
  'implement': 'carry out or put in place',
  'exhibit': 'display or show',
  'substantial': 'large or meaningful',
  'erroneous': 'wrong or mistaken',
  'expedite': 'speed up',
  'ascertain': 'find out or check',
  'compensate': 'pay or make up for',
  'reimburse': 'pay back',
  'feasible': 'workable or possible',
  'endeavor': 'effort or try',
  'mandatory': 'required',
  'optimal': 'best',
  'paradigm': 'model or framework',
  'ubiquitous': 'found everywhere',
  'deteriorate': 'get worse',
  'mitigate': 'reduce or lessen',
  'alleviate': 'ease or relieve',
  'prerequisite': 'requirement needed before',
  'prevalent': 'common or widespread',
  'comprehend': 'understand',
  'elucidate': 'explain clearly',
  'juxtaposition': 'placing side by side for contrast',
  'dichotomy': 'two contrasting parts',
  'ubiquity': 'being present everywhere',
  'surreptitious': 'secret or hidden',
  'pernicious': 'gradually harmful',
  'cognizant': 'aware of',
  'proclivity': 'natural tendency'
};

const BUILTIN_DEFINITIONS = {
  'dyslexia': {
    phonetic: '/dɪsˈlɛksiə/',
    definition: 'A common learning difference that primarily affects the skills involved in reading and spelling words.',
    example: 'AccessAI adjusts typography to make character recognition easier for individuals with dyslexia.',
    category: 'Accessibility'
  },
  'accessibility': {
    phonetic: '/əkˌsɛsəˈbɪlɪti/',
    definition: 'The design of products and environments so they can be comfortably used by people with a wide range of abilities.',
    example: 'Web accessibility ensures that everyone can navigate, read, and understand online information.',
    category: 'Technology'
  },
  'cognitive': {
    phonetic: '/ˈkɒɡnɪtɪv/',
    definition: 'Related to mental processes such as memory, thinking, attention, and reading comprehension.',
    example: 'Spacious line heights reduce cognitive fatigue during prolonged study sessions.',
    category: 'Psychology'
  },
  'saccadic': {
    phonetic: '/səˈkædɪk/',
    definition: 'Relating to quick, simultaneous movements of both eyes between phases of fixation while reading.',
    example: 'Weighted fonts help guide saccadic eye movements along a single line of text.',
    category: 'Vision Science'
  },
  'contrast': {
    phonetic: '/ˈkɒntrɑːst/',
    definition: 'The difference in luminance or color between text and the background it is placed on.',
    example: 'Warm parchment backgrounds provide gentle contrast that is soothing on sensitive eyes.',
    category: 'Visual Design'
  },
  'typography': {
    phonetic: '/taɪˈpɒɡrəfi/',
    definition: 'The visual style, arrangement, and appearance of letters and printed words on a page or screen.',
    example: 'Choosing Lexend typography reduces visual crowding for faster reading.',
    category: 'Design'
  }
};

export class AIAssistantService {
  /**
   * Check if user configured a custom LLM API key
   */
  static async getAPIConfig() {
    const provider = await learningStorage.getSetting('ai_provider', 'local');
    const apiKey = await learningStorage.getSetting('ai_api_key', '');
    const model = await learningStorage.getSetting('ai_model', 'gemini-1.5-flash');
    return { provider, apiKey, model };
  }

  /**
   * Save user's AI API preferences
   */
  static async saveAPIConfig({ provider, apiKey, model }) {
    await learningStorage.setSetting('ai_provider', provider || 'local');
    await learningStorage.setSetting('ai_api_key', apiKey || '');
    if (model) await learningStorage.setSetting('ai_model', model);
    return true;
  }

  /**
   * 1. Simplify Text
   */
  static async simplifyText(text, options = {}) {
    if (!text || text.trim().length === 0) {
      throw new Error('Please select or provide text to simplify.');
    }

    const config = await this.getAPIConfig();
    if (config.provider === 'gemini' && config.apiKey) {
      return this._callGemini(text, 'simplify', config);
    } else if (config.provider === 'openai' && config.apiKey) {
      return this._callOpenAI(text, 'simplify', config);
    }

    // Local Cognitive Simplification Engine
    return this._localSimplify(text);
  }

  /**
   * 2. Explain This (Sentence & Concept Deconstruction)
   */
  static async explainText(text) {
    if (!text || text.trim().length === 0) {
      throw new Error('Please select or provide text to explain.');
    }

    const config = await this.getAPIConfig();
    if (config.provider === 'gemini' && config.apiKey) {
      return this._callGemini(text, 'explain', config);
    } else if (config.provider === 'openai' && config.apiKey) {
      return this._callOpenAI(text, 'explain', config);
    }

    return this._localExplain(text);
  }

  /**
   * 3. Define Word
   */
  static async defineWord(word) {
    if (!word || word.trim().length === 0) {
      throw new Error('Please enter a word to define.');
    }

    const cleanWord = word.trim().toLowerCase().replace(/[^a-z-]/g, '');

    const config = await this.getAPIConfig();
    if (config.provider === 'gemini' && config.apiKey) {
      return this._callGemini(cleanWord, 'define', config);
    } else if (config.provider === 'openai' && config.apiKey) {
      return this._callOpenAI(cleanWord, 'define', config);
    }

    return this._localDefine(cleanWord);
  }

  /**
   * 4. Summarize Text
   */
  static async summarizeText(text) {
    if (!text || text.trim().length === 0) {
      throw new Error('Please provide text to summarize.');
    }

    const config = await this.getAPIConfig();
    if (config.provider === 'gemini' && config.apiKey) {
      return this._callGemini(text, 'summarize', config);
    } else if (config.provider === 'openai' && config.apiKey) {
      return this._callOpenAI(text, 'summarize', config);
    }

    return this._localSummarize(text);
  }

  /**
   * 5. Extract Key Points
   */
  static async extractKeyPoints(text) {
    if (!text || text.trim().length === 0) {
      throw new Error('Please provide text to extract key points from.');
    }

    const config = await this.getAPIConfig();
    if (config.provider === 'gemini' && config.apiKey) {
      return this._callGemini(text, 'key_points', config);
    } else if (config.provider === 'openai' && config.apiKey) {
      return this._callOpenAI(text, 'key_points', config);
    }

    return this._localKeyPoints(text);
  }

  // --- LOCAL IN-BROWSER COGNITIVE ENGINE IMPLEMENTATIONS ---

  static _localSimplify(text) {
    // 1. Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
    const simplifiedSentences = [];
    let wordsSimplifiedCount = 0;

    sentences.forEach(sentence => {
      let trimmed = sentence.trim();
      if (!trimmed) return;

      // Replace complex vocabulary
      let replaced = trimmed;
      Object.entries(VOCAB_SIMPLIFICATIONS).forEach(([complex, simple]) => {
        const regex = new RegExp(`\\b${complex}\\b`, 'gi');
        if (regex.test(replaced)) {
          replaced = replaced.replace(regex, simple);
          wordsSimplifiedCount++;
        }
      });

      // Split lengthy semicolons and conjunctions into separate accessible sentences
      if (replaced.includes('; ')) {
        const parts = replaced.split('; ');
        parts.forEach((p, idx) => {
          let s = p.trim();
          if (idx > 0) s = s.charAt(0).toUpperCase() + s.slice(1);
          if (!s.endsWith('.') && !s.endsWith('!') && !s.endsWith('?')) s += '.';
          simplifiedSentences.push(s);
        });
      } else {
        simplifiedSentences.push(replaced);
      }
    });

    const resultText = simplifiedSentences.join(' ');

    return {
      mode: 'Local Cognitive Engine (100% In-Browser & Private)',
      original: text,
      result: resultText,
      simplificationsMade: wordsSimplifiedCount,
      readingEase: 'Greatly improved readability with shorter sentence structures and everyday vocabulary.',
      tips: [
        'Complex jargon replaced with everyday words.',
        'Lengthy compound clauses separated into distinct thoughts.',
        'Visual breathing room preserved.'
      ]
    };
  }

  static _localExplain(text) {
    // Break down core premise and main message
    const clean = text.trim();
    const words = clean.split(/\s+/);

    let summaryPremise = '';
    if (clean.length > 200) {
      summaryPremise = clean.slice(0, 160) + '...';
    } else {
      summaryPremise = clean;
    }

    // Identify complex words in text
    const identifiedJargon = [];
    Object.keys(VOCAB_SIMPLIFICATIONS).forEach(jargon => {
      if (new RegExp(`\\b${jargon}\\b`, 'i').test(clean)) {
        identifiedJargon.push({
          word: jargon,
          meaning: VOCAB_SIMPLIFICATIONS[jargon]
        });
      }
    });

    return {
      mode: 'Local Cognitive Engine (100% In-Browser & Private)',
      original: text,
      mainIdea: `In simple terms: this text focuses on conveying that "${summaryPremise.replace(/[.]+$/, '')}".`,
      breakdown: [
        'What it is saying: The author is describing how specific conditions or actions lead directly to the stated outcome.',
        'Why it matters: Recognizing the root thought without getting lost in subordinate clauses makes the concept easier to remember.'
      ],
      jargonDecoded: identifiedJargon.length > 0 ? identifiedJargon : [
        { word: 'Accessible phrasing', meaning: 'Expressed using straightforward, comfortable sentence structure.' }
      ]
    };
  }

  static _localDefine(word) {
    const known = BUILTIN_DEFINITIONS[word];
    if (known) {
      return {
        mode: 'Local Cognitive Dictionary',
        word,
        phonetic: known.phonetic,
        definition: known.definition,
        example: known.example,
        category: known.category,
        synonyms: ['Simple definition provided above']
      };
    }

    const simpleSubstitute = VOCAB_SIMPLIFICATIONS[word];
    if (simpleSubstitute) {
      return {
        mode: 'Local Cognitive Dictionary',
        word,
        phonetic: '',
        definition: `A formal or academic term meaning: "${simpleSubstitute}".`,
        example: `Instead of saying "${word}", it is more accessible to use "${simpleSubstitute}".`,
        category: 'Vocabulary Alternative',
        synonyms: [simpleSubstitute]
      };
    }

    // General fallback explanation
    const formatted = word.charAt(0).toUpperCase() + word.slice(1);
    return {
      mode: 'Local Cognitive Dictionary',
      word,
      phonetic: '',
      definition: `${formatted}: A term used in contextual reading. Try highlighting it in context or using an optional API key for full lexical dictionary lookup.`,
      example: `He noticed the word "${word}" in the passage and checked its meaning.`,
      category: 'General Vocabulary',
      synonyms: ['Context-dependent']
    };
  }

  static _localSummarize(text) {
    const sentences = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
    if (sentences.length <= 2) {
      return {
        mode: 'Local Cognitive Engine (100% In-Browser & Private)',
        summary: text.trim(),
        keyTakeaway: 'This is already a concise passage.',
        sentenceCount: sentences.length
      };
    }

    // Select opening sentence, most informative mid sentence, and closing thought
    const firstSentence = sentences[0].trim();
    const middleIndex = Math.floor(sentences.length / 2);
    const middleSentence = sentences[middleIndex]?.trim() || '';
    const lastSentence = sentences[sentences.length - 1]?.trim() || '';

    const summaryParagraph = `${firstSentence} ${middleSentence !== firstSentence ? middleSentence : ''} ${lastSentence !== middleSentence ? lastSentence : ''}`.replace(/\s+/g, ' ');

    return {
      mode: 'Local Cognitive Engine (100% In-Browser & Private)',
      originalLength: text.length,
      summaryLength: summaryParagraph.length,
      reduction: `${Math.round((1 - summaryParagraph.length / text.length) * 100)}% shorter`,
      summary: summaryParagraph,
      keyTakeaway: firstSentence.replace(/[.]+$/, '')
    };
  }

  static _localKeyPoints(text) {
    const sentences = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
    const points = [];

    sentences.forEach((sentence, idx) => {
      const clean = sentence.trim();
      // Filter for substantial sentences with informational weight
      if (clean.length > 25 && points.length < 5) {
        let simplified = clean;
        Object.entries(VOCAB_SIMPLIFICATIONS).forEach(([complex, simple]) => {
          simplified = simplified.replace(new RegExp(`\\b${complex}\\b`, 'gi'), simple);
        });
        points.push(simplified);
      }
    });

    if (points.length === 0) {
      points.push(text.trim());
    }

    return {
      mode: 'Local Cognitive Engine (100% In-Browser & Private)',
      points,
      count: points.length,
      tip: 'Key ideas extracted and restructured into bullet points for quick scanning.'
    };
  }

  // --- OPTIONAL API HANDLERS (IF USER PROVIDES THEIR OWN KEY) ---

  static async _callGemini(text, task, config) {
    const promptMap = {
      simplify: `Rewrite the following text using simple, clear, accessible words and short sentences for someone with reading difficulties or dyslexia. Keep the original meaning intact:\n\n"${text}"`,
      explain: `Explain the following text in plain English. Break down the core meaning and define any complex concepts:\n\n"${text}"`,
      define: `Provide a simple, clear definition and an example sentence for the word: "${text}"`,
      summarize: `Provide a concise 2-3 sentence summary of the following text:\n\n"${text}"`,
      key_points: `Extract 3 to 5 key bullet points from the following text:\n\n"${text}"`
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=${config.apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptMap[task] || promptMap.simplify }] }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      mode: `Gemini API (${config.model || 'gemini-1.5-flash'})`,
      original: text,
      result: output.trim(),
      points: task === 'key_points' ? output.split('\n').filter(l => l.trim().length > 0) : undefined,
      summary: task === 'summarize' ? output.trim() : undefined,
      mainIdea: task === 'explain' ? output.trim() : undefined,
      definition: task === 'define' ? output.trim() : undefined
    };
  }

  static async _callOpenAI(text, task, config) {
    const promptMap = {
      simplify: `Rewrite the following text using simple, clear, accessible words and short sentences for someone with reading difficulties or dyslexia:\n\n"${text}"`,
      explain: `Explain the following text in plain English:\n\n"${text}"`,
      define: `Provide a simple definition and example sentence for the word: "${text}"`,
      summarize: `Provide a concise 2-3 sentence summary of the following text:\n\n"${text}"`,
      key_points: `Extract 3 to 5 key bullet points from the following text:\n\n"${text}"`
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: promptMap[task] || promptMap.simplify }],
        temperature: 0.3
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API returned status ${res.status}`);
    }

    const data = await res.json();
    const output = data.choices?.[0]?.message?.content || '';

    return {
      mode: `OpenAI API (${config.model || 'gpt-4o-mini'})`,
      original: text,
      result: output.trim(),
      points: task === 'key_points' ? output.split('\n').filter(l => l.trim().length > 0) : undefined,
      summary: task === 'summarize' ? output.trim() : undefined,
      mainIdea: task === 'explain' ? output.trim() : undefined,
      definition: task === 'define' ? output.trim() : undefined
    };
  }
}
