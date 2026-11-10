<script setup lang="ts">
// Round 3 · Capture the Flag: the slide that stays up while teams work.
//
// Clock: counts UP (elapsed time), composables/useCtfClock.ts. It changes ONLY through its own buttons
//   (Start · Pause/Resume · Reset); leaving the slide or reloading never touches it, and while it runs a
//   mini clock block follows you to the other slides (global-bottom.vue).
//   Reset needs a second click within 3 s so it can't happen by accident.
// Easter eggs (shown in every window via BroadcastChannel):
//   time marks while running: 03:14 π · 04:04 · 13:37 · 17:04 (1024 s) · 42:00 · 1:00:00
//   type on the keyboard: "hack", "pwn", "help", "dorin"   (letters are swallowed only while they spell one)
//   click the crawling bug to squash it; click Dorin 5 times
// Stage chain (top right): five locked tiles, one per stage, generic icons only. The jury clicks a tile when
//   the leading team gets past that stage; clicking the last open tile locks it again. Saved + synced like the
//   clock, cleared by Reset.
// Finish: Ctrl+C (or the Finish button, presenter view only) when the first team shouts the final phrase:
//   the time freezes, "^C" + stamp + falling flags, and it stays that way (every window) until Reset.
// Spoilers: everything on this slide is story flavour (Dorin, the lazy colleague). No key, IP, link,
//   password or final phrase ever appears before Ctrl+C, and there are no stray letters to collect.
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'
import { useCtfClock } from '../composables/useCtfClock'

const { $renderContext } = useSlideContext()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext.value))
const on = computed(() => live.value && active.value)

// ---------------- clock (shared with the mini block in global-bottom.vue) ----------------
const { totalSec, hh, mm, ss, state, start, pause, finish, reset: resetClock, tick } = useCtfClock()
const isPresenter = computed(() => $renderContext.value === 'presenter')
// one span per character so each digit can roll on its own (odometer)
const timeChars = computed(() => `${hh.value > 0 ? `${hh.value}:` : ''}${mm.value}:${ss.value}`.split(''))
const armed = ref(false)
let armTimer: ReturnType<typeof setTimeout> | undefined
function reset() {
  if (!armed.value) {
    armed.value = true
    clearTimeout(armTimer)
    armTimer = setTimeout(() => (armed.value = false), 3000)
    return
  }
  armed.value = false
  fired.clear()
  resetClock()
  setStages(0)
  push('# new round · clock reset', 'out')
}

// ---------------- eggs: stamp + terminal line, mirrored to other windows ----------------
interface Egg { big?: string, ro: string, ru: string, log?: string }
const egg = ref<(Egg & { id: number }) | null>(null)
let eggTimer: ReturnType<typeof setTimeout> | undefined
const WIN = Math.random().toString(36).slice(2)
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('dm-ctf') : null
channel?.addEventListener('message', (e) => {
  if (e.data?.from === WIN) return
  if (e.data?.egg) showEgg(e.data.egg, false)
  if (e.data?.fx) fx(e.data.fx, false)
})
function showEgg(g: Egg, broadcast = true) {
  egg.value = { ...g, id: Date.now() }
  if (g.log) pushOut(g.log, 'note')
  clearTimeout(eggTimer)
  eggTimer = setTimeout(() => (egg.value = null), 4200)
  if (broadcast) channel?.postMessage({ from: WIN, egg: g })
}

// time marks
const MARKS: Record<number, Egg> = {
  194: { big: 'π', ro: 'Ora π', ru: 'Время π', log: '>>> import math; math.pi  # 3:14' },
  244: { big: '404', ro: 'Timpul nu a fost găsit', ru: 'Время не найдено', log: 'HTTP/1.1 404 Time Not Found' },
  817: { big: '1337', ro: 'Mod hacker activat', ru: 'Режим хакера включён', log: 'h4ck3r_m0d3 = True' },
  1024: { big: '2¹⁰', ro: '1024 de secunde', ru: '1024 секунды', log: '$ echo $((1 << 10))  # seconds' },
  2520: { big: '42', ro: 'Răspunsul la tot', ru: 'Ответ на всё', log: '>>> answer()  # 42' },
  3600: { big: '1:00:00', ro: 'O oră. Mai e cafea?', ru: 'Час. Кофе ещё есть?', log: '$ brew coffee --strong' },
}
const fired = new Set<number>()
watch(totalSec, (s, prev) => {
  if (!on.value || state.value !== 'running' || prev === undefined) return
  for (const m of Object.keys(MARKS).map(Number)) {
    if (prev < m && s >= m && !fired.has(m)) { fired.add(m); showEgg(MARKS[m]) }
  }
})

