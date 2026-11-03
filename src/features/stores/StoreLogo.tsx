import { useState } from 'react'
import { getLogoUrl, type Store } from './storeCatalog'
import styles from './StoreLogo.module.css'

type StoreLogoProps = {
  store?: Store
  /** Card name – its first letter is shown when there is no logo. */
  name: string
  /** Letter color for cards without a logo (usually the card color). */
  color: string
  size?: 'sm' | 'md' | 'lg'
}

/** White rounded badge with the store logo, or the first letter of the name. Decorative only. */
export function StoreLogo({ store, name, color, size = 'md' }: StoreLogoProps) {
  const [failedLogoId, setFailedLogoId] = useState<string>()
  const showLogo = store !== undefined && failedLogoId !== store.id
  const letter = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <span className={`${styles.badge} ${styles[size]}`} aria-hidden="true">
      {showLogo ? (
        <img
          className={styles.logo}
          src={getLogoUrl(store)}
          alt=""
          draggable={false}
          onError={() => setFailedLogoId(store.id)}
        />
      ) : (
        // Letter color is user data (card color), so it is set inline.
        <span className={styles.letter} style={{ color }}>
          {letter}
        </span>
      )}
    </span>
  )
}
