<script setup lang="ts">
// Q: Git. A `log --graph` without the name: a branch forks and merges, HEAD in crimson.
// The oldest commit is the real first one: e83c516, 7 April 2005. Lines draw on slide enter.
// Lanes are SVG at 1:1 px; labels are HTML rows on the same 30px grid.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const X0 = 12
const X1 = 38
const STEP = 30
const Y = (i: number) => 12 + i * STEP
const commits = [
  { lane: 0, hash: 'a91f0d2', note: 'HEAD', head: true },
  { lane: 0, hash: '7c4e1b8', note: 'merge' },
  { lane: 1, hash: '3d9a6f1' },
  { lane: 1, hash: 'f02b7c4' },
  { lane: 0, hash: 'b6e18a0' },
  { lane: 0, hash: '5a3c9e7' },
  { lane: 0, hash: 'e83c516', note: '2005-04-07' },
]
const H = Y(commits.length - 1) + 12
const main = `M${X0} ${Y(0)} V${Y(6)}`
const branch = `M${X0} ${Y(1)} C${X0} ${Y(1) + 16} ${X1} ${Y(2) - 16} ${X1} ${Y(2)} V${Y(3)} C${X1} ${Y(3) + 30} ${X0} ${Y(5) - 30} ${X0} ${Y(5)}`
</script>

<template>
  <div class="graph" :class="{ on: active }" :style="{ height: `${H}px` }">
    <svg :width="52" :height="H" :viewBox="`0 0 52 ${H}`">
      <path :d="main" class="ln" pathLength="1" />
      <path :d="branch" class="ln br" pathLength="1" />
      <circle v-for="(c, i) in commits" :key="c.hash" :cx="c.lane ? X1 : X0" :cy="Y(i)" r="7" class="dot" :class="{ head: c.head }" />
    </svg>
    <div v-for="(c, i) in commits" :key="c.hash" class="lbl" :class="{ head: c.head }" :style="{ top: `${Y(i)}px` }">
      <span class="hash">{{ c.hash }}</span>
      <span v-if="c.note" class="note dm-label">{{ c.note }}</span>
    </div>
  </div>
</template>

<style scoped>
.graph { position: relative; }
svg { position: absolute; left: 0; top: 0; overflow: visible; }
.ln { fill: none; stroke: var(--dm-ink); stroke-width: 3; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.1s var(--dm-ease); }
.br { transition-delay: .35s; }
.on .ln { stroke-dashoffset: 0; }
.dot { fill: var(--dm-paper); stroke: var(--dm-ink); stroke-width: 3; }
.dot.head { fill: var(--dm-red); stroke: var(--dm-red); }
.lbl { position: absolute; left: 60px; right: 0; translate: 0 -50%; display: flex; align-items: baseline; justify-content: space-between; gap: .4rem; }
.hash { font-family: var(--dm-mono); font-weight: 600; font-size: .78rem; color: var(--dm-ink); }
.note { font-size: .52rem; color: var(--dm-ink-soft); }
.head .hash, .head .note { color: var(--dm-red); }
</style>
