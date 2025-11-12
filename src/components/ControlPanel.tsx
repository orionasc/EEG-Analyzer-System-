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
    <div className="w-full bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center mb-5">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
        <h3 className="text-lg font-semibold text-gray-800">Control Panel</h3>
      </div>

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
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-800 group-hover:text-blue-700 transition-colors">
                    {sample.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{sample.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* API Key Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Claude API Key
            <span className="ml-1.5 text-xs font-normal text-gray-500">(Optional)</span>
          </span>
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            title={showApiKey ? 'Hide API key' : 'Show API key'}
          >
            {showApiKey ? (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <p className="flex items-center text-xs text-gray-500 mt-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${apiKey ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {apiKey ? 'Using Claude API for AI analysis' : 'Using mock AI analysis'}
        </p>
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 rounded-lg font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:shadow-none"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Analyze EEG Data</span>
          </>
        )}
      </button>
    </div>
  );
};
