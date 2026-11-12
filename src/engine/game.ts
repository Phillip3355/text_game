import { evalAll, dayOf, slotOf } from './conditions'
import { computeChance, resolveCheck } from './check'
import { applyEffects } from './effects'
import { nextRandom, seedFrom, weightedSample } from './rng'
import { LAST_SLOT_INDEX, STAMINA_MAX } from './types'
import type { AreaId, Content, GameEvent, GameState, LogEntry, Slot, TravelerId } from './types'

export const SAVE_VERSION = 1
export const START_EVENT = 'E01'
export const FINAL_EVENT = 'E20'
export const METRO_EVENT = 'E07'
export const REST_EVENT = 'E21'
export const FALLBACK_EVENT = 'E22'
export const REST_THRESHOLD = 25
export const OVERNIGHT_RECOVERY = 35

// ── geography ──────────────────────────────────────────────────────────────

const AREA_DIST: Record<string, number> = {
  'bund|peoples_square': 1,
  'bund|pudong': 1,
  'bund|old_french': 2,
  'peoples_square|old_french': 1,
  'peoples_square|pudong': 2,
  'old_french|pudong': 2,
  'airport|pudong': 1,
}

export function areaDistance(a: AreaId, b: AreaId): number {
  if (a === b) return 0
  if (a === 'qingpu' || b === 'qingpu') return 3
  return AREA_DIST[`${a}|${b}`] ?? AREA_DIST[`${b}|${a}`] ?? 2
}

export function locationArea(content: Content, locationId: string): AreaId {
  return content.locations[locationId]?.area ?? 'peoples_square'
}

interface TravelPlan {
  distance: number
  money: number
  stamina: number
  note: string | null
}

const TRAVEL_COST = [
  { money: 0, stamina: -2 },
  { money: 4, stamina: -4 },
  { money: 5, stamina: -6 },
  { money: 8, stamina: -8 },
]

export function planTravel(state: GameState, content: Content, to: string): TravelPlan {
  if (to === 'here' || to === state.location) return { distance: 0, money: 0, stamina: 0, note: null }
  const from = content.locations[state.location]
  const dest = content.locations[to]
  if (!from || !dest) return { distance: 0, money: 0, stamina: 0, note: null }
  const distance = areaDistance(from.area, dest.area)
  const cost = TRAVEL_COST[distance]
  if (distance === 0) {
    return { distance, money: 0, stamina: cost.stamina, note: `${from.name}에서 ${dest.name}까지 걸어서 이동했다.` }
  }
  if (state.money < cost.money) {
    // Never block progress on money: walk / free shuttle instead, costs stamina.
    return {
      distance,
      money: 0,
      stamina: cost.stamina * 2,
      note: `지갑이 가벼워 ${from.name}에서 ${dest.name}까지 한참을 걸었다. 다리가 뻐근하다.`,
    }
  }
  const how =
    distance === 3
      ? `훙차오 쪽에서 지하철 17호선으로 갈아타고 한 시간 반 가까이 서쪽으로 달려 ${dest.name}에 닿았다. 창밖 풍경이 빌딩에서 논과 물길로 바뀌었다.`
      : `지하철로 ${from.name}에서 ${dest.name}까지 이동했다.`
  return { distance, money: -cost.money, stamina: cost.stamina, note: `${how} (교통비 ¥${cost.money})` }
}

// ── state helpers ──────────────────────────────────────────────────────────

export function currentEvent(state: GameState, content: Content): GameEvent | null {
  return state.currentEventId ? content.events[state.currentEventId] ?? null : null
}

export function eventParagraphs(state: GameState, event: GameEvent): string[] {
  const v = event.variants?.find((x) => evalAll(state, x.when))
  return v ? [...v.text, ...event.intro] : event.intro
}

function startEvent(state: GameState, content: Content, eventId: string, travelNote: string | null): GameState {
  const ev = content.events[eventId]
  let s: GameState = { ...state, currentEventId: eventId, phase: 'event', destinationOptions: [], travelNote }
  if (ev.location !== 'here') {
    s = {
      ...s,
      location: ev.location,
      visited: s.visited.includes(ev.location) ? s.visited : [...s.visited, ev.location],
    }
  }
  return s
}

function fitsTime(ev: GameEvent, slotIndex: number): boolean {
  const end = slotIndex + (ev.duration ?? 1) - 1
  if (end >= LAST_SLOT_INDEX) return false
  // multi-slot events must not cross midnight
  if (dayOf(end) !== dayOf(slotIndex)) return false
  return !ev.slots || ev.slots.includes(slotOf(slotIndex) as Slot)
}

function eligible(state: GameState, ev: GameEvent, slotIndex: number): boolean {
  return !state.doneEvents.includes(ev.id) && fitsTime(ev, slotIndex) && evalAll(state, ev.requires)
}

