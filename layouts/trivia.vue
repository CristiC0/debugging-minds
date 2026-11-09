<script setup lang="ts">
// Long-form trivia question: a paragraph of clues, then the ask. RO | RU side by side.
// Answers are written on paper and revealed at the end of the game (see <AnswerList>).
//
// Markdown: default slot = Romanian clues, `::ru::` = Russian clues.
// Frontmatter:
//   number, round, points, category          → header
//   ask: ['Cum se numea?', 'Как называлась?'] → the question line, set large under the clues
//   image: /q/01.jpg   imageCaption: 'Via roșie · Красные виноградники'   (optional side image)
//   `::art::` slot: a themed visual for this question (components/art/*). artPos: side (default) | band
//   artWidth: '15rem' (side column width)
//   timer: 60   timerDelay: 2.5 (s after the slide opens; timerAt: 0 default)   timerVariant: bar | ring | block | digits
//   clicks: N   ← only when timerAt ≥ 1 (start on a click instead)
//   Easter-egg letters live in the art: <SomeArt egg="M" /> (components/EggLetter.vue)
//
// Text size is fitted automatically: it starts large and steps down until the slide doesn't overflow,
// so a two-line clue and a ninety-word clue both fill the space.
import { computed, nextTick, onMounted, onUnmounted, ref, useSlots, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { asset } from '../composables/asset'

const props = withDefaults(defineProps<{
  number?: number | string
  round?: number | string
  points?: number
  category?: string
  ask?: [string, string?]
  image?: string
  imageCaption?: string
  timer?: number
  timerAt?: number
  timerDelay?: number
  timerVariant?: 'ring' | 'bar' | 'block' | 'digits'
  artPos?: 'side' | 'band'
  artWidth?: string
  maxSize?: number   // rem, upper bound for the fitted clue text
  minSize?: number
  // Slide chrome (layout of header, ask and timer). The clue/art/fit logic is shared.
  //   classic  → header strip on top, ask under the clues, bar timer at the bottom
  //   panel    → (default) grey side panel: huge crimson number, meta, ring timer. Chrome labels are English only.
  //   headline → slim header, the ask set first as the headline, ring timer on the right
  //   card     → bordered question card with a number tab; ask + block timer in an ink band
  look?: 'classic' | 'panel' | 'headline' | 'card'
  autoNext?: boolean   // when the timer hits 0: "time's up" sweep, then go to the next slide
}>(), { timerAt: 0, timerDelay: 2.5, timerVariant: 'bar', artPos: 'side', artWidth: '15rem', maxSize: 1.55, minSize: 0.78, look: 'panel', autoNext: true })

const pad = (n?: number | string) => String(n ?? '').padStart(2, '0')
const classic = computed(() => props.look === 'classic')
const tVariant = computed(() => (classic.value ? props.timerVariant : props.look === 'panel' ? 'ring' : props.look === 'headline' ? 'ring' : 'block'))
const sideTimer = computed(() => !!props.timer && ((classic.value && props.timerVariant !== 'bar') || props.look === 'headline'))

const slots = useSlots()
const sideArt = computed(() => !!slots.art && props.artPos === 'side')
const bandArt = computed(() => !!slots.art && props.artPos === 'band')
const side = computed(() => !!props.image || sideArt.value)
// panel look: each language's question sits right under its own clues (RO under RO, RU under RU)
const inlineAsk = computed(() => !!props.ask && props.look === 'panel')

const box = ref<HTMLElement>()
const size = ref(props.maxSize)
const active = useIsSlideActive()

async function fit() {
  await nextTick()
  const el = box.value
  if (!el || !el.clientHeight) return // hidden (pre-mounted neighbour): retry when active
  size.value = props.maxSize
  await nextTick()
  // art is clipped to the text's height, so only the text boxes count as overflow
  // Height for the whole box; width only for text (a rotated stamp in the art may poke out sideways).
  const over = () => el.scrollHeight > el.clientHeight + 1
    || [...el.querySelectorAll<HTMLElement>('.fit-t')].some(n => n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1)
  while (size.value > props.minSize && over()) {
    size.value = Math.round((size.value - 0.04) * 100) / 100
    await nextTick()
  }
}
onMounted(() => { fit(); document.fonts?.ready.then(fit) })

// ---------- time's up: sweep, then advance ----------
// Presenter and audience windows both reach 0; a Web Lock makes sure only one calls next().
const { next } = useNav()
const { $renderContext } = useSlideContext()
const timesUp = ref(false)
let advanceT: ReturnType<typeof setTimeout> | undefined
function onDone() {
  if (!active.value) return // a timer from a slide we already left must not sweep or advance
  timesUp.value = true
  if (!props.autoNext || !['slide', 'presenter'].includes($renderContext.value)) return
  const go = () => { advanceT = setTimeout(() => { if (active.value) next() }, 2200) }
  const locks = (navigator as any).locks
  if (locks) locks.request(`dm-next-${props.number}`, { ifAvailable: true }, async (lock: unknown) => {
    if (!lock) return
    go(); await new Promise(r => setTimeout(r, 4000))
  })
  else go()
}
watch(active, (a) => { if (!a) { timesUp.value = false; clearTimeout(advanceT) } })
onUnmounted(() => clearTimeout(advanceT))
watch(active, a => a && fit())
</script>

<template>
  <div class="slidev-layout trivia" :class="[`look-${look}`, { 'side-timer': sideTimer }]">
    <!-- panel: side column with number, meta and the clock -->
    <aside v-if="look === 'panel'" class="panel">
      <div class="pn dm-display dm-num">{{ pad(number) }}</div>
      <dl class="pmeta">
        <template v-if="round"><dt>Round</dt><dd>{{ round }}</dd></template>
        <template v-if="category"><dt>Topic</dt><dd>{{ category }}</dd></template>
        <template v-if="points"><dt>Points</dt><dd>{{ points }}</dd></template>
      </dl>
      <div v-if="timer" class="ptimer"><Timer :seconds="timer" :at="timerAt" :delay="timerDelay" variant="alarm" :label="false" @done="onDone" /></div>
    </aside>

    <div v-if="timesUp" class="timesup dm-motion"><span class="tu dm-display dm-motion">Time's up</span></div>

    <QHeader v-if="classic" :number="number" :round="round" :points="points" :category="category" />

    <!-- headline: one slim line of meta -->
    <header v-else-if="look === 'headline'" class="slim">
      <span class="sn dm-display dm-num">{{ pad(number) }}</span>
      <span class="dm-label dm-soft">Question · R{{ round }}</span>
      <Tag v-if="category" variant="outline">{{ category }}</Tag>
      <Tag v-if="points" variant="solid" class="spts">{{ points }} pts</Tag>
    </header>

    <!-- card: number tab sitting on the card's top border -->
    <header v-else-if="look === 'card'" class="tabrow">
      <span class="tab"><span class="dm-display dm-num">{{ pad(number) }}</span><span class="dm-meta">Question</span></span>
      <Tag v-if="category" variant="outline">{{ category }}</Tag>
      <span class="tabr">
        <span v-if="round" class="dm-label dm-soft">R{{ round }}</span>
        <Tag v-if="points" variant="solid">{{ points }} pts</Tag>
      </span>
    </header>

    <main>
      <div ref="box" class="fitbox" :style="{ '--fs': `${size}rem` }">
        <div v-if="bandArt" class="band"><slot name="art" /></div>
        <div class="cols" :class="{ 'with-side': side }" :style="side ? { '--side': artWidth } : {}">
          <div class="txt fit-t">
            <div class="ro fit-t" lang="ro"><slot /><div v-if="inlineAsk" class="ask-l"><ph-question-bold class="qi" /><span>{{ ask![0] }}</span></div></div>
            <div v-if="side" class="ru stacked fit-t" lang="ru"><slot name="ru" /><div v-if="inlineAsk && ask![1]" class="ask-l"><ph-question-bold class="qi" /><span>{{ ask![1] }}</span></div></div>
          </div>
          <div v-if="!side" class="ru fit-t" lang="ru"><slot name="ru" /><div v-if="inlineAsk && ask![1]" class="ask-l"><ph-question-bold class="qi" /><span>{{ ask![1] }}</span></div></div>
          <div v-else-if="sideArt" class="art"><slot name="art" /></div>
          <figure v-else>
            <img :src="asset(image)" alt="">
            <figcaption v-if="imageCaption" class="dm-label dm-soft">{{ imageCaption }}</figcaption>
          </figure>
        </div>

        <div v-if="ask && !inlineAsk" class="ask">
          <div class="ask-t">
            <div class="ask-l" lang="ro"><ph-question-bold class="qi" /><span>{{ ask[0] }}</span></div>
            <div v-if="ask[1]" class="ask-l" lang="ru"><ph-question-bold class="qi" /><span>{{ ask[1] }}</span></div>
          </div>
          <div v-if="look === 'card' && timer" class="ctimer"><Timer :seconds="timer" :at="timerAt" :delay="timerDelay" variant="block" :label="false" /></div>
        </div>
      </div>

      <aside v-if="sideTimer">
        <Timer :seconds="timer" :at="timerAt" :delay="timerDelay" :variant="tVariant" />
      </aside>
    </main>

    <footer v-if="classic && timer && timerVariant === 'bar'">
      <Timer :seconds="timer" :at="timerAt" :delay="timerDelay" variant="bar" />
    </footer>
  </div>
</template>

<style scoped>
.trivia { position: relative; height: 100%; display: flex; flex-direction: column; padding: 1.5rem 2.6rem 2rem; }
main { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr; gap: 2rem; padding-top: 1.1rem; }
.side-timer main { grid-template-columns: 1fr auto; }
aside { display: flex; align-items: flex-start; }
footer { padding-top: .7rem; }

.fitbox { min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: 1.1em; font-size: var(--fs); }

.cols { flex: 0 1 auto; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: minmax(0, auto); gap: 0 1.6em; }
.cols > * { min-height: 0; }
.cols.with-side { grid-template-columns: 1fr minmax(0, var(--side, 15rem)); gap: 0 1.8rem; }
.art { font-size: 1rem; position: relative; min-height: 0; }
.art > :deep(*) { position: absolute; inset: 0 0 auto 0; }
.band { font-size: 1rem; }
.cols > .ru { border-left: 3px solid var(--dm-ink); padding-left: 1.6em; }

.ro, .ru { line-height: 1.38; }
.ro { font-weight: 500; color: var(--dm-ink); }
.ru { font-weight: 400; color: var(--dm-ink-soft); }
.ru.stacked { margin-top: .9em; padding-top: .7em; position: relative; }
.ru.stacked::before { content: ''; position: absolute; top: 0; left: 0; width: 2.2rem; height: 3px; background: var(--dm-red); }
.ro :deep(p), .ru :deep(p) { margin: 0 0 .55em; }
.ro :deep(p:last-child), .ru :deep(p:last-child) { margin-bottom: 0; }
/* clues worth catching: **bold** in markdown */
.ro :deep(strong) { font-weight: 800; }
.ru :deep(strong) { font-weight: 700; color: var(--dm-ink); }

figure { margin: 0; display: flex; flex-direction: column; gap: .4rem; }
figure img { width: 100%; max-height: 14rem; object-fit: cover; border: 2.5px solid var(--dm-ink); filter: grayscale(.15) contrast(1.05); }

.ask { display: flex; gap: .55em; align-items: flex-start; margin-top: auto; padding-top: .7em; border-top: 2px solid var(--dm-ink); }
/* the ask: one line per language, same size and colour, each with its own icon, plain spacing */
.ask-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .3em; }
.ask-l { display: flex; align-items: center; gap: .45em; font-weight: 800; font-size: 1.05em; line-height: 1.2; letter-spacing: 0; color: var(--dm-ink); }
.ro .ask-l, .ru .ask-l { margin-top: .5em; }
.qi { flex: none; font-size: 1.15em; color: var(--dm-red); }

