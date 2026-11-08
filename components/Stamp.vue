<script setup lang="ts">
// Rubber stamp: "CORECT · ВЕРНО". Slams in when `show` turns true.
withDefaults(defineProps<{
  ro?: string
  ru?: string
  show?: boolean
  tone?: 'red' | 'ink'
  rotate?: number
}>(), { ro: 'Corect', ru: 'Верно', show: true, tone: 'red', rotate: -6 })
</script>

<template>
  <div v-if="show" class="stamp" :class="tone" :style="{ '--r': `${rotate}deg` }">
    <span class="ro">{{ ro }}</span>
    <span v-if="ru" class="ru">{{ ru }}</span>
  </div>
</template>

<style scoped>
.stamp {
  display: inline-flex; flex-direction: column; align-items: center;
  padding: .35rem .9rem .4rem;
  border: 4px double currentColor;
  font-family: var(--dm-display); font-weight: 900; text-transform: uppercase; line-height: .95;
  transform: rotate(var(--r));
  animation: dm-stamp .45s var(--dm-ease) both;
}
.red { color: var(--dm-red); }
.ink { color: var(--dm-ink); }
.ro { font-size: 1.6rem; letter-spacing: -.03em; }
.ru { font-size: .85rem; font-weight: 700; letter-spacing: .02em; }
</style>
