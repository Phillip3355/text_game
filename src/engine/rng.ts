// mulberry32: small, fast, deterministic. The full RNG state is a single
// 32-bit integer stored in GameState so a saved game replays identically.

export function nextRandom(state: number): { value: number; state: number } {
  let t = (state + 0x6d2b79f5) | 0
  const nextState = t
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  return { value, state: nextState }
}

/** Integer in [0, 100) — used for percentage checks. */
export function rollPercent(state: number): { roll: number; state: number } {
  const r = nextRandom(state)
  return { roll: Math.floor(r.value * 100), state: r.state }
}

export function seedFrom(input: number): number {
  return (input ^ 0x9e3779b9) | 0
}

/** Weighted pick without replacement. Returns picked items and new rng state. */
export function weightedSample<T>(
  items: { item: T; weight: number }[],
  count: number,
  state: number,
): { picked: T[]; state: number } {
  const pool = items.filter((i) => i.weight > 0)
  const picked: T[] = []
  let s = state
  while (picked.length < count && pool.length > 0) {
    const total = pool.reduce((a, b) => a + b.weight, 0)
    const r = nextRandom(s)
    s = r.state
    let x = r.value * total
    let idx = 0
    for (; idx < pool.length - 1; idx++) {
      x -= pool[idx].weight
      if (x < 0) break
    }
    picked.push(pool[idx].item)
    pool.splice(idx, 1)
  }
  return { picked, state: s }
}
