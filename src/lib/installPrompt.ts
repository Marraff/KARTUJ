import { useSyncExternalStore } from 'react'

// Chrome/Edge on Android fire `beforeinstallprompt` once, early after page load.
// We keep the event, so an "Install" button can open the native install dialog later.
// Safari (iPhone) never fires it – there the user installs via Share → Add to Home Screen.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: BeforeInstallPromptEvent | undefined
let isInstalledNow = false
// Snapshot for useSyncExternalStore: must change on every update, stable otherwise.
let version = 0
const listeners = new Set<() => void>()

function notify() {
  version += 1
  listeners.forEach((listener) => listener())
}

/** Call once at startup (main.tsx), before React renders. */
export function initInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault() // we show our own button instead of the mini-infobar
    deferredPrompt = event as BeforeInstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = undefined
    isInstalledNow = true
    notify()
  })
}

/** Opens the native install dialog. Returns true when the user installed the app. */
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) return false
  const promptEvent = deferredPrompt
  await promptEvent.prompt()
  const { outcome } = await promptEvent.userChoice
  // The event can be used only once.
  deferredPrompt = undefined
  notify()
  return outcome === 'accepted'
}

type InstallPromptState = {
  /** Android Chrome: the native install dialog is available. */
  canPrompt: boolean
  /** Installed during this visit (the page still runs in the browser tab). */
  justInstalled: boolean
}

export function useInstallPrompt(): InstallPromptState {
  useSyncExternalStore(subscribe, () => version)
  return { canPrompt: deferredPrompt !== undefined, justInstalled: isInstalledNow }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
