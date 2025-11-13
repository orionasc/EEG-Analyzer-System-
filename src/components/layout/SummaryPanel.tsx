import React from 'react';

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
    <details
      className="group rounded-xl border border-white/8 bg-slate-900/60 text-slate-200 shadow-sm backdrop-blur"
      open
    >
      <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
        Processing Summary
      </summary>
      <ul className="space-y-2 px-3 pb-3 text-[12px] text-slate-200">
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
    </details>
  );
};
