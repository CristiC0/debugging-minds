import { defineShikiSetup } from '@slidev/types'

// Monochrome dark code on an ink block; the red comes from line highlights (styles/index.css).
export default defineShikiSetup(() => ({
  themes: { dark: 'min-dark', light: 'min-dark' },
}))
