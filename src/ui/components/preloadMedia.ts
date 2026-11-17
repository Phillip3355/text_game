import { content } from '../../content'

const url = (p: string) => import.meta.env.BASE_URL + p

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
