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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                EEG Signal Analyzer with AI
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Real-time brain signal analysis powered by artificial intelligence
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-sm font-medium text-blue-900">
                Neuroscience Research Tool
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start space-x-4">
            <svg className="w-8 h-8 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h2 className="text-xl font-bold mb-2">How AI Accelerates Neuroscience Research</h2>
              <p className="text-blue-50 leading-relaxed">
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
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <div>
                  <span className="text-gray-600">Channels:</span>
                  <span className="ml-2 font-semibold text-gray-900">{eegData.channels.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-semibold text-gray-900">{eegData.duration}s</span>
                </div>
                <div>
                  <span className="text-gray-600">Sampling Rate:</span>
                  <span className="ml-2 font-semibold text-gray-900">{eegData.samplingRate} Hz</span>
                </div>
                <div>
                  <span className="text-gray-600">Samples:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {eegData.channels[0].data.length.toLocaleString()}
                  </span>
                </div>
              </div>
              {analysisResult && (
                <div className="text-sm text-gray-600">
                  Processing time: <span className="font-semibold">{analysisResult.processingTime.toFixed(0)}ms</span>
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
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Dominant Frequency</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {analysisResult.signalAnalysis.dominantFrequency.toFixed(2)} Hz
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Power</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {analysisResult.signalAnalysis.totalPower.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Analysis Time</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {analysisResult.processingTime.toFixed(0)} ms
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Built with React, TypeScript, and Claude AI •
              Demonstrating AI-accelerated neuroscience research
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Note: This is a demonstration tool. For medical diagnosis, consult qualified healthcare professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
