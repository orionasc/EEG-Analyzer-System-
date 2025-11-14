import React, { useEffect, useRef, useState } from 'react';
import type { AnalysisResult, AIInsight } from '../../types';
import { getBrainStateColor } from '../../utils/aiEngine';

interface AIDrawerProps {
  analysisResult: AnalysisResult | null;
  isVisible: boolean;
  onClose: () => void;
  signalQualityLabel?: string | null;
}

const FindingsColumn: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const paragraphs = insight.deepAnalysis
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-sm text-slate-100">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
        <h3 className="text-sm font-medium text-white">Primary brain state</h3>
        <p className="text-base font-semibold text-white">{insight.brainState.classification}</p>
        {insight.brainState.confidence && (
          <p className="text-xs text-slate-300">Confidence: {insight.brainState.confidence}</p>
        )}
        {insight.brainState.description && (
          <p className="mt-2 text-xs text-slate-300">{insight.brainState.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-300">Deep analysis</h4>
        <div className="space-y-2">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="rounded-xl border border-white/10 bg-white/5 p-3 leading-relaxed text-slate-200">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/5 p-3 leading-relaxed text-slate-200">
              No detailed commentary returned.
            </p>
          )}
        </div>
      </div>
      {insight.targetedAnalysis && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-300">Targeted analysis</h4>
          <p className="rounded-xl border border-violet-400/30 bg-violet-500/10 p-3 text-sm leading-relaxed text-violet-100">
            {insight.targetedAnalysis}
          </p>
        </div>
      )}
      {insight.insights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-300">Actionable insights</h4>
          <ul className="space-y-2">
            {insight.insights.map((item, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm leading-relaxed text-emerald-100"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {insight.cohortComparison && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-300">Cohort comparison</h4>
          <p className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3 text-sm leading-relaxed text-cyan-100">
            {insight.cohortComparison}
          </p>
        </div>
      )}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-300">AI artifact detector</h4>
        <ul className="space-y-2">
          {insight.artifactFindings.length > 0 ? (
            insight.artifactFindings.map((item, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-slate-200"
              >
                {item}
              </li>
            ))
          ) : (
            <li className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
              No prominent artifacts detected.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const MetricsColumn: React.FC<{
  insight: AIInsight;
  analysis: AnalysisResult;
  signalQualityLabel?: string | null;
}> = ({ insight, analysis, signalQualityLabel }) => {
  const { signalAnalysis } = analysis;
  const dominantColor = getBrainStateColor(insight.brainState.classification);
  const bandEntries = Object.values(signalAnalysis.frequencyBands);
  const dominantBand = bandEntries.reduce((prev, current) => (current.power > prev.power ? current : prev));
  const patternList = insight.patternsFound.length > 0 ? insight.patternsFound : ['No critical patterns flagged.'];
  const summaryTable = insight.summaryTable;

  return (
    <div className="space-y-4 text-sm text-slate-100">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
        <h3 className="text-sm font-medium text-white">Dominant frequency</h3>
        <p className="text-xl font-semibold" style={{ color: dominantColor }}>
          {signalAnalysis.dominantFrequency.toFixed(2)} Hz
        </p>
        <p className="text-xs text-slate-300">State: {insight.brainState.classification}</p>
        <p className="mt-1 text-xs text-slate-400">
          Strongest band: {dominantBand.name} ({dominantBand.range[0]}–{dominantBand.range[1]} Hz)
        </p>
      </div>
      {signalQualityLabel && (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
          <h3 className="text-sm font-medium text-emerald-100">Signal quality</h3>
          <p className="text-lg font-semibold">{signalQualityLabel}</p>
          <p className="mt-1 text-xs text-emerald-200/80">Based on overall spectral power</p>
        </div>
      )}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-300">Pattern detections</h4>
        <ul className="space-y-2">
          {patternList.map((pattern, index) => (
            <li
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-slate-200"
            >
              {pattern}
            </li>
          ))}
        </ul>
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
      {summaryTable && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-300">Summary table</h4>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-full divide-y divide-white/10 text-xs text-left text-slate-100">
              <thead className="bg-white/5">
                <tr>
                  {summaryTable.headers.map((header) => (
                    <th key={header} className="px-3 py-2 font-medium uppercase tracking-wide text-slate-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {summaryTable.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${rowIndex}-${cellIndex}`} className="px-3 py-2 text-slate-100">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="space-y-1">
        <h4 className="text-xs font-medium text-slate-300">Total power</h4>
        <p className="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs text-cyan-200 shadow-[0_0_8px_rgba(0,200,255,0.5)]">
          {signalAnalysis.totalPower.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export const AIDrawer: React.FC<AIDrawerProps> = ({ analysisResult, isVisible, onClose, signalQualityLabel }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const frameRef = useRef<number | null>(null);

  const handleExportReport = () => {
    if (!analysisResult?.aiInsight) return;
    const blob = new Blob([analysisResult.aiInsight.rawReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `eeg-ai-report-${Date.now()}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportReport}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-100 transition hover:bg-white/20"
            >
              Export Full AI Report
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </header>
        <div className="grid gap-4 text-left md:grid-cols-2">
          <FindingsColumn insight={analysisResult.aiInsight} />
          <MetricsColumn
            insight={analysisResult.aiInsight}
            analysis={analysisResult}
            signalQualityLabel={signalQualityLabel}
          />
        </div>
      </div>
    </section>
  );
};
