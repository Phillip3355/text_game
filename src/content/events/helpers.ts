import type { Check, CheckMod } from '../../engine/types'

// Shared modifier bundles so similar checks behave consistently across events.
const zhMods: CheckMod[] = [
  { stat: 'chinese', per: 10 },
  { item: 'phrasebook', bonus: 5 },
  { achievement: 'fluent', bonus: 10 },
]
const foodMods: CheckMod[] = [
  { traveler: 'foodie', bonus: 20 },
  { item: 'food_notes', bonus: 5 },
  { achievement: 'gourmet', bonus: 10 },
]
const lookMods: CheckMod[] = [
  { stat: 'observation', per: 10 },
  { achievement: 'navigator', bonus: 10 },
]
const cultureMods: CheckMod[] = [
  { stat: 'culture', per: 10 },
  { achievement: 'history', bonus: 10 },
]

/** 중국어로 말을 거는 판정 */
export const zhCheck = (base: number, extra: CheckMod[] = []): Check => ({ base, mods: [...zhMods, ...extra] })
/** 음식을 제대로 즐기는 판정 */
export const foodCheck = (base: number, extra: CheckMod[] = []): Check => ({ base, mods: [{ stat: 'culture', per: 5 }, ...foodMods, ...extra] })
/** 눈썰미·길 찾기 판정 */
export const lookCheck = (base: number, extra: CheckMod[] = []): Check => ({ base, mods: [...lookMods, ...extra] })
/** 사람과 어울리는 판정 */
export const socialCheck = (base: number, extra: CheckMod[] = []): Check => ({
  base,
  mods: [{ stat: 'social', per: 10 }, { stat: 'chinese', per: 5 }, { achievement: 'explorer', bonus: 5 }, ...extra],
})
/** 역사·문화 이해 판정 */
export const cultureCheck = (base: number, extra: CheckMod[] = []): Check => ({ base, mods: [...cultureMods, ...extra] })
