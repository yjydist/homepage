interface IconProps {
  /** Material Symbols ligature name, e.g. "star", "schedule". */
  name: string
  /** Font size; defaults to 1em so the icon scales with surrounding text. */
  size?: number | string
  className?: string
  filled?: boolean
  weight?: number
  grade?: number
  opticalSize?: number
}

/**
 * Renders a Material Symbols Outlined ligature glyph.
 *
 * The ligature is case-sensitive: neither this span nor any ancestor may
 * apply `uppercase`/`capitalize`, or the ligature will not resolve.
 */
export default function Icon({
  name,
  size = '1em',
  className,
  filled = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        fontFamily: "'Material Symbols Outlined Variable'",
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        fontFeatureSettings: '"liga" 1',
        fontSize: size,
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
