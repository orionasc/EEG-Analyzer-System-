import React from 'react';
import type { EEGData, SignalAnalysis } from '../../types';
import { TimeSeriesPlot } from '../TimeSeriesPlot';
import { PowerSpectrumPlot } from '../PowerSpectrumPlot';
import { SpectrogramPlot } from '../SpectrogramPlot';

interface PlotAreaProps {
  activeTab: string;
  eegData: EEGData | null;
  signalAnalysis: SignalAnalysis | null;
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
  <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
    Spectrogram will render after the signal is processed.
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex h-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-slate-300 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
    {message}
  </div>
);

const TabPanel: React.FC<{ isActive: boolean; children: React.ReactNode }> = ({ isActive, children }) => (
  <div
    className={`h-full transition-all duration-300 ${
      isActive ? 'relative opacity-100' : 'absolute inset-0 -z-10 opacity-0 pointer-events-none'
    }`.trim()}
    aria-hidden={!isActive}
  >
    <div className="h-full overflow-auto pb-4">{children}</div>
  </div>
);

export const PlotArea: React.FC<PlotAreaProps> = ({ activeTab, eegData, signalAnalysis }) => {
  const hasDataset = Boolean(eegData);
  const hasAnalysis = Boolean(signalAnalysis);
  const spectrogram = signalAnalysis?.spectrogram;

  return (
    <div className="relative h-full">
      {!hasDataset && <EmptyState message="Load a dataset to view analyses." />}

      {hasDataset && (
        <>
          <TabPanel isActive={activeTab === 'time-series'}>
            <TimeSeriesPlot channels={eegData!.channels} duration={eegData!.duration} />
          </TabPanel>

          <TabPanel isActive={activeTab === 'power-spectrum'}>
            {hasAnalysis ? (
              <PowerSpectrumPlot analysis={signalAnalysis!} />
            ) : (
              <EmptyState message="Run an analysis to view the power spectrum." />
            )}
          </TabPanel>

          <TabPanel isActive={activeTab === 'spectrogram'}>
            {hasAnalysis && spectrogram ? <SpectrogramPlot spectrogram={spectrogram} /> : <SpectrogramPlaceholder />}
          </TabPanel>

          <TabPanel isActive={activeTab === 'raw-data'}>
            <RawDataView eegData={eegData!} />
          </TabPanel>
        </>
      )}
    </div>
  );
};
