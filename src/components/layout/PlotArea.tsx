import React from 'react';
import type { AnalysisResult, EEGData } from '../../types';
import { TimeSeriesPlot } from '../TimeSeriesPlot';
import { SpectrogramPlot as PowerSpectrumPlot } from '../SpectrogramPlot';

interface PlotAreaProps {
  activeTab: string;
  eegData: EEGData | null;
  analysisResult: AnalysisResult | null;
}

const RawDataView: React.FC<{ eegData: EEGData }> = ({ eegData }) => {
  const channel = eegData.channels[0];
  const previewLength = Math.min(channel.data.length, 100);
  const rows: Array<{ time: number; value: number }> = [];
  for (let index = 0; index < previewLength; index += 1) {
    rows.push({
      time: index / channel.samplingRate,
      value: channel.data[index]
    });
  }

  return (
    <div className="raw-data-view">
      <h3>Raw Data Preview</h3>
      <table>
        <thead>
          <tr>
            <th>Time (s)</th>
            <th>{channel.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>{row.time.toFixed(3)}</td>
              <td>{row.value.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SpectrogramPlaceholder: React.FC = () => (
  <div className="spectrogram-placeholder">
    <h3>Spectrogram View</h3>
    <p>This view will display time-frequency representations once available.</p>
  </div>
);

export const PlotArea: React.FC<PlotAreaProps> = ({ activeTab, eegData, analysisResult }) => {
  if (!eegData) {
    return <div className="plot-area__empty">Load a dataset to view analyses.</div>;
  }

  if (activeTab === 'time-series') {
    return (
      <div className="plot-area">
        <TimeSeriesPlot channels={eegData.channels} duration={eegData.duration} />
      </div>
    );
  }

  if (activeTab === 'power-spectrum' && analysisResult) {
    return (
      <div className="plot-area">
        <PowerSpectrumPlot analysis={analysisResult.signalAnalysis} />
      </div>
    );
  }

  if (activeTab === 'spectrogram') {
    return (
      <div className="plot-area">
        <SpectrogramPlaceholder />
      </div>
    );
  }

  if (activeTab === 'raw-data') {
    return (
      <div className="plot-area">
        <RawDataView eegData={eegData} />
      </div>
    );
  }

  return <div className="plot-area__empty">Analysis results will appear here after processing.</div>;
};
