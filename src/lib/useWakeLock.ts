import { useEffect } from 'react'

/**
 * Keeps the screen on while the component is mounted (Screen Wake Lock API,
 * Safari 16.4+, Chrome). Silently does nothing where unsupported.
 */
export function useWakeLock(): void {
  useEffect(() => {
    if (!('wakeLock' in navigator)) return

    // Mutable holder shared by the async callbacks below and the cleanup.
    const state: { sentinel?: WakeLockSentinel; isActive: boolean } = { isActive: true }

    async function acquire() {
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (state.isActive) state.sentinel = lock
        else void lock.release()
      } catch {
        // Denied (e.g. battery saver) – the app still works, the screen just may dim.
      }
    }

    // The browser drops the lock when the app goes to background; take it again on return.
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      state.isActive = false
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      void state.sentinel?.release()
    }
  }, [])
}
