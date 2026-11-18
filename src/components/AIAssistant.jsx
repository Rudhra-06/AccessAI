import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  FileText,
  ListOrdered,
  CheckCircle2,
  Copy,
  RotateCcw,
  Key,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AIAssistantService } from '../ai/aiAssistantService.js';

export function AIAssistant() {
  const [activeAction, setActiveAction] = useState('simplify'); // 'simplify' | 'explain' | 'define' | 'summarize' | 'key_points'
  const [inputText, setInputText] = useState(
    'The utilization of adaptive pedagogical paradigms subsequently facilitates cognitive comprehension and ameliorates reading discrepancies in neurodiverse learners.'
  );
  const [wordToDefine, setWordToDefine] = useState('dyslexia');
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Sample difficult passages for one-click testing
  const samplePassages = [
    {
      title: 'Academic Abstract',
      text: 'The utilization of adaptive pedagogical paradigms subsequently facilitates cognitive comprehension and ameliorates reading discrepancies in neurodiverse learners.'
    },
    {
      title: 'Legal / Terms Excerpt',
      text: 'Notwithstanding the foregoing provisions, the licensee shall indemnify and hold harmless the licensor from all liabilities pertaining to third-party intellectual assertions.'
    },
    {
      title: 'Technical Specification',
      text: 'Asynchronous event-driven subsystems implement idempotent message reconciliation protocols to mitigate race conditions during high-concurrency database transactions.'
    }
  ];

  const handleRunAction = async (actionType = activeAction) => {
    setIsLoading(true);
    setErrorMsg('');
    setResultData(null);
    setCopied(false);

    try {
      let res;
      if (actionType === 'simplify') {
        res = await AIAssistantService.simplifyText(inputText);
      } else if (actionType === 'explain') {
        res = await AIAssistantService.explainText(inputText);
      } else if (actionType === 'define') {
        res = await AIAssistantService.defineWord(wordToDefine || inputText.split(/\s+/)[0]);
      } else if (actionType === 'summarize') {
        res = await AIAssistantService.summarizeText(inputText);
      } else if (actionType === 'key_points') {
        res = await AIAssistantService.extractKeyPoints(inputText);
      }
      setResultData(res);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to process text at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#F9E8EE] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8E294B] uppercase tracking-wider">
            <Bot className="w-4 h-4 text-[#8E294B]" />
            Cognitive Reading Comprehension
          </div>
          <h2 className="text-xl font-bold text-[#291923] mt-0.5">
            AI Reading Assistant
          </h2>
          <p className="text-xs text-[#806C77] mt-0.5">
            Simplify dense jargon, decode complex sentences, and extract key points with offline privacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#D8FF56]/20 text-[#421426] border border-[#D8FF56]/60 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#421426]" />
            <span>In-Browser Cognitive Engine</span>
          </span>
        </div>
      </div>

      {/* Action Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'simplify', label: '1. Simplify Text', icon: Sparkles, desc: 'Rewrites into everyday plain language' },
          { id: 'explain', label: '2. Explain This', icon: HelpCircle, desc: 'Breaks down complex sentence meaning' },
          { id: 'define', label: '3. Define Word', icon: BookOpen, desc: 'Plain definition and examples' },
          { id: 'summarize', label: '4. Summarize', icon: FileText, desc: 'Concise essential summary' },
          { id: 'key_points', label: '5. Key Points', icon: ListOrdered, desc: 'Bullet point takeaway list' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAction === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveAction(tab.id);
                setResultData(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                isActive
                  ? 'bg-[#421426] text-white shadow-sm'
                  : 'bg-white text-[#806C77] hover:text-[#421426] hover:bg-[#F9E8EE] border border-[#F9E8EE]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D8FF56]' : 'text-[#8E294B]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Split: Input on Left, AI Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input and Sample Loaders (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F9E8EE]">
            <span className="text-xs font-bold text-[#291923] uppercase tracking-wider">
              {activeAction === 'define' ? 'Word to Define' : 'Original Source Text'}
            </span>
            <span className="text-[11px] text-[#806C77]">
              {activeAction === 'define' ? 'Dictionary' : `${inputText.length} characters`}
            </span>
          </div>

          {activeAction === 'define' ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter word (e.g., dyslexia, cognitive, typography)"
                value={wordToDefine}
                onChange={(e) => setWordToDefine(e.target.value)}
                className="w-full bg-[#FFF8FA] border border-[#F4C7D5] rounded-xl p-3 text-sm font-semibold text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
              />
              <div className="flex items-center gap-1.5 text-xs text-[#806C77]">
                <span>Try quick words:</span>
                {['dyslexia', 'saccadic', 'contrast', 'cognitive', 'typography'].map(w => (
                  <button
                    key={w}
                    onClick={() => {
                      setWordToDefine(w);
                      handleRunAction('define');
                    }}
                    className="px-2 py-0.5 rounded bg-[#F9E8EE] text-[#421426] hover:bg-[#F4C7D5] font-mono text-[11px]"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={6}
                placeholder="Paste or type text you want to simplify or understand..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full bg-[#FFF8FA] border border-[#F4C7D5] rounded-xl p-3 text-xs leading-relaxed text-[#291923] focus:ring-2 focus:ring-[#8E294B] focus:outline-none"
              />

              {/* Sample loader chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#806C77]">Load test sample:</span>
                <div className="flex flex-wrap gap-1.5">
                  {samplePassages.map(sample => (
                    <button
                      key={sample.title}
                      onClick={() => setInputText(sample.text)}
                      className="px-2.5 py-1 rounded-lg bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] text-[11px] font-medium transition"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            onClick={() => handleRunAction()}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#421426] hover:bg-[#70243E] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D8FF56]" />
                <span className="capitalize">Run {activeAction.replace('_', ' ')}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Output & Accessible Decomposition (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#F9E8EE] p-5 shadow-sm space-y-4 min-h-[340px]">
          <div className="flex items-center justify-between pb-2 border-b border-[#F9E8EE]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8E294B]" />
              <span className="text-xs font-bold text-[#291923] uppercase tracking-wider">
                AccessAI Result
              </span>
            </div>
            {resultData && (
              <button
                onClick={() => handleCopy(resultData.result || resultData.summary || JSON.stringify(resultData))}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#8E294B] hover:text-[#421426]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Empty State */}
          {!resultData && !isLoading && !errorMsg && (
            <div className="py-12 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#F9E8EE] text-[#8E294B] flex items-center justify-center mx-auto">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#291923]">Ready to assist</h4>
              <p className="text-xs text-[#806C77] max-w-xs mx-auto leading-relaxed">
                Click the action button on the left to see simplified vocabulary, plain sentence breakdowns, or concise summaries.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="space-y-3 py-6 animate-pulse">
              <div className="h-4 bg-[#F9E8EE] rounded w-3/4" />
              <div className="h-4 bg-[#F9E8EE] rounded w-full" />
              <div className="h-4 bg-[#F9E8EE] rounded w-5/6" />
            </div>
          )}

          {/* Render Result Data */}
          {resultData && !isLoading && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              {/* Output Mode Tag */}
              <div className="flex items-center justify-between text-[10px] text-[#806C77] font-mono">
                <span>{resultData.mode}</span>
                {resultData.reduction && (
                  <span className="px-2 py-0.5 rounded bg-[#D8FF56]/30 text-[#421426] font-bold">
                    {resultData.reduction}
                  </span>
                )}
              </div>

              {/* 1. Simplify Text Output */}
              {activeAction === 'simplify' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] text-[#291923] text-sm leading-relaxed font-medium">
                    {resultData.result}
                  </div>
                  {resultData.tips && (
                    <div className="space-y-1">
                      <span className="font-bold text-[#421426] text-[11px] block">Cognitive Enhancements:</span>
                      {resultData.tips.map((tip, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[#806C77] text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8E294B]" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Explain This Output */}
              {activeAction === 'explain' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] text-[#291923] text-xs leading-relaxed font-semibold">
                    {resultData.mainIdea}
                  </div>

                  {resultData.jargonDecoded && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-[#421426] text-[11px] block">Jargon Decoded:</span>
                      {resultData.jargonDecoded.map((j, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#F9E8EE]/70 border border-[#F4C7D5] flex items-center justify-between">
                          <span className="font-mono font-bold text-[#421426]">{j.word}</span>
                          <span className="text-[#806C77]">means: {j.meaning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Define Word Output */}
              {activeAction === 'define' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#421426] capitalize">{resultData.word}</span>
                      <span className="text-[11px] font-mono text-[#806C77]">{resultData.phonetic}</span>
                    </div>
                    <p className="text-xs text-[#291923] leading-relaxed">
                      {resultData.definition}
                    </p>
                    <div className="p-2.5 rounded-lg bg-white border border-[#F9E8EE] italic text-[#806C77] text-[11px]">
                      "{resultData.example}"
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Summarize Output */}
              {activeAction === 'summarize' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] text-[#291923] text-sm leading-relaxed">
                    {resultData.summary}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#806C77]">
                    <span>Original: {resultData.originalLength} chars</span>
                    <span>Summary: {resultData.summaryLength} chars</span>
                  </div>
                </div>
              )}

              {/* 5. Key Points Output */}
              {activeAction === 'key_points' && (
                <div className="space-y-2">
                  <ul className="space-y-2">
                    {resultData.points?.map((pt, i) => (
                      <li key={i} className="p-3 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex items-start gap-2 text-xs text-[#291923]">
                        <span className="w-5 h-5 rounded-full bg-[#F9E8EE] text-[#421426] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
