import JsBarcode from 'jsbarcode'
import type { BarcodeFormat } from '../cards/types'

/** Formats the app can scan and draw (never shown to the user). */
export const BARCODE_FORMATS: readonly BarcodeFormat[] = [
  'CODE_128',
  'EAN_13',
  'EAN_8',
  'UPC_A',
  'CODE_39',
  'ITF',
  'QR_CODE',
]

/** Our format names -> JsBarcode format names (QR is rendered by the qrcode library). */
const JSBARCODE_FORMAT: Record<Exclude<BarcodeFormat, 'QR_CODE'>, string> = {
  CODE_128: 'CODE128',
  EAN_13: 'EAN13',
  EAN_8: 'EAN8',
  UPC_A: 'UPC',
  CODE_39: 'CODE39',
  ITF: 'ITF',
}

export function toJsBarcodeFormat(format: Exclude<BarcodeFormat, 'QR_CODE'>): string {
  return JSBARCODE_FORMAT[format]
}

/**
 * Guess the format from a manually typed number (the user never picks it).
 * Retail formats only when the check digit is valid; otherwise Code 128, which can
 * encode any number or text. Checkout scanners read all of these – what matters is the number.
 */
export function guessFormat(code: string): BarcodeFormat {
  const digitsOnly = /^\d+$/.test(code)
  if (digitsOnly && code.length === 13 && isValidCode(code, 'EAN_13')) return 'EAN_13'
  if (digitsOnly && code.length === 12 && isValidCode(code, 'UPC_A')) return 'UPC_A'
  if (digitsOnly && code.length === 8 && isValidCode(code, 'EAN_8')) return 'EAN_8'
  return 'CODE_128'
}

/** True when the code can be rendered in the given format (incl. check digit). */
export function isValidCode(code: string, format: BarcodeFormat): boolean {
  if (code.length === 0) return false
  if (format === 'QR_CODE') return true

  // JsBarcode is the source of truth: if it can draw it, the checkout can read it.
  let valid = false
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  try {
    JsBarcode(svg, code, {
      format: toJsBarcodeFormat(format),
      valid: (result) => {
        valid = result
      },
    })
  } catch {
    return false
  }
  return valid
}

/** "1234567890123" -> "1234 5678 9012 3" for easier reading at the checkout. */
export function formatCodeForDisplay(code: string): string {
  if (!/^\d+$/.test(code)) return code
  return code.replace(/(\d{4})(?=\d)/g, '$1 ')
}
