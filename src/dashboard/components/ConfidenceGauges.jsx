import React from 'react';
import {
  Type,
  AlignJustify,
  Eye,
  Sun,
  Zap,
  Info,
  Activity,
  HeartPulse
} from 'lucide-react';

export function ConfidenceGauges({ comfortProfile }) {
  const metrics = [
    {
      key: 'typography',
      name: 'Typography',
      score: comfortProfile.typography || 92,
      icon: Type,
      color: 'bg-[#8E294B]',
      description: 'Font choice & letter scaling comfort'
    },
    {
      key: 'spacing',
      name: 'Spacing',
      score: comfortProfile.spacing || 84,
      icon: AlignJustify,
      color: 'bg-[#70243E]',
      description: 'Paragraph density & line clearance'
    },
    {
      key: 'theme',
      name: 'Theme',
      score: comfortProfile.theme || 89,
      icon: Sun,
      color: 'bg-[#421426]',
      description: 'Contrast harmony & background warmth'
    },
    {
      key: 'focus',
      name: 'Focus',
      score: comfortProfile.focus || 78,
      icon: Eye,
      color: 'bg-[#8E294B]',
      description: 'Distraction reduction & content emphasis'
    },
    {
      key: 'motion',
      name: 'Motion',
      score: comfortProfile.motion || 95,
      icon: Zap,
      color: 'bg-[#70243E]',
      description: 'Animation stability & visual stillness'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F9E8EE]">
          <div>
            <div className="flex items-center gap-2 text-[#8E294B] text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              Reading Comfort Profile
            </div>
            <h2 className="text-xl font-bold text-[#291923] mt-1">
              Personalized Reading Comfort Index
            </h2>
            <p className="text-xs text-[#806C77] mt-1">
              Quantifies how closely current web styles match your learned behavioral comfort across 5 core dimensions.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5]">
            <div className="text-right">
              <div className="text-[10px] text-[#806C77] uppercase font-semibold">Overall Index</div>
              <div className="text-2xl font-black text-[#421426] font-mono">{comfortProfile.overall || 88}%</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F9E8EE] text-[#8E294B] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 5 Dimensional Gauges */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {metrics.map(m => {
            const Icon = m.icon;
            return (
              <div
                key={m.key}
                className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex flex-col justify-between hover:border-[#F4C7D5] transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-white text-[#8E294B] border border-[#F4C7D5]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-lg font-bold font-mono text-[#421426]">{m.score}%</span>
                  </div>

                  <h3 className="text-sm font-semibold text-[#291923]">{m.name}</h3>
                  <p className="text-[11px] text-[#806C77] mt-1 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="h-1.5 w-full bg-[#F9E8EE] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.color} transition-all duration-700`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-medical Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-[#F9E8EE]/60 border border-[#F4C7D5] flex items-start gap-3 text-xs text-[#806C77]">
        <Info className="w-5 h-5 text-[#8E294B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#421426]">
            Important Product Principle: Personalization, Not Diagnosis
          </p>
          <p className="leading-relaxed">
            AccessAI measures non-sensitive behavioral interaction patterns to tailor your digital reading environment.
            These scores represent <span className="text-[#421426] font-medium">confidence in your learned preference alignment</span>, and are never a clinical or medical assessment.
          </p>
        </div>
      </div>
    </div>
  );
}
