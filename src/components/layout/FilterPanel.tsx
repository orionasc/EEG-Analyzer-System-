import React, { useState } from 'react';
import { CollapsibleSection } from './CollapsibleSection';

export const FilterPanel: React.FC = () => {
  const [bandpassEnabled, setBandpassEnabled] = useState(true);
  const [artifactRejection, setArtifactRejection] = useState(false);

  return (
    <CollapsibleSection title="Filters" contentClassName="text-sm">
      <div className="space-y-2">
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition-colors hover:bg-white/10">
          <span>Bandpass filter</span>
          <input
            type="checkbox"
            checked={bandpassEnabled}
            onChange={(event) => setBandpassEnabled(event.target.checked)}
            className="h-4 w-4 accent-blue-400"
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition-colors hover:bg-white/10">
          <span>Artifact rejection</span>
          <input
            type="checkbox"
            checked={artifactRejection}
            onChange={(event) => setArtifactRejection(event.target.checked)}
            className="h-4 w-4 accent-blue-400"
          />
        </label>
      </div>
    </CollapsibleSection>
  );
};
