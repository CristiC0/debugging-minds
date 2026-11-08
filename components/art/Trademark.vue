<script setup lang="ts">
// Q: Oracle. A trademark register card for JavaScript™ with the current owner redacted,
// a giant ® and a "contested" stamp.
// Egg: the card is evidence in the dispute, so a court exhibit sticker is slapped on its corner.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
</script>

<template>
  <div class="tm" :class="{ on: active }">
    <div class="card">
      <div class="r dm-display">®</div>
      <div class="row"><span class="dm-label dm-soft">Trademark</span><b>JavaScript™</b></div>
      <div class="row"><span class="dm-label dm-soft">Owner</span><span>Sun Microsystems</span></div>
      <div class="row"><span class="dm-label dm-soft">2010 →</span><span class="redact" /></div>
    </div>
    <Stamp v-if="active" class="stamp" ro="Disputed" ru="" :rotate="-8" />
    <div v-if="egg" class="exh">
      <span class="dm-label">Exhibit</span>
      <span class="el dm-display">{{ egg }}</span>
    </div>
  </div>
</template>

<style scoped>
.tm { position: relative; padding-bottom: 2.6rem; }
.card { position: relative; border: 2.5px solid var(--dm-ink); padding: .6rem .7rem; display: flex; flex-direction: column; gap: .45rem; }
.r { position: absolute; right: .35rem; top: .1rem; font-size: 3.6rem; line-height: .8; }
.row { display: flex; flex-direction: column; gap: .05rem; font-size: .88rem; font-weight: 600; }
.row .dm-label { font-size: .55rem; }
.redact { display: block; height: 1.05rem; width: 0; background: var(--dm-red); transition: width .7s var(--dm-ease) .3s; }
.on .redact { width: 85%; }
.stamp { position: absolute; right: .4rem; bottom: 0; }
.stamp :deep(.ro) { font-size: 1.1rem; }
.stamp :deep(.ru) { font-size: .62rem; }
.exh {
  position: absolute; left: .3rem; bottom: -.1rem; display: flex; flex-direction: column; align-items: center;
  background: var(--dm-white); border: 2.5px solid var(--dm-ink); padding: .15rem .45rem .2rem; rotate: 4deg; opacity: 0;
}
.on .exh { animation: tm-slap .45s var(--dm-ease) 1.3s forwards, tm-flap 3s ease-in-out 2.2s infinite; }
.exh .dm-label { font-size: .46rem; letter-spacing: .14em; border-bottom: 2px solid var(--dm-ink); padding-bottom: .05rem; }
.el { color: var(--dm-red); font-size: 2rem; line-height: .9; }
@keyframes tm-slap { 0% { opacity: 0; transform: scale(1.8) rotate(-10deg); } 70% { opacity: 1; transform: scale(.94); } 100% { opacity: 1; transform: none; } }
@keyframes tm-flap { 0%, 100% { opacity: 1; transform: none; } 50% { opacity: 1; transform: rotate(-3deg); } }
</style>