// typed secrets: swallow a letter only while it continues one of these words
const SECRETS: Record<string, Egg> = {
  hack: { big: 'Denied', ro: 'Acces refuzat', ru: 'Доступ запрещён', log: 'Permission denied (publickey,jury).' },
  pwn: { big: 'root?', ro: 'Frumos încercat', ru: 'Хорошая попытка', log: '$ whoami → jury' },
  help: { big: 'RTFM', ro: 'Juriul nu dă indicii', ru: 'Жюри не подсказывает', log: '$ man flag → No manual entry for flag' },
  dorin: { big: 'Dorin', ro: 'Dorin lucrează. Sigur.', ru: 'Дорин работает. Честно.', log: 'dorin: [alt+tab] ✓' },
}
let buf = ''
function onKey(e: KeyboardEvent) {
  if (!on.value) return
  const t = e.target
  if (t instanceof Element && t.closest('input, textarea, [contenteditable="true"]')) return
  if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'c' && !e.repeat) {
    if (window.getSelection()?.toString()) return   // a real copy
    e.preventDefault()
    stopRound()
    return
  }
  if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return
  const next = buf + e.key.toLowerCase()
  const words = Object.keys(SECRETS)
  if (!words.some(w => w.startsWith(next))) { buf = ''; return }
  e.preventDefault()
  e.stopImmediatePropagation()
  buf = next
  if (SECRETS[buf]) {
    push(buf, 'cmd')
    if (buf === 'pwn') fx('spin')
    showEgg(SECRETS[buf]); buf = ''
  }
}

// ---------------- terminal ----------------
interface Line { id: number, text: string, kind: 'cmd' | 'out' | 'note' | 'flag' }
// Dorin's afternoon, as seen from his own terminal. Story flavour only: no clues in here.
const SCRIPT: [string, string[]][] = [
  ['whoami', ['dorin']],
  ['git status', ['nothing to commit, working tree clean', '(since 2019)']],
  ['top -n 1 | head -3', ['PID   CPU%  COMMAND', '4242  97.0  video --autoplay --next-episode', '1337   0.1  vim todo.txt']],
  ['cat todo.txt', ['1. look busy', '2. ', '3. look busy again']],
  ['uptime', ['14:07  up 3 days,  load average: 0.00 0.00 0.00']],
  ['ls ~/Desktop', ['definitely_work.mp4   report_FINAL_v7.docx   memes/']],
  ['ping director', ['Request timeout: Dorin is "in a meeting"']],
  ['cat /dev/coffee', ['cat: /dev/coffee: Resource temporarily unavailable']],
  ['make productivity', ["make: *** No rule to make target 'productivity'.  Stop."]],
  ['history | tail -2', ['alt+tab', 'alt+tab']],
  ['sudo make me-a-sandwich', ['dorin is not in the sudoers file. This incident will be reported.']],
  ['git commit -m "worked hard all afternoon"', ['1 file changed, 0 insertions(+), 0 deletions(-)']],
]
const lines = ref<Line[]>([])
const typing = ref('')
let lid = 0
let termTimer: ReturnType<typeof setTimeout> | undefined
let step = 0
function push(text: string, kind: Line['kind']) {
  lines.value.push({ id: ++lid, text, kind })
  if (lines.value.length > 9) lines.value.splice(0, lines.value.length - 9)
}
function pushOut(text: string, kind: Line['kind'] = 'out') { push(text, kind) }
function typeNext() {
  if (!on.value) return
  const [cmd, outs] = SCRIPT[step % SCRIPT.length]
  step++
  typing.value = ''
  let i = 0
  const tick = () => {
    if (!on.value) return
    if (i < cmd.length) {
      typing.value += cmd[i++]
      termTimer = setTimeout(tick, 45 + Math.random() * 70)
      return
    }
    push(cmd, 'cmd')
    typing.value = ''
    outs.forEach((o, k) => setTimeout(() => on.value && push(o, 'out'), 180 + k * 140))
    termTimer = setTimeout(typeNext, 1400 + outs.length * 160 + Math.random() * 900)
  }
  termTimer = setTimeout(tick, 300)
}

