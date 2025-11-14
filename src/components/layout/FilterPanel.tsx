import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';

interface FilterPanelProps {
  bandpassEnabled: boolean;
  artifactRejectionEnabled: boolean;
  onChange: (settings: { bandpassEnabled: boolean; artifactRejectionEnabled: boolean }) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  bandpassEnabled,
  artifactRejectionEnabled,
  onChange
}) => {
  const handleBandpassChange = (value: boolean) => {
    onChange({ bandpassEnabled: value, artifactRejectionEnabled });
  };

  const handleArtifactChange = (value: boolean) => {
    onChange({ bandpassEnabled, artifactRejectionEnabled: value });
  };

  return (
    <CollapsibleSection title="Filters" contentClassName="text-sm">
      <div className="space-y-2">
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition-colors hover:bg-white/10">
          <span>Bandpass filter</span>
          <input
            type="checkbox"
            checked={bandpassEnabled}
            onChange={(event) => handleBandpassChange(event.target.checked)}
            className="h-4 w-4 accent-blue-400"
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition-colors hover:bg-white/10">
          <span>Artifact rejection</span>
          <input
            type="checkbox"
            checked={artifactRejectionEnabled}
            onChange={(event) => handleArtifactChange(event.target.checked)}
            className="h-4 w-4 accent-blue-400"
          />
        </label>
      </div>
    </CollapsibleSection>
  );
};
