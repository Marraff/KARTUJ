import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../../components/Button'
import { ImageIcon } from '../../components/icons'
import { texts } from '../../texts/sk'
import type { BarcodeFormat } from '../cards/types'
import { scanImageFile } from './scanImage'
import styles from './ImageScanButton.module.css'

type ImageScanButtonProps = {
  onDetected: (code: string, format: BarcodeFormat) => void
}

/**
 * Opens the phone's photo picker (gallery / screenshots) and reads the code from the picked image.
 * Needs no camera permission – the system hands over only the one picked image.
 */
export function ImageScanButton({ onDetected }: ImageScanButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isReading, setIsReading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset, so picking the same image again fires "change" again.
    event.target.value = ''
    if (!file) return

    setErrorMessage(undefined)
    setIsReading(true)
    try {
      const result = await scanImageFile(file)
      if (result) {
        navigator.vibrate?.(80)
        onDetected(result.code, result.format)
      } else {
        setErrorMessage(texts.scan.errors.imageNoCode)
      }
    } catch (error) {
      console.error('Reading image failed', error)
      setErrorMessage(texts.scan.errors.imageUnreadable)
    } finally {
      setIsReading(false)
    }
  }

  return (
    <div className={styles.field}>
      <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={isReading}>
        <ImageIcon />
        {isReading ? texts.scan.readingImage : texts.scan.fromImage}
      </Button>
      {/* No "capture" attribute: phones then offer the gallery, not only the camera. */}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
