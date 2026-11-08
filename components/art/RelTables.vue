<script setup lang="ts">
// Q: PostgreSQL. Two relational tables, students and grades, tied by a foreign key;
// the key line draws in crimson on slide enter. No product name, no mascot.
// Egg: the grades.mark column holds a value, a crimson grade letter called out like a query result.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const W = 104
const RH = 15
const tables = [
  { name: 'students', x: 4, y: 6, cols: [['id', 'PK'], ['name', ''], ['group', '']] },
  { name: 'grades', x: 92, y: 104, cols: [['id', 'PK'], ['student_id', 'FK'], ['course', ''], ['mark', '']] },
]
const isKey = (t: number, c: number) => (t === 0 && c === 0) || (t === 1 && c === 1)
// students.id (left edge, row 1) → grades.student_id (left edge, row 2)
const y1 = 6 + RH * 1.5
const y2 = 104 + RH * 2.5
const fk = `M 4 ${y1} H -4 V ${y2} H 92`
defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
// mark row of grades (4th column): y = 104 + RH * 4
const markY = 104 + RH * 4
</script>

<template>
  <div class="rel" :class="{ on: active }">
    <div class="sv">
    <svg viewBox="-10 0 244 184" font-family="JetBrains Mono, monospace">
      <path :d="fk" pathLength="1" class="fk" />
      <g v-for="(t, ti) in tables" :key="t.name">
        <rect :x="t.x" :y="t.y" :width="W" :height="RH * (t.cols.length + 1)" class="card" />
        <rect :x="t.x" :y="t.y" :width="W" :height="RH" class="hd" />
        <text :x="t.x + 6" :y="t.y + 10.5" style="font-size: 8.5px" font-weight="700" class="hd-t">{{ t.name }}</text>
        <g v-for="(c, ci) in t.cols" :key="c[0]">
          <line :x1="t.x" :x2="t.x + W" :y1="t.y + RH * (ci + 1)" :y2="t.y + RH * (ci + 1)" class="sep" />
          <text :x="t.x + 6" :y="t.y + RH * (ci + 1) + 10.5" style="font-size: 8px" :class="{ key: isKey(ti, ci) }">{{ c[0] }}</text>
          <text :x="t.x + W - 6" :y="t.y + RH * (ci + 1) + 10.5" style="font-size: 6.5px" text-anchor="end" class="tag" :class="{ key: isKey(ti, ci) }">{{ c[1] }}</text>
        </g>
      </g>
      <g v-if="egg" class="val">
        <line :x1="92 + W" :x2="204" :y1="markY + RH / 2" :y2="markY + RH / 2" class="lead" />
        <rect x="204" :y="markY - 9" width="28" height="33" class="vbox" />
        <text x="218" :y="markY + 18" text-anchor="middle" class="vtxt">{{ egg }}</text>
      </g>
    </svg>
    </div>
    <div class="dm-label cap">REFERENCES students(id) · foreign key</div>
  </div>
</template>

<style scoped>
.rel { display: flex; flex-direction: column; gap: .3rem; }
svg { width: 100%; }
.card { fill: var(--dm-paper); stroke: var(--dm-ink); stroke-width: 2.5; }
.hd { fill: var(--dm-ink); }
.hd-t { fill: var(--dm-white); }
.sep { stroke: var(--dm-ink); stroke-width: 1; }
text { fill: var(--dm-ink); }
.tag { fill: var(--dm-ink-soft); }
text.key { fill: var(--dm-red); font-weight: 700; }
.fk {
  fill: none; stroke: var(--dm-red); stroke-width: 2.5;
  stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1s var(--dm-ease) .3s;
}
.on .fk { stroke-dashoffset: 0; }
.cap { font-size: .52rem; color: var(--dm-ink-soft); line-height: 1.4; }
.sv { position: relative; }
.lead { stroke: var(--dm-red); stroke-width: 2; stroke-dasharray: 3 2; }
.vbox { fill: var(--dm-red); }
text.vtxt { fill: var(--dm-white); font-family: var(--dm-display); font-weight: 900; font-size: 27px; }
.val { opacity: 0; transition: opacity .3s steps(2) 1.3s; }
.on .val { opacity: 1; }
.on .vbox { animation: rt-sel 2.4s steps(1) 1.6s infinite; }
@keyframes rt-sel { 0%, 80% { fill: var(--dm-red); } 85% { fill: var(--dm-red-deep); } 90% { fill: var(--dm-red); } 95% { fill: var(--dm-red-deep); } }
</style>
