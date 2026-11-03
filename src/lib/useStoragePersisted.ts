import { useEffect, useState } from 'react'

/** Whether the browser promised not to evict our data. `undefined` while checking / unsupported. */
export function useStoragePersisted(): boolean | undefined {
  const [isPersisted, setIsPersisted] = useState<boolean>()

  useEffect(() => {
    let isActive = true
    navigator.storage
      ?.persisted?.()
      .then((value) => {
        if (isActive) setIsPersisted(value)
      })
      .catch(() => {
        // Unsupported or blocked – leave undefined.
      })
    return () => {
      isActive = false
    }
  }, [])

  return isPersisted
}
