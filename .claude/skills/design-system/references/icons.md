# Icons: Phosphor Bold

Collection `ph` from `@iconify-json/ph` (installed). Every name below was checked against the
installed set, in both the base and the `-bold` variants.

## How to write them

| Context | Syntax |
|---|---|
| Markdown or Vue template | `<ph-timer-bold />` |
| Filled "on" state | `<ph-star-fill />` |
| In a `v-for` / dynamic | `<span class="i-ph-timer-bold" />`. The full class string must appear literally in a source file, because UnoCSS can't see computed names. |
| Inside a tag | `<Tag variant="red"><ph-timer-bold /> 30 s</Tag>` |

## Rules
- **Bold weight only** (the regular weight is too thin next to 900 type). Use `-fill` sparingly, for one "active" state.
- Color is `currentColor`: ink by default, crimson only when the icon *is* the crimson role (the `?` on the ask line, a warning timer).
- Sizes: `1.1em` inline with labels; `1.5em` beside the ask line; `2.2–4rem` as a standalone glyph. Never as a big decorative hero; the brain engraving owns that job.
- One icon per element. No icon rows as decoration.
- Don't use icons in place of words the audience must understand. They label text; they never replace it.

## Catalogue by use

### Time
| Icon | Use |
|---|---|
| `timer` | Timer caption, "time" tags (default) |
| `hourglass-high` · `hourglass-medium` · `hourglass-low` | Optional staged time states |
| `alarm` | Time's up callouts |
| `play` · `pause` · `stop` · `arrow-counter-clockwise` | Host controls (presenter-facing only) |

### Quiz flow
| Icon | Use |
|---|---|
| `question` | The ask line in `trivia` (crimson) |
| `lightbulb` | Hint / indiciu · подсказка |
| `info` | Rules, notes |
| `warning` | Penalties, rule reminders |
| `pencil-simple-line` · `note-pencil` | "Write it on the sheet" |
| `hand-pointing` | "Raise your hand" / buzzer round |
| `eye` · `eye-slash` | Reveal / hidden |
| `check` · `check-circle` | Correct, done, "it ran" (the device list in `RunScreen`) |
| `x` · `x-circle` | Wrong, closed |

### Teams & results
| Icon | Use |
|---|---|
| `users-three` | Teams, echipe · команды |
| `user-circle` | Single participant / host |
| `trophy` | Winner, final standings |
| `medal` | Places 2–3, prizes |
| `crown` | Leader after a round |
| `ranking` | Scoreboard heading |
| `star` · `sparkle` | Bonus question |
| `fire` | Streak, hard question |
| `flag-checkered` | End of round / end of game |

### Topic categories (match the category tag)
| Icon | Category |
|---|---|
| `code` · `code-block` · `brackets-curly` | Programming · Программирование |
| `terminal-window` | Systems, Unix, shell |
| `bug` · `bug-beetle` · `bug-droid` | Debug · Отладка |
| `binary` · `cpu` | Hardware, low level |
| `database` · `hard-drives` | Databases · Базы данных |
| `globe` · `wifi-high` · `bluetooth` | Networks, web · Сети |
| `shield-warning` · `lock-simple` · `key` | Security · Безопасность |
| `git-branch` | Version control, open source |
| `robot` · `brain` | AI · ИИ |
| `game-controller` | Games · Игры |
| `film-strip` | Film & pop culture · Кино |
| `paint-brush` | Art · Искусство / Cultură |
| `music-note` | Music · Музыка |
| `book-open` | History, literature |
| `skull` | Infamous failures, "dead" tech |

### Event & logistics
| Icon | Use |
|---|---|
| `coffee` | Break · pauză · перерыв |
| `calendar-blank` | Date |
| `map-pin` | Room 222/4 |
| `microphone` · `speaker-high` | Audio round, "listen" |
| `image` | Image question placeholder |
| `arrow-right` · `arrow-left` | Next / previous (presenter-facing) |

## Adding an icon
Search https://icones.js.org/collection/ph, pick the **Bold** variant, and confirm it exists locally:
```bash
node -e "const s=new Set(Object.keys(require('@iconify-json/ph/icons.json').icons));console.log(s.has('NAME-bold'))"
```
Then add it to this catalogue under its use.
