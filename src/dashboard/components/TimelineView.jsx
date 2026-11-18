import React from 'react';
import {
  History,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function TimelineView({ history }) {
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#F9E8EE]">
          <div>
            <div className="flex items-center gap-2 text-[#8E294B] text-xs font-bold uppercase tracking-wider">
              <History className="w-4 h-4 text-[#8E294B]" />
              Evolution History
            </div>
            <h2 className="text-xl font-bold text-[#291923] mt-1">
              How Your Reading Fingerprint Evolved
            </h2>
            <p className="text-xs text-[#806C77] mt-1">
              A transparent, chronological log of when and why AccessAI refined your reading preferences.
            </p>
          </div>
        </div>

        {/* Timeline Entries */}
        <div className="mt-8 relative pl-6 border-l-2 border-[#F9E8EE] space-y-6">
          {history.length === 0 ? (
            <div className="py-6 text-center text-[#806C77] text-sm">
              No evolution history recorded yet. Interact with the HUD or Studio to begin learning!
            </div>
          ) : (
            history.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#8E294B] shadow-sm" />

                <div className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] hover:border-[#F4C7D5] transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#291923] flex items-center gap-2">
                      {item.title}
                      {item.confidence && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#D8FF56]/30 text-[#421426] font-bold">
                          {item.confidence}% match
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#806C77] font-mono">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.timestamp)}
                    </div>
                  </div>

                  <p className="text-xs text-[#806C77] mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Changes Diff Tags */}
                  {item.changes && Object.keys(item.changes).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-[#F9E8EE]">
                      {Object.entries(item.changes).map(([dim, diff]) => {
                        if (typeof diff === 'object' && diff !== null && diff.from !== undefined) {
                          return (
                            <span key={dim} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-[#F4C7D5] text-[#291923] font-mono flex items-center gap-1.5">
                              <span className="text-[#806C77] capitalize">{dim}:</span>
                              <span className="text-[#806C77] line-through">{String(diff.from)}</span>
                              <ArrowRight className="w-3 h-3 text-[#8E294B]" />
                              <span className="text-[#421426] font-bold">{String(diff.to)}</span>
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
