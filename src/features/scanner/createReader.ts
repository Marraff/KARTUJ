import { BrowserMultiFormatReader } from '@zxing/browser'
import {
  DecodeHintType,
  MultiFormatOneDReader,
  NotFoundException,
  QRCodeReader,
  type BinaryBitmap,
  type Reader,
  type Result,
} from '@zxing/library'
import { fixCode128Reader } from './fixCode128Reader'
import { SCANNABLE_ZXING_FORMATS } from './scanFormats'

/**
 * Same as BrowserMultiFormatReader, but tries the 1D and QR readers itself.
 *
 * Why: in @zxing/library 0.23.0 NotFoundException does not extend ReaderException,
 * so MultiFormatReader logs a console warning for every camera frame without a code
 * (~10× per second). Throwing NotFoundException here keeps the browser scan loop retrying.
 */
class QuietMultiFormatReader extends BrowserMultiFormatReader {
  private readonly formatReaders: Reader[]
  private readonly decodeHints: Map<DecodeHintType, unknown>

  constructor(hints: Map<DecodeHintType, unknown>) {
    super(hints, { delayBetweenScanAttempts: 100 })
    this.decodeHints = hints
    this.formatReaders = [new MultiFormatOneDReader(hints), new QRCodeReader()]
  }

  override decodeBitmap(bitmap: BinaryBitmap): Result {
    for (const reader of this.formatReaders) {
      try {
        return reader.decode(bitmap, this.decodeHints)
      } catch {
        // No code of this type in the frame – try the next reader.
      }
    }
    throw new NotFoundException()
  }
}

type ReaderOptions = {
  /** Slower but finds more codes – for single images, too slow for live camera frames. */
  tryHarder?: boolean
}

export function createReader({ tryHarder = false }: ReaderOptions = {}): BrowserMultiFormatReader {
  fixCode128Reader()
  const hints = new Map<DecodeHintType, unknown>([[DecodeHintType.POSSIBLE_FORMATS, SCANNABLE_ZXING_FORMATS]])
  if (tryHarder) hints.set(DecodeHintType.TRY_HARDER, true)
  return new QuietMultiFormatReader(hints)
}
