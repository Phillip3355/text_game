import { tagCount } from './conditions'
import type { Content, GameState } from './types'

export interface ScoreLine {
  key: 'sight' | 'culture' | 'food' | 'solve' | 'variety'
  label: string
  score: number
  max: number
  detail: string
}

export interface ScoreResult {
  total: number
  lines: ScoreLine[]
  grade: { letter: 'S' | 'A' | 'B' | 'C' | 'D'; title: string }
  areas: number
}

export const SCORE_RULES = {
  sight: { per: 5, max: 30 },
  culture: { per: 5, max: 25 },
  food: { per: 5, max: 20 },
  solve: { per: 3, max: 15 },
  area: { per: 2, max: 6 },
  social: 2,
  hidden: 2,
}

export function visitedAreas(state: GameState, content: Content): string[] {
  const areas = new Set<string>()
  for (const id of state.visited) {
    const a = content.locations[id]?.area
    if (a && a !== 'airport') areas.add(a)
  }
  return [...areas]
}

export function gradeFor(total: number): ScoreResult['grade'] {
  if (total >= 90) return { letter: 'S', title: '상하이 여행 마스터' }
  if (total >= 75) return { letter: 'A', title: '상하이 탐험가' }
  if (total >= 60) return { letter: 'B', title: '능숙한 여행자' }
  if (total >= 40) return { letter: 'C', title: '초보 여행자' }
  return { letter: 'D', title: '아쉬운 여행' }
}

/** Score from unique achievements only — never from repeated rewards. */
export function computeScore(state: GameState, content: Content): ScoreResult {
  const r = SCORE_RULES
  const n = (p: string) => tagCount(state, p)
  const sights = n('sight:')
  const culture = n('culture:')
  const food = n('food:')
  const solve = n('solve:')
  const areas = visitedAreas(state, content).length
  const social = n('social:') > 0
  const hidden = n('hidden:') > 0
  const variety = Math.min(r.area.max, areas * r.area.per) + (social ? r.social : 0) + (hidden ? r.hidden : 0)
  const lines: ScoreLine[] = [
    { key: 'sight', label: '관광 명소 탐방', score: Math.min(r.sight.max, sights * r.sight.per), max: r.sight.max, detail: `명소 ${sights}곳` },
    { key: 'culture', label: '역사·문화 학습', score: Math.min(r.culture.max, culture * r.culture.per), max: r.culture.max, detail: `문화 지식 ${culture}개` },
    { key: 'food', label: '음식 및 식문화', score: Math.min(r.food.max, food * r.food.per), max: r.food.max, detail: `음식 ${food}가지` },
    { key: 'solve', label: '사건 해결', score: Math.min(r.solve.max, solve * r.solve.per), max: r.solve.max, detail: `해결 ${solve}건` },
    {
      key: 'variety',
      label: '여행의 다양성',
      score: Math.min(10, variety),
      max: 10,
      detail: `구역 ${areas}곳${social ? ' · 현지 교류' : ''}${hidden ? ' · 숨은 발견' : ''}`,
    },
  ]
  const total = lines.reduce((a, l) => a + l.score, 0)
  return { total, lines, grade: gradeFor(total), areas }
}
