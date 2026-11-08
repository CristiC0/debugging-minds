<script setup lang="ts">
// Q: CAPTCHA. A 3×3 tile challenge with pixel traffic lights; tiles fade in on slide enter
// and the picked ones get a crimson check. Egg: the sky tile is a classic distorted-text CAPTCHA
// glyph (warping crimson letter, noise line through it).
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
// l = traffic light, s = crosswalk stripes, p = pole, b = building, '' = sky
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
const tiles = ['b', 'l', props.egg ? 'egg' : '', 's', 'p', 'l', 'l', 'b', 's']
const picked = [1, 5, 6]
</script>

<template>
  <div class="cap" :class="{ on: active }">
    <div class="ask">
      <div class="en">Select all traffic lights</div>
    </div>
    <div class="grid">
      <div
        v-for="(t, i) in tiles" :key="i" class="tile" :class="{ pick: picked.includes(i) }"
        :style="{ transitionDelay: `${i * 70}ms` }"
      >
        <svg viewBox="0 0 24 24" shape-rendering="crispEdges">
          <g v-if="t === 'l'"><rect x="11" y="15" width="2" height="9" /><rect x="8" y="2" width="8" height="14" /><rect x="10" y="4" width="4" height="2.5" class="lamp" /><rect x="10" y="8" width="4" height="2.5" class="lamp" /><rect x="10" y="12" width="4" height="2.5" class="lamp" /></g>
          <g v-else-if="t === 's'"><rect v-for="k in 4" :key="k" :x="k * 5 - 3" y="14" width="3" height="10" /></g>
          <g v-else-if="t === 'p'"><rect x="11" y="3" width="2" height="21" /><rect x="6" y="3" width="7" height="2" /></g>
          <g v-else-if="t === 'egg'" class="cg">
            <text x="12" y="20" text-anchor="middle" class="cl">{{ egg }}</text>
            <path d="M0 15 C5 8 9 20 14 12 S21 9 24 13" class="noise" />
            <path d="M2 6 L22 9" class="noise thin" />
          </g>
          <g v-else-if="t === 'b'"><rect x="4" y="6" width="16" height="18" /><rect v-for="k in 4" :key="k" :x="k % 2 ? 7 : 14" :y="k < 3 ? 9 : 16" width="3" height="3" class="lamp" /></g>
        </svg>
        <span v-if="picked.includes(i)" class="chk"><ph-check-bold /></span>
      </div>
    </div>
    <div class="foot"><span class="btn dm-label">Verify</span></div>
  </div>
</template>

<style scoped>
.cap { border: 2.5px solid var(--dm-ink); padding: .4rem; display: flex; flex-direction: column; gap: .4rem; }
.ask { background: var(--dm-ink); padding: .35rem .45rem; }
.ask :deep(.bi) { gap: 0; }
.ask :deep(.ro) { color: var(--dm-white); font-size: .72rem; }
.ask :deep(.ru) { color: var(--dm-paper-2); font-size: .62rem; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
.tile { position: relative; aspect-ratio: 1; background: var(--dm-paper-2); opacity: 0; transition: opacity .3s steps(3); }
.on .tile { opacity: 1; }
.tile svg { width: 100%; height: 100%; fill: var(--dm-ink); }
.lamp { fill: var(--dm-paper); }
.tile.pick svg { transform: scale(.82); }
.chk { position: absolute; left: 0; top: 0; width: 1rem; height: 1rem; display: grid; place-items: center; background: var(--dm-red); color: var(--dm-white); font-size: .66rem; }
.foot { display: flex; justify-content: flex-end; }
.btn { font-size: .54rem; background: var(--dm-ink); color: var(--dm-white); padding: .2rem .45rem; }
.en { color: var(--dm-white); font-size: .74rem; font-weight: 700; }
.cl { fill: var(--dm-red); font-family: var(--dm-display); font-weight: 900; font-size: 21px; transform-box: fill-box; transform-origin: center; }
.on .cl { animation: tg-warp 2.6s ease-in-out infinite; }
.noise { fill: none; stroke: var(--dm-ink); stroke-width: 1.4; }
.noise.thin { stroke-width: .8; }
@keyframes tg-warp {
  0%, 100% { transform: skewX(-16deg) rotate(-7deg) scale(1, 1.08); }
  50% { transform: skewX(14deg) rotate(6deg) scale(1.08, .94); }
}
</style>
