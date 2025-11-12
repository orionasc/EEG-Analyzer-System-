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
    <div className="rounded-3xl border border-white/40 bg-white/85 backdrop-blur p-6 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Distribution</p>
          <h3 className="text-xl font-semibold text-gray-900">Frequency Band Distribution</h3>
          <p className="text-xs text-gray-500 mt-1">Relative power across canonical EEG bands</p>
        </div>
        <div className="text-2xl">🧠</div>
      </div>

      <div className="space-y-4">
        {bandEntries.map((band) => {
          const percentage = totalPower > 0 ? (band.power / totalPower) * 100 : 0;
          const gradient = gradientMap[band.name] ?? 'from-slate-400 via-slate-500 to-slate-600';
          const fillWidth = Math.max(percentage, percentage > 0 ? 6 : 0);
          return (
            <div key={band.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{band.name}</span>
                  <span className="text-[11px] text-gray-400">{band.range[0]}–{band.range[1]} Hz</span>
                </div>
                <span className="text-xs font-semibold text-gray-500">{band.power.toFixed(3)} μV²</span>
              </div>
              <div className="relative h-12 rounded-xl bg-gray-100 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r ${gradient} transition-all duration-700`}
                  style={{ width: `${Math.min(fillWidth, 100)}%` }}
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-white drop-shadow-lg">
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
