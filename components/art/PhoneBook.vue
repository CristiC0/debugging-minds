<script setup lang="ts">
// Q: DNS. A lookup "phone book" of names to numbers: a query at the top,
// rows appear on slide enter and the resolved row lands in crimson.
// Egg: like a real phone book, the page edge has alphabet thumb tabs; the tab of the looked-up
// name's section (the secret letter) sticks out in crimson. Rows are sorted to match.
import { computed } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
const all = [
  ['fmi.usm.md', '217.12.114.27'],
  ['github.com', '140.82.121.4'],
  ['gov.md', '89.28.37.15'],
  ['usm.md', '217.12.114.10'],
  ['w3.org', '128.30.52.100'],
]
// look up the first name in the secret letter's section (fmi.usm.md when there is no egg)
const hit = computed(() => Math.max(0, all.findIndex(r => props.egg && r[0][0].toUpperCase() === props.egg)))
// one tab per section, spanning its rows
const tabs = computed(() => {
  const out: { l: string, from: number, n: number }[] = []
  all.forEach((r, i) => {
    const l = r[0][0].toUpperCase()
    if (out.length && out[out.length - 1].l === l) out[out.length - 1].n++
    else out.push({ l, from: i, n: 1 })
  })
  return out
})
</script>

<template>
  <div class="book" :class="{ on: active }">
    <div class="q mono"><span class="dm-soft">?</span> {{ all[hit][0] }} <span class="dm-soft">→</span> <span class="cur" /></div>
    <div class="head">
      <span class="en">Name</span>
      <span class="en">Address</span>
    </div>
    <div class="rows" :class="{ tabbed: egg }">
      <div
        v-for="(r, i) in all" :key="r[0]" class="row mono" :class="{ hit: i === hit }"
        :style="{ transitionDelay: `${150 + i * 140}ms` }"
      >
        <span>{{ r[0] }}</span><span class="ip">{{ r[1] }}</span>
      </div>
      <template v-if="egg">
        <span
          v-for="t in tabs" :key="t.l" class="tab dm-display" :class="{ me: t.l === egg }"
          :style="{ top: `calc(${t.from} * var(--rh))`, height: `calc(${t.n} * var(--rh))` }"
        >{{ t.l }}</span>
      </template>
    </div>
    <div class="dm-label cap">Directory · TTL 3600</div>
  </div>
</template>

<style scoped>
.book { border: 2.5px solid var(--dm-ink); padding: .55rem .6rem; display: flex; flex-direction: column; }
.mono { font-family: var(--dm-mono); font-size: .64rem; }
.q { font-weight: 700; font-size: .72rem; padding-bottom: .4rem; border-bottom: 3px solid var(--dm-ink); display: flex; align-items: center; gap: .35rem; }
.cur { width: .45rem; height: .8rem; background: var(--dm-ink); animation: dm-pulse 1s steps(1) infinite; }
.head { display: flex; justify-content: space-between; padding: .3rem 0 .2rem; border-bottom: 2px solid var(--dm-ink); }
.rows { --rh: 1.42rem; position: relative; }
.rows.tabbed { margin-right: 1.95rem; }
.rows.tabbed .row { font-size: .6rem; gap: .4rem; }
.row {
  display: flex; justify-content: space-between; align-items: center; gap: .6rem; height: var(--rh); box-sizing: border-box; padding: 0 .25rem;
  border-bottom: 1px solid var(--dm-rule); opacity: 0; transform: translateY(6px);
  transition: opacity .35s var(--dm-ease), transform .35s var(--dm-ease);
}
.on .row { opacity: 1; transform: none; }
.ip { font-variant-numeric: tabular-nums; color: var(--dm-ink-soft); }
.row.hit { background: var(--dm-red); color: var(--dm-white); font-weight: 700; border-bottom-color: var(--dm-red); }
.row.hit .ip { color: var(--dm-white); }
.tab {
  position: absolute; left: calc(100% + .2rem); width: .95rem; box-sizing: border-box;
  display: grid; place-items: center; font-size: .7rem; line-height: 1;
  background: var(--dm-paper-2); color: var(--dm-ink-soft); border: 2px solid var(--dm-ink);
}
.tab.me { width: 1.75rem; background: var(--dm-red); border-color: var(--dm-red); color: var(--dm-white); font-size: 1.35rem; transform-origin: left; }
.on .tab.me { animation: pb-pull 2.6s var(--dm-ease) 1.2s infinite; }
@keyframes pb-pull { 0%, 70%, 100% { transform: none; } 80% { transform: translateX(.25rem); } }
.cap { font-size: .54rem; color: var(--dm-ink-soft); margin-top: .45rem; }
.en { font-size: .62rem; font-weight: 700; }
</style>
