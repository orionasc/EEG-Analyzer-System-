import Plot from 'react-plotly.js';
import type { EEGChannel } from '../types';

interface TimeSeriesPlotProps {
  channels: EEGChannel[];
  duration: number;
}

const channelColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

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
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <span>Operational · plotting EEG waveform stack</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.65)]" aria-hidden />
          Ready
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-white">Time series overview</h3>
          <p className="text-xs text-slate-300">
            Displaying {displayedChannels.length} of {channels.length} channels · {duration.toFixed(1)}s window
          </p>
        </div>
      </div>
      <Plot
        data={traces}
        layout={{
          height: 420,
          margin: { t: 20, r: 20, b: 60, l: 60 },
          paper_bgcolor: 'rgba(255,255,255,0)',
          plot_bgcolor: 'rgba(255,255,255,0)',
          xaxis: {
            title: { text: 'Time (seconds)', font: { size: 12, color: '#94a3b8' } },
            gridcolor: 'rgba(148, 163, 184, 0.18)',
            zeroline: false,
            tickfont: { size: 11, color: '#cbd5f5' }
          },
          yaxis: {
            title: { text: 'Amplitude (µV)', font: { size: 12, color: '#94a3b8' } },
            gridcolor: 'rgba(148, 163, 184, 0.18)',
            zeroline: false,
            tickfont: { size: 11, color: '#cbd5f5' }
          },
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: 1.05,
            xanchor: 'right',
            x: 1,
            bgcolor: 'rgba(8, 11, 20, 0.7)',
            bordercolor: 'rgba(148, 163, 184, 0.4)',
            borderwidth: 1,
            font: { size: 11, color: '#e2e8f0' }
          },
          hovermode: 'x unified',
          hoverlabel: {
            bgcolor: 'rgba(15,23,42,0.9)',
            font: { size: 11, color: '#f8fafc' }
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
              fillcolor: 'rgba(15, 23, 42, 0.03)'
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
