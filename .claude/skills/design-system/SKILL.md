---
name: design-system
description: The Debugging Minds design system, a grainy, folded print poster in warm paper, charcoal ink and a single crimson. Use it for any visual decision in this deck, such as colors, the palette and contrast, fonts and the type scale, icons, texture, spacing, borders, motion or imagery, and whenever you create, restyle or review a slide, layout or Vue component. It holds every token with its role, the rules for using it, the full icon catalogue (references/icons.md), and the API of every layout and component (references/components.md).
---

# Debugging Minds design system

**Source of truth:** the event poster ([assets/poster.jpg](assets/poster.jpg), also `public/poster.jpg`).
Every rule here is derived from it. When in doubt, hold the slide next to the poster.

**The look in one line:** a folded, grainy, offset-printed poster. Warm grey paper, a heavy black
grotesk crushed into stacked words, one crimson anatomical brain. Flat print: no shadows, no
gradients, no rounded corners, one accent.

**Where things live:** tokens and global styles in `styles/index.css`; layouts in `layouts/`;
components in `components/`. This skill documents them and the code implements them. If they
disagree, fix one so they match.

| Need | Read |
|---|---|
| Colors, type, texture, spacing, motion, rules | this file |
| Which icon for what, and how to write it | [references/icons.md](references/icons.md) |
| Layout frontmatter, component props, timer behaviour, building new pieces | [references/components.md](references/components.md) |
| How to write questions, translations, the click budget | the `quiz-slides` skill |

---

## 1. Principles

1. **Paper, ink, blood.** Three materials only. Paper is the ground, ink carries everything, crimson marks what matters *right now*.
2. **One accent, and it means something.** Crimson is the clock running out, the newest answer, the leader, the round number, the one key mark in a question's art. If it's decorative, it's wrong.
3. **Heavy and tight.** Display type is 900 weight, uppercase, tracked in, with crushed leading. Words may be split like the poster's `DEBUG / GING`.
4. **Printed, not rendered.** Grain over everything (type included), fold creases, hard edges, 2–3px ink borders.
5. **Bilingual by default.** Romanian leads (ink, bold), Russian follows directly under or beside it (`--dm-ink-soft`, lighter). Both are always on the same slide.
6. **Readable from the back row.** The room is a lecture hall. Nothing the audience must read goes below ~0.85rem.

---

## 2. Color

### Palette

| Token | Hex | Material | Role |
|---|---|---|---|
| `--dm-paper` | `#dbd5d6` | paper | Slide background, sampled from the poster |
| `--dm-paper-2` | `#cec7c8` | paper | Tracks, empty bars, hidden answers, inline code |
| `--dm-rule` | `#b4acad` | paper | Hairlines, row dividers, fold creases (decorative only) |
| `--dm-white` | `#f2efee` | paper | Text on crimson or on ink |
| `--dm-ink` | `#282828` | ink | Headlines, body, borders, solid blocks |
| `--dm-ink-deep` | `#141414` | ink | Code block background |
| `--dm-ink-soft` | `#5e595a` | ink | Russian line, captions, labels, secondary numbers |
| `--dm-red` | `#a3262f` | crimson | **The accent**, used only in the roles below |
| `--dm-red-deep` | `#7c1b23` | crimson | Red on red: shading inside crimson art (e.g. the HAL lens) |
| `--dm-red-wash` | `rgba(163,38,47,.12)` | crimson | Rare tinted fill; prefer not to use it |

### What crimson is for (exhaustive)
- The timer at or below `warn` seconds, and when it's done
- The leader on `<Scoreboard>`, and the newest answer on `<AnswerList>`
- The giant round numeral (`round` layout), the `?` icon on the ask line
- Section labels above h1 (`.dm-label.dm-red`) and the short rule before the RU line
- The brain engraving and `.dm-hatch` placeholders
- Stamps (e.g. "Contestat · Оспаривается")
- The **one** key mark in a question's art (`components/art/*`): the leaked bytes, the HEAD commit, the owner node, the lens

Anything else stays ink. **No green, no yellow or orange for warnings, no blue links.**
A crimson *scale* (opacity) is allowed only for data, like the attention heat map.

### Proportion
Paper ≈ 70–80% of the slide, ink ≈ 15–25%, crimson ≤ 15% (the round slide's numeral is the one
deliberate exception). Two big crimson masses on one slide is too many.

### Contrast (WCAG, measured)
| Pair | Ratio | Use |
|---|---|---|
| ink on paper | 10.2 | everything |
| ink on paper-2 | 8.9 | text on tracks/chips |
| paper on ink | 10.2 | solid tags, block timer |
| white on red | 6.4 | red tag |
| white on red-deep | 9.0 | text on deep crimson |
| red on paper | 5.0 | labels, numerals, the warning timer |
| ink-soft on paper | 4.8 | RU text, captions (AA ✓) |
| ink-soft on paper-2 | 4.1 | **large text only** (≥ 1.2rem, or bold ≥ 0.95rem) |
| rule on paper | 1.5 | decoration only, never text |

