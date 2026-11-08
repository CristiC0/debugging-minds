<script setup lang="ts">
// Q: Heartbleed. A request that claims 16 KB but sends 1 byte, and the server's memory spilling back.
// Leaked rows appear one by one on slide enter.
// Egg: one more leaked row starts with the secret letter; its byte is boxed in crimson in both
// the hex and the ASCII column (e.g. 0x48 = H).
import { onUnmounted, ref, watch } from 'vue'
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const leak = [
  '\x02\x40\x00\xd8\x03\x02SC[\x90\x9d\x9br\x0b\xbc\x0c',
  'user=admin&pwd=h',
  'unter2\r\nCookie: ',
  'session=8f3a9e1c',
  '-----BEGIN RSA P',
  'RIVATE KEY-----\n',
]
const props = defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
if (props.egg) leak.push(`${props.egg}TTP/1.1 200 OK\r`.slice(0, 16))
const rows = leak.map((s, i) => ({
  off: (i * 16).toString(16).padStart(4, '0'),
  hex: [...s].map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0')).join(' '),
  ascii: [...s].map(ch => (ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) < 127 ? ch : '.')).join(''),
}))

const shown = ref(0)
let t: ReturnType<typeof setInterval> | undefined
watch(active, (a) => {
  clearInterval(t)
  shown.value = 0
  if (a) t = setInterval(() => { if (++shown.value >= rows.length) clearInterval(t) }, 260)
}, { immediate: true })
onUnmounted(() => clearInterval(t))
</script>

<template>
  <div class="hex">
    <div class="req">
      <div class="dm-label dm-soft">Request</div>
      <div class="mono">18 03 02 00 03 <b>01</b> <b class="dm-red">40 00</b></div>
      <div class="dm-label note"><span class="dm-red">length 0x4000</span> · sent 1 byte</div>
    </div>
    <div class="dump">
      <div class="dm-label dm-soft">Response</div>
      <div v-for="(r, i) in rows" :key="r.off" class="line mono" :class="{ on: i < shown, leak: i > 0 }">
        <span class="off">{{ r.off }}</span>
        <template v-if="egg && i === rows.length - 1">
          <span class="bytes"><b class="hit">{{ r.hex.slice(0, 2) }}</b>{{ r.hex.slice(2) }}</span>
          <span class="ascii"><b class="hit big">{{ r.ascii[0] }}</b>{{ r.ascii.slice(1) }}</span>
        </template>
        <template v-else>
          <span class="bytes">{{ r.hex }}</span>
          <span class="ascii">{{ r.ascii }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hex { display: grid; grid-template-columns: 13rem 1fr; gap: 1.6rem; padding: .55rem 0; border-bottom: 2px solid var(--dm-ink); }
.mono { font-family: var(--dm-mono); font-size: .62rem; line-height: 1.5; white-space: pre; }
.req .mono { font-size: .8rem; margin-top: .3rem; }
.note { font-size: .52rem; margin-top: .3rem; color: var(--dm-ink-soft); }
.line { display: flex; gap: 1rem; opacity: 0; transform: translateX(-6px); transition: opacity .3s ease-out, transform .3s ease-out; }
.line.on { opacity: 1; transform: none; }
.off { color: var(--dm-ink-soft); }
.bytes { color: var(--dm-ink); }
.ascii { font-weight: 700; }
.leak .ascii { color: var(--dm-red); }
.hit { background: var(--dm-red); color: var(--dm-white); padding: 0 .1em; }
.hit.big { display: inline-block; font-family: var(--dm-display); font-weight: 900; font-size: 1.15rem; line-height: .95; padding: 0 .15em; margin-right: .1em; vertical-align: -.15em; }
.line.on .hit.big { animation: hl-glitch 2.4s steps(1) 2s infinite; }
@keyframes hl-glitch { 0%, 86%, 100% { transform: none; } 88% { transform: translate(2px, -1px) skewX(10deg); } 92% { transform: translate(-2px, 1px); } }
</style>
