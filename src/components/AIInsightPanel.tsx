import type { AIInsight } from '../types';
import { getBrainStateColor } from '../utils/aiEngine';

interface AIInsightPanelProps {
  insight: AIInsight;
  isLoading?: boolean;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(17,13,28,0.8)] p-5 text-[rgba(236,229,220,0.78)] shadow-[0_24px_48px_rgba(8,4,18,0.45)]">
        <div className="mb-4 border-b border-[rgba(198,188,255,0.16)] pb-3">
          <h3 className="text-sm font-medium text-[rgba(249,245,236,0.95)]">AI Analysis</h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-[12px] text-[rgba(214,205,196,0.7)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(105,217,255,0.35)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[rgba(105,217,255,0.85)]" />
          </span>
          <p>Analyzing brain signals...</p>
        </div>
      </div>
    );
  }

  const stateColor = getBrainStateColor(insight.brainState.classification) || 'rgba(105,217,255,0.85)';
  const hasArtifactFindings = insight.artifactFindings.length > 0;
  const confidenceLevel = insight.brainState.confidence ?? (hasArtifactFindings ? 'Moderate Confidence' : 'High Confidence');

  return (
    <div className="rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(17,13,28,0.8)] p-5 text-[rgba(236,229,220,0.78)] shadow-[0_24px_48px_rgba(8,4,18,0.45)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(198,188,255,0.16)] pb-3">
        <h3 className="text-sm font-medium text-[rgba(249,245,236,0.95)]">AI Analysis</h3>
        <span className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${hasArtifactFindings ? 'border border-[rgba(255,182,72,0.4)] bg-[rgba(255,182,72,0.15)] text-[rgba(255,214,159,0.92)]' : 'border border-[rgba(68,209,157,0.4)] bg-[rgba(68,209,157,0.15)] text-[rgba(170,246,210,0.92)]'}`}>
          {confidenceLevel}
        </span>
      </div>

      <div className="mb-4 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Brain State</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] font-semibold" style={{ color: stateColor }}>
          {insight.brainState.classification}
        </div>
        {insight.brainState.confidence && (
          <p className="mt-1 text-[11px] text-[rgba(214,205,196,0.7)]">Confidence: {insight.brainState.confidence}</p>
        )}
      </div>

      <div className="space-y-4 text-[12px] text-[rgba(236,229,220,0.78)]">
        <section className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Pattern Detections</h4>
          <ul className="space-y-2">
            {(insight.patternsFound.length ? insight.patternsFound : ['No critical patterns detected.']).map((item, idx) => (
              <li key={idx} className="rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(23,18,33,0.72)] px-3 py-2 leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Clinical Relevance</h4>
          <p className="rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(23,18,33,0.72)] px-3 py-2 leading-snug">
            {insight.deepAnalysis}
          </p>
        </section>

        {insight.insights && insight.insights.length > 0 && (
          <section className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Recommendations</h4>
            <div className="space-y-2">
              {insight.insights.map((rec, idx) => (
                <div key={idx} className="rounded-2xl border border-[rgba(68,209,157,0.35)] bg-[rgba(68,209,157,0.12)] px-3 py-2 text-[rgba(170,246,210,0.92)]">
                  {rec}
                </div>
              ))}
            </div>
          </section>
        )}

        {insight.artifactFindings.length > 0 && (
          <section className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Artifact Detector</h4>
            <ul className="space-y-2">
              {insight.artifactFindings.map((item, idx) => (
                <li key={idx} className="rounded-2xl border border-[rgba(255,182,72,0.35)] bg-[rgba(255,182,72,0.12)] px-3 py-2 leading-snug text-[rgba(255,214,159,0.9)]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <button className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-[rgba(105,217,255,0.9)] hover:text-[rgba(249,245,236,0.95)]">
        View Detailed Report
        <span aria-hidden>→</span>
      </button>
    </div>
  );
};
