import Plot from 'react-plotly.js';
import type { SignalAnalysis } from '../types';
import { themeTokens } from '../theme';

interface PowerSpectrumPlotProps {
  analysis: SignalAnalysis;
}

const bandStyles = [
  { label: 'Delta', range: [0.5, 4], color: 'rgba(143, 111, 255, 0.08)' },
  { label: 'Theta', range: [4, 8], color: 'rgba(105, 217, 255, 0.08)' },
  { label: 'Alpha', range: [8, 13], color: 'rgba(123, 179, 255, 0.08)' },
  { label: 'Beta', range: [13, 30], color: 'rgba(255, 182, 72, 0.08)' },
  { label: 'Gamma', range: [30, 50], color: 'rgba(255, 193, 152, 0.08)' }
];

export const PowerSpectrumPlot: React.FC<PowerSpectrumPlotProps> = ({ analysis }) => {
  const { frequencies, powers } = analysis.spectralData;
  const filtered = frequencies
    .map((freq, idx) => ({ freq, power: powers[idx] }))
    .filter((point) => Number.isFinite(point.power) && point.freq <= 60);

  const dominantFrequency = analysis.dominantFrequency;

  const trace = {
    x: filtered.map((p) => p.freq),
    y: filtered.map((p) => p.power),
    type: 'scatter' as const,
    mode: 'lines' as const,
    fill: 'tozeroy' as const,
    line: {
      color: themeTokens.palette.pathwayBlue,
      width: 2.4
    },
    fillcolor: 'rgba(106, 146, 255, 0.18)',
    hovertemplate: '<b>%{x:.1f} Hz</b><br>Power: %{y:.3f}<extra></extra>'
  };

  const shapes = [
    ...bandStyles.map((band) => ({
      type: 'rect' as const,
      xref: 'x' as const,
      yref: 'paper' as const,
      x0: band.range[0],
      x1: band.range[1],
      y0: 0,
      y1: 1,
      fillcolor: band.color,
      line: { width: 0 }
    })),
    {
      type: 'line' as const,
      xref: 'x' as const,
      yref: 'paper' as const,
      x0: dominantFrequency,
      x1: dominantFrequency,
      y0: 0,
      y1: 1,
      line: {
        color: 'rgba(105, 217, 255, 0.85)',
        width: 2,
        dash: 'dash' as const
      }
    }
  ];

  const annotations = bandStyles.map((band) => ({
    x: (band.range[0] + band.range[1]) / 2,
    y: 1.05,
    text: band.label,
    showarrow: false,
    font: { size: 11, color: 'rgba(236,229,220,0.6)' }
  }));

  return (
    <div className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(17,13,28,0.78)] px-[var(--cl-h-gutter)] py-5 shadow-[0_24px_48px_rgba(8,4,18,0.45)]">
      <div className="mb-3 flex items-center justify-between text-xs text-[rgba(214,205,196,0.7)]">
        <span>Real-time spectral energy profile</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(105,217,255,0.3)] bg-[rgba(105,217,255,0.12)] px-2.5 py-1 text-xs text-[rgba(105,217,255,0.9)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(105,217,255,0.8)] shadow-[0_0_8px_rgba(105,217,255,0.6)]" aria-hidden />
          PSD curve
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(198,188,255,0.14)] pb-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[rgba(249,245,236,0.95)]">Power spectrum</h3>
          <p className="text-xs text-[rgba(214,205,196,0.7)]">Frequency distribution with band annotations</p>
        </div>
        <div className="rounded-lg border border-[rgba(105,217,255,0.35)] bg-[rgba(105,217,255,0.12)] px-3 py-2 text-xs text-[rgba(105,217,255,0.9)]">
          Dominant: {dominantFrequency.toFixed(2)} Hz
        </div>
      </div>
      <Plot
        data={[trace]}
        layout={{
          height: 360,
          margin: { t: 40, r: 20, b: 70, l: 60 },
          paper_bgcolor: 'rgba(255,255,255,0)',
          plot_bgcolor: 'rgba(255,255,255,0)',
          xaxis: {
            title: { text: 'Frequency (Hz)', font: { size: 12, color: 'rgba(214,205,196,0.78)' } },
            range: [0, 60],
            gridcolor: 'rgba(115, 132, 181, 0.2)',
            tickfont: { size: 11, color: 'rgba(236,229,220,0.75)' }
          },
          yaxis: {
            title: { text: 'Power', font: { size: 12, color: 'rgba(214,205,196,0.78)' } },
            gridcolor: 'rgba(115, 132, 181, 0.2)',
            tickfont: { size: 11, color: 'rgba(236,229,220,0.75)' }
          },
          shapes,
          annotations,
          hoverlabel: {
            bgcolor: 'rgba(17,14,26,0.9)',
            font: { size: 11, color: 'rgba(249,245,236,0.96)' }
          },
          showlegend: false,
          transition: {
            duration: 300,
            easing: 'cubic-in-out'
          }
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          toImageButtonOptions: {
            format: 'png',
            filename: 'power-spectrum',
            height: 360,
            width: 900,
            scale: 2
          }
        }}
        className="w-full"
      />
    </div>
  );
};
