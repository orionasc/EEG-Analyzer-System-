import type { AIInsight } from '../types';
import { getBrainStateColor } from '../services/aiAnalysis';

interface AIInsightPanelProps {
  insight: AIInsight;
  isLoading?: boolean;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-blue-100">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-gray-800">AI Analysis</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Analyzing brain signals...</p>
        </div>
      </div>
    );
  }

  const stateColor = getBrainStateColor(insight.brainState);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            AI Analysis
          </h3>
        </div>
        <div className="flex items-center space-x-1.5 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-medium text-gray-700">Active</span>
        </div>
      </div>

      {/* Brain State - Featured */}
      <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: stateColor + '20' }}
            >
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: stateColor }}
              />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">Brain State</span>
              <span className="text-xl font-bold" style={{ color: stateColor }}>
                {insight.brainState}
              </span>
            </div>
          </div>
          {insight.sleepStage && (
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Sleep Stage</span>
              <span className="text-sm font-semibold text-gray-700">{insight.sleepStage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-5 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide flex items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
          Summary
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">{insight.summary}</p>
      </div>

      {/* Anomalies */}
      {insight.anomalies && insight.anomalies.length > 0 && (
        <div className="mb-5 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-200/50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center">
            <svg className="w-4 h-4 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Notable Patterns
          </h4>
          <div className="space-y-2">
            {insight.anomalies.map((anomaly, idx) => (
              <div key={idx} className="flex items-start bg-white/50 rounded-md p-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center mr-2.5 mt-0.5">
                  <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">{anomaly}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insight.recommendations && insight.recommendations.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Recommendations
          </h4>
          <div className="space-y-2">
            {insight.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start bg-white/50 rounded-md p-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-md bg-green-100 flex items-center justify-center mr-2.5 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
