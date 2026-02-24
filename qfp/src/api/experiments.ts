import type { BellOutcomeCounts } from '../types/quantum';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export async function runBell(shots: number): Promise<BellOutcomeCounts> {
  const res = await fetch(`${API_BASE_URL}/api/experiments/bell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shots }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bell API failed (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as BellOutcomeCounts;
}
