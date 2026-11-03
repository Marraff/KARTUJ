import { Link, useNavigate } from 'react-router'
import { IconButton } from '../components/IconButton'
import { SettingsIcon } from '../components/icons'
import { Page } from '../components/Page'
import { useCards } from '../features/cards/useCards'
import { texts } from '../texts/sk'

export function CardListPage() {
  const navigate = useNavigate()
  const cards = useCards()

  const settingsButton = (
    <IconButton label={texts.cardList.settings} onClick={() => navigate('/settings')}>
      <SettingsIcon />
    </IconButton>
  )

  return (
    <Page title={texts.appName} headerActions={settingsButton}>
      {/* TODO(next step): search, CardTile grid, EmptyState, floating add button */}
      {cards === undefined && <p>{texts.common.loading}</p>}
      {cards?.length === 0 && <p>{texts.cardList.emptyTitle}</p>}
      {cards && cards.length > 0 && (
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              <Link to={`/card/${card.id}`}>{card.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <p>
        <Link to="/card/new">{texts.cardList.addCard}</Link>
      </p>
    </Page>
  )
}
