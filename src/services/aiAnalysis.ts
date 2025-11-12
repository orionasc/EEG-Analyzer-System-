import Anthropic from '@anthropic-ai/sdk';
import type { SignalAnalysis, AIInsight } from '../types';

/**
 * Analyze EEG signal data using Claude AI
 * @param signalAnalysis - Signal analysis results
 * @param apiKey - Anthropic API key
 */
export async function analyzeWithAI(
  signalAnalysis: SignalAnalysis,
  apiKey: string
): Promise<AIInsight> {
  if (!apiKey) {
    return getMockAIInsight(signalAnalysis);
  }

  try {
    const client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through a backend
    });

    const prompt = buildAnalysisPrompt(signalAnalysis);

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    return parseAIResponse(responseText);
  } catch (error) {
    console.error('AI Analysis error:', error);
    return getMockAIInsight(signalAnalysis);
  }
}

/**
 * Build prompt for AI analysis
 */
function buildAnalysisPrompt(analysis: SignalAnalysis): string {
  const { frequencyBands, dominantFrequency, totalPower } = analysis;

  return `You are an expert neuroscientist analyzing EEG (electroencephalography) brain signals. Please analyze the following EEG data and provide insights.

EEG Signal Analysis Results:
- Dominant Frequency: ${dominantFrequency.toFixed(2)} Hz
- Total Power: ${totalPower.toFixed(2)}

Frequency Band Powers:
- Delta (0.5-4 Hz - Deep sleep): ${frequencyBands.delta.power.toFixed(4)}
- Theta (4-8 Hz - Drowsiness): ${frequencyBands.theta.power.toFixed(4)}
- Alpha (8-13 Hz - Relaxed): ${frequencyBands.alpha.power.toFixed(4)}
- Beta (13-30 Hz - Active): ${frequencyBands.beta.power.toFixed(4)}
- Gamma (30-50 Hz - Cognition): ${frequencyBands.gamma.power.toFixed(4)}

Please provide:
1. A brief summary (2-3 sentences) of what this brain activity pattern indicates
2. The most likely brain state (e.g., "Relaxed Wakefulness", "Active Concentration", "Drowsy", "Light Sleep", "Deep Sleep")
3. If applicable, identify the sleep stage (N1, N2, N3, or REM)
4. Any notable anomalies or patterns that stand out
5. Brief recommendations for the subject based on this brain activity

Format your response as JSON with the following structure:
{
  "summary": "...",
  "brainState": "...",
  "sleepStage": "..." (or null if not applicable),
  "anomalies": ["...", "..."],
  "recommendations": ["...", "..."]
}`;
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(response: string): AIInsight {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || 'No summary available',
        brainState: parsed.brainState || 'Unknown',
        sleepStage: parsed.sleepStage || undefined,
        anomalies: Array.isArray(parsed.anomalies) ? parsed.anomalies : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }

  // Fallback to text-based parsing
  return {
    summary: response.substring(0, 200),
    brainState: 'Analysis Complete',
    anomalies: [],
    recommendations: []
  };
}

/**
 * Get mock AI insight when API is not available
 */
