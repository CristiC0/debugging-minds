<script lang="ts">
// Module scope (not per instance): one id per browser window, so timers in the same
// window never echo each other's pause/resume messages.
const WINDOW_ID = Math.random().toString(36).slice(2)
// One running clock per window: a timer that starts tells every other timer in this window to reset.
const RUN_EVENT = 'dm-timer-run'
</script>

<script setup lang="ts">
// Countdown for quiz questions.
//
// Start: driven by presenter clicks so audience + presenter windows start together.
//   at = 0 → starts when the slide is entered (after `delay` seconds); at = N → starts at click N (set `clicks:` in frontmatter).
// Freeze: stopAt = N freezes the clock at click N (e.g. the answer reveal); going back resumes it.
// Pause / resume / restart: click the timer. Synced between windows of the same browser
//   (presenter view ↔ audience window) over a BroadcastChannel.
// Sound: short ticks in the last 3 s and a buzzer at 0, only in the audience window.
import { computed, onUnmounted, ref, watch } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'


const props = withDefaults(defineProps<{
  seconds?: number
  at?: number
  stopAt?: number
  variant?: 'digits' | 'bar' | 'ring' | 'block' | 'alarm'
  warn?: number          // turns red at or below this many seconds
  sound?: boolean
  id?: string            // only needed for two timers with the same seconds + variant on one slide
  label?: boolean        // show "Time" caption
  delay?: number         // seconds to wait before starting once the start condition is met
}>(), { delay: 0, seconds: 30, at: 0, variant: 'digits', warn: 10, sound: true, label: true })

const emit = defineEmits<{ done: [] }>()

const { $clicks, $page, $renderContext } = useSlideContext()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))

type Status = 'idle' | 'running' | 'paused' | 'stopped' | 'done'
const status = ref<Status>('idle')
const remaining = ref(props.seconds * 1000)
let endsAt = 0
let raf = 0
let lastTick = 0
let ctx: AudioContext | null = null

const total = computed(() => props.seconds * 1000)
const secs = computed(() => Math.max(0, Math.ceil(remaining.value / 1000)))
const frac = computed(() => Math.max(0, Math.min(1, remaining.value / total.value)))
const display = computed(() => {
  const s = secs.value
  return String(s).padStart(2, '0') // seconds only: 60, 59 … 01, 00
})
const isWarn = computed(() => status.value !== 'idle' && secs.value <= props.warn)
const isFinal = computed(() => status.value === 'running' && secs.value <= 3 && secs.value > 0)

// ---------- clock ----------
const uid = Math.random().toString(36).slice(2)
function frame() {
  // never tick (or buzz, or fire `done`) for a slide we are no longer on
  if (!shouldRun.value) { reset(); return }
  remaining.value = Math.max(0, endsAt - performance.now())
  tickSound()
  if (remaining.value <= 0) {
    status.value = 'done'
    buzz()
    emit('done')
    return
  }
  raf = requestAnimationFrame(frame)
}
function run(ms: number) {
  if (!live.value || !active.value) { reset(); return } // only the slide on screen may own a clock
  cancelAnimationFrame(raf)
  remaining.value = ms
  endsAt = performance.now() + ms
  status.value = 'running'
  lastTick = Math.ceil(ms / 1000)
  raf = requestAnimationFrame(frame)
  window.dispatchEvent(new CustomEvent(RUN_EVENT, { detail: uid }))
}
function onOtherRun(e: Event) {
  if ((e as CustomEvent).detail !== uid && status.value !== 'idle') { clearTimeout(startTimer); reset() }
}
window.addEventListener(RUN_EVENT, onOtherRun)
function pause(ms = remaining.value) {
  cancelAnimationFrame(raf)
  remaining.value = ms
  status.value = 'paused'
}
function reset() {
  cancelAnimationFrame(raf)
  remaining.value = total.value
  status.value = 'idle'
}

// ---------- start from slide state ----------
const shouldRun = computed(() => live.value && active.value && $clicks.value >= props.at)
let startTimer: ReturnType<typeof setTimeout> | undefined
watch(shouldRun, (go, was) => {
  clearTimeout(startTimer)
  if (go && !was) {
    if (props.delay > 0) startTimer = setTimeout(() => run(total.value), props.delay * 1000)
    else run(total.value)
  }
  else if (!go) reset()
}, { immediate: true })

