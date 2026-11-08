<script setup lang="ts">
// Team standings as heavy horizontal bars. Leader in crimson.
// `revealAt`: rows appear bottom-up, one per click starting at that click (set `clicks:` accordingly).
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  teams: { name: string, score: number }[]
  max?: number
  revealAt?: number
  sort?: boolean
}>(), { sort: true })

const { $clicks } = useSlideContext()
const rows = computed(() => {
  const r = props.teams.map(t => ({ ...t }))
  return props.sort ? r.sort((a, b) => b.score - a.score) : r
})
const top = computed(() => props.max ?? Math.max(1, ...rows.value.map(r => r.score)))
const leader = computed(() => Math.max(...rows.value.map(r => r.score)))
function shown(i: number) {
  if (props.revealAt === undefined) return true
  // last place first
  return $clicks.value >= props.revealAt + (rows.value.length - 1 - i)
}
</script>

<template>
  <div class="board">
    <div v-for="(t, i) in rows" :key="t.name" class="row" :class="{ lead: t.score === leader, hide: !shown(i) }">
      <span class="pos dm-display dm-num">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="name">{{ t.name }}</span>
      <span class="track"><span class="fill" :style="{ transform: `scaleX(${shown(i) ? t.score / top : 0})` }" /></span>
      <span class="score dm-display dm-num">{{ t.score }}</span>
    </div>
  </div>
</template>

<style scoped>
.board { display: flex; flex-direction: column; gap: .45rem; }
.row { display: grid; grid-template-columns: 2.6rem 11rem 1fr 3.6rem; align-items: center; gap: .9rem; transition: opacity .4s ease; }
.hide { opacity: 0; }
.pos { font-size: 1.6rem; color: var(--dm-ink-soft); }
.name { font-family: var(--dm-display); font-weight: 800; font-size: 1.05rem; text-transform: uppercase; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track { height: 1.6rem; background: var(--dm-paper-2); overflow: hidden; }
.fill { display: block; height: 100%; background: var(--dm-ink); transform-origin: left; transition: transform .9s var(--dm-ease); }
.score { font-size: 1.9rem; text-align: right; }
.lead .fill { background: var(--dm-red); }
.lead .pos, .lead .score { color: var(--dm-red); }
</style>
