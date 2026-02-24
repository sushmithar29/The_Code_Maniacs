import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BlochVector, NoiseParams } from '../types/quantum';

interface UseTimeEvolutionArgs {
  initialState: BlochVector;
  noise: NoiseParams;
}

interface UseTimeEvolutionResult {
  state: BlochVector;
  history: BlochVector[];
  running: boolean;
  setRunning: React.Dispatch<React.SetStateAction<boolean>>;
  resetTo: (vector: BlochVector) => void;
  scrubToIndex: (index: number) => void;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function length(v: BlochVector) {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

function evolve(prev: BlochVector, noise: NoiseParams): BlochVector {
  const speed = clamp(noise.speed || 1, 0.1, 10);

  let x = prev.x;
  let y = prev.y;
  let z = prev.z;

  if (Math.random() < noise.bitFlip * 0.04 * speed) {
    y = -y;
    z = -z;
  }

  if (Math.random() < noise.phaseFlip * 0.04 * speed) {
    x = -x;
    y = -y;
  }

  const dephase = clamp(1 - (noise.phaseFlip + noise.depolarizing) * 0.02 * speed, 0, 1);
  x *= dephase;
  y *= dephase;

  const damp = clamp(noise.amplitudeDamping * 0.02 * speed, 0, 1);
  z = z * (1 - damp) + damp;
  x *= 1 - damp * 0.6;
  y *= 1 - damp * 0.6;

  const depFactor = clamp(1 - noise.depolarizing * 0.03 * speed, 0, 1);
  x *= depFactor;
  y *= depFactor;
  z *= depFactor;

  const L = length({ x, y, z });
  if (L > 1) {
    x /= L;
    y /= L;
    z /= L;
  }

  return { x, y, z };
}

export function useTimeEvolution({ initialState, noise }: UseTimeEvolutionArgs): UseTimeEvolutionResult {
  const initial = useMemo(() => ({ ...initialState }), [initialState]);
  const [state, setState] = useState<BlochVector>(initial);
  const [history, setHistory] = useState<BlochVector[]>([initial]);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const tickMs = Math.max(16, 70 / (noise.speed || 1));
    const id = window.setInterval(() => {
      setState((prev) => {
        const next = evolve(prev, noise);
        setHistory((h) => [...h.slice(-600), next]);
        return next;
      });
    }, tickMs);

    return () => window.clearInterval(id);
  }, [running, noise]);

  const resetTo = useCallback((vector: BlochVector) => {
    const v = { ...vector };
    setState(v);
    setHistory([v]);
  }, []);

  const scrubToIndex = useCallback((index: number) => {
    setHistory((h) => {
      if (!h.length) return h;
      const i = clamp(index, 0, h.length - 1);
      setState(h[i]);
      return h;
    });
  }, []);

  return { state, history, running, setRunning, resetTo, scrubToIndex };
}
