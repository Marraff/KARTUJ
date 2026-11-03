import { useLocation, useNavigate } from 'react-router'
import { useGoBack } from '../../lib/useGoBack'

type ScannerOverlay = {
  isOpen: boolean
  open: () => void
  close: () => void
}

/**
 * The scanner is an overlay over the current page, but opening it adds a history
 * entry (same URL, state `scanning`). So the Android back button/gesture closes
 * the scanner instead of leaving the form, and the form keeps its typed values.
 */
export function useScannerOverlay(): ScannerOverlay {
  const location = useLocation()
  const navigate = useNavigate()
  const goBack = useGoBack()
  const state: unknown = location.state
  const isOpen = typeof state === 'object' && state !== null && 'scanning' in state && state.scanning === true

  return {
    isOpen,
    open: () => navigate(location.pathname, { state: { scanning: true } }),
    // Fallback: same page without the overlay (e.g. after a reload with the scanner open).
    close: () => goBack(location.pathname),
  }
}
