import React from 'react';

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
  isClaudeConnected,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  return (
    <header className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-[12px] text-slate-200 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[200px] flex-col">
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{subtitle}</span>
          <h1 className="text-sm font-semibold text-white">{title}</h1>
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 text-[11px]">
          <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
            <span className="text-slate-300">Dataset</span>
            <select
              value={selectedDatasetId ?? ''}
              onChange={(event) => onDatasetChange(event.target.value)}
              className="min-w-[140px] rounded border border-white/5 bg-slate-950/80 px-2 py-1 text-[11px] text-slate-100 focus:border-blue-400"
            >
              <option value="">Select dataset</option>
              {datasetOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2 text-slate-300">
            <span>Sampling</span>
            <strong className="font-medium text-white">{samplingRate ? `${samplingRate} Hz` : '—'}</strong>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2 text-slate-300">
            <span>Channels</span>
            <strong className="font-medium text-white">{channelCount ?? '—'}</strong>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-slate-900/60 px-3 py-2 text-slate-300">
            <span>Claude</span>
            <strong className="font-medium text-white">{isClaudeConnected ? 'Connected' : 'Simulated'}</strong>
          </div>
          <button
            className="rounded-lg border border-blue-400/40 bg-blue-500/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-slate-700/40 disabled:text-slate-300"
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </div>
    </header>
  );
};
