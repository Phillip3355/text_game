import type { Content, GameEvent } from '../engine/types'
import { E01, E20, E21, E22 } from './events/core'
import { E07, E17, E18, E19 } from './events/encounters'
import { E05, E11, E16, E23, E24 } from './events/food'
import { E02, E03, E04, E06, E08, E09, E10, E12, E13, E14, E15, E25 } from './events/sights'
import { facts } from './facts'
import { media } from './media'
import { achievements, endings, items, locations, tagLabels, travelers } from './world'

const eventList: GameEvent[] = [
  E01, E02, E03, E04, E05, E06, E07, E08, E09, E10, E11, E12, E13,
  E14, E15, E16, E17, E18, E19, E20, E21, E22, E23, E24, E25,
]

// media → events back-references (for the credits screen)
for (const e of eventList) {
  for (const id of [...e.media, ...(e.video ? [e.video] : [])]) {
    const m = media[id]
    if (m && !m.events.includes(e.id)) m.events.push(e.id)
  }
}

export const content: Content = {
  events: Object.fromEntries(eventList.map((e) => [e.id, e])),
  locations,
  items,
  facts,
  travelers,
  achievements,
  endings,
  media,
  tagLabels,
}
