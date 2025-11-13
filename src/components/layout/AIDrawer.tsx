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
    <div className="space-y-4 text-sm text-slate-100">
      <h3 className="text-sm font-medium text-white">Key findings</h3>
      <ul className="space-y-2">
        {insight.anomalies.length > 0 ? (
          insight.anomalies.map((item, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
            >
              {item}
            </li>
          ))
        ) : (
          <li className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
            No notable anomalies detected.
          </li>
        )}
      </ul>
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-300">Clinical relevance</h4>
        <p className="rounded-xl border border-white/10 bg-white/5 p-3 leading-relaxed text-slate-200">
          {insight.summary}
        </p>
      </div>
      {insight.recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-300">Recommendations</h4>
          <ul className="space-y-2">
            {insight.recommendations.map((item, idx) => (
              <li key={idx} className="rounded-xl border border-white/10 bg-gradient-to-r from-emerald-500/10 to-cyan-400/10 p-3 text-sm text-emerald-100">
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
    <div className="space-y-4 text-sm text-slate-100">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
        <h3 className="text-sm font-medium text-white">Dominant frequency</h3>
        <p className="text-xl font-semibold" style={{ color: dominantColor }}>
          {signalAnalysis.dominantFrequency.toFixed(2)} Hz
        </p>
        {insight.brainState && (
          <p className="text-xs text-slate-300">State: {insight.brainState}</p>
        )}
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-300">Band metrics</h4>
        <ul className="space-y-2">
          {bandEntries.map((band) => (
            <li
              key={band.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
            >
              <span>{band.name}</span>
              <span className="font-mono text-xs text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.5)]">{band.power.toFixed(3)} μV²</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-300">Artifact notes</h4>
        <p className="rounded-xl border border-white/10 bg-white/5 p-3 leading-relaxed text-slate-200">
          {insight.anomalies.length > 0 ? 'See findings for potential artifacts.' : 'No artifact concerns detected.'}
        </p>
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-medium text-slate-300">Total power</h4>
        <p className="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.5)]">
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
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-white/10 text-white shadow-xl backdrop-blur-md transition-transform transition-opacity duration-300 ease-in-out ${
        isVisible && isActive ? 'translate-y-0' : 'translate-y-full'
      } ${isVisible && isActive ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/40" />
        <header className="mb-6 flex flex-col gap-2 text-sm text-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-base font-medium text-white">AI insights</span>
            <span className="text-xs text-slate-300">Automated neuroanalysis summary</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Close
          </button>
        </header>
        <div className="grid gap-4 text-left md:grid-cols-2">
          <FindingsColumn insight={analysisResult.aiInsight} />
          <MetricsColumn insight={analysisResult.aiInsight} analysis={analysisResult} />
        </div>
      </div>
    </section>
  );
};