const shouldStop = computed(() => props.stopAt !== undefined && $clicks.value >= props.stopAt)
watch(shouldStop, (stop) => {
  if (stop && (status.value === 'running' || status.value === 'paused')) {
    cancelAnimationFrame(raf)
    status.value = 'stopped'
  }
  else if (!stop && status.value === 'stopped') {
    run(remaining.value)
  }
}, { immediate: true })

// ---------- manual control, synced across windows ----------
const key = computed(() => `${$page.value}:${props.id ?? `${props.seconds}-${props.variant}`}`)
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('dm-timer') : null
channel?.addEventListener('message', (e) => {
  const m = e.data
  if (m?.from === WINDOW_ID || m?.key !== key.value || !active.value) return
  if (m.action === 'pause') pause(m.remaining)
  if (m.action === 'resume') run(m.remaining)
})
function toggle() {
  if (!live.value) return
  let msg
  if (status.value === 'running') { pause(); msg = { action: 'pause', remaining: remaining.value } }
  else if (status.value === 'paused' || status.value === 'stopped') { run(remaining.value); msg = { action: 'resume', remaining: remaining.value } }
  else { run(total.value); msg = { action: 'resume', remaining: total.value } }
  channel?.postMessage({ from: WINDOW_ID, key: key.value, ...msg })
}

// ---------- sound (audience window only) ----------
const audible = computed(() => props.sound && $renderContext.value === 'slide')
function beep(freq: number, dur: number, vol = 0.15, type: OscillatorType = 'square') {
  if (!audible.value) return
  try {
    ctx ??= new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + dur)
  }
  catch {}
}
function tickSound() {
  const s = secs.value
  if (s !== lastTick) {
    lastTick = s
    if (s <= 3 && s > 0) beep(880, 0.08)
  }
}
function buzz() { beep(180, 0.9, 0.25, 'sawtooth') }

onUnmounted(() => { clearTimeout(startTimer); cancelAnimationFrame(raf); channel?.close(); window.removeEventListener(RUN_EVENT, onOtherRun) })

// ring geometry
const R = 44
const C = 2 * Math.PI * R
const RA = 39
const CA = 2 * Math.PI * RA
</script>

<template>
  <div
    class="timer" :class="[`v-${variant}`, status, { warn: isWarn, final: isFinal }]"
    role="timer" :aria-label="`${secs} s`" @click="toggle"
  >
    <div v-if="label && variant !== 'bar'" class="cap dm-label">
      <ph-timer-bold class="ic" />
      <template v-if="status === 'paused'">Paused</template>
      <template v-else-if="status === 'done' || status === 'stopped'">Stop</template>
      <template v-else>Time</template>
    </div>

    <!-- digits / block -->
    <div v-if="variant === 'digits' || variant === 'block'" class="digits dm-display dm-num">
      {{ display }}
    </div>

    <!-- ring -->
    <div v-else-if="variant === 'ring'" class="dial">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" :r="R" class="track" />
        <circle
          cx="50" cy="50" :r="R" class="fill"
          :stroke-dasharray="C" :stroke-dashoffset="C * (1 - frac)"
        />
      </svg>
      <span class="digits dm-display dm-num">{{ display }}</span>
    </div>

    <!-- alarm: the ring inside a twin-bell alarm clock; it rattles in the last 3 s and at 0 -->
    <div v-else-if="variant === 'alarm'" class="alarm">
      <svg viewBox="0 0 120 132" class="case dm-motion">
        <path d="M8 40 A24 24 0 0 1 40 8 Z" class="bell" />
        <path d="M112 40 A24 24 0 0 0 80 8 Z" class="bell" />
        <line x1="60" y1="8" x2="60" y2="24" class="hammer" />
        <line x1="50" y1="8" x2="70" y2="8" class="hammer" />
        <line x1="34" y1="110" x2="22" y2="126" class="leg" />
        <line x1="86" y1="110" x2="98" y2="126" class="leg" />
        <circle cx="60" cy="72" r="49" class="body" />
        <circle cx="60" cy="72" :r="RA" class="track" />
        <circle
          cx="60" cy="72" :r="RA" class="fill" transform="rotate(-90 60 72)"
          :stroke-dasharray="CA" :stroke-dashoffset="CA * (1 - frac)"
        />
      </svg>
      <span class="digits dm-display dm-num">{{ display }}</span>
    </div>

    <!-- bar -->
    <div v-else class="barwrap">
      <div class="bar"><div class="fill" :style="{ transform: `scaleX(${frac})` }" /></div>
      <span class="digits dm-display dm-num">{{ display }}</span>
    </div>

    <div v-if="status === 'done' && variant !== 'bar' && label" class="out dm-label">Time's up</div>
  </div>