// ---------------- Dorin's productivity meter: crawls up to a few %, then the next episode starts ----------------
const prod = ref(0)                 // 0..100
const prodNote = ref('')
let crackTimer: ReturnType<typeof setInterval> | undefined
let prodHold = 0
function crackStep() {
  sceneStep()
  if (prodHold > 0) { prodHold--; if (prodHold === 0) { prod.value = 0; prodNote.value = '' } return }
  prod.value = Math.min(100, prod.value + Math.random() * 0.35)
  if (prod.value > 3 + Math.random() * 3) {
    prodNote.value = ['next episode in 5…', 'buffering…', 'coffee break', 'checking memes'][Math.floor(Math.random() * 4)]
    prodHold = 30
  }
}

// ---------------- the end: Ctrl+C ----------------
const finale = computed(() => state.value === 'done')
const FLAGS = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37) % 100, delay: (i % 9) * 0.18, dur: 2.4 + ((i * 7) % 5) * 0.35, rot: ((i * 53) % 70) - 35, red: i % 3 === 0, size: 1 + (i % 4) * 0.35,
}))
function stopRound(broadcast = true) {
  if (state.value === 'idle' || finale.value) return
  finish()
  push('^C', 'cmd')
  push('dorin: process interrupted. caught red-handed.', 'note')
  if (broadcast) channel?.postMessage({ from: WIN, fx: 'stop' })
}

// ---------------- stage chain ----------------
// Numbered 0–4 like the jury plan (Etapa 0–4). Each icon is what teams DO there, never what they find:
//   0 open the start pack · 1 decrypt with the key · 2 search the logs · 3 solve the grid · 4 look closer
const STAGES = ['i-ph-package-bold', 'i-ph-key-bold', 'i-ph-list-magnifying-glass-bold', 'i-ph-grid-nine-bold', 'i-ph-eye-bold']
const SKEY = 'dm-ctf-stages'
function loadStages() { try { return Math.max(0, Math.min(STAGES.length, Number(localStorage.getItem(SKEY)) || 0)) } catch { return 0 } }
const opened = ref(loadStages())
function setStages(n: number) {
  opened.value = n
  try { localStorage.setItem(SKEY, String(n)) } catch {}
}
function clickStage(k: number) {          // k = 1..5
  const n = k === opened.value ? k - 1 : k
  if (n > opened.value) push(`stage ${n - 1} cleared`, 'note')
  setStages(n)
}
function onStageStorage(e: StorageEvent) { if (e.key === SKEY) opened.value = loadStages() }

// ---------------- bug + flag ----------------
const bugAlive = ref(true)
const bugRun = ref(0)            // bumps to restart the crawl animation
const squashed = ref(0)
const bugY = ref(0)
function squash() {
  if (!bugAlive.value) return
  fx('squash')
}
// Dorin's desk: he leans back watching a video; the Director's spotlight sweeps the office and,
// when it reaches him, he sits up and the screen alt-tabs to code. No letters in the scene (teams hunt letters).
const beam = ref(-60)               // spotlight centre, in desk-SVG units (-60 … 380)
const vid = ref(0)                  // video progress 0..1
const caught = computed(() => beam.value > 140 && beam.value < 268)
let beamWait = 0
function sceneStep() {
  vid.value = vid.value >= 1 ? 0 : vid.value + 0.0025
  if (beamWait > 0) { beamWait--; return }
  beam.value += 3.4
  if (beam.value > 380) { beam.value = -60; beamWait = 40 + Math.floor(Math.random() * 50) }
}
const pokes = ref(0)
const poke = ref(false)
const spin = ref(false)
function pokeDorin() {
  pokes.value++
  fx('poke')
  if (pokes.value >= 5) {
    pokes.value = 0
    showEgg({ big: 'Shh', ro: 'Nu-l treziți pe Dorin', ru: 'Не будите Дорина', log: 'dorin: do not disturb (until 2027)' })
  }
}
function fx(name: string, broadcast = true) {
  if (name === 'squash' && bugAlive.value) {
    bugAlive.value = false
    squashed.value++
    pushOut(`bug #${squashed.value} fixed · ${Math.max(0, 99 - squashed.value)} bugs remaining`, 'note')
    if (squashed.value % 3 === 0) showEgg({ big: `×${squashed.value}`, ro: 'Bug reparat', ru: 'Баг исправлен' }, false)
    setTimeout(() => { bugAlive.value = true; bugY.value = Math.random(); bugRun.value++ }, 2600)
  }
  if (name === 'poke') { poke.value = true; setTimeout(() => (poke.value = false), 450) }
  if (name === 'stop') { stopRound(false); return }
  if (name === 'spin') { spin.value = true; setTimeout(() => (spin.value = false), 1600) }
  if (broadcast) channel?.postMessage({ from: WIN, fx: name })
}

