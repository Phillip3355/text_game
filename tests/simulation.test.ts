import { describe, expect, it } from 'vitest'
import { content } from '../src/content'
import { simulate } from '../src/engine/simulate'
import type { Strategy } from '../src/engine/simulate'
import type { TravelerId } from '../src/engine'

const travelers: TravelerId[] = ['linguist', 'foodie', 'wanderer']
const strategies: Strategy[] = ['random', 'greedy', 'chinese', 'food', 'culture', 'lowstat', 'broke', 'passive']

describe('auto-play simulation', () => {
  const results = travelers.flatMap((t) =>
    strategies.flatMap((st) => Array.from({ length: 40 }, (_, i) => ({ t, st, r: simulate(content, t, i * 97 + 5, st) }))),
  )

  it('every run reaches the final event and ends without getting stuck', () => {
    for (const { r } of results) {
      expect(r.state.phase).toBe('ended')
      expect(r.events[0]).toBe('E01')
      expect(r.events.at(-1)).toBe('E20')
    }
  })

  it('each run experiences 9–13 events and never repeats a non-rest event', () => {
    for (const { r } of results) {
      expect(r.state.log.length).toBeGreaterThanOrEqual(9)
      expect(r.state.log.length).toBeLessThanOrEqual(13)
      const repeatable = new Set(['E21', 'E22'])
      const ids = r.events.filter((e) => !repeatable.has(e))
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('time never runs backwards and money never goes negative', () => {
    for (const { r } of results) {
      const order = r.state.log.map((e) => (e.day - 1) * 4 + e.slot)
      for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThan(order[i - 1])
      expect(r.state.money).toBeGreaterThanOrEqual(0)
      expect(r.state.stamina).toBeGreaterThanOrEqual(0)
    }
  })

  it('scores stay within 0–100 and both high and low grades are reachable', () => {
    const scores = results.map((x) => x.r.score)
    expect(Math.min(...scores)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...scores)).toBeLessThanOrEqual(100)
    expect(Math.max(...scores)).toBeGreaterThanOrEqual(90)
    expect(Math.min(...scores)).toBeLessThan(40)
  })

  it('every traveler type can reach a high score (fairness)', () => {
    for (const t of travelers) {
      const best = Math.max(...results.filter((x) => x.t === t).map((x) => x.r.score))
      expect(best, t).toBeGreaterThanOrEqual(85)
    }
  })

  it('every ending is reachable', () => {
    const seen = new Set(results.map((x) => x.r.ending))
    for (const e of content.endings) expect(seen.has(e.id), e.id).toBe(true)
  })

  it('every non-fallback event is reachable', () => {
    const seen = new Set(results.flatMap((x) => x.r.events))
    for (const e of Object.values(content.events)) {
      if (e.kind === 'fallback') continue
      expect(seen.has(e.id), e.id).toBe(true)
    }
  })

  it('journeys are varied: different seeds give different routes and no slot is dominated', () => {
    // strategies that always pick the 'best' option converge by design; judge variety on random play
    // (the simulation reuses the same seeds for each traveler, so compare within a traveler)
    for (const t of travelers) {
      const random = results.filter((x) => x.st === 'random' && x.t === t)
      const routes = new Set(random.map((x) => x.r.events.join('>')))
      expect(routes.size, t).toBeGreaterThan(random.length * 0.9)
    }
    // apart from the fixed first/last events, no single event should open most journeys
    const second = new Map<string, number>()
    for (const { r } of results) second.set(r.events[1], (second.get(r.events[1]) ?? 0) + 1)
    const top = Math.max(...second.values()) / results.length
    expect(top).toBeLessThan(0.35)
  })
})
