<script setup lang="ts">
// Q: Enigma. Three rotor wheels with letters in their windows over a QWERTZ lampboard;
// one key pressed, one lamp lights crimson on slide enter.
// Egg: the lit lamp is the secret letter; every few seconds a key is struck, the right rotor steps,
// and the same lamp lights up again (as if the operator keeps getting the same letter).
import { onUnmounted, ref, watch } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const rotors = [{ x: 22, l: 'K' }, { x: 80, l: 'R' }, { x: 138, l: 'Q' }]
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const rows = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML']
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
const lit = props.egg ?? 'L'
const step = ref(0)
const on = ref(true)
let t: ReturnType<typeof setInterval> | undefined
let u: ReturnType<typeof setTimeout> | undefined
watch(active, (a) => {
  clearInterval(t); clearTimeout(u)
  step.value = 0; on.value = true
  if (!a || !props.egg) return
  t = setInterval(() => {
    on.value = false
    u = setTimeout(() => { step.value++; on.value = true }, 260)
  }, 2600)
}, { immediate: true })
onUnmounted(() => { clearInterval(t); clearTimeout(u) })
const shown = (i: number, l: string) => (i === 2 ? ABC[(ABC.indexOf(l) + step.value) % 26] : l)
</script>

<template>
  <div class="rw" :class="{ on: active }">
    <svg viewBox="0 0 200 92" class="rotors">
      <g v-for="(r, i) in rotors" :key="i" class="rotor" :style="{ transitionDelay: `${i * 140}ms` }">
        <rect :x="r.x" y="4" width="40" height="84" class="drum" />
        <line v-for="k in 9" :key="k" :x1="r.x" :x2="r.x + 40" :y1="4 + k * 8.4" :y2="4 + k * 8.4" class="ridge" />
        <rect :x="r.x + 8" y="32" width="24" height="28" class="win" />
        <text :x="r.x + 20" y="53" text-anchor="middle" style="font-size: 20px" font-weight="800" font-family="JetBrains Mono, monospace" class="let">{{ shown(i, r.l) }}</text>
      </g>
    </svg>
    <div class="board">
      <div v-for="row in rows" :key="row" class="row">
        <template v-for="c in row" :key="c">
          <span class="lamp" :class="{ lit: c === lit && on, big: egg && c === lit }">{{ c }}</span>
        </template>
      </div>
    </div>
    <div class="cap dm-label dm-soft">3 rotors</div>
  </div>
</template>

<style scoped>
.rw { display: flex; flex-direction: column; gap: .55rem; }
.rotors { width: 100%; }
.rotor { opacity: 0; transform: translateY(-6px); transition: opacity .5s var(--dm-ease), transform .5s var(--dm-ease); }
.on .rotor { opacity: 1; transform: none; }
.drum { fill: var(--dm-ink); }
.ridge { stroke: var(--dm-ink-soft); stroke-width: 1.5; }
.win { fill: var(--dm-paper); stroke: var(--dm-ink); stroke-width: 2.5; }
.let { fill: var(--dm-ink); }
.board { display: flex; flex-direction: column; align-items: center; gap: .22rem; border: 2.5px solid var(--dm-ink); padding: .4rem .3rem; }
.row { display: flex; gap: .22rem; }
.lamp {
  width: 1.05rem; height: 1.05rem; display: grid; place-items: center;
  border: 2px solid var(--dm-ink); font-family: var(--dm-mono); font-size: .52rem; font-weight: 700;
  transition: background-color .25s var(--dm-ease) .9s, color .25s var(--dm-ease) .9s, border-color .25s var(--dm-ease) .9s;
}
.on .lamp.lit { background: var(--dm-red); border-color: var(--dm-red); color: var(--dm-white); }
.lamp.big { position: relative; z-index: 2; font-size: .62rem; transition: background-color .08s, color .08s, border-color .08s, transform .25s var(--dm-ease); }
.on .lamp.big.lit { transform: scale(1.55); font-family: var(--dm-display); font-weight: 900; font-size: .72rem; outline: 2px solid var(--dm-paper); }
.cap { align-self: flex-end; font-size: .56rem; }
</style>
