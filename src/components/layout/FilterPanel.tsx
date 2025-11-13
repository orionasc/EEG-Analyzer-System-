import React, { useState } from 'react';

export const FilterPanel: React.FC = () => {
  const [bandpassEnabled, setBandpassEnabled] = useState(true);
  const [artifactRejection, setArtifactRejection] = useState(false);

  return (
    <details
      className="group rounded-xl border border-white/8 bg-slate-900/60 text-slate-200 shadow-sm backdrop-blur"
      open
    >
      <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
        Filters
      </summary>
      <div className="space-y-2 px-3 pb-3 text-[12px]">
        <label className="flex items-center justify-between rounded border border-white/5 bg-slate-900/70 px-3 py-2 text-slate-200">
          <span>Bandpass Filter</span>
          <input
            type="checkbox"
            checked={bandpassEnabled}
            onChange={(event) => setBandpassEnabled(event.target.checked)}
            className="h-3 w-3 accent-blue-400"
          />
        </label>
        <label className="flex items-center justify-between rounded border border-white/5 bg-slate-900/70 px-3 py-2 text-slate-200">
          <span>Artifact Rejection</span>
          <input
            type="checkbox"
            checked={artifactRejection}
            onChange={(event) => setArtifactRejection(event.target.checked)}
            className="h-3 w-3 accent-blue-400"
          />
        </label>
      </div>
    </details>
  );
};
