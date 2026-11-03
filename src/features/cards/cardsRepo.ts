import { db } from '../../db/database'
import type { Card, CardInput } from './types'

// The only module allowed to read or write cards in the database.

export async function listCards(): Promise<Card[]> {
  const cards = await db.cards.toArray()
  return sortCards(cards)
}

export async function getCard(id: string): Promise<Card | undefined> {
  return db.cards.get(id)
}

export async function createCard(input: CardInput): Promise<Card> {
  const now = Date.now()
  const card: Card = {
    ...input,
    id: crypto.randomUUID(),
    usageCount: 0,
    createdAt: now,
    updatedAt: now,
  }
  await db.cards.add(card)
  return card
}

export async function updateCard(id: string, input: CardInput): Promise<void> {
  await db.cards.update(id, { ...input, updatedAt: Date.now() })
}

export async function deleteCard(id: string): Promise<void> {
  await db.cards.delete(id)
}

/** Called when the card is shown at the checkout. */
export async function markCardUsed(id: string): Promise<void> {
  await db.cards
    .where('id')
    .equals(id)
    .modify((card) => {
      card.usageCount += 1
      card.lastUsedAt = Date.now()
    })
}

export type ImportConflictMode = 'overwrite' | 'skip'

export type ImportResult = {
  added: number
  overwritten: number
  skipped: number
}

/** Ids of the given cards that already exist in the database. */
export async function findExistingIds(ids: string[]): Promise<string[]> {
  const existing = await db.cards.bulkGet(ids)
  return existing.filter((card) => card !== undefined).map((card) => card.id)
}

/** Restores cards from a backup in one transaction (all or nothing). */
export async function importCards(cards: Card[], conflictMode: ImportConflictMode): Promise<ImportResult> {
  return db.transaction('rw', db.cards, async () => {
    const existingIds = new Set(await findExistingIds(cards.map((card) => card.id)))
    const result: ImportResult = { added: 0, overwritten: 0, skipped: 0 }
    const toWrite: Card[] = []

    for (const card of cards) {
      const exists = existingIds.has(card.id)
      if (exists && conflictMode === 'skip') {
        result.skipped += 1
        continue
      }
      if (exists) result.overwritten += 1
      else result.added += 1
      toWrite.push(card)
    }

    await db.cards.bulkPut(toWrite)
    return result
  })
}

/** Favorites first, then most recently used, then by name. */
function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
    const usedDiff = (b.lastUsedAt ?? 0) - (a.lastUsedAt ?? 0)
    if (usedDiff !== 0) return usedDiff
    return a.name.localeCompare(b.name, 'sk')
  })
}
