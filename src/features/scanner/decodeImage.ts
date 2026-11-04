import type { BrowserMultiFormatReader } from '@zxing/browser'
import type { ScanResult } from './scanImage'
import { createReader } from './createReader'
import { fromZxingFormat } from './scanFormats'

// Phone photos are huge (12 MP+). Decoding a smaller copy is much faster and often
// more reliable; several sizes are tried because a small code may need more pixels.
const MAX_SIDES = [1600, 1000, 600]
// 90° finds barcodes that are sideways (e.g. a card photographed upright).
// We rotate ourselves: zxing's own rotation is broken in 0.23.0 (throws "Could not create a Canvas").
const ROTATIONS = [0, 90]

/** Finds a barcode or QR code in a loaded image; `null` when there is none. */
export function decodeImage(image: HTMLImageElement): ScanResult | null {
  const reader = createReader({ tryHarder: true })
  const canvas = document.createElement('canvas')

  for (const scale of getScales(image)) {
    for (const rotation of ROTATIONS) {
      drawImage(canvas, image, scale, rotation)
      const result = tryDecode(reader, canvas)
      if (result) return result
    }
  }
  return null
}

function getScales(image: HTMLImageElement): number[] {
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight)
  // Never upscale; skip duplicates when the image is already small.
  const scales = MAX_SIDES.map((side) => Math.min(1, side / longestSide))
  return [...new Set(scales)]
}

function drawImage(canvas: HTMLCanvasElement, image: HTMLImageElement, scale: number, rotation: number) {
  const width = Math.round(image.naturalWidth * scale)
  const height = Math.round(image.naturalHeight * scale)
  const isSideways = rotation === 90
  canvas.width = isSideways ? height : width
  canvas.height = isSideways ? width : height

  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return
  context.translate(canvas.width / 2, canvas.height / 2)
  context.rotate((rotation * Math.PI) / 180)
  context.drawImage(image, -width / 2, -height / 2, width, height)
}

function tryDecode(reader: BrowserMultiFormatReader, canvas: HTMLCanvasElement): ScanResult | null {
  try {
    const result = reader.decodeFromCanvas(canvas)
    const format = fromZxingFormat(result.getBarcodeFormat())
    return format ? { code: result.getText(), format } : null
  } catch {
    // No code at this size/rotation – the caller tries the next one.
    return null
  }
}