### Rules
- Components read `var(--dm-*)` only. **No new hex values.** If something seems to need one, it's probably a misuse of crimson.
- Light only (`colorSchema: light`). The paper is the theme; there's no dark variant.
- Projectors wash out midtones. Never put meaning in `--dm-rule` or in faint tints.

---

## 3. Typography

All families cover **Latin Extended (ș ț comma-below, ă â î) and Cyrillic**, and are loaded from the headmatter:
```yaml
fonts:
  sans: Inter
  serif: Inter Tight      # used as the display face (--dm-display)
  mono: JetBrains Mono
  weights: '400,500,600,700,800,900'
```

| Role | Face | Weight | Case / tracking / leading | Token / class |
|---|---|---|---|---|
| Display: stacked words, h1–h3, numerals | Inter Tight | 900 | UPPER, −0.035…−0.07em, 0.74–0.9 | `--dm-display`, `.dm-display` |
| Meta row ("DEPARTAMENTUL INFORMATICĂ · FMI · USM") | Inter Tight | 800 | UPPER, +0.01em | `.dm-meta` |
| Trivia clues (RO / RU) | Inter | 500 / 400 | sentence case, 0, 1.38 | `trivia` layout |
| Ask line (RO / RU) | Inter Tight | 800 / 500 | sentence case, −0.02em, 1.1 | `trivia` layout |
| Body, captions | Inter | 400–700 | sentence case | `--dm-sans` |
| Labels, data, code | JetBrains Mono | 600 | UPPER for labels, +0.08em | `--dm-mono`, `.dm-label` |
| Every number that changes (timer, score) | any | | tabular figures | `.dm-num` |

### Type scale (rem, at Slidev's 980px canvas)
| Step | Size | Where |
|---|---|---|
| Numeral | 22 | round number |
| Hero | 9–10.5 | cover / break stacked words |
| Stack | 7.5 | `<Stack>` default |
| Timer digits | 7 / 4.5 / 3.4 / 2.4 | digits / block / ring / bar |
| h1 | 3.4 | slide titles |
| Q number | 3.2 | header "07" |
| h2 | 2 | |
| Clues | 1.55 → 0.78 (auto-fit) | `trivia` |
| Ask line | 1.35em of clue size | `trivia` |
| Body | 1–1.05 | |
| Meta | 0.78 | `.dm-meta` |
| Label | 0.68 | `.dm-label` |
| Footer | 0.55 | running footer (presenter info, not for the room) |

Use at most **two faces per slide** (display + body or display + mono); the mono label above h1 doesn't count.

### Romanian diacritics under crushed leading
At `line-height: .8`, **Ă Â Î** (mark above the caps) and **Ș Ț** (comma below the baseline) collide
with neighbouring lines. `<Stack>` detects them and opens the gap only where needed (+.14em above,
+.26em below); h1 gets `margin-top: .45rem` for the same reason. If you set display text by hand,
do the same. After any type change, check `PAUZĂ`, `ÎNTREBAREA`, `MULȚUMIM`, `RĂSPUNSURI`.

### Text rules
- Comma-below **ș ț** (U+0219/U+021B), never cedilla ş ţ.
- Quotes: Romanian „…”, Russian «…», never straight "…".
- `**bold**` in clues marks the catchable facts (years, names). In RU, bold also switches to ink.
- Separator between items is a heavy `·` with space around it. No slashes or pipes.
- Numbers pad to two digits where they label something: `01`, `R2`, `Q07`.

---

## 4. Icons

**Phosphor, Bold weight** (`@iconify-json/ph`, installed). It's the only set whose stroke holds up next to 900 type.
Write `<ph-timer-bold />` in Markdown or Vue, or use the class form `i-ph-timer-bold` inside `v-for`.
Use `-fill` for an "on" state. Icons take `currentColor`: ink by default, crimson only in a crimson role.

The core set is `timer` · `brain` · `bug` · `code` · `question` · `lightbulb` · `check` · `x` · `trophy` ·
`users-three` · `coffee` · `image` · `flag-checkered`.
The full catalogue by use (about 60 icons, all verified in the installed set) and the sizing rules are in
**[references/icons.md](references/icons.md)**.

---

## 5. Texture, shape, space

### Texture (global, in `styles/index.css`)
- **Grain:** `.slidev-layout::after` lays SVG fractal noise over everything, type included (`multiply`, 22%). Turn it off per slide with `class: dm-no-grain` (e.g. a full-bleed photo).
- **Folds:** `.slidev-layout::before` draws creases at ⅓ and ⅔ (vertical) and ½ (horizontal), plus a soft highlight top-left.
- **Hatch:** `.dm-hatch` gives crimson −45° engraving lines, used as an image placeholder or a decorative fill.

