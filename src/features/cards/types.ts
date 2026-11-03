export type BarcodeFormat =
  | 'EAN_13'
  | 'EAN_8'
  | 'UPC_A'
  | 'CODE_128'
  | 'CODE_39'
  | 'ITF'
  | 'QR_CODE'

export type Card = {
  id: string
  name: string
  code: string
  format: BarcodeFormat
  color: string
  note?: string
  favorite: boolean
  usageCount: number
  createdAt: number
  updatedAt: number
  lastUsedAt?: number
}

/** Fields the user fills in the form; the rest is managed by cardsRepo. */
export type CardInput = Pick<Card, 'name' | 'code' | 'format' | 'color' | 'note' | 'favorite'>
