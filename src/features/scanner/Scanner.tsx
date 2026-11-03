import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { IconButton } from '../../components/IconButton'
import { CloseIcon } from '../../components/icons'
import { isIos } from '../../lib/platform'
import { texts } from '../../texts/sk'
import type { BarcodeFormat } from '../cards/types'
import { createReader } from './createReader'
import { fromZxingFormat } from './scanFormats'
import styles from './Scanner.module.css'

type ScannerProps = {
  onDetected: (code: string, format: BarcodeFormat) => void
  onClose: () => void
}

type ScannerStatus = 'starting' | 'scanning' | 'error'

/** Full-screen camera view that reads one barcode and reports it. */
export function Scanner({ onDetected, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // The camera API exists only on https (or localhost) – known before the first render.
  const isSecure = window.isSecureContext
  const [status, setStatus] = useState<ScannerStatus>(isSecure ? 'starting' : 'error')
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    isSecure ? undefined : texts.scan.errors.insecure,
  )
  // Keep the latest callback without restarting the camera when the parent re-renders.
  const onDetectedRef = useRef(onDetected)
  useEffect(() => {
    onDetectedRef.current = onDetected
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video || !window.isSecureContext) return

    const reader = createReader()
    // Shared with the async callbacks: the effect may be cleaned up before the camera starts.
    const state: { stop?: () => void; isActive: boolean; isDone: boolean } = { isActive: true, isDone: false }

    const constraints: MediaStreamConstraints = {
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
    }

    reader
      .decodeFromConstraints(constraints, video, (result, _error, controls) => {
        if (!result || state.isDone) return
        const format = fromZxingFormat(result.getBarcodeFormat())
        if (!format) return
        state.isDone = true
        controls.stop()
        navigator.vibrate?.(80)
        onDetectedRef.current(result.getText(), format)
      })
      .then((controls) => {
        if (state.isActive) {
          state.stop = () => controls.stop()
          setStatus('scanning')
        } else {
          controls.stop()
        }
      })
      .catch((error: unknown) => {
        if (!state.isActive) return
        console.error('Camera start failed', error)
        setStatus('error')
        setErrorMessage(getCameraErrorMessage(error))
      })

    return () => {
      state.isActive = false
      state.stop?.()
    }
  }, [])

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={texts.scan.title}>
      <video ref={videoRef} className={styles.video} muted playsInline />

      <div className={styles.topBar}>
        <IconButton label={texts.common.close} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      {status !== 'error' && (
        <>
          <div className={styles.frame} aria-hidden="true" />
          <p className={styles.hint}>{status === 'starting' ? texts.scan.starting : texts.scan.hint}</p>
        </>
      )}

      {status === 'error' && (
        <div className={styles.error} role="alert">
          <p>{errorMessage}</p>
          {errorMessage === texts.scan.errors.permissionDenied && <p className={styles.help}>{getPermissionHelp()}</p>}
        </div>
      )}

      <div className={styles.bottomBar}>
        <Button variant="secondary" onClick={onClose}>
          {texts.scan.manualEntry}
        </Button>
      </div>
    </div>
  )
}

function getCameraErrorMessage(error: unknown): string {
  const name = error instanceof Error ? error.name : ''
  if (name === 'NotAllowedError' || name === 'SecurityError') return texts.scan.errors.permissionDenied
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return texts.scan.errors.noCamera
  return texts.scan.errors.generic
}

function getPermissionHelp(): string {
  return isIos() ? texts.scan.errors.permissionHelpIos : texts.scan.errors.permissionHelpAndroid
}
