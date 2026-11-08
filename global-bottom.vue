<script setup lang="ts">
// Running footer on content slides: event name only (no page numbers). Hidden on full-bleed layouts and on trivia (its side panel already carries the meta).
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentLayout } = useNav()
const hidden = computed(() => ['cover', 'round', 'break', 'end', 'trivia'].includes(currentLayout.value))
</script>

<template>
  <div v-if="!hidden" class="foot dm-label">
    <span>Debugging Minds · 11.11.2026</span>
  </div>
</template>

<style scoped>
.foot { position: absolute; left: 2.6rem; right: 2.6rem; bottom: .55rem; display: flex; justify-content: space-between; color: var(--dm-ink-soft); font-size: .55rem; pointer-events: none; z-index: 40; }
</style>
