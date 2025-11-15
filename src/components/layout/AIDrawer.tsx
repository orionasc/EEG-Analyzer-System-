import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { AIResults } from '../../types';

interface AIDrawerProps {
  aiResults: AIResults;
  isOpen: boolean;
  onClose: () => void;
  aiLoading: boolean;
  analysisComplete: boolean;
  signalQualityLabel?: string | null;
}

const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const SummaryTable = ({
  tableMarkdown,
  data
}: {
  tableMarkdown: string;
  data: AIResults['summaryTableData'];
}) => {
  if (data && data.headers.length && data.rows.length) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/10 text-left text-xs text-slate-100">
          <thead className="bg-white/5">
            <tr>
              {data.headers.map((header) => (
                <th key={header} className="px-3 py-2 font-medium uppercase tracking-wide text-slate-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}`}>
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
    );
  }

  if (tableMarkdown) {
    return (
      <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-100">
        {tableMarkdown}
      </pre>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">No summary table available.</div>
  );
};

export const AIDrawer = ({
  aiResults,
  isOpen,
  onClose,
  aiLoading,
  analysisComplete,
  signalQualityLabel
}: AIDrawerProps) => {
  const body = typeof document !== 'undefined' ? document.body : null;

  const patternItems = useMemo(() => splitLines(aiResults.patterns), [aiResults.patterns]);
  const insightItems = useMemo(() => splitLines(aiResults.insights), [aiResults.insights]);
  const keyFindingLines = useMemo(() => splitLines(aiResults.keyFindings), [aiResults.keyFindings]);

  if (!body) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] flex justify-center">
      <div
        className={`pointer-events-auto w-full max-w-6xl transform px-4 pb-6 transition-transform duration-300 ease-out sm:px-6 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-100 shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/30" />
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Claude analysis engine</h2>
              <p className="text-sm text-slate-300">Restored AI interpretation pipeline</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  aiLoading
                    ? 'border border-cyan-400/50 bg-cyan-500/10 text-cyan-200'
                    : analysisComplete
                    ? 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                    : 'border border-white/20 bg-white/10 text-slate-200'
                }`}
              >
                {aiLoading ? 'Analyzing…' : analysisComplete ? 'Analysis complete' : 'Awaiting analysis'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!aiResults.rawReport) return;
                  const blob = new Blob([aiResults.rawReport], { type: 'text/markdown;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement('a');
                  anchor.href = url;
                  anchor.download = `eeg-ai-report-${Date.now()}.md`;
                  anchor.click();
                  URL.revokeObjectURL(url);
                }}
                disabled={!aiResults.rawReport}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Export Report
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">&lt;Brain State&gt;</h3>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-lg font-semibold text-white">{aiResults.brainState || 'Awaiting analysis...'}</p>
                  {(aiResults.confidence || aiResults.description || signalQualityLabel) && (
                    <div className="mt-2 space-y-1 text-xs text-slate-300">
                      {aiResults.confidence && <p>Confidence: {aiResults.confidence}</p>}
                      {aiResults.description && <p>{aiResults.description}</p>}
                      {signalQualityLabel && <p>Signal quality: {signalQualityLabel}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">&lt;Key Findings&gt;</h3>
                <div className="mt-2 space-y-2">
                  {keyFindingLines.length > 0 ? (
                    keyFindingLines.map((line, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-slate-100"
                      >
                        {line}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                      Awaiting analysis...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">&lt;Deep Technical Analysis&gt;</h3>
                <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {aiResults.deepAnalysis || 'Awaiting analysis...'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">&lt;Pattern Detections&gt;</h3>
                <div className="mt-2 space-y-2">
                  {patternItems.length > 0 ? (
                    patternItems.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-slate-100"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                      Awaiting analysis...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">&lt;Actionable Insights&gt;</h3>
                <div className="mt-2 space-y-2">
                  {insightItems.length > 0 ? (
                    insightItems.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm leading-relaxed text-emerald-100"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                      Awaiting analysis...
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-300">&lt;Summary Table&gt;</h3>
                <div className="mt-2">
                  <SummaryTable tableMarkdown={aiResults.summaryTable} data={aiResults.summaryTableData} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>,
    body
  );
};
