<script setup lang="ts">
// Poster cover: meta row, giant stacked words, date · time · room row.
// The column shrinks to the widest word, so both meta rows span exactly the headline (as on the poster).
// Frontmatter: meta, words, details, image (transparent red engraving, sits between the words), size,
// credit (required when the image is CC BY: shown small in the corner).
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  meta?: string[]
  words?: string[]
  details?: string[]
  image?: string
  size?: string
  credit?: string
}>(), {
  meta: () => ['Departamentul Informatică', 'FMI', 'USM'],
  words: () => ['Debug', 'ging', 'minds'],
  details: () => [],
  size: '9.6rem',
})
// Uppercase Ă Â Î carry a mark above the cap height that would touch the meta row: give it room.
const accent = computed(() => /[ăâîĂÂÎ]/.test(props.words[0] ?? ''))
</script>

<template>
  <div class="slidev-layout cover">
    <div class="col">
      <MetaLine :items="meta" class="meta" :class="{ accent }" />
      <Stack :words="words" :image="image" :size="size" align="center" />
      <MetaLine v-if="details.length" :items="details" class="details" />
      <div class="slot"><slot /></div>
    </div>
    <div v-if="credit" class="credit dm-label">{{ credit }}</div>
  </div>
</template>

<style scoped>
.cover { position: relative; height: 100%; display: grid; place-items: center; padding: 1.4rem 3rem; }
.col { display: inline-flex; flex-direction: column; gap: 1.1rem; }
.meta { padding: 0 6%; }
.meta.accent { margin-bottom: 1.4rem; }
.details { font-size: 1.05rem; padding: 0 3%; margin-top: .2rem; }
.slot:empty { display: none; }
.credit { position: absolute; right: 1.2rem; bottom: .6rem; font-size: .5rem; color: var(--dm-ink-soft); letter-spacing: .04em; }
</style>
