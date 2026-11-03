import { useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { TextField } from '../../components/TextField'
import { texts } from '../../texts/sk'
import { BarcodeView } from '../barcode/BarcodeView'
import { BARCODE_FORMATS, guessFormat, isValidCode } from '../barcode/barcodeFormats'
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
  note: '',
  favorite: false,
}

export function CardForm({ initialValues, isSaving, errorMessage, onSubmit, onDelete }: CardFormProps) {
  const [values, setValues] = useState<CardInput>(initialValues ?? EMPTY_CARD)
  // Once the user picks a format by hand, stop guessing it from the typed number.
  const [isFormatChosen, setIsFormatChosen] = useState(initialValues !== undefined)
  const [showErrors, setShowErrors] = useState(false)

  const code = values.code.trim()
  const errors = validate(values)
  const visibleErrors = showErrors ? errors : {}
  const canPreview = isValidCode(code, values.format)

  function update(changes: Partial<CardInput>) {
    setValues((current) => ({ ...current, ...changes }))
  }

  function handleCodeChange(newCode: string) {
    const changes: Partial<CardInput> = { code: newCode }
    if (!isFormatChosen) changes.format = guessFormat(newCode.trim())
    update(changes)
  }

  function handleFormatChange(format: BarcodeFormat) {
    setIsFormatChosen(true)
    update({ format })
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (Object.keys(errors).length > 0) {
      setShowErrors(true)
      return
    }
    onSubmit({
      ...values,
      name: values.name.trim(),
      code,
      note: values.note?.trim() || undefined,
    })
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
        autoFocus={initialValues === undefined}
      />

      <TextField
        label={texts.cardForm.code}
        value={values.code}
        onChange={handleCodeChange}
        placeholder={texts.cardForm.codePlaceholder}
        error={visibleErrors.code}
        required
      />

      <div className={styles.field}>
        <label htmlFor="card-format" className={styles.label}>
          {texts.cardForm.format}
        </label>
        <select
          id="card-format"
          className={styles.select}
          value={values.format}
          onChange={(event) => handleFormatChange(event.target.value as BarcodeFormat)}
        >
          {BARCODE_FORMATS.map((format) => (
            <option key={format} value={format}>
              {texts.barcodeFormats[format]}
            </option>
          ))}
        </select>
      </div>

      <ColorPicker value={values.color} onChange={(color) => update({ color })} />

      <TextField
        label={texts.cardForm.note}
        value={values.note ?? ''}
        onChange={(note) => update({ note })}
        placeholder={texts.cardForm.notePlaceholder}
        multiline
      />

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
