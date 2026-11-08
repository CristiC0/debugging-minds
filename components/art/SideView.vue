<script setup lang="ts">
// Q: Hamburger menu. A phone app whose three-line corner icon (crimson) has just been tapped:
// the side drawer slides in on slide enter. No food, no menu name.
// Egg: the drawer header shows the signed-in user's avatar, which is just their initial.
import { useReplay } from '../../composables/useReplay'

const active = useReplay()
const items = ['Home', 'Courses', 'Schedule', 'Grades']
defineProps<{ egg?: string }>()  // secret round-3 letter, see quiz-slides skill
</script>

<template>
  <div class="phone" :class="{ on: active }">
    <div class="notch" />
    <div class="app">
      <div class="top">
        <span class="lines"><i /><i /><i /></span>
        <span class="title dm-label">FMI · USM</span>
      </div>
      <div class="content">
        <span v-for="k in 6" :key="k" class="ph" :style="{ width: `${90 - (k % 3) * 18}%` }" />
      </div>
      <nav class="drawer">
        <div v-if="egg" class="me">
          <span class="ava dm-display">{{ egg }}</span>
          <span class="who"><i /><i /></span>
        </div>
        <div v-for="it in items" :key="it" class="row"><span class="en">{{ it }}</span></div>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.phone { width: 100%; max-width: 10.5rem; margin: 0 auto; border: 3px solid var(--dm-ink); padding: .5rem .35rem .7rem; background: var(--dm-paper-2); }
.notch { width: 2.4rem; height: .3rem; background: var(--dm-ink); margin: 0 auto .35rem; }
.app { position: relative; height: 13.9rem; overflow: hidden; border: 2px solid var(--dm-ink); background: var(--dm-paper); }
.top { position: relative; z-index: 2; display: flex; align-items: center; gap: .5rem; height: 1.7rem; padding: 0 .45rem; border-bottom: 2.5px solid var(--dm-ink); background: var(--dm-paper); }
.lines { display: flex; flex-direction: column; gap: 3px; }
.lines i { display: block; width: 1rem; height: 3px; background: var(--dm-red); }
.title { font-size: .54rem; }
.content { padding: .55rem .45rem; display: flex; flex-direction: column; gap: .45rem; }
.ph { height: .45rem; background: var(--dm-paper-2); }
.drawer {
  position: absolute; z-index: 1; left: 0; top: 1.7rem; bottom: 0; width: 76%;
  background: var(--dm-paper); border-right: 2.5px solid var(--dm-ink);
  transform: translateX(-102%); transition: transform .7s var(--dm-ease) .35s;
}
.on .drawer { transform: none; }
.row { padding: .3rem .45rem; border-bottom: 1px solid var(--dm-rule); }
.row :deep(.bi) { gap: 0; }
.row :deep(.ro) { font-size: .66rem; }
.row :deep(.ru) { font-size: .56rem; }
.en { font-weight: 700; font-size: .72rem; }
.me { display: flex; align-items: center; gap: .4rem; padding: .4rem .45rem; border-bottom: 2.5px solid var(--dm-ink); }
.ava { width: 1.9rem; height: 1.9rem; display: grid; place-items: center; background: var(--dm-red); color: var(--dm-white); font-size: 1.35rem; line-height: 1; transform: scale(0); transition: transform .35s var(--dm-ease) 1.05s; }
.on .ava { transform: none; animation: sv-wave 3s var(--dm-ease) 1.6s infinite; }
@keyframes sv-wave { 0%, 80%, 100% { transform: none; } 86% { transform: rotate(-10deg); } 92% { transform: rotate(8deg); } }
.who { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.who i { display: block; height: .3rem; background: var(--dm-paper-2); }
.who i + i { width: 60%; }
</style>
