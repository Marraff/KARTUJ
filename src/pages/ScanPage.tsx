import { Page } from '../components/Page'
import { texts } from '../texts/sk'

export function ScanPage() {
  return (
    <Page title={texts.scan.title} showBack>
      {/* TODO(next step): Scanner (camera + @zxing/browser), manual entry button */}
      <p>{texts.scan.title}</p>
    </Page>
  )
}
