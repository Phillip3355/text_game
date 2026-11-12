import { describe, expect, it } from 'vitest'
import { content } from '../src/content'
import {
  advance,
  applyChoice,
  applyEffects,
  buildDiary,
  choiceAvailability,
  computeChance,
  computeScore,
  decideEnding,
  evalCondition,
  gradeFor,
  newGame,
  resolveCheck,
  validateSave,
} from '../src/engine'
import { nextRandom } from '../src/engine/rng'
import type { GameState } from '../src/engine'

const fresh = (traveler: 'linguist' | 'foodie' | 'wanderer' = 'linguist', seed = 1): GameState =>
  newGame(content, traveler, seed, 0)

describe('travelers', () => {
  it('start with different stats', () => {
    const a = fresh('linguist').stats
    const b = fresh('foodie').stats
    const c = fresh('wanderer').stats
    expect(a).not.toEqual(b)
    expect(b).not.toEqual(c)
    expect(a.chinese).toBeGreaterThan(c.chinese)
    expect(c.observation).toBeGreaterThan(a.observation)
  })
  it('start at E01 on day 1 morning', () => {
    const s = fresh()
    expect(s.currentEventId).toBe('E01')
    expect(s.slotIndex).toBe(0)
    expect(s.phase).toBe('event')
  })
})

describe('conditions', () => {
  it('evaluates stat / item / money / any', () => {
    const s = fresh('wanderer')
    expect(evalCondition(s, { type: 'stat', stat: 'observation', min: 3 })).toBe(true)
    expect(evalCondition(s, { type: 'stat', stat: 'chinese', min: 3 })).toBe(false)
    expect(evalCondition(s, { type: 'item', item: 'paper_map' })).toBe(true)
    expect(evalCondition(s, { type: 'money', min: 281 })).toBe(false)
    expect(
      evalCondition(s, { type: 'any', of: [{ type: 'stat', stat: 'chinese', min: 5 }, { type: 'item', item: 'paper_map' }] }),
    ).toBe(true)
  })
  it('locks choices whose requirements fail, and applyChoice refuses them', () => {
    const s = fresh('linguist') // no paper map
    const map = content.events.E01.choices.find((c) => c.id === 'map')!
    expect(choiceAvailability(s, map, content).available).toBe(false)
    const r = applyChoice(s, content, 'map')
    expect(r.error).toBe('locked')
    expect(r.state).toBe(s)
  })
  it('locks paid choices when money is short', () => {
    const s = { ...fresh(), money: 10 }
    const maglev = content.events.E01.choices.find((c) => c.id === 'maglev')!
    expect(choiceAvailability(s, maglev, content).available).toBe(false)
  })
})

describe('checks', () => {
  it('displayed chance equals the chance used for the roll and is clamped', () => {
    const s = fresh('linguist')
    const ask = content.events.E01.choices.find((c) => c.id === 'ask')!
    const { chance } = computeChance(s, ask.check!, content)
    // linguist: 35 base + 3*10 chinese + 5 phrasebook
    expect(chance).toBe(70)
    expect(computeChance(s, { base: 150 }).chance).toBe(100)
    expect(computeChance(s, { base: -20 }).chance).toBe(0)
  })
  it('applies fatigue penalty at low stamina', () => {
    const s = { ...fresh(), stamina: 10 }
    expect(computeChance(s, { base: 50 }).chance).toBe(40)
  })
  it('0% never succeeds, 100% always succeeds', () => {
    let rng = 123
    for (let i = 0; i < 500; i++) {
      expect(resolveCheck(rng, 0).success).toBe(false)
      expect(resolveCheck(rng, 100).success).toBe(true)
      rng = nextRandom(rng).state
    }
  })
  it('observed success rate matches the displayed chance', () => {
    let rng = 99
    let ok = 0
    const n = 20000
    for (let i = 0; i < n; i++) {
      const r = resolveCheck(rng, 37)
      rng = r.rng
      if (r.success) ok++
    }
    expect(ok / n).toBeGreaterThan(0.35)
    expect(ok / n).toBeLessThan(0.39)
  })
  it('same seed reproduces the same results', () => {
    const a = applyChoice(fresh('linguist', 42), content, 'ask')
    const b = applyChoice(fresh('linguist', 42), content, 'ask')
    expect(a.entry!.success).toBe(b.entry!.success)
    expect(a.entry!.roll).toBe(b.entry!.roll)
  })
})

