<script setup lang="ts">
// Q: Lava lamps (Cloudflare's wall of entropy). A recording camera frame full of pixel noise,
// hashed into a key: the noise cells shuffle once on enter, then the key prints. No lamps drawn.
import { useReplay } from '../../composables/useReplay'
import { computed } from 'vue'

const active = useReplay()
// fixed pseudo-random grid (deterministic, so both windows match)
const cells = computed(() => Array.from({ length: 60 }, (_, i) => ((i * 37 + 11) % 7) < 3))
</script>

<template>
  <div class="ef" :class="{ on: active }">
    <div class="cam">
      <div class="top dm-label"><span class="rec" />REC · CAM 01 · 24/7</div>
      <div class="noise">
        <span v-for="(c, i) in cells" :key="i" :class="{ k: c }" :style="{ transitionDelay: `${(i * 13) % 600}ms` }" />
      </div>
      <div class="dm-label sub">~100 objects · 1970s</div>
    </div>
    <div class="ekey">
      <span class="ttl dm-label">SHA-256 → key</span>
      <span class="hex">9f3a c41e 07b2 e8d5</span>
    </div>
  </div>
</template>

<style scoped>
.ef { display: flex; flex-direction: column; gap: .35rem; }
.cam { border: 2.5px solid var(--dm-ink); padding: .4rem; background: var(--dm-paper-2); }
.top { display: flex; align-items: center; gap: .35rem; font-size: .56rem; margin-bottom: .3rem; }
.rec { width: .55rem; height: .55rem; background: var(--dm-red); animation: dm-pulse 1.2s steps(1) infinite; }
.noise { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2px; background: var(--dm-ink); padding: 3px; }
.noise span { aspect-ratio: 1; background: var(--dm-ink-soft); transition: background .3s steps(2); }
.on .noise span.k { background: var(--dm-paper); }
.sub { font-size: .52rem; color: var(--dm-ink-soft); margin-top: .3rem; }
.ekey { border: 2.5px solid var(--dm-ink); padding: .35rem .45rem; display: flex; flex-direction: column; gap: .15rem; opacity: 0; transition: opacity .4s var(--dm-ease) .9s; }
.on .ekey { opacity: 1; }
.ttl { font-size: .52rem; color: var(--dm-ink-soft); }
.hex { font-family: var(--dm-mono); font-weight: 700; font-size: .66rem; letter-spacing: .06em; }
</style>