// ---------------- lifecycle ----------------
watch(on, (go, was) => {
  clearTimeout(termTimer); clearInterval(crackTimer)
  if (go !== !!was) tick(go)
  if (!go) return
  if (!lines.value.length) push('# dorin@pc-07 · yesterday, afternoon shift', 'out')
  typeNext()
  crackTimer = setInterval(crackStep, 70)
}, { immediate: true })
onMounted(() => { window.addEventListener('keydown', onKey, true); window.addEventListener('storage', onStageStorage) })
onUnmounted(() => {
  if (on.value) tick(false)
  clearTimeout(termTimer); clearInterval(crackTimer); clearTimeout(eggTimer); clearTimeout(armTimer)
  window.removeEventListener('keydown', onKey, true)
  window.removeEventListener('storage', onStageStorage)
  channel?.close()
})
</script>

<template>
  <div class="ctf">
    <!-- header: title left, stage chain right -->
    <header class="head">
      <div class="ttl">
        <div class="dm-label dm-red">Round 03 · Capture the Flag</div>
        <div class="t-ro dm-display">Capturați steagul</div>
        <div class="t-ru">Захватите флаг</div>
      </div>
      <div class="chain">
        <template v-for="(ic, k) in STAGES" :key="k">
          <button class="st" :class="{ open: k < opened, next: k === opened }" @click="clickStage(k + 1)">
            <span class="num dm-num">{{ String(k).padStart(2, '0') }}</span>
            <span :key="k < opened ? 'o' : 'l'" class="ico" :class="k < opened ? ic : 'i-ph-lock-simple-bold'" />
          </button>
          <span class="link" :class="{ on: k < opened }"><span /></span>
        </template>
        <span class="st goal" :class="{ open: opened >= STAGES.length, won: finale }"><span class="ico i-ph-flag-checkered-bold" /></span>
      </div>
    </header>

    <!-- centre: the clock, as big as the slide allows -->
    <section class="mid">
        <div class="clock" :class="state">
          <div class="cap dm-label">
            <ph-hourglass-medium-bold class="ic" />
            <template v-if="state === 'running'">Elapsed</template>
            <template v-else-if="state === 'paused'">Paused</template>
            <template v-else-if="state === 'done'">Final time</template>
            <template v-else>Ready</template>
          </div>
          <div class="digits dm-display dm-num">
            <span v-for="(c, i) in timeChars" :key="`${timeChars.length}-${i}`" class="dg" :class="{ colon: c === ':' }">
              <span :key="c" class="in">{{ c }}</span>
            </span>
          </div>
          <div class="btns">
            <button v-if="state === 'idle'" class="b solid" @click="start"><ph-play-fill /> Start</button>
            <button v-else-if="state === 'running'" class="b solid" @click="pause"><ph-pause-fill /> Pause</button>
            <button v-else-if="state === 'paused'" class="b solid" @click="start"><ph-play-fill /> Resume</button>
            <button v-if="isPresenter && (state === 'running' || state === 'paused')" class="b" @click="stopRound()"><ph-flag-checkered-bold /> Finish</button>
            <button class="b" :class="{ armed }" :disabled="state === 'idle' && opened === 0" @click="reset">
              <ph-arrow-counter-clockwise-bold /> {{ armed ? 'Sure?' : 'Reset' }}
            </button>
          </div>
        </div>
    </section>

    <!-- bottom: Dorin's terminal + Dorin's desk -->
    <section class="low">
      <div class="term" aria-hidden="true">
        <div class="bar dm-label"><span>dorin@pc-07: ~</span><span class="dots"><i /><i /><i /></span></div>
        <div class="body">
          <TransitionGroup name="ln">
            <div v-for="l in lines" :key="l.id" class="ln" :class="l.kind"><span v-if="l.kind === 'cmd'" class="ps">$ </span>{{ l.text }}</div>
          </TransitionGroup>
          <div class="ln cmd"><span class="ps">$ </span>{{ typing }}<span class="caret" /></div>
        </div>
        <div class="scan" />
        <div class="prod">
          <span class="dm-label lbl">dorin.productivity</span>
          <span class="track"><span class="fill" :style="{ transform: `scaleX(${prod / 100})` }" /></span>
          <span class="pct dm-num">{{ prod.toFixed(1) }}%</span>
          <span class="note">{{ prodNote }}</span>
        </div>
      </div>
      <div class="scene">
        <svg class="desk" viewBox="0 0 320 128" aria-hidden="true">
          <!-- wall clock: time flies -->
          <circle cx="34" cy="30" r="15" class="paper" />
          <line x1="34" y1="30" x2="34" y2="21" class="hand hr" />
          <line x1="34" y1="30" x2="34" y2="18" class="hand mn" />
          <!-- desk -->
          <rect x="58" y="96" width="206" height="5" class="ink" />
          <rect x="66" y="101" width="5" height="25" class="ink" />
          <rect x="251" y="101" width="5" height="25" class="ink" />
          <!-- coffee -->
          <path d="M84 77 q-3 -5 0 -9 q3 -5 0 -9" class="steam" />
          <path d="M90 77 q-3 -5 0 -9 q3 -5 0 -9" class="steam s2" />
          <rect x="80" y="80" width="14" height="16" class="paper" />
          <path d="M94 84 h4 v7 h-4" class="line" />
          <!-- monitor -->
          <rect x="112" y="36" width="88" height="54" class="ink" />
          <rect x="117" y="41" width="78" height="42" class="scr" />
          <rect x="151" y="90" width="10" height="6" class="ink" />
          <g v-if="!caught" class="video">
            <path d="M150 50 L150 68 L166 59 Z" class="play" />
            <rect x="122" y="76" width="68" height="2.5" class="trk" />
            <rect x="122" y="76" :width="68 * vid" height="2.5" class="vfill" />
          </g>
          <g v-else class="code">
            <rect v-for="(w, k) in [40, 28, 52, 22, 46]" :key="k" :x="122 + (k % 2) * 6" :y="46 + k * 6.5" :width="w" height="3" class="cl" />
            <rect x="122" y="78" width="4" height="3" class="cur" />
          </g>
          <!-- Dorin (click him) -->
          <g class="dorin" :class="{ caught, poke, spin }" @click="pokeDorin">
            <path d="M254 58 L258 98" class="chair" />
            <rect x="220" y="96" width="38" height="5" class="ink" />
            <path d="M238 101 V120 M224 122 H252" class="chair" />
            <path d="M227 71 Q237 64 247 71 L249 97 L225 97 Z" class="ink" />
            <circle cx="237" cy="57" r="9.5" class="ink" />
            <path d="M229 77 L212 88" class="limb" />
            <path d="M227 99 L207 101 L207 119" class="limb" />
            <text v-if="caught" x="237" y="40" class="bang">!</text>
          </g>
          <!-- the Director's spotlight -->
          <g class="beam" :style="{ transform: `translateX(${beam}px)` }">
            <path d="M-5 0 L5 0 L30 124 L-30 124 Z" class="cone" />
            <ellipse cx="0" cy="124" rx="30" ry="4" class="spot" />
          </g>
        </svg>
      </div>
    </section>

    <!-- the bug that crawls along the bottom -->
    <div :key="bugRun" class="lane" :style="{ '--y': bugY }">
      <button v-if="bugAlive" class="bug" aria-label="bug" @click="squash"><ph-bug-bold /></button>
      <span v-else class="splat"><ph-bug-fill /></span>
    </div>

    <!-- the end (Ctrl+C): falling flags + ^C, until Reset -->
    <div v-if="finale" class="finale">
      <span v-for="(f, i) in FLAGS" :key="i" class="ff" :class="{ red: f.red }"
        :style="{ left: `${f.left}%`, animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s`, '--rot': `${f.rot}deg`, fontSize: `${f.size}rem` }"><ph-flag-fill /></span>
      <div class="end">
        <div class="big dm-display">^C</div>
        <Stamp ro="Runda s-a încheiat" ru="Раунд окончен" :rotate="-4" />
        <div class="who dm-label">First team · {{ timeChars.join('') }}</div>
      </div>
    </div>

    <!-- egg stamp -->
    <Transition name="egg">
      <div v-if="egg" :key="egg.id" class="egg">
        <div v-if="egg.big" class="big dm-display">{{ egg.big }}</div>
        <Stamp :ro="egg.ro" :ru="egg.ru" :rotate="-5" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ctf { position: relative; height: 100%; box-sizing: border-box; padding: 0; display: grid; grid-template-rows: auto 1fr auto; gap: .6rem; }

