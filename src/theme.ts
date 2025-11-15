export type ActivationLevel = 'idle' | 'engaged' | 'processing';

export const themeTokens = {
  palette: {
    surfaceCream: '#f5ede1',
    surfaceCharcoal: '#161321',
    surfaceOverlay: 'rgba(19, 16, 28, 0.82)',
    surfaceOverlaySoft: 'rgba(19, 16, 28, 0.62)',
    surfaceOutline: 'rgba(128, 122, 169, 0.35)',
    surfaceOutlineBright: 'rgba(198, 188, 255, 0.45)',
    textPrimary: '#f9f5ec',
    textSecondary: 'rgba(240, 233, 222, 0.78)',
    textMuted: 'rgba(214, 205, 196, 0.6)',
    accentSignal: '#ffb648',
    accentSignalSoft: 'rgba(255, 182, 72, 0.35)',
    pathwayBlue: '#6b92ff',
    pathwayViolet: '#8f6fff',
    pathwayCyan: '#69d9ff',
    pathwayCyanSoft: 'rgba(105, 217, 255, 0.42)',
    pathwayVioletSoft: 'rgba(143, 111, 255, 0.38)',
    danger: '#ff6b6b',
    success: '#44d19d',
  },
  typography: {
    fontFamily: "'Work Sans', 'Inter', 'Segoe UI', sans-serif",
    mono: "'IBM Plex Mono', 'SFMono-Regular', 'Menlo', monospace",
    baseSize: '14px',
    headingTracking: '0.08em',
  },
  radii: {
    slab: '24px',
    block: '20px',
    node: '999px',
  },
  shadows: {
    layered: '0 26px 60px rgba(8, 4, 18, 0.52)',
    innerGlow: '0 0 32px rgba(105, 217, 255, 0.18)',
    node: '0 0 28px rgba(105, 217, 255, 0.35)',
  },
  animation: {
    nodePulse: 'cl-node-pulse 1.1s ease-out',
    backgroundFlow: 18000,
    engagedFlow: 32000,
    processingFlow: 5200,
  },
  activation: {
    idle: { flow: 0.18, glow: 0.12 },
    engaged: { flow: 0.38, glow: 0.32 },
    processing: { flow: 0.78, glow: 0.7 },
  },
} as const;

const cssVariableMap: Record<string, string> = {
  '--cl-surface-cream': themeTokens.palette.surfaceCream,
  '--cl-surface-charcoal': themeTokens.palette.surfaceCharcoal,
  '--cl-surface-overlay': themeTokens.palette.surfaceOverlay,
  '--cl-surface-overlay-soft': themeTokens.palette.surfaceOverlaySoft,
  '--cl-surface-outline': themeTokens.palette.surfaceOutline,
  '--cl-surface-outline-bright': themeTokens.palette.surfaceOutlineBright,
  '--cl-text-primary': themeTokens.palette.textPrimary,
  '--cl-text-secondary': themeTokens.palette.textSecondary,
  '--cl-text-muted': themeTokens.palette.textMuted,
  '--cl-accent-signal': themeTokens.palette.accentSignal,
  '--cl-accent-signal-soft': themeTokens.palette.accentSignalSoft,
  '--cl-pathway-blue': themeTokens.palette.pathwayBlue,
  '--cl-pathway-violet': themeTokens.palette.pathwayViolet,
  '--cl-pathway-cyan': themeTokens.palette.pathwayCyan,
  '--cl-pathway-cyan-soft': themeTokens.palette.pathwayCyanSoft,
  '--cl-pathway-violet-soft': themeTokens.palette.pathwayVioletSoft,
  '--cl-danger': themeTokens.palette.danger,
  '--cl-success': themeTokens.palette.success,
  '--cl-font-sans': themeTokens.typography.fontFamily,
  '--cl-font-mono': themeTokens.typography.mono,
  '--cl-base-size': themeTokens.typography.baseSize,
  '--cl-shadow-layered': themeTokens.shadows.layered,
  '--cl-shadow-node': themeTokens.shadows.node,
  '--cl-shadow-inner': themeTokens.shadows.innerGlow,
  '--cl-radius-slab': themeTokens.radii.slab,
  '--cl-radius-block': themeTokens.radii.block,
  '--cl-radius-node': themeTokens.radii.node,
};

export const applyThemeTokens = () => {
  const root = document.documentElement;
  Object.entries(cssVariableMap).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
};

export const getActivationProfile = (level: ActivationLevel) => {
  return themeTokens.activation[level];
};
