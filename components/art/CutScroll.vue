<script setup lang="ts">
// Q: Lorem ipsum. Cicero's treatise as a scroll of grey text lines, words cut out of them;
// one crimson cut where the famous fragment starts mid-word.
// Egg: the text opens with an illuminated initial, a crimson block with a serifed Roman capital.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
// each line: segments [x, width]; a gap between segments is a cut
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// the first two lines start after the drop cap
const lines = [
  [[props.egg ? 46 : 16, props.egg ? 40 : 70], [92, 74]], [[props.egg ? 46 : 16, props.egg ? 120 : 150]], [[16, 40], [62, 104]], [[16, 88], [118, 48]],
  [[16, 150]], [[16, 54], [80, 30], [118, 48]], [[16, 120]],
]
const cuts = [[93, 22], [115, 65.5], [79, 94.5], [118, 94.5]] // [gap centre x, line top y]
const red = { x: 63, y: 51 }
</script>

<template>
  <div class="cs" :class="{ on: active }">
    <div class="sv">
    <svg viewBox="0 0 200 134">
      <rect x="2" y="2" width="196" height="10" class="rod" />
      <rect x="10" y="12" width="180" height="110" class="sheet" />
      <rect x="2" y="122" width="196" height="10" class="rod" />
      <g v-for="(ln, i) in lines" :key="i">
        <rect
          v-for="(s, j) in ln" :key="j" :x="s[0] + 4" :y="22 + i * 14.5" :width="s[1]" height="5"
          class="bar" :style="{ transitionDelay: `${i * 90}ms` }"
        />
      </g>
      <line v-for="(c, i) in cuts" :key="i" :x1="c[0] - 3" :y1="c[1] + 8" :x2="c[0] + 3" :y2="c[1] - 3" class="cut" />
      <line :x1="red.x - 4" :y1="red.y + 10" :x2="red.x + 4" :y2="red.y - 5" class="cut red" />
      <g v-if="egg" class="cap-i">
        <rect x="18" y="18" width="28" height="30" class="ci-box" />
        <rect x="21" y="21" width="22" height="24" class="ci-frame" />
        <path v-if="egg === 'I'" d="M24 23 H40 V26.5 H35 V39.5 H40 V43 H24 V39.5 H29 V26.5 H24 Z" class="ci-p" />
        <text v-else x="32" y="42" text-anchor="middle" class="ci-l">{{ egg }}</text>
      </g>
    </svg>
    </div>
    <div class="cap dm-label dm-soft">M. T. CICERO · 45 BC</div>
  </div>
</template>

<style scoped>
.cs { display: flex; flex-direction: column; gap: .4rem; }
svg { width: 100%; }
.rod { fill: var(--dm-ink); }
.sheet { fill: var(--dm-paper-2); stroke: var(--dm-ink); stroke-width: 2.5; }
.bar { fill: var(--dm-ink-soft); transform-box: fill-box; transform-origin: left; transform: scaleX(0); transition: transform .5s var(--dm-ease); }
.on .bar { transform: none; }
.cut { stroke: var(--dm-ink); stroke-width: 2; opacity: 0; transition: opacity .3s var(--dm-ease) .8s; }
.cut.red { stroke: var(--dm-red); stroke-width: 3; transition-delay: 1.1s; }
.on .cut { opacity: 1; }
.cap { align-self: flex-end; font-size: .56rem; }
.sv { position: relative; }
.ci-box { fill: var(--dm-red); }
.ci-frame { fill: none; stroke: var(--dm-paper); stroke-width: 1; stroke-dasharray: 2 1.5; }
.ci-p { fill: var(--dm-white); }
.ci-l { fill: var(--dm-white); font-family: var(--dm-display); font-weight: 900; font-size: 24px; }
.cap-i { opacity: 0; transform-box: fill-box; transform-origin: center; transition: opacity .4s var(--dm-ease) .7s, transform .4s var(--dm-ease) .7s; transform: scale(.6); }
.on .cap-i { opacity: 1; transform: none; }
.on .ci-frame { animation: cs-gild 6s linear 1.2s infinite; }
@keyframes cs-gild { to { stroke-dashoffset: -35; } }
</style>
