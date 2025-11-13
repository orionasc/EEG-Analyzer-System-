import React, { useEffect, useRef, useState } from 'react';
import type { AnalysisResult, AIInsight } from '../../types';
import { getBrainStateColor } from '../../services/aiAnalysis';

interface AIDrawerProps {
  analysisResult: AnalysisResult | null;
  isVisible: boolean;
  onClose: () => void;
}

const FindingsColumn: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  return (
    <div className="space-y-3 text-[12px] text-slate-600">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Key Findings</h3>
      <ul className="space-y-2">
        {insight.anomalies.length > 0 ? (
          insight.anomalies.map((item, idx) => (
            <li
              key={idx}
              className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-[12px] leading-snug text-slate-700"
            >
              {item}
            </li>
          ))
        ) : (
          <li className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
            No notable anomalies detected.
          </li>
        )}
      </ul>
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Clinical Relevance</h4>
        <p className="rounded-lg border border-slate-200/70 bg-white px-3 py-2 leading-snug text-slate-600">
          {insight.summary}
        </p>
      </div>
      {insight.recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Recommendations</h4>
          <ul className="space-y-2">
            {insight.recommendations.map((item, idx) => (
              <li key={idx} className="rounded-lg border border-emerald-200/70 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const MetricsColumn: React.FC<{ insight: AIInsight; analysis: AnalysisResult }> = ({ insight, analysis }) => {
  const { signalAnalysis } = analysis;
  const dominantColor = getBrainStateColor(insight.brainState);
  const bandEntries = Object.values(signalAnalysis.frequencyBands);

  return (
    <div className="space-y-3 text-[12px] text-slate-600">
      <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Dominant Frequency</h3>
        <p className="text-base font-semibold" style={{ color: dominantColor }}>
          {signalAnalysis.dominantFrequency.toFixed(2)} Hz
        </p>
        {insight.brainState && (
          <p className="text-[11px] text-slate-500">State: {insight.brainState}</p>
        )}
      </div>
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Band Metrics</h4>
        <ul className="space-y-1">
          {bandEntries.map((band) => (
            <li
              key={band.name}
              className="flex items-center justify-between rounded border border-slate-200/70 bg-slate-50 px-3 py-1.5 text-[12px]"
            >
              <span>{band.name}</span>
              <span className="font-mono text-[12px] text-slate-700">{band.power.toFixed(3)} μV²</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Artifact Notes</h4>
        <p className="rounded-lg border border-slate-200/70 bg-white px-3 py-2 leading-snug text-slate-600">
          {insight.anomalies.length > 0 ? 'See findings for potential artifacts.' : 'No artifact concerns detected.'}
        </p>
      </div>
      <div className="space-y-1">
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Total Power</h4>
        <p className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 font-mono text-[12px] text-slate-700">
          {signalAnalysis.totalPower.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export const AIDrawer: React.FC<AIDrawerProps> = ({ analysisResult, isVisible, onClose }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible && analysisResult?.aiInsight) {
      setShouldRender(true);
      frameRef.current = requestAnimationFrame(() => {
        setIsActive(true);
      });
      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
      };
    }

    setIsActive(false);
    if (!analysisResult?.aiInsight) {
      setShouldRender(false);
    }
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isVisible, analysisResult]);

  if (!shouldRender || !analysisResult || !analysisResult.aiInsight) {
    return null;
  }

  const handleTransitionEnd = () => {
    if (!isVisible) {
      setShouldRender(false);
    }
  };

  return (
    <section
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-slate-100/95 text-slate-900 shadow-[0_-24px_60px_-40px_rgba(15,23,42,1)] backdrop-blur transition-transform transition-opacity duration-300 ease-in-out ${
        isVisible && isActive ? 'translate-y-0' : 'translate-y-full'
      } ${isVisible && isActive ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="mx-auto max-w-5xl px-6 py-5">
        <header className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <div className="flex items-center gap-3">
            <span>AI Insights</span>
            <span className="text-slate-400">Automated neuroanalysis summary</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-400/60 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:border-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </header>
        <div className="grid gap-6 text-left md:grid-cols-2">
          <FindingsColumn insight={analysisResult.aiInsight} />
          <MetricsColumn insight={analysisResult.aiInsight} analysis={analysisResult} />
        </div>
      </div>
    </section>
  );
};
