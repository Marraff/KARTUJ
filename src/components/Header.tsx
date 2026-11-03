import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
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
  const navigate = useNavigate()
  const location = useLocation()

  function goBack() {
    // A deep link opened directly has no history to go back to.
    if (location.key === 'default') {
      navigate('/', { replace: true })
    } else {
      navigate(-1)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {showBack && (
          <div className={styles.back}>
            <IconButton label={texts.common.back} onClick={goBack}>
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
