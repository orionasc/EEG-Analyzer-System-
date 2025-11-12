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
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Power Spectrum</h3>
      <Plot
        data={[trace]}
        layout={{
          height: 350,
          margin: { t: 20, r: 20, b: 50, l: 60 },
          xaxis: {
            title: { text: 'Frequency (Hz)' },
            range: [0, 50],
            gridcolor: '#e0e0e0'
          },
          yaxis: {
            title: { text: 'Power' },
            gridcolor: '#e0e0e0'
          },
          shapes,
          annotations,
          plot_bgcolor: '#fafafa',
          paper_bgcolor: '#ffffff',
          showlegend: false
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false
        }}
        className="w-full"
      />
    </div>
  );
};
