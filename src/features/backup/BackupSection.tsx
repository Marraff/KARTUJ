import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../../components/Button'
import { Dialog } from '../../components/Dialog'
import { texts } from '../../texts/sk'
import { findExistingIds, importCards, type ImportConflictMode } from '../cards/cardsRepo'
import type { Card } from '../cards/types'
import { BackupError, createBackupFileName, createBackupJson, parseBackup, saveBackupFile } from './backup'
import { getLastBackupAt, markBackupDone } from './backupStatus'
import styles from './BackupSection.module.css'

type BackupSectionProps = {
  /** Passed in already loaded: iOS allows the share sheet only right after a tap, without awaiting the DB. */
  cards: Card[]
}

type Message = { kind: 'success' | 'error'; text: string }

type PendingImport = {
  cards: Card[]
  invalidCount: number
  conflictCount: number
}

export function BackupSection({ cards: currentCards }: BackupSectionProps) {
  const cardCount = currentCards.length
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<Message>()
  const [isBusy, setIsBusy] = useState(false)
  const [pendingImport, setPendingImport] = useState<PendingImport>()
  const [lastBackupAt, setLastBackupAt] = useState(getLastBackupAt)

  async function handleBackup() {
    setMessage(undefined)
    setIsBusy(true)
    try {
      const saved = await saveBackupFile(createBackupJson(currentCards), createBackupFileName())
      if (saved) {
        const now = Date.now()
        markBackupDone(now)
        setLastBackupAt(now)
        setMessage({ kind: 'success', text: texts.settings.backupSaved })
      }
    } catch (error) {
      console.error('Backup failed', error)
      setMessage({ kind: 'error', text: texts.settings.backupFailed })
    } finally {
      setIsBusy(false)
    }
  }

  async function handleFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset, so choosing the same file again triggers onChange again.
    event.target.value = ''
    if (!file) return

    setMessage(undefined)
    setIsBusy(true)
    try {
      const { cards, invalidCount } = parseBackup(await file.text())
      if (cards.length === 0) {
        setMessage({ kind: 'error', text: texts.settings.restoreNothing })
        return
      }
      const conflictCount = (await findExistingIds(cards.map((card) => card.id))).length
      if (conflictCount > 0) {
        setPendingImport({ cards, invalidCount, conflictCount })
        return
      }
      await runImport(cards, invalidCount, 'skip')
    } catch (error) {
      if (error instanceof BackupError) {
        setMessage({ kind: 'error', text: texts.settings.restoreErrors[error.reason] })
      } else {
        console.error('Restore failed', error)
        setMessage({ kind: 'error', text: texts.settings.restoreFailed })
      }
    } finally {
      setIsBusy(false)
    }
  }

  async function runImport(cards: Card[], invalidCount: number, mode: ImportConflictMode) {
    const { added, overwritten, skipped } = await importCards(cards, mode)
    let text = texts.settings.restoreResult(added, overwritten, skipped)
    if (invalidCount > 0) text += texts.settings.restoreInvalid(invalidCount)
    setMessage({ kind: 'success', text })
  }

  async function resolveConflict(mode: ImportConflictMode) {
    if (!pendingImport) return
    const { cards, invalidCount } = pendingImport
    setPendingImport(undefined)
    setIsBusy(true)
    try {
      await runImport(cards, invalidCount, mode)
    } catch (error) {
      console.error('Restore failed', error)
      setMessage({ kind: 'error', text: texts.settings.restoreFailed })
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className={styles.section}>
      <p className={styles.text}>{texts.settings.backupText}</p>
      <p className={styles.text}>
        {lastBackupAt === undefined
          ? texts.settings.lastBackupNever
          : texts.settings.lastBackup(new Date(lastBackupAt).toLocaleDateString('sk-SK'))}
      </p>

      <Button onClick={handleBackup} disabled={isBusy || cardCount === 0}>
        {texts.settings.backupButton(cardCount)}
      </Button>
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isBusy}>
        {texts.settings.restoreButton}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className={styles.hiddenInput}
        onChange={handleFileChosen}
        tabIndex={-1}
        aria-hidden="true"
      />

      {cardCount === 0 && <p className={styles.text}>{texts.settings.backupEmpty}</p>}
      {message && (
        <p className={message.kind === 'error' ? styles.error : styles.success} role="status">
          {message.text}
        </p>
      )}

      <Dialog
        open={pendingImport !== undefined}
        title={texts.settings.conflictTitle}
        text={pendingImport ? texts.settings.conflictText(pendingImport.conflictCount) : ''}
        onCancel={() => setPendingImport(undefined)}
        stacked
      >
        <Button onClick={() => resolveConflict('overwrite')}>{texts.settings.conflictOverwrite}</Button>
        <Button variant="secondary" onClick={() => resolveConflict('skip')}>
          {texts.settings.conflictSkip}
        </Button>
        <Button variant="secondary" onClick={() => setPendingImport(undefined)}>
          {texts.common.cancel}
        </Button>
      </Dialog>
    </div>
  )
}
