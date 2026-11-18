import React from 'react';
import {
  Sparkles,
  Type,
  AlignJustify,
  Sun,
  Eye,
  Zap,
  BookOpen,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export function LearningInsights({ insights }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'type': return Type;
      case 'align-justify': return AlignJustify;
      case 'sun': return Sun;
      case 'scan':
      case 'eye': return Eye;
      case 'book-open': return BookOpen;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#F9E8EE]">
          <div>
            <div className="flex items-center gap-2 text-[#8E294B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#8E294B]" />
              Behavioral Pattern Recognition
            </div>
            <h2 className="text-xl font-bold text-[#291923] mt-1">
              What AccessAI Has Learned
            </h2>
            <p className="text-xs text-[#806C77] mt-1">
              Plain-language behavioral insights derived from your non-sensitive reading adjustments.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => {
            const Icon = getIcon(insight.icon);
            const confPercent = Math.round((insight.confidence || 0.5) * 100);

            return (
              <div
                key={insight.id}
                className="p-5 rounded-2xl bg-[#FFF8FA] border border-[#F9E8EE] hover:border-[#F4C7D5] transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white text-[#8E294B] border border-[#F4C7D5]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#421426] uppercase tracking-wide">
                      {insight.category}
                    </span>
                  </div>

                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    confPercent >= 80 ? 'bg-[#D8FF56]/30 text-[#421426] border border-[#D8FF56]' :
                    'bg-[#F9E8EE] text-[#70243E] border border-[#F4C7D5]'
                  }`}>
                    {confPercent}% Match
                  </span>
                </div>

                <p className="text-sm font-medium text-[#291923] leading-relaxed">
                  "{insight.text}"
                </p>

                <div className="pt-2 border-t border-[#F9E8EE] flex items-center justify-between text-[11px] text-[#806C77]">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-[#8E294B]" />
                    Behavioral Observation
                  </span>
                  <span className="font-mono text-[#806C77]">100% Client-Side</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
