import { useState } from 'react';
import { getSampleDatasets } from '../utils/dataGenerator';
import type { EEGData } from '../types';

interface ControlPanelProps {
  onLoadSample: (data: EEGData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onLoadSample,
  onAnalyze,
  isAnalyzing,
  apiKey,
  onApiKeyChange
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const samples = getSampleDatasets();

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-5">Control Panel</h3>

      {/* Sample Data Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Load Sample Dataset
        </label>
        <div className="space-y-2">
          {samples.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onLoadSample(sample.data)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-sm text-gray-800">
                {sample.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{sample.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* API Key Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Claude API Key <span className="text-xs font-normal text-gray-500">(Optional)</span>
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
            title={showApiKey ? 'Hide API key' : 'Show API key'}
          >
            {showApiKey ? (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {apiKey ? '✓ Using Claude API for AI analysis' : 'Using mock AI analysis'}
        </p>
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          <span>Analyze EEG Data</span>
        )}
      </button>
    </div>
  );
};
