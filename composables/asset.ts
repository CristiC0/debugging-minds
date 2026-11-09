// Prefix a root-relative public path ('/brain.png') with Vite's base, so frontmatter images
// still resolve when the deck is built under a subpath (GitHub Pages: /<repo>/).
// Absolute URLs and data: URIs pass through untouched.
export function asset(path?: string): string | undefined {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path
}
