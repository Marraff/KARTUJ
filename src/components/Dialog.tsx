import { useEffect, useId, useRef, type ReactNode } from 'react'
import styles from './Dialog.module.css'

type DialogProps = {
  open: boolean
  title: string
  text: string
  /** Called on Esc / system back gesture inside the dialog. */
  onCancel: () => void
  /** Buttons, stacked vertically when there are more than two. */
  children: ReactNode
  stacked?: boolean
}

/** Native <dialog>: focus trap, Esc to close and backdrop come from the browser. */
export function Dialog({ open, title, text, onCancel, children, stacked = false }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Keep React state as the single source of truth for "open".
        event.preventDefault()
        onCancel()
      }}
    >
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p className={styles.text}>{text}</p>
      <div className={stacked ? styles.actionsStacked : styles.actions}>{children}</div>
    </dialog>
  )
}
