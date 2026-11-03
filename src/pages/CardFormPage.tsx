import { useParams } from 'react-router'
import { Page } from '../components/Page'
import { texts } from '../texts/sk'

/** Used for both "/card/new" and "/card/:id/edit". */
export function CardFormPage() {
  const { id } = useParams()
  const isEditing = id !== undefined
  const title = isEditing ? texts.cardForm.editTitle : texts.cardForm.newTitle

  return (
    <Page title={title} showBack>
      {/* TODO(next step): form fields, live barcode preview, save/delete */}
      <p>{title}</p>
    </Page>
  )
}
