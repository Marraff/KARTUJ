import type { Card } from '../cards/types'

// Stored in localStorage, not in the DB: it is a device setting, not card data
// (and must not travel inside a backup to another phone).
const LAST_BACKUP_KEY = 'kartuj.lastBackupAt'
const DISMISSED_KEY = 'kartuj.backupReminderDismissedAt'

const DAY_MS = 24 * 60 * 60 * 1000
// Safari may delete data of sites not used for 7 days (when not added to the home screen).
const REMIND_AFTER_MS = 7 * DAY_MS
const SHOW_AGAIN_AFTER_MS = 7 * DAY_MS

export function getLastBackupAt(): number | undefined {
  return readTime(LAST_BACKUP_KEY)
}

export function markBackupDone(now = Date.now()) {
  localStorage.setItem(LAST_BACKUP_KEY, String(now))
}

export function dismissBackupReminder(now = Date.now()) {
  localStorage.setItem(DISMISSED_KEY, String(now))
}

/**
 * Remind only when something is really missing in the backup: a card added or changed
 * after the last backup, and that change is already a week old. No changes = no nagging.
 */
export function shouldRemindBackup(cards: Card[], now = Date.now()): boolean {
  const dismissedAt = readTime(DISMISSED_KEY)
  if (dismissedAt !== undefined && now - dismissedAt < SHOW_AGAIN_AFTER_MS) return false

  const lastBackupAt = getLastBackupAt() ?? 0
  const changesSinceBackup = cards.filter((card) => card.updatedAt > lastBackupAt)
  if (changesSinceBackup.length === 0) return false

  const oldestChange = Math.min(...changesSinceBackup.map((card) => card.updatedAt))
  return now - oldestChange >= REMIND_AFTER_MS
}

/** Whole days since the timestamp (0 = today). */
export function daysSince(time: number, now = Date.now()): number {
  return Math.max(0, Math.floor((now - time) / DAY_MS))
}

function readTime(key: string): number | undefined {
  const value = Number(localStorage.getItem(key))
  return Number.isFinite(value) && value > 0 ? value : undefined
}
