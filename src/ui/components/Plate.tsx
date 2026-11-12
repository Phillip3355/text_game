import { useEffect, useRef, useState } from 'react'
import { content } from '../../content'
import type { MediaAsset } from '../../engine'
import { useGame } from '../../store/game'

const url = (p: string) => import.meta.env.BASE_URL + p

interface Props {
  /** photo ids in fallback order — all are photos of the same place */
  media: string[]
  video?: string
  /** smaller, inline plate (diary) */
  compact?: boolean
  eager?: boolean
}

/**
 * A book plate: a real photo (or a muted looping video) with a small caption
 * and attribution. If the video fails, the place's photo is shown; if every
 * photo fails, a plain notice — never an unrelated image.
 */
export function Plate({ media, video, compact, eager }: Props) {
  const [idx, setIdx] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)
  const key = media.join('|') + (video ?? '')
  useEffect(() => {
    setIdx(0)
    setVideoFailed(false)
  }, [key])

  const v = video && !videoFailed ? content.media[video] : undefined
  const photo = content.media[media[idx]]
  const shown = v ?? photo
  const alt = shown?.caption ?? ''

  return (
    <figure className={`plate m-0 ${compact ? 'mb-3' : 'mb-7'}`}>
      {v ? (
        <PlateVideo v={v} poster={v.poster ? url(v.poster) : photo ? url(photo.src) : undefined} alt={alt} onFail={() => setVideoFailed(true)} />
      ) : photo ? (
        <img
          key={photo.id}
          className="border border-rule"
          src={url(photo.src)}
          srcSet={photo.srcSmall ? `${url(photo.srcSmall)} 800w, ${url(photo.src)} 1280w` : undefined}
          sizes="(max-width: 640px) 100vw, 38rem"
          width={photo.width}
          height={photo.height}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setIdx((i) => i + 1)}
        />
      ) : (
        <div
          role="img"
          aria-label="사진을 불러오지 못했습니다"
          className="flex aspect-[3/2] items-center justify-center border border-dashed border-rule bg-paper-deep px-6 text-center text-sm text-ink-faint"
        >
          이 장면의 사진을 불러오지 못했습니다. 네트워크 연결을 확인한 뒤 다시 열어 주세요.
        </div>
      )}
      {shown && (
        <figcaption>
          {shown.caption}
          <span className="mx-1">·</span>
          <a href={shown.sourceUrl} target="_blank" rel="noreferrer" className="link text-ink-faint">
            {shown.author}
          </a>
          , {shown.license}
        </figcaption>
      )}
    </figure>
  )
}

/** Should looping video start on its own? Not when the reader asked for less motion or less data. */
function wantsAutoplay(reduceMotionSetting: boolean): boolean {
  if (reduceMotionSetting) return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return false
  } catch {
    /* old browsers */
  }
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !conn?.saveData
}

/**
 * Muted looping video with a visible pause/play control (WCAG 2.2.2: moving
 * content longer than 5 s must be pausable). If autoplay is blocked by the
 * browser (low-power / data-saver modes) the poster stays and the button
 * offers to play.
 */
function PlateVideo({ v, poster, alt, onFail }: { v: MediaAsset; poster?: string; alt: string; onFail: () => void }) {
  const reduceMotion = useGame((s) => s.settings.reduceMotion)
  const ref = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    userPaused.current = false
    if (wantsAutoplay(reduceMotion)) {
      el.play().catch(() => setPlaying(false)) // autoplay blocked → poster + play button
    } else {
      el.pause()
    }
  }, [v.id, reduceMotion])

  const restart = (el: HTMLVideoElement) => {
    if (userPaused.current) return
    el.currentTime = 0
    void el.play().catch(() => {})
  }
  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) {
      userPaused.current = false
      void el.play().catch(() => {})
    } else {
      userPaused.current = true
      el.pause()
    }
  }

  return (
    <div className="relative">
      <video
        ref={ref}
        key={v.id}
        className="border border-rule"
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={onFail}
        // `loop` alone is unreliable for some WebM files in some browsers
        // (they stop at the end instead of seeking back), so restart by hand.
        onEnded={(e) => restart(e.currentTarget)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget
          // a stream that stalls on its last frame without firing `ended`
          if (el.duration && el.paused && !el.seeking && el.currentTime >= el.duration - 0.05) restart(el)
        }}
      >
        {(v.sources ?? [{ src: v.src, type: 'video/webm' }]).map((s, i, arr) => (
          <source key={s.src} src={url(s.src)} type={s.type} onError={i === arr.length - 1 ? onFail : undefined} />
        ))}
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        className="no-print absolute right-2 bottom-2 cursor-pointer border border-rule bg-paper/90 px-2.5 py-1 text-[0.75rem] text-ink hover:border-seal hover:text-seal"
      >
        {playing ? '❚❚ 영상 멈춤' : '▶ 영상 재생'}
      </button>
    </div>
  )
}

/** Warm the browser cache for upcoming plates. */
export function preloadMedia(ids: string[]) {
  for (const id of ids) {
    const m = content.media[id]
    if (!m || m.kind !== 'image') continue
    const img = new Image()
    img.srcset = m.srcSmall ? `${url(m.srcSmall)} 800w, ${url(m.src)} 1280w` : ''
    img.sizes = '(max-width: 640px) 100vw, 38rem'
    img.src = url(m.src)
  }
}
