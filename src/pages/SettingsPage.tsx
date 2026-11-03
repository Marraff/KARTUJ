import type { ReactNode } from 'react'
import { Page } from '../components/Page'
import { BackupSection } from '../features/backup/BackupSection'
import { useCards } from '../features/cards/useCards'
import { InstallGuide } from '../features/install/InstallGuide'
import { useStoragePersisted } from '../lib/useStoragePersisted'
import { texts } from '../texts/sk'
import styles from './SettingsPage.module.css'

export function SettingsPage() {
  const cards = useCards()
  const isPersisted = useStoragePersisted()

  return (
    <Page title={texts.settings.title} showBack>
      <SettingsSection title={texts.settings.backupTitle}>
        {cards === undefined ? <p>{texts.common.loading}</p> : <BackupSection cards={cards} />}
      </SettingsSection>

      <SettingsSection title={texts.settings.installTitle}>
        <InstallGuide />
      </SettingsSection>

      <SettingsSection title={texts.settings.aboutTitle}>
        <dl className={styles.about}>
          <dt>{texts.settings.version}</dt>
          <dd>{__APP_VERSION__}</dd>
          {isPersisted !== undefined && (
            <>
              <dt>{texts.settings.storage}</dt>
              <dd>{isPersisted ? texts.settings.storagePersistent : texts.settings.storageBestEffort}</dd>
            </>
          )}
        </dl>
        <p className={styles.privacy}>{texts.settings.privacy}</p>
      </SettingsSection>
    </Page>
  )
}

type SettingsSectionProps = {
  title: string
  children: ReactNode
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.card}>{children}</div>
    </section>
  )
}