export function newGame(content: Content, traveler: TravelerId, seed: number, now = Date.now()): GameState {
  const t = content.travelers[traveler]
  const base: GameState = {
    version: SAVE_VERSION,
    seed,
    rng: seedFrom(seed),
    traveler,
    slotIndex: 0,
    location: content.events[START_EVENT].location,
    stats: { ...t.stats },
    stamina: t.stamina,
    money: t.money,
    items: [...t.items],
    flags: [],
    achievements: [],
    doneEvents: [],
    visited: [],
    tags: [],
    knowledge: [],
    counters: {},
    queue: [],
    log: [],
    phase: 'event',
    currentEventId: null,
    destinationOptions: [],
    travelNote: null,
    lastRestDay: 0,
    runId: `${now.toString(36)}-${(seed >>> 0).toString(36)}`,
    startedAt: now,
  }
  return startEvent(base, content, START_EVENT, null)
}

// ── choosing ───────────────────────────────────────────────────────────────

export interface ChoiceResult {
  state: GameState
  entry: LogEntry | null
  error?: string
}

export function applyChoice(state: GameState, content: Content, choiceId: string): ChoiceResult {
  if (state.phase !== 'event') return { state, entry: null, error: 'not-in-event' }
  const ev = currentEvent(state, content)
  if (!ev) return { state, entry: null, error: 'no-event' }
  const choice = ev.choices.find((c) => c.id === choiceId)
  if (!choice) return { state, entry: null, error: 'no-choice' }
  if (!evalAll(state, choice.requires)) return { state, entry: null, error: 'locked' }
  if (choice.cost && state.money < choice.cost) return { state, entry: null, error: 'locked' }

  let s = state
  let success: boolean | null = null
  let chance: number | undefined
  let roll: number | undefined
  if (choice.check) {
    chance = computeChance(s, choice.check, content).chance
    const r = resolveCheck(s.rng, chance)
    success = r.success
    roll = r.roll
    s = { ...s, rng: r.rng }
  }
  const outcome = success === false && choice.failure ? choice.failure : choice.success

  if (choice.cost) s = { ...s, money: s.money - choice.cost }
  const applied = applyEffects(s, outcome.effects)
  s = applied.state
  const gained = applied.gained
  if (choice.cost) gained.money -= choice.cost

  // achievements
  const newAch: string[] = []
  for (const a of Object.values(content.achievements)) {
    if (!s.achievements.includes(a.id) && evalAll(s, a.when)) newAch.push(a.id)
  }
  if (newAch.length) s = { ...s, achievements: [...s.achievements, ...newAch] }
  gained.achievements = newAch

  const entry: LogEntry = {
    seq: s.log.length + 1,
    day: dayOf(s.slotIndex),
    slot: slotOf(s.slotIndex),
    eventId: ev.id,
    location: s.location,
    choiceId: choice.id,
    choiceText: choice.text,
    success,
    chance,
    roll,
    outcomeText: outcome.text,
    diary: outcome.diary,
    media: outcome.media ?? ev.media[1] ?? ev.media[0],
    gained,
    travel: s.travelNote ?? undefined,
  }
  s = {
    ...s,
    log: [...s.log, entry],
    doneEvents: s.doneEvents.includes(ev.id) ? s.doneEvents : [...s.doneEvents, ev.id],
    queue: s.queue.filter((q) => q !== ev.id),
    phase: 'result',
  }
  return { state: s, entry }
}

// ── advancing time & scheduling ────────────────────────────────────────────

/** % chance that a slot opens with an unplanned encounter instead of a destination choice. */
function chanceEventProbability(state: GameState, content: Content): number {
  const last = state.log[state.log.length - 1]
  const base = 16 + state.stats.observation * 3 + (state.achievements.includes('explorer') ? 5 : 0)
  // avoid back-to-back encounters
  return last && content.events[last.eventId]?.kind === 'chance' ? base / 3 : base
}

/** Called on the result screen's "next" button. */
export function advance(state: GameState, content: Content): GameState {
  if (state.phase !== 'result') return state
  const ev = currentEvent(state, content)
  if (ev?.id === FINAL_EVENT) return { ...state, phase: 'ended', currentEventId: null }

  const prevDay = dayOf(state.slotIndex)
  let s: GameState = { ...state, slotIndex: Math.min(LAST_SLOT_INDEX, state.slotIndex + (ev?.duration ?? 1)) }
  const newDay = dayOf(s.slotIndex) !== prevDay
  let dayNote: string | null = null
  if (newDay) {
    const before = s.stamina
    s = { ...s, stamina: Math.min(STAMINA_MAX, s.stamina + OVERNIGHT_RECOVERY) }
    dayNote = `숙소에서 하룻밤을 푹 쉬었다. (체력 +${s.stamina - before}) 상하이에서의 ${dayOf(s.slotIndex)}일째 아침이 밝았다.`
  }
  return scheduleNext(s, content, dayNote)
}

