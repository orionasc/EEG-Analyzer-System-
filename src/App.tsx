import { useState } from 'react';
import type { EEGData, AnalysisResult } from './types';
import { analyzeSignal } from './utils/signalProcessing';
import { analyzeWithAI } from './services/aiAnalysis';
import { generateEEGData } from './utils/dataGenerator';
import { TimeSeriesPlot } from './components/TimeSeriesPlot';
import { SpectrogramPlot } from './components/SpectrogramPlot';
import { FrequencyBandChart } from './components/FrequencyBandChart';
import { AIInsightPanel } from './components/AIInsightPanel';
import { ControlPanel } from './components/ControlPanel';
import { DataUploader } from './components/DataUploader';

function App() {
  const [eegData, setEegData] = useState<EEGData | null>(() =>
    generateEEGData(10, 256, 'awake')
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleAnalyze = async () => {
    if (!eegData) return;

    setIsAnalyzing(true);
    const startTime = performance.now();

    try {
      // Analyze first channel (or average of all channels)
      const channelData = eegData.channels[0].data;
      const signalAnalysis = analyzeSignal(channelData, eegData.samplingRate);

      // Get AI insights
      const aiInsight = await analyzeWithAI(signalAnalysis, apiKey);

      const processingTime = performance.now() - startTime;

      setAnalysisResult({
        signalAnalysis,
        aiInsight,
        processingTime
      });
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (data: EEGData) => {
    setEegData(data);
    setAnalysisResult(null);
  };

  const handleDataUpload = (data: EEGData) => {
    setEegData(data);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  EEG Signal Analyzer
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Powered Neuroscience Research Tool
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Research Tool
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white border border-blue-400/20">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2 flex items-center">
                How AI Accelerates Neuroscience Research
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">Demo</span>
              </h2>
              <p className="text-blue-50 text-sm leading-relaxed">
                Traditional EEG analysis requires hours of manual inspection by trained specialists.
                This tool demonstrates how AI can instantly identify brain states, detect anomalies,
                and provide insights that would traditionally take extensive expertise and time to uncover.
              </p>
            </div>
          </div>
        </div>

        {/* Control and Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ControlPanel
            onLoadSample={handleLoadSample}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
          />
          <DataUploader onDataLoaded={handleDataUpload} />
        </div>

        {/* EEG Data Info */}
        {eegData && (
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-gray-600">Channels:</span>
                  <span className="ml-2 font-semibold text-gray-900">{eegData.channels.length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-semibold text-gray-900">{eegData.duration}s</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
                  <span className="text-gray-600">Sampling Rate:</span>
                  <span className="ml-2 font-semibold text-gray-900">{eegData.samplingRate} Hz</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
                  <span className="text-gray-600">Samples:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {eegData.channels[0].data.length.toLocaleString()}
                  </span>
                </div>
              </div>
              {analysisResult && (
                <div className="flex items-center text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Processed in <span className="font-semibold text-green-700">{analysisResult.processingTime.toFixed(0)}ms</span></span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visualizations */}
        {eegData && (
          <div className="space-y-6">
            <TimeSeriesPlot channels={eegData.channels} duration={eegData.duration} />

            {analysisResult && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SpectrogramPlot analysis={analysisResult.signalAnalysis} />
                  <FrequencyBandChart bands={analysisResult.signalAnalysis.frequencyBands} />
                </div>

                {analysisResult.aiInsight && (
                  <AIInsightPanel insight={analysisResult.aiInsight} isLoading={isAnalyzing} />
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">Dominant Frequency</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analysisResult.signalAnalysis.dominantFrequency.toFixed(2)} <span className="text-base font-normal text-gray-500">Hz</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">Total Power</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analysisResult.signalAnalysis.totalPower.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mb-2">Analysis Time</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analysisResult.processingTime.toFixed(0)} <span className="text-base font-normal text-gray-500">ms</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/60 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">EEG Signal Analyzer</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Built with React, TypeScript, and Claude AI
            </p>
            <p className="text-sm text-gray-500">
              Demonstrating AI-accelerated neuroscience research
            </p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                This is a demonstration tool. For medical diagnosis, consult qualified healthcare professionals.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
