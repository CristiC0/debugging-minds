<script setup lang="ts">
// Q: a moth. A page of the 1947 Mark II logbook: typed entries, and something taped
// to the page at 15:45. The taped patch stays empty; the tape is crimson.
// Egg: an operator's red pen keeps writing a letter in the margin and circling it.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const before = [['1100', 'Started Cosine Tape'], ['1525', 'Started Multi-Adder Test']]
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// hand-drawn strokes in a 40×40 box; add one here if the letter changes
const pen: Record<string, string> = {
  G: 'M30 11 C25 4 10 5 8 19 C6 33 22 37 30 30 L30 22 L21 22',
}
const stroke = props.egg ? pen[props.egg] : undefined
</script>

<template>
  <div class="lb" :class="{ on: active }">
    <div class="page">
      <div class="dm-label dm-soft hd">Log · 9.9.1947</div>
      <div v-for="e in before" :key="e[0]" class="entry"><span class="t">{{ e[0] }}</span>{{ e[1] }}</div>
      <div class="entry"><span class="t">1545</span>Relay #70 Panel F</div>
      <div class="patch">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <defs>
            <pattern id="logbook-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="6" class="hl" />
            </pattern>
          </defs>
          <rect x="1" y="1" width="98" height="38" fill="url(#logbook-hatch)" class="frame" vector-effect="non-scaling-stroke" />
        </svg>
        <span class="tape t1" /><span class="tape t2" />
      </div>
      <svg v-if="stroke" class="note" viewBox="0 0 40 40">
        <path :d="stroke" pathLength="1" class="ink" />
        <path d="M33 6 C22 -1 3 3 2 20 C1 37 26 42 36 30 C41 22 38 10 29 5" pathLength="1" class="ring" />
      </svg>
      <div class="entry"><span class="t">1630</span>Started Arctan Tape</div>
    </div>
  </div>
</template>

<style scoped>
.page {
  border: 2.5px solid var(--dm-ink); padding: .5rem .6rem .6rem; display: flex; flex-direction: column;
  background-image: repeating-linear-gradient(0deg, transparent 0 1.15rem, var(--dm-rule) 1.15rem calc(1.15rem + 1px));
}
.hd { font-size: .55rem; margin-bottom: .2rem; }
.entry { font-family: var(--dm-mono); font-size: .6rem; line-height: 1.15rem; white-space: nowrap; }
.t { font-weight: 700; margin-right: .5rem; }
.patch { position: relative; width: 58%; height: 3.4rem; margin: .45rem 0 .45rem 2.4rem; opacity: 0; transform: rotate(-2deg) translateY(6px); transition: opacity .5s var(--dm-ease) .3s, transform .5s var(--dm-ease) .3s; }
.on .patch { opacity: 1; transform: rotate(-2deg); }
.hl { stroke: var(--dm-ink-soft); stroke-width: 1; }
.frame { stroke: var(--dm-ink); stroke-width: 2; }
.patch svg { width: 100%; height: 100%; display: block; }
.tape { position: absolute; width: 2.2rem; height: .6rem; background: var(--dm-red); opacity: .85; }
.t1 { left: -.8rem; top: -.15rem; transform: rotate(-35deg); }
.t2 { right: -.8rem; bottom: -.15rem; transform: rotate(-35deg); }
.page { position: relative; }
.note { position: absolute; right: .45rem; top: 4.35rem; width: 2.9rem; height: 2.9rem; overflow: visible; rotate: 6deg; }
.ink, .ring { fill: none; stroke: var(--dm-red); stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; }
.ink { stroke-width: 4.2; }
.ring { stroke-width: 2.2; }
.on .ink { animation: lb-write 4.6s ease-in-out .9s infinite; }
.on .ring { animation: lb-ring 4.6s ease-in-out .9s infinite; }
@keyframes lb-write { 0% { stroke-dashoffset: 1; opacity: 1; } 22%, 90% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
@keyframes lb-ring { 0%, 24% { stroke-dashoffset: 1; opacity: 1; } 40%, 90% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
</style>
