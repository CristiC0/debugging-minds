<script setup lang="ts">
// Q: The year 2038. A signed 32-bit seconds counter at its maximum; one more tick flips the sign bit
// and the clock jumps back to 13.12.1901. The register flips shortly after slide enter.
// Egg: the register's name (E·A·X, A for accumulator) labels the counter; the overflow lands in
// the crimson cell, which flips over with the sign bit.
import { onUnmounted, ref, watch } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const flipped = ref(false)
let t: ReturnType<typeof setTimeout> | undefined
watch(active, (a) => {
  clearTimeout(t)
  flipped.value = false
  if (a) t = setTimeout(() => (flipped.value = true), 1100)
}, { immediate: true })
onUnmounted(() => clearTimeout(t))

const bits = (f: boolean) => Array.from({ length: 32 }, (_, i) => (f ? (i === 0 ? 1 : 0) : (i === 0 ? 0 : 1)))
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// x86 32-bit register names; E·?·X with the secret letter in the middle (EAX, EBX, ECX, EDX)
const reg = props.egg ? ['E', props.egg, 'X'] : []
</script>

<template>
  <div class="ep" :class="{ on: flipped }">
    <div class="top">
      <span class="dm-label dm-soft">int32 · seconds</span>
      <span v-if="egg" class="reg-name">
        <span v-for="(c, i) in reg" :key="i" class="rc" :class="{ me: i === 1 }">{{ c }}</span>
      </span>
    </div>
    <div class="reg">
      <span v-for="(b, i) in bits(flipped)" :key="i" class="bit" :class="{ sign: i === 0 }">{{ b }}</span>
    </div>
    <div class="row"><span class="dm-label dm-soft">+1 s</span><span class="val dm-num">{{ flipped ? '-2147483648' : '2147483647' }}</span></div>
    <div class="row"><span class="dm-label dm-soft">Date</span><span class="val dm-num">{{ flipped ? '13.12.1901' : '__.__.____' }}</span></div>
    <div class="row"><span class="dm-label dm-soft">Time</span><span class="val dm-num">{{ flipped ? '20:45:52' : '__:__:__' }}</span></div>
  </div>
</template>

<style scoped>
.ep { display: flex; flex-direction: column; gap: .45rem; }
.ep .dm-label { font-size: .55rem; }
.reg { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; border: 2.5px solid var(--dm-ink); padding: 3px; }
.bit { font-family: var(--dm-mono); font-weight: 700; font-size: .7rem; text-align: center; line-height: 1.5; background: var(--dm-paper-2); color: var(--dm-ink); }
.bit.sign { outline: 2px solid var(--dm-red); outline-offset: -2px; }
.on .bit { animation: dm-in-up .3s var(--dm-ease) both; }
.on .bit.sign { background: var(--dm-red); color: var(--dm-white); }
.row { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid var(--dm-ink); padding-bottom: .15rem; }
.top { display: flex; justify-content: space-between; align-items: flex-end; }
.reg-name { display: flex; gap: 2px; perspective: 8rem; }
.rc { display: grid; place-items: center; width: 1.25rem; height: 1.55rem; border: 2px solid var(--dm-ink); font-family: var(--dm-mono); font-weight: 700; font-size: .8rem; color: var(--dm-ink-soft); }
.rc.me { width: 1.6rem; background: var(--dm-red); border-color: var(--dm-red); color: var(--dm-white); font-family: var(--dm-display); font-weight: 900; font-size: 1.3rem; }
.on .rc.me { animation: ep-flip .6s var(--dm-ease), ep-tick 2s steps(1) 1s infinite; }
@keyframes ep-flip { from { transform: rotateX(180deg); } to { transform: none; } }
@keyframes ep-tick { 0%, 85% { transform: none; } 90% { transform: translateY(-2px); } }
.val { font-family: var(--dm-mono); font-weight: 700; font-size: .95rem; color: var(--dm-ink); }
</style>
