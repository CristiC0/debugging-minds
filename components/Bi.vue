<script setup lang="ts">
// Bilingual line: Romanian leads, Russian follows smaller and softer.
// Use props for short strings, or the #ro / #ru slots for rich content.
withDefaults(defineProps<{
  ro?: string
  ru?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'q'
  inline?: boolean      // RO · RU on one line (labels, buttons)
  upper?: boolean
}>(), { size: 'md' })
</script>

<template>
  <span class="bi" :class="[`s-${size}`, { inline, upper }]">
    <span class="ro" lang="ro"><slot name="ro">{{ ro }}</slot></span>
    <span v-if="inline && (ru || $slots.ru)" class="dot">·</span>
    <span v-if="ru || $slots.ru" class="ru" lang="ru"><slot name="ru">{{ ru }}</slot></span>
  </span>
</template>

<style scoped>
.bi { display: flex; flex-direction: column; gap: .3em; }
.bi.inline { display: inline-flex; flex-direction: row; align-items: baseline; gap: .45em; }
.ro { font-weight: 700; color: var(--dm-ink); }
.ru { font-weight: 500; color: var(--dm-ink-soft); }
.dot { color: var(--dm-ink-soft); }
.upper .ro, .upper .ru { text-transform: uppercase; letter-spacing: -.01em; }

.s-sm .ro { font-size: .8rem; } .s-sm .ru { font-size: .72rem; }
.s-md .ro { font-size: 1.05rem; } .s-md .ru { font-size: .9rem; }
.s-lg .ro { font-size: 1.5rem; line-height: 1.15; } .s-lg .ru { font-size: 1.12rem; line-height: 1.2; }
.s-xl .ro { font-size: 2.4rem; line-height: 1; } .s-xl .ru { font-size: 1.5rem; line-height: 1.1; }

/* the question itself: display face, tight, RU under a short red rule */
.s-q { gap: 0; }
.s-q .ro { font-family: var(--dm-display); font-weight: 800; font-size: 2rem; line-height: 1.08; letter-spacing: -.025em; }
.s-q .ru { font-family: var(--dm-display); font-weight: 500; font-size: 1.35rem; line-height: 1.15; letter-spacing: -.01em; margin-top: .7rem; padding-top: .55rem; position: relative; }
.s-q .ru::before { content: ''; position: absolute; top: 0; left: 0; width: 2.2rem; height: 3px; background: var(--dm-red); }
</style>
