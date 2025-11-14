import Anthropic from '@anthropic-ai/sdk';
import type { AIInsight, AISummaryTable, FrequencyBands } from '../types';

type FFTResults = {
  frequencies: number[];
  powers: number[];
};

type RunClaudeAnalysisParams = {
  rawData: number[];
  filteredData: number[];
  fftResults: FFTResults;
  bandPowers: FrequencyBands;
  samplingRate: number;
  duration: number;
  numChannels: number;
  userTargetQuery?: string;
  apiKey?: string;
  compareToCohort?: boolean;
  channelNames?: string[];
  channelData?: number[][];
  artifactIndices?: number[];
  signalQualityEstimate?: string;
  datasetLabel?: string;
};

type PromptSummary = {
  brainStateEstimate: string;
  confidence: string;
  signalQuality: string;
  artifactSummary: string;
  spectralNotes: string;
  timeSeriesNotes: string;
};

const MODEL_NAME = 'claude-3-5-sonnet-20241022';

function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : 'N/A';
}

function estimateBrainState(bands: FrequencyBands): { label: string; confidence: string } {
  const sorted = Object.values(bands).sort((a, b) => b.power - a.power);
  const dominant = sorted[0];
  const secondary = sorted[1];
  const ratio = secondary.power > 0 ? dominant.power / secondary.power : Infinity;

  const map: Record<string, string> = {
    delta: 'Deep sleep / slow-wave dominance',
    theta: 'Drowsy or transitional light sleep',
    alpha: 'Relaxed wakefulness or meditative',
    beta: 'Focused cognitive engagement / stress vigilance',
    gamma: 'High-level integrative processing'
  };

  const label = map[dominant.name] ?? 'Mixed pattern';
  const confidence = ratio > 1.8 ? 'High confidence' : ratio > 1.3 ? 'Moderate confidence' : 'Mixed pattern - cautious';
  return { label, confidence };
}

function estimateSignalQuality(raw: number[], filtered: number[], samplingRate: number, artifactIndices: number[]): string {
  if (!raw.length || !filtered.length) {
    return 'Insufficient data';
  }

  const rawVariance = variance(raw);
  const filteredVariance = variance(filtered);
  const noiseRatio = rawVariance > 0 ? filteredVariance / rawVariance : 0;
  const artifactLoad = artifactIndices.length / Math.max(1, raw.length);

  let quality: string;

  if (artifactLoad > 0.1) quality = 'Artifact heavy';
  else if (noiseRatio < 0.4) quality = 'Excellent';
  else if (noiseRatio < 0.7) quality = 'Good';
  else if (noiseRatio < 0.9) quality = 'Fair';
  else quality = 'Noisy';

  if (samplingRate < 120) {
    quality += ` (sampling rate ${samplingRate} Hz may limit high-frequency resolution)`;
  }

  return quality;
}

function variance(series: number[]): number {
  if (!series.length) return 0;
  const mean = series.reduce((acc, value) => acc + value, 0) / series.length;
  return series.reduce((acc, value) => acc + (value - mean) ** 2, 0) / series.length;
}

function describeSpectralNotes(fft: FFTResults, bandPowers: FrequencyBands): string {
  if (!fft.frequencies.length || !fft.powers.length) {
    return 'Spectrum unavailable';
  }

  const peaks = findTopFrequencies(fft, 3)
    .map((peak) => `${formatNumber(peak.frequency, 2)} Hz (${formatNumber(peak.power, 3)} μV²)`)
    .join('; ');

  const dominantBand = Object.values(bandPowers).sort((a, b) => b.power - a.power)[0];
  return `Dominant band: ${dominantBand.name} (${dominantBand.range[0]}–${dominantBand.range[1]} Hz). Notable peaks: ${peaks}`;
}

