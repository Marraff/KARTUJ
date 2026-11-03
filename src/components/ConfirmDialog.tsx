import { texts } from '../texts/sk'
import { Button } from './Button'
import { Dialog } from './Dialog'

type ConfirmDialogProps = {
  open: boolean
  title: string
  text: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** Yes/no question for destructive actions (the confirm button is red). */
export function ConfirmDialog({ open, title, text, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} title={title} text={text} onCancel={onCancel}>
      <Button variant="secondary" onClick={onCancel}>
        {texts.common.cancel}
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </Dialog>
  )
}
