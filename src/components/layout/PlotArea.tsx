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
    <div className="rounded-xl border border-slate-200/70 bg-white p-4 text-slate-700 shadow-lg shadow-black/10">
      <div className="mb-3 border-b border-slate-200 pb-2">
        <h3 className="text-sm font-medium text-slate-900">Raw Data Preview</h3>
      </div>
      <table className="w-full border-collapse text-[12px]">
        <thead className="text-left text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="pb-1">Time (s)</th>
            <th className="pb-1">{channel.name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 text-[12px]">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-100/70">
              <td className="py-1 text-slate-600">{row.time.toFixed(3)}</td>
              <td className="py-1 text-slate-700">{row.value.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SpectrogramPlaceholder: React.FC = () => (
  <div className="rounded-xl border border-slate-200/70 bg-white p-6 text-slate-600 shadow-lg shadow-black/10">
    <h3 className="text-sm font-medium text-slate-900">Spectrogram View</h3>
    <p className="mt-2 text-[12px] leading-snug text-slate-600">
      Time-frequency visualizations will render here once spectrogram data becomes available.
    </p>
  </div>
);

export const PlotArea: React.FC<PlotAreaProps> = ({ activeTab, eegData, analysisResult }) => {
  if (!eegData) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/20 bg-slate-900/40 text-[12px] text-slate-300">
        Load a dataset to view analyses.
      </div>
    );
  }

  if (activeTab === 'time-series') {
    return (
      <div className="h-full overflow-auto pb-4">
        <TimeSeriesPlot channels={eegData.channels} duration={eegData.duration} />
      </div>
    );
  }

  if (activeTab === 'power-spectrum' && analysisResult) {
    return (
      <div className="h-full overflow-auto pb-4">
        <PowerSpectrumPlot analysis={analysisResult.signalAnalysis} />
      </div>
    );
  }

  if (activeTab === 'spectrogram') {
    return (
      <div className="h-full overflow-auto pb-4">
        <SpectrogramPlaceholder />
      </div>
    );
  }

  if (activeTab === 'raw-data') {
    return (
      <div className="h-full overflow-auto pb-4">
        <RawDataView eegData={eegData} />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/20 bg-slate-900/40 text-[12px] text-slate-300">
      Analysis results will appear here after processing.
    </div>
  );
};