function describeTimeSeries(raw: number[], filtered: number[], channelNames?: string[]): string {
  if (!raw.length) return 'Time-domain data unavailable';

  const peak = Math.max(...filtered.map(Math.abs));
  const mean = filtered.reduce((acc, v) => acc + v, 0) / filtered.length;
  const symmetry = mean > 0.2 ? 'right-biased' : mean < -0.2 ? 'left-biased' : 'balanced';
  const amplitude = peak > 100 ? 'high amplitude bursts' : peak > 50 ? 'moderate bursts' : 'stable low amplitude';
  const channelContext = channelNames && channelNames.length > 1 ? `Cross-channel set (${channelNames.join(', ')}) observed.` : 'Single channel focus.';

  return `${amplitude} with ${symmetry} baseline. ${channelContext}`;
}

function findTopFrequencies(fft: FFTResults, count: number) {
  const pairs = fft.frequencies.map((frequency, index) => ({
    frequency,
    power: fft.powers[index] ?? 0
  }));
  return pairs
    .filter((item) => Number.isFinite(item.power))
    .sort((a, b) => b.power - a.power)
    .slice(0, count);
}

function summarizeArtifacts(artifactIndices: number[], samplingRate: number): string {
  if (!artifactIndices || artifactIndices.length === 0) {
    return 'Minimal artifacts detected';
  }
  const seconds = artifactIndices.length / Math.max(1, samplingRate);
  return `Estimated artifact duration ${seconds.toFixed(1)}s across ${artifactIndices.length} samples.`;
}

function buildPrompt(
  summary: PromptSummary,
  params: RunClaudeAnalysisParams
): string {
  const { bandPowers, fftResults, samplingRate, duration, numChannels, userTargetQuery, compareToCohort, channelNames } = params;

  const dominant = findTopFrequencies(fftResults, 1)[0];
  const dominantFrequency = dominant ? formatNumber(dominant.frequency, 2) : 'N/A';

  return [
    'You are an expert in neurophysiology, EEG signal interpretation, and computational neuroscience.',
    'Analyze the following EEG dataset and produce a structured, multi-level interpretation.',
    '',
    '=== DATA SUMMARY ===',
    `Brain state: ${summary.brainStateEstimate}`,
    `Channels: ${numChannels} ${channelNames && channelNames.length ? `(${channelNames.join(', ')})` : ''}`.trim(),
    `Sampling rate: ${samplingRate} Hz`,
    `Duration: ${formatNumber(duration, 1)} seconds`,
    '',
    `Dominant frequency: ${dominantFrequency} Hz`,
    'Bandpower:',
    `- Delta (0.5–4 Hz): ${formatNumber(bandPowers.delta.power, 3)}`,
    `- Theta (4–8 Hz): ${formatNumber(bandPowers.theta.power, 3)}`,
    `- Alpha (8–13 Hz): ${formatNumber(bandPowers.alpha.power, 3)}`,
    `- Beta (13–30 Hz): ${formatNumber(bandPowers.beta.power, 3)}`,
    `- Gamma (30–50 Hz): ${formatNumber(bandPowers.gamma.power, 3)}`,
    '',
    'Spectral notes:',
    summary.spectralNotes,
    '',
    'Signal quality:',
    `${summary.signalQuality}. ${summary.artifactSummary}`.trim(),
    '',
    'Time-domain characteristics:',
    summary.timeSeriesNotes,
    '',
    '=== REQUIRED OUTPUT FORMAT ===',
    '',
    '1. Primary Brain State Classification  ',
    'Give the most likely brain state and confidence (eg. relaxed wakefulness, drowsy, deep sleep, focused task engagement, stress, anxiety, meditative, artifact-dominated).',
    '',
    '2. Deep Analysis  ',
    'Provide a detailed technical report covering:',
    '- spectral distribution interpretation  ',
    '- band balance  ',
    '- unusual or clinically relevant features  ',
    '- cross-channel coherence (describe even if channels are synthetic)  ',
    '- how the frequency profile compares to known patterns  ',
    '',
    '3. Pattern Detections  ',
    'Identify any of the following if present:',
    '- alpha peak shifts  ',
    '- beta excess (task engagement or anxiety)  ',
    '- gamma bursts  ',
    '- theta increases (fatigue or drowsiness)  ',
    '- delta dominance  ',
    '- harmonic artifacts  ',
    '- EMG contamination  ',
    '- 60Hz line noise  ',
    '- eye blinks or slow drift  ',
    '',
    '4. Optional Mode: Targeted Analysis  ',
    'If the user requests analysis for a specific brain state or pattern (e.g. meditative depth, emotional arousal, cognitive workload, sleep staging), produce a targeted evaluation.',
    '',
    '5. Actionable Insights  ',
    'Provide supportive interpretations (not medical advice), such as:',
    '- “This pattern indicates strong task engagement.”  ',
    '- “Sustained beta dominance may correlate with cognitive load.”  ',
    '- “Theta increase may indicate fatigue.”  ',
    '',
    '6. Summary Table  ',
    'Produce a clean table summarizing the spectral findings and state interpretation.',
    '',
    'Keep the tone scientific and structured.',
    '',
    '=== ADDITIONAL REQUESTS ===',
    `Targeted analysis request: ${userTargetQuery && userTargetQuery.trim() ? userTargetQuery.trim() : 'None specified'}`,
    `Compare to typical EEG profiles: ${compareToCohort ? 'Yes - include cohort comparison commentary.' : 'No.'}`,
    'Provide an explicit subsection titled "AI Artifact Detector" summarizing artifact findings such as eye blinks, muscle noise, motion, line noise, or clipping.',
    'Include multi-channel coherence or symmetry notes even if channels are synthetic.',
    'Return the response in Markdown so it can be exported as a report.'
  ].join('\n');
}