/* header */
.head { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; padding-bottom: .7rem; border-bottom: 3px solid var(--dm-ink); }
.ttl { flex: none; white-space: nowrap; }
.t-ro { font-size: 2.7rem; line-height: .9; letter-spacing: -.035em; text-transform: uppercase; margin-top: .55rem; animation: misprint 7s steps(1) infinite; }
.t-ru { font-family: var(--dm-display); font-weight: 500; font-size: 1.05rem; color: var(--dm-ink-soft); margin-top: .25rem; }
/* every ~7 s the title slips like a misregistered print run: a crimson plate offset, a jolt, then back */
@keyframes misprint {
  0%, 90%, 100% { transform: none; text-shadow: none; }
  91% { transform: translateX(-3px) skewX(-4deg); text-shadow: 5px 0 var(--dm-red); }
  93% { transform: translateX(4px); text-shadow: -4px 0 var(--dm-red); clip-path: inset(0 0 45% 0); }
  95% { transform: translateX(-1px); text-shadow: 2px 0 var(--dm-red); clip-path: none; }
}

/* centre */
.mid { display: grid; place-items: center; min-height: 0; }

/* bottom */
.low { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; height: 9.4rem; }
.scene { display: flex; align-items: flex-end; min-width: 0; }

/* terminal */
.term { position: relative; background: var(--dm-ink-deep); color: var(--dm-paper); display: flex; flex-direction: column; overflow: hidden; border: 2.5px solid var(--dm-ink); }
.bar { display: flex; justify-content: space-between; align-items: center; padding: .35rem .7rem; background: var(--dm-ink); color: var(--dm-paper-2); font-size: .6rem; }
.dots { display: flex; gap: .3rem; }
.dots i { width: .5rem; height: .5rem; background: var(--dm-ink-soft); }
.dots i:last-child { background: var(--dm-red); }
.body { flex: 1; min-height: 0; padding: .4rem .8rem; font-family: var(--dm-mono); font-size: .7rem; line-height: 1.45; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
.ln { flex: none; white-space: pre; overflow: hidden; text-overflow: ellipsis; color: var(--dm-paper-2); }
.ln.cmd { color: var(--dm-white); font-weight: 600; }
.ln.out { color: var(--dm-rule); }
.ln.flag { color: var(--dm-white); background: var(--dm-red); padding: 0 .3rem; align-self: flex-start; }
.ln.note { color: var(--dm-white); }
.ln.note::before { content: "» "; color: var(--dm-red); font-weight: 700; }
.ps { color: var(--dm-ink-soft); }
.caret { display: inline-block; width: .5em; height: 1em; background: var(--dm-paper); vertical-align: -.15em; animation: dm-pulse 1s steps(1) infinite; }
.ln-enter-active { transition: opacity .25s var(--dm-ease), transform .25s var(--dm-ease); }
.ln-enter-from { opacity: 0; transform: translateX(-6px); }
.ln-leave-active { display: none; }
.scan { position: absolute; left: 0; right: 0; top: 0; height: 30%; pointer-events: none; background: repeating-linear-gradient(0deg, transparent 0 2px, color-mix(in srgb, var(--dm-white) 4%, transparent) 2px 3px); animation: scan 4.5s linear infinite; }
@keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(340%); } }
.prod { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: .7rem; padding: .4rem .8rem; border-top: 1px solid var(--dm-ink); font-family: var(--dm-mono); }
.prod .lbl { font-size: .58rem; color: var(--dm-ink-soft); }
.prod .track { height: 8px; background: var(--dm-ink); overflow: hidden; }
.prod .fill { display: block; height: 100%; background: var(--dm-paper); transform-origin: left; transition: transform .2s linear; }
.prod .pct { font-size: .8rem; font-weight: 700; color: var(--dm-white); min-width: 3.4em; text-align: right; }
.prod .note { font-size: .62rem; color: var(--dm-rule); min-width: 8.5em; }
.prod .note:empty::before { content: '\00a0'; }

