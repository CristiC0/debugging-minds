<script setup lang="ts">
// Q: Bluetooth. One generic Viking-age runestone under a crown: a carved band around the edge
// (draws in crimson on slide enter) and rows of neutral rune strokes. Deliberately NOT the two
// runes of the logo (hagall / bjarkan) and no rune names in the caption: that was too big a hint.
// Egg: one rune is the secret letter, cut angular like the rest and re-chiselled in crimson.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const outline = 'M58 150 L52 52 L70 18 L104 8 L136 22 L148 58 L144 150 Z'
const band = 'M68 150 L63 56 L78 28 L104 19 L128 30 L138 60 L134 150'
// neutral staves: plain, branch, crossbar, arrow-free tick. None of them is ᚼ or ᛒ.
const marks = ['M0 0 V14', 'M0 0 V14 M0 3 L4 7', 'M0 0 V14 M-3 5 L3 9', 'M0 0 V14 M0 9 L-4 13']
const rows = [62, 86, 128].map((y, r) => Array.from({ length: 4 }, (_, i) => ({
  x: 84 + i * 11, y, d: marks[(i + r * 3) % marks.length],
})))
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// straight-cut letter forms (0..10 × 0..24); add one here if the letter changes
const carve: Record<string, string> = { C: 'M14 1 H4 L0 5 V20 L4 24 H14' }
const egged = props.egg ? carve[props.egg] : undefined
</script>

<template>
  <div class="runes" :class="{ on: active }">
    <div class="crown"><ph-crown-bold /></div>
    <div class="sv">
    <svg viewBox="0 0 200 160">
      <line x1="20" y1="150" x2="180" y2="150" class="ground" />
      <path :d="outline" class="stone" />
      <path :d="band" pathLength="1" class="band" />
      <g v-for="(row, r) in rows" :key="r">
        <path v-for="(m, i) in row" :key="i" :d="m.d" :transform="`translate(${m.x} ${m.y})`" class="mark" />
      </g>
      <g v-if="egged" transform="translate(93 101)">
        <path :d="egged" class="groove" />
        <path :d="egged" pathLength="1" class="cut" />
      </g>
    </svg>
    </div>
    <div class="cap dm-label">Runestone · 10th century</div>
  </div>
</template>

<style scoped>
.runes { display: flex; flex-direction: column; gap: .2rem; }
.crown { text-align: center; font-size: 1.1rem; color: var(--dm-ink); }
svg { width: 100%; }
.ground { stroke: var(--dm-ink); stroke-width: 3; }
.stone { fill: var(--dm-paper-2); stroke: var(--dm-ink); stroke-width: 2.5; stroke-linejoin: miter; }
.band {
  fill: none; stroke: var(--dm-red); stroke-width: 3; stroke-linejoin: miter;
  stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s var(--dm-ease) .3s;
}
.on .band { stroke-dashoffset: 0; }
.mark { fill: none; stroke: var(--dm-ink); stroke-width: 2.2; stroke-linecap: square; opacity: 0; transition: opacity .5s var(--dm-ease) 1.2s; }
.on .mark { opacity: .85; }
.cap { text-align: center; font-size: .54rem; color: var(--dm-ink-soft); }
.sv { position: relative; }
.groove { fill: none; stroke: var(--dm-ink); stroke-width: 6.5; stroke-linecap: square; stroke-linejoin: miter; opacity: 0; transition: opacity .4s 1.4s; }
.on .groove { opacity: 1; }
.cut { fill: none; stroke: var(--dm-red); stroke-width: 3.6; stroke-linecap: square; stroke-linejoin: miter; stroke-dasharray: 1; stroke-dashoffset: 1; }
.on .cut { animation: rs-chisel 3.6s cubic-bezier(.5, 0, .5, 1) 1.5s infinite; }
@keyframes rs-chisel { 0% { stroke-dashoffset: 1; } 30%, 100% { stroke-dashoffset: 0; } }
</style>
