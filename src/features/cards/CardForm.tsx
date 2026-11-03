import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { CameraIcon } from '../../components/icons'
import { TextField } from '../../components/TextField'
import { texts } from '../../texts/sk'
import { BarcodeView } from '../barcode/BarcodeView'
import { guessFormat, isValidCode } from '../barcode/barcodeFormats'
import { LazyScanner } from '../scanner/LazyScanner'
import { useScannerOverlay } from '../scanner/useScannerOverlay'
import { DEFAULT_CARD_COLOR } from './cardColors'
import { ColorPicker } from './ColorPicker'
import type { BarcodeFormat, CardInput } from './types'
import styles from './CardForm.module.css'

type CardFormProps = {
  /** Existing card values when editing; empty form when undefined. */
  initialValues?: CardInput
  isSaving: boolean
  errorMessage?: string
  onSubmit: (input: CardInput) => void
  /** Shown only when editing. */
  onDelete?: () => void
}

type FieldErrors = {
  name?: string
  code?: string
}

const EMPTY_CARD: CardInput = {
  name: '',
  code: '',
  format: 'CODE_128',
  color: DEFAULT_CARD_COLOR,
  favorite: false,
}

// The barcode type is never shown to the user (it only confuses people):
// a scanned code keeps the exact type from the scanner, a typed number gets a guessed type.
export function CardForm({ initialValues, isSaving, errorMessage, onSubmit, onDelete }: CardFormProps) {
  const [values, setValues] = useState<CardInput>(initialValues ?? EMPTY_CARD)
  const [showErrors, setShowErrors] = useState(false)
  const scanner = useScannerOverlay()

  const code = values.code.trim()
  const errors = validate(values)
  const visibleErrors = showErrors ? errors : {}
  const canPreview = isValidCode(code, values.format)

  function update(changes: Partial<CardInput>) {
    setValues((current) => ({ ...current, ...changes }))
  }

  function handleCodeChange(newCode: string) {
    update({ code: newCode, format: guessFormat(newCode.trim()) })
  }

  function handleScanned(scannedCode: string, format: BarcodeFormat) {
    update({ code: scannedCode, format })
    scanner.close()
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (Object.keys(errors).length > 0) {
      setShowErrors(true)
      return
    }
    onSubmit({ ...values, name: values.name.trim(), code })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <TextField
        label={texts.cardForm.name}
        value={values.name}
        onChange={(name) => update({ name })}
        placeholder={texts.cardForm.namePlaceholder}
        error={visibleErrors.name}
        required
      />

      <Button variant="secondary" onClick={scanner.open}>
        <CameraIcon />
        {texts.scan.button}
      </Button>

      <TextField
        label={texts.cardForm.code}
        value={values.code}
        onChange={handleCodeChange}
        placeholder={texts.cardForm.codePlaceholder}
        error={visibleErrors.code}
        required
      />

      <ColorPicker value={values.color} onChange={(color) => update({ color })} />

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={values.favorite}
          onChange={(event) => update({ favorite: event.target.checked })}
        />
        {texts.cardForm.favorite}
      </label>

      {canPreview && (
        <div className={styles.field}>
          <span className={styles.label}>{texts.cardForm.preview}</span>
          <BarcodeView code={code} format={values.format} />
        </div>
      )}

      {errorMessage && (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      )}

      <div className={styles.actions}>
        <Button type="submit" disabled={isSaving}>
          {texts.common.save}
        </Button>
        {onDelete && (
          <Button variant="danger" onClick={onDelete} disabled={isSaving}>
            {texts.cardForm.deleteCard}
          </Button>
        )}
      </div>

      {scanner.isOpen && <LazyScanner onDetected={handleScanned} onClose={scanner.close} />}
    </form>
  )
}

function validate(values: CardInput): FieldErrors {
  const errors: FieldErrors = {}
  const code = values.code.trim()
  if (values.name.trim().length === 0) errors.name = texts.cardForm.errors.nameRequired
  if (code.length === 0) errors.code = texts.cardForm.errors.codeRequired
  else if (!isValidCode(code, values.format)) errors.code = texts.cardForm.errors.codeInvalid
  return errors
}
