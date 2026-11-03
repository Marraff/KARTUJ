import { useLiveQuery } from 'dexie-react-hooks'
import { getCard, listCards } from './cardsRepo'
import type { Card } from './types'

/** All cards, sorted. `undefined` while loading. Re-renders on every DB change. */
export function useCards(): Card[] | undefined {
  return useLiveQuery(listCards, [])
}

/**
 * One card by id.
 * `undefined` = still loading, `null` = card does not exist.
 */
export function useCard(id: string | undefined): Card | null | undefined {
  return useLiveQuery(async () => {
    if (!id) return null
    return (await getCard(id)) ?? null
  }, [id])
}
