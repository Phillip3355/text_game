import { STAMINA_MAX, STAT_KEYS, STAT_MAX } from './types'
import type { Effects, GameState, LogEntry, StatKey } from './types'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function addUnique(list: string[], add: string[] | undefined): { list: string[]; added: string[] } {
  if (!add?.length) return { list, added: [] }
  const added = add.filter((x, i) => !list.includes(x) && add.indexOf(x) === i)
  return { list: added.length ? [...list, ...added] : list, added }
}

/**
 * Apply effects immutably. Ranges are clamped; tags/knowledge/items are sets so
 * the same reward can never be counted twice. Returns what actually changed
 * (used for the result screen and the diary).
 */
export function applyEffects(state: GameState, fx: Effects | undefined): { state: GameState; gained: LogEntry['gained'] } {
  const gained: LogEntry['gained'] = {
    tags: [],
    items: [],
    lostItems: [],
    stats: {},
    stamina: 0,
    money: 0,
    knowledge: [],
    achievements: [],
  }
  if (!fx) return { state, gained }
  let s = state

  if (fx.stats) {
    const stats = { ...s.stats }
    for (const k of STAT_KEYS) {
      const d = fx.stats[k as StatKey]
      if (!d) continue
      const next = clamp(stats[k] + d, 0, STAT_MAX)
      if (next !== stats[k]) gained.stats[k] = next - stats[k]
      stats[k] = next
    }
    s = { ...s, stats }
  }
  if (fx.stamina) {
    const next = clamp(s.stamina + fx.stamina, 0, STAMINA_MAX)
    gained.stamina = next - s.stamina
    s = { ...s, stamina: next }
  }
  if (fx.money) {
    const next = Math.max(0, s.money + fx.money)
    gained.money = next - s.money
    s = { ...s, money: next }
  }
  if (fx.removeItems?.length) {
    const lost = fx.removeItems.filter((i) => s.items.includes(i))
    gained.lostItems = lost
    s = { ...s, items: s.items.filter((i) => !lost.includes(i)) }
  }
  const items = addUnique(s.items, fx.addItems)
  gained.items = items.added
  const tags = addUnique(s.tags, fx.tags)
  gained.tags = tags.added
  const knowledge = addUnique(s.knowledge, fx.knowledge)
  gained.knowledge = knowledge.added
  const flags = addUnique(s.flags, fx.setFlags)
  s = { ...s, items: items.list, tags: tags.list, knowledge: knowledge.list, flags: flags.list }

  if (fx.count?.length) {
    const counters = { ...s.counters }
    for (const c of fx.count) counters[c] = (counters[c] ?? 0) + 1
    s = { ...s, counters }
  }
  if (fx.followUp && !s.queue.includes(fx.followUp) && !s.doneEvents.includes(fx.followUp)) {
    s = { ...s, queue: [...s.queue, fx.followUp] }
  }
  return { state: s, gained }
}