</template>

<style scoped>
.timer:focus, .timer:focus-visible { outline: none; }
.timer { display: inline-flex; flex-direction: column; align-items: flex-start; gap: .35rem; cursor: pointer; user-select: none; color: var(--dm-ink); }
.cap { display: flex; align-items: center; gap: .35rem; color: var(--dm-ink-soft); }
.ic { font-size: 1.1em; }
.digits { line-height: .8; transition: color .3s ease; }
.warn .digits, .warn .cap { color: var(--dm-red); }
.final .digits { animation: dm-pulse .5s steps(1) infinite; }
.paused .digits { opacity: .45; }
.out { color: var(--dm-red); }

/* digits */
.v-digits .digits { font-size: 7rem; letter-spacing: -.06em; }

/* block: scoreboard clock */
.v-block .digits { font-size: 4.5rem; letter-spacing: -.05em; background: var(--dm-ink); color: var(--dm-paper); padding: .9rem 1.1rem .7rem; min-width: 3.2ch; text-align: center; transition: background .3s ease; }
.v-block.warn .digits { background: var(--dm-red); color: var(--dm-white); }

/* ring */
.dial { position: relative; width: 9.5rem; height: 9.5rem; }
.dial svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.dial circle { fill: none; stroke-width: 9; }
.dial .track { stroke: var(--dm-paper-2); }
.dial .fill { stroke: var(--dm-ink); transition: stroke .3s ease; }
.warn .dial .fill { stroke: var(--dm-red); }
.dial .digits { position: absolute; inset: 0; display: grid; place-items: center; font-size: 3.4rem; letter-spacing: -.05em; }

/* alarm clock */
.alarm { position: relative; width: 9rem; }
.case { width: 100%; display: block; overflow: visible; transform-origin: 50% 60%; }
.case .bell { fill: var(--dm-ink); }
.case .hammer { stroke: var(--dm-ink); stroke-width: 5; stroke-linecap: square; }
.case .leg { stroke: var(--dm-ink); stroke-width: 6; stroke-linecap: square; }
.case .body { fill: var(--dm-paper); stroke: var(--dm-ink); stroke-width: 6; }
.case .track { fill: none; stroke: var(--dm-paper-2); stroke-width: 8; }
.case .fill { fill: none; stroke: var(--dm-ink); stroke-width: 8; transition: stroke .3s ease; }
.warn .case .fill { stroke: var(--dm-red); }
.warn .case .bell { fill: var(--dm-red); }
.alarm .digits { position: absolute; left: 0; right: 0; top: 54.5%; translate: 0 -50%; text-align: center; font-size: 2.6rem; letter-spacing: -.05em; }
.final .case, .done .case { animation: alarm-ring .11s linear infinite; }
.done .case { animation-iteration-count: 14; }
@keyframes alarm-ring { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-7deg); } 75% { transform: rotate(7deg); } }

/* bar: full width, digits at the end */
.v-bar { display: flex; width: 100%; }
.barwrap { display: flex; align-items: center; gap: 1rem; width: 100%; }
.bar { flex: 1; height: 14px; background: var(--dm-paper-2); overflow: hidden; }
.bar .fill { height: 100%; background: var(--dm-ink); transform-origin: left; transition: background .3s ease; }
.warn .bar .fill { background: var(--dm-red); }
.v-bar .digits { font-size: 2.4rem; letter-spacing: -.05em; min-width: 2.2ch; text-align: right; }
.v-bar.done .bar { background: var(--dm-red); }
</style>
