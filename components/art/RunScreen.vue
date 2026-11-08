<script setup lang="ts">
// Q: Doom. A tiny pixel screen on an unlikely device: "CAN IT RUN _ _ _ _?"
// The loading bar fills on slide enter, then the cursor blinks.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const devices = [['Frigider', 'Холодильник'], ['Termostat', 'Термостат'], ['Test de sarcină', 'Тест на беременность']]
</script>

<template>
  <div class="dev" :class="{ on: active }">
    <div class="body">
      <div class="screen">
        <div class="ln mono">C:\&gt; CAN IT RUN</div>
        <div class="blanks"><Blank :n="4" /><span class="q">?</span><span class="cur" /></div>
        <div class="load"><span class="fill" /></div>
      </div>
      <div class="knobs"><span /><span /><span class="r" /></div>
    </div>
    <ul class="list">
      <li v-for="d in devices" :key="d[0]"><ph-check-bold class="ic" /><Bi size="sm" :ro="d[0]" :ru="d[1]" /></li>
    </ul>
  </div>
</template>

<style scoped>
.body { border: 3px solid var(--dm-ink); padding: .55rem; background: var(--dm-paper-2); }
.screen {
  background-color: var(--dm-ink-deep); color: var(--dm-white); padding: .7rem .7rem .6rem;
  background-image: repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,.05) 2px 3px);
}
.mono { font-family: var(--dm-mono); font-weight: 700; font-size: .7rem; letter-spacing: .04em; }
.blanks { display: flex; align-items: flex-end; gap: .2rem; font-size: 1.7rem; margin-top: .3rem; }
.q { font-family: var(--dm-display); font-weight: 900; line-height: 1; }
.cur { width: .5rem; height: 1.2rem; background: var(--dm-white); margin-left: .2rem; animation: dm-pulse 1s steps(1) infinite; }
.load { height: 6px; background: rgba(255,255,255,.12); margin-top: .6rem; }
.fill { display: block; height: 100%; width: 0; background: var(--dm-red); transition: width 1.6s steps(12) .2s; }
.on .fill { width: 100%; }
.knobs { display: flex; gap: .35rem; margin-top: .45rem; }
.knobs span { width: .7rem; height: .7rem; border: 2px solid var(--dm-ink); }
.knobs .r { background: var(--dm-red); border-color: var(--dm-red); margin-left: auto; }
.list { list-style: none; padding: 0; margin: .7rem 0 0; display: flex; flex-direction: column; gap: .3rem; }
.list li { display: flex; align-items: flex-start; gap: .4rem; margin: 0; }
.list :deep(.bi) { gap: 0; }
.list :deep(.ro) { font-size: .72rem; }
.list :deep(.ru) { font-size: .62rem; }
.ic { color: var(--dm-red); flex: none; margin-top: .1rem; }
</style>
