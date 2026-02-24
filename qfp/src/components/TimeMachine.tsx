import React from 'react';
import type { BlochVector } from '../types/quantum';

type TimeMachineProps = {
  history: BlochVector[];
  onScrub: (index: number) => void;
  currentIndex: number;
  isRunning: boolean;
  onTogglePlay: () => void;
};

export default function TimeMachine({ history, onScrub, currentIndex, isRunning, onTogglePlay }: TimeMachineProps) {
  const maxIndex = Math.max(0, history.length - 1);
  const value = Math.max(0, Math.min(currentIndex, maxIndex));

  return (
    <div className="p-16 rounded-2xl border border-brand-border bg-surface/30 flex flex-col gap-10" id="time-machine">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-orbitron uppercase tracking-[2px] text-text-muted">Time Machine</div>
        <button onClick={onTogglePlay} className="btn btn-secondary !px-12 !py-6 text-[10px]">
          {isRunning ? 'Pause' : 'Play'}
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={maxIndex}
        step={1}
        value={value}
        onChange={(e) => onScrub(parseInt(e.target.value, 10))}
        className="w-full h-4 bg-brand-border rounded-full appearance-none cursor-pointer accent-brand-primary"
      />
      <div className="text-[10px] text-text-muted font-mono">
        Step {value} / {maxIndex}
      </div>
    </div>
  );
}
