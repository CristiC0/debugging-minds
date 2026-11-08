<script setup lang="ts">
// Q: QR code. A plain Go board mid-game (the game that inspired it), last move in crimson.
// No corner squares and no "3 corners" caption: the finder-pattern version gave the answer away.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const N = 11
const p = (i: number) => 20 + i * 16
const black = [[2, 2], [3, 3], [2, 4], [4, 2], [8, 3], [7, 4], [5, 5], [6, 6], [3, 7], [4, 8], [8, 7], [7, 8], [5, 3]]
const white = [[3, 2], [2, 3], [8, 2], [8, 4], [6, 4], [4, 5], [6, 5], [7, 6], [2, 7], [3, 8], [8, 8], [5, 7]]
const stones = [...black.map(s => ({ s, c: 'b' })), ...white.map(s => ({ s, c: 'w' })), { s: [6, 8], c: 'r' }]
</script>

<template>
  <div class="go" :class="{ on: active }">
    <svg viewBox="0 0 200 200">
      <rect x="4" y="4" width="192" height="192" class="board" />
      <line v-for="i in N" :key="`h${i}`" :x1="p(0)" :x2="p(N - 1)" :y1="p(i - 1)" :y2="p(i - 1)" class="grid" />
      <line v-for="i in N" :key="`v${i}`" :y1="p(0)" :y2="p(N - 1)" :x1="p(i - 1)" :x2="p(i - 1)" class="grid" />
      <circle
        v-for="(st, i) in stones" :key="i" :cx="p(st.s[0])" :cy="p(st.s[1])" r="6.6"
        class="stone" :class="st.c" :style="{ transitionDelay: `${(i % 12) * 50 + (st.c === 'r' ? 700 : 0)}ms` }"
      />
    </svg>
    <div class="cap dm-label dm-soft">Game of Go</div>
  </div>
</template>

<style scoped>
.go { display: flex; flex-direction: column; gap: .4rem; }
svg { width: 100%; max-width: 14rem; }
.board { fill: var(--dm-paper-2); stroke: var(--dm-ink); stroke-width: 3; }
.grid { stroke: var(--dm-ink-soft); stroke-width: 1; }
.stone { opacity: 0; transition: opacity .35s var(--dm-ease); }
.on .stone { opacity: 1; }
.b { fill: var(--dm-ink); }
.w { fill: var(--dm-white); stroke: var(--dm-ink); stroke-width: 2; }
.r { fill: var(--dm-red); }
.cap { align-self: flex-end; font-size: .56rem; }
</style>