/* time's up: a crimson sheet slides across right → left (same direction as the slide transition) */
.timesup { position: absolute; inset: 0; z-index: 60; display: grid; place-items: center; background: var(--dm-red); animation: tu-sweep 2.2s var(--dm-ease) both; pointer-events: none; }
.tu { font-size: 6.5rem; line-height: .85; letter-spacing: -.05em; text-transform: uppercase; color: var(--dm-white); animation: tu-word 2.2s var(--dm-ease) both; }
@keyframes tu-sweep { 0% { clip-path: inset(0 0 0 100%); } 30%, 100% { clip-path: inset(0 0 0 0); } }
@keyframes tu-word { 0%, 20% { opacity: 0; transform: translateX(3rem) scale(.9); } 45% { opacity: 1; transform: none; } 100% { opacity: 1; transform: scale(1.04); } }

/* ---------- look: panel ---------- */
.look-panel { display: grid; grid-template-columns: 12rem 1fr; padding: 0; }
.look-panel main { padding: 1.6rem 2.4rem 1.8rem 2rem; }
.panel { background: var(--dm-paper-2); border-right: 3px solid var(--dm-ink); padding: 1.4rem 1.3rem 2.6rem; display: flex; flex-direction: column; gap: .7rem; }
.pn { font-size: 7.5rem; line-height: .74; letter-spacing: -.07em; color: var(--dm-red); margin-left: -.3rem; }
.pmeta { margin: .5rem 0 0; padding-top: .7rem; border-top: 2px solid var(--dm-ink); display: grid; grid-template-columns: auto 1fr; gap: .45rem .8rem; align-items: baseline; }
.pmeta dt { font-family: var(--dm-mono); font-size: .56rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--dm-ink-soft); }
.pmeta dd { margin: 0; font-weight: 700; font-size: .82rem; line-height: 1.15; color: var(--dm-ink); }
.ptimer { margin-top: auto; }
.ptimer { align-self: center; }