### Shape
- Corners **0**. Borders **2px** (tags, buttons, image frames), **2.5px** (art cards, image frames on questions), **3px** (header rule, column divider).
- No shadows, no gradients, no blur, no glass.
- Solid blocks are ink (block timer, solid tag, pixel screen) or crimson (a single key mark).

### Space
| Token (by convention) | Value | Where |
|---|---|---|
| Slide padding | 1.5rem 2.6rem 2rem | trivia, answer sheet |
| Hero padding | 2.4rem 3.2rem | round, break |
| Header → body | 1.1–1.3rem | under the 3px header rule |
| Column gap | 1.6em (fits with text) / 2rem | RO \| RU, text \| timer |
| Stack gap | .45–.7rem | list rows, art parts |
| Inline gap | .35–.8rem | tags, icons + text |

Align to the left edge of the header rule. Center only cover, break and stamp compositions.

---

## 6. Imagery

- **Question art:** each trivia question has a themed visual in `components/art/` (attention map, hex leak, hash ring, commit graph, trademark card, pixel screen, HAL eye). They are built from the same tokens, flat, with one crimson mark. Catalogue and rules: `quiz-slides`; APIs: [references/components.md](references/components.md).

- **The brain:** `public/brain.png`, H. Mayo's 1827 engraving (Wellcome Collection, **CC BY 4.0**, [source](https://commons.wikimedia.org/wiki/File:H._Mayo_%22Series_of_engravings%22,_1827;_brain_Wellcome_L0015852.jpg)), keyed to alpha and tinted `--dm-red`. Use it with `image: /brain.png` on the cover or `<Stack :image>`, where it sits *between* the stacked words with `mix-blend-mode: multiply`. **Attribution is required** on any slide that shows it: `credit: 'Engraving: H. Mayo, 1827 · Wellcome Collection · CC BY 4.0'`.
- **New engravings:** public-domain or CC BY anatomical and technical engravings fit the style. Process them the same way: key the paper to transparency, tint crimson, crop tight.
- **Question images:** `public/q/NN.(jpg|png|svg)`, framed 2.5px ink, slight desaturation (the `trivia` layout does this). Placeholder: `public/q/01.svg` or `.dm-hatch`.
- No stock photos with their own color grading, no emoji, no clip-art.

---

## 7. Motion

| What | Duration | Easing |
|---|---|---|
| Curve token | | `--dm-ease: cubic-bezier(.2,.8,.2,1)` |
| Slide transition | Slidev `fade` | |
| v-click reveal | .35s, `translateY(8px)` + fade | `--dm-ease` |
| Answer / letter drop-in | .3–.35s `dm-in-up` | `--dm-ease` |
| Stamp | .45s `dm-stamp` scale 1.6 → .94 → 1 | `--dm-ease` |
| Scoreboard bars | .9s `scaleX` | `--dm-ease` |
| Art entrance (per question) | .4–1.6s once on slide enter: cells fade, lines draw, rows leak | `--dm-ease` / `steps()` for pixel things |
| Timer warn colour | .3s | ease |
| Timer last 3 s | .5s `dm-pulse` blink | `steps(1)` |

Animate `transform` and `opacity` only (data bars use `scaleX`). `prefers-reduced-motion` collapses all
of it globally. Motion confirms a state change and never decorates.

---

## 8. Voice of the interface

- Labels are terse nouns in both languages: `Întrebarea · Вопрос`, `Timp · Время`, `Runda · Раунд`.
- Section labels above h1: `NN · Name · Название` in mono crimson.
- Headlines are short imperative or statement: `Verificați foile`, `După runda 1`.
- Points: `10 p · 10 б`. Time: `30 s`.

---

## 9. Do / don't

| Do | Don't |
|---|---|
| One crimson thing per slide that carries the meaning | Crimson borders, crimson headings "for style" |
| Give every question its own art from its subject | Reuse a generic icon as a question's art |
| Let art hint at a clue already in the text | Show the answer's name, logo or mascot |
| Split long display words like the poster | Hyphenate or shrink to fit on one line |
| Shorten a clue that won't fit at ~0.85rem | Lower `minSize` until it fits |
| Mono for labels, numbers, code | Mono for paragraphs |
| RO and RU on the same slide | A separate slide per language |
| Square, flat, bordered | Rounded cards, shadows, gradients |

---

## 10. Checklist for a new slide or component
1. Colors are `var(--dm-*)` only, and crimson is in one of the listed roles.
2. Numbers in `.dm-num`, labels in `.dm-label`, display text in `.dm-display`.
3. Bilingual: RO first and bold, RU second and soft. Quotes and diacritics are correct.
4. If it reacts to clicks, `clicks:` is set in the frontmatter (see `quiz-slides`).
5. Checked in the browser at every click state, with diacritics and overflow verified.
