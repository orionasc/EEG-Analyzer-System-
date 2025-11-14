import FFT from 'fft.js';
import type { FrequencyBands, SignalAnalysis, SpectrogramData } from '../types';

export interface AnalysisOptions {
  bandpass?: {
    enabled?: boolean;
    lowCut?: number;
    highCut?: number;
  };
  artifactRejection?: {
    enabled?: boolean;
    threshold?: number;
  };
  spectrogram?: {
    enabled?: boolean;
    windowSize?: number;
    overlap?: number;
  };
}

/**
 * Apply a bandpass filter to EEG data
 * @param data - Input signal data
 * @param lowCut - Low cutoff frequency (Hz)
 * @param highCut - High cutoff frequency (Hz)
 * @param samplingRate - Sampling rate (Hz)
 */
export function bandpassFilter(
  data: number[],
  lowCut: number,
  highCut: number,
  samplingRate: number
): number[] {
  if (data.length === 0) {
    return [];
  }

  // fft.js requires the transform size to be a power of two. Pad the signal
  // to the next power of two so we can safely operate on any input length
  // (including the synthetic sample datasets).
  const fftSize = Math.pow(2, Math.ceil(Math.log2(data.length)));
  const fft = new FFT(fftSize);
  const complexData = fft.createComplexArray();

  // Prepare complex data for FFT (real, imaginary pairs)
  for (let i = 0; i < fftSize; i++) {
    complexData[2 * i] = i < data.length ? data[i] : 0;
    complexData[2 * i + 1] = 0;
  }

  const out = fft.createComplexArray();
  fft.transform(out, complexData);

  // Apply bandpass filter in frequency domain. Handle both positive and
  // negative frequencies when zeroing outside the pass band.
  const freqResolution = samplingRate / fftSize;
  const nyquistIndex = fftSize / 2;
  for (let i = 0; i < fftSize; i++) {
    const freqIndex = i <= nyquistIndex ? i : i - fftSize;
    const freq = Math.abs(freqIndex * freqResolution);
    if (freq < lowCut || freq > highCut) {
      out[2 * i] = 0;
      out[2 * i + 1] = 0;
    }
  }

  // Inverse FFT
  const result = fft.createComplexArray();
  fft.inverseTransform(result, out);

  // Extract real part and trim any padded samples
  const filtered = new Array(data.length);
  for (let i = 0; i < data.length; i++) {
    filtered[i] = result[2 * i];
  }

  return filtered;
}

/**
 * Calculate Power Spectral Density using Welch's method
 * @param data - Input signal data
 * @param samplingRate - Sampling rate (Hz)
 */
export function calculatePSD(
  data: number[],
  samplingRate: number
): { frequencies: number[]; powers: number[] } {
  // Use nearest power of 2 for FFT efficiency
  const n = Math.pow(2, Math.floor(Math.log2(data.length)));
  const fft = new FFT(n);

  // Prepare data
  const complexData = new Array(n * 2);
  for (let i = 0; i < n; i++) {
    complexData[2 * i] = i < data.length ? data[i] : 0;
    complexData[2 * i + 1] = 0;
  }

  const out = fft.createComplexArray();
  fft.transform(out, complexData);

  // Calculate power spectrum (magnitude squared)
  const powers: number[] = [];
  const frequencies: number[] = [];
  const freqResolution = samplingRate / n;

  // Only take first half (positive frequencies)
  for (let i = 0; i < n / 2; i++) {
    const real = out[2 * i];
    const imag = out[2 * i + 1];
    const magnitude = Math.sqrt(real * real + imag * imag);
    powers.push((magnitude * magnitude) / n);
    frequencies.push(i * freqResolution);
  }

  return { frequencies, powers };
}

/**
 * Extract power in specific frequency bands
 * @param frequencies - Frequency array from PSD
 * @param powers - Power array from PSD
 */
export function extractFrequencyBands(
  frequencies: number[],
  powers: number[]
): FrequencyBands {
  const bands: FrequencyBands = {
    delta: {
      name: 'Delta',
      range: [0.5, 4],
      power: 0,
      description: 'Deep sleep, unconscious states'
    },
    theta: {
      name: 'Theta',
      range: [4, 8],
      power: 0,
      description: 'Drowsiness, meditation, creativity'
    },
    alpha: {
      name: 'Alpha',
      range: [8, 13],
      power: 0,
      description: 'Relaxed wakefulness, eyes closed'
    },
    beta: {
      name: 'Beta',
      range: [13, 30],
      power: 0,
      description: 'Active thinking, focus, anxiety'
    },
    gamma: {
      name: 'Gamma',
      range: [30, 50],
      power: 0,
      description: 'High-level cognition, perception'
    }
  };

  // Calculate power in each band
  Object.values(bands).forEach(band => {
    let bandPower = 0;
    let count = 0;

    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] >= band.range[0] && frequencies[i] <= band.range[1]) {
        bandPower += powers[i];
        count++;
      }
    }

    band.power = count > 0 ? bandPower / count : 0;
  });

  return bands;
}

/**
 * Detect artifacts in EEG data
 * @param data - Input signal data
 * @param threshold - Threshold multiplier for artifact detection
 */
