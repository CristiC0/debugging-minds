<script setup lang="ts">
// Break between rounds: stacked word + big block countdown that starts on enter.
withDefaults(defineProps<{ minutes?: number, words?: string[] }>(), { minutes: 10, words: () => ['Pau', 'ză'] })
</script>

<template>
  <div class="slidev-layout brk">
    <div class="left">
      <Stack :words="words" size="9rem" align="left" />
      <div class="dm-meta ru">Перерыв</div>
    </div>
    <div class="right">
      <Timer :seconds="minutes * 60" :at="0" variant="block" :warn="60" :sound="false" />
      <div class="slot"><slot /></div>
    </div>
  </div>
</template>

<style scoped>
.brk { height: 100%; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 2rem; padding: 2.4rem 3.4rem; }
.ru { font-size: 1.6rem; color: var(--dm-ink-soft); margin-top: 1rem; }
.right { display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; }
.slot { text-align: right; max-width: 18rem; }
</style>
