import type { AIInsight } from '../types';
import { getBrainStateColor } from '../services/aiAnalysis';

interface AIInsightPanelProps {
  insight: AIInsight;
  isLoading?: boolean;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-6">AI Analysis</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-sm text-gray-600">Analyzing brain signals...</p>
        </div>
      </div>
    );
  }

  const stateColor = getBrainStateColor(insight.brainState);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-6">AI Analysis</h3>

      {/* Brain State - Featured */}
      <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block mb-1">Brain State</span>
            <span className="text-xl font-semibold" style={{ color: stateColor }}>
              {insight.brainState}
            </span>
          </div>
          {insight.sleepStage && (
            <div className="text-right">
              <span className="text-xs text-gray-500 block mb-1">Sleep Stage</span>
              <span className="text-sm font-medium text-gray-900">{insight.sleepStage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{insight.summary}</p>
      </div>

      {/* Anomalies */}
      {insight.anomalies && insight.anomalies.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notable Patterns</h4>
          <div className="space-y-2">
            {insight.anomalies.map((anomaly, idx) => (
              <div key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-orange-400 py-1">
                {anomaly}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insight.recommendations && insight.recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
          <div className="space-y-2">
            {insight.recommendations.map((rec, idx) => (
              <div key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-green-500 py-1">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
