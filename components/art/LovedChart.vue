<script setup lang="ts">
// Q: Rust. The Stack Overflow survey's "most loved" ranking, year after year:
// the same unnamed language at #1 every time. Bars grow on slide enter.
// Egg: in the source line, one letter of "Overflow" is too big for its box and keeps spilling out of it.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const years = [[2016, 79], [2017, 73], [2018, 79], [2019, 84], [2020, 86], [2021, 87], [2022, 87], [2023, 85]]
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// split "Stack Overflow" around the secret letter (first match in "Overflow"), or append it
const word = 'Overflow'
const at = props.egg ? word.toUpperCase().indexOf(props.egg) : -1
</script>

<template>
  <div class="lc" :class="{ on: active }">
    <div class="dm-label hd">Most loved</div>
    <div v-for="([y, v], i) in years" :key="y" class="row">
      <span class="y dm-num">{{ y }}</span>
      <span class="track"><span class="bar" :style="{ width: `${v}%`, transitionDelay: `${i * 90}ms` }" /></span>
      <span class="rk dm-num">#1</span>
    </div>
    <div v-if="egg && at >= 0" class="cap src dm-label dm-soft">
      <span>Stack {{ word.slice(0, at) }}</span><span class="spill"><span class="big dm-display">{{ egg }}</span></span><span>{{ word.slice(at + 1) }} survey · % loved</span>
    </div>
    <div v-else class="cap dm-label dm-soft">Stack Overflow survey · % loved</div>
  </div>
</template>

<style scoped>
.lc { display: flex; flex-direction: column; gap: .28rem; border-top: 3px solid var(--dm-ink); padding-top: .4rem; }
.hd { font-size: .6rem; margin-bottom: .15rem; }
.row { display: grid; grid-template-columns: 2.1rem 1fr 1.3rem; align-items: center; gap: .4rem; }
.y, .rk { font-family: var(--dm-mono); font-size: .58rem; font-weight: 600; }
.y { color: var(--dm-ink-soft); }
.rk { font-weight: 800; text-align: right; }
.track { display: block; height: .55rem; background: var(--dm-paper-2); }
.bar { display: block; height: 100%; background: var(--dm-red); transform-origin: left; transform: scaleX(0); transition: transform .9s var(--dm-ease); }
.on .bar { transform: none; }
.cap { align-self: flex-end; font-size: .52rem; margin-top: .2rem; }
.src { display: flex; align-items: flex-end; margin-top: 1.3rem; }
.spill { position: relative; display: inline-block; width: .62rem; height: .62rem; margin: 0 .12rem 0 .15rem; border: 1.5px solid var(--dm-ink); }
.big { position: absolute; left: 50%; bottom: -.12rem; translate: -50% 0; color: var(--dm-red); font-size: 1.75rem; line-height: .8; transform-origin: 50% 100%; }
.on .big { animation: lc-spill 2.2s var(--dm-ease) 1s infinite; }
@keyframes lc-spill { 0%, 100% { transform: scale(.9, 1); } 45% { transform: scale(1.06, 1.1) translateY(-.12rem); } 60% { transform: scale(1, 1); } }
</style>
