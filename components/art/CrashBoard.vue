<script setup lang="ts">
// Q: CrowdStrike. An airport departures board on 19.07.2024 where flights stop,
// and a small ":(" screen card with the number of machines. Rows flip in on slide enter.
// Egg: a split-flap gate tile rattles through the alphabet and lands on the secret letter, again and again.
import { onUnmounted, ref, watch } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const rows = [
  { t: '06:40', f: 'DL 1123', s: 'DELAYED' },
  { t: '07:05', f: 'UA 0457', s: 'DELAYED' },
  { t: '07:20', f: 'AA 2210', s: 'CANCELLED', red: true },
  { t: '07:55', f: 'LH 0901', s: '— — —' },
]
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const flap = ref('')
let t: ReturnType<typeof setInterval> | undefined
watch(active, (a) => {
  clearInterval(t)
  flap.value = ''
  if (!a || !props.egg) return
  const end = ABC.indexOf(props.egg)
  let tick = -10
  t = setInterval(() => {
    tick++
    if (tick > end + 30) tick = 0 // hold ~2.5 s on the letter, then spin again
    if (tick >= 0) flap.value = ABC[Math.min(tick, end)]
  }, 80)
}, { immediate: true })
onUnmounted(() => clearInterval(t))
</script>

<template>
  <div class="cb" :class="{ on: active }">
    <div class="board">
      <div class="hd"><span>Departures</span><span>19.07.2024</span></div>
      <div v-for="(r, i) in rows" :key="i" class="row" :class="{ red: r.red }" :style="{ '--d': `${0.15 + i * 0.2}s` }">
        <span class="dm-num">{{ r.t }}</span><span>{{ r.f }}</span><span class="st">{{ r.s }}</span>
      </div>
    </div>
    <div class="card">
      <div class="scr">:(</div>
      <div v-if="egg" class="gate">
        <span class="dm-label dm-soft">Gate</span>
        <span class="flap"><span :key="flap" class="fl dm-display">{{ flap }}</span></span>
      </div>
      <div class="num"><span class="big dm-num">8,5 M</span><span class="dm-label dm-soft">PCs</span></div>
    </div>
  </div>
</template>

<style scoped>
.cb { display: flex; flex-direction: column; gap: .55rem; }
.board { background: var(--dm-ink); color: var(--dm-white); padding: .4rem .5rem .5rem; font-family: var(--dm-mono); font-size: .55rem; font-weight: 600; }
.hd { display: flex; justify-content: space-between; text-transform: uppercase; letter-spacing: .08em; color: var(--dm-paper-2); border-bottom: 2px solid var(--dm-ink-soft); padding-bottom: .2rem; margin-bottom: .25rem; }
.row { display: grid; grid-template-columns: 2.4rem 3.2rem 1fr; gap: .3rem; line-height: 1.75; opacity: 0; transition: opacity .3s steps(3) var(--d); }
.on .row { opacity: 1; }
.st { text-align: right; white-space: nowrap; }
.row.red .st { background: var(--dm-red); color: var(--dm-white); padding: 0 .25rem; }
.card { display: flex; align-items: center; gap: .6rem; }
.scr { width: 3.4rem; height: 2.4rem; border: 2.5px solid var(--dm-ink); background: var(--dm-ink-deep); color: var(--dm-white); display: grid; place-items: center; font-family: var(--dm-display); font-weight: 900; font-size: 1.2rem; }
.num { display: flex; flex-direction: column; }
.big { font-family: var(--dm-display); font-weight: 900; font-size: 1.5rem; line-height: 1; letter-spacing: -.03em; color: var(--dm-ink); }
.num .dm-label { font-size: .55rem; }
.gate { display: flex; flex-direction: column; align-items: center; gap: .1rem; }
.gate .dm-label { font-size: .5rem; }
.flap { position: relative; width: 2.1rem; height: 2.5rem; display: grid; place-items: center; border: 2.5px solid var(--dm-ink); background: var(--dm-paper-2); perspective: 6rem; overflow: hidden; }
.flap::before, .flap::after { content: ''; position: absolute; top: calc(50% - 1px); width: .22rem; height: 2px; background: var(--dm-ink); }
.flap::before { left: 0; } .flap::after { right: 0; }
.fl { color: var(--dm-red); font-size: 2rem; line-height: 1; animation: cb-flip .08s linear; transform-origin: 50% 50%; }
@keyframes cb-flip { from { transform: rotateX(80deg); } to { transform: none; } }
</style>
