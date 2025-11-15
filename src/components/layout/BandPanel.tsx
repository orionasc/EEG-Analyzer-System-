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
        <p className="text-xs text-[rgba(214,205,196,0.65)]">No analysis available.</p>
      ) : (
        <div className="space-y-4">
          {dominantBand && (
            <div className="rounded-2xl border border-[rgba(105,217,255,0.35)] bg-[rgba(19,16,28,0.78)] px-[var(--cl-h-gutter)] py-4 text-xs text-[rgba(236,229,220,0.82)] shadow-[0_0_28px_rgba(105,217,255,0.18)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Band emphasis</p>
              <p className="mt-1 text-sm font-medium text-[rgba(249,245,236,0.95)]">
                {dominantBand.name} band dominates ({dominantBand.range[0]}–{dominantBand.range[1]} Hz)
              </p>
              {typeof dominantFrequency === 'number' && (
                <p className="mt-2 text-xs text-[rgba(214,205,196,0.72)]">
                  Dominant frequency: {dominantFrequency.toFixed(2)} Hz
                </p>
              )}
            </div>
          )}
          <table className="w-full table-fixed border-collapse text-left text-xs text-[rgba(236,229,220,0.82)]">
            <thead className="text-[rgba(214,205,196,0.55)]">
              <tr className="border-b border-[rgba(198,188,255,0.2)]">
                <th className="pb-2 font-medium uppercase tracking-[0.18em]">Band</th>
                <th className="pb-2 font-medium uppercase tracking-[0.18em]">Range (Hz)</th>
                <th className="pb-2 text-right font-medium uppercase tracking-[0.18em]">Power</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(198,188,255,0.12)]">
              {entries.map((band) => (
                <tr key={band.name} className="transition-transform duration-300 hover:-translate-y-[1px]">
                  <td className="py-2 font-semibold text-[rgba(249,245,236,0.92)]">{band.name}</td>
                  <td className="py-2 text-[rgba(214,205,196,0.72)]">
                    {band.range[0]} – {band.range[1]}
                  </td>
                  <td className="py-2 text-right font-mono text-sm text-[rgba(105,217,255,0.85)]">
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
