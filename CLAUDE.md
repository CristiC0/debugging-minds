# Debugging Minds: quiz deck

Slidev 53 · `theme: default` with everything custom in `styles/`, `layouts/`, `components/`.

- Design system (palette, type, icons, texture, components) → skill `design-system`. Authoring questions → skill `quiz-slides`.
- Generic Slidev skills (copied from programming-fundamentals): `slide-reveals`, `slide-presenting`, `slide-code-blocks`, `slide-diagrams`.
- Every audience-facing content string is bilingual: RO first, RU second (`<Bi>`). Exception: chrome/meta labels (Question, category, pts, Time, Round, Answers) are English only.
- One accent color (`--dm-red`). No new hex values.
- One question format: `trivia` (clues + ask, answers at the end). Each question has its own art in `components/art/`. Slides need `clicks:`; components read `$clicks`.
- Verify in the browser (dev server port 3040 via `.claude/launch.json`) at every click state.
- `public/brain.png` is CC BY 4.0 (H. Mayo 1827, Wellcome Collection). Keep the credit line wherever it appears.
