---
name: quiz-slides
description: How to author quiz slides for the Debugging Minds competition. There is one question format, long-form bilingual trivia, where a clue paragraph ends in one ask, teams write the answer on paper, and all answers are revealed together at the end. Covers the trivia slide template, choosing and building a themed art visual for each question, the end-of-game answer sheet, the Romanian/Russian translation rules and glossary, the click budget, numbering and the host checklist. Use it whenever adding, translating, reordering or reviewing questions in slides.md.
---

# Writing quiz slides

Visual rules live in the `design-system` skill; this one is about content and flow.

## The format
Every question is **"who/what is it" trivia**: 2–4 clue sentences (history, a name origin, a famous
quote) ending in one ask ("Cum se numea…?"). There are **no multiple-choice, true/false or code
questions**. Teams **write answers on paper**; nothing is revealed per question. **All answers come at
the end**, on an `<AnswerList>` sheet.

Deck flow:
`cover` → rules slide (`class: rules`) → round 1 opener → 15 × `trivia` → round 2 opener → 15 × `trivia` → round 3 opener → `cover` "Răspunsuri" → **one answer slide per round** (all 15 rows, two `<AnswerList compact>` columns, `clicks: 15`, the right column `:reveal-at="9"`) → `cover` "Mulțumim".
All answers come at the end, one slide per round headed „Răspunsuri runda N”.
**Easter eggs for round 3** live inside each question's art: `<TrafficGrid egg="M" />`. The letter is never a sticker on top of the picture: it is something the scene would really contain, in crimson, big enough to read from the back row, usually with a small looping motion. Pick one of three kinds: *easy* (it simply is one of the things in the picture: a rune, the lit Enigma lamp, an avatar initial, a box-size sticker), *fun* (it moves with a story: a bug carrying it that vanishes under the probe, an N doing a silly walk, a B-tree key being inserted, a split-flap tile spinning onto it) or *smart* (it hides in the subject's own logic: a distorted CAPTCHA glyph, byte 0x48 in a hex dump, T9 multi-tap on key 3, the taxable-item flag on a receipt, register E·A·X). Current set, Q1→: CAPTCHA glyph · grade value · triangulated R · red-pen note · block E in chat · carved rune · split-flap gate · avatar · T9 · size sticker · Enigma lamp · bug · keylogger keycap | B-tree insert · Stack **O**verflow spill · attention heat-map glyph · hex byte · exhibit sticker · EAX register · tax flag · drop cap · silly walk · phone-book thumb tab. Round 1 spells the Playfair key **MERGECONFLICT** (Q1–5, 7–11, 13–15). Round 2 spells the hint **NOCHEATING** (Q16, 17, 19, 20, 22, 23, 25, 26, 28, 29). Nobody announces them. Art labels are English only. New art: accept an optional `egg` prop and drive it with `const active = useReplay()` (`composables/useReplay.ts`, not `useIsSlideActive`), which rewinds and replays the art every 14 s so teams see it ~5 times during the 60 s timer; the glyph/shape tables inside each art only cover the current letter, so add one if a letter changes. Check every egg in the browser at several animation moments.
The timer is an alarm clock (`variant: alarm`, rattles in the last 3 s), shows seconds only (60 → 00) and waits for the host: **Space** starts, pauses and resumes it (clicking the clock does too), so trivia slides need no `clicks:`. At 0 a crimson „Time's up” sheet sweeps in and stays; **Space or →** then moves to the next slide. Leaving a slide resets its clock (`autoNext: true` brings back the automatic advance).
Trivia slides use the `panel` look (default): crimson number, meta and a ring clock in the side panel. Chrome/meta labels (Question, category, pts, Time, Round, Answers) are **English only**; clues, asks and answer topics stay RO + RU. No page numbers in the footer.
The question order follows the jury's spreadsheet (`Întrebări_final`).

## Trivia slide

```md
---
layout: trivia
number: 2
round: 1
points: 10
category: Securitate · Безопасность
ask: ['Cum se numea această vulnerabilitate?', 'Как называлась эта уязвимость?']
artWidth: 13rem      # side column width (or artPos: band for a full-width strip above the text)
timer: 60
clicks: 1
---

Clue paragraph(s) in Romanian. **Bold** the catchable facts: years, names.

::ru::

Те же подсказки по-русски. **Жирным** — те же факты.

::art::

<HexLeak />

<!--
Răspuns (la final): Heartbleed.
-->
```
- The clues go in the body and the final question goes in `ask:`, where it's set large under a rule.
- Put the **answer in the presenter note** of every question, so the host can check sheets on the spot.
- Blanks in a clue: `**„Can it run <Blank :n="4" />?”**`.
- Text size is fitted automatically. If a clue only fits below ~0.85rem, shorten it.
- A plain image instead of art: `image: /q/NN.jpg` + `imageCaption: 'RO · RU'`.

## Themed art: one visual per question

Each question gets its own visual in `components/art/`, built from its subject. It's still paper, ink and
one crimson (see `design-system`), but it makes every slide distinct.

| Q | Answer | Component | Idea |
|---|---|---|---|
| 1 | Transformer | `AttentionGrid` | self-attention heat map over the paper's title |
| 2 | Heartbleed | `HexLeak` (band) | request claims 0x4000 bytes, memory dump leaks credentials in crimson |
| 3 | Cassandra | `HashRing` | Greek meander over a token ring; owner node crimson, replicas outlined |
| 4 | Git | `CommitGraph` | `log --graph` with a fork and merge; real first commit `e83c516` at the bottom |
| 5 | Oracle | `Trademark` | trademark card for JavaScript™, owner redacted in crimson, "Contestat" stamp |
| 6 | DOOM | `RunScreen` | tiny pixel screen "CAN IT RUN _ _ _ _?" + the devices list |
| 7 | HAL 9000 | `HalEye` | the red camera eye as flat concentric discs |

