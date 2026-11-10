// The Capture the Flag clock (round 3), shared by the CTF slide (<CtfBoard>) and the mini clock block
// in global-bottom.vue that follows you to other slides while it runs.
//
// It counts up and changes ONLY through start() / pause() / finish() / reset(). State lives in localStorage as
// timestamps, so leaving the slide or reloading never touches it, and the `storage` event keeps the
// presenter and audience windows in step. One module-level state: every caller sees the same clock.
import { computed, ref } from 'vue'

interface Clock { running: boolean, startedAt: number, acc: number, done?: boolean }
const KEY = 'dm-ctf-clock'

function load(): Clock {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || '')
    if (typeof c?.acc === 'number') return c
  }
  catch {}
  return { running: false, startedAt: 0, acc: 0 }
}

const clock = ref<Clock>(load())
const now = ref(Date.now())
let users = 0
let raf = 0

function save(c: Clock) {
  clock.value = c
  try { localStorage.setItem(KEY, JSON.stringify(c)) }
  catch {}
}
function frame() { now.value = Date.now(); raf = requestAnimationFrame(frame) }
function onStorage(e: StorageEvent) { if (e.key === KEY) clock.value = load() }

const elapsed = computed(() => clock.value.acc + (clock.value.running ? now.value - clock.value.startedAt : 0))
const totalSec = computed(() => Math.max(0, Math.floor(elapsed.value / 1000)))
const pad = (n: number) => String(n).padStart(2, '0')
const hh = computed(() => Math.floor(totalSec.value / 3600))
const mm = computed(() => pad(Math.floor(totalSec.value / 60) % 60))
const ss = computed(() => pad(totalSec.value % 60))
const state = computed(() => clock.value.done ? 'done' : clock.value.running ? 'running' : clock.value.acc > 0 ? 'paused' : 'idle')

function start() { if (!clock.value.done) save({ running: true, startedAt: Date.now(), acc: clock.value.acc }) }
function pause() { save({ running: false, startedAt: 0, acc: elapsed.value }) }
// The jury presses Ctrl+C when the first team shouts the final phrase: the time freezes until Reset.
function finish() { if (state.value !== 'idle' && !clock.value.done) save({ running: false, startedAt: 0, acc: elapsed.value, done: true }) }
function reset() { save({ running: false, startedAt: 0, acc: 0 }) }

// Call watch-style: tick(true) while something shows the clock, tick(false) when it stops showing it.
// The shared frame loop runs while at least one caller is ticking.
function tick(on: boolean) {
  users = Math.max(0, users + (on ? 1 : -1))
  cancelAnimationFrame(raf)
  if (users > 0) { clock.value = load(); raf = requestAnimationFrame(frame) }
}

if (typeof window !== 'undefined') window.addEventListener('storage', onStorage)

export function useCtfClock() {
  return { totalSec, hh, mm, ss, state, start, pause, finish, reset, tick }
}
