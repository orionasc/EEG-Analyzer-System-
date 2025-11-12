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

export interface SignalAnalysis {
  frequencyBands: FrequencyBands;
  dominantFrequency: number;
  totalPower: number;
  spectralData: {
    frequencies: number[];
    powers: number[];
  };
}

export interface AIInsight {
  summary: string;
  brainState: string;
  sleepStage?: string;
  anomalies: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  signalAnalysis: SignalAnalysis;
  aiInsight?: AIInsight;
  processingTime: number;
}
