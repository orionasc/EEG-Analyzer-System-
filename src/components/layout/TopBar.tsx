import React from 'react';
import { NeuralDivider } from '../common/NeuralDivider';

type DatasetOption = {
  id: string;
  label: string;
};

interface TopBarProps {
  title: string;
  subtitle: string;
  datasetOptions: DatasetOption[];
  selectedDatasetId: string | null;
  onDatasetChange: (id: string) => void;
  samplingRate: number | null;
  channelCount: number | null;
  datasetDuration: number | null;
  activeDatasetLabel: string | null;
  activeDatasetDescription: string | null;
  isClaudeConnected: boolean;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  datasetOptions,
  selectedDatasetId,
  onDatasetChange,
  samplingRate,
  channelCount,
  datasetDuration,
  activeDatasetLabel,
  activeDatasetDescription,
  isClaudeConnected,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  const statusTone = isClaudeConnected ? 'Connected' : 'Simulation';

  return (
    <header className="cl-slab cl-veil relative overflow-hidden">
      <div className="cl-slab-edge" />
      <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex min-w-[260px] flex-col gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-[rgba(236,229,220,0.55)]">{subtitle}</p>
            <h1 className="text-2xl font-semibold text-[rgba(249,245,236,0.98)]">{title}</h1>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(21,17,29,0.82)] p-4">
            <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(105,217,255,0.15), transparent 55%)' }} />
            <div className="relative space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[rgba(236,229,220,0.55)]">Active dataset</p>
              <p className="text-lg font-semibold text-[rgba(249,245,236,0.95)]">{activeDatasetLabel ?? 'No dataset selected'}</p>
              <p className="text-xs text-[rgba(214,205,196,0.74)]">
                {activeDatasetDescription ?? 'Choose a dataset to populate metadata.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <label className="flex w-full flex-col gap-1 text-xs text-[rgba(236,229,220,0.7)] lg:max-w-xs">
              <span className="uppercase tracking-[0.28em]">Dataset Source</span>
              <select
                value={selectedDatasetId ?? ''}
                onChange={(event) => onDatasetChange(event.target.value)}
                className="cl-select"
              >
                <option value="">Select dataset</option>
                {datasetOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="cl-node-button mt-1 lg:mt-6"
              onClick={onAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              type="button"
            >
              <span className="cl-node-spark" aria-hidden />
              {isAnalyzing ? 'Analyzing' : 'Activate Claude'}
            </button>
          </div>

          <NeuralDivider curvature={0.35} opacity={0.5} />

          <dl className="grid grid-cols-2 gap-4 text-sm text-[rgba(236,229,220,0.78)] sm:grid-cols-4">
            <div className="rounded-xl border border-[rgba(198,188,255,0.16)] bg-[rgba(24,19,34,0.74)] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.45)]">Sampling</dt>
              <dd className="mt-1 text-base font-semibold text-[rgba(249,245,236,0.95)]">{samplingRate ? `${samplingRate} Hz` : '—'}</dd>
            </div>
            <div className="rounded-xl border border-[rgba(198,188,255,0.16)] bg-[rgba(24,19,34,0.74)] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.45)]">Channels</dt>
              <dd className="mt-1 text-base font-semibold text-[rgba(249,245,236,0.95)]">{channelCount ?? '—'}</dd>
            </div>
            <div className="rounded-xl border border-[rgba(198,188,255,0.16)] bg-[rgba(24,19,34,0.74)] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.45)]">Duration</dt>
              <dd className="mt-1 text-base font-semibold text-[rgba(249,245,236,0.95)]">
                {datasetDuration ? `${datasetDuration.toFixed(1)} s` : '—'}
              </dd>
            </div>
            <div className="rounded-xl border border-[rgba(198,188,255,0.16)] bg-[rgba(24,19,34,0.74)] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.45)]">Claude Link</dt>
              <dd className="mt-1 text-base font-semibold text-[rgba(249,245,236,0.95)]">{statusTone}</dd>
            </div>
          </dl>
        </div>
      </div>
    </header>
  );
};
