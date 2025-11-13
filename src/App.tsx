import { useMemo, useState } from 'react';
import type { AnalysisResult, EEGData } from './types';
import { analyzeSignal } from './utils/signalProcessing';
import { analyzeWithAI } from './services/aiAnalysis';
import { getSampleDatasets } from './utils/dataGenerator';
import { TopBar } from './components/layout/TopBar';
import { TabsPane } from './components/layout/TabsPane';
import { PlotArea } from './components/layout/PlotArea';
import { Sidebar } from './components/layout/Sidebar';
import { DatasetPanel } from './components/layout/DatasetPanel';
import { BandPanel } from './components/layout/BandPanel';
import { FilterPanel } from './components/layout/FilterPanel';
import { SummaryPanel } from './components/layout/SummaryPanel';
import { AIDrawer } from './components/layout/AIDrawer';

type SampleDataset = {
  id: string;
  name: string;
  description: string;
  data: EEGData;
};

const determineSignalQuality = (totalPower: number) => {
  if (totalPower > 8) return 'Excellent';
  if (totalPower > 4) return 'Good';
  if (totalPower > 2) return 'Fair';
  return 'Review';
};

const tabs = [
  { id: 'time-series', label: 'Time Series' },
  { id: 'power-spectrum', label: 'Power Spectrum' },
  { id: 'spectrogram', label: 'Spectrogram' },
  { id: 'raw-data', label: 'Raw Data' }
];

function App() {
  const [eegData, setEegData] = useState<EEGData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('time-series');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [uploadedDatasetLabel, setUploadedDatasetLabel] = useState<string | null>(null);
  const [uploadedDatasetData, setUploadedDatasetData] = useState<EEGData | null>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const sampleDatasets: SampleDataset[] = useMemo(() => {
    const samples = getSampleDatasets();
    return samples.map((sample, index) => ({
      id: `sample-${index}`,
      name: sample.name,
      description: sample.description,
      data: sample.data
    }));
  }, []);

  const datasetOptions = useMemo(() => {
    const options = sampleDatasets.map((sample) => ({ id: sample.id, label: sample.name }));
    if (uploadedDatasetLabel) {
      options.push({ id: 'uploaded', label: uploadedDatasetLabel });
    }
    return options;
  }, [sampleDatasets, uploadedDatasetLabel]);

  const activeDatasetMeta = useMemo<{ label: string | null; description: string | null }>(() => {
    if (!selectedDatasetId) {
      return { label: null, description: null };
    }

    if (selectedDatasetId.startsWith('sample-')) {
      const sample = sampleDatasets.find((item) => item.id === selectedDatasetId);
      if (sample) {
        return { label: sample.name, description: sample.description };
      }
    }

    if (selectedDatasetId === 'uploaded' && uploadedDatasetLabel) {
      return { label: uploadedDatasetLabel, description: 'Imported CSV dataset' };
    }

    return { label: null, description: null };
  }, [selectedDatasetId, sampleDatasets, uploadedDatasetLabel]);

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
      setDrawerVisible(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (sample: SampleDataset) => {
    setEegData(sample.data);
    setAnalysisResult(null);
    setSelectedDatasetId(sample.id);
    setDrawerVisible(false);
  };

  const handleUpload = (data: EEGData, label: string) => {
    setEegData(data);
    setAnalysisResult(null);
    setUploadedDatasetData(data);
    setUploadedDatasetLabel(label);
    setSelectedDatasetId('uploaded');
    setDrawerVisible(false);
  };

  const handleDatasetChange = (id: string) => {
    if (!id) {
      setSelectedDatasetId(null);
      setEegData(null);
      setAnalysisResult(null);
      setDrawerVisible(false);
      return;
    }

    if (id.startsWith('sample-')) {
      const sample = sampleDatasets.find((item) => item.id === id);
      if (sample) {
        setEegData(sample.data);
        setAnalysisResult(null);
        setSelectedDatasetId(id);
        setDrawerVisible(false);
      }
      return;
    }

    if (id === 'uploaded' && uploadedDatasetData) {
      setEegData(uploadedDatasetData);
      setAnalysisResult(null);
      setSelectedDatasetId(id);
      setDrawerVisible(false);
    }
  };

  const samplingRate = eegData ? eegData.samplingRate : null;
  const channelCount = eegData ? eegData.channels.length : null;
  const signalQualityLabel = analysisResult
    ? determineSignalQuality(analysisResult.signalAnalysis.totalPower)
    : null;
  const fftSampleCount = analysisResult ? analysisResult.signalAnalysis.spectralData.frequencies.length : null;
  const datasetDuration = eegData ? eegData.duration : null;
  const isDrawerOpen = Boolean(analysisResult && analysisResult.aiInsight && isDrawerVisible);

  return (
    <div className="min-h-screen bg-transparent">
      <div
        className={`mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 py-4 transition-transform duration-300 ease-out lg:px-8 ${
          isDrawerOpen ? 'scale-[0.99]' : 'scale-100'
        }`}
      >
        <TopBar
          title="EEG Signal Analyzer"
          subtitle="Neuroscience workspace"
          datasetOptions={datasetOptions}
          selectedDatasetId={selectedDatasetId}
          onDatasetChange={handleDatasetChange}
          samplingRate={samplingRate}
          channelCount={channelCount}
          datasetDuration={datasetDuration}
          activeDatasetLabel={activeDatasetMeta.label}
          activeDatasetDescription={activeDatasetMeta.description}
          isClaudeConnected={Boolean(apiKey)}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          canAnalyze={Boolean(eegData) && !isAnalyzing}
        />

        <main className="flex-1 pt-4">
          <div className="flex h-full flex-col gap-4 xl:flex-row xl:gap-6">
            <section className="flex min-h-[400px] flex-1 flex-col overflow-hidden">
              <TabsPane tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
                <PlotArea activeTab={activeTab} eegData={eegData} analysisResult={analysisResult} />
              </TabsPane>
            </section>
            <Sidebar className="w-full overflow-visible xl:w-72 xl:overflow-y-auto">
              <DatasetPanel
                samples={sampleDatasets}
                onLoadSample={handleLoadSample}
                onUpload={handleUpload}
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                activeDatasetId={selectedDatasetId}
              />
              <BandPanel analysisResult={analysisResult} />
              <FilterPanel />
              <SummaryPanel
                processingTime={analysisResult ? analysisResult.processingTime : null}
                signalQualityLabel={signalQualityLabel}
                fftSampleCount={fftSampleCount}
              />
            </Sidebar>
          </div>
        </main>
      </div>

      <AIDrawer analysisResult={analysisResult} isVisible={isDrawerVisible} onClose={() => setDrawerVisible(false)} />
    </div>
  );
}

export default App;
