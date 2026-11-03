import type { ReactNode } from 'react'
import { useGoBack } from '../lib/useGoBack'
import { texts } from '../texts/sk'
import { IconButton } from './IconButton'
import { BackIcon } from './icons'
import styles from './Header.module.css'

type HeaderProps = {
  title: string
  showBack?: boolean
  /** IconButtons shown on the right side. */
  actions?: ReactNode
}

export function Header({ title, showBack = false, actions }: HeaderProps) {
  const goBack = useGoBack()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {showBack && (
          <div className={styles.back}>
            <IconButton label={texts.common.back} onClick={() => goBack()}>
              <BackIcon />
            </IconButton>
          </div>
        )}
        <h1 className={styles.title}>{title}</h1>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  )
}
