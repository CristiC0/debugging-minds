# Layouts & components

All of these live in the project (`layouts/`, `components/`) and are auto-registered by Slidev: no imports needed.
Markdown inside an HTML/component tag needs a blank line before and after it.

## Files

| Path | What |
|---|---|
| `styles/index.css` | Tokens, grain + folds, helper classes, code styling, keyframes |
| `layouts/cover.vue` | Poster cover: meta row, stacked words, details row, optional brain + credit |
| `layouts/round.vue` | Round opener with the giant crimson numeral |
| `layouts/trivia.vue` | **The question format.** Clue paragraph RO \| RU, auto-fit, ask line, `::art::` slot, timer |
| `components/art/*.vue` | One themed visual per question (see below) |
| `layouts/break.vue` | Break: stacked word + coffee glyph, no clock |
| `global-bottom.vue` | Running footer (event · page), hidden on cover/round/break |
| `setup/shiki.ts` | `min-dark` for all code blocks |

## Layouts: frontmatter → props

```yaml
layout: cover     # meta: [..]  words: [..]  details: [..]  image: /brain.png  size: '9.6rem'  credit: '…'
layout: round     # round: 2   stats: ['14 întrebări · 14 вопросов', '60 s']     slot: <Bi ro="…" ru="…" />
layout: trivia    # number round points category
                  # ask: ['Cum se numea…?', 'Как называлась…?']
                  # image: /q/01.jpg  imageCaption: 'RO · RU'
                  # timer: 60  timerAt: 1  timerVariant: bar|ring|block|digits  maxSize: 1.55  minSize: .78
                  # artPos: side|band  artWidth: '15rem'
                  # body = RO clues, `::ru::` = RU clues, `::art::` = themed visual     clicks: 1
layout: break     # words: ['Pau', 'ză']   (coffee glyph, no clock)
```
Use `details`, not `info`, on the cover: `info` is a reserved Slidev headmatter key.

### `trivia` fitting
It starts at `maxSize` rem and steps down by .04 until nothing overflows. It re-runs when the slide becomes
active (pre-mounted neighbours are hidden and measure 0) and after fonts load.
- Only the layout's own text boxes (class `fit-t`) and the box's height count. Art is positioned absolutely in its column, so it never sets the height, and a rotated stamp poking out sideways doesn't shrink the text.
- Don't reuse `.fit-t` inside art components.

## Components

| Component | Props | Notes |
|---|---|---|
| `<Bi>` | `ro`, `ru`, `size: sm\|md\|lg\|xl\|q`, `inline`, `upper` | Slots `#ro` / `#ru` for rich content |
| `<QHeader>` | `number`, `round`, `points`, `category` | Header strip of `trivia` |
| `<Blank>` | `n`, `answer`, `reveal` | Letter boxes in a clue: `Can it run <Blank :n="4" />?` |
| `<AnswerList>` | `items [{n, ro, ru, answer}]`, `revealAt` (1), `all` | End-of-game sheet; one answer per click, newest crimson; ≤ 7 rows; `clicks: items.length` |
| `<Timer>` | `seconds`, `at`, `stopAt`, `variant: digits\|bar\|ring\|block`, `warn` (10), `sound` (true), `id`, `label` | Emits `done` |
| `<Scoreboard>` | `teams [{name, score}]`, `max`, `revealAt`, `sort` | Reveals last → first; `clicks: revealAt + n − 1` |
| `<Stamp>` | `ro`, `ru`, `show`, `tone: red\|ink`, `rotate` | Rubber stamp; used in `Trademark` art |
| `<Tag>` | `variant: outline\|solid\|red\|ghost` | Icon goes in the slot |
| `<MetaLine>` | `items`, `justify: between\|center\|start` | Poster meta row with `·` |
| `<Stack>` | `words`, `size`, `image`, `align: left\|center\|justify`, `red` (indexes) | Poster headline, diacritic-aware leading |

## Question art (`components/art/`)

No props; each one is self-contained and starts its entrance on slide enter.

| Component | Slot use | Visual |
|---|---|---|
| `<AttentionGrid>` | side, 15rem | 5×5 self-attention map, crimson opacity = weight |
| `<HexLeak>` | `artPos: band` | request + hex dump, leaked ASCII in crimson, rows appear one by one |
| `<HashRing>` | side, 13rem | meander band + token ring, owner/replica nodes |
| `<CommitGraph>` | side, 13rem | fork/merge graph, HEAD crimson; HTML labels on a 30px grid |
| `<Trademark>` | side, 13rem | ® register card, redaction bar grows, stamp |
| `<RunScreen>` | side, 13rem | pixel screen with `<Blank>`, stepped loading bar, devices list |
| `<HalEye>` | side, 12rem | concentric discs, lens scales in |

## Helper classes (`styles/index.css`)
`.dm-display` · `.dm-meta` · `.dm-label` · `.dm-ru` · `.dm-soft` · `.dm-red` · `.dm-num` · `.dm-rule` ·
`.dm-rule-soft` · `.dm-tag(.solid|.red|.ghost)` · `.dm-btn` · `.dm-hatch` · `.dm-no-grain` (slide class)

Keyframes: `dm-in-up`, `dm-stamp`, `dm-pulse`.

## Timer behaviour
- **Start** is click-driven (`at`), so the presenter and audience windows start together. `at: 0` starts on slide enter.
- **Pause/resume**: click the timer. It's synced between windows of one browser via `BroadcastChannel('dm-timer')`, keyed by page + `seconds-variant` (or `id`), and it ignores its own window.
- **Freeze** at `stopAt`, if set. Stepping back resumes it.
- **Sound**: ticks in the last 3 s and a buzzer at 0, audience window only (`$renderContext === 'slide'`). The browser needs one click in that window first.
- It never runs in the overview or the next-slide preview.

## Building a new component
1. Colors from `var(--dm-*)` only; numbers `.dm-num`; labels `.dm-label`.
2. Bilingual props or slots (`ro` / `ru`) for anything the audience reads.
3. Read `$clicks` via `useSlideContext()` for host-stepped behaviour, and document the click budget in the file's header comment.
4. Start animations on slide enter (`useIsSlideActive`), not on mount, because Slidev pre-mounts neighbouring slides.
5. Module-wide state (e.g. one id per window) goes in a plain `<script>` block. `<script setup>` runs once per instance.
6. Verify in the browser at every click state.