/* Dorin's desk */
.desk { width: 100%; max-height: 100%; overflow: visible; }
.desk .ink { fill: var(--dm-ink); }
.desk .paper { fill: var(--dm-paper); stroke: var(--dm-ink); stroke-width: 2.5; }
.desk .line { fill: none; stroke: var(--dm-ink); stroke-width: 2.5; }
.desk .scr { fill: var(--dm-ink-deep); }
.desk .hand { stroke: var(--dm-ink); stroke-width: 2.5; stroke-linecap: square; transform-origin: 34px 30px; }
.desk .mn { animation: turn 3s linear infinite; }
.desk .hr { animation: turn 36s linear infinite; }
@keyframes turn { to { transform: rotate(360deg); } }
.desk .steam { fill: none; stroke: var(--dm-ink-soft); stroke-width: 2; animation: steam 2.4s ease-out infinite; }
.desk .steam.s2 { animation-delay: 1.2s; }
@keyframes steam { from { transform: translateY(4px); opacity: 0; } 30% { opacity: 1; } to { transform: translateY(-8px); opacity: 0; } }
.desk .play { fill: var(--dm-paper); }
.desk .trk { fill: var(--dm-ink-soft); }
.desk .vfill { fill: var(--dm-paper); }
.desk .cl { fill: var(--dm-paper-2); }
.desk .cur { fill: var(--dm-paper); animation: dm-pulse .8s steps(1) infinite; }
.dorin { cursor: pointer; transform-box: view-box; transform-origin: 238px 104px; transform: rotate(13deg); transition: transform .35s var(--dm-ease); }
.dorin.caught { transform: rotate(-3deg) translateX(-3px); transition-duration: .18s; }
.dorin.poke { transform: translateY(-8px) rotate(4deg); transition-duration: .15s; }
.dorin.spin { transform: rotate(373deg); transition-duration: 1.3s; }
.dorin .chair { fill: none; stroke: var(--dm-ink); stroke-width: 4; }
.dorin .limb { fill: none; stroke: var(--dm-ink); stroke-width: 5; stroke-linecap: square; }
.dorin .bang { fill: var(--dm-red); font-family: var(--dm-display); font-weight: 900; font-size: 18px; text-anchor: middle; animation: dm-stamp .3s var(--dm-ease) both; }
.beam { transition: transform .07s linear; pointer-events: none; }
.beam .cone { fill: var(--dm-red-wash); }
.beam .spot { fill: none; stroke: var(--dm-red); stroke-width: 1.5; stroke-dasharray: 4 3; }

