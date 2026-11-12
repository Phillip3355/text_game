import { useEffect, useMemo } from 'react'
import { content } from '../../content'
import {
  SLOT_LABEL,
  choiceAvailability,
  computeChance,
  currentEvent,
  dayOf,
  eventParagraphs,
  planTravel,
  requirementLabels,
  slotOf,
} from '../../engine'
import type { GameEvent, GameState, LogEntry } from '../../engine'
import { useGame } from '../../store/game'
import { Plate, preloadMedia } from '../components/Plate'
import { Button, FactNotes, Gains, PlaceLine, RunningHead, StatPanel } from '../components/bits'
import { InGameMenu } from './InGameMenu'

const CHAPTER = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십', '십일', '십이', '십삼', '십사', '십오']
const chapterName = (n: number) => `제${CHAPTER[n] ?? n}장`

function Paragraphs({ text }: { text: string[] }) {
  return (
    <div className="prose-book">
      {text.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

function TravelNote({ note }: { note: string | null }) {
  if (!note) return null
  return (
    <div className="mb-6 text-[0.92rem] italic text-ink-soft">
      {note.split('\n\n').map((n, i) => (
        <p key={i} className="m-0 mb-1">
          {n}
        </p>
      ))}
    </div>
  )
}

function Choices({ game, ev }: { game: GameState; ev: GameEvent }) {
  const choose = useGame((s) => s.choose)
  const resolving = useGame((s) => s.resolving)
  const rows = ev.choices.map((c) => ({
    c,
    avail: choiceAvailability(game, c, content),
    reqs: requirementLabels(c, content),
    chance: c.check ? computeChance(game, c.check, content) : null,
  }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= rows.length && rows[n - 1].avail.available) choose(rows[n - 1].c.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section aria-label="선택지" className="mt-10">
      <p className="small-caps mb-3 text-ink-faint">어떻게 할까</p>
      <ol className="m-0 list-none p-0">
        {rows.map(({ c, avail, reqs, chance }, i) => (
          <li key={c.id} className="border-t border-rule last:border-b">
            <button
              onClick={() => avail.available && choose(c.id)}
              disabled={!avail.available || resolving}
              aria-disabled={!avail.available}
              className="group flex min-h-12 w-full cursor-pointer gap-3 bg-transparent px-1 py-3 text-left disabled:cursor-not-allowed"
            >
              <span className={`w-5 shrink-0 text-right tabular-nums ${avail.available ? 'text-seal' : 'text-ink-faint'}`}>{i + 1}.</span>
              <span className="flex-1">
                <span className={avail.available ? 'text-ink group-hover:text-seal' : 'text-ink-faint line-through decoration-rule'}>{c.text}</span>
                {(reqs.length > 0 || chance) && (
                  <span className="mt-0.5 block text-[0.78rem] text-ink-faint">
                    {!avail.available ? (
                      <span className="text-seal/80">잠김 — {avail.missing.join(', ')}</span>
                    ) : (
                      <>
                        {reqs.length > 0 && <span>{reqs.join(' · ')}</span>}
                        {reqs.length > 0 && chance && <span className="mx-1.5">·</span>}
                        {chance && (
                          <span title={chance.parts.map((p) => `${p.label} ${p.value >= 0 ? '+' : ''}${p.value}`).join(', ')}>
                            성공 확률 {chance.chance}%
                          </span>
                        )}
                      </>
                    )}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="no-print mt-3 text-[0.72rem] text-ink-faint">숫자 키 1–{rows.length}로도 고를 수 있습니다.</p>
    </section>
  )
}

function Heading({ game, ev, chapter }: { game: GameState; ev: GameEvent; chapter: number }) {
  return (
    <>
      <p className="small-caps mb-1 text-seal">{chapterName(chapter)}</p>
      <h1 className="m-0 mb-1 text-[1.6rem] leading-snug font-semibold">{ev.title}</h1>
      <PlaceLine locationId={game.location} place={ev.location === 'here' ? ev.place : undefined} />
    </>
  )
}

/**
 * Phone: heading → plate → text → choices in one column.
 * Wide: left page = plate + choices + stats (sticky), right page = heading + text.
 */
function Spread({ id, head, plate, text, actions, game, entry }: {
  id: string
  head: React.ReactNode
  plate: React.ReactNode
  text: React.ReactNode
  actions: React.ReactNode
  game: GameState
  entry?: LogEntry | null
}) {
  return (
    <article className="spread fade-in" key={id}>
      <div className="leaf leaf-left">
        <div className="order-2">{plate}</div>
        <div className="order-4">{actions}</div>
        <div className="mt-6">
          <StatPanel game={game} entry={entry} variant="inline" />
        </div>
      </div>
      <div className="leaf leaf-right">
        <div className="order-1">{head}</div>
        <div className="order-3">{text}</div>
      </div>
    </article>
  )
}

function EventPage({ game, ev }: { game: GameState; ev: GameEvent }) {
  return (
    <Spread
      id={ev.id}
      game={game}
      head={<Heading game={game} ev={ev} chapter={game.log.length + 1} />}
      plate={<Plate media={ev.media} video={ev.video} eager />}
      text={
        <>
          <TravelNote note={game.travelNote} />
          <Paragraphs text={eventParagraphs(game, ev)} />
          <FactNotes ids={ev.facts ?? []} owned={game.knowledge} />
        </>
      }
      actions={<Choices game={game} ev={ev} />}
    />
  )
}

function ResultPage({ game, ev, entry }: { game: GameState; ev: GameEvent; entry: LogEntry }) {
  const next = useGame((s) => s.next)
  const resolving = useGame((s) => s.resolving)
  const isFinal = ev.id === 'E20'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if ((e.target as HTMLElement)?.tagName === 'BUTTON') return
        e.preventDefault()
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next])
  // warm the cache for whatever may come next
  useEffect(() => {
    preloadMedia(Object.values(content.events).map((e) => e.media[0]).slice(0, 8))
  }, [])
  return (
    <Spread
      id={`${ev.id}-r`}
      game={game}
      entry={entry}
      head={<Heading game={game} ev={ev} chapter={game.log.length} />}
      plate={<Plate media={[entry.media ?? ev.media[0], ...ev.media]} eager />}
      text={
        <>
          <p className="mb-5 text-[0.92rem] text-ink-soft">
            <span className="mr-2 text-ink-faint">선택 —</span>
            {entry.choiceText}
            {entry.success !== null && (
              <span className={`ml-2 whitespace-nowrap ${entry.success ? 'text-ok' : 'text-seal'}`} role="status">
                {entry.success ? '성공' : '실패'}
                <span className="ml-1 text-xs text-ink-faint">(확률 {entry.chance}%)</span>
              </span>
            )}
          </p>
          <Paragraphs text={entry.outcomeText.split('\n\n')} />
        </>
      }
      actions={
        <>
          <Gains entry={entry} />
          <div className="no-print mt-8 flex justify-end wide:mt-4">
            <Button primary onClick={next} disabled={resolving}>
              {isFinal ? '여행을 마치고 책을 덮는다 →' : '다음 장으로 →'}
            </Button>
          </div>
        </>
      }
    />
  )
}

function DestinationPage({ game }: { game: GameState }) {
  const go = useGame((s) => s.destination)
  const options = game.destinationOptions.map((id) => content.events[id])
  const here = content.locations[game.location]
  useEffect(() => preloadMedia(options.map((o) => o.media[0])), [options])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= options.length) go(options[n - 1].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  return (
    <article className="fade-in">
      <p className="small-caps mb-1 text-seal">막간</p>
      <h1 className="m-0 mb-1 text-[1.6rem] leading-snug font-semibold">다음은 어디로</h1>
      <p className="mb-6 text-sm text-ink-soft">
        {dayOf(game.slotIndex)}일째 {SLOT_LABEL[slotOf(game.slotIndex)]}
        {here && ` · 지금은 ${here.name} 근처`}
      </p>
      <div className="wide:max-w-[38rem]">
        <TravelNote note={game.travelNote} />
        <p className="noindent mb-6">수첩을 펼치고 갈 만한 곳을 떠올려 본다.</p>
      </div>
      <ol className="m-0 list-none p-0 wide:grid wide:grid-cols-3 wide:gap-6">
        {options.map((ev, i) => {
          const loc = content.locations[ev.location]
          const plan = planTravel(game, content, ev.location)
          const photo = content.media[ev.media[0]]
          const how =
            plan.distance === 0
              ? '근처 — 걸어서'
              : plan.money === 0 && plan.distance > 0
                ? '돈이 모자라 걸어서 (체력 소모 큼)'
                : `지하철 ¥${-plan.money}`
          return (
            <li key={ev.id} className="border-t border-rule last:border-b wide:border wide:border-rule">
              <button onClick={() => go(ev.id)} className="group flex w-full cursor-pointer gap-4 bg-transparent px-1 py-4 text-left wide:h-full wide:flex-col wide:gap-3 wide:p-0 wide:pb-4">
                {photo && (
                  <img
                    src={import.meta.env.BASE_URL + (photo.srcSmall ?? photo.src)}
                    alt=""
                    loading="lazy"
                    className="h-20 w-24 shrink-0 border border-rule object-cover wide:aspect-[3/2] wide:h-auto wide:w-full wide:border-0 wide:border-b"
                  />
                )}
                <span className="flex-1 wide:px-4">
                  <span className="text-seal">{i + 1}. </span>
                  <span className="font-semibold group-hover:text-seal">{loc ? loc.name : ev.title}</span>
                  {loc && <span className="ml-2 text-sm text-ink-faint">{loc.hanzi}</span>}
                  {ev.location === 'here' && <span className="ml-1 text-sm text-ink-faint">— {ev.place}</span>}
                  <span className="mt-1 block text-[0.88rem] text-ink-soft">{ev.teaser ?? ev.title}</span>
                  <span className="mt-1 block text-[0.75rem] text-ink-faint">
                    {how}
                    {(ev.duration ?? 1) > 1 && ' · 반나절 소요'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </article>
  )
}

export function Play() {
  const game = useGame((s) => s.game)
  const lastEntry = useGame((s) => s.lastEntry)
  const menuOpen = useGame((s) => s.menuOpen)
  const setMenu = useGame((s) => s.setMenu)
  const ev = useMemo(() => (game ? currentEvent(game, content) : null), [game])

  if (!game) return null
  const entry = lastEntry ?? (game.phase === 'result' ? game.log.at(-1) ?? null : null)

  return (
    <>
      <main className="page page-wide">
        <RunningHead game={game} onMenu={() => setMenu(true)} />
        {game.phase === 'event' && ev && <EventPage game={game} ev={ev} />}
        {game.phase === 'result' && ev && entry && <ResultPage game={game} ev={ev} entry={entry} />}
        {game.phase === 'destination' && (
          <>
            <DestinationPage game={game} />
            <div className="mt-8 max-w-sm">
              <StatPanel game={game} variant="inline" />
            </div>
          </>
        )}
      </main>
      <StatPanel game={game} entry={game.phase === 'result' ? entry : null} variant="bar" />
      {menuOpen && <InGameMenu game={game} onClose={() => setMenu(false)} />}
    </>
  )
}
