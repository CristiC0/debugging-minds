<script setup lang="ts">
// Q: Python. A 1969 TV set tuned to a comedy sketch show: the crimson stage curtain
// parts on slide enter, then stays still. No snake, no group name.
// Egg: the sketch on stage is a letter doing a very silly walk, high kicks included, from one wing to the other.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
</script>

<template>
  <div class="tv" :class="{ on: active }">
    <svg class="ant" viewBox="0 0 100 18" preserveAspectRatio="none">
      <line x1="50" y1="18" x2="30" y2="1" />
      <line x1="50" y1="18" x2="72" y2="2" />
    </svg>
    <div class="set">
      <div class="screen">
        <div class="stage">
          <div class="spot dm-label">Sketch 01</div>
          <span v-if="egg" class="walker">
            <span class="wl dm-display">{{ egg }}</span>
            <span class="leg l1" /><span class="leg l2" />
          </span>
          <div class="floor" />
        </div>
        <div class="curtain l" />
        <div class="curtain r" />
        <div class="pelmet" />
      </div>
      <div class="panel">
        <span class="knob" /><span class="knob" />
        <span class="grille" />
      </div>
    </div>
    <div class="legs"><span /><span /></div>
    <div class="cap">
      <span class="dm-label">BBC · 1969 · Sketch 01</span>
      <span class="en">Comedy show</span>
    </div>
  </div>
</template>

<style scoped>
.tv { display: flex; flex-direction: column; }
.ant { width: 40%; height: 18px; align-self: center; }
.ant line { stroke: var(--dm-ink); stroke-width: 2.5; vector-effect: non-scaling-stroke; }
.set { display: flex; gap: .45rem; border: 3px solid var(--dm-ink); padding: .5rem; background: var(--dm-paper-2); }
.screen { position: relative; flex: 1; height: 7.2rem; overflow: hidden; border: 2.5px solid var(--dm-ink); background: var(--dm-paper); }
.stage { position: absolute; inset: 0; display: grid; place-items: center; }
.tv:has(.walker) .stage { place-items: start center; padding-top: 1.05rem; }
.spot { font-size: .56rem; border: 2px solid var(--dm-ink); padding: .15rem .35rem; }
.floor { position: absolute; left: 0; right: 0; bottom: 0; height: 1.1rem; border-top: 2.5px solid var(--dm-ink); background: var(--dm-paper-2); }
.pelmet { position: absolute; left: 0; right: 0; top: 0; height: .7rem; background: var(--dm-ink); }
.curtain {
  position: absolute; top: 0; bottom: 0; width: 50%; background-color: var(--dm-red);
  background-image: repeating-linear-gradient(90deg, transparent 0 9px, var(--dm-red-deep) 9px 11px);
  transition: transform 1.2s var(--dm-ease) .3s;
}
.curtain.l { left: 0; } .curtain.r { right: 0; }
.on .curtain.l { transform: translateX(-68%); }
.on .curtain.r { transform: translateX(68%); }
.panel { width: 1.6rem; display: flex; flex-direction: column; align-items: center; gap: .4rem; }
.knob { width: .9rem; height: .9rem; border: 2.5px solid var(--dm-ink); }
.grille { flex: 1; width: 100%; background: repeating-linear-gradient(0deg, var(--dm-ink) 0 2px, transparent 2px 5px); }
.legs { display: flex; justify-content: space-between; padding: 0 1.2rem; }
.legs span { width: 3px; height: .6rem; background: var(--dm-ink); }
.cap { display: flex; flex-direction: column; gap: .2rem; margin-top: .35rem; }
.cap .dm-label { font-size: .56rem; color: var(--dm-ink-soft); }
.cap :deep(.bi) { gap: 0; }
.cap :deep(.ro) { font-size: .72rem; }
.cap :deep(.ru) { font-size: .62rem; }
.walker { position: absolute; bottom: 1.1rem; left: 0; width: 1.7rem; height: 2.55rem; z-index: 0; translate: -100% 0; }
.on .walker { animation: cr-walk 6s linear 1.4s infinite; }
.wl { position: absolute; left: 0; right: 0; top: 0; text-align: center; color: var(--dm-red); font-size: 2.1rem; line-height: .8; }
.on .wl { animation: cr-bob .5s ease-in-out 1.4s infinite alternate; }
.leg { position: absolute; top: 1.6rem; width: 3px; height: .95rem; background: var(--dm-ink); transform-origin: 50% 0; }
.l1 { left: .45rem; }
.l2 { right: .45rem; }
.on .l1 { animation: cr-step .5s ease-in-out 1.4s infinite alternate; }
.on .l2 { animation: cr-kick 1s var(--dm-ease) 1.4s infinite; }
@keyframes cr-walk { from { left: 0; } to { left: calc(100% + 1.7rem); } }
@keyframes cr-bob { from { transform: translateY(0); } to { transform: translateY(-.15rem); } }
@keyframes cr-step { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
@keyframes cr-kick { 0%, 30% { transform: rotate(10deg); } 55%, 70% { transform: rotate(-100deg); } 100% { transform: rotate(10deg); } }
.en { font-weight: 700; font-size: .72rem; }
</style>
