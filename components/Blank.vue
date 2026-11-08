<script setup lang="ts">
// Letter blanks inside a clue: "Can it run <Blank :n="4" />?"
// With `answer` + `reveal`, the letters drop in (e.g. on the final answers slide).
import { computed } from 'vue'

const props = defineProps<{ n?: number, answer?: string, reveal?: boolean }>()
const cells = computed(() => {
  const len = props.n ?? props.answer?.length ?? 3
  return Array.from({ length: len }, (_, i) => (props.reveal ? props.answer?.[i] ?? '' : ''))
})
</script>

<template>
  <span class="blank" :aria-label="reveal ? answer : `${cells.length} letters`">
    <span v-for="(c, i) in cells" :key="i" class="cell" :class="{ on: c }">{{ c }}</span>
  </span>
</template>

<style scoped>
.blank { display: inline-flex; gap: .18em; vertical-align: baseline; margin: 0 .1em; }
.cell {
  display: inline-grid; place-items: end center; width: .85em; height: 1.05em;
  border-bottom: .14em solid currentColor;
  font-family: var(--dm-display); font-weight: 900; text-transform: uppercase; line-height: 1;
}
.cell.on { color: var(--dm-red); animation: dm-in-up .3s var(--dm-ease) both; }
</style>
