import React from 'react';
import type { AnalysisResult, AIInsight } from '../../types';
import { getBrainStateColor } from '../../services/aiAnalysis';

interface AIDrawerProps {
  analysisResult: AnalysisResult | null;
  isVisible: boolean;
}

const FindingsColumn: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  return (
    <div className="ai-drawer__column">
      <h3>Key Findings</h3>
      <ul>
        {insight.anomalies.length > 0 ? (
          insight.anomalies.map((item, idx) => <li key={idx}>{item}</li>)
        ) : (
          <li>No notable anomalies detected.</li>
        )}
      </ul>
      <h4>Clinical Relevance</h4>
      <p>{insight.summary}</p>
      {insight.recommendations.length > 0 && (
        <>
          <h4>Recommendations</h4>
          <ul>
            {insight.recommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const MetricsColumn: React.FC<{ insight: AIInsight; analysis: AnalysisResult }> = ({ insight, analysis }) => {
  const { signalAnalysis } = analysis;
  const dominantColor = getBrainStateColor(insight.brainState);
  const bandEntries = Object.values(signalAnalysis.frequencyBands);

  return (
    <div className="ai-drawer__column">
      <h3>Dominant Frequency</h3>
      <p style={{ color: dominantColor }}>
        {signalAnalysis.dominantFrequency.toFixed(2)} Hz
      </p>
      <h4>Band Metrics</h4>
      <ul>
        {bandEntries.map((band) => (
          <li key={band.name}>
            {band.name}: {band.power.toFixed(3)} μV²
          </li>
        ))}
      </ul>
      <h4>Artifact Notes</h4>
      <p>{insight.anomalies.length > 0 ? 'See findings for potential artifacts.' : 'No artifact concerns detected.'}</p>
      <h4>Total Power</h4>
      <p>{signalAnalysis.totalPower.toFixed(2)}</p>
    </div>
  );
};

export const AIDrawer: React.FC<AIDrawerProps> = ({ analysisResult, isVisible }) => {
  if (!analysisResult || !analysisResult.aiInsight || !isVisible) {
    return null;
  }

  return (
    <section className="ai-drawer">
      <div className="ai-drawer__content">
        <FindingsColumn insight={analysisResult.aiInsight} />
        <MetricsColumn insight={analysisResult.aiInsight} analysis={analysisResult} />
      </div>
    </section>
  );
};
