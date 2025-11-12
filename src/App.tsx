import { useEffect, useMemo, useState } from 'react';
import type { AnalysisResult, EEGData } from './types';
import { analyzeSignal } from './utils/signalProcessing';
import { analyzeWithAI } from './services/aiAnalysis';
import {
  getSampleDatasets,
  parseCSVData,
  validateEEGData
} from './utils/dataGenerator';
import { TimeSeriesPlot } from './components/TimeSeriesPlot';
import { SpectrogramPlot } from './components/SpectrogramPlot';
import { FrequencyBandChart } from './components/FrequencyBandChart';
import { AIInsightPanel } from './components/AIInsightPanel';
import { ControlPanel } from './components/ControlPanel';

const dominantBandLabel = (frequency: number) => {
  if (frequency < 4) return 'Delta Band';
  if (frequency < 8) return 'Theta Band';
  if (frequency < 13) return 'Alpha Band';
  if (frequency < 30) return 'Beta Band';
  return 'Gamma Band';
};

const determineSignalQuality = (totalPower: number) => {
  if (totalPower > 8) return { label: 'Excellent', tone: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700' };
  if (totalPower > 4) return { label: 'Good', tone: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700' };
  if (totalPower > 2) return { label: 'Fair', tone: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' };
  return { label: 'Review', tone: 'text-rose-500', badge: 'bg-rose-100 text-rose-700' };
};

function App() {
  const [eegData, setEegData] = useState<EEGData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const samples = useMemo(() => getSampleDatasets(), []);

  useEffect(() => {
    if (!showSuccessToast) return;

    const timer = setTimeout(() => setShowSuccessToast(false), 3200);
    return () => clearTimeout(timer);
  }, [showSuccessToast]);

  const handleAnalyze = async () => {
    if (!eegData) return;

    setIsAnalyzing(true);
    const startTime = performance.now();

    try {
      const channelData = eegData.channels[0].data;
      const signalAnalysis = analyzeSignal(channelData, eegData.samplingRate);
      const aiInsight = await analyzeWithAI(signalAnalysis, apiKey);
      const processingTime = performance.now() - startTime;

      setAnalysisResult({
        signalAnalysis,
        aiInsight,
        processingTime
      });
      setShowSuccessToast(true);
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

  const primarySample = samples[0];

  const metrics = useMemo(() => {
    if (!analysisResult) return [];

    const { signalAnalysis, processingTime } = analysisResult;
    const bandEntries = Object.values(signalAnalysis.frequencyBands);
    const dominantBand = bandEntries.reduce((prev, curr) => (curr.power > prev.power ? curr : prev));
    const quality = determineSignalQuality(signalAnalysis.totalPower);

    return [
      {
        label: 'Dominant Frequency',
        value: `${signalAnalysis.dominantFrequency.toFixed(2)} Hz`,
        caption: dominantBandLabel(signalAnalysis.dominantFrequency),
        icon: '📡'
      },
      {
        label: 'Total Power',
        value: signalAnalysis.totalPower.toFixed(2),
        caption: `${dominantBand.name} emphasis`,
        icon: '⚡️'
      },
      {
        label: 'Processing Time',
        value: `${processingTime.toFixed(0)} ms`,
        caption: 'End-to-end analysis',
        icon: '⏱️'
      },
      {
        label: 'Signal Quality',
        value: quality.label,
        caption: 'Artefact screening estimate',
        icon: '🧩',
        tone: quality.tone,
        badge: quality.badge
      }
    ];
  }, [analysisResult]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/85 border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-lg flex items-center justify-center text-white text-xl">
                🧠
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">EEG Signal Studio</h1>
                <p className="text-sm text-gray-500 tracking-wide">AI-Powered Brain Signal Research Platform</p>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 justify-center">
              <p className="text-sm text-gray-400 uppercase tracking-[0.25em]">Real-Time Neuroanalytics</p>
            </div>
            <div className="flex items-center gap-2 w-full max-w-xs">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.458 12C6.732 7.943 10.523 5 15 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
                <input
                  id="header-api-key"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="Enter Claude API key"
                  className="w-full rounded-full border border-gray-200 bg-white/70 py-2.5 pl-9 pr-3 text-sm text-gray-700 shadow-inner focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  type="password"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {!eegData && (
          <section className="relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-2xl px-10 py-14">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 55%)' }} />
                <div className="relative flex flex-col gap-8 items-start">
                  <div>
                    <p className="uppercase text-xs tracking-[0.4em] text-white/70 mb-4">Next-Gen Neurotech</p>
                    <h2 className="text-4xl font-semibold leading-tight mb-3">Transform Hours of EEG Analysis into Seconds</h2>
                    <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
                      AI-powered brain signal analysis designed for neuroscience teams who demand clarity, precision, and immediate insight.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => primarySample && handleLoadSample(primarySample.data)}
                      className="inline-flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 text-sm font-medium backdrop-blur hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-lg transition-transform"
                    >
                      <span className="text-lg">⚡</span>
                      Try Sample Data
                    </button>
                    <label className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-600 cursor-pointer shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-transform">
                      <span className="text-lg">📁</span>
                      Upload Your EEG
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const text = e.target?.result as string;
                            const parsed = parseCSVData(text);
                            if (parsed) {
                              const validation = validateEEGData(parsed);
                              if (validation.valid) {
                                handleDataUpload(parsed);
                              } else {
                                alert('Invalid EEG data:\n' + validation.errors.join('\n'));
                              }
                            } else {
                              alert('Failed to parse CSV file. Please check the format.');
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              {eegData ? (
                <>
                  <TimeSeriesPlot channels={eegData.channels} duration={eegData.duration} />
                  {analysisResult ? (
                    <>
                      <SpectrogramPlot analysis={analysisResult.signalAnalysis} />
                      <FrequencyBandChart bands={analysisResult.signalAnalysis.frequencyBands} />
                    </>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-blue-200 bg-white/70 backdrop-blur px-8 py-10 text-center shadow-inner">
                      <p className="text-sm uppercase tracking-[0.4em] text-blue-400 mb-4">Awaiting Analysis</p>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">Run the AI engine to unlock spectral insights</h3>
                      <p className="text-sm text-gray-500 max-w-xl mx-auto">
                        Load a sample profile or upload your EEG recording, then start the analysis to reveal time-frequency dynamics and intelligent interpretations.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-3xl border border-gray-200/60 bg-white/60 backdrop-blur px-8 py-12 text-center shadow-lg">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Load data to begin</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Choose one of the curated brain states or upload a CSV export from your EEG hardware. Once loaded, the left canvas will transform into an interactive laboratory.
                  </p>
                </div>
              )}
            </div>

            <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 h-fit">
              <ControlPanel
                onLoadSample={handleLoadSample}
                onAnalyze={handleAnalyze}
                onDataUpload={handleDataUpload}
                isAnalyzing={isAnalyzing}
                apiKey={apiKey}
                hasData={!!eegData}
              />

              {analysisResult?.aiInsight && (
                <AIInsightPanel insight={analysisResult.aiInsight} isLoading={isAnalyzing} />
              )}

              {analysisResult && (
                <div className="rounded-3xl bg-white/80 backdrop-blur border border-gray-100 shadow-[var(--shadow-md)] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Core Metrics</p>
                      <h3 className="text-xl font-semibold text-gray-900">Signal Intelligence Summary</h3>
                    </div>
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-gray-100 bg-white/90 px-4 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">{metric.label}</span>
                          <span className="text-lg">{metric.icon}</span>
                        </div>
                        <div className={`text-2xl font-semibold text-gray-900 ${metric.tone ?? ''}`}>{metric.value}</div>
                        <p className="text-xs text-gray-500 mt-1">{metric.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/60 bg-white/80 backdrop-blur py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>
            © {new Date().getFullYear()} EEG Signal Studio. Crafted for neuroscience innovators.
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Educational tool only. Not for clinical diagnosis.
          </div>
        </div>
      </footer>

      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/90 px-4 py-3 shadow-[var(--shadow-colored)] backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-lg">✔</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Analysis Complete</p>
              <p className="text-xs text-gray-500">Insights updated with latest spectrum results.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
