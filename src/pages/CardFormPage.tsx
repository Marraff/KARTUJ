import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Page } from '../components/Page'
import { CardForm } from '../features/cards/CardForm'
import { createCard, deleteCard, updateCard } from '../features/cards/cardsRepo'
import type { Card, CardInput } from '../features/cards/types'
import { useCard } from '../features/cards/useCards'
import { useGoBack } from '../lib/useGoBack'
import { texts } from '../texts/sk'

/** Used for both "/card/new" and "/card/:id/edit". */
export function CardFormPage() {
  const { id } = useParams()
  const isEditing = id !== undefined
  const existingCard = useCard(id)
  const title = isEditing ? texts.cardForm.editTitle : texts.cardForm.newTitle

  if (isEditing && existingCard === undefined) {
    return (
      <Page title={title} showBack>
        <p>{texts.common.loading}</p>
      </Page>
    )
  }

  if (isEditing && existingCard === null) {
    return (
      <Page title={title} showBack>
        <p>{texts.cardDetail.notFound}</p>
      </Page>
    )
  }

  return (
    <Page title={title} showBack>
      <CardFormContent existingCard={existingCard ?? undefined} />
    </Page>
  )
}

type CardFormContentProps = {
  existingCard?: Card
}

function CardFormContent({ existingCard }: CardFormContentProps) {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  async function handleSubmit(input: CardInput) {
    setIsSaving(true)
    setErrorMessage(undefined)
    try {
      if (existingCard) {
        await updateCard(existingCard.id, input)
        goBack(`/card/${existingCard.id}`)
      } else {
        const card = await createCard(input)
        // Replace the form in history, so "back" from the detail goes to the list.
        navigate(`/card/${card.id}`, { replace: true })
      }
    } catch (error) {
      console.error('Saving card failed', error)
      setErrorMessage(texts.cardForm.errors.saveFailed)
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!existingCard) return
    setIsDeleteDialogOpen(false)
    setIsSaving(true)
    try {
      await deleteCard(existingCard.id)
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Deleting card failed', error)
      setErrorMessage(texts.cardForm.errors.deleteFailed)
      setIsSaving(false)
    }
  }

  return (
    <>
      <CardForm
        initialValues={existingCard && toCardInput(existingCard)}
        isSaving={isSaving}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onDelete={existingCard ? () => setIsDeleteDialogOpen(true) : undefined}
      />
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title={texts.cardForm.deleteConfirmTitle}
        text={texts.cardForm.deleteConfirmText}
        confirmLabel={texts.common.delete}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  )
}

function toCardInput(card: Card): CardInput {
  return {
    name: card.name,
    code: card.code,
    format: card.format,
    color: card.color,
    storeId: card.storeId,
    favorite: card.favorite,
  }
}
