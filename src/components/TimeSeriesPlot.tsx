import Plot from 'react-plotly.js';
import type { EEGChannel } from '../types';

interface TimeSeriesPlotProps {
  channels: EEGChannel[];
  duration: number;
}

export const TimeSeriesPlot: React.FC<TimeSeriesPlotProps> = ({ channels }) => {
  const traces = channels.slice(0, 4).map((channel, index) => {
    const timePoints = channel.data.map((_, i) => i / channel.samplingRate);

    return {
      x: timePoints,
      y: channel.data.map(v => v + index * 10), // Offset each channel for visibility
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: channel.name,
      line: {
        width: 1,
        color: ['#2196F3', '#4CAF50', '#FF9800', '#E91E63'][index % 4]
      }
    };
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">EEG Time Series</h3>
      <Plot
        data={traces}
        layout={{
          height: 400,
          margin: { t: 20, r: 20, b: 40, l: 60 },
          xaxis: {
            title: { text: 'Time (seconds)' },
            gridcolor: '#e0e0e0',
            zeroline: false
          },
          yaxis: {
            title: { text: 'Amplitude (µV)' },
            gridcolor: '#e0e0e0',
            zeroline: false
          },
          showlegend: true,
          legend: {
            x: 1.05,
            y: 1,
            orientation: 'v' as const
          },
          plot_bgcolor: '#fafafa',
          paper_bgcolor: '#ffffff',
          hovermode: 'closest' as const
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d']
        }}
        className="w-full"
      />
    </div>
  );
};
