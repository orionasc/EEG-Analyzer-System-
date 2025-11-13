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
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="mb-3 border-b border-white/10 pb-2">
        <p className="text-xs text-slate-400">Live sample snapshot</p>
        <h3 className="text-sm font-medium text-white">Raw Data Preview</h3>
      </div>
      <table className="w-full border-collapse text-xs">
        <thead className="text-left text-xs text-slate-400">
          <tr className="border-b border-white/10">
            <th className="pb-1 font-medium">Time (s)</th>
            <th className="pb-1 font-medium">{channel.name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-xs text-slate-200">
          {rows.map((row, idx) => (
            <tr key={idx} className="transition-colors hover:bg-white/5">
              <td className="py-1 text-slate-300">{row.time.toFixed(3)}</td>
              <td className="py-1 text-slate-200">{row.value.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SpectrogramPlaceholder: React.FC = () => (
  <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
    <p className="text-xs text-slate-400">Spectrogram preview</p>
    <h3 className="text-sm font-medium text-white">Spectrogram View</h3>
    <p className="mt-2 text-xs leading-relaxed text-slate-300">
      Time-frequency visualizations will render here once spectrogram data becomes available.
    </p>
  </div>
);

export const PlotArea: React.FC<PlotAreaProps> = ({ activeTab, eegData, analysisResult }) => {
  let content: React.ReactNode = (
    <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      Analysis results will appear here after processing.
    </div>
  );

  if (!eegData) {
    content = (
      <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        Load a dataset to view analyses.
      </div>
    );
  } else if (activeTab === 'time-series') {
    content = (
      <div className="h-full overflow-auto pb-4">
        <TimeSeriesPlot channels={eegData.channels} duration={eegData.duration} />
      </div>
    );
  } else if (activeTab === 'power-spectrum' && analysisResult) {
    content = (
      <div className="h-full overflow-auto pb-4">
        <PowerSpectrumPlot analysis={analysisResult.signalAnalysis} />
      </div>
    );
  } else if (activeTab === 'spectrogram') {
    content = (
      <div className="h-full overflow-auto pb-4">
        <SpectrogramPlaceholder />
      </div>
    );
  } else if (activeTab === 'raw-data' && eegData) {
    content = (
      <div className="h-full overflow-auto pb-4">
        <RawDataView eegData={eegData} />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div key={activeTab} className="animate-fade-scale absolute inset-0">
        {content}
      </div>
    </div>
  );
};
