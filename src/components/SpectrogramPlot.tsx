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
    <div className="rounded-3xl border border-white/40 bg-white/85 backdrop-blur p-6 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Spectrum</p>
          <h3 className="text-xl font-semibold text-gray-900">Power Spectrum Analysis</h3>
          <p className="text-xs text-gray-500 mt-1">Frequency distribution and band emphasis</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            PSD Curve
          </span>
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
            title: { text: 'Frequency (Hz)', font: { size: 12, color: '#6b7280' } },
            range: [0, 60],
            gridcolor: 'rgba(148, 163, 184, 0.12)',
            tickfont: { size: 11, color: '#4b5563' }
          },
          yaxis: {
            title: { text: 'Power', font: { size: 12, color: '#6b7280' } },
            gridcolor: 'rgba(148, 163, 184, 0.12)',
            tickfont: { size: 11, color: '#4b5563' }
          },
          shapes,
          annotations,
          hoverlabel: {
            bgcolor: '#111827',
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
