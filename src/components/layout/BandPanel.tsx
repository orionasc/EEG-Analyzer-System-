import React from 'react';
import type { AnalysisResult } from '../../types';

interface BandPanelProps {
  analysisResult: AnalysisResult | null;
}

export const BandPanel: React.FC<BandPanelProps> = ({ analysisResult }) => {
  if (!analysisResult) {
    return (
      <details className="rounded-xl border border-white/8 bg-slate-900/50 px-3 py-2 text-[12px] text-slate-300 shadow-sm backdrop-blur">
        <summary className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
          Frequency Bands
        </summary>
        <p className="pt-2 text-[11px] text-slate-400">No analysis available.</p>
      </details>
    );
  }

  const bands = analysisResult.signalAnalysis.frequencyBands;
  const entries = Object.values(bands);

  return (
    <details
      className="group rounded-xl border border-white/8 bg-slate-900/60 text-slate-200 shadow-sm backdrop-blur"
      open
    >
      <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
        Frequency Bands
      </summary>
      <div className="px-3 pb-3">
        <table className="w-full table-fixed border-collapse text-left text-[12px]">
          <thead className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            <tr className="border-b border-white/10">
              <th className="pb-1">Band</th>
              <th className="pb-1">Range (Hz)</th>
              <th className="pb-1 text-right">Power</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {entries.map((band) => (
              <tr key={band.name} className="hover:bg-slate-900/70">
                <td className="py-1 font-medium">{band.name}</td>
                <td className="py-1 text-slate-300">
                  {band.range[0]} – {band.range[1]}
                </td>
                <td className="py-1 text-right font-mono text-[12px] text-blue-200">
                  {band.power.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};
