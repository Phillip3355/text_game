import { content } from '../../content'
import { useGame } from '../../store/game'
import { Plate } from '../components/Plate'
import { Spread } from '../components/Spread'
import { Button } from '../components/bits'
import { ScoreTable } from './Diary'

/** The last pages of the book: ending, grade and score — then the diary. */
export function Result() {
  const d = useGame((s) => s.openDiary)
  const showDiary = useGame((s) => s.showDiary)
  const go = useGame((s) => s.go)
  if (!d) return null
  return (
    <main className="page page-wide fade-in">
      <Spread
        left={
          <>
            <div className="order-2">
              <Plate media={['waibaidu-2', 'bund-1']} eager />
            </div>
            <div className="order-4">
              <div className="mb-6 flex items-baseline justify-center gap-4 wide:justify-start">
                <p className="m-0 text-6xl leading-none text-seal">{d.score.grade.letter}</p>
                <p className="m-0 text-ink-soft">
                  {d.score.grade.title}
                  <span className="ml-2 tabular-nums text-ink">{d.score.total}점</span>
                </p>
              </div>
              <ScoreTable d={d} />
              {d.overview.achievements.length > 0 && (
                <p className="noindent mb-6 text-center text-sm text-ink-soft wide:text-left">업적 — {d.overview.achievements.join(' · ')}</p>
              )}
            </div>
          </>
        }
        right={
          <>
            <div className="order-1">
              <p className="small-caps m-0 mb-1 text-center text-ink-faint wide:text-left">The End</p>
              <h1 className="m-0 mb-8 text-center text-[1.8rem] font-semibold wide:text-left">{d.ending.title}</h1>
            </div>
            <div className="order-3">
              <div className="prose-book">
                {d.ending.text.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
              <p className="ornament">· · ·</p>
              <p className="noindent mb-8 text-center text-sm text-ink-faint wide:text-left">
                이번 여행에서 {d.overview.eventCount}개의 장면을 지났다. 이 책에는 {Object.keys(content.events).length}개의 장면이 있다 — 다른 선택은 다른 길로
                이어진다.
              </p>
            </div>
            <div className="order-5 flex flex-wrap justify-center gap-3 wide:justify-start">
              <Button primary onClick={() => showDiary(d)}>
                여행일지 펼치기
              </Button>
              <Button onClick={() => go('select')}>다시 떠나기</Button>
              <Button onClick={() => go('title')}>표지로</Button>
            </div>
          </>
        }
      />
    </main>
  )
}
