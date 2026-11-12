import { SAVE_VERSION } from './game'
import { LAST_SLOT_INDEX, STAT_KEYS } from './types'
import type { Content, GameState } from './types'

const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

/**
 * Validate an unknown blob loaded from storage. Returns null when the save is
 * from another version, corrupt, or references content that no longer exists —
 * the caller then discards it instead of crashing.
 */
export function validateSave(raw: unknown, content: Content): GameState | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as Partial<GameState>
  if (s.version !== SAVE_VERSION) return null
  if (!isNum(s.seed) || !isNum(s.rng) || !isNum(s.slotIndex) || !isNum(s.stamina) || !isNum(s.money)) return null
  if (s.slotIndex < 0 || s.slotIndex > LAST_SLOT_INDEX) return null
  if (!s.traveler || !content.travelers[s.traveler]) return null
  if (!s.stats || STAT_KEYS.some((k) => !isNum(s.stats![k]))) return null
  for (const f of ['items', 'flags', 'achievements', 'doneEvents', 'visited', 'tags', 'knowledge', 'queue', 'destinationOptions'] as const) {
    if (!isStrArr(s[f])) return null
  }
  if (!Array.isArray(s.log)) return null
  if (!s.phase || !['event', 'result', 'destination', 'ended'].includes(s.phase)) return null
  if ((s.phase === 'event' || s.phase === 'result') && (!s.currentEventId || !content.events[s.currentEventId])) return null
  const opts = s.destinationOptions as string[]
  if (s.phase === 'destination' && (opts.length === 0 || opts.some((d) => !content.events[d]))) return null
  if (s.log.some((e) => !e || !content.events[(e as { eventId: string }).eventId])) return null
  if (typeof s.location !== 'string' || !content.locations[s.location]) return null
  return s as GameState
}
