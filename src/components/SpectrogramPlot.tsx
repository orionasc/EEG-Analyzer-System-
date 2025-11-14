import Plot from 'react-plotly.js';
import type { SpectrogramData } from '../types';

interface SpectrogramPlotProps {
  spectrogram: SpectrogramData;
}

export const SpectrogramPlot: React.FC<SpectrogramPlotProps> = ({ spectrogram }) => {
  const { times, frequencies, magnitudes } = spectrogram;

  const heatmap = {
    z: magnitudes,
    x: times,
    y: frequencies,
    type: 'heatmap' as const,
    colorscale: 'Electric' as const,
    showscale: true,
    colorbar: {
      title: { text: 'Power (dB)', side: 'right' as const, font: { size: 11, color: '#cbd5f5' } },
      thickness: 12,
      tickfont: { size: 11, color: '#cbd5f5' }
    },
    hovertemplate:
      '<b>%{y:.1f} Hz</b><br>Time: %{x:.2f} s<br>Power: %{z:.2f} dB<extra></extra>'
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>Time-frequency energy distribution</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-fuchsia-200">
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.6)]" aria-hidden />
          Spectrogram
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-white">Spectrogram view</h3>
          <p className="text-xs text-slate-300">Sliding FFT analysis with 50% overlap</p>
        </div>
      </div>
      <Plot
        data={[heatmap]}
        layout={{
          height: 360,
          margin: { t: 30, r: 40, b: 60, l: 60 },
          paper_bgcolor: 'rgba(255,255,255,0)',
          plot_bgcolor: 'rgba(255,255,255,0)',
          xaxis: {
            title: { text: 'Time (s)', font: { size: 12, color: '#94a3b8' } },
            gridcolor: 'rgba(148, 163, 184, 0.12)',
            tickfont: { size: 11, color: '#cbd5f5' }
          },
          yaxis: {
            title: { text: 'Frequency (Hz)', font: { size: 12, color: '#94a3b8' } },
            gridcolor: 'rgba(148, 163, 184, 0.12)',
            tickfont: { size: 11, color: '#cbd5f5' }
          },
          hoverlabel: {
            bgcolor: 'rgba(15,23,42,0.9)',
            font: { size: 11, color: '#f8fafc' }
          },
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
            filename: 'spectrogram',
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
