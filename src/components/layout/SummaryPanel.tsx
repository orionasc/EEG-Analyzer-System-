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
    <CollapsibleSection title="Processing Summary" contentClassName="text-[12px]">
      <ul className="space-y-2 text-slate-200">
        <li className="flex items-center justify-between rounded border border-white/5 bg-slate-900/70 px-3 py-2">
          <span>Processing Time</span>
          <span className="font-mono text-[12px] text-blue-200">
            {processingTime !== null ? `${processingTime.toFixed(0)} ms` : '—'}
          </span>
        </li>
        <li className="flex items-center justify-between rounded border border-white/5 bg-slate-900/70 px-3 py-2">
          <span>Signal Quality</span>
          <span className="font-medium text-slate-100">{signalQualityLabel ?? '—'}</span>
        </li>
        <li className="flex items-center justify-between rounded border border-white/5 bg-slate-900/70 px-3 py-2">
          <span>FFT Samples</span>
          <span className="font-mono text-[12px] text-blue-200">{fftSampleCount ?? '—'}</span>
        </li>
      </ul>
    </CollapsibleSection>
  );
};
