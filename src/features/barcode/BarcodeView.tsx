import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'
import { useEffect, useRef, type CSSProperties } from 'react'
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
const MODULE_WIDTH = 3
// Checkout scanners need a white "quiet zone" on both sides (EAN: ~11 modules).
const QUIET_ZONE = 10 * MODULE_WIDTH

export function BarcodeView({ code, format, hideNumber = false }: BarcodeViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canRender = isValidCode(code, format)
  const isQr = format === 'QR_CODE'

  useEffect(() => {
    if (!canRender) return
    if (format === 'QR_CODE') {
      const canvas = canvasRef.current
      if (!canvas) return
      QRCode.toCanvas(canvas, code, {
        width: 512,
        margin: 0,
        color: { dark: BAR_COLOR, light: BACKGROUND },
      })
        .then(() => {
          // qrcode sets inline width/height (512px), which overrides our CSS and,
          // with max-width, stretches the code into a tall rectangle.
          canvas.style.removeProperty('width')
          canvas.style.removeProperty('height')
        })
        .catch((error: unknown) => console.error('QR render failed', error))
      return
    }
    if (!svgRef.current) return
    JsBarcode(svgRef.current, code, {
      format: toJsBarcodeFormat(format),
      displayValue: false,
      margin: 0,
      marginLeft: QUIET_ZONE,
      marginRight: QUIET_ZONE,
      width: MODULE_WIDTH,
      height: 120,
      lineColor: BAR_COLOR,
      background: BACKGROUND,
    })
  }, [code, format, canRender])

  if (!canRender) return null

  const displayNumber = formatCodeForDisplay(code)
  // CSS shrinks the font by this length so long numbers stay on one line.
  const numberStyle = { '--number-length': displayNumber.length } as CSSProperties

  return (
    <div className={styles.box}>
      {isQr ? (
        <canvas ref={canvasRef} className={styles.qr} />
      ) : (
        <svg ref={svgRef} className={styles.linear} preserveAspectRatio="none" />
      )}
      {!hideNumber && (
        <p className={styles.number} style={numberStyle}>
          {displayNumber}
        </p>
      )}
    </div>
  )
}
