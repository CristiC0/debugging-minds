<script setup lang="ts">
// Running footer on content slides: event name only (no page numbers). Hidden on full-bleed layouts and on trivia (its side panel already carries the meta).
// CTF clock block: while the round-3 clock runs (or is paused mid-round), a small block shows it on every other
// slide, so you can go to other slides during the practical round. Clicking it jumps back to the CTF slide (`ctf: true`).
import { computed, onUnmounted, watch } from 'vue'
import { useNav } from '@slidev/client'
import { useCtfClock } from './composables/useCtfClock'

const { currentLayout, currentSlideRoute, slides, go, isPrintMode } = useNav()
const hidden = computed(() => ['cover', 'round', 'break', 'end', 'trivia'].includes(currentLayout.value))

const { hh, mm, ss, state, tick } = useCtfClock()
const isCtf = (r: any) => !!r?.meta?.slide?.frontmatter?.ctf
const showClock = computed(() => !isPrintMode.value && state.value !== 'idle' && !isCtf(currentSlideRoute.value))
watch(showClock, (on, was) => { if (on !== !!was) tick(on) }, { immediate: true })
onUnmounted(() => { if (showClock.value) tick(false) })
function back() {
  const r = slides.value.find(isCtf)
  if (r) go(r.no)
}
</script>

<template>
  <div v-if="!hidden" class="foot dm-label">
    <span>Debugging Minds · 11.11.2026</span>
  </div>
  <button v-if="showClock" class="ctf-clock" :class="state" title="Capture the Flag" @click="back">
    <span class="lbl dm-label"><ph-flag-checkered-bold v-if="state === 'done'" class="ic" /><ph-flag-bold v-else class="ic" /> CTF</span>
    <span class="t dm-display dm-num"><template v-if="hh > 0">{{ hh }}:</template>{{ mm }}<span class="colon">:</span>{{ ss }}</span>
  </button>
</template>

<style scoped>
.foot { position: absolute; left: 2.6rem; right: 2.6rem; bottom: .55rem; display: flex; justify-content: space-between; color: var(--dm-ink-soft); font-size: .55rem; pointer-events: none; z-index: 40; }
.ctf-clock { position: absolute; top: .7rem; right: .9rem; z-index: 41; display: flex; align-items: center; gap: .55rem; padding: .3rem .6rem .25rem; background: var(--dm-ink); color: var(--dm-paper); border: 0; cursor: pointer; }
.ctf-clock .lbl { display: flex; align-items: center; gap: .25rem; font-size: .58rem; color: var(--dm-paper-2); }
.ctf-clock .ic { color: var(--dm-red); font-size: 1.1em; }
.ctf-clock .t { font-size: 1.35rem; line-height: 1; letter-spacing: -.03em; }
.ctf-clock.running .colon { animation: dm-pulse 1s steps(1) infinite; }
.ctf-clock.paused .t { opacity: .5; }
.ctf-clock.done { background: var(--dm-red); }
.ctf-clock.done .ic, .ctf-clock.done .lbl { color: var(--dm-white); }
</style>
