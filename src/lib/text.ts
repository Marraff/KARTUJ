/** Lowercase and strip diacritics, so "lidl" finds "Lídl" and "billa" finds "BILLA". */
export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}
