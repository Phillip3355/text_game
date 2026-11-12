// Tiny WebAudio cues — no audio files, so no licensing questions.
let ctx: AudioContext | null = null

function tone(freqs: number[], dur: number, volume: number, type: OscillatorType = 'sine') {
  if (volume <= 0) return
  try {
    ctx ??= new AudioContext()
    const t0 = ctx.currentTime
    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator()
      const gain = ctx!.createGain()
      osc.type = type
      osc.frequency.value = f
      const start = t0 + i * dur * 0.6
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.12 * volume, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
      osc.connect(gain).connect(ctx!.destination)
      osc.start(start)
      osc.stop(start + dur + 0.02)
    })
  } catch {
    /* audio unavailable */
  }
}

export const sfx = {
  page: (v: number) => tone([520], 0.12, v * 0.6, 'triangle'),
  success: (v: number) => tone([660, 880], 0.18, v),
  failure: (v: number) => tone([330, 247], 0.22, v, 'triangle'),
  select: (v: number) => tone([440], 0.08, v * 0.5, 'triangle'),
}
