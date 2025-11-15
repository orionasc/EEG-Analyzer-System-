import { memo, useId } from 'react';

interface NeuralDividerProps {
  curvature?: number;
  opacity?: number;
  className?: string;
}

export const NeuralDivider = memo(({ curvature = 0.45, opacity = 1, className = '' }: NeuralDividerProps) => {
  const controlPoint = 50 + curvature * 40;
  const path = `M0 20 C 25 ${controlPoint}, 75 ${40 - curvature * 40}, 100 20`;
  const gradientId = useId();

  return (
    <svg className={`cl-curved-divider ${className}`.trim()} viewBox="0 0 100 40" preserveAspectRatio="none" role="presentation">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(105,217,255,0.12)" />
          <stop offset="50%" stopColor="rgba(143,111,255,0.24)" />
          <stop offset="100%" stopColor="rgba(255,182,72,0.18)" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.4" strokeLinecap="round" strokeOpacity={opacity} className="cl-animate-divider" />
    </svg>
  );
});

NeuralDivider.displayName = 'NeuralDivider';
