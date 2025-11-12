import type { EEGData, EEGChannel } from '../types';

/**
 * Generate synthetic EEG data with realistic characteristics
 * @param duration - Duration in seconds
 * @param samplingRate - Sampling rate in Hz
 * @param brainState - Type of brain state to simulate
 */
export function generateEEGData(
  duration: number = 10,
  samplingRate: number = 256,
  brainState: 'awake' | 'drowsy' | 'asleep' | 'focused' = 'awake'
): EEGData {
  const numSamples = duration * samplingRate;
  const channelNames = ['Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2'];

  // Define brain state characteristics
  const stateParams = {
    awake: {
      alpha: 1.5,
      beta: 1.0,
      theta: 0.3,
      delta: 0.2,
      gamma: 0.4
    },
    drowsy: {
      alpha: 2.0,
      beta: 0.5,
      theta: 1.5,
      delta: 0.8,
      gamma: 0.2
    },
    asleep: {
      alpha: 0.3,
      beta: 0.2,
      theta: 1.0,
      delta: 3.0,
      gamma: 0.1
    },
    focused: {
      alpha: 0.5,
      beta: 2.5,
      theta: 0.2,
      delta: 0.1,
      gamma: 1.5
    }
  };

  const params = stateParams[brainState];

  const channels: EEGChannel[] = channelNames.map(name => {
    const data = generateChannelData(numSamples, samplingRate, params);
    return {
      name,
      data,
      samplingRate
    };
  });

  return {
    channels,
    duration,
    samplingRate,
    timestamp: new Date()
  };
}

/**
 * Generate data for a single EEG channel
 */
function generateChannelData(
  numSamples: number,
  samplingRate: number,
  params: {
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
    gamma: number;
  }
): number[] {
  const data: number[] = [];
  const dt = 1 / samplingRate;

  for (let i = 0; i < numSamples; i++) {
    const t = i * dt;

    // Generate signal as sum of sinusoids with different frequencies
    let value = 0;

    // Delta (0.5-4 Hz)
    value += params.delta * Math.sin(2 * Math.PI * 2 * t + Math.random() * 0.5);

    // Theta (4-8 Hz)
    value += params.theta * Math.sin(2 * Math.PI * 6 * t + Math.random() * 0.5);

    // Alpha (8-13 Hz)
    value += params.alpha * Math.sin(2 * Math.PI * 10 * t + Math.random() * 0.5);

    // Beta (13-30 Hz)
    value += params.beta * Math.sin(2 * Math.PI * 20 * t + Math.random() * 0.5);

    // Gamma (30-50 Hz)
    value += params.gamma * Math.sin(2 * Math.PI * 40 * t + Math.random() * 0.5);

    // Add some random noise
    value += (Math.random() - 0.5) * 0.5;

    // Occasionally add artifacts (blinks, movements)
    if (Math.random() < 0.001) {
      value += (Math.random() - 0.5) * 10;
    }

    data.push(value);
  }

  return data;
}

/**
 * Parse CSV EEG data
 * @param csvText - CSV file content
 */
export function parseCSVData(csvText: string): EEGData | null {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return null;

    const headers = lines[0].split(',').map(h => h.trim());
    const channelNames = headers.slice(1); // Skip time column

    const channels: EEGChannel[] = channelNames.map(name => ({
      name,
      data: [],
      samplingRate: 256 // Default, should be specified in file metadata
    }));

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => parseFloat(v.trim()));
      if (values.length !== headers.length) continue;

      for (let j = 0; j < channelNames.length; j++) {
        channels[j].data.push(values[j + 1]);
      }
    }

    const duration = channels[0].data.length / 256;

    return {
      channels,
      duration,
      samplingRate: 256,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return null;
  }
}

/**
 * Validate EEG data
 */
export function validateEEGData(data: EEGData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.channels || data.channels.length === 0) {
    errors.push('No channels found in data');
  }

  if (data.samplingRate < 100 || data.samplingRate > 2000) {
    errors.push('Invalid sampling rate (expected 100-2000 Hz)');
  }

  data.channels.forEach((channel, index) => {
    if (!channel.data || channel.data.length === 0) {
      errors.push(`Channel ${index} has no data`);
    }

    if (channel.data.length !== data.channels[0].data.length) {
      errors.push(`Channel ${index} has different length than channel 0`);
    }

    // Check for invalid values
    const hasInvalid = channel.data.some(v => !isFinite(v));
    if (hasInvalid) {
      errors.push(`Channel ${index} contains invalid values`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate sample datasets for different brain states
 */
export function getSampleDatasets(): Array<{
  name: string;
  description: string;
  data: EEGData;
}> {
  return [
    {
      name: 'Relaxed Wakefulness',
      description: 'Subject at rest with eyes closed, showing strong alpha waves',
      data: generateEEGData(10, 256, 'awake')
    },
    {
      name: 'Focused Concentration',
      description: 'Subject performing mental arithmetic, showing high beta and gamma activity',
      data: generateEEGData(10, 256, 'focused')
    },
    {
      name: 'Drowsy State',
      description: 'Subject transitioning to sleep, showing increased theta waves',
      data: generateEEGData(10, 256, 'drowsy')
    },
    {
      name: 'Deep Sleep',
      description: 'Subject in deep sleep stage, dominated by slow delta waves',
      data: generateEEGData(10, 256, 'asleep')
    }
  ];
}
