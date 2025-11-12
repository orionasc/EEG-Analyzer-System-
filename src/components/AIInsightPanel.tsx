import type { AIInsight } from '../types';
import { getBrainStateColor } from '../services/aiAnalysis';

interface AIInsightPanelProps {
  insight: AIInsight;
  isLoading?: boolean;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">AI Analysis</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const stateColor = getBrainStateColor(insight.brainState);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        AI Analysis
      </h3>

      {/* Brain State */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: stateColor }}
          />
          <span className="font-semibold text-gray-700">Brain State:</span>
          <span className="text-lg font-bold" style={{ color: stateColor }}>
            {insight.brainState}
          </span>
        </div>
        {insight.sleepStage && (
          <div className="text-sm text-gray-600 ml-6">
            Sleep Stage: <span className="font-medium">{insight.sleepStage}</span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
        <p className="text-gray-600 leading-relaxed">{insight.summary}</p>
      </div>

      {/* Anomalies */}
      {insight.anomalies && insight.anomalies.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Notable Patterns
          </h4>
          <ul className="space-y-1">
            {insight.anomalies.map((anomaly, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>{anomaly}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {insight.recommendations && insight.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Recommendations
          </h4>
          <ul className="space-y-1">
            {insight.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
