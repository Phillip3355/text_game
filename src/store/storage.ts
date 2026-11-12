// LocalStorage access. Every call is wrapped: private mode, quota errors or
// corrupt JSON must never break the game — we just fall back to defaults.
import { content } from '../content'
import { validateSave } from '../engine'
import type { Diary, GameState } from '../engine'

const KEYS = {
  game: 'shanghai-journey/save',
  settings: 'shanghai-journey/settings',
  shelf: 'shanghai-journey/diaries',
}

export interface Settings {
  version: 1
  textSize: 'small' | 'medium' | 'large'
  sfxVolume: number
  reduceMotion: boolean
}

export const DEFAULT_SETTINGS: Settings = { version: 1, textSize: 'medium', sfxVolume: 0.5, reduceMotion: false }

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — game keeps running in memory */
  }
}

export function loadGame(): GameState | null {
  const raw = read(KEYS.game)
  const ok = validateSave(raw, content)
  if (raw && !ok) write(KEYS.game, null) // discard incompatible save safely
  return ok
}
export const saveGame = (s: GameState | null) => write(KEYS.game, s)

export function loadSettings(): Settings {
  const raw = read(KEYS.settings) as Partial<Settings> | null
  if (!raw || raw.version !== 1) return DEFAULT_SETTINGS
  return {
    version: 1,
    textSize: raw.textSize === 'small' || raw.textSize === 'large' ? raw.textSize : 'medium',
    sfxVolume: typeof raw.sfxVolume === 'number' ? Math.max(0, Math.min(1, raw.sfxVolume)) : 0.5,
    reduceMotion: raw.reduceMotion === true,
  }
}
export const saveSettings = (s: Settings) => write(KEYS.settings, s)

export function loadShelf(): Diary[] {
  const raw = read(KEYS.shelf)
  if (!Array.isArray(raw)) return []
  return raw.filter((d): d is Diary => !!d && typeof d === 'object' && typeof (d as Diary).runId === 'string' && Array.isArray((d as Diary).days))
}
export const saveShelf = (d: Diary[]) => write(KEYS.shelf, d)

export function clearAll(): void {
  write(KEYS.game, null)
  write(KEYS.shelf, null)
  write(KEYS.settings, null)
}
