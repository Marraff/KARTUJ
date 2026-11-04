import { Code128Reader, NotFoundException, OneDReader, type BitArray } from '@zxing/library'

/**
 * Fix for a bug in @zxing/library 0.23.0 (check again when updating zxing).
 *
 * Code128Reader.findStartPattern slides a window of 6 bar widths along the row, but shifts it
 * with `counters = counters.slice(2)`, which shrinks the array to 4 items. After the first shift
 * the start pattern can never match, so a Code 128 barcode is read only when the row begins
 * right at the barcode. In real photos/screenshots/camera frames there is almost always
 * something before it (a dark table, a colored app background...), so reading failed.
 *
 * This is the original method with the shift done in place (as in the Java ZXing original).
 * decodeRow calls it as `Code128Reader.findStartPattern(row)`, so replacing it is enough.
 */

type Code128Internals = {
  findStartPattern: (row: BitArray) => Int32Array
  CODE_PATTERNS: Int32Array[]
  MAX_AVG_VARIANCE: number
  MAX_INDIVIDUAL_VARIANCE: number
  CODE_START_A: number
  CODE_START_C: number
}

type OneDReaderInternals = {
  patternMatchVariance: (counters: Int32Array, pattern: Int32Array, maxIndividualVariance: number) => number
}

const code128 = Code128Reader as unknown as Code128Internals
const oneD = OneDReader as unknown as OneDReaderInternals
const PATTERN_LENGTH = 6

function findStartPattern(row: BitArray): Int32Array {
  const width = row.getSize()
  const rowOffset = row.getNextSet(0)
  const counters = new Int32Array(PATTERN_LENGTH)
  let counterPosition = 0
  let patternStart = rowOffset
  let isWhite = false

  for (let i = rowOffset; i < width; i++) {
    if (row.get(i) !== isWhite) {
      counters[counterPosition]++
      continue
    }
    if (counterPosition === PATTERN_LENGTH - 1) {
      const bestMatch = findBestStartCode(counters)
      // A start pattern needs white space before it (at least half of its width).
      const quietZoneStart = Math.max(0, patternStart - (i - patternStart) / 2)
      if (bestMatch >= 0 && row.isRange(quietZoneStart, patternStart, false)) {
        return Int32Array.from([patternStart, i, bestMatch])
      }
      patternStart += counters[0] + counters[1]
      // The fix: shift in place, the array keeps its 6 items.
      counters.copyWithin(0, 2)
      counters[counterPosition - 1] = 0
      counters[counterPosition] = 0
      counterPosition--
    } else {
      counterPosition++
    }
    counters[counterPosition] = 1
    isWhite = !isWhite
  }
  throw new NotFoundException()
}

function findBestStartCode(counters: Int32Array): number {
  let bestVariance = code128.MAX_AVG_VARIANCE
  let bestMatch = -1
  for (let startCode = code128.CODE_START_A; startCode <= code128.CODE_START_C; startCode++) {
    const variance = oneD.patternMatchVariance(
      counters,
      code128.CODE_PATTERNS[startCode],
      code128.MAX_INDIVIDUAL_VARIANCE,
    )
    if (variance < bestVariance) {
      bestVariance = variance
      bestMatch = startCode
    }
  }
  return bestMatch
}

/** Call once before reading codes (createReader does it). */
export function fixCode128Reader() {
  code128.findStartPattern = findStartPattern
}
