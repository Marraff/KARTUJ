import { Button } from '../../components/Button'
import { promptInstall, useInstallPrompt } from '../../lib/installPrompt'
import { isAndroid, isIos, isStandalone } from '../../lib/platform'
import { texts } from '../../texts/sk'
import styles from './InstallGuide.module.css'

/** Platform-specific install instructions (or "installed" when running from the home screen). */
export function InstallGuide() {
  const { canPrompt, justInstalled } = useInstallPrompt()

  if (isStandalone() || justInstalled) {
    return <p className={styles.installed}>{texts.install.installed}</p>
  }

  // On a computer we do not know which phone the reader has: show both.
  const showIos = isIos() || !isAndroid()
  const showAndroid = isAndroid() || !isIos()

  return (
    <div className={styles.guide}>
      {canPrompt && <Button onClick={() => void promptInstall()}>{texts.install.installButton}</Button>}

      {showIos && (
        <section>
          <h3 className={styles.platform}>iPhone</h3>
          <ol className={styles.steps}>
            {texts.install.iosSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {showAndroid && !canPrompt && (
        <section>
          <h3 className={styles.platform}>Android</h3>
          <ol className={styles.steps}>
            {texts.install.androidSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
