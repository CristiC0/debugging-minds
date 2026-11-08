<script setup lang="ts">
// Q: Vibe coding. You describe the app in words, the AI writes the code, and you forget the code exists.
// The AI writes the code line by line, it stays readable for a few seconds, then fades out line by
// line (forgotten) and the cycle starts again; the prompt cursor keeps blinking.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const code = [
  'import { app } from "./ai"',
  'const db = connect(env.URL)',
  'app.get("/", async (q, r) => {',
  '  const rows = await db.all()',
  '  r.render("home", { rows })',
  '})',
  'app.listen(3000)',
]
</script>

<template>
  <div class="pf" :class="{ on: active }">
    <div class="prompt">
      <span class="dm-label dm-soft">You</span>
      <div class="say"><span class="gt">&gt;</span> make me an app…<span class="cur" /></div>
    </div>
    <div class="arrow"><ph-arrow-down-bold /></div>
    <div class="code">
      <div v-for="(l, i) in code" :key="i" class="ln" :style="{ animationDelay: `${0.3 + i * 0.22}s` }">
        <span class="no">{{ i + 1 }}</span>{{ l }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.pf { display: flex; flex-direction: column; gap: .35rem; }
.prompt { border: 2.5px solid var(--dm-ink); padding: .45rem .6rem; display: flex; flex-direction: column; gap: .15rem; }
.prompt .dm-label { font-size: .55rem; }
.say { font-weight: 700; font-size: .82rem; color: var(--dm-ink); display: flex; align-items: center; }
.say.ru { font-weight: 500; font-size: .72rem; color: var(--dm-ink-soft); padding-left: .9rem; }
.gt { font-family: var(--dm-mono); margin-right: .35rem; }
.cur { width: .4rem; height: .9rem; background: var(--dm-red); margin-left: .2rem; animation: dm-pulse 1s steps(1) infinite; }
.arrow { color: var(--dm-ink); font-size: 1rem; display: flex; justify-content: center; }
.code { background: var(--dm-ink-deep); color: var(--dm-white); padding: .5rem .55rem; font-family: var(--dm-mono); font-size: .56rem; line-height: 1.6; white-space: pre; overflow: hidden; }
.ln { opacity: 0; }
.on .ln { animation: pf-cycle 9s var(--dm-ease) infinite both; }
/* write in (one line after another via the delay) · hold readable · fade to a ghost · gone */
@keyframes pf-cycle {
  0% { opacity: 0; transform: translateX(-4px); }
  4% { opacity: 1; transform: none; }
  58% { opacity: 1; }
  72%, 94% { opacity: .07; }
  100% { opacity: 0; }
}
.no { color: var(--dm-ink-soft); display: inline-block; width: 1rem; }
</style>
