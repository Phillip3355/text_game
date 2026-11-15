import { describe, expect, it } from 'vitest'
import { content, eventIds } from '../src/content'
import { choiceAvailability, newGame } from '../src/engine'
import type { Condition, Effects, GameEvent, GameState } from '../src/engine'

const events = Object.values(content.events)

function conditionsOf(e: GameEvent): Condition[] {
  const out: Condition[] = [...(e.requires ?? []), ...(e.variants ?? []).flatMap((v) => v.when)]
  for (const c of e.choices) out.push(...(c.requires ?? []))
  const flat: Condition[] = []
  const walk = (c: Condition) => (c.type === 'any' ? c.of.forEach(walk) : flat.push(c))
  out.forEach(walk)
  return flat
}

function effectsOf(e: GameEvent): Effects[] {
  return e.choices.flatMap((c) => [c.success.effects, c.failure?.effects]).filter(Boolean) as Effects[]
}

describe('content integrity', () => {
  it('has at least 20 events incl. the required E01–E20', () => {
    expect(events.length).toBeGreaterThanOrEqual(20)
    for (let i = 1; i <= 20; i++) expect(content.events[`E${String(i).padStart(2, '0')}`]).toBeDefined()
  })

  it.each(events.map((e) => [e.id, e] as const))('%s has ≥3 choices and an unconditional free choice', (_, e) => {
    expect(e.choices.length).toBeGreaterThanOrEqual(3)
    expect(e.choices.some((c) => !c.requires?.length && !c.cost)).toBe(true)
    expect(new Set(e.choices.map((c) => c.id)).size).toBe(e.choices.length)
  })

  it.each(events.map((e) => [e.id, e] as const))('%s: every check has a distinct failure outcome', (_, e) => {
    for (const c of e.choices) {
      if (c.check) {
        expect(c.failure, `${e.id}/${c.id}`).toBeDefined()
        expect(c.failure!.text).not.toBe(c.success.text)
        expect(c.failure!.diary).not.toBe(c.success.diary)
      }
    }
  })

  it('all references resolve', () => {
    const flagsSet = new Set(events.flatMap((e) => effectsOf(e).flatMap((f) => f.setFlags ?? [])))
    for (const e of events) {
      if (e.location !== 'here') expect(content.locations[e.location], `${e.id} location`).toBeDefined()
      for (const f of e.facts ?? []) expect(content.facts[f], `${e.id} fact ${f}`).toBeDefined()
      for (const fx of effectsOf(e)) {
        for (const t of fx.tags ?? []) expect(content.tagLabels[t], `${e.id} tag ${t}`).toBeDefined()
        for (const k of fx.knowledge ?? []) expect(content.facts[k], `${e.id} knowledge ${k}`).toBeDefined()
        for (const i of [...(fx.addItems ?? []), ...(fx.removeItems ?? [])]) expect(content.items[i], `${e.id} item ${i}`).toBeDefined()
        if (fx.followUp) expect(content.events[fx.followUp], `${e.id} followUp`).toBeDefined()
      }
      for (const c of conditionsOf(e)) {
        if (c.type === 'item' || c.type === 'noItem') expect(content.items[c.item], `${e.id} cond item`).toBeDefined()
        if (c.type === 'flag') expect(flagsSet.has(c.flag), `${e.id} flag ${c.flag} is never set`).toBe(true)
        if (c.type === 'achievement') expect(content.achievements[c.id]).toBeDefined()
        if (c.type === 'eventDone') expect(content.events[c.event]).toBeDefined()
      }
    }
  })

  it('followup events are reachable from some choice', () => {
    const targets = new Set(events.flatMap((e) => effectsOf(e).map((f) => f.followUp).filter(Boolean)))
    for (const e of events.filter((x) => x.kind === 'followup')) expect(targets.has(e.id), e.id).toBe(true)
  })

  it('every fact has a source URL', () => {
    for (const f of Object.values(content.facts)) {
      expect(f.sources.length, f.id).toBeGreaterThan(0)
      for (const s of f.sources) expect(s.url).toMatch(/^https:\/\//)
    }
  })

  it('at least 5 endings with a guaranteed fallback', () => {
    expect(content.endings.length).toBeGreaterThanOrEqual(5)
    const last = [...content.endings].sort((a, b) => a.priority - b.priority).at(-1)!
    expect(last.when ?? []).toHaveLength(0)
    expect(last.minScore).toBeUndefined()
  })
})

describe('landmark arcs', () => {
  // 첫 장 → 이어지는 두 장 (followUp으로 연결)
  const arcs: Record<string, string[]> = {
    E02: ['E02B', 'E12'],
    E04: ['E04B', 'E04C'],
    E08: ['E08B', 'E08C'],
    E13: ['E13B', 'E13C'],
    E14: ['E14B', 'E14C'],
  }

  it('event ids are unique', () => {
    expect(new Set(eventIds).size).toBe(eventIds.length)
  })

  it.each(Object.entries(arcs))('%s spans three cards linked by followUp, and can also end early', (start, rest) => {
    const seen = new Set([start])
    const queue = [start]
    while (queue.length) {
      for (const fx of effectsOf(content.events[queue.shift()!])) {
        if (fx.followUp && rest.includes(fx.followUp) && !seen.has(fx.followUp)) {
          seen.add(fx.followUp)
          queue.push(fx.followUp)
        }
      }
    }
    for (const id of rest) expect(seen.has(id), `${start} → ${id}`).toBe(true)
    expect(content.events[start].kind).toBe('destination')
    expect(content.events[start].choices.some((c) => !c.success.effects?.followUp), `${start} has a choice that ends the visit`).toBe(true)
  })

  it('order matters: an item from a later card unlocks a choice in an earlier one', () => {
    const avail = (s: GameState, ev: string, choice: string) =>
      choiceAvailability(s, content.events[ev].choices.find((c) => c.id === choice)!, content).available
    const s = newGame(content, 'linguist', 1, 0)
    // 와이탄: 밤(E12)의 야경 사진 → 낮(E02)의 노신사 선택지
    expect(avail(s, 'E02', 'elder_photo')).toBe(false)
    expect(avail({ ...s, items: [...s.items, 'night_photo'] }, 'E02', 'elder_photo')).toBe(true)
    // 예원: 성황묘(E04C)의 향 → 옥영롱(E04B)의 선택지
    expect(avail(s, 'E04B', 'incense')).toBe(false)
    expect(avail({ ...s, items: [...s.items, 'incense'] }, 'E04B', 'incense')).toBe(true)
    // 성황묘를 먼저 보았다면 옥영롱에서 다시 성황묘로 가는 길은 닫힌다
    expect(avail({ ...s, flags: ['saw-temple'] }, 'E04B', 'temple')).toBe(false)
  })
})

describe('media', () => {
  it('every event has at least one real photo that exists', () => {
    for (const e of events) {
      expect(e.media.length, e.id).toBeGreaterThan(0)
      for (const m of e.media) {
        expect(content.media[m], `${e.id} media ${m}`).toBeDefined()
        expect(content.media[m].kind).toBe('image')
      }
      if (e.video) expect(content.media[e.video]?.kind, `${e.id} video`).toBe('video')
      for (const c of e.choices) {
        for (const o of [c.success, c.failure]) {
          if (o?.media) expect(content.media[o.media]?.kind, `${e.id}/${c.id} outcome media`).toBe('image')
        }
      }
    }
  })
  it('photos of a place are tagged with that place (or are generic street scenes)', () => {
    for (const e of events) {
      if (e.location === 'here') continue
      const area = content.locations[e.location].area
      const m = content.media[e.media[0]]
      const mArea = content.locations[m.location]?.area
      expect(mArea, `${e.id} lead photo ${m.id} is from ${m.location}`).toBe(area)
    }
  })
  it('meets the minimum quantity and has full attribution', () => {
    const all = Object.values(content.media)
    expect(all.filter((m) => m.kind === 'image').length).toBeGreaterThanOrEqual(20)
    expect(all.filter((m) => m.kind === 'video').length).toBeGreaterThanOrEqual(2)
    for (const m of all) {
      expect(m.author, m.id).toBeTruthy()
      expect(m.license, m.id).toMatch(/^(CC0|Public domain|CC BY)/i)
      expect(m.sourceUrl, m.id).toMatch(/^https:\/\/commons\.wikimedia\.org\//)
    }
  })
})
