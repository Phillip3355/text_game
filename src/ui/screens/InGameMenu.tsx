import { useEffect, useRef } from 'react'
import { content } from '../../content'
import { STAT_LABEL, computeScore } from '../../engine'
import type { GameState, StatKey } from '../../engine'
import { useGame } from '../../store/game'
import { Spread } from '../components/Spread'
import { FactNotes } from '../components/bits'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="small-caps m-0 mb-3 border-b border-rule pb-1 font-normal text-ink-faint">{title}</h2>
      {children}
    </section>
  )
}

export function InGameMenu({ game, onClose }: { game: GameState; onClose: () => void }) {
  const go = useGame((s) => s.go)
  const openAside = useGame((s) => s.openAside)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const score = computeScore(game, content)

  return (
    <div role="dialog" aria-modal="true" aria-label="목차" className="fixed inset-0 z-20 overflow-y-auto bg-paper" ref={ref} tabIndex={-1}>
      <div className="page page-wide fade-in">
        <div className="mb-8 flex items-baseline justify-between border-b border-rule pb-2">
          <h1 className="m-0 text-xl font-semibold">목차</h1>
          <button className="link text-sm" onClick={onClose}>
            계속 읽기 →
          </button>
        </div>

        <Spread
          left={
            <div className="order-1">
        <Section title="여행자">
          <p className="m-0 mb-3">{content.travelers[game.traveler].name}</p>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.92rem]">
            {(Object.keys(STAT_LABEL) as StatKey[]).map((k) => (
              <div key={k} className="contents">
                <dt className="text-ink-soft">{STAT_LABEL[k]}</dt>
                <dd className="m-0 tracking-[0.3em]" aria-label={`${game.stats[k]} / 5`}>
                  <span className="text-seal">{'●'.repeat(game.stats[k])}</span>
                  <span className="text-rule">{'●'.repeat(5 - game.stats[k])}</span>
                </dd>
              </div>
            ))}
            <dt className="text-ink-soft">체력</dt>
            <dd className="m-0">{game.stamina} / 100</dd>
            <dt className="text-ink-soft">여행 자금</dt>
            <dd className="m-0">¥{game.money}</dd>
            <dt className="text-ink-soft">지금까지</dt>
            <dd className="m-0">{score.total}점 (예상)</dd>
          </dl>
        </Section>

        <Section title="소지품">
          {game.items.length ? (
            <ul className="m-0 list-none p-0">
              {game.items.map((i) => (
                <li key={i} className="mb-1">
                  {content.items[i]?.name} <span className="text-sm text-ink-faint">— {content.items[i]?.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-ink-faint">없음</p>
          )}
        </Section>

        <Section title="방문한 곳">
          <p className="m-0">
            {game.visited
              .map((v) => content.locations[v])
              .filter(Boolean)
              .map((l) => `${l.name}(${l.hanzi})`)
              .join(' · ') || '아직 없음'}
          </p>
        </Section>

        <Section title="업적">
          {game.achievements.length ? (
            game.achievements.map((a) => (
              <p key={a} className="m-0 mb-1">
                {content.achievements[a].name} <span className="text-sm text-ink-faint">— {content.achievements[a].bonusText}</span>
              </p>
            ))
          ) : (
            <p className="m-0 text-ink-faint">아직 없음. 업적을 얻으면 관련 판정이 쉬워진다.</p>
          )}
        </Section>

        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 text-sm">
          <button className="link" onClick={() => openAside('settings')}>
            설정
          </button>
          <button className="link" onClick={() => go('title')}>
            표지로 (진행은 저장됨)
          </button>
        </div>
            </div>
          }
          right={
            <div className="order-2 mt-8 wide:mt-0">
              <Section title={`얻은 지식 (${game.knowledge.length})`}>
                {game.knowledge.length ? <FactNotes ids={game.knowledge} /> : <p className="m-0 text-ink-faint">아직 없음. 장소에서 정보를 얻으면 여기에 모인다.</p>}
              </Section>
            </div>
          }
        />
      </div>
    </div>
  )
}
