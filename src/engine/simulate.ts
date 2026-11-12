// Headless auto-play used by tests and scripts/simulate.ts.
import { choiceAvailability } from './conditions'
import { computeChance } from './check'
import { decideEnding } from './endings'
import { advance, applyChoice, chooseDestination, currentEvent, newGame } from './game'
import { nextRandom } from './rng'
import { computeScore } from './scoring'
import type { Choice, Content, GameEvent, GameState, TravelerId } from './types'

export type Strategy = 'random' | 'chinese' | 'food' | 'culture' | 'greedy' | 'lowstat' | 'broke' | 'passive'

export interface SimResult {
  state: GameState
  steps: number
  score: number
  ending: string
  events: string[]
}

function tagsOf(c: Choice): string[] {
  return [...(c.success.effects?.tags ?? []), ...(c.failure?.effects?.tags ?? [])]
}

function choiceValue(state: GameState, content: Content, c: Choice, strategy: Strategy): number {
  const chance = c.check ? computeChance(state, c.check, content).chance / 100 : 1
  const fresh = (c.success.effects?.tags ?? []).filter((t) => !state.tags.includes(t))
  const failFresh = (c.failure?.effects?.tags ?? []).filter((t) => !state.tags.includes(t))
  const expected = fresh.length * chance + failFresh.length * (1 - chance)
  const pref = (prefix: string) => tagsOf(c).filter((t) => t.startsWith(prefix) && !state.tags.includes(t)).length
  const cost = (c.cost ?? 0) / 100
  switch (strategy) {
    case 'chinese':
      return expected + pref('social:') * 2 + (c.check?.mods?.some((m) => 'stat' in m && m.stat === 'chinese') ? 1 : 0) - cost
    case 'food':
      return expected + pref('food:') * 3 - cost * 0.5
    case 'culture':
      return expected + pref('culture:') * 3 - cost
    case 'greedy':
      return expected * 2 + pref('hidden:') + pref('social:') - cost * 0.6 + (state.stamina < 35 ? (c.success.effects?.stamina ?? 0) / 20 : 0)
    case 'broke':
      return expected + (c.cost ? -100 : 0)
    case 'passive':
      return -expected * 3 - (c.check ? 1 : 0)
    case 'lowstat':
    case 'random':
      return 0
  }
}

function pick<T>(items: T[], rng: number): { item: T; rng: number } {
  const r = nextRandom(rng)
  return { item: items[Math.floor(r.value * items.length)], rng: r.state }
}

function destinationValue(state: GameState, content: Content, ev: GameEvent, strategy: Strategy): number {
  const all = ev.choices.flatMap(tagsOf).filter((t) => !state.tags.includes(t))
  const pref: Record<string, string> = { food: 'food:', culture: 'culture:', chinese: 'social:' }
  const p = pref[strategy]
  return new Set(all).size + (p ? all.filter((t) => t.startsWith(p)).length * 2 : 0) + (ev.category === 'food' && strategy === 'food' ? 2 : 0) - (ev.duration ?? 1) * 0.5 + (content.locations[ev.location] && !state.visited.includes(ev.location) ? 1 : 0)
}

/** Plays one full game. Throws if the game gets stuck. */
export function simulate(content: Content, traveler: TravelerId, seed: number, strategy: Strategy, maxSteps = 200): SimResult {
  let s = newGame(content, traveler, seed, 0)
  if (strategy === 'lowstat') s = { ...s, stats: { chinese: 0, observation: 0, social: 0, culture: 0 } }
  if (strategy === 'broke') s = { ...s, money: 20, stamina: 30 }
  let rng = seed * 7919 + 13
  let steps = 0
  const events: string[] = []
  while (s.phase !== 'ended') {
    if (++steps > maxSteps) throw new Error(`stuck: seed=${seed} ${traveler} ${strategy} phase=${s.phase} ev=${s.currentEventId}`)
    if (s.phase === 'event') {
      const ev = currentEvent(s, content)
      if (!ev) throw new Error('no current event')
      events.push(ev.id)
      const avail = ev.choices.filter((c) => choiceAvailability(s, c, content).available)
      if (!avail.length) throw new Error(`all choices locked in ${ev.id}`)
      let chosen: Choice
      if (strategy === 'random' || strategy === 'lowstat') {
        const p = pick(avail, rng)
        rng = p.rng
        chosen = p.item
      } else {
        chosen = [...avail].sort((a, b) => choiceValue(s, content, b, strategy) - choiceValue(s, content, a, strategy))[0]
      }
      const r = applyChoice(s, content, chosen.id)
      if (r.error) throw new Error(`choice error ${r.error} in ${ev.id}`)
      s = r.state
    } else if (s.phase === 'result') {
      s = advance(s, content)
    } else if (s.phase === 'destination') {
      const opts = s.destinationOptions.map((id) => content.events[id])
      let target: GameEvent
      if (strategy === 'random' || strategy === 'lowstat') {
        const p = pick(opts, rng)
        rng = p.rng
        target = p.item
      } else {
        target = [...opts].sort((a, b) => destinationValue(s, content, b, strategy) - destinationValue(s, content, a, strategy))[0]
      }
      s = chooseDestination(s, content, target.id)
    }
  }
  return { state: s, steps, score: computeScore(s, content).total, ending: decideEnding(s, content).id, events }
}