.clock { display: flex; flex-direction: column; align-items: center; gap: .5rem; }
.cap { display: flex; align-items: center; gap: .4rem; color: var(--dm-ink-soft); font-size: .8rem; }
.running .cap .ic { animation: flip 2s steps(1) infinite; }
@keyframes flip { 50% { transform: rotate(180deg); } }
.digits { font-size: 8.6rem; line-height: .8; letter-spacing: 0; display: flex; gap: .01em; }
.dg { display: inline-block; overflow: hidden; padding: .06em 0; }
.dg > span { display: inline-block; }
.dg > .in { animation: roll .38s var(--dm-ease); }
/* Inter Tight sets the colon low against tall numerals: lift it to the optical middle of the digits */
.dg.colon > .in { position: relative; top: -.11em; }
@keyframes roll { from { transform: translateY(65%); opacity: 0; } }
.running .dg.colon { animation: dm-pulse 1s steps(1) infinite; }
.paused .digits { color: var(--dm-ink-soft); }
.paused .dg.colon { animation: dm-pulse 1.6s steps(1) infinite; }
.done .digits { color: var(--dm-red); }
.idle .digits { color: var(--dm-ink-soft); }
.btns { display: flex; gap: .5rem; margin-top: .2rem; }
.b { display: inline-flex; align-items: center; gap: .35rem; padding: .3rem .7rem; border: 2px solid var(--dm-ink); background: transparent; color: var(--dm-ink); font-family: var(--dm-mono); font-weight: 600; font-size: .68rem; text-transform: uppercase; letter-spacing: .08em; cursor: pointer; }
.b.solid { background: var(--dm-ink); color: var(--dm-paper); }
.b.armed { background: var(--dm-red); border-color: var(--dm-red); color: var(--dm-white); }
.b:disabled { opacity: .35; cursor: default; }

