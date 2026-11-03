import { Dexie, type EntityTable } from 'dexie'
import type { Card } from '../features/cards/types'

export const db = new Dexie('kartuj') as Dexie & {
  cards: EntityTable<Card, 'id'>
}

// Schema changes: NEVER edit an existing version, always add version(n + 1) with .upgrade().
db.version(1).stores({
  cards: 'id, name, lastUsedAt',
})

/**
 * Asks the browser not to evict our data under storage pressure.
 * Browsers may silently refuse; the app works either way.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false
  try {
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch (error) {
    console.error('Persistent storage request failed', error)
    return false
  }
}
