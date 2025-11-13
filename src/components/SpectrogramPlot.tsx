import Plot from 'react-plotly.js';
import type { SignalAnalysis } from '../types';

interface SpectrogramPlotProps {
  analysis: SignalAnalysis;
}

const bandStyles = [
  { label: 'Delta', range: [0.5, 4], color: 'rgba(139, 92, 246, 0.08)' },
  { label: 'Theta', range: [4, 8], color: 'rgba(59, 130, 246, 0.08)' },
  { label: 'Alpha', range: [8, 13], color: 'rgba(20, 184, 166, 0.08)' },
  { label: 'Beta', range: [13, 30], color: 'rgba(16, 185, 129, 0.08)' },
  { label: 'Gamma', range: [30, 50], color: 'rgba(245, 158, 11, 0.08)' }
];

export const SpectrogramPlot: React.FC<SpectrogramPlotProps> = ({ analysis }) => {
  const { frequencies, powers } = analysis.spectralData;
  const filtered = frequencies
    .map((freq, idx) => ({ freq, power: powers[idx] }))
    .filter((point) => point.freq <= 60);

  const trace = {
    x: filtered.map((p) => p.freq),
    y: filtered.map((p) => p.power),
    type: 'scatter' as const,
    mode: 'lines' as const,
    fill: 'tozeroy' as const,
    line: {
      color: 'rgba(59, 130, 246, 1)',
      width: 2.6
    },
    fillcolor: 'rgba(59, 130, 246, 0.15)',
    hovertemplate:
      '<b>%{x:.1f} Hz</b><br>Power: %{y:.3f}<extra></extra>'
  };

  const shapes = bandStyles.map((band) => ({
    type: 'rect' as const,
    xref: 'x' as const,
    yref: 'paper' as const,
    x0: band.range[0],
    x1: band.range[1],
    y0: 0,
    y1: 1,
    fillcolor: band.color,
    line: { width: 0 }
  }));

  const annotations = bandStyles.map((band) => ({
    x: (band.range[0] + band.range[1]) / 2,
    y: 1.05,
    text: band.label,
    showarrow: false,
    font: { size: 11, color: '#475569' }
  }));

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>Real-time spectral energy profile</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(0,200,255,0.5)]" aria-hidden />
          PSD curve
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-white">Power spectrum</h3>
          <p className="text-xs text-slate-300">Frequency distribution with band annotations</p>
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
            title: { text: 'Frequency (Hz)', font: { size: 12, color: '#94a3b8' } },
            range: [0, 60],
            gridcolor: 'rgba(148, 163, 184, 0.2)',
            tickfont: { size: 11, color: '#cbd5f5' }
          },
          yaxis: {
            title: { text: 'Power', font: { size: 12, color: '#94a3b8' } },
            gridcolor: 'rgba(148, 163, 184, 0.2)',
            tickfont: { size: 11, color: '#cbd5f5' }
          },
          shapes,
          annotations,
          hoverlabel: {
            bgcolor: 'rgba(15,23,42,0.9)',
            font: { size: 11, color: '#f8fafc' }
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
