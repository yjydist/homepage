// Maps a social link label (as written in content.toml) to a Material
// Symbols ligature name. Kept in a .ts file (no JSX) so oxlint's
// react/only-export-components rule does not flag it.
const SOCIAL_ICONS: Record<string, string> = {
  github: 'code',
  email: 'mail',
  mail: 'mail',
  twitter: 'alternate_email',
  x: 'alternate_email',
  linkedin: 'work',
  website: 'language',
  blog: 'rss_feed',
}

/** Returns the icon for a social label, falling back to `link`. */
export function socialIcon(label: string): string {
  return SOCIAL_ICONS[label.toLowerCase()] ?? 'link'
}
