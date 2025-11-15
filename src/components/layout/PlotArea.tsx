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
    <div className="h-full rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.72)] p-5 text-[rgba(236,229,220,0.78)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(198,188,255,0.14)] pb-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.5)]">Live sample snapshot</p>
          <h3 className="text-base font-semibold text-[rgba(249,245,236,0.95)]">Raw Data Preview</h3>
        </div>
        <span className="cl-status-chip">Stable</span>
      </div>
      <table className="w-full border-collapse text-xs">
        <thead className="text-left text-[rgba(214,205,196,0.6)]">
          <tr className="border-b border-[rgba(198,188,255,0.14)]">
            <th className="pb-2 font-medium">Time (s)</th>
            <th className="pb-2 font-medium">{channel.name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(198,188,255,0.1)]">
          {rows.map((row, idx) => (
            <tr key={idx} className="transition-colors hover:bg-[rgba(105,217,255,0.06)]">
              <td className="py-2 text-[rgba(214,205,196,0.75)]">{row.time.toFixed(3)}</td>
              <td className="py-2 text-[rgba(236,229,220,0.9)]">{row.value.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SpectrogramPlaceholder: React.FC = () => (
  <div className="flex h-full items-center justify-center rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.7)] p-6 text-sm text-[rgba(214,205,196,0.65)]">
    Spectrogram will render after the signal is processed.
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex h-full items-center justify-center rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.7)] p-6 text-sm text-[rgba(214,205,196,0.65)]">
    {message}
  </div>
);

const TabPanel: React.FC<{ isActive: boolean; children: React.ReactNode }> = ({ isActive, children }) => (
  <div
    className={`h-full transition-all duration-[400ms] ${
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
