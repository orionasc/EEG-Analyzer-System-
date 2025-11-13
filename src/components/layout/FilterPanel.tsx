import React, { useState } from 'react';

export const FilterPanel: React.FC = () => {
  const [bandpassEnabled, setBandpassEnabled] = useState(true);
  const [artifactRejection, setArtifactRejection] = useState(false);

  return (
    <details className="sidebar-panel" open>
      <summary>Filters</summary>
      <div className="filter-controls">
        <label>
          <input
            type="checkbox"
            checked={bandpassEnabled}
            onChange={(event) => setBandpassEnabled(event.target.checked)}
          />
          Bandpass Filter
        </label>
        <label>
          <input
            type="checkbox"
            checked={artifactRejection}
            onChange={(event) => setArtifactRejection(event.target.checked)}
          />
          Artifact Rejection
        </label>
      </div>
    </details>
  );
};
