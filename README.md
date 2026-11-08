# Debugging Minds

Slidev deck for the **Debugging Minds** team quiz. Departamentul Informatică · FMI · USM,
11.11.2026 · 14:00 · room 222/4. Questions are bilingual (Romanian + Russian).

```bash
pnpm install
pnpm dev        # http://localhost:3030, presenter view at /presenter
pnpm build      # static site in dist/
pnpm export     # PDF backup (needs playwright-chromium)
```

`slides.md` holds the first 7 trivia questions, each with its own themed visual, and the end-of-game answer sheet. The design system (colors, type, icons, components) is documented in a skill rather than in slides.
See `.claude/skills/design-system` (visual system) and `.claude/skills/quiz-slides` (authoring).

Cover engraving: H. Mayo, *Series of engravings*, 1827. Wellcome Collection, CC BY 4.0.
