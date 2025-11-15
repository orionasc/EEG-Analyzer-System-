import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AIResults, EEGData, FrequencyBands, SignalAnalysis, SpectrogramData } from './types';
import { analyzeSignal } from './utils/signalProcessing';
import { runClaudeAnalysis } from './utils/aiEngine';
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
import { AIAnalysisDashboard } from './components/ai/AIAnalysisDashboard';

type SampleDataset = {
  id: string;
  name: string;
  description: string;
  data: EEGData;
};

type FilterSettings = {
  bandpassEnabled: boolean;
  artifactRejection: boolean;
};

type PipelineState = {
  rawSignal: number[] | null;
  filteredSignal: number[] | null;
  fftResults: { frequencies: number[]; powers: number[] } | null;
  bandpowers: FrequencyBands | null;
  spectrogram: SpectrogramData | null;
  artifactIndices: number[];
};

const initialPipelineState: PipelineState = {
  rawSignal: null,
  filteredSignal: null,
  fftResults: null,
  bandpowers: null,
  spectrogram: null,
  artifactIndices: []
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

const emptyAIResults: AIResults = {
  brainState: '',
  keyFindings: '',
  deepAnalysis: '',
  patterns: '',
  insights: '',
  summaryTable: '',
  rawReport: '',
  targetedAnalysis: '',
  artifactFindings: [],
  cohortComparison: '',
  summaryTableData: null,
  confidence: '',
  description: ''
};

function App() {
  const [activeDataset, setActiveDataset] = useState<EEGData | null>(null);
  const [signalAnalysis, setSignalAnalysis] = useState<SignalAnalysis | null>(null);
  const [pipelineState, setPipelineState] = useState<PipelineState>(initialPipelineState);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('time-series');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [uploadedDatasetLabel, setUploadedDatasetLabel] = useState<string | null>(null);
  const [uploadedDatasetData, setUploadedDatasetData] = useState<EEGData | null>(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    bandpassEnabled: true,
    artifactRejection: false
  });
  const [userTargetQuery, setUserTargetQuery] = useState('');
  const [compareToCohort, setCompareToCohort] = useState(false);
  const [aiResults, setAIResults] = useState<AIResults>({ ...emptyAIResults });
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastAnalysisAt, setLastAnalysisAt] = useState<Date | null>(null);

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

  const computeSignalAnalysis = useCallback(
    (dataset: EEGData) => {
      const start = performance.now();
      const analysis = analyzeSignal(dataset.channels[0].data, dataset.samplingRate, {
        bandpass: { enabled: filterSettings.bandpassEnabled, lowCut: 0.5, highCut: 50 },
        artifactRejection: { enabled: filterSettings.artifactRejection, threshold: 3 },
        spectrogram: { enabled: true }
      });
      const duration = performance.now() - start;

      setSignalAnalysis(analysis);
      setPipelineState({
        rawSignal: analysis.rawSignal,
        filteredSignal: analysis.filteredSignal,
        fftResults: analysis.spectralData,
        bandpowers: analysis.frequencyBands,
        spectrogram: analysis.spectrogram ?? null,
        artifactIndices: analysis.artifactIndices
      });
      setProcessingTime(duration);
      return analysis;
    },
    [filterSettings.bandpassEnabled, filterSettings.artifactRejection]
  );

  useEffect(() => {
    if (!activeDataset) {
      setSignalAnalysis(null);
      setPipelineState(initialPipelineState);
      setProcessingTime(null);
      setAIResults({ ...emptyAIResults });
      setAnalysisComplete(false);
      setLastAnalysisAt(null);
      return;
    }

    computeSignalAnalysis(activeDataset);
    setAnalysisComplete(false);
    setAIResults({ ...emptyAIResults });
    setDrawerVisible(false);
    setLastAnalysisAt(null);
  }, [activeDataset, computeSignalAnalysis]);

  useEffect(() => {
    console.log('AI RESULTS:', aiResults);
  }, [aiResults]);

  const handleAnalyze = async () => {
    if (!activeDataset) return;

    setIsAnalyzing(true);
    setAiLoading(true);
    setAnalysisComplete(false);
    setAIResults({ ...emptyAIResults });
    setDrawerVisible(true);
    setLastAnalysisAt(null);

    if (!apiKey) {
      setNotification('No Anthropic API key detected. Enter a key in the sidebar to unlock live Claude analysis. Running in simulated mode.');
    } else {
      setNotification(null);
    }

    try {
      const analysis = computeSignalAnalysis(activeDataset);
      const signalQuality = determineSignalQuality(analysis.totalPower);
      const aiResultsResponse = await runClaudeAnalysis({
        rawData: analysis.rawSignal,
        filteredData: analysis.filteredSignal,
        fftResults: analysis.spectralData,
        bandPowers: analysis.frequencyBands,
        samplingRate: activeDataset.samplingRate,
        duration: activeDataset.duration,
        numChannels: activeDataset.channels.length,
        userTargetQuery,
        apiKey,
        compareToCohort,
        channelNames: activeDataset.channels.map((channel) => channel.name),
        channelData: activeDataset.channels.map((channel) => channel.data),
        artifactIndices: analysis.artifactIndices,
        signalQualityEstimate: signalQuality
      });

      setAIResults(aiResultsResponse);
      setAnalysisComplete(true);
      setLastAnalysisAt(new Date());
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAiLoading(false);
    }
  };

  const applyDataset = useCallback((dataset: EEGData, id: string) => {
    setActiveDataset(dataset);
    setSelectedDatasetId(id);
    setDrawerVisible(false);
    setAIResults({ ...emptyAIResults });
    setAnalysisComplete(false);
    setLastAnalysisAt(null);
  }, []);

  const handleLoadSample = (sample: SampleDataset) => {
    applyDataset(sample.data, sample.id);
  };

  const handleUpload = (data: EEGData, label: string) => {
    setUploadedDatasetData(data);
    setUploadedDatasetLabel(label);
    applyDataset(data, 'uploaded');
  };

  const handleDatasetChange = (id: string) => {
    if (!id) {
      setSelectedDatasetId(null);
      setActiveDataset(null);
      setDrawerVisible(false);
      setAIResults({ ...emptyAIResults });
      setAnalysisComplete(false);
      setLastAnalysisAt(null);
      return;
    }

    if (id.startsWith('sample-')) {
      const sample = sampleDatasets.find((item) => item.id === id);
      if (sample) {
        applyDataset(sample.data, id);
      }
      return;
    }

    if (id === 'uploaded' && uploadedDatasetData) {
      applyDataset(uploadedDatasetData, id);
    }
  };

  const handleFilterSettingsChange = useCallback(
    (settings: { bandpassEnabled: boolean; artifactRejectionEnabled: boolean }) => {
      setFilterSettings((previous) => {
        const next = {
          bandpassEnabled: settings.bandpassEnabled,
          artifactRejection: settings.artifactRejectionEnabled
        };

        const changed =
          previous.bandpassEnabled !== next.bandpassEnabled ||
          previous.artifactRejection !== next.artifactRejection;

        if (changed) {
          setDrawerVisible(false);
          setAIResults({ ...emptyAIResults });
          setAnalysisComplete(false);
          return next;
        }

        return previous;
      });
    },
    []
  );

  const samplingRate = activeDataset ? activeDataset.samplingRate : null;
  const channelCount = activeDataset ? activeDataset.channels.length : null;
  const signalQualityLabel = signalAnalysis ? determineSignalQuality(signalAnalysis.totalPower) : null;
  const fftSampleCount = pipelineState.fftResults ? pipelineState.fftResults.frequencies.length : null;
  const datasetDuration = activeDataset ? activeDataset.duration : null;
  const isDrawerOpen = Boolean(isDrawerVisible);
  const canAnalyze = Boolean(activeDataset);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1117] to-[#1a1f25] text-slate-200">
      <div
        className={`mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-6 py-8 transition-transform duration-300 ease-out lg:px-12 ${
          isDrawerOpen ? 'scale-[0.99]' : 'scale-100'
        }`}
      >
        {notification && (
          <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 shadow-[0_1px_8px_rgba(255,193,7,0.2)]">
            {notification}
          </div>
        )}
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
          canAnalyze={canAnalyze}
        />

        <main className="flex flex-1 flex-col">
          <div className="flex h-full flex-col gap-6 xl:flex-row">
            <section className="flex min-h-[420px] flex-1 flex-col">
              <TabsPane tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
                <PlotArea activeTab={activeTab} eegData={activeDataset} signalAnalysis={signalAnalysis} />
              </TabsPane>
            </section>
            <Sidebar className="w-full xl:w-80">
              <DatasetPanel
                samples={sampleDatasets}
                onLoadSample={handleLoadSample}
                onUpload={handleUpload}
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                activeDatasetId={selectedDatasetId}
                userTargetQuery={userTargetQuery}
                onUserTargetQueryChange={setUserTargetQuery}
                compareToCohort={compareToCohort}
                onCompareToCohortChange={setCompareToCohort}
              />
              <BandPanel
                frequencyBands={pipelineState.bandpowers}
                dominantFrequency={signalAnalysis?.dominantFrequency ?? null}
              />
              <FilterPanel
                bandpassEnabled={filterSettings.bandpassEnabled}
                artifactRejectionEnabled={filterSettings.artifactRejection}
                onChange={handleFilterSettingsChange}
              />
              <SummaryPanel
                processingTime={processingTime}
                signalQualityLabel={signalQualityLabel}
                fftSampleCount={fftSampleCount}
              />
            </Sidebar>
          </div>
          <section className="mt-6">
            <AIAnalysisDashboard
              aiResults={aiResults}
              isAnalyzing={aiLoading}
              analysisComplete={analysisComplete}
              signalQuality={signalQualityLabel}
              bandpowers={pipelineState.bandpowers ?? null}
              lastAnalyzedAt={lastAnalysisAt}
              compareToCohort={compareToCohort}
            />
          </section>
        </main>
      </div>

      <AIDrawer
        aiResults={aiResults}
        isOpen={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        aiLoading={aiLoading}
        analysisComplete={analysisComplete}
      />
    </div>
  );
}

export default App;
