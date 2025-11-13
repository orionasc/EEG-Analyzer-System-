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
    <CollapsibleSection title="Frequency Bands" contentClassName="text-sm">
      {entries.length === 0 ? (
        <p className="text-xs text-slate-400">No analysis available.</p>
      ) : (
        <table className="w-full table-fixed border-collapse text-left text-xs text-slate-200">
          <thead className="text-xs text-slate-400">
            <tr className="border-b border-white/10">
              <th className="pb-2 font-medium">Band</th>
              <th className="pb-2 font-medium">Range (Hz)</th>
              <th className="pb-2 text-right font-medium">Power</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map((band) => (
              <tr key={band.name} className="transition-colors hover:bg-white/5">
                <td className="py-2 font-medium text-white">{band.name}</td>
                <td className="py-2 text-slate-300">
                  {band.range[0]} – {band.range[1]}
                </td>
                <td className="py-2 text-right font-mono text-xs text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.5)]">
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
