import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
  RotateCcw
} from 'lucide-react';

export function FingerprintEvolution({ initialProfile, currentProfile, learnedPreferences, onRevertTrait, onRestoreInitial }) {
  const dimensions = [
    {
      key: 'fontSize',
      label: 'Font Size',
      unit: 'px',
      icon: 'type',
      format: (v) => `${v}px`
    },
    {
      key: 'fontFamily',
      label: 'Typography',
      unit: '',
      icon: 'font',
      format: (v) => v
    },
    {
      key: 'lineSpacing',
      label: 'Line Spacing',
      unit: 'x',
      icon: 'align-justify',
      format: (v) => `${v}x`
    },
    {
      key: 'theme',
      label: 'Theme',
      unit: '',
      icon: 'palette',
      format: (v) => v.charAt(0).toUpperCase() + v.slice(1)
    },
    {
      key: 'focusMode',
      label: 'Focus Mode',
      unit: '',
      icon: 'eye',
      format: (v) => v ? 'Frequently Used' : 'Standard'
    },
    {
      key: 'reducedMotion',
      label: 'Motion',
      unit: '',
      icon: 'zap',
      format: (v) => v ? 'Reduced' : 'Standard'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#8E294B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#8E294B]" />
              Dynamic Personal Reading Fingerprint
            </div>
            <h2 className="text-xl font-bold text-[#291923] mt-1">
              Adaptive Reading Fingerprint Evolution
            </h2>
            <p className="text-sm text-[#806C77] mt-1 max-w-2xl leading-relaxed">
              AccessAI continuously observes your reading interactions and refines your profile gradually so the web naturally molds to how you read best.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRestoreInitial}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9E8EE] hover:bg-[#F4C7D5] text-[#421426] border border-[#F4C7D5] text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Baseline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tripartite Evolution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dimensions.map(dim => {
          const initVal = initialProfile[dim.key];
          const currVal = currentProfile[dim.key];
          const learned = learnedPreferences[dim.key];
          const confidence = learned ? Math.round(learned.confidence * 100) : null;
          const isEvolved = learned && learned.confidence >= 0.65 && currVal !== initVal;

          return (
            <div
              key={dim.key}
              className={`p-5 rounded-2xl border transition-all duration-300 bg-white shadow-sm ${
                isEvolved
                  ? 'border-[#8E294B] ring-1 ring-[#F4C7D5]'
                  : 'border-[#F9E8EE]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#806C77] uppercase tracking-wider">
                  {dim.label}
                </span>
                {confidence ? (
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    confidence >= 80 ? 'bg-[#D8FF56]/30 text-[#421426] border border-[#D8FF56]' :
                    confidence >= 60 ? 'bg-[#F9E8EE] text-[#70243E] border border-[#F4C7D5]' :
                    'bg-[#F9E8EE] text-[#806C77]'
                  }`}>
                    {confidence}% Match
                  </span>
                ) : (
                  <span className="text-[10px] text-[#806C77] font-mono">Baseline</span>
                )}
              </div>

              {/* Values Comparison */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-[#806C77] font-semibold">Initial</div>
                  <div className="text-sm font-medium text-[#806C77] font-mono mt-0.5">
                    {dim.format(initVal)}
                  </div>
                </div>

                <ArrowRight className={`w-4 h-4 ${isEvolved ? 'text-[#8E294B] animate-pulse' : 'text-[#806C77]'}`} />

                <div className="text-right">
                  <div className="text-[10px] uppercase text-[#8E294B] font-semibold">Learned / Current</div>
                  <div className="text-lg font-bold text-[#291923] font-mono mt-0.5">
                    {dim.format(currVal)}
                  </div>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      confidence >= 80 ? 'bg-[#8E294B]' : 'bg-[#70243E]'
                    }`}
                    style={{ width: `${confidence || 50}%` }}
                  />
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-[#806C77]">
                  {learned?.observations ? `${learned.observations} observations` : 'Standard baseline'}
                </span>
                {isEvolved && (
                  <button
                    onClick={() => onRevertTrait(dim.key, initVal)}
                    className="text-[#806C77] hover:text-[#8E294B] transition flex items-center gap-1 font-semibold"
                    title="Revert this dimension to initial baseline"
                  >
                    Revert
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
