<script setup lang="ts">
// Q: Two pizzas bought for 10,000 BTC. A paper receipt dated 22.05.2010: two of a redacted item,
// paid in bitcoin, total in crimson. Rows print one by one on slide enter.
// Egg: the item line carries a tax-code flag at the far right, as till receipts do, explained in the footer.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
</script>

<template>
  <div class="rc" :class="{ on: active }">
    <div class="paper">
      <div class="hd dm-label">Receipt</div>
      <div class="ln" style="--d: .1s"><span class="dm-label dm-soft">Date</span><span class="mono">22.05.2010</span></div>
      <div class="rule" />
      <div class="ln item" style="--d: .5s"><span class="blank" /><span class="mono">× 2</span><span v-if="egg" class="flag dm-display">{{ egg }}</span></div>
      <div class="rule" />
      <div class="ln total" style="--d: .8s"><span class="lbl">Total</span><span class="sum dm-num">10 000 ₿</span></div>
      <div class="ln" style="--d: 1s"><span class="dm-label dm-soft">≈ $41</span><span class="dm-label dm-soft">BTC</span></div>
      <div v-if="egg" class="ln" style="--d: 1.2s"><span class="dm-label dm-soft"><b class="key">{{ egg }}</b> = taxable item</span></div>
    </div>
  </div>
</template>

<style scoped>
.paper {
  background: var(--dm-white); border: 2.5px solid var(--dm-ink); border-bottom-style: dashed;
  padding: .55rem .7rem .7rem; display: flex; flex-direction: column; gap: .35rem;
}
.hd { text-align: center; font-size: .6rem; letter-spacing: .2em; }
.dm-label { font-size: .55rem; }
.ln { display: flex; justify-content: space-between; align-items: center; gap: .6rem; opacity: 0; transform: translateY(-4px); transition: opacity .3s var(--dm-ease) var(--d), transform .3s var(--dm-ease) var(--d); }
.on .ln { opacity: 1; transform: none; }
.mono { font-family: var(--dm-mono); font-weight: 700; font-size: .75rem; color: var(--dm-ink); }
.rule { border-top: 2px dashed var(--dm-ink); }
.blank { display: block; flex: 1; height: .9rem; border: 2px solid var(--dm-ink); background: repeating-linear-gradient(-45deg, var(--dm-ink-soft) 0 1.5px, transparent 1.5px 5px); }
.flag { display: grid; place-items: center; width: 1.5rem; height: 1.5rem; background: var(--dm-red); color: var(--dm-white); font-size: 1.2rem; line-height: 1; }
.on .flag { animation: rc-print 2.8s steps(1) 1.4s infinite; }
@keyframes rc-print { 0%, 88% { transform: none; } 90% { transform: translateX(1px); } 93% { transform: translateX(-1px); } }
.key { color: var(--dm-red); }
.total { color: var(--dm-red); }
.total .lbl { font-family: var(--dm-mono); font-weight: 700; font-size: .6rem; text-transform: uppercase; letter-spacing: .06em; }
.sum { font-family: var(--dm-display); font-weight: 900; font-size: 1.35rem; letter-spacing: -.02em; }
</style>
