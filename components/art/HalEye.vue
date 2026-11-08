<script setup lang="ts">
// Q: HAL 9000. The red camera eye, flat concentric discs (no glow, no gradient).
// The lens wakes up on slide enter.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
</script>

<template>
  <div class="eye" :class="{ on: active }">
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="96" class="bezel" />
      <circle cx="100" cy="100" r="84" class="rim" />
      <circle cx="100" cy="100" r="70" class="glass" />
      <g class="lens">
        <circle cx="100" cy="100" r="46" class="l1" />
        <circle cx="100" cy="100" r="28" class="l2" />
        <circle cx="100" cy="100" r="9" class="core" />
      </g>
      <circle cx="78" cy="76" r="5" class="spec" />
    </svg>
    <div class="cap dm-label dm-soft">1968 · 2001</div>
  </div>
</template>

<style scoped>
.eye { display: flex; flex-direction: column; align-items: center; gap: .5rem; }
svg { width: 100%; max-width: 13rem; }
.bezel { fill: var(--dm-ink); }
.rim { fill: var(--dm-paper-2); }
.glass { fill: var(--dm-ink-deep); }
.lens { transform-origin: 100px 100px; transform: scale(.4); opacity: 0; transition: transform 1.2s var(--dm-ease), opacity 1.2s var(--dm-ease); }
.on .lens { transform: none; opacity: 1; }
.l1 { fill: var(--dm-red-deep); }
.l2 { fill: var(--dm-red); }
.core { fill: var(--dm-white); opacity: .85; }
.spec { fill: var(--dm-white); opacity: .6; }
.cap { align-self: flex-end; font-size: .58rem; }
</style>
