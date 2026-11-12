import { SLOT_LABEL, STAT_LABEL, tagCount } from './conditions'
import { decideEnding } from './endings'
import { computeScore } from './scoring'
import type { ScoreResult } from './scoring'
import type { Content, Ending, GameState, LogEntry, StatKey } from './types'

export interface DiaryEntry {
  seq: number
  day: number
  slotLabel: string
  place: string
  placeHanzi: string
  placePinyin: string
  title: string
  situation: string
  choice: string
  result: 'success' | 'failure' | null
  chance?: number
  text: string
  travel?: string
  gained: string[]
  mediaId: string | null
}

export interface Diary {
  runId: string
  createdAt: number
  travelerName: string
  overview: {
    places: string[]
    eventCount: number
    foods: string[]
    knowledge: string[]
    stats: { label: string; value: number }[]
    stamina: number
    money: number
    achievements: string[]
  }
  days: { day: number; entries: DiaryEntry[] }[]
  evaluation: {
    style: string
    highlight: string | null
    specials: string[]
  }
  score: ScoreResult
  ending: Pick<Ending, 'id' | 'title' | 'text'>
}

function gainedLabels(e: LogEntry, content: Content): string[] {
  const out: string[] = []
  for (const t of e.gained.tags) {
    const l = content.tagLabels[t]
    if (l) out.push(l)
  }
  for (const k of e.gained.knowledge) {
    const f = content.facts[k]
    if (f && !out.includes(f.title)) out.push(f.title)
  }
  for (const i of e.gained.items) out.push(`‘${content.items[i]?.name ?? i}’ 획득`)
  for (const [k, v] of Object.entries(e.gained.stats)) if (v) out.push(`${STAT_LABEL[k as StatKey]} ${v > 0 ? '+' : ''}${v}`)
  for (const a of e.gained.achievements) out.push(`업적 ‘${content.achievements[a]?.name ?? a}’`)
  return out
}

function travelStyle(state: GameState): string {
  const scores: [string, number][] = [
    ['명소를 부지런히 찾아다닌 발품 여행', tagCount(state, 'sight:')],
    ['역사와 이야기를 따라 걸은 배움의 여행', tagCount(state, 'culture:') * 1.1],
    ['한 끼 한 끼를 소중히 한 미식 여행', tagCount(state, 'food:') * 1.3],
    ['사람을 만나며 넓혀 간 교류의 여행', tagCount(state, 'social:') * 1.6],
  ]
  scores.sort((a, b) => b[1] - a[1])
  return scores[0][1] > 0 ? scores[0][0] : '조용히 도시를 바라본 여행'
}

function pickHighlight(state: GameState, content: Content): string | null {
  const log = state.log.filter((e) => e.eventId !== 'E01' && e.eventId !== 'E20')
  const hidden = log.find((e) => e.gained.tags.some((t) => t.startsWith('hidden:')))
  const bravest = log
    .filter((e) => e.success === true && (e.chance ?? 100) <= 60)
    .sort((a, b) => (a.chance ?? 100) - (b.chance ?? 100))[0]
  const richest = [...log].sort((a, b) => b.gained.tags.length - a.gained.tags.length)[0]
  const e = hidden ?? bravest ?? richest
  if (!e) return null
  const ev = content.events[e.eventId]
  return `${ev?.title ?? ''} — ${e.diary}`
}

export function buildDiary(state: GameState, content: Content): Diary {
  const score = computeScore(state, content)
  const ending = decideEnding(state, content)
  const traveler = content.travelers[state.traveler]
  const entries: DiaryEntry[] = state.log.map((e) => {
    const ev = content.events[e.eventId]
    const loc = content.locations[e.location]
    const placeName = ev?.location === 'here' && ev.place ? `${loc?.name ?? ''} · ${ev.place}` : loc?.name ?? ''
    return {
      seq: e.seq,
      day: e.day,
      slotLabel: SLOT_LABEL[e.slot],
      place: placeName,
      placeHanzi: loc?.hanzi ?? '',
      placePinyin: loc?.pinyin ?? '',
      title: ev?.title ?? e.eventId,
      situation: ev?.intro[0] ?? '',
      choice: e.choiceText,
      result: e.success === null ? null : e.success ? 'success' : 'failure',
      chance: e.chance,
      text: e.diary,
      travel: e.travel,
      gained: gainedLabels(e, content),
      mediaId: e.media ?? ev?.media[0] ?? null,
    }
  })
  const days: Diary['days'] = []
  for (const en of entries) {
    let d = days.find((x) => x.day === en.day)
    if (!d) days.push((d = { day: en.day, entries: [] }))
    d.entries.push(en)
  }
  const places = state.visited.map((v) => content.locations[v]?.name).filter(Boolean) as string[]
  return {
    runId: state.runId,
    createdAt: state.startedAt,
    travelerName: traveler?.name ?? state.traveler,
    overview: {
      places,
      eventCount: state.log.length,
      foods: state.tags.filter((t) => t.startsWith('food:')).map((t) => content.tagLabels[t] ?? t),
      knowledge: state.knowledge.map((k) => content.facts[k]?.title ?? k),
      stats: (Object.keys(STAT_LABEL) as StatKey[]).map((k) => ({ label: STAT_LABEL[k], value: state.stats[k] })),
      stamina: state.stamina,
      money: state.money,
      achievements: state.achievements.map((a) => content.achievements[a]?.name ?? a),
    },
    days,
    evaluation: {
      style: travelStyle(state),
      highlight: pickHighlight(state, content),
      specials: state.tags.filter((t) => t.startsWith('hidden:') || t.startsWith('social:')).map((t) => content.tagLabels[t] ?? t),
    },
    score,
    ending: { id: ending.id, title: ending.title, text: ending.text },
  }
}

/** Plain-text version for the clipboard. */
export function diaryToText(d: Diary): string {
  const lines: string[] = []
  lines.push('나의 상하이 여행일지', `${d.travelerName} · ${d.overview.places.length}곳 · ${d.overview.eventCount}개의 장면`, '')
  for (const day of d.days) {
    lines.push(`── DAY ${day.day} ──`)
    for (const e of day.entries) {
      lines.push(`[${e.slotLabel}] ${e.place} — ${e.title}`)
      if (e.travel) lines.push(e.travel)
      lines.push(e.text)
      if (e.gained.length) lines.push(`획득: ${e.gained.join(', ')}`)
      lines.push('')
    }
  }
  lines.push(`여행 스타일: ${d.evaluation.style}`)
  lines.push(`점수: ${d.score.total}/100 (${d.score.grade.letter} — ${d.score.grade.title})`)
  lines.push(`엔딩: ${d.ending.title}`)
  return lines.join('\n')
}
