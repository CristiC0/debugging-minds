<script setup lang="ts">
// Q: Polygons. A low-poly sphere as a triangle wireframe; edges draw in on slide enter
// and one face fills crimson. Egg: a second, low-poly mesh object, the letter itself built from
// crimson triangles, turning on a model-viewer turntable in front of the sphere.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const LAT = 6
const LON = 10
const tilt = 0.4
const spin = 0.25
const pt = (i: number, j: number) => {
  const th = (i / LAT) * Math.PI
  const ph = (j / LON) * Math.PI * 2 + spin
  const x = Math.sin(th) * Math.cos(ph)
  const y0 = Math.cos(th)
  const z0 = Math.sin(th) * Math.sin(ph)
  return { x, y: y0 * Math.cos(tilt) - z0 * Math.sin(tilt), z: y0 * Math.sin(tilt) + z0 * Math.cos(tilt) }
}
const tris: { d: string, z: number, cx: number, cy: number }[] = []
for (let i = 0; i < LAT; i++) {
  for (let j = 0; j < LON; j++) {
    const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1)
    const faces = i === 0 ? [[a, b, c]] : i === LAT - 1 ? [[a, b, d]] : [[a, b, c], [a, c, d]]
    for (const f of faces) {
      const z = (f[0].z + f[1].z + f[2].z) / 3
      if (z <= 0.05) continue
      const P = f.map(p => [100 + 84 * p.x, 100 - 84 * p.y])
      tris.push({
        d: P.map(p => p.map(n => n.toFixed(1)).join(',')).join(' '), z,
        cx: (P[0][0] + P[1][0] + P[2][0]) / 3, cy: (P[0][1] + P[1][1] + P[2][1]) / 3,
      })
    }
  }
}
tris.sort((p, q) => p.cy - q.cy)
const key = tris.reduce((best, t, k) =>
  Math.hypot(t.cx - 122, t.cy - 82) < Math.hypot(tris[best].cx - 122, tris[best].cy - 82) ? k : best, 0)
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// The R glyph on a 10×14 grid, triangulated by hand (the counter stays open).
const rTris = [
  [[0, 0], [3, 0], [0, 14]], [[3, 0], [3, 14], [0, 14]],
  [[3, 0], [7, 0], [3, 3]], [[7, 0], [6, 3], [3, 3]], [[7, 0], [10, 3], [6, 3]],
  [[10, 3], [7, 4], [6, 3]], [[10, 3], [10, 6], [7, 4]], [[7, 4], [10, 6], [6, 5.5]], [[10, 6], [7, 8], [6, 5.5]],
  [[3, 5.5], [6, 5.5], [3, 8.5]], [[6, 5.5], [7, 8], [3, 8.5]],
  [[3, 8.5], [7, 8], [10, 14]], [[3, 8.5], [10, 14], [6.5, 14]],
].map(t => t.map(p => p.join(',')).join(' '))
const showKey = !props.egg
</script>

<template>
  <div class="mesh" :class="{ on: active }">
    <div class="sv">
    <svg viewBox="0 0 200 200">
      <polygon
        v-for="(t, k) in tris" :key="k" :points="t.d" pathLength="1"
        class="tri" :class="{ key: showKey && k === key }" :style="{ transitionDelay: `${k * 14}ms` }"
      />
    </svg>
    <svg v-if="egg" class="glyph" viewBox="-1 -1 12 16">
      <polygon v-for="(t, k) in rTris" :key="k" :points="t" class="gt" :style="{ transitionDelay: `${1 + k * 0.06}s` }" />
    </svg>
    </div>
    <div class="dm-label cap"><span>tris: 1 024</span><span>verts: 514</span></div>
  </div>
</template>

<style scoped>
.mesh { display: flex; flex-direction: column; gap: .3rem; }
svg { width: 100%; max-height: 13rem; }
.tri {
  fill: transparent; stroke: var(--dm-ink); stroke-width: 1.6; stroke-linejoin: miter;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  transition: stroke-dashoffset .6s var(--dm-ease), fill .4s ease 1.2s;
}
.on .tri { stroke-dashoffset: 0; }
.on .tri.key { fill: var(--dm-red); }
.cap { display: flex; justify-content: space-between; font-size: .56rem; color: var(--dm-ink-soft); border-top: 2px solid var(--dm-ink); padding-top: .25rem; }
.sv { position: relative; perspective: 30rem; }
.glyph { position: absolute; width: 38%; max-height: none; left: 58%; top: 42%; overflow: visible; }
.on .glyph { animation: wm-turn 4.5s ease-in-out 1.8s infinite; }
.gt { fill: var(--dm-red); stroke: var(--dm-paper); stroke-width: .28; stroke-linejoin: round; opacity: 0; transition: opacity .25s steps(2); }
.on .gt { opacity: 1; }
@keyframes wm-turn { 0%, 100% { transform: rotateY(-38deg) rotateX(6deg); } 50% { transform: rotateY(38deg) rotateX(-6deg); } }
</style>
