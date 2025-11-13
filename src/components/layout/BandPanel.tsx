import React from 'react';
import type { AnalysisResult } from '../../types';
import { CollapsibleSection } from './CollapsibleSection';

interface BandPanelProps {
  analysisResult: AnalysisResult | null;
}

export const BandPanel: React.FC<BandPanelProps> = ({ analysisResult }) => {
  const bands = analysisResult?.signalAnalysis.frequencyBands;
  const entries = bands ? Object.values(bands) : [];

  return (
    <CollapsibleSection title="Frequency Bands" contentClassName="text-[12px]">
      {entries.length === 0 ? (
        <p className="text-[11px] text-slate-400">No analysis available.</p>
      ) : (
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
      )}
    </CollapsibleSection>
  );
};
