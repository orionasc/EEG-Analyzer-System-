import React, { useState } from 'react';
import { CollapsibleSection } from './CollapsibleSection';

export const FilterPanel: React.FC = () => {
  const [bandpassEnabled, setBandpassEnabled] = useState(true);
  const [artifactRejection, setArtifactRejection] = useState(false);

  return (
    <CollapsibleSection title="Filters" contentClassName="text-[12px]">
      <div className="space-y-2">
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
    </CollapsibleSection>
  );
};
