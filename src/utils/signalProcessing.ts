import FFT from 'fft.js';
import type { FrequencyBands, SignalAnalysis } from '../types';

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
  // Simple implementation using frequency domain filtering
  const fft = new FFT(data.length);
  const complexData = new Array(data.length * 2);

  // Prepare complex data for FFT (real, imaginary pairs)
  for (let i = 0; i < data.length; i++) {
    complexData[2 * i] = data[i];
    complexData[2 * i + 1] = 0;
  }

  const out = fft.createComplexArray();
  fft.transform(out, complexData);

  // Apply bandpass filter in frequency domain
  const freqResolution = samplingRate / data.length;
  for (let i = 0; i < data.length; i++) {
    const freq = i * freqResolution;
    if (freq < lowCut || freq > highCut) {
      out[2 * i] = 0;
      out[2 * i + 1] = 0;
    }
  }

  // Inverse FFT
  const result = fft.createComplexArray();
  fft.inverseTransform(result, out);

  // Extract real part
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
  samplingRate: number
): SignalAnalysis {
  // Filter the signal
  const filtered = bandpassFilter(data, 0.5, 50, samplingRate);

  // Calculate PSD
  const { frequencies, powers } = calculatePSD(filtered, samplingRate);

  // Extract frequency bands
  const frequencyBands = extractFrequencyBands(frequencies, powers);

  // Find dominant frequency
  let maxPower = 0;
  let dominantFrequency = 0;
  for (let i = 0; i < frequencies.length; i++) {
    if (powers[i] > maxPower && frequencies[i] >= 0.5 && frequencies[i] <= 50) {
      maxPower = powers[i];
      dominantFrequency = frequencies[i];
    }
  }

  // Calculate total power
  const totalPower = powers.reduce((a, b) => a + b, 0);

  return {
    frequencyBands,
    dominantFrequency,
    totalPower,
    spectralData: { frequencies, powers }
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
