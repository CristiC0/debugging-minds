<script setup lang="ts">
// Header strip shared by the question and trivia layouts: number · category · round · points.
defineProps<{
  number?: number | string
  round?: number | string
  points?: number
  category?: string
}>()
</script>

<template>
  <header class="qh">
    <div class="qno">
      <span class="n dm-display dm-num">{{ String(number ?? '').padStart(2, '0') }}</span>
      <span class="dm-meta lbl">Question</span>
    </div>
    <Tag v-if="category" variant="outline">{{ category }}</Tag>
    <div class="right">
      <span v-if="round" class="dm-label dm-soft">R{{ round }}</span>
      <Tag v-if="points" variant="solid">{{ points }} pts</Tag>
    </div>
  </header>
</template>

<style scoped>
.qh { display: flex; align-items: center; gap: 1.2rem; padding-bottom: .7rem; border-bottom: 3px solid var(--dm-ink); }
.qno { display: flex; align-items: center; gap: .7rem; }
.qno .n { font-size: 3.2rem; line-height: .78; letter-spacing: -.06em; }
.qno .lbl { font-size: .7rem; line-height: 1.1; }
.right { margin-left: auto; display: flex; align-items: center; gap: .8rem; }
</style>
