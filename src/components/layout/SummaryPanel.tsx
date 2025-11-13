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
    <details className="sidebar-panel" open>
      <summary>Processing Summary</summary>
      <ul className="summary-list">
        <li>
          <strong>Processing Time:</strong> {processingTime !== null ? `${processingTime.toFixed(0)} ms` : '—'}
        </li>
        <li>
          <strong>Signal Quality:</strong> {signalQualityLabel ?? '—'}
        </li>
        <li>
          <strong>FFT Samples:</strong> {fftSampleCount ?? '—'}
        </li>
      </ul>
    </details>
  );
};
