<script setup lang="ts">
// Q: Transformer. A self-attention map over the paper's title: rows attend to columns.
// Cells fade in on slide enter; crimson strength = attention weight.
// Egg: the strongest weights trace the secret letter as a 5×5 pixel glyph.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const tokens = ['Attention', 'Is', 'All', 'You', 'Need']
const w = [
  [0.62, 0.05, 0.08, 0.05, 0.20],
  [0.40, 0.30, 0.15, 0.05, 0.10],
  [0.35, 0.10, 0.30, 0.10, 0.15],
  [0.25, 0.05, 0.10, 0.25, 0.35],
  [0.45, 0.05, 0.10, 0.15, 0.25],
]
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// 5×5 pixel glyphs; add one here if the letter changes
const glyphs: Record<string, string[]> = {
  C: ['.####', '#....', '#....', '#....', '.####'],
}
const g = props.egg ? glyphs[props.egg] : undefined
const weight = (r: number, c: number, v: number) =>
  g ? (g[r][c] === '#' ? 0.92 + ((r + c) % 3) * 0.04 : 0.06 + v * 0.18) : Math.max(0.07, v)
</script>

<template>
  <div class="attn" :class="{ on: active }">
    <div class="grid">
      <span />
      <span v-for="t in tokens" :key="`c${t}`" class="col dm-label">{{ t }}</span>
      <template v-for="(row, r) in w" :key="r">
        <span class="row dm-label">{{ tokens[r] }}</span>
        <span
          v-for="(v, c) in row" :key="c" class="cell"
          :class="{ hot: g && g[r][c] === '#' }"
          :style="{ '--w': weight(r, c, v), transitionDelay: `${(r * 5 + c) * 35}ms` }"
        />
      </template>
    </div>
    <div class="cap dm-label dm-soft">softmax(QKᵀ/√d)·V</div>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: 4.6rem repeat(5, 1fr); gap: 3px; align-items: end; }
.col { writing-mode: vertical-rl; transform: rotate(180deg); justify-self: center; font-size: .56rem; padding-bottom: .3rem; color: var(--dm-ink-soft); }
.row { font-size: .56rem; text-align: right; padding-right: .4rem; align-self: center; color: var(--dm-ink-soft); }
.cell { aspect-ratio: 1; background: var(--dm-red); opacity: 0; transition: opacity .5s var(--dm-ease); }
.on .cell { opacity: var(--w); }
.cap { margin-top: .6rem; text-align: right; font-size: .58rem; }
.on .cell.hot { animation: ag-beat 2.2s var(--dm-ease) 1.4s infinite; }
@keyframes ag-beat { 0%, 70%, 100% { transform: scale(1); } 80% { transform: scale(1.12); } }
</style>
