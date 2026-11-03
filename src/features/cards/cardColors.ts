/** Colors offered in the card form (typical loyalty card brand colors). */
export const CARD_COLORS: readonly string[] = [
  '#2563eb', // blue
  '#0ea5e9', // light blue
  '#16a34a', // green
  '#84cc16', // lime
  '#facc15', // yellow
  '#f97316', // orange
  '#dc2626', // red
  '#db2777', // pink
  '#7c3aed', // purple
  '#111318', // black
]

export const DEFAULT_CARD_COLOR = CARD_COLORS[0]

/** Black or white text, whichever is readable on the given background color. */
export function getTextColorFor(hexBackground: string): '#000000' | '#ffffff' {
  const hex = hexBackground.replace('#', '')
  const red = parseInt(hex.slice(0, 2), 16)
  const green = parseInt(hex.slice(2, 4), 16)
  const blue = parseInt(hex.slice(4, 6), 16)
  // Perceived brightness (ITU-R BT.601), 0–255.
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000
  return brightness > 160 ? '#000000' : '#ffffff'
}