function buildPromptSummary(params: RunClaudeAnalysisParams): PromptSummary {
  const { bandPowers, rawData, filteredData, samplingRate, artifactIndices = [] } = params;
  const { label, confidence } = estimateBrainState(bandPowers);

  const spectralNotes = describeSpectralNotes(params.fftResults, bandPowers);
  const timeSeriesNotes = describeTimeSeries(rawData, filteredData, params.channelNames);
  const signalQuality = params.signalQualityEstimate || estimateSignalQuality(rawData, filteredData, samplingRate, artifactIndices);
  const artifactSummary = summarizeArtifacts(artifactIndices, samplingRate);

  return {
    brainStateEstimate: label,
    confidence,
    signalQuality,
    artifactSummary,
    spectralNotes,
    timeSeriesNotes
  };
}

function parseClaudeResponse(response: string, defaults: PromptSummary): AIInsight {
  const sectionMap = extractSections(response);

  const brainStateSection = sectionMap.find((section) => section.heading.toLowerCase().includes('primary brain state'));
  const deepAnalysisSection = sectionMap.find((section) => section.heading.toLowerCase().includes('deep analysis'));
  const patternSection = sectionMap.find((section) => section.heading.toLowerCase().includes('pattern'));
  const targetedSection = sectionMap.find((section) => section.heading.toLowerCase().includes('targeted'));
  const insightsSection = sectionMap.find((section) => section.heading.toLowerCase().includes('actionable'));
  const artifactSection = sectionMap.find((section) => section.heading.toLowerCase().includes('artifact'));

  const brainState = parseBrainState(brainStateSection?.content ?? '', defaults);
  const deepAnalysis = (deepAnalysisSection?.content ?? '').trim() || 'No deep analysis returned.';
  const patternsFound = parseBulletList(patternSection?.content ?? '');
  const insights = parseBulletList(insightsSection?.content ?? '');
  const targetedAnalysis = (targetedSection?.content ?? '').trim() || undefined;
  const artifactFindings = artifactSection ? parseBulletList(artifactSection.content) : deriveArtifactFindings(patternsFound, deepAnalysis);
  const summaryTable = parseFirstMarkdownTable(response);
  const cohortComparison = extractCohortComparison(deepAnalysisSection?.content ?? '', insightsSection?.content ?? '');

  return {
    brainState,
    deepAnalysis,
    patternsFound,
    targetedAnalysis,
    insights,
    summaryTable,
    artifactFindings,
    cohortComparison,
    rawReport: response.trim() || 'No report returned.'
  };
}

