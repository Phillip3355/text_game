// Core data model. Content files (src/content) are written against these types;
// the engine never imports React.

export type StatKey = 'chinese' | 'observation' | 'social' | 'culture'
export type TravelerId = 'linguist' | 'foodie' | 'wanderer'
/** 0 아침 · 1 낮 · 2 오후 · 3 저녁 */
export type Slot = 0 | 1 | 2 | 3
export type AreaId = 'airport' | 'bund' | 'peoples_square' | 'old_french' | 'pudong' | 'qingpu'

export const STAT_KEYS: StatKey[] = ['chinese', 'observation', 'social', 'culture']
export const STAT_MAX = 5
export const STAMINA_MAX = 100
export const DAYS = 3
export const SLOTS_PER_DAY = 4
export const LAST_SLOT_INDEX = DAYS * SLOTS_PER_DAY - 1 // 11 → 마지막 사건

export type Condition =
  | { type: 'stat'; stat: StatKey; min: number }
  | { type: 'stamina'; min: number }
  | { type: 'money'; min: number }
  | { type: 'item'; item: string }
  | { type: 'noItem'; item: string }
  | { type: 'flag'; flag: string }
  | { type: 'noFlag'; flag: string }
  | { type: 'visited'; location: string }
  | { type: 'notVisited'; location: string }
  | { type: 'eventDone'; event: string }
  | { type: 'traveler'; traveler: TravelerId }
  | { type: 'achievement'; id: string }
  | { type: 'tagCount'; prefix: string; min: number }
  | { type: 'counter'; key: string; min: number }
  | { type: 'any'; of: Condition[] }

export type CheckMod =
  | { stat: StatKey; per: number }
  | { item: string; bonus: number }
  | { achievement: string; bonus: number }
  | { traveler: TravelerId; bonus: number }
  | { flag: string; bonus: number }

export interface Check {
  base: number
  mods?: CheckMod[]
}

export interface Effects {
  stats?: Partial<Record<StatKey, number>>
  stamina?: number
  money?: number
  addItems?: string[]
  removeItems?: string[]
  setFlags?: string[]
  /** 점수/기록용 고유 태그 (sight:*, culture:*, food:*, solve:*, social:*, hidden:*) */
  tags?: string[]
  /** 획득한 관광·문화 정보 카드 id */
  knowledge?: string[]
  /** 다음 슬롯 이후에 일어날 후속 사건 */
  followUp?: string
  /** 업적 판정용 누적 카운터 */
  count?: string[]
}

export interface Outcome {
  /** 결과 본문(소설체, 여러 문단은 \n\n) */
  text: string
  /** 여행일지에 남는 1인칭 과거형 문장 */
  diary: string
  effects?: Effects
  /** 결과 장면의 사진 (없으면 사건의 두 번째 사진) */
  media?: string
}

export interface Choice {
  id: string
  text: string
  /** 선택 가능 조건 (모두 만족해야 함) */
  requires?: Condition[]
  /** 지불 비용(¥). 자금이 부족하면 잠김. 선택 시 차감. */
  cost?: number
  check?: Check
  success: Outcome
  /** check가 있으면 반드시 존재 */
  failure?: Outcome
}

export type EventKind = 'fixed' | 'destination' | 'chance' | 'followup' | 'rest' | 'fallback'

export interface TextVariant {
  when: Condition[]
  text: string[]
}

