import type { AIInsight } from '../types';
import { getBrainStateColor } from '../services/aiAnalysis';

interface AIInsightPanelProps {
  insight: AIInsight;
  isLoading?: boolean;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/40 bg-white/80 backdrop-blur p-6 shadow-[var(--shadow-md)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <span className="relative flex h-12 w-12">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-200 opacity-75"></span>
            <span className="relative inline-flex h-12 w-12 rounded-full bg-blue-500/80 text-white items-center justify-center text-xl">
              ⏳
            </span>
          </span>
          <p className="text-sm text-gray-600">Analyzing brain signals...</p>
        </div>
      </div>
    );
  }

  const stateColor = getBrainStateColor(insight.brainState);
  const anomalyCount = insight.anomalies?.length ?? 0;
  const confidenceLevel = anomalyCount > 2 ? 'Medium Confidence' : 'High Confidence';
  const confidenceBadge = anomalyCount > 2 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

  return (
    <div className="rounded-3xl border border-white/40 bg-white/85 backdrop-blur p-6 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900">AI Analysis</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${confidenceBadge}`}>
          {confidenceLevel}
        </span>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white px-5 py-4 mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">Brain State</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl font-semibold" style={{ color: stateColor }}>
            {insight.brainState}
          </span>
          {insight.sleepStage && (
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              Sleep Stage: {insight.sleepStage}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Findings</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {insight.anomalies.length > 0 ? (
              insight.anomalies.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded-xl bg-blue-50/60 px-3 py-2 border border-blue-100 text-blue-700"
                >
                  <span className="text-lg leading-none">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))
            ) : (
              <li className="rounded-xl bg-blue-50/60 px-3 py-3 text-sm text-blue-600 border border-blue-100">
                No significant anomalies detected across spectral bands.
              </li>
            )}
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Clinical Relevance</h4>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3">
            {insight.summary}
          </p>
        </section>

        {insight.recommendations && insight.recommendations.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendations</h4>
            <div className="grid gap-2">
              {insight.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-700"
                >
                  <span className="text-lg leading-none">✓</span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
        View Detailed Report
        <span className="text-base">→</span>
      </button>
    </div>
  );
};
