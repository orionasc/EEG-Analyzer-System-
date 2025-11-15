export interface EEGChannel {
  name: string;
  data: number[];
  samplingRate: number;
}

export interface EEGData {
  channels: EEGChannel[];
  duration: number;
  samplingRate: number;
  timestamp: Date;
}

export interface FrequencyBand {
  name: string;
  range: [number, number];
  power: number;
  description: string;
}

export interface FrequencyBands {
  delta: FrequencyBand;
  theta: FrequencyBand;
  alpha: FrequencyBand;
  beta: FrequencyBand;
  gamma: FrequencyBand;
}

export interface SpectrogramData {
  times: number[];
  frequencies: number[];
  magnitudes: number[][];
}

export interface SignalAnalysis {
  frequencyBands: FrequencyBands;
  dominantFrequency: number;
  totalPower: number;
  spectralData: {
    frequencies: number[];
    powers: number[];
  };
  rawSignal: number[];
  filteredSignal: number[];
  artifactIndices: number[];
  spectrogram?: SpectrogramData;
}

export interface AISummaryTable {
  headers: string[];
  rows: string[][];
}

export interface AIResults {
  brainState: string;
  keyFindings: string;
  deepAnalysis: string;
  patterns: string;
  insights: string;
  summaryTable: string;
  rawReport?: string;
  targetedAnalysis?: string;
  artifactFindings?: string[];
  cohortComparison?: string;
  summaryTableData?: AISummaryTable | null;
  confidence?: string;
  description?: string;
}

export interface AIInsight {
  brainState: {
    classification: string;
    confidence?: string;
    description?: string;
  };
  deepAnalysis: string;
  patternsFound: string[];
  targetedAnalysis?: string;
  insights: string[];
  summaryTable: AISummaryTable | null;
  artifactFindings: string[];
  cohortComparison?: string;
  rawReport: string;
}

export interface AnalysisResult {
  signalAnalysis: SignalAnalysis;
  aiInsight?: AIInsight;
  processingTime: number;
}
