import { Link } from 'react-router'
import { Page } from '../components/Page'
import { texts } from '../texts/sk'

export function NotFoundPage() {
  return (
    <Page title={texts.notFound.title}>
      <p>
        <Link to="/">{texts.notFound.backHome}</Link>
      </p>
    </Page>
  )
}
