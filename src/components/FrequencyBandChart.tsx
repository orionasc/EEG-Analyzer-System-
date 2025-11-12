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
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Frequency Band Distribution</h3>
      <div className="mb-4">
        <Plot
          data={[trace]}
          layout={{
            height: 300,
            margin: { t: 10, r: 20, b: 70, l: 60 },
            xaxis: {
              title: {
                text: 'Frequency Band',
                font: { size: 13, color: '#4b5563' }
              },
              tickangle: -45,
              tickfont: { size: 11, color: '#6b7280' }
            },
            yaxis: {
              title: {
                text: 'Average Power',
                font: { size: 13, color: '#4b5563' }
              },
              gridcolor: '#e5e7eb',
              tickfont: { size: 11, color: '#6b7280' }
            },
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
      <div className="grid grid-cols-1 gap-2">
        {bandData.map((band, idx) => (
          <div key={idx} className="flex items-center bg-gray-50 rounded p-2.5 border border-gray-200">
            <div
              className="w-3 h-3 rounded flex-shrink-0"
              style={{
                backgroundColor: ['#9C27B0', '#673AB7', '#2196F3', '#FF9800', '#F44336'][idx]
              }}
            />
            <div className="ml-3 flex-1 min-w-0">
              <span className="font-medium text-sm text-gray-900">{band.name}</span>
              <span className="text-xs text-gray-500 ml-2">({band.range[0]}-{band.range[1]} Hz)</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {band.power.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
