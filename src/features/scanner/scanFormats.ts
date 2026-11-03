import { BarcodeFormat as ZxingFormat } from '@zxing/library'
import { BARCODE_FORMATS } from '../barcode/barcodeFormats'
import type { BarcodeFormat } from '../cards/types'

/** Formats the scanner looks for – fewer formats = faster and fewer misreads. */
export const SCANNABLE_ZXING_FORMATS: ZxingFormat[] = BARCODE_FORMATS.map((format) => ZxingFormat[format])

/** zxing enum -> our format name (they share the same names, e.g. "EAN_13"). */
export function fromZxingFormat(zxingFormat: ZxingFormat): BarcodeFormat | undefined {
  const name = ZxingFormat[zxingFormat]
  return BARCODE_FORMATS.find((format) => format === name)
}
