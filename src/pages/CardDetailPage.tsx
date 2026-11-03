import { useNavigate, useParams } from 'react-router'
import { IconButton } from '../components/IconButton'
import { EditIcon } from '../components/icons'
import { Page } from '../components/Page'
import { useCard } from '../features/cards/useCards'
import { texts } from '../texts/sk'

export function CardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const card = useCard(id)

  if (card === undefined) {
    return (
      <Page title={texts.cardDetail.title} showBack>
        <p>{texts.common.loading}</p>
      </Page>
    )
  }

  if (card === null) {
    return (
      <Page title={texts.cardDetail.title} showBack>
        <p>{texts.cardDetail.notFound}</p>
      </Page>
    )
  }

  const editButton = (
    <IconButton label={texts.common.edit} onClick={() => navigate(`/card/${card.id}/edit`)}>
      <EditIcon />
    </IconButton>
  )

  return (
    <Page title={card.name} showBack headerActions={editButton}>
      {/* TODO(next step): BarcodeView, wake lock, markCardUsed, fullscreen */}
      <p>{card.code}</p>
      <p>{texts.cardDetail.brightnessHint}</p>
    </Page>
  )
}
