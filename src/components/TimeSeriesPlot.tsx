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
    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-lg shadow-black/10">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-slate-900">Time Series Overview</h3>
          <p className="text-[11px] text-slate-500">
            Displaying {displayedChannels.length} of {channels.length} channels · {duration.toFixed(1)}s window
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Ready
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
            title: { text: 'Time (seconds)', font: { size: 12, color: '#6b7280' } },
            gridcolor: 'rgba(148, 163, 184, 0.15)',
            zeroline: false,
            tickfont: { size: 11, color: '#4b5563' }
          },
          yaxis: {
            title: { text: 'Amplitude (µV)', font: { size: 12, color: '#6b7280' } },
            gridcolor: 'rgba(148, 163, 184, 0.15)',
            zeroline: false,
            tickfont: { size: 11, color: '#4b5563' }
          },
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: 1.05,
            xanchor: 'right',
            x: 1,
            bgcolor: 'rgba(248, 250, 252, 0.75)',
            bordercolor: 'rgba(226, 232, 240, 0.9)',
            borderwidth: 1,
            font: { size: 11, color: '#334155' }
          },
          hovermode: 'x unified',
          hoverlabel: {
            bgcolor: '#111827',
            font: { size: 11, color: '#f9fafb' }
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
