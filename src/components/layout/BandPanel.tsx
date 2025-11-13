import React from 'react';
import type { AnalysisResult } from '../../types';

interface BandPanelProps {
  analysisResult: AnalysisResult | null;
}

export const BandPanel: React.FC<BandPanelProps> = ({ analysisResult }) => {
  if (!analysisResult) {
    return (
      <details className="sidebar-panel">
        <summary>Frequency Bands</summary>
        <p>No analysis available.</p>
      </details>
    );
  }

  const bands = analysisResult.signalAnalysis.frequencyBands;
  const entries = Object.values(bands);

  return (
    <details className="sidebar-panel" open>
      <summary>Frequency Bands</summary>
      <table className="band-table">
        <thead>
          <tr>
            <th>Band</th>
            <th>Range (Hz)</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((band) => (
            <tr key={band.name}>
              <td>{band.name}</td>
              <td>
                {band.range[0]} – {band.range[1]}
              </td>
              <td>{band.power.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
};