function joinNotes(...notes: (string | null)[]): string | null {
  const n = notes.filter(Boolean)
  return n.length ? n.join('\n\n') : null
}

function travelTo(state: GameState, content: Content, eventId: string, extraNote: string | null): GameState {
  const ev = content.events[eventId]
  const plan = planTravel(state, content, ev.location)
  let s = state
  if (plan.money || plan.stamina) {
    s = applyEffects(s, { money: plan.money, stamina: plan.stamina }).state
  }
  return startEvent(s, content, eventId, joinNotes(extraNote, plan.note))
}

export function scheduleNext(state: GameState, content: Content, note: string | null): GameState {
  let s = state
  const idx = s.slotIndex
  const day = dayOf(idx)

  // 1. final
  if (idx >= LAST_SLOT_INDEX) return travelTo(s, content, FINAL_EVENT, note)

  // 2. exhaustion
  if (s.stamina <= 0 || (s.stamina < REST_THRESHOLD && s.lastRestDay !== day)) {
    s = { ...s, lastRestDay: day }
    return startEvent(s, content, REST_EVENT, joinNotes(note, '몸이 무겁다. 이대로는 무리다.'))
  }

  // 3. follow-ups queued by earlier choices
  for (const q of s.queue) {
    const ev = content.events[q]
    if (ev && eligible(s, ev, idx)) {
      return travelTo({ ...s, queue: s.queue.filter((x) => x !== q) }, content, q, note)
    }
  }

  // 4. chance encounter
  const chanceCands = Object.values(content.events).filter((e) => e.kind === 'chance' && eligible(s, e, idx))
  if (chanceCands.length && s.log.length > 0) {
    const r = nextRandom(s.rng)
    s = { ...s, rng: r.state }
    if (r.value * 100 < chanceEventProbability(s, content)) {
      const pick = weightedSample(
        chanceCands.map((e) => ({ item: e.id, weight: e.weight ?? 1 })),
        1,
        s.rng,
      )
      s = { ...s, rng: pick.state }
      return startEvent(s, content, pick.picked[0], note)
    }
  }

  // 5. destinations for the player
  const options = destinationCandidates(s, content, idx)
  if (options.length) {
    const here = locationArea(content, s.location)
    const weighted = options.map((e) => {
      const d = e.location === 'here' ? 0 : areaDistance(here, locationArea(content, e.location))
      const prox = [3, 2, 1.2, 0.8][d]
      const fresh = s.visited.includes(e.location) ? 0.6 : 1
      return { item: e.id, weight: (e.weight ?? 1) * prox * fresh }
    })
    const pick = weightedSample(weighted, 3, s.rng)
    return { ...s, rng: pick.state, phase: 'destination', destinationOptions: pick.picked, currentEventId: null, travelNote: note }
  }

  // 6. fallback
  const walkFlag = `walk-day-${day}`
  if (!s.flags.includes(walkFlag)) {
    return startEvent({ ...s, flags: [...s.flags, walkFlag] }, content, FALLBACK_EVENT, note)
  }
  return startEvent({ ...s, lastRestDay: day }, content, REST_EVENT, note)
}

export function destinationCandidates(state: GameState, content: Content, idx = state.slotIndex): GameEvent[] {
  return Object.values(content.events).filter((e) => e.kind === 'destination' && eligible(state, e, idx))
}

/** Player picked a destination card. */
export function chooseDestination(state: GameState, content: Content, eventId: string): GameState {
  if (state.phase !== 'destination' || !state.destinationOptions.includes(eventId)) return state
  const dest = content.events[eventId]
  const plan = planTravel(state, content, dest.location)
  const metro = content.events[METRO_EVENT]
  // First longer ride may turn into the metro episode; the destination waits one slot.
  if (
    metro &&
    plan.distance >= 1 &&
    plan.money < 0 &&
    !state.doneEvents.includes(METRO_EVENT) &&
    eligible(state, metro, state.slotIndex) &&
    eligible(state, dest, state.slotIndex + 1)
  ) {
    const r = nextRandom(state.rng)
    if (r.value < 0.35) {
      const s: GameState = { ...state, rng: r.state, queue: [eventId, ...state.queue.filter((q) => q !== eventId)] }
      const metroNote = joinNotes(state.travelNote, `${content.locations[dest.location]?.name ?? ''}에 가려고 지하철역으로 내려갔다.`)
      return startEvent(applyEffects(s, { money: plan.money }).state, content, METRO_EVENT, metroNote)
    }
    return travelTo({ ...state, rng: r.state }, content, eventId, state.travelNote)
  }
  return travelTo(state, content, eventId, state.travelNote)
}

export function isFinished(state: GameState): boolean {
  return state.phase === 'ended'
}
