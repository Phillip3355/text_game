import { content } from '../../content'
import { SLOT_LABEL, STAT_LABEL, dayOf, slotOf } from '../../engine'
import type { GameState, LogEntry, StatKey } from '../../engine'

function Delta({ v, unit = '' }: { v?: number; unit?: string }) {
  if (!v) return null
  return (
    <span className={`ml-1 text-[0.8em] font-normal ${v > 0 ? 'text-ok' : 'text-seal'}`}>
      ({v > 0 ? '+' : '−'}
      {unit}
      {Math.abs(v)})
    </span>
  )
}

const SHORT: Record<StatKey, string> = { chinese: '중국어', observation: '관찰', social: '사교', culture: '문화' }

/**
 * Money and stamina first and large, skills below. `entry` shows what the last
 * choice changed. Fixed to the bottom on phones; inline in the left page on wide screens.
 */
export function StatPanel({ game, entry, variant }: { game: GameState; entry?: LogEntry | null; variant: 'bar' | 'inline' }) {
  const g = entry?.gained
  const low = game.stamina < 25
  const body = (
    <div className={variant === 'bar' ? 'mx-auto max-w-[38rem] px-4 py-2' : ''}>
      <div className="flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="shrink-0 text-[0.8rem] text-ink-soft">체력</span>
          <span
            className="relative h-2 min-w-12 flex-1 overflow-hidden rounded-full bg-rule"
            role="meter"
            aria-label="체력"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={game.stamina}
          >
            <span className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ${low ? 'bg-seal' : 'bg-ok'}`} style={{ width: `${game.stamina}%` }} />
          </span>
          <b className={`shrink-0 text-[1.05rem] font-semibold tabular-nums ${low ? 'text-seal' : 'text-ink'}`}>
            {game.stamina}
            <Delta v={g?.stamina} />
          </b>
        </div>
        <div className="shrink-0">
          <span className="mr-1.5 text-[0.8rem] text-ink-soft">자금</span>
          <b className="text-[1.05rem] font-semibold tabular-nums">
            ¥{game.money}
            <Delta v={g?.money} unit="¥" />
          </b>
        </div>
      </div>
      <div className="mt-1 flex justify-between gap-2 text-[0.8rem] text-ink-soft">
        {(Object.keys(SHORT) as StatKey[]).map((k) => (
          <span key={k} className="whitespace-nowrap">
            {SHORT[k]} <b className="font-semibold text-ink">{game.stats[k]}</b>
            <span className="text-ink-faint">/5</span>
            <Delta v={g?.stats[k]} />
          </span>
        ))}
      </div>
    </div>
  )
  if (variant === 'inline')
    return (
      <div className="hidden border-t border-rule pt-3 wide:block" aria-label="여행자 상태">
        {body}
      </div>
    )
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-10 border-t border-rule bg-paper/95 backdrop-blur-sm wide:hidden" aria-label="여행자 상태">
      {body}
    </div>
  )
}

export function RunningHead({ game, onMenu }: { game: GameState; onMenu: () => void }) {
  const loc = content.locations[game.location]
  const day = dayOf(game.slotIndex)
  return (
    <div className="no-print mb-8 flex items-baseline justify-between gap-3 border-b border-rule pb-2 text-[0.78rem] text-ink-faint">
      <span>
        <span className="small-caps">Day {day}</span>
        <span className="mx-1.5">·</span>
        {SLOT_LABEL[slotOf(game.slotIndex)]}
        {loc && (
          <>
            <span className="mx-1.5">·</span>
            {loc.name}
          </>
        )}
      </span>
      <span className="flex items-baseline gap-4">
        <span aria-label={`여정 ${game.slotIndex + 1} / 12`}>{game.slotIndex + 1} / 12</span>
        <button className="link text-ink-soft" onClick={onMenu} aria-haspopup="dialog">
          목차
        </button>
      </span>
    </div>
  )
}

export function PlaceLine({ locationId, place }: { locationId: string; place?: string }) {
  const loc = content.locations[locationId]
  if (!loc) return null
  return (
    <p className="mb-6 text-sm text-ink-soft">
      {place ? `${loc.name} · ${place}` : loc.name}
      <span className="ml-2 text-ink-faint">
        {loc.hanzi} <i className="not-italic tracking-wide">{loc.pinyin}</i>
      </span>
    </p>
  )
}

export function FactNotes({ ids, owned }: { ids: string[]; owned?: string[] }) {
  if (!ids.length) return null
  return (
    <aside className="my-8 border-l-2 border-seal/60 pl-4" aria-label="관광·문화 메모">
      <p className="small-caps mb-2 text-ink-faint">여백의 메모</p>
      {ids.map((id) => {
        const f = content.facts[id]
        if (!f) return null
        return (
          <details key={id} className="group mb-2 text-[0.92rem]">
            <summary className="cursor-pointer list-none text-ink-soft marker:hidden hover:text-seal">
              <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span>
              {f.title}
              {owned?.includes(id) && <span className="ml-2 text-xs text-ink-faint">수첩에 있음</span>}
            </summary>
            <div className="mt-2 pb-2 pl-3 text-ink-soft">
              <p className="m-0 leading-relaxed">{f.body}</p>
              <p className="mt-1 mb-0 text-xs text-ink-faint">
                출처:{' '}
                {f.sources.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && ', '}
                    <a className="link text-ink-faint" href={s.url} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          </details>
        )
      })}
    </aside>
  )
}

/** What a choice actually changed — shown under the result text. */
export function Gains({ entry }: { entry: LogEntry }) {
  const g = entry.gained
  const items: string[] = []
  for (const t of g.tags) if (content.tagLabels[t]) items.push(content.tagLabels[t])
  for (const [k, v] of Object.entries(g.stats)) if (v) items.push(`${STAT_LABEL[k as StatKey]} ${v > 0 ? '+' : ''}${v}`)
  if (g.stamina) items.push(`체력 ${g.stamina > 0 ? '+' : ''}${g.stamina}`)
  if (g.money) items.push(`${g.money > 0 ? '+' : '−'}¥${Math.abs(g.money)}`)
  for (const i of g.items) items.push(`‘${content.items[i]?.name ?? i}’ 획득`)
  for (const i of g.lostItems) items.push(`‘${content.items[i]?.name ?? i}’ 잃음`)
  for (const k of g.knowledge) items.push(`메모: ${content.facts[k]?.title ?? k}`)
  if (!items.length && !g.achievements.length) return null
  return (
    <div className="my-6 text-sm text-ink-soft">
      {g.achievements.map((a) => (
        <p key={a} className="noindent mb-2 border border-seal/50 px-3 py-2 text-seal">
          업적 달성 — <b className="font-semibold">{content.achievements[a]?.name}</b>
          <span className="ml-2 text-xs">{content.achievements[a]?.bonusText}</span>
        </p>
      ))}
      {items.length > 0 && <p className="noindent m-0 leading-loose">{items.join('  ·  ')}</p>}
    </div>
  )
}

export function Button({ children, onClick, primary, disabled }: { children: React.ReactNode; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={primary ? 'btn btn-primary' : 'btn'}
    >
      {children}
    </button>
  )
}
