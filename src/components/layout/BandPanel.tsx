import React, { useMemo } from 'react';
import type { FrequencyBands } from '../../types';
import { CollapsibleSection } from './CollapsibleSection';

interface BandPanelProps {
  frequencyBands: FrequencyBands | null;
  dominantFrequency: number | null;
}

export const BandPanel: React.FC<BandPanelProps> = ({ frequencyBands, dominantFrequency }) => {
  const entries = frequencyBands ? Object.values(frequencyBands) : [];
  const dominantBand = useMemo(() => {
    if (!entries.length) return null;
    return entries.reduce((prev, current) => (current.power > prev.power ? current : prev));
  }, [entries]);

  return (
    <CollapsibleSection title="Frequency Bands" contentClassName="text-sm">
      {entries.length === 0 ? (
        <p className="text-xs text-slate-400">No analysis available.</p>
      ) : (
        <div className="space-y-4">
          {dominantBand && (
            <div className="rounded-xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-3 text-xs text-slate-200">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-300">Band emphasis</p>
              <p className="mt-1 text-sm text-white">
                {dominantBand.name} band dominates ({dominantBand.range[0]}–{dominantBand.range[1]} Hz)
              </p>
              {typeof dominantFrequency === 'number' && (
                <p className="mt-1 text-xs text-slate-300">
                  Dominant frequency: {dominantFrequency.toFixed(2)} Hz
                </p>
              )}
            </div>
          )}
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
        </div>
      )}
    </CollapsibleSection>
  );
};
