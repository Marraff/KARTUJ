import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../components/Button'
import { promptInstall, useInstallPrompt } from '../../lib/installPrompt'
import { isIos, isStandalone } from '../../lib/platform'
import { texts } from '../../texts/sk'
import styles from './InstallBanner.module.css'

const DISMISSED_KEY = 'kartuj.installBannerDismissedAt'
const SHOW_AGAIN_AFTER_MS = 14 * 24 * 60 * 60 * 1000 // 14 days

/** Invitation to install the app, shown on the card list while running in a browser tab. */
export function InstallBanner() {
  const navigate = useNavigate()
  const { canPrompt, justInstalled } = useInstallPrompt()
  const [isDismissed, setIsDismissed] = useState(wasDismissedRecently)

  if (isStandalone() || justInstalled || isDismissed) return null

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()))
    setIsDismissed(true)
  }

  return (
    <aside className={styles.banner} aria-label={texts.install.bannerTitle}>
      <h2 className={styles.title}>{texts.install.bannerTitle}</h2>
      <p className={styles.text}>{isIos() ? texts.install.bannerTextIos : texts.install.bannerTextAndroid}</p>
      <div className={styles.actions}>
        {canPrompt ? (
          <Button onClick={() => void promptInstall()}>{texts.install.installButton}</Button>
        ) : (
          <Button onClick={() => navigate('/settings')}>{texts.install.showHow}</Button>
        )}
        <Button variant="secondary" onClick={dismiss}>
          {texts.install.dismiss}
        </Button>
      </div>
    </aside>
  )
}

function wasDismissedRecently(): boolean {
  const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY))
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < SHOW_AGAIN_AFTER_MS
}
