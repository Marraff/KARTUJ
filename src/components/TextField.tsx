import { useId } from 'react'
import styles from './TextField.module.css'

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  multiline?: boolean
  /** Numeric keyboard on phones for card numbers. */
  inputMode?: 'text' | 'numeric'
  autoFocus?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  multiline = false,
  inputMode = 'text',
  autoFocus = false,
  onFocus,
  onBlur,
}: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const commonProps = {
    id,
    value,
    placeholder,
    required,
    autoFocus,
    onFocus,
    onBlur,
    className: `${styles.input} ${error ? styles.invalid : ''}`,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && ' *'}
      </label>
      {multiline ? (
        <textarea {...commonProps} rows={3} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          {...commonProps}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
