import { Link } from 'react-router'
import { getTextColorFor } from './cardColors'
import type { Card } from './types'
import styles from './CardTile.module.css'

type CardTileProps = {
  card: Card
}

export function CardTile({ card }: CardTileProps) {
  // Card color is user data, so it has to be set inline; everything else stays in CSS.
  const colorStyle = { background: card.color, color: getTextColorFor(card.color) }

  return (
    <Link to={`/card/${card.id}`} className={styles.tile} style={colorStyle}>
      <span className={styles.name}>{card.name}</span>
      {card.favorite && (
        <span className={styles.star} aria-hidden="true">
          ★
        </span>
      )}
    </Link>
  )
}
