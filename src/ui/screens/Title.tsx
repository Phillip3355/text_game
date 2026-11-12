import { content } from '../../content'
import { useGame } from '../../store/game'
import { Plate } from '../components/Plate'
import { Spread } from '../components/Spread'
import { Button } from '../components/bits'

export function Title() {
  const game = useGame((s) => s.game)
  const shelf = useGame((s) => s.shelf)
  const go = useGame((s) => s.go)
  const openAside = useGame((s) => s.openAside)
  const showDiary = useGame((s) => s.showDiary)
  const canContinue = game && game.phase !== 'ended'

  return (
    <main className="page page-wide fade-in flex min-h-svh flex-col">
      <Spread
        className="spread-center"
        left={
          <div className="order-2">
            <Plate media={['bund-1', 'lujiazui-1']} eager />
          </div>
        }
        right={
          <>
            <header className="order-1 mt-6 mb-8 text-center sm:mt-12 wide:mt-0">
              <p className="small-caps m-0 text-ink-faint">A Travel Book in Twelve Scenes</p>
              <p className="m-0 mt-6 text-5xl tracking-[0.3em] text-seal sm:text-6xl" aria-hidden="true">
                上海
              </p>
              <h1 className="m-0 mt-4 text-[1.9rem] font-semibold tracking-wide">상하이 여행기</h1>
              <p className="m-0 mt-1 small-caps text-ink-soft">Shanghai Journey</p>
            </header>
            <div className="order-3">
              <p className="noindent mb-10 text-center text-[0.95rem] text-ink-soft">
                사흘, 열두 번의 시간. 어디로 갈지, 누구에게 말을 걸지는 당신이 정한다.
                <br />
                여행이 끝나면 한 권의 여행일지가 남는다.
              </p>

              <nav className="mx-auto flex w-full max-w-xs flex-col gap-3" aria-label="메인 메뉴">
                {canContinue && (
                  <Button primary onClick={() => go('play')}>
                    이어 읽기 · {content.travelers[game.traveler].name}, {Math.floor(game.slotIndex / 4) + 1}일째
                  </Button>
                )}
                <Button primary={!canContinue} onClick={() => go('select')}>
                  {canContinue ? '새 여행 시작 (지금 여행은 사라짐)' : '새 여행 시작'}
                </Button>
                <Button onClick={() => (shelf.length === 1 ? showDiary(shelf[0]) : go('shelf'))} disabled={!shelf.length}>
                  여행일지 서가 {shelf.length > 0 && `(${shelf.length})`}
                </Button>
              </nav>

              <footer className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-12 text-sm text-ink-soft">
                <button className="link" onClick={() => openAside('about')}>
                  게임 소개
                </button>
                <button className="link" onClick={() => openAside('settings')}>
                  설정
                </button>
                <button className="link" onClick={() => openAside('credits')}>
                  미디어 출처
                </button>
              </footer>
            </div>
          </>
        }
      />
    </main>
  )
}