describe('effects', () => {
  it('clamps stats, stamina and money', () => {
    const s = fresh()
    const r = applyEffects(s, { stats: { chinese: 10, social: -10 }, stamina: 500, money: -9999 })
    expect(r.state.stats.chinese).toBe(5)
    expect(r.state.stats.social).toBe(0)
    expect(r.state.stamina).toBe(100)
    expect(r.state.money).toBe(0)
  })
  it('never double counts tags, items or knowledge', () => {
    const s = fresh()
    const once = applyEffects(s, { tags: ['sight:bund'], addItems: ['postcard'], knowledge: ['f_bund'] }).state
    const twice = applyEffects(once, { tags: ['sight:bund'], addItems: ['postcard'], knowledge: ['f_bund'] })
    expect(twice.state.tags.filter((t) => t === 'sight:bund')).toHaveLength(1)
    expect(twice.state.items.filter((t) => t === 'postcard')).toHaveLength(1)
    expect(twice.gained.tags).toEqual([])
  })
  it('a choice cannot be applied twice (double click)', () => {
    const s = fresh()
    const first = applyChoice(s, content, 'app')
    const second = applyChoice(first.state, content, 'app')
    expect(second.error).toBe('not-in-event')
    expect(second.state.log).toHaveLength(1)
  })
})

describe('progression', () => {
  it('advance moves time forward and offers a next step', () => {
    const s = applyChoice(fresh(), content, 'app').state
    const n = advance(s, content)
    expect(n.slotIndex).toBe(1)
    expect(['event', 'destination']).toContain(n.phase)
  })
  it('exhaustion forces a rest event', () => {
    const s = { ...applyChoice(fresh(), content, 'app').state, stamina: 5 }
    const n = advance(s, content)
    expect(n.currentEventId).toBe('E21')
  })
  it('the last slot is always the final event', () => {
    const s = { ...applyChoice(fresh(), content, 'app').state, slotIndex: 10 }
    const n = advance(s, content)
    expect(n.currentEventId).toBe('E20')
    const done = advance(applyChoice(n, content, 'quiet').state, content)
    expect(done.phase).toBe('ended')
  })
})

describe('scoring & endings', () => {
  it('scores from unique tags and caps each category', () => {
    let s = fresh()
    s = { ...s, tags: ['sight:bund', 'sight:yuyuan', 'food:xiaolongbao', 'culture:garden', 'solve:lost'], visited: ['bund', 'lujiazui'] }
    const r = computeScore(s, content)
    expect(r.lines.find((l) => l.key === 'sight')!.score).toBe(10)
    expect(r.lines.find((l) => l.key === 'food')!.score).toBe(5)
    expect(r.lines.find((l) => l.key === 'solve')!.score).toBe(3)
    expect(r.lines.find((l) => l.key === 'variety')!.score).toBe(4)
    const many = { ...s, tags: Array.from({ length: 20 }, (_, i) => `sight:x${i}`) }
    expect(computeScore(many, content).lines.find((l) => l.key === 'sight')!.score).toBe(30)
  })
  it('grade boundaries follow the spec table', () => {
    expect([100, 90, 89, 75, 74, 60, 59, 40, 39, 0].map((n) => gradeFor(n).letter)).toEqual([
      'S', 'S', 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
    ])
  })
  it('picks the low-score ending when nothing was achieved', () => {
    const s = fresh()
    expect(decideEnding(s, content).id).toBe('regret')
  })
  it('perfect ending outranks others', () => {
    const tags = [
      ...['bund', 'yuyuan', 'lujiazui', 'museum', 'xintiandi', 'zhujiajiao'].map((x) => `sight:${x}`),
      ...['garden', 'shikumen', 'bronze', 'water_town', 'tea', 'hudec'].map((x) => `culture:${x}`),
      ...['xiaolongbao', 'shengjian', 'zongzi', 'hongshaorou'].map((x) => `food:${x}`),
      ...['arrival', 'metro', 'lost', 'bargain', 'night_shot'].map((x) => `solve:${x}`),
      'social:local_friend',
      'hidden:jade_rock',
    ]
    const s = { ...fresh(), tags, visited: ['bund', 'lujiazui', 'xintiandi', 'zhujiajiao'] }
    expect(computeScore(s, content).total).toBe(100)
    expect(decideEnding(s, content).id).toBe('perfect')
  })
})

describe('save', () => {
  it('round-trips through JSON', () => {
    const s = advance(applyChoice(fresh(), content, 'app').state, content)
    const loaded = validateSave(JSON.parse(JSON.stringify(s)), content)
    expect(loaded).toEqual(s)
  })
  it('rejects corrupt or foreign saves', () => {
    expect(validateSave(null, content)).toBeNull()
    expect(validateSave({ version: 999 }, content)).toBeNull()
    const s = fresh()
    expect(validateSave({ ...s, currentEventId: 'E999' }, content)).toBeNull()
    expect(validateSave({ ...s, stats: { chinese: 'x' } }, content)).toBeNull()
  })
})

describe('diary', () => {
  it('records only what happened', () => {
    let s = fresh('linguist', 7)
    s = applyChoice(s, content, 'app').state
    const d = buildDiary(s, content)
    const entries = d.days.flatMap((x) => x.entries)
    expect(entries).toHaveLength(1)
    expect(entries[0].choice).toBe(content.events.E01.choices.find((c) => c.id === 'app')!.text)
    expect(entries[0].text).toBe(content.events.E01.choices.find((c) => c.id === 'app')!.success.diary)
  })
})
