import { useEffect } from 'react'
import { content } from '../../content'
import { useGame } from '../../store/game'
import { Plate } from '../components/Plate'
import { Spread } from '../components/Spread'
import { Button } from '../components/bits'

function Tip({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 border-t border-rule py-4 first:wide:border-t-0 first:wide:pt-0">
      <span className="w-5 shrink-0 text-right text-seal">{n}.</span>
      <div className="min-w-0 flex-1">
        <p className="m-0 font-semibold">{title}</p>
        <div className="mt-1 text-[0.92rem] text-ink-soft">{children}</div>
      </div>
    </li>
  )
}

/** A one-page primer shown at the start of every journey. */
export function Guide() {
  const game = useGame((s) => s.game)
  const go = useGame((s) => s.go)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Enter' && go('play')
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])
  if (!game) return null
  const t = content.travelers[game.traveler]

  const start = (
    <Button primary onClick={() => go('play')}>
      상하이로 출발 →
    </Button>
  )

  return (
    <main className="page page-wide fade-in">
      <Spread
        left={
          <>
            <div className="order-1">
              <p className="small-caps m-0 mb-1 text-seal">읽기 전에</p>
              <h1 className="m-0 mb-2 text-[1.6rem] font-semibold">여행 안내</h1>
              <p className="noindent mb-6 text-ink-soft">
                {t.name}의 사흘이 시작된다. 하루는 아침·낮·오후·저녁 네 번, 모두 열두 번의 시간이 있다.
              </p>
            </div>
            <div className="order-3 hidden wide:block">
              <Plate media={['airport-1', 'airport-3']} />
            </div>
            <div className="order-4 flex justify-end wide:justify-start">{start}</div>
          </>
        }
        right={
          <ol className="order-2 m-0 mb-8 list-none border-b border-rule p-0 wide:mb-0 wide:border-b-0">
            <Tip n={1} title="번호를 골라 이야기를 넘긴다">
              장면마다 선택지가 있다. 눌러도 되고 숫자 키로 골라도 된다.
              <div className="mt-2 border border-rule bg-paper-deep px-3 py-2 text-[0.85rem]">
                <p className="m-0">
                  <span className="text-seal">1.</span> 현지인에게 중국어로 묻는다
                  <span className="ml-2 text-ink-faint">성공 확률 62%</span>
                </p>
                <p className="m-0 text-ink-faint">
                  <span>2.</span> <span className="line-through decoration-rule">건물을 자세히 관찰한다</span>
                  <span className="ml-2 text-seal/80">잠김 — 관찰력 2 이상</span>
                </p>
              </div>
              <p className="m-0 mt-2">확률이 적힌 선택은 운이 따른다. 표시된 숫자가 실제 확률이다. 줄이 그어진 선택은 조건이 모자라 아직 고를 수 없다.</p>
            </Tip>
            <Tip n={2} title="체력과 돈을 살핀다">
              화면 아래(넓은 화면에서는 왼쪽)에 체력·자금·능력치가 늘 보인다. 체력이 떨어지면 판정이 어려워지고, 바닥나면 쉬어야 한다. 하룻밤 자면 회복된다. 돈이
              없어도 언제나 고를 수 있는 길은 있다.
            </Tip>
            <Tip n={3} title="갈 곳은 내가 정한다">
              장면이 끝나면 다음 행선지 후보가 나온다. 가까운 곳은 걸어서, 먼 곳은 지하철로 간다. 가다 보면 뜻밖의 만남이 끼어들기도 한다.
            </Tip>
            <Tip n={4} title="많이 보고, 먹고, 이야기할수록">
              명소·역사·음식·문제 해결·다양성으로 100점 만점의 평가를 받는다. 같은 일을 두 번 해도 점수는 한 번만 오른다. ‘여백의 메모’를 펼치면 실제 장소 정보와
              출처를 볼 수 있다.
            </Tip>
            <Tip n={5} title="막히면 목차를 연다">
              오른쪽 위 ‘목차’에서 능력치, 소지품, 방문한 곳, 업적, 모은 지식을 볼 수 있다. 진행은 자동으로 저장된다.
            </Tip>
          </ol>
        }
      />
    </main>
  )
}
