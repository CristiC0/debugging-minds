<script setup lang="ts">
// Q: Cassandra. A Greek meander (the myth) over a token ring (the database):
// a key hashes to one node and is replicated to the next two.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const N = 8
const nodes = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2
  return { x: 100 + 68 * Math.cos(a), y: 100 + 68 * Math.sin(a) }
})
const owner = 1
const replicas = [2, 3]
</script>

<template>
  <div class="hashring" :class="{ on: active }">
    <svg class="meander" viewBox="0 0 126 14" preserveAspectRatio="none">
      <defs>
        <pattern id="mea" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 12.5 H12.5 V1.5 H3.5 V9.5 H9.5 V5" fill="none" stroke="currentColor" stroke-width="1.8" />
        </pattern>
      </defs>
      <rect width="126" height="14" fill="url(#mea)" />
    </svg>
    <svg viewBox="0 0 200 200" class="disc">
      <circle cx="100" cy="100" r="68" class="track" />
      <line x1="184" y1="22" :x2="nodes[owner].x" :y2="nodes[owner].y" class="key-line" />
      <rect x="178" y="16" width="12" height="12" class="key" />
      <rect
        v-for="(n, i) in nodes" :key="i" :x="n.x - 9" :y="n.y - 9" width="18" height="18"
        class="node" :class="{ owner: i === owner, rep: replicas.includes(i) }"
        :style="{ transitionDelay: `${i * 60}ms` }"
      />
    </svg>
    <div class="cap dm-label dm-soft">token ring · RF = 3</div>
  </div>
</template>

<style scoped>
.hashring { display: flex; flex-direction: column; gap: .4rem; }
.meander { width: 100%; height: 14px; color: var(--dm-ink); }
.disc { width: 100%; }
.track { fill: none; stroke: var(--dm-ink); stroke-width: 3; }
.node { fill: var(--dm-ink); stroke: var(--dm-paper); stroke-width: 3; opacity: 0; transition: opacity .4s var(--dm-ease); }
.on .node { opacity: 1; }
.node.owner { fill: var(--dm-red); }
.node.rep { fill: var(--dm-paper); stroke: var(--dm-red); stroke-width: 3; }
.key { fill: var(--dm-red); }
.key-line { stroke: var(--dm-red); stroke-width: 2; stroke-dasharray: 4 4; }
.cap { text-align: right; font-size: .58rem; }
</style>
