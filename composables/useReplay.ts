// Drop-in replacement for useIsSlideActive() in question art (components/art/*).
// Teams answer during a 60 s timer, so the art (and its easter-egg letter) must not play only once
// on slide enter: every `period` ms the art is rewound to its start state in one frame and plays again,
// which gives ~5 viewings per question at the default 14 s.
//
// How the rewind works: right after Vue patches the root, it gets `dm-rewind` (styles/index.css kills transitions and
// animations under it) while `active` goes false, so everything snaps back instead of animating back.
// After `gap` ms both flip at once and the CSS transitions run forward from the start state again.
// JS-driven art that watches `active` simply resets and restarts.
import { getCurrentInstance, nextTick, onUnmounted, ref, watch } from 'vue'
import { useIsSlideActive } from '@slidev/client'

export const REPLAY_MS = 14000

export function useReplay(period = REPLAY_MS, gap = 250) {
  const slide = useIsSlideActive()
  const inst = getCurrentInstance()
  const active = ref(false)
  let loop: ReturnType<typeof setInterval> | undefined
  let back: ReturnType<typeof setTimeout> | undefined
  const root = () => (inst?.proxy?.$el instanceof Element ? inst.proxy.$el : undefined)

  const stop = () => { clearInterval(loop); clearTimeout(back) }
  watch(slide, (on) => {
    stop()
    root()?.classList.remove('dm-rewind')
    active.value = on
    if (!on) return
    loop = setInterval(() => {
      active.value = false
      // after Vue has patched `:class` (which rewrites className), still before the next frame
      nextTick(() => root()?.classList.add('dm-rewind'))
      back = setTimeout(() => {
        active.value = slide.value
        nextTick(() => root()?.classList.remove('dm-rewind'))
      }, gap)
    }, period)
  }, { immediate: true })
  onUnmounted(stop)

  return active
}
