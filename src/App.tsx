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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  EEG Signal Analyzer
                </h1>
                <p className="text-xs text-gray-500">
                  AI-Powered Neuroscience Research
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

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
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Channels:</span>
                  <span className="ml-2 font-medium text-gray-900">{eegData.channels.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium text-gray-900">{eegData.duration}s</span>
                </div>
                <div>
                  <span className="text-gray-500">Sampling Rate:</span>
                  <span className="ml-2 font-medium text-gray-900">{eegData.samplingRate} Hz</span>
                </div>
                <div>
                  <span className="text-gray-500">Samples:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {eegData.channels[0].data.length.toLocaleString()}
                  </span>
                </div>
              </div>
              {analysisResult && (
                <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded border border-green-200">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Processed in {analysisResult.processingTime.toFixed(0)}ms
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Dominant Frequency</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analysisResult.signalAnalysis.dominantFrequency.toFixed(2)} <span className="text-sm font-normal text-gray-500">Hz</span>
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Total Power</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analysisResult.signalAnalysis.totalPower.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <p className="text-xs text-gray-500 mb-1">Analysis Time</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analysisResult.processingTime.toFixed(0)} <span className="text-sm font-normal text-gray-500">ms</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Built with React, TypeScript, and Claude AI</p>
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              This is a demonstration tool. For medical diagnosis, consult qualified healthcare professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
