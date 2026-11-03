import type { ReactNode } from 'react'
import styles from './IconButton.module.css'

type IconButtonProps = {
  /** Required: icon-only buttons have no visible text for screen readers. */
  label: string
  onClick: () => void
  children: ReactNode
}

export function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button type="button" className={styles.iconButton} onClick={onClick} aria-label={label} title={label}>
      {children}
    </button>
  )
}
