<script setup lang="ts">
// Q: B-tree. A balanced multi-key tree: every node holds several sorted keys and every leaf
// sits on the same level. The edges draw in on slide enter.
// Egg: the keys are letters and one more key keeps being inserted: it drops in above the root,
// takes the branch it sorts into and settles in the free slot of the middle leaf.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
const W = 24
const H = 24
const root = { x: 86, keys: ['G', 'P'] }
// the middle leaf has a free slot at the end for the inserted key (sorted after J, L for N)
const kids = [{ x: 4, keys: ['B', 'E'] }, { x: 78, keys: ['J', 'L'] }, { x: 172, keys: ['S', 'W'] }]
const slots = (i: number) => kids[i].keys.length + (i === 1 && props.egg ? 1 : 0)
const edges = kids.map((k, i) => ({ x1: root.x + i * W, x2: k.x + (slots(i) * W) / 2 }))
const LY = 90
const slotX = kids[1].x + kids[1].keys.length * W
// flight of the new key, relative to its slot: above the root gap → down the middle edge → slot
const fly = { x0: root.x + W - slotX - W / 2, y0: -LY - 22, x1: edges[1].x1 + (edges[1].x2 - edges[1].x1) * 0.5 - slotX - W / 2, y1: -LY / 2 + 6 }
</script>

<template>
  <div class="nt" :class="{ on: active }">
    <svg viewBox="0 -24 228 148" :style="{ '--x0': `${fly.x0}px`, '--y0': `${fly.y0}px`, '--x1': `${fly.x1}px`, '--y1': `${fly.y1}px` }">
      <line v-for="(e, i) in edges" :key="i" :x1="e.x1" y1="34" :x2="e.x2" :y2="LY" pathLength="1" class="edge" :style="{ transitionDelay: `${300 + i * 150}ms` }" />
      <g v-for="(k, i) in root.keys" :key="`r${i}`">
        <rect :x="root.x + i * W" y="10" :width="W" :height="H" class="key" />
        <text :x="root.x + i * W + W / 2" y="27.5" text-anchor="middle" class="txt">{{ k }}</text>
      </g>
      <g v-for="(n, j) in kids" :key="`n${j}`" class="kid" :style="{ transitionDelay: `${700 + j * 120}ms` }">
        <g v-for="(k, i) in n.keys" :key="i">
          <rect :x="n.x + i * W" :y="LY" :width="W" :height="H" class="key" />
          <text :x="n.x + i * W + W / 2" :y="LY + 17.5" text-anchor="middle" class="txt">{{ k }}</text>
        </g>
        <rect v-if="egg && j === 1" :x="slotX" :y="LY" :width="W" :height="H" class="key free" />
      </g>
      <g v-if="egg" class="ins">
        <rect :x="slotX" :y="LY" :width="W" :height="H" class="key new" />
        <text :x="slotX + W / 2" :y="LY + 18.5" text-anchor="middle" class="txt new-t">{{ egg }}</text>
      </g>
      <line x1="2" x2="226" :y1="LY + H + 6" :y2="LY + H + 6" class="level" />
    </svg>
    <div class="cap dm-label dm-soft">all leaves on the same level</div>
  </div>
</template>

<style scoped>
.nt { display: flex; flex-direction: column; gap: .35rem; }
svg { width: 100%; overflow: visible; }
.key { fill: var(--dm-paper); stroke: var(--dm-ink); stroke-width: 2.5; }
.key.free { fill: none; stroke-dasharray: 3 3; stroke-width: 1.5; stroke: var(--dm-ink-soft); }
.key.new { fill: var(--dm-red); stroke: var(--dm-red); }
.txt { fill: var(--dm-ink); font-family: var(--dm-mono); font-weight: 700; font-size: 14px; }
.txt.new-t { fill: var(--dm-white); font-family: var(--dm-display); font-weight: 900; font-size: 19px; }
.edge { stroke: var(--dm-ink); stroke-width: 2.5; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .6s var(--dm-ease); }
.on .edge { stroke-dashoffset: 0; }
.kid { opacity: 0; transition: opacity .4s var(--dm-ease); }
.on .kid { opacity: 1; }
.ins { opacity: 0; }
.on .ins { animation: nt-insert 5s var(--dm-ease) 1.2s infinite; }
@keyframes nt-insert {
  0% { opacity: 0; transform: translate(var(--x0), calc(var(--y0) - 10px)); }
  8%, 24% { opacity: 1; transform: translate(var(--x0), var(--y0)); }
  40% { opacity: 1; transform: translate(var(--x1), var(--y1)); }
  52%, 92% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: none; }
}
.level { stroke: var(--dm-ink-soft); stroke-width: 1.5; stroke-dasharray: 4 3; }
.cap { align-self: flex-end; font-size: .54rem; text-align: right; }
</style>
