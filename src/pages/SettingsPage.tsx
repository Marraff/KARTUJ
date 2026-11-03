import { Page } from '../components/Page'
import { texts } from '../texts/sk'

export function SettingsPage() {
  return (
    <Page title={texts.settings.title} showBack>
      {/* TODO(next step): backup export/import, install guide, about */}
      <p>{texts.settings.title}</p>
    </Page>
  )
}
