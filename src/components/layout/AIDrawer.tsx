import { createPortal } from 'react-dom';
import type { AIResults } from '../../types';

interface AIDrawerProps {
  aiResults: AIResults;
  isOpen: boolean;
  onClose: () => void;
  aiLoading: boolean;
  analysisComplete: boolean;
}

const SummaryTable = ({ data }: { data: AIResults['summaryTableData'] }) => {
  if (data && data.headers?.length && data.rows?.length) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(15,12,24,0.85)]">
        <table className="min-w-full divide-y divide-[rgba(198,188,255,0.14)] text-left text-xs text-[rgba(236,229,220,0.85)]">
          <thead className="bg-[rgba(23,18,33,0.7)] text-xs uppercase tracking-[0.18em] text-[rgba(236,229,220,0.55)]">
            <tr>
              {data.headers.map((header) => (
                <th key={header} className="px-3 py-2 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(198,188,255,0.1)]">
            {data.rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}`}> 
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className="px-3 py-2">
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

  return (
    <p className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] p-4 text-xs text-[rgba(214,205,196,0.7)]">
      Awaiting analysis...
    </p>
  );
};

export const AIDrawer = ({
  aiResults,
  isOpen,
  onClose,
  aiLoading,
  analysisComplete
}: AIDrawerProps) => {
  const body = typeof document !== 'undefined' ? document.body : null;

  if (!body) {
    return null;
  }

  return createPortal(
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[9999] flex justify-center transition-transform duration-[400ms] ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="pointer-events-auto w-full max-w-4xl px-4 pb-6 sm:px-6">
        <section className="rounded-3xl border border-[rgba(198,188,255,0.24)] bg-[rgba(13,10,22,0.92)] p-6 text-[rgba(236,229,220,0.88)] shadow-[0_40px_80px_rgba(7,4,15,0.75)] backdrop-blur-2xl">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[rgba(236,229,220,0.18)]" />
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[rgba(249,245,236,0.95)]">Claude analysis engine</h2>
              <p className="text-sm text-[rgba(214,205,196,0.7)]">Restored AI interpretation pipeline</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                  aiLoading
                    ? 'border border-[rgba(105,217,255,0.45)] bg-[rgba(105,217,255,0.15)] text-[rgba(105,217,255,0.88)]'
                    : analysisComplete
                    ? 'border border-[rgba(68,209,157,0.45)] bg-[rgba(68,209,157,0.15)] text-[rgba(170,246,210,0.92)]'
                    : 'border border-[rgba(198,188,255,0.24)] bg-[rgba(23,18,33,0.7)] text-[rgba(236,229,220,0.75)]'
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
                className="rounded-full border border-[rgba(198,188,255,0.24)] bg-[rgba(23,18,33,0.72)] px-4 py-2 text-xs font-semibold text-[rgba(236,229,220,0.85)] transition hover:border-[rgba(105,217,255,0.45)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Export Report
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cl-node-button px-4 py-2"
              >
                <span className="cl-node-spark" aria-hidden />
                Close
              </button>
            </div>
          </header>

          <div className="space-y-6 text-sm text-[rgba(236,229,220,0.82)]">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">&lt;Brain State&gt;</h3>
              <div className="mt-2 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.78)] p-4">
                <p className="text-base font-semibold text-[rgba(249,245,236,0.96)]">{aiResults.brainState || 'Awaiting analysis...'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">&lt;Key Findings&gt;</h3>
              <div className="mt-2 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.78)] p-4">
                <p className="whitespace-pre-line text-sm text-[rgba(236,229,220,0.85)]">{aiResults.keyFindings || 'Awaiting analysis...'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">&lt;Deep Technical Analysis&gt;</h3>
              <div className="mt-2 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.78)] p-4">
                <p className="whitespace-pre-line text-sm text-[rgba(236,229,220,0.85)]">{aiResults.deepAnalysis || 'Awaiting analysis...'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">&lt;Pattern Detections&gt;</h3>
              <div className="mt-2 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.78)] p-4">
                <p className="whitespace-pre-line text-sm text-[rgba(236,229,220,0.85)]">{aiResults.patterns || 'Awaiting analysis...'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">&lt;Actionable Insights&gt;</h3>
              <div className="mt-2 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.78)] p-4">
                <p className="whitespace-pre-line text-sm text-[rgba(236,229,220,0.85)]">{aiResults.insights || 'Awaiting analysis...'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">&lt;Summary Table&gt;</h3>
              <div className="mt-2">
                <SummaryTable data={aiResults.summaryTableData} />
              </div>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">&lt;Raw Output&gt;</h3>
              <div className="mt-2 rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(18,14,30,0.78)] p-4">
                <pre className="text-xs whitespace-pre-wrap text-[rgba(236,229,220,0.85)]">{aiResults.rawReport || 'No AI output available.'}</pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>,
    body
  );
};
