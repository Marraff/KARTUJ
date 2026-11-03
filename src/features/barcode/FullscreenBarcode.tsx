import { useEffect } from 'react'
import { texts } from '../../texts/sk'
import type { BarcodeFormat } from '../cards/types'
import { BarcodeView } from './BarcodeView'
import styles from './FullscreenBarcode.module.css'

type FullscreenBarcodeProps = {
  code: string
  format: BarcodeFormat
  onClose: () => void
}

/** White full-screen overlay; linear barcodes are rotated to use the full phone height. */
export function FullscreenBarcode({ code, format, onClose }: FullscreenBarcodeProps) {
  const isLinear = format !== 'QR_CODE'

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={code}>
      <button type="button" className={styles.closeArea} onClick={onClose} aria-label={texts.common.close}>
        <div className={isLinear ? styles.rotated : styles.square}>
          <BarcodeView code={code} format={format} />
        </div>
      </button>
    </div>
  )
}
