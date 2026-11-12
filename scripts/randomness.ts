// Usage: npx tsx scripts/randomness.ts — per-slot event distribution over 1000 random seeds
import { content } from '../src/content'
import { advance, applyChoice, chooseDestination, newGame } from '../src/engine'
import { nextRandom } from '../src/engine/rng'
const N = 1000
const perSlot: Map<string, number>[] = Array.from({ length: 12 }, () => new Map())
const firstOffers = new Map<string, number>()
const seqs = new Set<string>()
for (let i = 0; i < N; i++) {
  const seed = (Math.random() * 2 ** 32) >>> 0
  let s = newGame(content, (['linguist', 'foodie', 'wanderer'] as const)[i % 3], seed, 0)
  let r = seed
  const seq: string[] = []
  let firstOfferDone = false
  for (let g = 0; g < 200 && s.phase !== 'ended'; g++) {
    if (s.phase === 'event') {
      const ev = content.events[s.currentEventId!]
      seq.push(ev.id)
      const m = perSlot[s.slotIndex]; m.set(ev.id, (m.get(ev.id) ?? 0) + 1)
      const free = ev.choices.find((c) => !c.requires?.length && !c.cost)!
      s = applyChoice(s, content, free.id).state
    } else if (s.phase === 'result') s = advance(s, content)
    else if (s.phase === 'destination') {
      if (!firstOfferDone) { const k = [...s.destinationOptions].sort().join(','); firstOffers.set(k, (firstOffers.get(k) ?? 0) + 1); firstOfferDone = true }
      const x = nextRandom(r); r = x.state
      s = chooseDestination(s, content, s.destinationOptions[Math.floor(x.value * s.destinationOptions.length)])
    }
  }
  seqs.add(seq.join('>'))
}
const fmt = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} ${(v / N * 100).toFixed(0)}%`).join('  ')
perSlot.forEach((m, i) => console.log(`slot ${String(i).padStart(2)} (D${Math.floor(i / 4) + 1}-${['아침','낮','오후','저녁'][i % 4]}): ${fmt(m)}`))
console.log('\nfirst destination offer sets (top 6 of', firstOffers.size, '):')
console.log([...firstOffers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `  ${k}: ${(v / N * 100).toFixed(0)}%`).join('\n'))
console.log('\nunique full sequences:', seqs.size, '/', N)
