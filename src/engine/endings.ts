import { evalAll } from './conditions'
import { computeScore } from './scoring'
import type { Content, Ending, GameState } from './types'

/** Endings are checked in ascending priority; the first match wins. */
export function decideEnding(state: GameState, content: Content): Ending {
  const score = computeScore(state, content)
  const sorted = [...content.endings].sort((a, b) => a.priority - b.priority)
  for (const e of sorted) {
    if (e.minScore !== undefined && score.total < e.minScore) continue
    if (e.maxScore !== undefined && score.total > e.maxScore) continue
    if (e.minAreas !== undefined && score.areas < e.minAreas) continue
    if (!evalAll(state, e.when)) continue
    return e
  }
  return sorted[sorted.length - 1]
}
