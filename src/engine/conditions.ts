import type { Choice, Condition, Content, GameState, StatKey } from './types'

export const STAT_LABEL: Record<StatKey, string> = {
  chinese: '중국어',
  observation: '관찰력',
  social: '사교성',
  culture: '문화 이해',
}

export const SLOT_LABEL = ['아침', '낮', '오후', '저녁'] as const

export function dayOf(slotIndex: number): number {
  return Math.floor(slotIndex / 4) + 1
}

export function slotOf(slotIndex: number): 0 | 1 | 2 | 3 {
  return (slotIndex % 4) as 0 | 1 | 2 | 3
}

export function tagCount(state: GameState, prefix: string): number {
  return state.tags.filter((t) => t.startsWith(prefix)).length
}

export function evalCondition(state: GameState, c: Condition): boolean {
  switch (c.type) {
    case 'stat':
      return state.stats[c.stat] >= c.min
    case 'stamina':
      return state.stamina >= c.min
    case 'money':
      return state.money >= c.min
    case 'item':
      return state.items.includes(c.item)
    case 'noItem':
      return !state.items.includes(c.item)
    case 'flag':
      return state.flags.includes(c.flag)
    case 'noFlag':
      return !state.flags.includes(c.flag)
    case 'visited':
      return state.visited.includes(c.location)
    case 'notVisited':
      return !state.visited.includes(c.location)
    case 'eventDone':
      return state.doneEvents.includes(c.event)
    case 'traveler':
      return state.traveler === c.traveler
    case 'achievement':
      return state.achievements.includes(c.id)
    case 'tagCount':
      return tagCount(state, c.prefix) >= c.min
    case 'counter':
      return (state.counters[c.key] ?? 0) >= c.min
    case 'any':
      return c.of.some((x) => evalCondition(state, x))
  }
}

export function evalAll(state: GameState, conds: Condition[] | undefined): boolean {
  return (conds ?? []).every((c) => evalCondition(state, c))
}

/** Human-readable requirement, shown under locked choices. */
export function describeCondition(c: Condition, content: Content): string {
  switch (c.type) {
    case 'stat':
      return `${STAT_LABEL[c.stat]} ${c.min} 이상`
    case 'stamina':
      return `체력 ${c.min} 이상`
    case 'money':
      return `¥${c.min} 이상`
    case 'item':
      return `‘${content.items[c.item]?.name ?? c.item}’ 필요`
    case 'noItem':
      return `‘${content.items[c.item]?.name ?? c.item}’ 없을 때`
    case 'flag':
    case 'noFlag':
    case 'eventDone':
      return '이전 여정에서 열리는 길'
    case 'visited':
      return `${content.locations[c.location]?.name ?? c.location} 방문 후`
    case 'notVisited':
      return `${content.locations[c.location]?.name ?? c.location} 미방문`
    case 'traveler':
      return `${content.travelers[c.traveler]?.name ?? c.traveler} 전용`
    case 'achievement':
      return `업적 ‘${content.achievements[c.id]?.name ?? c.id}’`
    case 'tagCount':
    case 'counter':
      return '경험이 더 쌓이면'
    case 'any':
      return c.of.map((x) => describeCondition(x, content)).join(' 또는 ')
  }
}

export interface ChoiceAvailability {
  available: boolean
  /** 미충족 조건 설명 */
  missing: string[]
}

export function choiceAvailability(state: GameState, choice: Choice, content: Content): ChoiceAvailability {
  const missing: string[] = []
  for (const c of choice.requires ?? []) {
    if (!evalCondition(state, c)) missing.push(describeCondition(c, content))
  }
  if (choice.cost && state.money < choice.cost) missing.push(`¥${choice.cost} 필요`)
  return { available: missing.length === 0, missing }
}

/** All requirement labels (met or not) — shown as a footnote on every gated choice. */
export function requirementLabels(choice: Choice, content: Content): string[] {
  const labels = (choice.requires ?? []).map((c) => describeCondition(c, content))
  if (choice.cost) labels.push(`¥${choice.cost}`)
  return labels
}
