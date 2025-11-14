import type { AIInsight } from '../types';
import { getBrainStateColor } from '../utils/aiEngine';

interface AIInsightPanelProps {
  insight: AIInsight;
  isLoading?: boolean;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-lg shadow-black/10">
        <div className="mb-4 border-b border-slate-200 pb-3">
          <h3 className="text-sm font-medium text-slate-900">AI Analysis</h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-[12px] text-slate-500">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          </span>
          <p>Analyzing brain signals...</p>
        </div>
      </div>
    );
  }

  const stateColor = getBrainStateColor(insight.brainState.classification);
  const hasArtifactFindings = insight.artifactFindings.length > 0;
  const confidenceBadge = hasArtifactFindings ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
  const confidenceLevel = insight.brainState.confidence ?? (hasArtifactFindings ? 'Moderate Confidence' : 'High Confidence');

  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-lg shadow-black/10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <h3 className="text-sm font-medium text-slate-900">AI Analysis</h3>
        <span className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${confidenceBadge}`}>
          {confidenceLevel}
        </span>
      </div>

      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Brain State</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] font-semibold" style={{ color: stateColor }}>
          {insight.brainState.classification}
        </div>
        {insight.brainState.confidence && (
          <p className="mt-1 text-[11px] text-slate-500">Confidence: {insight.brainState.confidence}</p>
        )}
      </div>

      <div className="space-y-4 text-[12px] text-slate-600">
        <section className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Pattern Detections</h4>
          <ul className="space-y-2">
            {(insight.patternsFound.length ? insight.patternsFound : ['No critical patterns detected.']).map((item, idx) => (
              <li key={idx} className="rounded-lg border border-slate-200/70 bg-white px-3 py-2 leading-snug text-slate-600">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Clinical Relevance</h4>
          <p className="rounded-lg border border-slate-200/70 bg-white px-3 py-2 leading-snug text-slate-600">
            {insight.deepAnalysis}
          </p>
        </section>

        {insight.insights && insight.insights.length > 0 && (
          <section className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recommendations</h4>
            <div className="space-y-2">
              {insight.insights.map((rec, idx) => (
                <div key={idx} className="rounded-lg border border-emerald-200/70 bg-emerald-50 px-3 py-2 text-emerald-700">
                  {rec}
                </div>
              ))}
            </div>
          </section>
        )}

        {insight.artifactFindings.length > 0 && (
          <section className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Artifact Detector</h4>
            <ul className="space-y-2">
              {insight.artifactFindings.map((item, idx) => (
                <li key={idx} className="rounded-lg border border-slate-200/70 bg-white px-3 py-2 leading-snug text-slate-600">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <button className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium text-blue-600 hover:text-blue-700">
        View Detailed Report
        <span aria-hidden>→</span>
      </button>
    </div>
  );
};
