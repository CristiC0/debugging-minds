<script setup lang="ts">
// Round 3 hints: one card per stage, hidden under an ink block until revealed.
//   <HintCards :items="[{ ro: '…', ru: '…' }, …]" />
// Reveal: click N of the slide opens stage N (set `clicks: <items.length>`), or click a card to
// open just that one out of order. Card clicks are synced between presenter and audience windows
// (same browser) over a BroadcastChannel, like the timer. The newest open stage is crimson.
import { computed, onUnmounted, ref, watch } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'

const props = defineProps<{ items: { ro: string, ru?: string }[] }>()

const { $clicks, $page, $renderContext } = useSlideContext()
const active = useIsSlideActive()
const opened = ref<number[]>([]) // opened by mouse, in order

const shown = computed(() => {
  const s = new Set<number>()
  for (let i = 0; i < Math.min($clicks.value, props.items.length); i++) s.add(i)
  opened.value.forEach(i => s.add(i))
  return s
})
const latest = computed(() => {
  const byClick = Math.min($clicks.value, props.items.length) - 1
  const last = opened.value.at(-1)
  return last !== undefined && !(last <= byClick) ? last : byClick
})

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('dm-hints') : null
const me = Math.random().toString(36).slice(2)
channel?.addEventListener('message', (e) => {
  if (e.data?.from === me || e.data?.page !== $page.value) return
  if (!opened.value.includes(e.data.i)) opened.value.push(e.data.i)
})
function open(i: number) {
  if (!['slide', 'presenter'].includes($renderContext.value) || shown.value.has(i)) return
  opened.value.push(i)
  channel?.postMessage({ from: me, page: $page.value, i })
}
watch(active, a => { if (!a) opened.value = [] })
onUnmounted(() => channel?.close())
</script>

<template>
  <div class="cards" :style="{ '--n': items.length }">
    <div
      v-for="(it, i) in items" :key="i" class="card"
      :class="{ on: shown.has(i), latest: i === latest }" @click="open(i)"
    >
      <div class="top">
        <span class="dm-label">Stage</span>
        <span class="n dm-display dm-num">{{ String(i + 1).padStart(2, '0') }}</span>
      </div>
      <div v-if="shown.has(i)" class="body">
        <span class="ro" lang="ro">{{ it.ro }}</span>
        <span v-if="it.ru" class="ru" lang="ru">{{ it.ru }}</span>
      </div>
      <div v-else class="cover">
        <ph-lock-simple-bold class="lk" />
        <span class="dm-label">Hint</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 1.4rem; }
.card { display: flex; flex-direction: column; min-height: 17rem; border: 2.5px solid var(--dm-ink); cursor: pointer; user-select: none; }
.top { display: flex; justify-content: space-between; align-items: flex-end; padding: .7rem .9rem .6rem; border-bottom: 2.5px solid var(--dm-ink); }
.top .dm-label { color: var(--dm-ink-soft); }
.n { font-size: 2.6rem; line-height: .8; letter-spacing: -.05em; }
.latest .n { color: var(--dm-red); }

.cover { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .6rem; background: var(--dm-ink); color: var(--dm-paper); }
.lk { font-size: 2.6rem; }
.cover .dm-label { color: var(--dm-paper); }

.body { flex: 1; display: flex; flex-direction: column; gap: .7rem; padding: 1rem .9rem; animation: dm-in-up .35s var(--dm-ease) both; }
.ro { font-weight: 700; font-size: 1.15rem; line-height: 1.25; color: var(--dm-ink); }
.ru { font-size: .98rem; line-height: 1.28; color: var(--dm-ink-soft); }
</style>
