<script setup lang="ts">
// The poster's headline: huge words stacked with crushed leading,
// with an optional red engraving image sitting *between* the lines (z-index trick).
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  words: string[]
  size?: string        // CSS font-size, e.g. '8rem'
  image?: string       // e.g. '/brain.png' (transparent PNG)
  imageClass?: string
  align?: 'left' | 'center' | 'justify'
  red?: number[]       // indexes of words to set in crimson
}>(), { size: '7.5rem', align: 'justify', red: () => [] })

// Crushed leading (.8) makes Romanian marks collide between lines: Ă Â Î carry a mark above
// the cap height, Ș Ț a comma below the baseline. Open the gap only where a mark actually sits.
const ABOVE = /[ĂÂÎăâî]/
const BELOW = /[ȘȚşţșțŞŢ]/
const rows = computed(() => props.words.map((w, i) => ({
  w,
  gap: i === 0 ? 0 : 0.08 + (ABOVE.test(w) ? 0.14 : 0) + (BELOW.test(props.words[i - 1]) ? 0.42 : 0),
})))
</script>

<template>
  <div class="stack" :class="`a-${align}`" :style="{ fontSize: size }">
    <img v-if="image" :src="image" class="img" :class="imageClass" alt="">
    <div
      v-for="(r, i) in rows" :key="i" class="word dm-display"
      :class="{ red: red.includes(i) }" :style="{ marginTop: `${r.gap}em` }"
    >
      <span>{{ r.w }}</span>
    </div>
  </div>
</template>

<style scoped>
.stack { position: relative; display: flex; flex-direction: column; }
.word { position: relative; z-index: 2; color: var(--dm-ink); white-space: nowrap; }
.red { color: var(--dm-red); }
.a-center .word { text-align: center; }
.a-justify .word span { display: flex; justify-content: space-between; }
.img { position: absolute; left: 50%; top: 52%; width: 118%; height: 118%; translate: -50% -50%; object-fit: contain; z-index: 1; mix-blend-mode: multiply; pointer-events: none; }
</style>
