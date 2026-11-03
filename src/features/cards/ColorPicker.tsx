import { texts } from '../../texts/sk'
import { CARD_COLORS } from './cardColors'
import styles from './ColorPicker.module.css'

type ColorPickerProps = {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  // A store's brand color (picked from the catalog) is usually not in the palette:
  // show it as the first swatch so the user sees what is selected.
  const colors = CARD_COLORS.includes(value) ? CARD_COLORS : [value, ...CARD_COLORS]

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{texts.cardForm.color}</legend>
      <div className={styles.colors}>
        {colors.map((color, index) => (
          // Swatch color is data, so it is set inline.
          <label key={color} className={styles.option} style={{ background: color }}>
            <input
              type="radio"
              name="card-color"
              value={color}
              checked={value === color}
              onChange={() => onChange(color)}
              className={styles.radio}
              aria-label={`${texts.cardForm.color} ${index + 1}`}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
