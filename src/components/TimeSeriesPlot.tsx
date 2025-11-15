import Plot from 'react-plotly.js';
import type { EEGChannel } from '../types';
import { themeTokens } from '../theme';

interface TimeSeriesPlotProps {
  channels: EEGChannel[];
  duration: number;
}

const channelColors = [
  themeTokens.palette.pathwayCyan,
  themeTokens.palette.pathwayViolet,
  '#7bb3ff',
  themeTokens.palette.accentSignal
];

export const TimeSeriesPlot: React.FC<TimeSeriesPlotProps> = ({ channels, duration }) => {
  const displayedChannels = channels.slice(0, 4);

  const traces = displayedChannels.map((channel, index) => {
    const timePoints = channel.data.map((_, i) => i / channel.samplingRate);
    return {
      x: timePoints,
      y: channel.data,
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: channel.name,
      line: {
        width: 1.6,
        color: channelColors[index % channelColors.length]
      }
    };
  });

  return (
    <div className="rounded-2xl border border-[rgba(198,188,255,0.18)] bg-[rgba(17,13,28,0.78)] p-5 shadow-[0_24px_48px_rgba(8,4,18,0.45)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[rgba(214,205,196,0.72)]">
        <span>Operational · plotting EEG waveform stack</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(105,217,255,0.3)] bg-[rgba(105,217,255,0.12)] px-2.5 py-1 text-xs text-[rgba(105,217,255,0.9)]">
          <span className="h-2 w-2 rounded-full bg-[rgba(105,217,255,0.8)] shadow-[0_0_10px_rgba(105,217,255,0.6)]" aria-hidden />
          Ready
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(198,188,255,0.14)] pb-3">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[rgba(249,245,236,0.95)]">Time series overview</h3>
          <p className="text-xs text-[rgba(214,205,196,0.7)]">
            Displaying {displayedChannels.length} of {channels.length} channels · {duration.toFixed(1)}s window
          </p>
        </div>
      </div>
      <Plot
        data={traces}
        layout={{
          height: 420,
          margin: { t: 20, r: 20, b: 60, l: 60 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          xaxis: {
            title: { text: 'Time (seconds)', font: { size: 12, color: 'rgba(214,205,196,0.78)' } },
            gridcolor: 'rgba(115, 132, 181, 0.18)',
            zeroline: false,
            tickfont: { size: 11, color: 'rgba(236,229,220,0.75)' }
          },
          yaxis: {
            title: { text: 'Amplitude (µV)', font: { size: 12, color: 'rgba(214,205,196,0.78)' } },
            gridcolor: 'rgba(115, 132, 181, 0.18)',
            zeroline: false,
            tickfont: { size: 11, color: 'rgba(236,229,220,0.75)' }
          },
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: 1.05,
            xanchor: 'right',
            x: 1,
            bgcolor: 'rgba(15, 12, 24, 0.7)',
            bordercolor: 'rgba(198,188,255,0.25)',
            borderwidth: 1,
            font: { size: 11, color: 'rgba(249,245,236,0.92)' }
          },
          hovermode: 'x unified',
          hoverlabel: {
            bgcolor: 'rgba(17,14,26,0.9)',
            font: { size: 11, color: 'rgba(249,245,236,0.96)' }
          },
          shapes: [
            {
              type: 'rect',
              xref: 'paper',
              yref: 'paper',
              x0: 0,
              x1: 1,
              y0: 0,
              y1: 1,
              line: { width: 0 },
              fillcolor: 'rgba(30, 26, 44, 0.35)'
            }
          ],
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
            filename: 'eeg-time-series',
            height: 420,
            width: 900,
            scale: 2
          }
        }}
        className="w-full"
      />
    </div>
  );
};