export interface GameEvent {
  id: string
  title: string
  /** 장소 id. 'here'면 현재 위치에서 일어나는 사건 */
  location: string
  /** 'here' 사건의 소장소 표기 (예: "이름 모를 골목") */
  place?: string
  kind: EventKind
  category: 'sight' | 'food' | 'culture' | 'transport' | 'social' | 'special' | 'rest'
  /** 시작 가능한 시간대 (없으면 언제나) */
  slots?: Slot[]
  requires?: Condition[]
  weight?: number
  /** 이 사건이 소모하는 슬롯 수 (먼 곳: 2) */
  duration?: number
  /** 사건이 끝난 뒤 머무는 장소 (예: 도착 후 숙소 근처). 방문 기록에는 남기지 않는다 */
  endLocation?: { location: string; note: string }
  /** media id 목록. 첫 번째가 대표 도판 */
  media: string[]
  /** 영상 media id (있으면 도판 자리에 재생, 실패 시 media[0]) */
  video?: string
  intro: string[]
  /** 상태에 따라 앞에 덧붙는 문단 (처음 일치하는 것) */
  variants?: TextVariant[]
  choices: Choice[]
  /** 이 사건에 붙는 관광·문화 정보 카드 id */
  facts?: string[]
  /** 행선지 후보 카드에 쓰는 한 줄 소개 */
  teaser?: string
}

export interface LogEntry {
  seq: number
  day: number
  slot: Slot
  eventId: string
  location: string
  choiceId: string
  choiceText: string
  /** null: 판정 없는 선택 */
  success: boolean | null
  chance?: number
  roll?: number
  outcomeText: string
  diary: string
  /** 이 장면에 쓰인 사진 id */
  media?: string
  gained: {
    tags: string[]
    items: string[]
    lostItems: string[]
    stats: Partial<Record<StatKey, number>>
    stamina: number
    money: number
    knowledge: string[]
    achievements: string[]
  }
  travel?: string
}

export type Phase = 'event' | 'result' | 'destination' | 'ended'

export interface GameState {
  version: number
  seed: number
  rng: number
  traveler: TravelerId
  /** 0..11 */
  slotIndex: number
  location: string
  stats: Record<StatKey, number>
  stamina: number
  money: number
  items: string[]
  flags: string[]
  achievements: string[]
  doneEvents: string[]
  visited: string[]
  tags: string[]
  knowledge: string[]
  counters: Record<string, number>
  queue: string[]
  log: LogEntry[]
  phase: Phase
  currentEventId: string | null
  destinationOptions: string[]
  /** 이동 묘사 (다음 사건 첫 문단 앞에 표시, 일지에도 기록) */
  travelNote: string | null
  lastRestDay: number
  /** 이번 판의 고유 id (일지 보관용) */
  runId: string
  startedAt: number
}

export interface Traveler {
  id: TravelerId
  name: string
  tagline: string
  description: string
  stats: Record<StatKey, number>
  stamina: number
  money: number
  items: string[]
  perk: string
}

export interface Location {
  id: string
  name: string
  hanzi: string
  pinyin: string
  area: AreaId
}

export interface Item {
  id: string
  name: string
  description: string
}

export interface Fact {
  id: string
  title: string
  body: string
  sources: { label: string; url: string }[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  bonusText: string
  /** 모두 만족하면 획득 */
  when: Condition[]
}

export interface MediaAsset {
  id: string
  kind: 'image' | 'video'
  src: string
  /** 800px 폭 사진 (srcset) */
  srcSmall?: string
  width?: number
  height?: number
  /** 영상 소스 (webm, mp4 순) */
  sources?: { src: string; type: string }[]
  /** 영상의 정지 화면 */
  poster?: string
  location: string
  caption: string
  author: string
  license: string
  licenseUrl: string
  sourceUrl: string
  events: string[]
}

export interface Content {
  events: Record<string, GameEvent>
  locations: Record<string, Location>
  items: Record<string, Item>
  facts: Record<string, Fact>
  travelers: Record<TravelerId, Traveler>
  achievements: Record<string, Achievement>
  endings: Ending[]
  media: Record<string, MediaAsset>
  /** 태그 → 표시 이름 (예: food:xiaolongbao → 샤오룽바오) */
  tagLabels: Record<string, string>
}

export interface Ending {
  id: string
  title: string
  /** 우선순위가 낮은 숫자일수록 먼저 판정 */
  priority: number
  minScore?: number
  maxScore?: number
  when?: Condition[]
  /** 방문한 구역 수 하한 */
  minAreas?: number
  text: string[]
}
