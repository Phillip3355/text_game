import { content } from '../../content'
import { STAT_LABEL } from '../../engine'
import type { StatKey, TravelerId } from '../../engine'
import { useGame } from '../../store/game'
import { Plate } from '../components/Plate'
import { Spread, TopBar } from '../components/Spread'

const ORDER: TravelerId[] = ['linguist', 'foodie', 'wanderer']

export function TravelerSelect() {
  const start = useGame((s) => s.start)
  const go = useGame((s) => s.go)
  return (
    <main className="page page-wide fade-in">
      <TopBar label="등장인물" back="표지" onBack={() => go('title')} />
      <Spread
        left={
          <>
            <div className="order-1">
              <h1 className="m-0 mb-2 text-[1.6rem] font-semibold">이 책의 주인공은 누구인가</h1>
              <p className="noindent mb-8 text-ink-soft">여행자에 따라 처음 능력치와 소지품, 열리는 선택지가 다르다. 누구로 떠나도 끝까지 갈 수 있다.</p>
            </div>
            <div className="order-3 hidden wide:block">
              <Plate media={['airport-1', 'airport-3']} />
            </div>
          </>
        }
        right={
          <div className="order-2">
            {ORDER.map((id, i) => {
              const t = content.travelers[id]
              return (
                <section key={id} className="border-t border-rule py-6 first:wide:border-t-0 first:wide:pt-0 last:border-b wide:last:border-b-0">
                  <p className="small-caps m-0 text-seal">{['I', 'II', 'III'][i]}</p>
                  <h2 className="m-0 text-xl font-semibold">{t.name}</h2>
                  <p className="m-0 mb-3 text-sm italic text-ink-soft">“{t.tagline}”</p>
                  <p className="noindent mb-3">{t.description}</p>
                  <dl className="m-0 mb-3 grid grid-cols-2 gap-x-6 gap-y-0.5 text-[0.88rem] sm:grid-cols-3 wide:grid-cols-2">
                    {(Object.keys(STAT_LABEL) as StatKey[]).map((k) => (
                      <div key={k} className="flex justify-between">
                        <dt className="text-ink-soft">{STAT_LABEL[k]}</dt>
                        <dd className="m-0 tracking-[0.2em]">
                          <span className="text-seal">{'●'.repeat(t.stats[k])}</span>
                          <span className="text-rule">{'●'.repeat(5 - t.stats[k])}</span>
                        </dd>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">체력</dt>
                      <dd className="m-0">{t.stamina}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">자금</dt>
                      <dd className="m-0">¥{t.money}</dd>
                    </div>
                  </dl>
                  <p className="m-0 mb-4 text-[0.85rem] text-ink-soft">
                    소지품: {t.items.map((x) => content.items[x].name).join(', ')}
                    <br />
                    특징: {t.perk}
                  </p>
                  <button onClick={() => start(id)} className="btn btn-primary">
                    {t.name}로 떠난다 →
                  </button>
                </section>
              )
            })}
          </div>
        }
      />
    </main>
  )
}