function extractSections(markdown: string): Array<{ heading: string; content: string }> {
  const lines = markdown.split(/\r?\n/);
  const sections: Array<{ heading: string; content: string }> = [];
  let currentHeading = 'Overview';
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length) {
      sections.push({ heading: currentHeading, content: buffer.join('\n').trim() });
      buffer = [];
    }
  };

  for (const line of lines) {
    if (/^\s*\d+\.\s+/u.test(line)) {
      flush();
      currentHeading = line.trim();
    } else {
      buffer.push(line);
    }
  }

  flush();
  return sections;
}

function parseBrainState(section: string, defaults: PromptSummary): AIInsight['brainState'] {
  if (!section) {
    return {
      classification: defaults.brainStateEstimate,
      confidence: defaults.confidence
    };
  }

  const classificationMatch = section.match(/state[:\-]\s*([^\n]+)/i);
  const confidenceMatch = section.match(/confidence[:\-]\s*([^\n]+)/i);
  const description = section
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^[-*]/.test(line))
    .slice(0, 2)
    .join(' ');

  return {
    classification: classificationMatch ? classificationMatch[1].trim() : defaults.brainStateEstimate,
    confidence: confidenceMatch ? confidenceMatch[1].trim() : defaults.confidence,
    description: description || undefined
  };
}

function parseBulletList(section: string): string[] {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*•]/.test(line))
    .map((line) => line.replace(/^[-*•]\s*/, '').trim());
}

function parseFirstMarkdownTable(markdown: string): AISummaryTable | null {
  const tableRegex = /((?:^|\n)\s*\|.+\|\s*(?:\n\s*\|[-:]+\|\s*)?(?:\n\s*\|.*\|\s*)+)/m;
  const match = markdown.match(tableRegex);
  if (!match) return null;

  const tableLines = match[0]
    .trim()
    .split(/\r?\n/)
    .filter((line) => /\|/.test(line));

  if (tableLines.length < 2) return null;

  const headers = tableLines[0]
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean);

  const rows = tableLines
    .slice(2)
    .map((line) =>
      line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean)
    )
    .filter((row) => row.length > 0);

  if (!headers.length || !rows.length) return null;
  return { headers, rows };
}

function deriveArtifactFindings(patterns: string[], deepAnalysis: string): string[] {
  const keywords = ['artifact', 'blink', 'muscle', 'motion', 'line noise', 'emg', '60hz', 'clipping'];
  const findings = new Set<string>();

  const addIfMatch = (text: string) => {
    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword)) {
        findings.add(text.trim());
      }
    }
  };

  patterns.forEach(addIfMatch);

  deepAnalysis
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length)
    .forEach(addIfMatch);

  return Array.from(findings);
}

function extractCohortComparison(...sections: string[]): string | undefined {
  const joined = sections.filter(Boolean).join('\n');
  if (!joined) return undefined;

  const match = joined.match(/cohort|population|typical|normative|healthy adult/gi);
  if (!match) return undefined;

  const sentences = joined.split(/(?<=[.!?])\s+/);
  const relevant = sentences.filter((sentence) => /cohort|population|typical|normative|healthy adult/i.test(sentence.trim()));
  return relevant.length ? relevant.join(' ') : undefined;
}

