<script setup lang="ts">
// Q: "Merry Christmas". A 1992 monochrome handset screen with the very first SMS:
// two words as blanks, the crimson envelope marks it sent.
// Egg: someone is typing on the keypad the old multi-tap way: the key is tapped again and again
// and the letter on screen cycles (D, E, F…) until it lands on the secret letter.
import { computed, onUnmounted, ref, watch } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '␣'], ['#', '']]
const keyIdx = computed(() => keys.findIndex(k => props.egg && k[1].includes(props.egg)))
const taps = computed(() => (keyIdx.value < 0 ? 0 : keys[keyIdx.value][1].indexOf(props.egg!) + 1))
const typed = ref('')
const down = ref(false)
let t: ReturnType<typeof setInterval> | undefined
watch(active, (a) => {
  clearInterval(t)
  typed.value = ''
  down.value = false
  if (!a || taps.value === 0) return
  let tick = -8
  t = setInterval(() => {
    tick++
    if (tick > taps.value * 4 + 22) { tick = -2; typed.value = '' }
    const n = Math.floor(tick / 4) // a tap every 4 ticks
    down.value = tick >= 0 && n < taps.value && tick % 4 === 0
    if (tick >= 0 && n < taps.value && tick % 4 === 0) typed.value = keys[keyIdx.value][1][n]
  }, 110)
}, { immediate: true })
onUnmounted(() => clearInterval(t))
</script>

<template>
  <div class="ft" :class="{ on: active }">
    <div class="body">
      <div class="screen">
        <div class="hd mono"><span>SMS 1/1</span><span>03.12.1992</span></div>
        <div class="msg">
          <Blank :n="5" class="w w1" />
          <Blank :n="9" class="w w2" />
        </div>
        <div class="ft-row mono">
          <ph-envelope-simple-bold class="env" />
          <span v-if="egg" class="typed"><span v-if="typed" :key="typed" class="tl">{{ typed }}</span><span class="cur" /></span>
          <span>OK</span>
        </div>
      </div>
      <div class="keys">
        <span v-for="(k, i) in keys" :key="i" class="key" :class="{ hot: i === keyIdx, down: down && i === keyIdx }">
          <b>{{ k[0] }}</b><small>{{ k[1] }}</small>
        </span>
      </div>
    </div>
    <div class="cap dm-label dm-soft">PC → phone</div>
  </div>
</template>

<style scoped>
.ft { display: flex; flex-direction: column; gap: .45rem; }
.body { border: 3px solid var(--dm-ink); padding: .55rem; background: var(--dm-paper-2); }
.screen { background: var(--dm-ink-deep); color: var(--dm-white); padding: .55rem .6rem; display: flex; flex-direction: column; gap: .45rem; }
.mono { font-family: var(--dm-mono); font-weight: 700; font-size: .56rem; letter-spacing: .06em; }
.hd { display: flex; justify-content: space-between; border-bottom: 2px solid var(--dm-white); padding-bottom: .25rem; }
.msg { display: flex; flex-direction: column; gap: .35rem; font-size: 1rem; }
.w { opacity: 0; transition: opacity .4s var(--dm-ease); }
.w2 { transition-delay: .35s; }
.on .w { opacity: 1; }
.ft-row { display: flex; align-items: center; justify-content: space-between; }
.env { color: var(--dm-red); font-size: 1.1rem; opacity: 0; transform: translateX(-8px); transition: opacity .4s var(--dm-ease) .8s, transform .4s var(--dm-ease) .8s; }
.on .env { opacity: 1; transform: none; }
.keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: .25rem; margin-top: .5rem; }
.key { display: flex; align-items: baseline; justify-content: center; gap: .2rem; height: .95rem; border: 2px solid var(--dm-ink); font-family: var(--dm-mono); line-height: .8rem; color: var(--dm-ink); }
.key b { font-size: .55rem; }
.key small { font-size: .36rem; font-weight: 700; color: var(--dm-ink-soft); }
.key.hot { border-color: var(--dm-red); }
.key.down { background: var(--dm-red); transform: translateY(1px); }
.key.down b, .key.down small { color: var(--dm-white); }
.typed { display: flex; align-items: center; gap: 2px; min-width: 1.8rem; height: 1.6rem; }
.tl { display: grid; place-items: center; width: 1.45rem; height: 1.6rem; background: var(--dm-red); color: var(--dm-white); font-family: var(--dm-display); font-weight: 900; font-size: 1.3rem; letter-spacing: 0; animation: ft-pop .15s var(--dm-ease); }
.cur { width: 2px; height: 1.3rem; background: var(--dm-white); animation: dm-pulse 1s steps(1) infinite; }
@keyframes ft-pop { from { transform: scale(.6); } to { transform: none; } }
.cap { align-self: flex-end; font-size: .56rem; }
</style>
