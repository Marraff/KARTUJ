import type { BarcodeFormat } from '../cards/types'

export type ScanResult = {
  code: string
  format: BarcodeFormat
}

/**
 * Reads a barcode/QR code from a picked photo or screenshot (all in the phone, nothing is uploaded).
 * Resolves `null` when the image has no readable code; rejects when the file is not an image.
 */
export async function scanImageFile(file: File): Promise<ScanResult | null> {
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    // zxing is large: load it only when the user actually picks an image.
    const { decodeImage } = await import('./decodeImage')
    return decodeImage(image)
  } finally {
    URL.revokeObjectURL(url)
  }
}