export function detectArtifacts(data: number[], threshold: number = 3): number[] {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  const artifacts: number[] = [];
  const maxThreshold = mean + threshold * stdDev;
  const minThreshold = mean - threshold * stdDev;

  data.forEach((value, index) => {
    if (value > maxThreshold || value < minThreshold) {
      artifacts.push(index);
    }
  });

  return artifacts;
}

/**
 * Perform complete signal analysis
 * @param data - Input EEG data
 * @param samplingRate - Sampling rate in Hz
 */
export function analyzeSignal(
  data: number[],
  samplingRate: number,
  options: AnalysisOptions = {}
): SignalAnalysis {
  const rawSignal = [...data];

  const bandpassDefaults = {
    enabled: true,
    lowCut: 0.5,
    highCut: 50
  };

  const artifactDefaults = {
    enabled: false,
    threshold: 3
  };

  const spectrogramDefaults = {
    enabled: true,
    windowSize: 256,
    overlap: 0.5
  };

  const bandpass = { ...bandpassDefaults, ...options.bandpass };
  const artifactRejection = { ...artifactDefaults, ...options.artifactRejection };
  const spectrogramConfig = { ...spectrogramDefaults, ...options.spectrogram };

  let workingSignal = [...rawSignal];

  if (bandpass.enabled) {
    workingSignal = bandpassFilter(
      workingSignal,
      bandpass.lowCut ?? bandpassDefaults.lowCut,
      bandpass.highCut ?? bandpassDefaults.highCut,
      samplingRate
    );
  }

  let artifactIndices: number[] = [];
  if (artifactRejection.enabled) {
    artifactIndices = detectArtifacts(workingSignal, artifactRejection.threshold);
    if (artifactIndices.length > 0) {
      const artifactSet = new Set(artifactIndices);
      workingSignal = workingSignal.map((value, index) => (artifactSet.has(index) ? 0 : value));
    }
  }

  const filteredSignal = [...workingSignal];

  const { frequencies, powers } = calculatePSD(filteredSignal, samplingRate);

  const frequencyBands = extractFrequencyBands(frequencies, powers);

  let maxPower = 0;
  let dominantFrequency = 0;
  for (let i = 0; i < frequencies.length; i++) {
    if (powers[i] > maxPower && frequencies[i] >= 0.5 && frequencies[i] <= 50) {
      maxPower = powers[i];
      dominantFrequency = frequencies[i];
    }
  }

  const totalPower = powers.reduce((a, b) => a + b, 0);

  let spectrogram: SpectrogramData | undefined;
  if (spectrogramConfig.enabled) {
    spectrogram = computeSpectrogram(filteredSignal, samplingRate, spectrogramConfig.windowSize, spectrogramConfig.overlap);
  }

  return {
    frequencyBands,
    dominantFrequency,
    totalPower,
    spectralData: { frequencies, powers },
    rawSignal,
    filteredSignal,
    artifactIndices,
    spectrogram
  };
}

export function computeSpectrogram(
  data: number[],
  samplingRate: number,
  windowSize: number = 256,
  overlap: number = 0.5
): SpectrogramData {
  const size = Math.max(32, Math.min(windowSize, data.length));
  const fftSize = Math.pow(2, Math.ceil(Math.log2(size)));
  const hopSize = Math.max(1, Math.floor(fftSize * (1 - overlap)));

  const window: number[] = new Array(fftSize).fill(0).map((_, index) => {
    if (index >= size) return 0;
    // Hamming window
    return 0.54 - 0.46 * Math.cos((2 * Math.PI * index) / (size - 1));
  });

  const fft = new FFT(fftSize);
  const complexBuffer = fft.createComplexArray();
  const out = fft.createComplexArray();

  const frequencies: number[] = [];
  for (let i = 0; i < fftSize / 2; i++) {
    frequencies.push((i * samplingRate) / fftSize);
  }

  const magnitudeColumns: number[][] = [];
  const times: number[] = [];

  for (let start = 0; start + size <= data.length; start += hopSize) {
    for (let i = 0; i < fftSize; i++) {
      const sample = i < size ? data[start + i] * window[i] : 0;
      complexBuffer[2 * i] = sample;
      complexBuffer[2 * i + 1] = 0;
    }

    fft.transform(out, complexBuffer);

    const magnitudes: number[] = [];
    for (let i = 0; i < fftSize / 2; i++) {
      const real = out[2 * i];
      const imag = out[2 * i + 1];
      const magnitude = Math.sqrt(real * real + imag * imag);
      const power = magnitude * magnitude;
      // Convert to decibels with floor to avoid -Infinity
      const db = 10 * Math.log10(power + 1e-12);
      magnitudes.push(db);
    }

    magnitudeColumns.push(magnitudes);
    const midpoint = start + size / 2;
    times.push(midpoint / samplingRate);
  }

  const magnitudes: number[][] = frequencies.map((_, freqIndex) =>
    magnitudeColumns.map((column) => column[freqIndex] ?? -120)
  );

  return {
    times,
    frequencies,
    magnitudes
  };
}

/**
 * Normalize signal data
 * @param data - Input signal data
 */
export function normalizeSignal(data: number[]): number[] {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);

  return data.map(value => (value - mean) / stdDev);
}
