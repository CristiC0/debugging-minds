<script setup lang="ts">
// Q: Garbage collector. A heap of object cells; roots point at the live ones. A crimson sweep line
// crosses the heap on slide enter and the unreachable cells are struck and fade behind it.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const COLS = 4
const S = 30
const X0 = 70
const cells = Array.from({ length: 12 }, (_, i) => ({ c: i % COLS, r: Math.floor(i / COLS) }))
const live = new Set([0, 1, 5, 6, 8, 9])
const at = (i: number) => ({ x: X0 + cells[i].c * (S + 8), y: 16 + cells[i].r * (S + 10) })
const roots = [{ y: 31, to: 0 }, { y: 111, to: 8 }]
const edges = [[0, 1], [1, 5], [5, 6], [8, 9]]
</script>

<template>
  <div class="hs" :class="{ on: active }">
    <svg viewBox="0 0 230 140" class="heap">
      <g v-for="(r, i) in roots" :key="`r${i}`">
        <rect x="4" :y="r.y - 9" width="18" height="18" class="root" />
        <line x1="22" :y1="r.y" :x2="at(r.to).x" :y2="r.y" class="edge" />
      </g>
      <line
        v-for="([a, b], i) in edges" :key="`e${i}`" class="edge"
        :x1="at(a).x + S / 2" :y1="at(a).y + S / 2" :x2="at(b).x + S / 2" :y2="at(b).y + S / 2"
      />
      <g v-for="(c, i) in cells" :key="i" class="cell" :class="{ dead: !live.has(i) }" :style="{ transitionDelay: `${0.3 + c.c * 0.3}s` }">
        <rect :x="at(i).x" :y="at(i).y" :width="S" :height="S" />
        <path v-if="!live.has(i)" :d="`M${at(i).x + 6} ${at(i).y + 6} L${at(i).x + S - 6} ${at(i).y + S - 6} M${at(i).x + S - 6} ${at(i).y + 6} L${at(i).x + 6} ${at(i).y + S - 6}`" class="x" />
      </g>
      <line x1="0" y1="4" x2="0" y2="136" class="sweep" />
    </svg>
    <div class="cap dm-label dm-soft"><span>roots</span><span>heap</span></div>
  </div>
</template>

<style scoped>
.hs { display: flex; flex-direction: column; gap: .3rem; }
.heap { width: 100%; overflow: visible; }
.root { fill: var(--dm-ink); }
.edge { stroke: var(--dm-ink); stroke-width: 2.5; }
.cell rect { fill: var(--dm-ink); stroke: var(--dm-ink); stroke-width: 2.5; }
.cell.dead rect { fill: var(--dm-paper-2); }
.x { stroke: var(--dm-ink); stroke-width: 2.5; }
.cell.dead { transition: opacity .4s var(--dm-ease); }
.on .cell.dead { opacity: .15; }
.sweep { stroke: var(--dm-red); stroke-width: 3; transform: translateX(60px); opacity: 0; transition: transform 1.4s linear .1s, opacity .2s; }
.on .sweep { transform: translateX(226px); opacity: 1; }
.cap { display: flex; justify-content: space-between; font-size: .55rem; }
</style>
