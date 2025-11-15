import { useMemo } from 'react';
import type { AIResults, FrequencyBands } from '../../types';
import { CollapsibleSection } from '../layout/CollapsibleSection';
import { getBrainStateColor } from '../../utils/aiEngine';
import { NeuralDivider } from '../common/NeuralDivider';

interface InsightBadgeProps {
  label: string;
  description: string;
  tone?: 'default' | 'positive' | 'warning';
}

const tonePalette: Record<NonNullable<InsightBadgeProps['tone']>, { bg: string; border: string; text: string }> = {
  default: {
    bg: 'bg-[rgba(23,18,33,0.76)]',
    border: 'border-[rgba(198,188,255,0.16)]',
    text: 'text-[rgba(236,229,220,0.82)]'
  },
  positive: {
    bg: 'bg-[rgba(68,209,157,0.12)]',
    border: 'border-[rgba(68,209,157,0.32)]',
    text: 'text-[rgba(170,246,210,0.92)]'
  },
  warning: {
    bg: 'bg-[rgba(255,182,72,0.12)]',
    border: 'border-[rgba(255,182,72,0.35)]',
    text: 'text-[rgba(255,214,159,0.92)]'
  }
};

const InsightBadge = ({ label, description, tone = 'default' }: InsightBadgeProps) => {
  const palette = tonePalette[tone];
  return (
    <div className={`flex flex-col gap-1 rounded-2xl border ${palette.border} ${palette.bg} p-4 transition-transform duration-300 hover:-translate-y-[1px]`}> 
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[rgba(236,229,220,0.58)]">{label}</p>
      <p className={`text-sm leading-relaxed ${palette.text}`}>{description}</p>
    </div>
  );
};

interface SectionHeadlineProps {
  title: string;
  subtitle?: string;
  status?: string;
  statusTone?: 'default' | 'positive' | 'warning';
}

