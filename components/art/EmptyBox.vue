<script setup lang="ts">
// Q: Null reference. A billion-dollar price tag hanging on an Optional<T> box that holds nothing,
// and a crimson pointer aimed into the empty interior. The pointer draws on slide enter.
// Egg: the shipping sticker slapped on the box gives its size, with one size ticked in crimson.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// the sticker lists sizes around the secret letter: S M L, or neighbours of any other letter
const sizes = props.egg === 'L' || !props.egg ? ['S', 'M', 'L'] : ['S', props.egg, 'XL']
</script>

<template>
  <div class="eb" :class="{ on: active }">
    <div class="tag"><span class="hole" /><span class="price dm-num">$1 000 000 000</span></div>
    <div class="stage">
      <div class="ref"><span class="dm-label dm-soft">ref</span><span class="cell" /></div>
      <svg class="ptr" viewBox="0 0 60 40" preserveAspectRatio="none">
        <defs>
          <marker id="emptybox-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill="var(--dm-red)" />
          </marker>
        </defs>
        <path d="M2 20 H54" class="line" pathLength="1" marker-end="url(#emptybox-head)" />
      </svg>
      <div class="box">
        <div class="lbl">Optional&lt;T&gt;</div>
        <div v-if="egg" class="sticker">
          <span class="dm-label">Size</span>
          <span v-for="z in sizes" :key="z" class="sz" :class="{ me: z === egg }">{{ z }}</span>
        </div>
        <div class="inside"><span class="dm-label dm-soft">empty</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eb { display: flex; flex-direction: column; gap: .7rem; }
.tag { align-self: flex-start; display: flex; align-items: center; gap: .45rem; border: 2.5px solid var(--dm-ink); padding: .25rem .6rem .25rem .4rem; transform: rotate(-4deg); }
.hole { width: .4rem; height: .4rem; border: 2px solid var(--dm-ink); }
.price { font-family: var(--dm-display); font-weight: 900; font-size: 1.05rem; letter-spacing: -.02em; color: var(--dm-ink); }
.stage { display: flex; align-items: center; }
.ref { display: flex; flex-direction: column; align-items: center; gap: .15rem; }
.ref .dm-label { font-size: .55rem; }
.cell { width: 1.4rem; height: 1.4rem; border: 2.5px solid var(--dm-ink); display: grid; place-items: center; }
.cell::after { content: ''; width: .4rem; height: .4rem; background: var(--dm-red); }
.ptr { width: 2.8rem; height: 2rem; flex: none; overflow: visible; }
.line { fill: none; stroke: var(--dm-red); stroke-width: 3; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .7s var(--dm-ease) .3s; }
.on .line { stroke-dashoffset: 0; }
.box { flex: 1; border: 3px solid var(--dm-ink); }
.lbl { background: var(--dm-ink); color: var(--dm-white); font-family: var(--dm-mono); font-weight: 700; font-size: .62rem; padding: .2rem .45rem; }
.inside { margin: .45rem; height: 4.5rem; border: 2px dashed var(--dm-ink-soft); display: grid; place-items: center; }
.inside .dm-label { font-size: .55rem; }
.box { position: relative; }
.sticker {
  position: absolute; right: -.5rem; bottom: -.7rem; display: flex; align-items: center; gap: .25rem;
  background: var(--dm-white); border: 2px solid var(--dm-ink); padding: .2rem .3rem; rotate: -5deg;
  opacity: 0; transform: scale(1.8);
}
.on .sticker { animation: eb-slap .45s var(--dm-ease) 1.1s forwards, eb-peel 3.2s ease-in-out 2s infinite; }
.sticker .dm-label { font-size: .48rem; color: var(--dm-ink-soft); }
.sz { font-family: var(--dm-mono); font-weight: 700; font-size: .62rem; color: var(--dm-ink-soft); }
.sz.me { display: grid; place-items: center; min-width: 1.5rem; height: 1.5rem; background: var(--dm-red); color: var(--dm-white); font-family: var(--dm-display); font-weight: 900; font-size: 1.25rem; }
@keyframes eb-slap { 0% { opacity: 0; transform: scale(1.8); } 70% { opacity: 1; transform: scale(.94); } 100% { opacity: 1; transform: none; } }
@keyframes eb-peel { 0%, 100% { opacity: 1; transform: none; } 50% { opacity: 1; transform: rotate(3deg) translateY(-1px); } }
</style>
