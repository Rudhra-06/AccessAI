import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  Database,
  FileText
} from 'lucide-react';
import { PrivacyManager } from '../../privacy/privacyManager.js';

export function PrivacyCenter({ adaptiveEnabled, onToggleAdaptive, onResetLearning, onResetAll }) {
  const [exportLoading, setExportLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // 'learning' | 'all' | null
  const [actionSuccess, setActionSuccess] = useState('');

  const checklist = PrivacyManager.getPrivacyChecklist();

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const data = await PrivacyManager.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AccessAI-Data-Export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setActionSuccess('Export downloaded successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setExportLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmDelete === 'learning') {
      await onResetLearning();
      setActionSuccess('Learned preferences and history cleared.');
    } else if (confirmDelete === 'all') {
      await onResetAll();
      setActionSuccess('All AccessAI data has been reset to defaults.');
    }
    setConfirmDelete(null);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Action Success Toast */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-[#F9E8EE] border border-[#F4C7D5] text-[#421426] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8E294B]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Privacy Shield Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F9E8EE]">
          <div>
            <div className="flex items-center gap-2 text-[#8E294B] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Privacy by Design & Zero Telemetry
            </div>
            <h2 className="text-xl font-bold text-[#291923] mt-1">
              Privacy & Trust Center
            </h2>
            <p className="text-xs text-[#806C77] mt-1 max-w-xl">
              AccessAI runs 100% locally in your browser. No passwords, form inputs, webpage texts, or browsing URLs are ever collected or transmitted.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5]">
            <div className="text-right text-xs">
              <div className="text-[10px] text-[#806C77] uppercase font-semibold">Adaptive Learning</div>
              <div className={`font-bold ${adaptiveEnabled ? 'text-[#421426]' : 'text-[#806C77]'}`}>
                {adaptiveEnabled ? 'Active (Local)' : 'Disabled'}
              </div>
            </div>
            <button
              onClick={onToggleAdaptive}
              role="switch"
              aria-checked={adaptiveEnabled}
              aria-label="Toggle Adaptive Learning"
              className={`w-11 h-6 rounded-full transition-colors relative ${adaptiveEnabled ? 'bg-[#421426]' : 'bg-[#F4C7D5]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${adaptiveEnabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F9E8EE] flex items-start gap-3.5"
            >
              <div className="p-2 rounded-lg bg-white text-[#8E294B] border border-[#F4C7D5] shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#291923]">{item.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#F4C7D5] text-[#421426]">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#806C77] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management & Erasure Tools */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F9E8EE] shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-bold text-[#291923] uppercase tracking-wider">
            Your Data Controls
          </h3>
          <p className="text-xs text-[#806C77] mt-0.5">
            Export or completely purge your local IndexedDB storage at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Export */}
          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] hover:border-[#8E294B] text-left transition group space-y-2"
          >
            <div className="p-2 w-fit rounded-lg bg-white border border-[#F4C7D5] text-[#8E294B] transition">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-[#421426]">Export Learning Data</div>
            <p className="text-[11px] text-[#806C77]">
              Download complete local profile & event logs as structured JSON.
            </p>
          </button>

          {/* Delete Learning Data */}
          <button
            onClick={() => setConfirmDelete('learning')}
            className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] hover:border-amber-400 text-left transition group space-y-2"
          >
            <div className="p-2 w-fit rounded-lg bg-white border border-[#F4C7D5] text-amber-600 transition">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-amber-700">Reset Learned Data</div>
            <p className="text-[11px] text-[#806C77]">
              Wipes observed weights & history, keeping your initial fingerprint.
            </p>
          </button>

          {/* Reset Everything */}
          <button
            onClick={() => setConfirmDelete('all')}
            className="p-4 rounded-xl bg-[#FFF8FA] border border-[#F4C7D5] hover:border-rose-400 text-left transition group space-y-2"
          >
            <div className="p-2 w-fit rounded-lg bg-white border border-[#F4C7D5] text-rose-600 transition">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-rose-700">Reset Everything</div>
            <p className="text-[11px] text-[#806C77]">
              Factory reset all AccessAI profiles, overrides, and storage.
            </p>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-[#F4C7D5] shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#291923]">
                  {confirmDelete === 'learning' ? 'Reset Learned Preferences?' : 'Factory Reset AccessAI?'}
                </h3>
                <p className="text-xs text-[#806C77] mt-0.5">
                  {confirmDelete === 'learning'
                    ? 'This will clear all interaction history and adaptive weights. Your baseline profile remains intact.'
                    : 'This will permanently delete all initial profiles, learned preferences, and site overrides.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F9E8EE]">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#806C77] hover:bg-[#F9E8EE]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-xl bg-[#421426] hover:bg-[#70243E] text-white text-xs font-bold transition shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
