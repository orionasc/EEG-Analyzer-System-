import Plot from 'react-plotly.js';
import type { FrequencyBands } from '../types';

interface FrequencyBandChartProps {
  bands: FrequencyBands;
}

export const FrequencyBandChart: React.FC<FrequencyBandChartProps> = ({ bands }) => {
  const bandData = Object.values(bands);

  const trace = {
    x: bandData.map(b => b.name),
    y: bandData.map(b => b.power),
    type: 'bar' as const,
    marker: {
      color: ['#9C27B0', '#673AB7', '#2196F3', '#FF9800', '#F44336'],
      opacity: 0.8
    },
    text: bandData.map(b => `${b.range[0]}-${b.range[1]} Hz`),
    textposition: 'auto' as const,
    hovertemplate: '<b>%{x}</b><br>' +
      'Power: %{y:.4f}<br>' +
      'Range: %{text}<br>' +
      '<extra></extra>'
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Frequency Band Distribution</h3>
      <Plot
        data={[trace]}
        layout={{
          height: 350,
          margin: { t: 20, r: 20, b: 80, l: 60 },
          xaxis: {
            title: { text: 'Frequency Band' },
            tickangle: -45
          },
          yaxis: {
            title: { text: 'Average Power' },
            gridcolor: '#e0e0e0'
          },
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
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {bandData.map((band, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <div
              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
              style={{
                backgroundColor: ['#9C27B0', '#673AB7', '#2196F3', '#FF9800', '#F44336'][idx]
              }}
            />
            <div>
              <span className="font-medium">{band.name}:</span>
              <span className="text-gray-600 ml-1">{band.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
