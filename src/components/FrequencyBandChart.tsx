import type { FrequencyBands } from '../types';

interface FrequencyBandChartProps {
  bands: FrequencyBands;
}

const gradientMap: Record<string, string> = {
  Delta: 'from-purple-400 via-purple-500 to-purple-600',
  Theta: 'from-blue-400 via-blue-500 to-blue-600',
  Alpha: 'from-teal-400 via-teal-500 to-teal-600',
  Beta: 'from-emerald-400 via-emerald-500 to-emerald-600',
  Gamma: 'from-amber-400 via-amber-500 to-amber-600'
};

export const FrequencyBandChart: React.FC<FrequencyBandChartProps> = ({ bands }) => {
  const bandEntries = Object.values(bands);
  const totalPower = bandEntries.reduce((sum, band) => sum + band.power, 0);

  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-lg shadow-black/10">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h3 className="text-sm font-medium text-slate-900">Frequency Band Distribution</h3>
        <p className="text-[11px] text-slate-500">Relative power across canonical EEG bands</p>
      </div>

      <div className="space-y-4">
        {bandEntries.map((band) => {
          const percentage = totalPower > 0 ? (band.power / totalPower) * 100 : 0;
          const gradient = gradientMap[band.name] ?? 'from-slate-400 via-slate-500 to-slate-600';
          const fillWidth = Math.max(percentage, percentage > 0 ? 6 : 0);
          return (
            <div key={band.name} className="space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-700">{band.name}</span>
                  <span className="text-[11px] text-slate-400">{band.range[0]}–{band.range[1]} Hz</span>
                </div>
                <span className="font-mono text-[12px] text-slate-600">{band.power.toFixed(3)} μV²</span>
              </div>
              <div className="relative h-8 rounded-lg bg-slate-100">
                <div
                  className={`absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r ${gradient}`}
                  style={{ width: `${Math.min(fillWidth, 100)}%` }}
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-[11px] font-medium text-slate-700">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