const SectionHeadline = ({ title, subtitle, status, statusTone = 'default' }: SectionHeadlineProps) => {
  const toneClasses = {
    default: 'border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] text-[rgba(236,229,220,0.78)]',
    positive: 'border-[rgba(68,209,157,0.45)] bg-[rgba(68,209,157,0.15)] text-[rgba(170,246,210,0.92)]',
    warning: 'border-[rgba(255,182,72,0.45)] bg-[rgba(255,182,72,0.15)] text-[rgba(255,214,159,0.92)]'
  }[statusTone];

  return (
    <header className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[rgba(249,245,236,0.98)]">{title}</h2>
        {status && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium tracking-[0.22em] uppercase ${toneClasses}`}
          >
            {status}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-[rgba(214,205,196,0.7)]">{subtitle}</p>}
    </header>
  );
};

interface BrainStateCardProps {
  aiResults: AIResults;
  signalQuality?: string | null;
  lastAnalyzedAt?: Date | null;
  isAnalyzing: boolean;
}

const BrainStateCard = ({ aiResults, signalQuality, lastAnalyzedAt, isAnalyzing }: BrainStateCardProps) => {
  const color = getBrainStateColor(aiResults.brainState || '') || 'rgba(105,217,255,0.65)';

  const timestampLabel = useMemo(() => {
    if (isAnalyzing) return 'Analyzing now…';
    if (!lastAnalyzedAt) return 'Not analyzed yet';
    return `Analyzed ${lastAnalyzedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [isAnalyzing, lastAnalyzedAt]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[rgba(198,188,255,0.2)] bg-[rgba(18,14,30,0.78)] p-6">
      <div
        className="absolute right-6 top-6 h-24 w-24 rounded-full opacity-35"
        style={{ background: `radial-gradient(circle at center, ${color}, rgba(18,14,26,0) 70%)` }}
      />
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[rgba(236,229,220,0.55)]">AI Brain State</p>
        <p className="text-2xl font-semibold text-[rgba(249,245,236,0.98)]">{aiResults.brainState || 'Awaiting analysis'}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-[rgba(214,205,196,0.78)]">
          {aiResults.confidence && (
            <span className="cl-status-chip">Confidence: {aiResults.confidence}</span>
          )}
          {signalQuality && (
            <span className="cl-status-chip" style={{ borderColor: 'rgba(105,217,255,0.35)', color: 'rgba(105,217,255,0.9)' }}>
              Signal: {signalQuality}
            </span>
          )}
          <span className="cl-status-chip">{timestampLabel}</span>
        </div>
        {aiResults.description && (
          <p className="text-sm leading-relaxed text-[rgba(236,229,220,0.82)]">{aiResults.description}</p>
        )}
        {aiResults.keyFindings && (
          <div className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">Key context</p>
            <p className="mt-2 whitespace-pre-line text-sm text-[rgba(236,229,220,0.88)]">{aiResults.keyFindings}</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface InsightsGridProps {
  aiResults: AIResults;
  compareToCohort?: boolean;
}

const InsightsGrid = ({ aiResults, compareToCohort }: InsightsGridProps) => {
  const items = useMemo(() => {
    const hasPatterns = Boolean(aiResults.patterns?.trim());
    const patternTone = hasPatterns ? 'warning' : 'default';

    const gridItems: Array<{ label: string; description: string; tone: InsightBadgeProps['tone'] }> = [
      {
        label: 'Actionable Insights',
        description: aiResults.insights?.trim() || 'Run an analysis to surface tailored recommendations.',
        tone: aiResults.insights ? 'positive' : 'default'
      },
      {
        label: 'Pattern Detections',
        description: hasPatterns
          ? aiResults.patterns
          : 'No significant oscillatory anomalies detected. Run Claude analysis to update this panel.',
        tone: patternTone as InsightBadgeProps['tone']
      },
      {
        label: 'Cohort Comparison',
        description:
          aiResults.cohortComparison?.trim() ||
          (compareToCohort
            ? 'Awaiting Claude assessment comparing subject data to normative cohort models.'
            : 'Enable cohort comparison in the sidebar to benchmark against normative populations.'),
        tone: aiResults.cohortComparison ? 'positive' : 'default'
      }
    ];

    return gridItems;
  }, [aiResults.insights, aiResults.patterns, aiResults.cohortComparison, compareToCohort]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <InsightBadge key={item.label} label={item.label} description={item.description} tone={item.tone} />
      ))}
    </div>
  );
};

interface ArtifactListProps {
  findings?: string[];
}

const ArtifactList = ({ findings }: ArtifactListProps) => {
  if (!findings || findings.length === 0) {
    return (
      <p className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] p-4 text-sm text-[rgba(214,205,196,0.72)]">
        Claude has not flagged any prominent artifacts yet. Once an analysis completes, detected artifact patterns will appear here.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {findings.map((finding, index) => (
        <li
          key={`${finding}-${index}`}
          className="rounded-2xl border border-[rgba(255,182,72,0.35)] bg-[rgba(255,182,72,0.12)] p-4 text-sm text-[rgba(255,214,159,0.9)]"
        >
          {finding}
        </li>
      ))}
    </ul>
  );
};

const SummaryTable = ({ data }: { data?: AIResults['summaryTableData'] }) => {
  if (!data || !data.headers?.length || !data.rows?.length) {
    return (
      <p className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] p-4 text-sm text-[rgba(214,205,196,0.72)]">
        Claude will generate a spectral summary table after the next analysis run.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(15,12,24,0.72)]">
      <table className="min-w-full divide-y divide-[rgba(198,188,255,0.14)] text-left text-sm text-[rgba(236,229,220,0.85)]">
        <thead className="bg-[rgba(23,18,33,0.7)] text-xs uppercase tracking-[0.18em] text-[rgba(236,229,220,0.55)]">
          <tr>
            {data.headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(198,188,255,0.08)]">
          {data.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}`} className="transition-colors hover:bg-[rgba(105,217,255,0.05)]">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface RawReportPreviewProps {
  report?: string;
}

const RawReportPreview = ({ report }: RawReportPreviewProps) => {
  if (!report) {
    return (
      <p className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] p-4 text-sm text-[rgba(214,205,196,0.72)]">
        Raw Claude transcript will appear after an analysis. Use this to audit AI reasoning or export a detailed report.
      </p>
    );
  }

  return (
    <pre className="max-h-[320px] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(15,12,24,0.85)] p-4 text-xs text-[rgba(236,229,220,0.88)]">
      {report}
    </pre>
  );
};

interface AIAnalysisDashboardProps {
  aiResults: AIResults;
  isAnalyzing: boolean;
  analysisComplete: boolean;
  signalQuality?: string | null;
  bandpowers?: FrequencyBands | null;
  lastAnalyzedAt?: Date | null;
  compareToCohort?: boolean;
}

export const AIAnalysisDashboard = ({
  aiResults,
  isAnalyzing,
  analysisComplete,
  signalQuality,
  bandpowers,
  lastAnalyzedAt,
  compareToCohort
}: AIAnalysisDashboardProps) => {
  const powerHighlights = useMemo(() => {
    if (!bandpowers) return [] as Array<{ label: string; value: string; emphasis: string }>;

    const entries: Array<{ label: string; value: string; emphasis: string }> = [
      {
        label: 'Delta Power',
        value: `${bandpowers.delta.power.toFixed(3)} μV²`,
        emphasis: '0.5–4 Hz restorative rhythms'
      },
      {
        label: 'Theta Power',
        value: `${bandpowers.theta.power.toFixed(3)} μV²`,
        emphasis: '4–8 Hz transitional dynamics'
      },
      {
        label: 'Alpha Power',
        value: `${bandpowers.alpha.power.toFixed(3)} μV²`,
        emphasis: '8–13 Hz relaxed processing'
      },
      {
        label: 'Beta Power',
        value: `${bandpowers.beta.power.toFixed(3)} μV²`,
        emphasis: '13–30 Hz cognitive drive'
      },
      {
        label: 'Gamma Power',
        value: `${bandpowers.gamma.power.toFixed(3)} μV²`,
        emphasis: '30–50 Hz integrative bursts'
      }
    ];

    return entries;
  }, [bandpowers]);

  return (
    <section className="cl-slab cl-veil space-y-6 rounded-3xl border border-[rgba(198,188,255,0.18)] bg-[rgba(13,10,22,0.82)] px-[var(--cl-h-gutter)] py-6 shadow-[0_30px_70px_rgba(7,4,15,0.6)]">
      <div className="cl-slab-edge" />
      <SectionHeadline
        title="Claude AI Analysis"
        subtitle="Live neurointerpretation of the processed EEG stream with artifact diagnostics and cohort insights"
        status={isAnalyzing ? 'Running live analysis…' : analysisComplete ? 'Ready' : 'Idle'}
        statusTone={isAnalyzing ? 'warning' : analysisComplete ? 'positive' : 'default'}
      />

      <BrainStateCard
        aiResults={aiResults}
        signalQuality={signalQuality}
        lastAnalyzedAt={lastAnalyzedAt}
        isAnalyzing={isAnalyzing}
      />

      <NeuralDivider curvature={0.35} opacity={0.45} />

      <InsightsGrid aiResults={aiResults} compareToCohort={compareToCohort} />

      {bandpowers && bandpowers.delta && (
        <CollapsibleSection title="Spectral bandpower highlights" defaultOpen>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {powerHighlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(23,18,33,0.72)] p-4 text-sm text-[rgba(236,229,220,0.85)] shadow-[0_18px_40px_rgba(7,4,15,0.45)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(236,229,220,0.55)]">{highlight.label}</p>
                <p className="mt-2 text-lg font-semibold text-[rgba(249,245,236,0.96)]">{highlight.value}</p>
                <p className="mt-1 text-xs text-[rgba(214,205,196,0.72)]">{highlight.emphasis}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Targeted analysis narrative" defaultOpen={Boolean(aiResults.targetedAnalysis)}>
        <div className="space-y-3">
          <p className="text-sm text-[rgba(236,229,220,0.78)]">
            Claude can focus on specific research questions via the sidebar query field. Use this space to probe meditation depth,
            cognitive load, or sleep staging trajectories.
          </p>
          {aiResults.targetedAnalysis ? (
            <div className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(15,12,24,0.82)] p-4">
              <p className="whitespace-pre-line text-sm text-[rgba(236,229,220,0.88)]">{aiResults.targetedAnalysis}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[rgba(198,188,255,0.2)] bg-[rgba(23,18,33,0.5)] p-4 text-sm text-[rgba(214,205,196,0.6)]">
              No targeted analysis has been requested yet. Enter a domain question in the sidebar (e.g. "Is the subject entering REM?" or "Assess frontal alpha asymmetry") and rerun the analysis.
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="AI artifact detector" defaultOpen={Boolean(aiResults.artifactFindings?.length)}>
        <ArtifactList findings={aiResults.artifactFindings} />
      </CollapsibleSection>

      <CollapsibleSection title="Claude spectral summary table" defaultOpen={Boolean(aiResults.summaryTableData)}>
        <SummaryTable data={aiResults.summaryTableData} />
      </CollapsibleSection>

      <CollapsibleSection title="Raw Claude transcript" defaultOpen={false}>
        <RawReportPreview report={aiResults.rawReport} />
      </CollapsibleSection>
    </section>
  );
};
