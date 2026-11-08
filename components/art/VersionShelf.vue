<script setup lang="ts">
// Q: Android KitKat. Version letters in alphabetical order, C to J, then 4.4: its tile is blank
// and the planned dessert name is struck out.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const tiles = [['C', '1.5'], ['D', '1.6'], ['E', '2.0'], ['F', '2.2'], ['G', '2.3'], ['H', '3.0'], ['I', '4.0'], ['J', '4.1']]
</script>

<template>
  <div class="vs" :class="{ on: active }">
    <div class="grid">
      <div v-for="(t, i) in tiles" :key="t[0]" class="tile" :style="{ transitionDelay: `${i * 70}ms` }">
        <span class="l dm-display">{{ t[0] }}</span><span class="v">{{ t[1] }}</span>
      </div>
      <div class="tile next" :style="{ transitionDelay: '700ms' }">
        <span class="face dm-hatch" /><span class="v dm-red">4.4</span>
      </div>
    </div>
    <div class="note">
      <s class="planned">„Key Lime Pie”?</s>
      <span class="dm-label dm-soft">2013 · name changed</span>
    </div>
  </div>
</template>

<style scoped>
.vs { display: flex; flex-direction: column; gap: .6rem; }
.grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: .3rem; }
.tile {
  aspect-ratio: 1; border: 2px solid var(--dm-ink); display: flex; flex-direction: column;
  align-items: center; justify-content: center; position: relative;
  opacity: 0; transform: translateY(8px); transition: opacity .35s var(--dm-ease), transform .35s var(--dm-ease);
}
.on .tile { opacity: 1; transform: none; }
.l { font-size: 1.35rem; line-height: .9; }
.v { font-family: var(--dm-mono); font-size: .52rem; font-weight: 600; color: var(--dm-ink-soft); }
.tile.next { grid-column: span 2; aspect-ratio: auto; border: 3px solid var(--dm-red); justify-content: flex-end; padding-bottom: .15rem; }
.face { position: absolute; inset: 0 0 1rem; }
.next .v { color: var(--dm-red); font-size: .6rem; position: relative; }
.note { display: flex; flex-direction: column; gap: .1rem; }
.planned { font-weight: 700; font-size: .85rem; text-decoration-thickness: 2px; }
.note .dm-label { font-size: .52rem; }
</style>
