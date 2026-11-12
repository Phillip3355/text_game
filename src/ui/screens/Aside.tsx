import { useState } from 'react'
import { content } from '../../content'
import { useGame } from '../../store/game'
import { Plate } from '../components/Plate'
import { Spread, TopBar } from '../components/Spread'
import { Button } from '../components/bits'

/** Left page: title, a short lead and an optional photo. Right page: the content. */
function Frame({ label, title, lead, media, children }: { label: string; title: string; lead?: React.ReactNode; media?: string[]; children: React.ReactNode }) {
  const close = useGame((s) => s.closeAside)
  return (
    <main className="page page-wide fade-in">
      <TopBar label={label} back="돌아가기" onBack={close} />
      <Spread
        left={
          <>
            <div className="order-1">
              <h1 className="m-0 mb-4 text-[1.6rem] font-semibold">{title}</h1>
              {lead && <div className="mb-6 text-[0.92rem] text-ink-soft">{lead}</div>}
            </div>
            {media && (
              <div className="order-3 hidden wide:block">
                <Plate media={media} />
              </div>
            )}
          </>
        }
        right={<div className="order-2">{children}</div>}
      />
    </main>
  )
}

export function Settings() {
  const settings = useGame((s) => s.settings)
  const update = useGame((s) => s.updateSettings)
  const resetAll = useGame((s) => s.resetAll)
  const [confirm, setConfirm] = useState(false)
  const sizes: { v: typeof settings.textSize; l: string }[] = [
    { v: 'small', l: '작게' },
    { v: 'medium', l: '보통' },
    { v: 'large', l: '크게' },
  ]
  return (
    <Frame label="설정" title="읽기 설정" lead={<p className="m-0">글자 크기와 소리, 화면 전환을 고른다. 바꾸는 즉시 저장된다.</p>} media={['wukang-2']}>
      <section className="mb-8">
        <h2 className="m-0 mb-3 text-base font-semibold">글자 크기</h2>
        <div className="flex gap-2" role="radiogroup" aria-label="글자 크기">
          {sizes.map((s) => (
            <button
              key={s.v}
              role="radio"
              aria-checked={settings.textSize === s.v}
              onClick={() => update({ textSize: s.v })}
              className={settings.textSize === s.v ? 'btn btn-on min-w-16' : 'btn min-w-16'}
            >
              {s.l}
            </button>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="m-0 mb-3 text-base font-semibold">
          <label htmlFor="sfx">효과음 크기</label>
        </h2>
        <div className="flex items-center gap-4">
          <input
            id="sfx"
            type="range"
            min={0}
            max={100}
            step={10}
            value={Math.round(settings.sfxVolume * 100)}
            onChange={(e) => update({ sfxVolume: Number(e.target.value) / 100 })}
            className="w-56 accent-[var(--seal)]"
          />
          <span className="w-12 text-sm tabular-nums text-ink-soft">{settings.sfxVolume === 0 ? '끔' : `${Math.round(settings.sfxVolume * 100)}%`}</span>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="m-0 mb-3 text-base font-semibold">애니메이션</h2>
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={settings.reduceMotion} onChange={(e) => update({ reduceMotion: e.target.checked })} className="h-5 w-5 accent-[var(--seal)]" />
          화면 전환 효과 줄이기
        </label>
      </section>
      <section className="mb-8 border-t border-rule pt-6">
        <h2 className="m-0 mb-2 text-base font-semibold">기록 초기화</h2>
        <p className="noindent mb-3 text-sm text-ink-soft">진행 중인 여행, 완성된 여행일지, 설정이 모두 지워진다. 되돌릴 수 없다.</p>
        {confirm ? (
          <div className="flex gap-3">
            <Button primary onClick={resetAll}>
              정말 지우기
            </Button>
            <Button onClick={() => setConfirm(false)}>취소</Button>
          </div>
        ) : (
          <Button onClick={() => setConfirm(true)}>모든 기록 지우기</Button>
        )}
      </section>
    </Frame>
  )
}

export function About() {
  return (
    <Frame
      label="게임 소개"
      title="이 책에 대하여"
      media={['yuyuan-1']}
      lead={
        <>
          <p className="small-caps m-0 mb-2 text-ink-faint">읽는 법</p>
          <ul className="m-0 pl-5 leading-loose">
            <li>번호가 붙은 선택지 가운데 하나를 고른다. 숫자 키로도 고를 수 있다.</li>
            <li>흐리게 줄이 그어진 선택지는 잠겨 있다. 아래에 필요한 조건이 적혀 있다.</li>
            <li>‘성공 확률’이 적힌 선택지는 판정이 있다. 표시된 확률이 실제 확률이다.</li>
            <li>체력이 떨어지면 판정이 어려워지고, 바닥나면 쉬어야 한다. 하룻밤 자면 회복된다.</li>
            <li>‘여백의 메모’를 펼치면 그 장소에 관한 실제 정보와 출처를 볼 수 있다.</li>
            <li>진행은 선택할 때마다 자동으로 저장된다.</li>
          </ul>
        </>
      }
    >
      <div className="prose-book">
        <p>
          『상하이 여행기』는 상하이에서 보내는 사흘을 열두 개의 장면으로 엮은 선택형 텍스트 어드벤처다. 장면마다 실제 장소의 사진이 실려 있고,
          당신의 선택과 능력치, 그리고 약간의 운에 따라 다음 장면이 달라진다.
        </p>
        <p>
          여행이 끝나면 실제로 겪은 일만으로 한 권의 여행일지가 만들어지고, 100점 만점의 평가와 일곱 가지 엔딩 중 하나를 받는다. 이 책에는{' '}
          {Object.keys(content.events).length}개의 장면이 있지만 한 번의 여행에서는 그중 열 개 남짓만 지나게 된다.
        </p>
      </div>
      <h2 className="mt-8 mb-3 text-lg font-semibold">사실과 허구</h2>
      <div className="prose-book">
        <p>
          장소, 역사, 음식에 관한 설명(‘여백의 메모’)은 위키백과 등 확인 가능한 자료를 바탕으로 썼고, 메모마다 출처를 달았다. 반면 게임 속 인물과 대사,
          사건은 모두 지어낸 이야기다.
        </p>
        <p>
          게임 속 돈(¥)은 놀이를 위한 가상의 값이다. 실제 입장료, 교통비, 음식값과는 다르니 여행 계획에는 공식 안내를 확인하자.
        </p>
      </div>
    </Frame>
  )
}

export function Credits() {
  const list = Object.values(content.media)
  return (
    <Frame
      label="미디어 출처"
      title="사진과 영상"
      lead={
        <>
          <p className="m-0 mb-3">
            이 책의 모든 사진과 영상은 Wikimedia Commons에서 자유 라이선스(CC0, 퍼블릭 도메인, CC BY, CC BY-SA)로 공개된 자료다. 저작자와 원본 링크는
            옆(작은 화면에서는 아래)에 있다. 사진은 화면에 맞게 크기만 줄였다. 영상은 Wikimedia Commons가 제공하는 변환본을 사용했다.
          </p>
          <p className="m-0 text-xs text-ink-faint">
            사진 {list.filter((m) => m.kind === 'image').length}장 · 영상 {list.filter((m) => m.kind === 'video').length}개
          </p>
        </>
      }
    >
      <ol className="m-0 list-none p-0 text-[0.85rem]">
        {list.map((m) => (
          <li key={m.id} className="border-t border-rule py-2.5">
            <span className="text-ink">{m.caption}</span>
            <span className="ml-1 text-xs text-ink-faint">({m.kind === 'video' ? '영상' : '사진'}{m.events.length ? ` · ${m.events.join(', ')}` : ''})</span>
            <br />
            <span className="text-ink-soft">
              {m.author} ·{' '}
              {m.licenseUrl ? (
                <a className="link text-ink-soft" href={m.licenseUrl} target="_blank" rel="noreferrer">
                  {m.license}
                </a>
              ) : (
                m.license
              )}{' '}
              ·{' '}
              <a className="link text-ink-soft" href={m.sourceUrl} target="_blank" rel="noreferrer">
                원본
              </a>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-ink-faint">글꼴: Noto Serif KR (SIL Open Font License). 효과음은 브라우저에서 직접 합성한 소리다.</p>
    </Frame>
  )
}
