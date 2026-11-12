import { create } from 'zustand'
import { content } from '../content'
import { advance, applyChoice, buildDiary, chooseDestination, newGame } from '../engine'
import type { Diary, GameState, LogEntry, TravelerId } from '../engine'
import { sfx } from './sound'
import { clearAll, DEFAULT_SETTINGS, loadGame, loadSettings, loadShelf, saveGame, saveSettings, saveShelf } from './storage'
import type { Settings } from './storage'

export type Screen = 'title' | 'select' | 'guide' | 'play' | 'result' | 'diary' | 'shelf' | 'settings' | 'about' | 'credits'

interface Store {
  screen: Screen
  /** where to return from settings/about/credits */
  back: Screen
  game: GameState | null
  lastEntry: LogEntry | null
  settings: Settings
  shelf: Diary[]
  /** diary currently opened on the diary screen */
  openDiary: Diary | null
  resolving: boolean
  menuOpen: boolean

  go: (s: Screen) => void
  openAside: (s: 'settings' | 'about' | 'credits') => void
  closeAside: () => void
  setMenu: (open: boolean) => void
  start: (t: TravelerId) => void
  choose: (choiceId: string) => void
  next: () => void
  destination: (eventId: string) => void
  showDiary: (d: Diary) => void
  updateSettings: (patch: Partial<Settings>) => void
  resetAll: () => void
}

const initialGame = loadGame()

export const useGame = create<Store>((set, get) => ({
  screen: 'title',
  back: 'title',
  game: initialGame,
  lastEntry: initialGame?.phase === 'result' ? initialGame.log.at(-1) ?? null : null,
  settings: loadSettings(),
  shelf: loadShelf(),
  openDiary: null,
  resolving: false,
  menuOpen: false,

  go: (screen) => {
    sfx.page(get().settings.sfxVolume)
    set({ screen, menuOpen: false })
    window.scrollTo({ top: 0 })
  },
  openAside: (s) => set({ back: get().screen, screen: s, menuOpen: false }),
  closeAside: () => set({ screen: get().back }),
  setMenu: (menuOpen) => set({ menuOpen }),

  start: (traveler) => {
    const seed = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0
    const game = newGame(content, traveler, seed)
    saveGame(game)
    set({ game, lastEntry: null, screen: 'guide' })
    window.scrollTo({ top: 0 })
  },

  choose: (choiceId) => {
    const { game, resolving, settings } = get()
    if (!game || resolving || game.phase !== 'event') return
    set({ resolving: true }) // lock against double input
    const r = applyChoice(game, content, choiceId)
    if (r.error || !r.entry) {
      set({ resolving: false })
      return
    }
    if (r.entry.success === true) sfx.success(settings.sfxVolume)
    else if (r.entry.success === false) sfx.failure(settings.sfxVolume)
    else sfx.select(settings.sfxVolume)
    saveGame(r.state)
    set({ game: r.state, lastEntry: r.entry, resolving: false })
  },

  next: () => {
    const { game, resolving, shelf } = get()
    if (!game || resolving || game.phase !== 'result') return
    set({ resolving: true })
    const g = advance(game, content)
    sfx.page(get().settings.sfxVolume)
    if (g.phase === 'ended') {
      const diary = buildDiary(g, content)
      const nextShelf = [diary, ...shelf.filter((d) => d.runId !== diary.runId)].slice(0, 20)
      saveShelf(nextShelf)
      saveGame(g)
      set({ game: g, lastEntry: null, shelf: nextShelf, openDiary: diary, screen: 'result', resolving: false })
    } else {
      saveGame(g)
      set({ game: g, lastEntry: null, resolving: false })
    }
    window.scrollTo({ top: 0 })
  },

  destination: (eventId) => {
    const { game, resolving } = get()
    if (!game || resolving || game.phase !== 'destination') return
    const g = chooseDestination(game, content, eventId)
    sfx.page(get().settings.sfxVolume)
    saveGame(g)
    set({ game: g })
    window.scrollTo({ top: 0 })
  },

  showDiary: (d) => set({ openDiary: d, screen: 'diary' }),

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch }
    saveSettings(settings)
    set({ settings })
  },

  resetAll: () => {
    clearAll()
    set({ game: null, lastEntry: null, shelf: [], openDiary: null, settings: DEFAULT_SETTINGS, screen: 'title' })
  },
}))
