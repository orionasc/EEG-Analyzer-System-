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
    <div className="w-full bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-teal-500 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-gray-800">EEG Time Series</h3>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-xs text-gray-500 font-medium">{channels.length} channels</span>
        </div>
      </div>
      <div className="bg-gray-50/50 rounded-lg p-1">
        <Plot
          data={traces}
          layout={{
            height: 380,
            margin: { t: 10, r: 20, b: 50, l: 60 },
            xaxis: {
              title: {
                text: 'Time (seconds)',
                font: { size: 13, color: '#4b5563' }
              },
              gridcolor: '#e5e7eb',
              zeroline: false,
              tickfont: { size: 11, color: '#6b7280' }
            },
            yaxis: {
              title: {
                text: 'Amplitude (µV)',
                font: { size: 13, color: '#4b5563' }
              },
              gridcolor: '#e5e7eb',
              zeroline: false,
              tickfont: { size: 11, color: '#6b7280' }
            },
            showlegend: true,
            legend: {
              x: 1.02,
              y: 1,
              orientation: 'v' as const,
              font: { size: 11 },
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              bordercolor: '#e5e7eb',
              borderwidth: 1
            },
            plot_bgcolor: '#ffffff',
            paper_bgcolor: 'transparent',
            hovermode: 'closest' as const,
            hoverlabel: {
              bgcolor: '#1f2937',
              font: { size: 11, color: '#ffffff' },
              bordercolor: '#374151'
            }
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
    </div>
  );
};