/* bug lane */
.lane { position: absolute; left: -3.5rem; right: -3.5rem; bottom: calc(-2.4rem + var(--y) * .25rem); height: 1.6rem; pointer-events: none; }
.bug { position: absolute; left: 0; bottom: 0; pointer-events: auto; background: none; border: 0; padding: 0; font-size: 1.5rem; color: var(--dm-ink); cursor: crosshair; animation: crawl 19s linear infinite, wobble .25s steps(2) infinite; }
@keyframes crawl { 0% { left: -2rem; } 100% { left: calc(100% + 2rem); } }
.bug :deep(svg) { transform: rotate(90deg); }
@keyframes wobble { 50% { translate: 0 -2px; } }
.splat { position: absolute; left: 50%; bottom: 0; font-size: 1.5rem; color: var(--dm-red); transform: scaleY(.35) scaleX(1.5); opacity: .8; animation: splat .3s var(--dm-ease); }
@keyframes splat { from { transform: scale(1.4); } }

/* stage chain: flat 2D tiles, big icons (no 3D flip: it blurred the icons) */
.chain { display: flex; align-items: center; padding-top: 1.1rem; }
.st { position: relative; width: 2.6rem; height: 2.6rem; padding: 0; display: grid; place-items: center; border: 2.5px solid var(--dm-ink); background: var(--dm-paper-2); color: var(--dm-ink-soft); cursor: pointer; transition: background .3s var(--dm-ease), color .3s var(--dm-ease); }
.st .ico { font-size: 1.45rem; display: block; }
.st.open { background: var(--dm-ink); color: var(--dm-paper); }
.st.open .ico { animation: dm-stamp .45s var(--dm-ease) both; --r: 0deg; }
.st .num { position: absolute; top: -1.2rem; left: 0; right: 0; text-align: center; font-family: var(--dm-mono); font-size: .62rem; font-weight: 600; letter-spacing: .06em; color: var(--dm-ink-soft); }
.st.open .num { color: var(--dm-ink); }
.st.next .ico { animation: jiggle 3.2s var(--dm-ease) infinite; }
@keyframes jiggle { 0%, 84%, 100% { transform: rotate(0); } 88% { transform: rotate(-8deg); } 92% { transform: rotate(6deg); } 96% { transform: rotate(-2deg); } }
.st.goal { cursor: default; background: var(--dm-paper); border-style: dashed; }
.st.goal.open { border-style: solid; color: var(--dm-ink); }
.st.goal.won { background: var(--dm-red); border-color: var(--dm-red); color: var(--dm-white); animation: dm-stamp .45s var(--dm-ease) both; --r: 0deg; }
.link { width: 1.1rem; height: 3px; background: var(--dm-rule); overflow: hidden; }
.link > span { display: block; height: 100%; background: var(--dm-ink); transform: scaleX(0); transform-origin: left; transition: transform .5s var(--dm-ease) .2s; }
.link.on > span { transform: scaleX(1); }

/* finale */
.finale { position: absolute; inset: -2.5rem -3.5rem; overflow: hidden; pointer-events: none; z-index: 6; }
.ff { position: absolute; top: -2rem; color: var(--dm-ink); animation-name: fall; animation-timing-function: cubic-bezier(.3,.1,.6,1); animation-fill-mode: both; }
.ff.red { color: var(--dm-red); }
@keyframes fall { from { transform: translateY(0) rotate(0); opacity: 1; } 85% { opacity: 1; } to { transform: translateY(36rem) rotate(var(--rot)); opacity: 0; } }
.end { position: absolute; left: 50%; top: 50%; translate: -50% -50%; display: flex; flex-direction: column; align-items: center; gap: .5rem; }
.end .big { font-size: 9rem; line-height: .8; letter-spacing: -.05em; color: var(--dm-white); background: var(--dm-ink); padding: .5rem 1.4rem .2rem; animation: dm-stamp .5s var(--dm-ease) both; --r: -2deg; }
.end :deep(.stamp) { background: var(--dm-paper); }
.end .who { background: var(--dm-paper); padding: .2rem .5rem; color: var(--dm-ink); }

/* egg */
.egg { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .4rem; pointer-events: none; z-index: 5; }
.egg .big { font-size: 7rem; line-height: .8; letter-spacing: -.05em; color: var(--dm-ink); background: var(--dm-paper); padding: .3rem 1rem .1rem; border: 3px solid var(--dm-ink); animation: dm-stamp .45s var(--dm-ease) both; --r: 3deg; }
.egg :deep(.stamp) { background: var(--dm-paper); }
.egg-leave-active { transition: opacity .4s ease; }
.egg-leave-to { opacity: 0; }
</style>
