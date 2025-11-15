import { useMemo } from 'react';
import type { AIResults, FrequencyBands } from '../../types';
import { CollapsibleSection } from '../layout/CollapsibleSection';
import { getBrainStateColor } from '../../utils/aiEngine';

interface InsightBadgeProps {
  label: string;
  description: string;
  tone?: 'default' | 'positive' | 'warning';
}

const tonePalette: Record<NonNullable<InsightBadgeProps['tone']>, { bg: string; border: string; text: string }> = {
  default: {
    bg: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-slate-100'
  },
  positive: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/40',
    text: 'text-emerald-100'
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/40',
    text: 'text-amber-100'
  }
};

const InsightBadge = ({ label, description, tone = 'default' }: InsightBadgeProps) => {
  const palette = tonePalette[tone];
  return (
    <div className={`flex flex-col gap-1 rounded-xl border ${palette.border} ${palette.bg} p-3 transition hover:border-white/30`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{label}</p>
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
    default: 'bg-white/5 border-white/10 text-slate-100',
    positive: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-100',
    warning: 'bg-amber-500/10 border-amber-400/40 text-amber-100'
  }[statusTone];

  return (
    <header className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {status && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClasses}`}
          >
            {status}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-slate-300">{subtitle}</p>}
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
  const color = getBrainStateColor(aiResults.brainState || '');

  const timestampLabel = useMemo(() => {
    if (isAnalyzing) return 'Analyzing now…';
    if (!lastAnalyzedAt) return 'Not analyzed yet';
    return `Analyzed ${lastAnalyzedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [isAnalyzing, lastAnalyzedAt]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6">
      <div
        className="absolute right-6 top-6 h-16 w-16 rounded-full opacity-30"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">AI Brain State</p>
        <p className="text-2xl font-semibold text-white">{aiResults.brainState || 'Awaiting analysis'}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
          {aiResults.confidence && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100">
              Confidence: {aiResults.confidence}
            </span>
          )}
          {signalQuality && (
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">
              Signal quality: {signalQuality}
            </span>
          )}
          <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            {timestampLabel}
          </span>
        </div>
        {aiResults.description && (
          <p className="text-sm leading-relaxed text-slate-200">{aiResults.description}</p>
        )}
        {aiResults.keyFindings && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Key context</p>
            <p className="mt-2 whitespace-pre-line text-sm text-slate-100">{aiResults.keyFindings}</p>
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
      <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        Claude has not flagged any prominent artifacts yet. Once an analysis completes, detected artifact patterns will appear
        here.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {findings.map((finding, index) => (
        <li
          key={`${finding}-${index}`}
          className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100"
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
      <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        Claude will generate a spectral summary table after the next analysis run.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-100">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
          <tr>
            {data.headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}`} className="hover:bg-white/5">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3 text-slate-100">
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
      <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        Raw Claude transcript will appear after an analysis. Use this to audit AI reasoning or export a detailed report.
      </p>
    );
  }

  return (
    <pre className="max-h-[320px] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-100">
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
    <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.45)]">
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

      <InsightsGrid aiResults={aiResults} compareToCohort={compareToCohort} />

      {bandpowers && bandpowers.delta && (
        <CollapsibleSection title="Spectral bandpower highlights" defaultOpen>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {powerHighlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{highlight.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{highlight.value}</p>
                <p className="mt-1 text-xs text-slate-300">{highlight.emphasis}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Targeted analysis narrative" defaultOpen={Boolean(aiResults.targetedAnalysis)}>
        <div className="space-y-3">
          <p className="text-sm text-slate-200">
            Claude can focus on specific research questions via the sidebar query field. Use this space to probe meditation depth,
            cognitive load, or sleep staging trajectories.
          </p>
          {aiResults.targetedAnalysis ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="whitespace-pre-line text-sm text-slate-100">{aiResults.targetedAnalysis}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 bg-transparent p-4 text-sm text-slate-400">
              No targeted analysis has been requested yet. Enter a domain question in the sidebar (e.g. "Is the subject entering
              REM?" or "Assess frontal alpha asymmetry") and rerun the analysis.
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
