import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';

interface SummaryPanelProps {
  processingTime: number | null;
  signalQualityLabel: string | null;
  fftSampleCount: number | null;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  processingTime,
  signalQualityLabel,
  fftSampleCount
}) => {
  return (
    <CollapsibleSection title="Processing Summary" contentClassName="text-sm">
      <ul className="space-y-3 text-[rgba(236,229,220,0.82)]">
        <li className="flex items-center justify-between rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(21,16,32,0.74)] px-4 py-3">
          <span className="text-sm font-medium text-[rgba(249,245,236,0.9)]">Processing time</span>
          <span className="font-mono text-xs text-[rgba(105,217,255,0.85)]">
            {processingTime !== null ? `${processingTime.toFixed(0)} ms` : '—'}
          </span>
        </li>
        <li className="flex items-center justify-between rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(21,16,32,0.74)] px-4 py-3">
          <span className="text-sm font-medium text-[rgba(249,245,236,0.9)]">Signal quality</span>
          <span className="font-semibold text-[rgba(255,182,72,0.9)]">{signalQualityLabel ?? '—'}</span>
        </li>
        <li className="flex items-center justify-between rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(21,16,32,0.74)] px-4 py-3">
          <span className="text-sm font-medium text-[rgba(249,245,236,0.9)]">FFT samples</span>
          <span className="font-mono text-xs text-[rgba(105,217,255,0.85)]">{fftSampleCount ?? '—'}</span>
        </li>
      </ul>
    </CollapsibleSection>
  );
};
