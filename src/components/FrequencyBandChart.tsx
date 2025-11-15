import type { FrequencyBands } from '../types';

interface FrequencyBandChartProps {
  bands: FrequencyBands;
}

const gradientMap: Record<string, string> = {
  Delta: 'linear-gradient(90deg, rgba(143,111,255,0.85), rgba(105,217,255,0.8))',
  Theta: 'linear-gradient(90deg, rgba(105,217,255,0.85), rgba(123,179,255,0.8))',
  Alpha: 'linear-gradient(90deg, rgba(123,179,255,0.85), rgba(255,182,72,0.7))',
  Beta: 'linear-gradient(90deg, rgba(255,182,72,0.85), rgba(255,214,159,0.8))',
  Gamma: 'linear-gradient(90deg, rgba(255,214,159,0.85), rgba(249,245,236,0.8))'
};

export const FrequencyBandChart: React.FC<FrequencyBandChartProps> = ({ bands }) => {
  const bandEntries = Object.values(bands);
  const totalPower = bandEntries.reduce((sum, band) => sum + band.power, 0);

  return (
    <div className="rounded-2xl border border-[rgba(198,188,255,0.2)] bg-[rgba(17,13,28,0.78)] p-5 text-[rgba(236,229,220,0.82)] shadow-[0_24px_48px_rgba(8,4,18,0.45)]">
      <div className="mb-4 border-b border-[rgba(198,188,255,0.16)] pb-3">
        <h3 className="text-sm font-medium text-[rgba(249,245,236,0.95)]">Frequency Band Distribution</h3>
        <p className="text-[11px] text-[rgba(214,205,196,0.7)]">Relative power across canonical EEG bands</p>
      </div>

      <div className="space-y-4">
        {bandEntries.map((band) => {
          const percentage = totalPower > 0 ? (band.power / totalPower) * 100 : 0;
          const gradient = gradientMap[band.name] ?? 'linear-gradient(90deg, rgba(105,217,255,0.45), rgba(143,111,255,0.4))';
          const fillWidth = Math.max(percentage, percentage > 0 ? 6 : 0);
          return (
            <div key={band.name} className="space-y-2">
              <div className="flex items-center justify-between text-[12px] text-[rgba(236,229,220,0.82)]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[rgba(249,245,236,0.95)]">{band.name}</span>
                  <span className="text-[11px] text-[rgba(214,205,196,0.65)]">{band.range[0]}–{band.range[1]} Hz</span>
                </div>
                <span className="font-mono text-[12px] text-[rgba(105,217,255,0.85)]">{band.power.toFixed(3)} μV²</span>
              </div>
              <div className="relative h-8 rounded-lg border border-[rgba(198,188,255,0.2)] bg-[rgba(15,12,24,0.72)]">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg"
                  style={{ width: `${Math.min(fillWidth, 100)}%`, background: gradient, boxShadow: '0 0 18px rgba(105,217,255,0.25)' }}
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-[11px] font-medium text-[rgba(236,229,220,0.78)]">
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
