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
      <div className="space-y-3">
        <label className="flex items-center justify-between rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(21,16,32,0.72)] px-4 py-3 text-sm text-[rgba(236,229,220,0.85)]">
          <span className="font-medium text-[rgba(249,245,236,0.9)]">Bandpass filter</span>
          <input
            type="checkbox"
            checked={bandpassEnabled}
            onChange={(event) => handleBandpassChange(event.target.checked)}
            className="cl-toggle"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(21,16,32,0.72)] px-4 py-3 text-sm text-[rgba(236,229,220,0.85)]">
          <span className="font-medium text-[rgba(249,245,236,0.9)]">Artifact rejection</span>
          <input
            type="checkbox"
            checked={artifactRejectionEnabled}
            onChange={(event) => handleArtifactChange(event.target.checked)}
            className="cl-toggle"
          />
        </label>
      </div>
    </CollapsibleSection>
  );
};