function getMockAIInsight(analysis: SignalAnalysis): AIInsight {
  const { frequencyBands, totalPower } = analysis;

  // Determine brain state based on dominant frequency band
  let brainState = 'Unknown';
  let sleepStage: string | undefined;
  const summary: string[] = [];
  const anomalies: string[] = [];
  const recommendations: string[] = [];

  const powers = [
    { name: 'delta', power: frequencyBands.delta.power },
    { name: 'theta', power: frequencyBands.theta.power },
    { name: 'alpha', power: frequencyBands.alpha.power },
    { name: 'beta', power: frequencyBands.beta.power },
    { name: 'gamma', power: frequencyBands.gamma.power }
  ].sort((a, b) => b.power - a.power);

  const dominant = powers[0].name;

  if (dominant === 'delta') {
    brainState = 'Deep Sleep';
    sleepStage = 'N3 (Slow-wave sleep)';
    summary.push(
      'The brain activity shows dominant slow delta waves, characteristic of deep sleep (stage N3).',
      'This is the most restorative sleep stage, crucial for physical recovery and memory consolidation.',
      'The subject appears to be in a state of profound unconsciousness with minimal sensory awareness.'
    );
    recommendations.push(
      'Ensure sleep environment remains undisturbed to maintain deep sleep quality',
      'This stage is essential for physical restoration and immune function'
    );
  } else if (dominant === 'theta') {
    if (frequencyBands.alpha.power > 0.5) {
      brainState = 'Drowsy / Light Sleep Transition';
      sleepStage = 'N1 (Sleep onset)';
      summary.push(
        'Mixed theta and alpha activity suggests the subject is in a drowsy state or transitioning to light sleep.',
        'This is characteristic of stage N1 sleep, the transition between wakefulness and sleep.',
        'The subject may experience hypnagogic imagery and reduced environmental awareness.'
      );
    } else {
      brainState = 'Light Sleep';
      sleepStage = 'N2 (Light sleep)';
      summary.push(
        'Prominent theta waves with reduced alpha activity indicate light sleep (stage N2).',
        'This is the longest sleep stage, comprising about 50% of total sleep time.',
        'The subject shows reduced muscle activity and heart rate.'
      );
    }
    recommendations.push(
      'Maintain consistent sleep schedule for better sleep quality',
      'Reduce screen time before bed to improve sleep onset'
    );
  } else if (dominant === 'alpha') {
    brainState = 'Relaxed Wakefulness';
    summary.push(
      'Strong alpha wave activity indicates a state of relaxed wakefulness, typically with eyes closed.',
      'The subject is calm, conscious, and mentally at ease but not focused on specific tasks.',
      'This state is often seen during meditation, rest, or pre-sleep relaxation.'
    );
    recommendations.push(
      'This brain state is ideal for meditation and stress reduction',
      'Consider maintaining this relaxed state for mental recovery'
    );
  } else if (dominant === 'beta') {
    brainState = 'Active Concentration';
    summary.push(
      'Elevated beta wave activity indicates active mental engagement and concentration.',
      'The subject is likely focused on a task, problem-solving, or experiencing heightened alertness.',
      'This pattern is normal during waking activities but may indicate stress if sustained.'
    );
    if (frequencyBands.beta.power > 2.0) {
      anomalies.push('Unusually high beta activity may indicate anxiety or stress');
      recommendations.push(
        'Consider relaxation techniques if sustained high beta activity is detected',
        'Take regular breaks during intensive mental work'
      );
    } else {
      recommendations.push(
        'Good focus and concentration levels detected',
        'Maintain regular breaks to avoid mental fatigue'
      );
    }
  } else if (dominant === 'gamma') {
    brainState = 'High-Level Cognitive Processing';
    summary.push(
      'Prominent gamma wave activity suggests high-level cognitive processing and neural integration.',
      'This may indicate intense concentration, learning, or perceptual processing.',
      'Gamma activity is associated with consciousness and information processing across brain regions.'
    );
    recommendations.push(
      'High gamma activity indicates active learning or complex problem-solving',
      'Ensure adequate rest periods for optimal cognitive performance'
    );
  }

  // Check for unusual patterns
  if (frequencyBands.delta.power > 2.0 && frequencyBands.beta.power > 1.0) {
    anomalies.push('Unusual mix of delta and beta waves detected - may indicate sleep disorder or mixed brain states');
  }

  if (totalPower < 0.1) {
    anomalies.push('Low overall signal power - may indicate recording issues or suppressed brain activity');
  }

  return {
    summary: summary.join(' '),
    brainState,
    sleepStage,
    anomalies,
    recommendations
  };
}

/**
 * Get brain state color for visualization
 */
export function getBrainStateColor(brainState: string): string {
  const stateColors: Record<string, string> = {
    'Deep Sleep': '#4A148C',
    'Light Sleep': '#7B1FA2',
    'Drowsy / Light Sleep Transition': '#9C27B0',
    'Relaxed Wakefulness': '#2196F3',
    'Active Concentration': '#FF9800',
    'High-Level Cognitive Processing': '#F44336'
  };

  return stateColors[brainState] || '#757575';
}
