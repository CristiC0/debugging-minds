<script setup lang="ts">
// Q: Trojan. A friendly installer window ("free, verified") with a dashed hatch underneath:
// on slide enter the hatch opens and the payload rows it was carrying appear, the last one crimson.
// Hint only: no horse, no "trojan" word anywhere.
// Egg: the keylogger row shows the keystroke it just captured: a crimson keycap being pressed.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const cargo = [
  { name: 'keylog.dll', note: 'hook' },
  { name: 'remote_shell', note: ':4444' },
  { name: 'upload → 185.66.x.x', note: 'passwords', bad: true },
]
defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
</script>

<template>
  <div class="wrap" :class="{ on: active }">
    <div class="win">
      <div class="bar">
        <span class="title">free_game_setup.exe</span>
        <span class="x">×</span>
      </div>
      <div class="body">
        <div class="ok"><ph-seal-check-bold /><span class="en">Free · safe</span></div>
        <div class="track"><span class="fill" /></div>
        <span class="btn"><span class="en">Install</span></span>
      </div>
    </div>
    <div class="hatch">
      <div v-for="(c, i) in cargo" :key="c.name" class="row" :class="{ bad: c.bad }" :style="{ transitionDelay: `${0.9 + i * 0.35}s` }">
        <span class="nm">{{ c.name }}</span>
        <span v-if="egg && i === 0" class="nt cap-row">captured <kbd class="kc dm-display">{{ egg }}</kbd></span>
        <span v-else class="nt">{{ c.note }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap { display: flex; flex-direction: column; }
.win { border: 2.5px solid var(--dm-ink); background: var(--dm-paper); }
.bar { display: flex; justify-content: space-between; align-items: center; padding: .3rem .45rem; background: var(--dm-ink); }
.title, .x { font-family: var(--dm-mono); font-size: .56rem; font-weight: 600; color: var(--dm-white); }
.body { display: flex; flex-direction: column; gap: .45rem; padding: .6rem .65rem .65rem; }
.ok { display: flex; align-items: center; gap: .3rem; font-size: .8rem; }
.ok :deep(.ro) { font-size: .66rem; } .ok :deep(.ru) { font-size: .6rem; }
.track { height: .5rem; border: 2px solid var(--dm-ink); }
.fill { display: block; height: 100%; width: 72%; background: var(--dm-ink); transform: scaleX(0); transform-origin: left; transition: transform 1s var(--dm-ease) .2s; }
.on .fill { transform: scaleX(1); }
.btn { align-self: flex-start; background: var(--dm-ink); padding: .25rem .6rem; }
.btn :deep(.ro), .btn :deep(.ru), .btn :deep(.dot) { color: var(--dm-white); }
.hatch { border: 2.5px dashed var(--dm-ink); border-top: 0; display: flex; flex-direction: column; padding: .2rem .45rem .35rem; gap: .1rem; }
.row {
  display: flex; justify-content: space-between; gap: .5rem; font-family: var(--dm-mono); font-size: .54rem; font-weight: 600;
  padding: .12rem 0; border-bottom: 1px solid var(--dm-rule); opacity: 0; transform: translateY(-4px);
  transition: opacity .35s var(--dm-ease), transform .35s var(--dm-ease);
}
.row:last-child { border-bottom: 0; }
.on .row { opacity: 1; transform: none; }
.nt { color: var(--dm-ink-soft); }
.bad .nm, .bad .nt { color: var(--dm-red); }
.en { font-size: .66rem; font-weight: 700; }
.btn .en { color: var(--dm-white); }
.row:first-child { align-items: center; }
.cap-row { display: flex; align-items: center; gap: .35rem; }
.kc {
  display: grid; place-items: center; width: 1.45rem; height: 1.35rem; box-sizing: border-box;
  background: var(--dm-red); color: var(--dm-white); border: 2px solid var(--dm-red-deep); border-bottom-width: 5px;
  font-size: .95rem; font-weight: 900; line-height: 1;
}
.on .kc { animation: hc-press 1.4s steps(1) 1.4s infinite; }
@keyframes hc-press { 0%, 60% { transform: none; border-bottom-width: 5px; } 65%, 80% { transform: translateY(3px); border-bottom-width: 2px; } }
</style>
