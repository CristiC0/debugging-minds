<script setup lang="ts">
// End-of-game answer sheet. One row per question; answers drop in one per click.
//   <AnswerList :reveal-at="1" :items="[{ n: 3, ro: 'Vulnerabilitatea din 2014', ru: 'Уязвимость 2014 года', answer: 'Heartbleed' }, …]" />
// Needs `clicks: <items.length>` (with reveal-at 1). The newest answer is crimson, earlier ones ink.
// Keep ≤ 7 rows per slide; split longer sheets across slides.
// Easter egg: wrap a letter in brackets ('P[o]stgreSQL') to mark it crimson + underlined. The marked
// letters of a round, read in order, spell a secret for round 3 (key / hint). The brackets never show.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{
  items: { n: number | string, ro: string, ru?: string, answer: string }[]
  revealAt?: number
  all?: boolean          // show everything (printed sheet, jury copy)
  compact?: boolean      // tighter rows for a two-column sheet (a whole 15-question round on one slide)
}>(), { revealAt: 1 })

const { $clicks } = useSlideContext()
const segs = (s: string) => s.split(/(\[[^\]]+\])/).filter(Boolean)
  .map(t => (t.startsWith('[') ? { t: t.slice(1, -1), egg: true } : { t, egg: false }))
const shown = computed(() => (props.all ? props.items.length : Math.max(0, $clicks.value - props.revealAt + 1)))
</script>

<template>
  <div class="list" :class="{ compact }">
    <div
      v-for="(it, i) in items" :key="it.n" class="row"
      :class="{ on: i < shown, latest: !all && i === shown - 1 }"
    >
      <span class="n dm-display dm-num">{{ String(it.n).padStart(2, '0') }}</span>
      <span class="topic">
        <span class="ro">{{ it.ro }}</span>
        <span v-if="it.ru" class="ru">{{ it.ru }}</span>
      </span>
      <span class="ans">
        <span v-if="i < shown" class="txt dm-display"><template v-for="(sg, k) in segs(it.answer)" :key="k"><span v-if="sg.egg" class="egg">{{ sg.t }}</span><template v-else>{{ sg.t }}</template></template></span>
        <span v-else class="hide" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.list { display: flex; flex-direction: column; }
.row { display: grid; grid-template-columns: 2.6rem 15rem 1fr; align-items: center; gap: 1rem; padding: .38rem 0; border-bottom: 1px solid var(--dm-rule); }
.row:first-child { border-top: 2px solid var(--dm-ink); }
.n { font-size: 1.5rem; line-height: .8; color: var(--dm-ink-soft); }
.topic { display: flex; flex-direction: column; line-height: 1.15; min-width: 0; }
.topic .ro { font-weight: 700; font-size: .82rem; }
.topic .ru { font-size: .7rem; color: var(--dm-ink-soft); }
.ans { min-width: 0; }
.txt { display: inline-block; font-size: 1.7rem; line-height: .95; letter-spacing: -.03em; animation: dm-in-up .35s var(--dm-ease) both; }
.hide { display: block; height: 1.3rem; width: 55%; background: var(--dm-paper-2); }
.latest .txt, .latest .n { color: var(--dm-red); }
.compact .row { grid-template-columns: 2rem 9.2rem 1fr; gap: .6rem; padding: .42rem 0; min-height: 2.75rem; }
.compact .n { font-size: 1.3rem; }
.compact .topic .ro { font-size: .74rem; }
.compact .topic .ru { font-size: .62rem; }
.compact .txt { font-size: 1.22rem; white-space: nowrap; }
.compact .hide { height: 1rem; }
.egg { color: var(--dm-red); text-decoration: underline; text-decoration-thickness: .09em; text-underline-offset: .1em; }
</style>
