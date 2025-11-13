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
      <ul className="space-y-2 text-slate-200">
        <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-sm">Processing time</span>
          <span className="font-mono text-xs text-cyan-200">
            {processingTime !== null ? `${processingTime.toFixed(0)} ms` : '—'}
          </span>
        </li>
        <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-sm">Signal quality</span>
          <span className="font-medium text-white">{signalQualityLabel ?? '—'}</span>
        </li>
        <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-sm">FFT samples</span>
          <span className="font-mono text-xs text-cyan-200">{fftSampleCount ?? '—'}</span>
        </li>
      </ul>
    </CollapsibleSection>
  );
};
