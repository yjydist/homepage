interface IconProps {
  /** Material Symbols ligature name, e.g. "star", "schedule". */
  name: string
  /** Font size; defaults to 1em so the icon scales with surrounding text. */
  size?: number | string
  className?: string
}

/**
 * Renders a Material Symbols Outlined ligature glyph.
 *
 * The ligature is case-sensitive: neither this span nor any ancestor may
 * change the case of this text via CSS, or the ligature will not resolve.
 *
 * Weight is pinned to 400 so glyphs stay regular even inside bold text.
 * No FILL/GRAD/opsz props are offered: the imported wght.css ships a
 * single-axis font file, so those settings would have no effect.
 */
export default function Icon({
  name,
  size = '1em',
  className,
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        fontFamily: "'Material Symbols Outlined Variable'",
        fontFeatureSettings: '"liga" 1',
        fontSize: size,
        fontWeight: 400,
        lineHeight: 1,
        display: 'inline-block',
        verticalAlign: '-0.125em',
        userSelect: 'none',
      }}
    >
      {name}
    </span>
  )
}
