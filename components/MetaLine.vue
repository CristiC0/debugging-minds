<script setup lang="ts">
// The poster's meta row: items spread across the width, separated by "·".
withDefaults(defineProps<{ items: string[], justify?: 'between' | 'center' | 'start' }>(), { justify: 'between' })
</script>

<template>
  <div class="meta dm-meta" :class="`j-${justify}`">
    <template v-for="(it, i) in items" :key="i">
      <span v-if="i" class="sep">·</span>
      <span>{{ it }}</span>
    </template>
  </div>
</template>

<style scoped>
.meta { display: flex; align-items: center; }
.j-between { justify-content: space-between; }
.j-center { justify-content: center; gap: 2.2rem; }
.j-start { justify-content: flex-start; gap: 1.4rem; }
.sep { font-weight: 900; }
</style>
