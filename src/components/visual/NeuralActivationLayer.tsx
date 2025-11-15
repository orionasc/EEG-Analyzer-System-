import { memo, useEffect, useMemo, useRef } from 'react';
import { getActivationProfile, themeTokens } from '../../theme';
import type { ActivationLevel } from '../../theme';

const NODE_COUNT = 48;
const CONNECTIONS = 3;

type Node = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  velocity: number;
};

type NeuralActivationLayerProps = {
  level: ActivationLevel;
  signalMetric?: number;
};

const ease = (current: number, target: number, factor = 0.05) => current + (target - current) * factor;

export const NeuralActivationLayer = memo(({ level, signalMetric = 0 }: NeuralActivationLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const intensityRef = useRef<{ flow: number; glow: number }>({
    flow: getActivationProfile('idle').flow,
    glow: getActivationProfile('idle').glow,
  });
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<number[][]>([]);
  const phaseRef = useRef(0);
  const levelRef = useRef<ActivationLevel>('idle');
  const signalRef = useRef(signalMetric);

  const baseColorStops = useMemo(() => {
    return [themeTokens.palette.pathwayCyanSoft, themeTokens.palette.pathwayVioletSoft, themeTokens.palette.accentSignalSoft];
  }, []);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    signalRef.current = signalMetric;
  }, [signalMetric]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const initialiseNodes = () => {
      const nodes: Node[] = [];
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (let index = 0; index < NODE_COUNT; index += 1) {
        const radius = 0.6 + Math.random() * 1.8;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          phase: Math.random() * Math.PI * 2,
          velocity: 0.2 + Math.random() * 0.6,
        });
      }

      nodesRef.current = nodes;
      const connections: number[][] = nodes.map(() => []);
      nodes.forEach((node, index) => {
        const distances = nodes
          .map((other, otherIndex) => ({ index: otherIndex, distance: Math.hypot(node.x - other.x, node.y - other.y) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(1, CONNECTIONS + 1);
        connections[index] = distances.map((item) => item.index);
      });
      connectionsRef.current = connections;
    };

    const resize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      initialiseNodes();
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const { flow, glow } = intensityRef.current;
      const nowProfile = getActivationProfile(levelRef.current);
      intensityRef.current = {
        flow: ease(flow, nowProfile.flow, 0.04),
        glow: ease(glow, nowProfile.glow, 0.04),
      };

      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = 'lighter';

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      phaseRef.current += 0.0025 + intensityRef.current.flow * 0.004;

      nodes.forEach((node, index) => {
        const offset = Math.sin(phaseRef.current * node.velocity + node.phase) * 12 * intensityRef.current.flow;
        const offsetY = Math.cos(phaseRef.current * node.velocity + node.phase) * 14 * intensityRef.current.flow;
        const nx = (node.x + offset + displayWidth) % displayWidth;
        const ny = (node.y + offsetY + displayHeight) % displayHeight;

        connections[index].forEach((connectionIndex, connIdx) => {
          const target = nodes[connectionIndex];
          const offsetTarget = Math.sin(phaseRef.current * target.velocity + target.phase) * 10 * intensityRef.current.flow;
          const offsetTargetY = Math.cos(phaseRef.current * target.velocity + target.phase) * 12 * intensityRef.current.flow;
          const tx = (target.x + offsetTarget + displayWidth) % displayWidth;
          const ty = (target.y + offsetTargetY + displayHeight) % displayHeight;

          const gradient = context.createLinearGradient(nx, ny, tx, ty);
          const intensity = 0.25 + intensityRef.current.flow * 0.75 + signalRef.current * 0.12;
          baseColorStops.forEach((color, colorIndex) => {
            gradient.addColorStop(colorIndex / (baseColorStops.length - 1), color);
          });

          context.lineWidth = 0.6 + connIdx * 0.1 + intensityRef.current.flow * 1.2;
          context.strokeStyle = gradient;
          context.globalAlpha = Math.min(0.8, 0.28 + intensity * 0.6);
          context.beginPath();
          const cx = (nx + tx) / 2 + Math.sin(phaseRef.current + index) * 18 * intensityRef.current.flow;
          const cy = (ny + ty) / 2 + Math.cos(phaseRef.current + connectionIndex) * 24 * intensityRef.current.flow;
          context.moveTo(nx, ny);
          context.quadraticCurveTo(cx, cy, tx, ty);
          context.stroke();
        });
      });

      context.globalAlpha = 1;
      nodes.forEach((node) => {
        const offset = Math.sin(phaseRef.current * node.velocity + node.phase) * 12 * intensityRef.current.flow;
        const offsetY = Math.cos(phaseRef.current * node.velocity + node.phase) * 14 * intensityRef.current.flow;
        const nx = (node.x + offset + displayWidth) % displayWidth;
        const ny = (node.y + offsetY + displayHeight) % displayHeight;

        const radial = context.createRadialGradient(nx, ny, 0, nx, ny, 18);
        radial.addColorStop(0, themeTokens.palette.pathwayCyan);
        radial.addColorStop(0.35, themeTokens.palette.pathwayViolet);
        radial.addColorStop(1, 'rgba(18, 14, 26, 0)');
        context.fillStyle = radial;
        context.globalAlpha = 0.4 + intensityRef.current.glow;
        context.beginPath();
        context.arc(nx, ny, 3 + node.radius * 2.2, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [baseColorStops]);

  return <canvas ref={canvasRef} className="cl-neuro-layer" aria-hidden />;
});

NeuralActivationLayer.displayName = 'NeuralActivationLayer';
