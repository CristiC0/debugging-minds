<script setup lang="ts">
// Break between rounds: stacked word on the left, a large coffee glyph on the right. No clock.
withDefaults(defineProps<{ words?: string[] }>(), { words: () => ['Pau', 'ză'] })
</script>

<template>
  <div class="slidev-layout brk">
    <div class="left">
      <Stack :words="words" size="9rem" align="left" />
      <div class="dm-meta ru">Перерыв</div>
    </div>
    <div class="right">
      <ph-coffee-bold class="glyph" />
      <div class="slot"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.brk { height: 100%; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 2rem; padding: 2.4rem 3.4rem; }
.ru { font-size: 1.6rem; color: var(--dm-ink-soft); margin-top: 1rem; }
.right { display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; }
.glyph { font-size: 13rem; color: var(--dm-red); }
.slot { text-align: right; max-width: 18rem; }
</style>
