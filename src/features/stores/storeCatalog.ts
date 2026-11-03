import { normalizeForSearch } from '../../lib/text'

export type Store = {
  /** Also the logo file name: public/logos/<id>.webp */
  id: string
  /** Name filled into the card when the store is picked. */
  name: string
  /** Default tile color (taken from the logo / brand). */
  color: string
  /**
   * Lowercase words without diacritics that identify the store inside any card name
   * ("Lidl Plus SK" -> "lidl"). Matched as whole words, so "dm" does not match "admin".
   */
  keywords: string[]
}

// Logos come from the stores' official websites / Wikimedia Commons (see rules.txt → Obchody).
// To add a store: put a 128×128 WebP into public/logos/<id>.webp and add a line here.
export const STORES: readonly Store[] = [
  // Potraviny
  { id: 'lidl', name: 'Lidl Plus', color: '#0050aa', keywords: ['lidl'] },
  { id: 'kaufland', name: 'Kaufland Card', color: '#e01010', keywords: ['kaufland'] },
  { id: 'tesco', name: 'Tesco Clubcard', color: '#00539f', keywords: ['tesco', 'clubcard'] },
  { id: 'billa', name: 'BILLA Bonus', color: '#ffd000', keywords: ['billa'] },
  { id: 'coop-jednota', name: 'COOP Jednota', color: '#e02020', keywords: ['coop', 'jednota'] },
  { id: 'fresh', name: 'FRESH', color: '#50a030', keywords: ['fresh'] },
  { id: 'terno', name: 'TERNO', color: '#40b050', keywords: ['terno'] },
  // Drogérie a lekárne
  { id: 'dm', name: 'dm active beauty', color: '#203080', keywords: ['dm', 'active beauty'] },
  { id: 'teta', name: 'Teta', color: '#e090b0', keywords: ['teta'] },
  { id: 'rossmann', name: 'Rossmann', color: '#e02030', keywords: ['rossmann'] },
  { id: 'dr-max', name: 'Dr. Max', color: '#80c020', keywords: ['dr max', 'drmax'] },
  { id: 'benu', name: 'BENU Lekáreň', color: '#40b030', keywords: ['benu'] },
  // Oblečenie a obuv
  { id: 'hm', name: 'H&M', color: '#d02020', keywords: ['h&m', 'h & m', 'hm'] },
  { id: 'reserved', name: 'Reserved', color: '#111318', keywords: ['reserved'] },
  { id: 'ccc', name: 'CCC', color: '#202020', keywords: ['ccc'] },
  { id: 'deichmann', name: 'Deichmann', color: '#009050', keywords: ['deichmann'] },
  { id: 'pepco', name: 'Pepco', color: '#5050b0', keywords: ['pepco'] },
  { id: 'kik', name: 'KiK', color: '#e00010', keywords: ['kik'] },
  { id: 'lindex', name: 'Lindex', color: '#e00030', keywords: ['lindex'] },
  // Šport
  { id: 'decathlon', name: 'Decathlon', color: '#3040c0', keywords: ['decathlon'] },
  { id: 'sportisimo', name: 'Sportisimo', color: '#0050a0', keywords: ['sportisimo'] },
  { id: 'intersport', name: 'Intersport', color: '#104090', keywords: ['intersport'] },
  { id: 'hervis', name: 'Hervis', color: '#111318', keywords: ['hervis'] },
  // Dom a záhrada
  { id: 'ikea', name: 'IKEA Family', color: '#0058a3', keywords: ['ikea'] },
  { id: 'hornbach', name: 'Hornbach', color: '#ffa030', keywords: ['hornbach'] },
  { id: 'obi', name: 'OBI', color: '#f06000', keywords: ['obi'] },
  { id: 'mountfield', name: 'Mountfield', color: '#d01020', keywords: ['mountfield'] },
  // Elektro
  { id: 'alza', name: 'Alza', color: '#002060', keywords: ['alza'] },
  { id: 'datart', name: 'Datart', color: '#003060', keywords: ['datart'] },
  { id: 'nay', name: 'NAY', color: '#00b0f0', keywords: ['nay'] },
  // Benzínky
  { id: 'slovnaft', name: 'Slovnaft', color: '#fff000', keywords: ['slovnaft'] },
  { id: 'omv', name: 'OMV', color: '#002060', keywords: ['omv'] },
  { id: 'shell', name: 'Shell', color: '#ffd000', keywords: ['shell'] },
  // Ostatné
  { id: 'martinus', name: 'Martinus', color: '#c00000', keywords: ['martinus'] },
  { id: 'panta-rhei', name: 'Panta Rhei', color: '#001030', keywords: ['panta rhei', 'pantarhei'] },
  { id: 'yves-rocher', name: 'Yves Rocher', color: '#005030', keywords: ['yves rocher'] },
  { id: 'douglas', name: 'Douglas', color: '#c0f0e0', keywords: ['douglas'] },
  { id: 'notino', name: 'Notino', color: '#111318', keywords: ['notino'] },
]

const MAX_SUGGESTIONS = 6

export function getStoreById(id: string | undefined): Store | undefined {
  return id === undefined ? undefined : STORES.find((store) => store.id === id)
}

export function getLogoUrl(store: Store): string {
  return `/logos/${store.id}.webp`
}

/**
 * Store shown for a card: the one picked in the form, otherwise recognized from the name.
 * The name fallback also gives logos to cards created before the catalog existed.
 */
export function getCardStore(card: { storeId?: string; name: string }): Store | undefined {
  return getStoreById(card.storeId) ?? findStoreByName(card.name)
}

/** Store whose keyword appears as a whole word in the card name ("Moja Lidl karta" -> Lidl). */
export function findStoreByName(cardName: string): Store | undefined {
  const words = ` ${toWords(cardName)} `
  return STORES.find((store) => store.keywords.some((keyword) => words.includes(` ${keyword} `)))
}

/** Stores for the name field suggestions: name or keyword starting with / containing the query. */
export function searchStores(query: string): Store[] {
  const normalizedQuery = toWords(query)
  if (normalizedQuery.length === 0) return []
  const startsWith: Store[] = []
  const contains: Store[] = []
  for (const store of STORES) {
    const haystacks = [toWords(store.name), ...store.keywords]
    if (haystacks.some((text) => text.startsWith(normalizedQuery))) startsWith.push(store)
    else if (haystacks.some((text) => text.includes(normalizedQuery))) contains.push(store)
  }
  return [...startsWith, ...contains].slice(0, MAX_SUGGESTIONS)
}

/** "Dr. Max – Bratislava!" -> "dr max bratislava" (keeps "&" for H&M). */
function toWords(text: string): string {
  return normalizeForSearch(text)
    .replace(/[^a-z0-9&]+/g, ' ')
    .trim()
}
