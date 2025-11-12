import Plot from 'react-plotly.js';
import type { SignalAnalysis } from '../types';

interface SpectrogramPlotProps {
  analysis: SignalAnalysis;
}

export const SpectrogramPlot: React.FC<SpectrogramPlotProps> = ({ analysis }) => {
  const { frequencies, powers } = analysis.spectralData;

  // Filter to show only relevant frequency range (0-50 Hz)
  const filteredData = frequencies
    .map((freq, idx) => ({ freq, power: powers[idx] }))
    .filter(d => d.freq <= 50);

  const trace = {
    x: filteredData.map(d => d.freq),
    y: filteredData.map(d => d.power),
    type: 'scatter' as const,
    fill: 'tozeroy' as const,
    fillcolor: 'rgba(33, 150, 243, 0.3)',
    line: {
      color: '#2196F3',
      width: 2
    },
    name: 'Power Spectral Density'
  };

  // Add markers for frequency bands
  const bandMarkers = [
    { freq: 2, label: 'Delta', color: '#9C27B0' },
    { freq: 6, label: 'Theta', color: '#673AB7' },
    { freq: 10, label: 'Alpha', color: '#2196F3' },
    { freq: 20, label: 'Beta', color: '#FF9800' },
    { freq: 40, label: 'Gamma', color: '#F44336' }
  ];

  const shapes = bandMarkers.map(marker => ({
    type: 'line' as const,
    x0: marker.freq,
    x1: marker.freq,
    y0: 0,
    y1: Math.max(...powers) * 0.8,
    line: {
      color: marker.color,
      width: 2,
      dash: 'dash' as const
    }
  }));

  const annotations = bandMarkers.map(marker => ({
    x: marker.freq,
    y: Math.max(...powers) * 0.85,
    text: marker.label,
    showarrow: false,
    font: {
      size: 10,
      color: marker.color
    }
  }));

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Power Spectrum</h3>
      <div>
        <Plot
          data={[trace]}
          layout={{
            height: 300,
            margin: { t: 10, r: 20, b: 50, l: 60 },
            xaxis: {
              title: {
                text: 'Frequency (Hz)',
                font: { size: 13, color: '#4b5563' }
              },
              range: [0, 50],
              gridcolor: '#e5e7eb',
              tickfont: { size: 11, color: '#6b7280' }
            },
            yaxis: {
              title: {
                text: 'Power',
                font: { size: 13, color: '#4b5563' }
              },
              gridcolor: '#e5e7eb',
              tickfont: { size: 11, color: '#6b7280' }
            },
            shapes,
            annotations,
            plot_bgcolor: '#ffffff',
            paper_bgcolor: 'transparent',
            showlegend: false,
            hoverlabel: {
              bgcolor: '#1f2937',
              font: { size: 11, color: '#ffffff' },
              bordercolor: '#374151'
            }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};
