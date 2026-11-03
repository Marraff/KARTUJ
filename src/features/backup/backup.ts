import { BARCODE_FORMATS } from '../barcode/barcodeFormats'
import type { BarcodeFormat, Card } from '../cards/types'

// Backup file format. Bump BACKUP_VERSION only with a migration in parseBackup.
const BACKUP_APP = 'kartuj'
const BACKUP_VERSION = 1

type BackupFile = {
  app: typeof BACKUP_APP
  version: number
  exportedAt: number
  cards: Card[]
}

export type ParsedBackup = {
  cards: Card[]
  /** Cards in the file that were damaged and could not be restored. */
  invalidCount: number
}

export type BackupErrorReason = 'notJson' | 'notKartujBackup' | 'newerVersion'

export class BackupError extends Error {
  readonly reason: BackupErrorReason

  constructor(reason: BackupErrorReason) {
    super(`Invalid backup: ${reason}`)
    this.name = 'BackupError'
    this.reason = reason
  }
}

export function createBackupJson(cards: Card[]): string {
  const backup: BackupFile = { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: Date.now(), cards }
  return JSON.stringify(backup, null, 2)
}

/** "kartuj-zaloha-2026-11-03.json" */
export function createBackupFileName(date = new Date()): string {
  const day = date.toISOString().slice(0, 10)
  return `kartuj-zaloha-${day}.json`
}

/** Validates a backup file. Throws BackupError when the file is not usable at all. */
export function parseBackup(text: string): ParsedBackup {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new BackupError('notJson')
  }

  if (!isRecord(data) || data.app !== BACKUP_APP || !Array.isArray(data.cards)) {
    throw new BackupError('notKartujBackup')
  }
  if (typeof data.version !== 'number' || data.version > BACKUP_VERSION) {
    throw new BackupError('newerVersion')
  }

  const cards = data.cards.filter(isValidCard)
  return { cards, invalidCount: data.cards.length - cards.length }
}

/**
 * Saves the backup. On phones the share sheet lets the user pick iCloud / Google Drive /
 * Files; where file sharing is not supported, the file is downloaded instead.
 * Returns false when the user closed the share sheet without saving.
 */
export async function saveBackupFile(json: string, fileName: string): Promise<boolean> {
  const file = new File([json], fileName, { type: 'application/json' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return false
      // Sharing failed for another reason – fall back to a plain download.
    }
  }

  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  // Give the browser time to start the download before releasing the file.
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
  return true
}

function isValidCard(value: unknown): value is Card {
  if (!isRecord(value)) return false
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    isNonEmptyString(value.code) &&
    BARCODE_FORMATS.includes(value.format as BarcodeFormat) &&
    typeof value.color === 'string' &&
    /^#[0-9a-f]{6}$/i.test(value.color) &&
    (value.note === undefined || typeof value.note === 'string') &&
    typeof value.favorite === 'boolean' &&
    isNonNegativeNumber(value.usageCount) &&
    isNonNegativeNumber(value.createdAt) &&
    isNonNegativeNumber(value.updatedAt) &&
    (value.lastUsedAt === undefined || isNonNegativeNumber(value.lastUsedAt))
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}
