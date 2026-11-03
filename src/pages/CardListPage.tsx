import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { IconButton } from '../components/IconButton'
import { CardsIcon, PlusIcon, SearchIcon, SettingsIcon } from '../components/icons'
import { Page } from '../components/Page'
import { CardTile } from '../features/cards/CardTile'
import type { Card } from '../features/cards/types'
import { useCards } from '../features/cards/useCards'
import { InstallBanner } from '../features/install/InstallBanner'
import { normalizeForSearch } from '../lib/text'
import { texts } from '../texts/sk'
import styles from './CardListPage.module.css'

export function CardListPage() {
  const navigate = useNavigate()
  const cards = useCards()
  const [search, setSearch] = useState('')

  const settingsButton = (
    <IconButton label={texts.cardList.settings} onClick={() => navigate('/settings')}>
      <SettingsIcon />
    </IconButton>
  )

  function goToNewCard() {
    navigate('/card/new')
  }

  if (cards === undefined) {
    return (
      <Page title={texts.appName} headerActions={settingsButton}>
        <p>{texts.common.loading}</p>
      </Page>
    )
  }

  if (cards.length === 0) {
    return (
      <Page title={texts.appName} headerActions={settingsButton}>
        <InstallBanner />
        <EmptyState
          icon={<CardsIcon size={64} />}
          title={texts.cardList.emptyTitle}
          text={texts.cardList.emptyText}
          action={<Button onClick={goToNewCard}>{texts.cardList.addCard}</Button>}
        />
      </Page>
    )
  }

  const query = normalizeForSearch(search)
  const isSearching = query.length > 0
  const matchingCards = isSearching ? cards.filter((card) => normalizeForSearch(card.name).includes(query)) : cards
  const favoriteCards = matchingCards.filter((card) => card.favorite)
  const otherCards = matchingCards.filter((card) => !card.favorite)

  return (
    <Page title={texts.appName} headerActions={settingsButton}>
      <InstallBanner />
      <label className={styles.search}>
        <SearchIcon size={20} />
        <input
          type="search"
          className={styles.searchInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={texts.cardList.searchPlaceholder}
          aria-label={texts.cardList.searchLabel}
        />
      </label>

      {matchingCards.length === 0 && <p className={styles.noResults}>{texts.cardList.noResults}</p>}

      {favoriteCards.length > 0 && <CardSection title={texts.cardList.favorites} cards={favoriteCards} />}
      {otherCards.length > 0 && (
        <CardSection
          // Without favorites a "All cards" heading is just noise.
          title={favoriteCards.length > 0 ? texts.cardList.allCards : undefined}
          cards={otherCards}
        />
      )}

      <button type="button" className={styles.fab} onClick={goToNewCard} aria-label={texts.cardList.addCard}>
        <PlusIcon size={28} />
      </button>
    </Page>
  )
}

type CardSectionProps = {
  title?: string
  cards: Card[]
}

function CardSection({ title, cards }: CardSectionProps) {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <ul className={styles.grid}>
        {cards.map((card) => (
          <li key={card.id}>
            <CardTile card={card} />
          </li>
        ))}
      </ul>
    </section>
  )
}