/* ---------- look: headline ---------- */
.slim { display: flex; align-items: center; gap: .9rem; padding-bottom: .55rem; border-bottom: 2px solid var(--dm-ink); }
.sn { font-size: 1.9rem; line-height: .8; letter-spacing: -.05em; }
.spts { margin-left: auto; }
.look-headline main { padding-top: 1rem; }
.look-headline .ask { order: -1; margin-top: 0; padding: 0 0 .75em; border-top: 0; border-bottom: 3px solid var(--dm-ink); }
.look-headline .cols { margin-top: .2em; }

/* ---------- look: card ---------- */
.look-card { padding: 1.3rem 2.4rem 1.7rem; }
.tabrow { display: flex; align-items: flex-end; gap: 1rem; }
.tab { display: flex; align-items: center; gap: .6rem; background: var(--dm-ink); color: var(--dm-paper); padding: .45rem .8rem .35rem; }
.tab .dm-display { font-size: 2.2rem; line-height: .8; letter-spacing: -.05em; }
.tab .dm-meta { font-size: .62rem; color: var(--dm-paper); }
.tabrow > .dm-tag { margin-bottom: .35rem; }
.tabr { margin-left: auto; display: flex; align-items: center; gap: .7rem; margin-bottom: .35rem; }
.look-card main { border: 3px solid var(--dm-ink); padding: 0; }
.look-card .fitbox > .cols, .look-card .fitbox > .band { margin: 1.1rem 1.4rem 0; }
.look-card .ask { margin-top: auto; padding: .75em 1.4rem; border-top: 0; background: var(--dm-ink); align-items: center; }
.look-card .ask-l { color: var(--dm-paper); }
.ctimer :deep(.v-block .digits) { font-size: 2.4rem; padding: .45rem .7rem .35rem; border: 2px solid var(--dm-paper); }
</style>
