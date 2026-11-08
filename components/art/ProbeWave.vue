<script setup lang="ts">
// Q: Heisenbug. A signal with a glitch spike; a crimson breakpoint probe drops onto it on slide enter,
// and under the probe the glitch is gone: observing it makes it vanish.
// Egg: a bug with the secret letter on its shell crawls along the signal and disappears exactly
// while it is under the probe, then turns up again on the other side.
import { onUnmounted, ref, watch } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const wave = (from: number, to: number) => {
  const pts: string[] = []
  for (let x = from; x <= to; x += 4) pts.push(`${x},${60 + 18 * Math.sin(x / 12)}`)
  return pts.join(' ')
}
const left = wave(4, 96)
const right = wave(136, 236)
const y = (x: number) => 60 + 18 * Math.sin(x / 12)
const spike = `M96 ${y(96)} L104 ${y(104)} L110 8 L116 112 L122 ${y(122)} L136 ${y(136)}`
const flat = `M96 ${y(96)} C108 ${y(96) + 14} 124 ${y(136) - 10} 136 ${y(136)}`
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// the route: left wave, the smoothed part under the probe, right wave
const route = `M${left.split(' ').join(' L')} ${flat.replace(/^M[^C]+/, '')} L${right.split(' ').join(' L')}`
const track = ref<SVGPathElement>()
const bug = ref({ x: 4, y: 60, a: 0, o: 0 })
let raf = 0
watch(active, (a) => {
  cancelAnimationFrame(raf)
  if (!a || !props.egg) return
  const t0 = performance.now()
  const loop = (now: number) => {
    const p = track.value
    if (p) {
      const L = p.getTotalLength()
      const f = ((now - t0) / 7000) % 1
      const pt = p.getPointAtLength(f * L)
      const nx = p.getPointAtLength(Math.min(L, f * L + 2))
      // invisible while observed (under the probe at x≈116), fading at the route ends
      const seen = Math.min(1, Math.abs(pt.x - 116) / 10 - 1.2)
      const ends = Math.min(1, pt.x / 14, (238 - pt.x) / 14)
      bug.value = { x: pt.x, y: pt.y, a: Math.atan2(nx.y - pt.y, nx.x - pt.x) * 180 / Math.PI, o: Math.max(0, Math.min(seen, ends)) }
    }
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
}, { immediate: true })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <div class="pw" :class="{ on: active }">
    <div class="sv">
    <svg viewBox="0 0 240 130" class="sig">
      <line x1="0" y1="60" x2="240" y2="60" class="axis" />
      <polyline :points="left" class="w" />
      <polyline :points="right" class="w" />
      <path :d="spike" class="spike" />
      <path :d="flat" class="w flat" />
      <path v-if="egg" ref="track" :d="route" class="route" />
      <g v-if="egg" :transform="`translate(${bug.x} ${bug.y})`" :opacity="bug.o">
        <g :transform="`rotate(${bug.a})`" class="crit">
          <path d="M-8 -9 L-13 -16 M0 -11 L0 -19 M8 -9 L13 -16 M-8 9 L-13 16 M0 11 L0 19 M8 9 L13 16" class="legs" />
          <rect x="11" y="-6" width="9" height="12" class="head" />
          <path d="M19 -4 L25 -9 M19 4 L25 9" class="legs" />
          <rect x="-15" y="-12" width="28" height="24" class="shell" />
        </g>
        <text x="-1" y="9" text-anchor="middle" class="bl">{{ egg }}</text>
      </g>
      <g class="probe">
        <line x1="116" y1="0" x2="116" y2="126" />
        <rect x="109" y="0" width="14" height="14" />
      </g>
    </svg>
    </div>
    <div class="cap dm-label"><span class="dm-red">● breakpoint</span></div>
  </div>
</template>

<style scoped>
.pw { display: flex; flex-direction: column; gap: .3rem; }
.sig { width: 100%; overflow: visible; }
.axis { stroke: var(--dm-rule); stroke-width: 2; stroke-dasharray: 4 4; }
.w { fill: none; stroke: var(--dm-ink); stroke-width: 2.5; }
.spike { fill: none; stroke: var(--dm-ink); stroke-width: 2.5; transition: opacity .5s var(--dm-ease) .9s; }
.flat { opacity: 0; transition: opacity .5s var(--dm-ease) .9s; }
.on .spike { opacity: .12; }
.on .flat { opacity: 1; }
.probe line { stroke: var(--dm-red); stroke-width: 3; }
.probe rect { fill: var(--dm-red); }
.probe { transform: translateY(-40px); opacity: 0; transition: transform .6s var(--dm-ease) .2s, opacity .3s .2s; }
.on .probe { transform: none; opacity: 1; }
.cap { display: flex; justify-content: space-between; font-size: .55rem; }
.sv { position: relative; }
.route { fill: none; stroke: none; }
.shell { fill: var(--dm-red); stroke: var(--dm-ink); stroke-width: 2; }
.head { fill: var(--dm-ink); }
.legs { stroke: var(--dm-ink); stroke-width: 2.4; fill: none; animation: pw-legs .18s steps(2) infinite alternate; transform-box: fill-box; transform-origin: center; }
.bl { fill: var(--dm-white); font-family: var(--dm-display); font-weight: 900; font-size: 24px; }
@keyframes pw-legs { from { transform: scaleX(.8); } to { transform: scaleX(1.1); } }
</style>
