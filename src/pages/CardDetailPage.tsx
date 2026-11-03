import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { IconButton } from '../components/IconButton'
import { EditIcon } from '../components/icons'
import { Page } from '../components/Page'
import { BarcodeView } from '../features/barcode/BarcodeView'
import { FullscreenBarcode } from '../features/barcode/FullscreenBarcode'
import { markCardUsed } from '../features/cards/cardsRepo'
import type { Card } from '../features/cards/types'
import { useCard } from '../features/cards/useCards'
import { useWakeLock } from '../lib/useWakeLock'
import { texts } from '../texts/sk'
import styles from './CardDetailPage.module.css'

export function CardDetailPage() {
  const { id } = useParams()
  const card = useCard(id)

  if (card === undefined || card === null) {
    return (
      <Page title={texts.cardDetail.title} showBack>
        <p>{card === undefined ? texts.common.loading : texts.cardDetail.notFound}</p>
      </Page>
    )
  }

  return <CardDetail card={card} />
}

type CardDetailProps = {
  card: Card
}

function CardDetail({ card }: CardDetailProps) {
  const navigate = useNavigate()
  const [isFullscreen, setIsFullscreen] = useState(false)
  useWakeLock()

  // Count one "use" per opening of the detail (drives sorting in the list).
  useEffect(() => {
    markCardUsed(card.id).catch((error: unknown) => console.error('markCardUsed failed', error))
  }, [card.id])

  const editButton = (
    <IconButton label={texts.common.edit} onClick={() => navigate(`/card/${card.id}/edit`)}>
      <EditIcon />
    </IconButton>
  )

  return (
    <Page title={card.name} showBack headerActions={editButton}>
      <button
        type="button"
        className={styles.barcodeButton}
        onClick={() => setIsFullscreen(true)}
        aria-label={texts.cardDetail.tapToEnlarge}
      >
        <BarcodeView code={card.code} format={card.format} />
      </button>
      <p className={styles.hint}>{texts.cardDetail.tapToEnlarge}</p>
      <p className={styles.hint}>💡 {texts.cardDetail.brightnessHint}</p>

      {isFullscreen && (
        <FullscreenBarcode code={card.code} format={card.format} onClose={() => setIsFullscreen(false)} />
      )}
    </Page>
  )
}