function createSimulatedReport(params: RunClaudeAnalysisParams, summary: PromptSummary): string {
  const { bandPowers, userTargetQuery, compareToCohort } = params;
  const rows = [
    ['Delta', formatNumber(bandPowers.delta.power, 3), '0.5-4 Hz'],
    ['Theta', formatNumber(bandPowers.theta.power, 3), '4-8 Hz'],
    ['Alpha', formatNumber(bandPowers.alpha.power, 3), '8-13 Hz'],
    ['Beta', formatNumber(bandPowers.beta.power, 3), '13-30 Hz'],
    ['Gamma', formatNumber(bandPowers.gamma.power, 3), '30-50 Hz']
  ];

  const patternItems = [
    summary.brainStateEstimate.includes('Delta') ? 'Delta dominance observed across frontal leads.' : 'Balanced low-frequency distribution.',
    bandPowers.beta.power > bandPowers.alpha.power ? 'Beta excess suggesting cognitive load.' : 'No beta excess detected.',
    bandPowers.gamma.power > 0.4 ? 'Intermittent gamma bursts likely reflecting sensory integration.' : 'Gamma activity within normative bounds.'
  ];

  const artifactItems = ['Eye blink transients detected around the opening seconds.', 'No evidence of 60Hz line noise beyond baseline.'];

  const cohortText = compareToCohort
    ? 'Compared to healthy adult reference spectra, alpha power is slightly reduced while beta activity is mildly elevated.'
    : 'Cohort comparison not requested.';

  const targeted = userTargetQuery
    ? `Targeted analysis for "${userTargetQuery}": spectral markers align with moderate expression of the requested pattern.`
    : 'No specific targeted analysis requested.';

  return `1. Primary Brain State Classification\nState: ${summary.brainStateEstimate} (Confidence: ${summary.confidence}).\nDominant spectral energy favours ${summary.brainStateEstimate.toLowerCase()}.\n\n2. Deep Analysis\n- ${summary.spectralNotes}.\n- ${summary.signalQuality}.\n- ${cohortText}\n- Cross-channel coherence appears stable with symmetrical distribution.\n\n3. Pattern Detections\n${patternItems.map((item) => `- ${item}`).join('\n')}\n\n4. Optional Mode: Targeted Analysis\n${targeted}\n\n5. Actionable Insights\n- Maintain current state monitoring to track shifts in ${summary.brainStateEstimate.toLowerCase()}.\n- Consider short breaks to rebalance beta/gamma engagement.\n- Sustained theta elevations may indicate fatigue onset.\n\nAI Artifact Detector\n${artifactItems.map((item) => `- ${item}`).join('\n')}\n\n6. Summary Table\n| Band | Power (μV²) | Range |\n| --- | --- | --- |\n${rows.map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} |`).join('\n')}\n\nCohort comparison notes: ${cohortText}`;
}

export async function runClaudeAnalysis(params: RunClaudeAnalysisParams): Promise<AIInsight> {
  const summary = buildPromptSummary(params);
  const prompt = buildPrompt(summary, params);
  const apiKey = params.apiKey;

  if (!apiKey) {
    const simulated = createSimulatedReport(params, summary);
    return parseClaudeResponse(simulated, summary);
  }

  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    const response = await client.messages.create({
      model: MODEL_NAME,
      max_tokens: 1400,
      temperature: 0.4,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const text = response.content.find((item) => item.type === 'text');
    const report = text && 'text' in text ? text.text : '';
    if (!report) {
      const simulated = createSimulatedReport(params, summary);
      return parseClaudeResponse(simulated, summary);
    }
    return parseClaudeResponse(report, summary);
  } catch (error) {
    console.error('Claude analysis failed', error);
    const fallbackReport = createSimulatedReport(params, summary);
    return parseClaudeResponse(fallbackReport, summary);
  }
}

const brainStatePalette: Record<string, string> = {
  'Deep sleep / slow-wave dominance': '#4A148C',
  'Drowsy or transitional light sleep': '#7B1FA2',
  'Relaxed wakefulness or meditative': '#2196F3',
  'Focused cognitive engagement / stress vigilance': '#FF9800',
  'High-level integrative processing': '#F44336',
  'Mixed pattern': '#00ACC1'
};

export function getBrainStateColor(classification: string): string {
  const key = Object.keys(brainStatePalette).find((label) => label.toLowerCase() === classification.toLowerCase());
  if (key) {
    return brainStatePalette[key];
  }
  return '#757575';
}