### Rules for a new art component
1. **Hint, never answer.** The visual may illustrate a clue that's already in the text (the attention map, the trademark), but must not show the answer's name, logo or an image that gives it away (no Transformers robot, no bleeding-heart logo, no "HAL" text). Check what a team could read off it in 60 seconds.
2. **Palette and shape:** `var(--dm-*)` only, crimson for the one meaningful mark, 0 radius, 2–3px ink strokes, mono labels at 0.52–0.6rem.
3. **Size:** side art is 12–15rem wide and should be ≤ ~15rem tall. The art never sets the text height; it's clipped to the text column. Band art (`artPos: band`) is ≤ ~7rem tall, for the longest clues.
4. **Motion:** one entrance on slide enter via `useIsSlideActive()` (fade, line draw, rows appearing), then still. A blinking cursor is the most allowed after that.
5. **SVG text:** set the size inline, `style="font-size: 8px"` (px = viewBox units), or use HTML labels positioned over the SVG. **Never `font-size="8"` as an attribute**: UnoCSS attributify turns it into `[font-size~="8"] { font-size: 2rem }` and the text blows up. Same trap for class names that are Uno utilities (`ring`, `grid`, `hidden`…): the `ring` class drew a blue outline on the timer.
6. Name the file after the visual, not the answer (`HexLeak`, not `Heartbleed`). The component list is visible in the repo.

## Answer sheet (end of game)
```md
---
clicks: 7
---

<div class="dm-label dm-red">Răspunsuri · Ответы · 01–07</div>

# Verificați foile

<AnswerList class="mt-4" :items="[
  { n: 1, ro: 'Arhitectura din 2017', ru: 'Архитектура 2017 года', answer: 'Transformer' },
  …
]" />
```
- `ro`/`ru` is a **short topic label** that reminds the room which question it was, without restating it or containing the answer.
- `clicks:` = number of rows. Max 7 rows per slide; continue on a second slide (`08–14`).
- Accept variants at the jury table and note them in the slide's presenter note (e.g. "Transformers" for Q1). Show the canonical form on the sheet, with an alternative in brackets if needed.
- Jury printout without clicks: `<AnswerList all … />`.

## Bilingual rules
- **Romanian first, Russian beside it (two columns) or under it (with art), on the same slide.** Never a separate slide per language.
- Translate meaning, not word order. The Russian must read like it was written in Russian, and **a native speaker must proof it** before the event.
- Don't leak the answer in translation: a calque can give away a name that the Romanian only hints at.
- Names of works use their established local titles: „Via roșie” / «Красные виноградники», „2001: Odiseea spațială” / «2001 год: Космическая одиссея».
- Comma-below **ș ț** (U+0219/U+021B), never cedilla ş ţ. Quotes: „…” (RO), «…» (RU).

### Proofreading checklist (from the first batch)
- Missing diacritics in casual typing: *numeste → numește*, *aceasta baza de date → această bază de date*, *aceasta vulnerabilitate → această vulnerabilitate*, *aceasta companie → această companie*.
- Straight quotes "…" → „…” / «…».
- Ambiguous asks: "Cum se numea aceasta?" (Q1) can mean the architecture or the film franchise, so accept both.
- A parenthetical hint inside the question becomes a clue sentence or an `imageCaption`.

### Glossary
| RO | RU |
|---|---|
| Întrebarea | Вопрос |
| Runda | Раунд |
| Răspuns / Răspunsuri | Ответ / Ответы |
| Timp · Pauză · Stop | Время · Пауза · Стоп |
| Timpul a expirat | Время вышло |
| Pauză (break) | Перерыв |
| Clasament | Рейтинг |
| Echipa | Команда |
| puncte (p) | баллы (б) |
| Indiciu | Подсказка |
| Predați foile | Сдайте листы |
| Verificați foile | Проверьте листы |
| Inteligență artificială · Securitate · Baze de date · Unelte · Companii · Jocuri · Film | ИИ · Безопасность · Базы данных · Инструменты · Компании · Игры · Кино |

## Click budget
Components read `$clicks`, which Slidev only counts when the slide declares them.

| Slide | Click 1 … | `clicks:` |
|---|---|---|
| Trivia | timer starts | `1` |
| Answer sheet, k rows | one answer per click | `k` |

Timer on slide enter instead: `timerAt: 0` and `clicks: 0`.

## Numbering
- `number:` is global across the event (01…NN), not per round. The header pads it to 2 digits.
- `round:` shows as `R1` in the header. Points: 10 per question unless the rules say otherwise.

## Host checklist
1. `pnpm dev`, then open `/presenter` on the laptop and the plain URL on the projector, **in the same browser** (the timer's pause sync uses `BroadcastChannel`).
2. Click once inside the projector window so the browser allows the timer sound.
3. On a question, Space starts the 60 s timer and Space again pauses / resumes it (both windows follow). After „Time's up”, Space or → goes on; ← / → mid-question leaves and resets the clock.
4. After the last question, collect sheets on the "Răspunsuri" slide, then step through the answers one click at a time.
5. Backup: `pnpm export` → PDF (static, no timers).
6. Before the event, step through every question and check that nothing overflows and all diacritics render.
