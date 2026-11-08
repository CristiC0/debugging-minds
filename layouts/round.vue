<script setup lang="ts">
// Round opener. Frontmatter: round (number), plus optional stats lines.
// Slot: the round title, ideally <Bi size="xl" ro="…" ru="…" />.
withDefaults(defineProps<{
  round: number | string
  stats?: string[]      // e.g. ['8 întrebări · 8 вопросов', '30 s']
}>(), { stats: () => [] })
</script>

<template>
  <div class="slidev-layout round">
    <div class="left">
      <div class="dm-meta lbl">Round</div>
      <div class="title"><slot /></div>
      <div class="stats">
        <Tag v-for="s in stats" :key="s" variant="solid">{{ s }}</Tag>
      </div>
    </div>
    <div class="num dm-display dm-num">{{ String(round).padStart(2, '0') }}</div>
  </div>
</template>

<style scoped>
.round { height: 100%; display: grid; grid-template-columns: 1fr auto; align-items: end; padding: 2.4rem 3.2rem 2.2rem; }
.left { display: flex; flex-direction: column; gap: 1.2rem; align-self: stretch; justify-content: space-between; padding-bottom: 1rem; }
.lbl { font-size: 1rem; }
.title :deep(.ro) { font-family: var(--dm-display); font-weight: 900; text-transform: uppercase; letter-spacing: -.035em; font-size: 3.4rem; line-height: .88; }
.title :deep(.ru) { font-family: var(--dm-display); text-transform: uppercase; letter-spacing: -.02em; font-size: 1.6rem; margin-top: .4rem; }
.stats { display: flex; gap: .5rem; flex-wrap: wrap; }
.num { font-size: 22rem; line-height: .74; color: var(--dm-red); letter-spacing: -.07em; margin-right: -.6rem; margin-bottom: -.4rem; }
</style>
