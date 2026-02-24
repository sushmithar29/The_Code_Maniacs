import { useCallback, useRef } from 'react';

export type SoundSpec = {
  freq?: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
};

export const soundAtomFire: SoundSpec = { freq: 260, duration: 0.08, type: 'square', gain: 0.08 };
export const soundSpinUp: SoundSpec = { freq: 660, duration: 0.08, type: 'sine', gain: 0.06 };
export const soundSpinDown: SoundSpec = { freq: 340, duration: 0.08, type: 'sine', gain: 0.06 };
export const soundEntanglementFire: SoundSpec = { freq: 420, duration: 0.12, type: 'triangle', gain: 0.08 };
export const soundCorrelated: SoundSpec = { freq: 760, duration: 0.06, type: 'sine', gain: 0.05 };
export const soundAntiCorrelated: SoundSpec = { freq: 220, duration: 0.07, type: 'sawtooth', gain: 0.05 };
export const soundPhotonPop: SoundSpec = { freq: 520, duration: 0.05, type: 'triangle', gain: 0.05 };
export const soundRabiPeak = (freq = 330): SoundSpec => ({ freq, duration: 0.09, type: 'sine', gain: 0.05 });

let humOsc: OscillatorNode | null = null;
let humGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctx) return null;
  return new Ctx();
}

export function startCavityHum(freq: number) {
  const ctx = getAudioContext();
  if (!ctx || humOsc) return;

  humOsc = ctx.createOscillator();
  humGain = ctx.createGain();
  humOsc.type = 'sine';
  humOsc.frequency.value = freq;
  humGain.gain.value = 0.02;
  humOsc.connect(humGain).connect(ctx.destination);
  humOsc.start();
}

export function updateCavityHum(freq: number, level: number) {
  if (!humOsc || !humGain) return;
  humOsc.frequency.setValueAtTime(freq, humOsc.context.currentTime);
  humGain.gain.setValueAtTime(Math.max(0.003, Math.min(0.03, 0.01 + level * 0.02)), humOsc.context.currentTime);
}

export function stopCavityHum() {
  if (!humOsc) return;
  humOsc.stop();
  humOsc.disconnect();
  humGain?.disconnect();
  humOsc = null;
  humGain = null;
}

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = getAudioContext();
    return ctxRef.current;
  }, []);

  const resumeAudio = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
  }, [ensureCtx]);

  const play = useCallback((specOrFactory: SoundSpec | (() => SoundSpec)) => {
    if (!enabled) return;
    const spec = typeof specOrFactory === 'function' ? specOrFactory() : specOrFactory;
    const ctx = ensureCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = spec.type ?? 'sine';
    osc.frequency.value = spec.freq ?? 440;
    gain.gain.value = spec.gain ?? 0.05;

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (spec.duration ?? 0.08));
  }, [enabled, ensureCtx]);

  const updateHealth = useCallback((_health: number, _active: boolean) => {
    // Kept for compatibility with existing lab UI.
  }, []);

  return { play, updateHealth, resumeAudio };
}
