import { STAT_LABEL } from './conditions'
import { rollPercent } from './rng'
import type { Check, Content, GameState } from './types'

export const LOW_STAMINA = 20
export const LOW_STAMINA_PENALTY = 10

export interface ChanceBreakdown {
  chance: number
  parts: { label: string; value: number }[]
}

/**
 * The single source of truth for a check's success chance. The UI shows this
 * exact number and resolveCheck() rolls against the same number.
 */
export function computeChance(state: GameState, check: Check, content?: Content): ChanceBreakdown {
  const parts: { label: string; value: number }[] = [{ label: '기본', value: check.base }]
  for (const m of check.mods ?? []) {
    if ('stat' in m) {
      const v = state.stats[m.stat] * m.per
      if (v) parts.push({ label: STAT_LABEL[m.stat], value: v })
    } else if ('item' in m) {
      if (state.items.includes(m.item)) parts.push({ label: content?.items[m.item]?.name ?? m.item, value: m.bonus })
    } else if ('achievement' in m) {
      if (state.achievements.includes(m.achievement))
        parts.push({ label: content?.achievements[m.achievement]?.name ?? m.achievement, value: m.bonus })
    } else if ('traveler' in m) {
      if (state.traveler === m.traveler) parts.push({ label: content?.travelers[m.traveler]?.name ?? m.traveler, value: m.bonus })
    } else if ('flag' in m) {
      if (state.flags.includes(m.flag)) parts.push({ label: '이전 경험', value: m.bonus })
    }
  }
  if (state.stamina < LOW_STAMINA) parts.push({ label: '피로', value: -LOW_STAMINA_PENALTY })
  const raw = parts.reduce((a, p) => a + p.value, 0)
  return { chance: Math.max(0, Math.min(100, raw)), parts }
}

/** roll ∈ [0,100); success iff roll < chance. chance 0 never succeeds, 100 always does. */
export function resolveCheck(rng: number, chance: number): { success: boolean; roll: number; rng: number } {
  const r = rollPercent(rng)
  return { success: r.roll < chance, roll: r.roll, rng: r.state }
}
