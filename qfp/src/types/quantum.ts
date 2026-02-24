export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export interface NoiseParams {
  depolarizing: number;
  phaseFlip: number;
  bitFlip: number;
  amplitudeDamping: number;
  speed: number;
}

export type PresetState = 'plus' | 'minus' | 'zero' | 'one';

export const PRESET_VECTORS: Record<PresetState, BlochVector> = {
  plus: { x: 1, y: 0, z: 0 },
  minus: { x: -1, y: 0, z: 0 },
  zero: { x: 0, y: 0, z: 1 },
  one: { x: 0, y: 0, z: -1 },
};

export type GateId = 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT';

export interface Gate {
  id: GateId;
  angle?: number;
}

export interface CircuitGate {
  gate: GateId | 'CX' | 'M' | 'measure' | 'Rx' | 'Ry' | 'Rz';
  qubit?: number;
  target?: number;
  angle?: number;
  id?: GateId;
}

export type BellOutcomeCounts = {
  '00': number;
  '01': number;
  '10': number;
  '11': number;
};

export type GhzOutcomeCounts = {
  '000': number;
  '001': number;
  '010': number;
  '011': number;
  '100': number;
  '101': number;
  '110': number;
  '111': number;
};

export interface Bb84RunConfig {
  rounds: number;
  withEve: boolean;
}

export interface Bb84TraceRow {
  id: number;
  aliceBit: 0 | 1;
  aliceBasis: 'Z' | 'X';
  eveBasis: 'Z' | 'X' | '-';
  bobBasis: 'Z' | 'X';
  bobBit: 0 | 1;
  keep: boolean;
  error: boolean;
}

export interface Bb84RunSummary {
  rounds: number;
  siftedKeyLength: number;
  errorRate: number;
  trace: Bb84TraceRow[];
}

export interface SternGerlachConfig {
  angleDegrees: number;
}

export interface SternGerlachResult {
  outcome: 'up' | 'down';
  probUp: number;
  probDown: number;
}
