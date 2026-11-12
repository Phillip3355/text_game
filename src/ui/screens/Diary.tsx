import { useState } from 'react'
import { content } from '../../content'
import { diaryToText } from '../../engine'
import type { Diary as DiaryT } from '../../engine'
import { useGame } from '../../store/game'
import { Plate } from '../components/Plate'
import { Spread, TopBar } from '../components/Spread'
import { Button } from '../components/bits'

const DAY_NAME = ['', '첫째 날', '둘째 날', '셋째 날']

export function ScoreTable({ d }: { d: DiaryT }) {
  return (
    <table className="mb-6 w-full border-collapse text-[0.92rem]">
      <tbody>
        {d.score.lines.map((l) => (
          <tr key={l.key} className="border-b border-rule">
            <th scope="row" className="py-1.5 text-left font-normal text-ink-soft">
              {l.label}
              <span className="ml-2 text-xs text-ink-faint">{l.detail}</span>
            </th>
            <td className="py-1.5 text-right tabular-nums">
              {l.score} <span className="text-ink-faint">/ {l.max}</span>
            </td>
          </tr>
        ))}
        <tr>
          <th scope="row" className="pt-3 text-left font-semibold">
            합계
          </th>
          <td className="pt-3 text-right text-lg font-semibold tabular-nums">
            {d.score.total} <span className="text-sm font-normal text-ink-faint">/ 100</span>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function DiaryCover({ d }: { d: DiaryT }) {
  const date = new Date(d.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  return (
      <header className="mb-12 border-y border-rule py-10 text-center">
        <p className="small-caps m-0 text-ink-faint">Travel Journal</p>
        <p className="m-0 mt-4 text-4xl tracking-[0.3em] text-seal" aria-hidden="true">
          上海
        </p>
        <h1 className="m-0 mt-3 text-2xl font-semibold">나의 상하이 여행일지</h1>
        <p className="m-0 mt-2 text-sm text-ink-soft">
          {d.travelerName} · {date}
        </p>
      </header>
  )
}

function DiaryOverview({ d }: { d: DiaryT }) {
  return (
      <section className="mb-12">
        <h2 className="small-caps m-0 mb-4 font-normal text-ink-faint">여행 개요</h2>
        <dl className="m-0 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 text-[0.92rem]">
          <dt className="text-ink-soft">방문한 곳</dt>
          <dd className="m-0">
            {d.overview.places.length}곳 — {d.overview.places.join(', ')}
          </dd>
          <dt className="text-ink-soft">겪은 장면</dt>
          <dd className="m-0">{d.overview.eventCount}개</dd>
          <dt className="text-ink-soft">맛본 음식</dt>
          <dd className="m-0">{d.overview.foods.join(', ') || '—'}</dd>
          <dt className="text-ink-soft">얻은 지식</dt>
          <dd className="m-0">{d.overview.knowledge.join(', ') || '—'}</dd>
          <dt className="text-ink-soft">최종 능력치</dt>
          <dd className="m-0">
            {d.overview.stats.map((s) => `${s.label} ${s.value}`).join(' · ')} · 체력 {d.overview.stamina} · 남은 돈 ¥{d.overview.money}
          </dd>
          <dt className="text-ink-soft">업적</dt>
          <dd className="m-0">{d.overview.achievements.join(', ') || '—'}</dd>
          <dt className="text-ink-soft">여행 점수</dt>
          <dd className="m-0">
            {d.score.total}점 · {d.score.grade.letter} — {d.score.grade.title}
          </dd>
          <dt className="text-ink-soft">엔딩</dt>
          <dd className="m-0">{d.ending.title}</dd>
        </dl>
      </section>
  )
}

function DiaryDays({ d }: { d: DiaryT }) {
  return (
    <>
      {d.days.map((day) => (
        <section key={day.day} className="print-break mb-12">
          <h2 className="m-0 mb-6 border-b border-rule pb-2 text-xl font-semibold">
            <span className="small-caps mr-3 font-normal text-seal">Day {day.day}</span>
            {DAY_NAME[day.day]}
          </h2>
          {day.entries.map((e) => (
            <div key={e.seq} className="mb-10">
              <p className="m-0 text-[0.78rem] text-ink-faint">
                {e.seq}. {e.slotLabel} · {e.place} {e.placeHanzi} {e.placePinyin}
              </p>
              <h3 className="m-0 mb-3 text-[1.1rem] font-semibold">{e.title}</h3>
              {e.mediaId && content.media[e.mediaId] && <Plate media={[e.mediaId]} compact />}
              {e.travel && <p className="m-0 mb-2 text-[0.88rem] italic text-ink-soft">{e.travel.split('\n\n').join(' ')}</p>}
              <p className="m-0 mb-2">{e.text}</p>
              <p className="m-0 text-[0.82rem] text-ink-soft">
                선택: {e.choice}
                {e.result && <span className={e.result === 'success' ? 'text-ok' : 'text-seal'}> — {e.result === 'success' ? '성공' : '실패'}</span>}
              </p>
              {e.gained.length > 0 && <p className="m-0 text-[0.82rem] text-ink-faint">획득한 경험: {e.gained.join(', ')}</p>}
            </div>
          ))}
        </section>
      ))}
    </>
  )
}

function DiaryClosing({ d }: { d: DiaryT }) {
  return (
      <section className="print-break">
        <h2 className="m-0 mb-6 border-b border-rule pb-2 text-xl font-semibold">맺음말</h2>
        <p className="m-0 mb-1 text-sm text-ink-soft">여행 스타일</p>
        <p className="m-0 mb-4">{d.evaluation.style}</p>
        {d.evaluation.highlight && (
          <>
            <p className="m-0 mb-1 text-sm text-ink-soft">가장 인상적인 장면</p>
            <p className="m-0 mb-4">{d.evaluation.highlight}</p>
          </>
        )}
        {d.evaluation.specials.length > 0 && (
          <>
            <p className="m-0 mb-1 text-sm text-ink-soft">특별한 경험</p>
            <p className="m-0 mb-4">{d.evaluation.specials.join(', ')}</p>
          </>
        )}
        <ScoreTable d={d} />
        <p className="m-0 mb-2 text-center text-2xl tracking-widest text-seal">{d.score.grade.letter}</p>
        <p className="m-0 mb-8 text-center text-sm text-ink-soft">{d.score.grade.title}</p>
        <h3 className="m-0 mb-3 text-center text-lg font-semibold">엔딩 — {d.ending.title}</h3>
        <div className="prose-book">
          {d.ending.text.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
        <p className="ornament">· · ·</p>
      </section>
  )
}

export function Diary() {
  const d = useGame((s) => s.openDiary)
  const go = useGame((s) => s.go)
  const shelf = useGame((s) => s.shelf)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  if (!d) return null
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(diaryToText(d))
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
  }
  return (
    <main className="page page-wide fade-in">
      <TopBar
        label="여행일지"
        back={shelf.length > 1 ? '서가' : '표지'}
        onBack={() => go(shelf.length > 1 ? 'shelf' : 'title')}
        extra={
          <>
            <button className="link" onClick={copy}>
              {copied === 'ok' ? '복사됨' : copied === 'fail' ? '복사 실패' : '글로 복사'}
            </button>
            <button className="link" onClick={() => window.print()}>
              인쇄
            </button>
          </>
        }
      />
      <Spread
        left={
          <>
            <div className="order-1">
              <DiaryCover d={d} />
            </div>
            <div className="order-2">
              <DiaryOverview d={d} />
            </div>
            <div className="no-print order-5 flex flex-wrap justify-center gap-3 wide:justify-start">
              <Button onClick={() => go('select')}>새 여행 시작</Button>
              <Button onClick={() => go('title')}>표지로</Button>
            </div>
          </>
        }
        right={
          <>
            <article className="order-3">
              <DiaryDays d={d} />
            </article>
            <div className="order-4">
              <DiaryClosing d={d} />
            </div>
          </>
        }
      />
    </main>
  )
}

export function Shelf() {
  const shelf = useGame((s) => s.shelf)
  const showDiary = useGame((s) => s.showDiary)
  const go = useGame((s) => s.go)
  return (
    <main className="page page-wide fade-in">
      <TopBar label="서가" back="표지" onBack={() => go('title')} />
      <Spread
        left={
          <>
            <div className="order-1">
              <h1 className="m-0 mb-2 text-[1.6rem] font-semibold">지난 여행일지</h1>
              <p className="noindent mb-6 text-ink-soft">끝까지 마친 여행은 이곳에 한 권씩 꽂힌다. 최근 스무 권까지 보관된다.</p>
            </div>
            <div className="order-3 hidden wide:block">
              <Plate media={['waibaidu-1', 'waibaidu-3']} />
            </div>
          </>
        }
        right={
          <div className="order-2">
      {shelf.length === 0 && <p className="text-ink-faint">아직 완성된 여행일지가 없다.</p>}
      <ol className="m-0 list-none p-0">
        {shelf.map((d) => (
          <li key={d.runId} className="border-t border-rule last:border-b">
            <button className="group flex w-full cursor-pointer items-baseline justify-between gap-4 bg-transparent px-1 py-4 text-left" onClick={() => showDiary(d)}>
              <span>
                <span className="block group-hover:text-seal">{d.ending.title}</span>
                <span className="text-sm text-ink-faint">
                  {d.travelerName} · {new Date(d.createdAt).toLocaleDateString('ko-KR')} · {d.overview.places.length}곳
                </span>
              </span>
              <span className="shrink-0 text-lg text-seal">
                {d.score.grade.letter} <span className="text-sm text-ink-soft">{d.score.total}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
          </div>
        }
      />
    </main>
  )
}
