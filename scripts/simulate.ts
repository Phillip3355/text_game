// Usage: npx tsx scripts/simulate.ts [runsPerCombo]
import { content } from '../src/content'
import { simulate } from '../src/engine/simulate'
import type { Strategy } from '../src/engine/simulate'
import type { TravelerId } from '../src/engine/types'

const runs = Number(process.argv[2] ?? 200)
const travelers: TravelerId[] = ['linguist', 'foodie', 'wanderer']
const strategies: Strategy[] = ['random', 'greedy', 'chinese', 'food', 'culture', 'lowstat', 'broke', 'passive']
const seen = new Map<string, number>()
const endingsAll = new Map<string, number>()
console.log('traveler  strategy   avg  min  max  events  endings')
for (const t of travelers) {
  for (const st of strategies) {
    const scores: number[] = []
    const ends = new Map<string, number>()
    let evCount = 0
    for (let i = 0; i < runs; i++) {
      const r = simulate(content, t, i * 31 + 1, st)
      scores.push(r.score)
      evCount += r.state.log.length
      ends.set(r.ending, (ends.get(r.ending) ?? 0) + 1)
      endingsAll.set(r.ending, (endingsAll.get(r.ending) ?? 0) + 1)
      for (const e of new Set(r.events)) seen.set(e, (seen.get(e) ?? 0) + 1)
    }
    const avg = scores.reduce((a, b) => a + b, 0) / runs
    const e = [...ends.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' ')
    console.log(`${t.padEnd(9)} ${st.padEnd(9)} ${avg.toFixed(1).padStart(5)} ${String(Math.min(...scores)).padStart(4)} ${String(Math.max(...scores)).padStart(4)} ${(evCount / runs).toFixed(1).padStart(6)}  ${e}`)
  }
}
console.log('\nevent reach (runs containing):')
console.log(Object.keys(content.events).sort().map((id) => `${id}:${seen.get(id) ?? 0}`).join(' '))
console.log('\nendings:', [...endingsAll.entries()].map(([k, v]) => `${k}:${v}`).join(' '))
