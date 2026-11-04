import { useState } from 'react'
import { Button } from '../../components/Button'
import { texts } from '../../texts/sk'
import type { Card } from '../cards/types'
import { createBackupFileName, createBackupJson, saveBackupFile } from './backup'
import { daysSince, dismissBackupReminder, getLastBackupAt, markBackupDone, shouldRemindBackup } from './backupStatus'
import styles from './BackupReminder.module.css'

type BackupReminderProps = {
  /** Already loaded: iOS opens the share sheet only right after a tap, without awaiting the DB. */
  cards: Card[]
}

/** Banner on the card list when cards changed since the last backup a while ago. */
export function BackupReminder({ cards }: BackupReminderProps) {
  const [isHidden, setIsHidden] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  if (isHidden || !shouldRemindBackup(cards)) return null

  const lastBackupAt = getLastBackupAt()

  async function handleBackup() {
    setErrorMessage(undefined)
    try {
      const saved = await saveBackupFile(createBackupJson(cards), createBackupFileName())
      if (!saved) return
      markBackupDone()
      setIsHidden(true)
    } catch (error) {
      console.error('Backup failed', error)
      setErrorMessage(texts.settings.backupFailed)
    }
  }

  function dismiss() {
    dismissBackupReminder()
    setIsHidden(true)
  }

  return (
    <aside className={styles.banner} aria-label={texts.backupReminder.title}>
      <h2 className={styles.title}>{texts.backupReminder.title}</h2>
      <p className={styles.text}>
        {lastBackupAt === undefined
          ? texts.backupReminder.neverText
          : texts.backupReminder.outdatedText(daysSince(lastBackupAt))}
      </p>
      {errorMessage && (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
      <div className={styles.actions}>
        <Button onClick={() => void handleBackup()}>{texts.backupReminder.backupButton}</Button>
        <Button variant="secondary" onClick={dismiss}>
          {texts.backupReminder.dismiss}
        </Button>
      </div>
    </aside>
  )
}
