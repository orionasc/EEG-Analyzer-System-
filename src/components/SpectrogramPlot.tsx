import Plot from 'react-plotly.js';
import type { SpectrogramData } from '../types';

interface SpectrogramPlotProps {
  spectrogram: SpectrogramData;
}

export const SpectrogramPlot: React.FC<SpectrogramPlotProps> = ({ spectrogram }) => {
  const { times, frequencies, magnitudes } = spectrogram;

  const colorscale: [number, string][] = [
    [0, 'rgba(19,16,32,1)'],
    [0.22, 'rgba(64,58,104,1)'],
    [0.45, 'rgba(105,217,255,1)'],
    [0.7, 'rgba(143,111,255,1)'],
    [1, 'rgba(255,182,72,1)']
  ];

  const heatmap = {
    z: magnitudes,
    x: times,
    y: frequencies,
    type: 'heatmap' as const,
    colorscale,
    showscale: true,
    colorbar: {
      title: { text: 'Power (dB)', side: 'right' as const, font: { size: 11, color: 'rgba(236,229,220,0.78)' } },
      thickness: 12,
      tickfont: { size: 11, color: 'rgba(236,229,220,0.7)' }
    },
    hovertemplate: '<b>%{y:.1f} Hz</b><br>Time: %{x:.2f} s<br>Power: %{z:.2f} dB<extra></extra>'
  };

  return (
    <div className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(17,13,28,0.78)] px-[var(--cl-h-gutter)] py-5 shadow-[0_24px_48px_rgba(8,4,18,0.45)]">
      <div className="mb-3 flex items-center justify-between text-xs text-[rgba(214,205,196,0.7)]">
        <span>Time-frequency energy distribution</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(143,111,255,0.35)] bg-[rgba(143,111,255,0.12)] px-2.5 py-1 text-xs text-[rgba(143,111,255,0.88)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(143,111,255,0.8)] shadow-[0_0_8px_rgba(143,111,255,0.6)]" aria-hidden />
          Spectrogram
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(198,188,255,0.14)] pb-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[rgba(249,245,236,0.95)]">Spectrogram view</h3>
          <p className="text-xs text-[rgba(214,205,196,0.7)]">Sliding FFT analysis with 50% overlap</p>
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
            title: { text: 'Time (s)', font: { size: 12, color: 'rgba(214,205,196,0.78)' } },
            gridcolor: 'rgba(115, 132, 181, 0.12)',
            tickfont: { size: 11, color: 'rgba(236,229,220,0.7)' }
          },
          yaxis: {
            title: { text: 'Frequency (Hz)', font: { size: 12, color: 'rgba(214,205,196,0.78)' } },
            gridcolor: 'rgba(115, 132, 181, 0.12)',
            tickfont: { size: 11, color: 'rgba(236,229,220,0.7)' }
          },
          hoverlabel: {
            bgcolor: 'rgba(17,14,26,0.9)',
            font: { size: 11, color: 'rgba(249,245,236,0.96)' }
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
