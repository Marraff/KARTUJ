import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'
import type { BarcodeFormat } from '../cards/types'
import { formatCodeForDisplay, isValidCode, toJsBarcodeFormat } from './barcodeFormats'
import styles from './BarcodeView.module.css'

type BarcodeViewProps = {
  code: string
  format: BarcodeFormat
  /** Hide the human-readable number under the code (e.g. in small previews). */
  hideNumber?: boolean
}

// Always black on white (also in dark mode) – scanners at the checkout need high contrast.
const BAR_COLOR = '#000000'
const BACKGROUND = '#ffffff'

export function BarcodeView({ code, format, hideNumber = false }: BarcodeViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canRender = isValidCode(code, format)
  const isQr = format === 'QR_CODE'

  useEffect(() => {
    if (!canRender) return
    if (format === 'QR_CODE') {
      if (!canvasRef.current) return
      QRCode.toCanvas(canvasRef.current, code, {
        width: 512,
        margin: 0,
        color: { dark: BAR_COLOR, light: BACKGROUND },
      }).catch((error: unknown) => console.error('QR render failed', error))
      return
    }
    if (!svgRef.current) return
    JsBarcode(svgRef.current, code, {
      format: toJsBarcodeFormat(format),
      displayValue: false,
      margin: 0,
      width: 3,
      height: 120,
      lineColor: BAR_COLOR,
      background: BACKGROUND,
    })
  }, [code, format, canRender])

  if (!canRender) return null

  return (
    <div className={styles.box}>
      {isQr ? (
        <canvas ref={canvasRef} className={styles.qr} />
      ) : (
        <svg ref={svgRef} className={styles.linear} preserveAspectRatio="none" />
      )}
      {!hideNumber && <p className={styles.number}>{formatCodeForDisplay(code)}</p>}
    </div>
  )
}
