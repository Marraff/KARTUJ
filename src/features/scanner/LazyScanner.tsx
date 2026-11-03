import { lazy, Suspense, type ComponentProps } from 'react'
import { texts } from '../../texts/sk'
import styles from './Scanner.module.css'

// zxing is large: download it only when the user opens the scanner for the first time.
const Scanner = lazy(() => import('./Scanner').then((module) => ({ default: module.Scanner })))

export function LazyScanner(props: ComponentProps<typeof Scanner>) {
  const fallback = (
    <div className={styles.overlay}>
      <p className={styles.hint}>{texts.scan.starting}</p>
    </div>
  )

  return (
    <Suspense fallback={fallback}>
      <Scanner {...props} />
    </Suspense>
  )
}
