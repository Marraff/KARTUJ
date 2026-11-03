import { useNavigate } from 'react-router'

/**
 * Go one step back inside the app, or to `fallback` when there is no in-app history
 * (link opened directly, PWA started on a deep link, or the first entry was replaced).
 */
export function useGoBack(): (fallback?: string) => void {
  const navigate = useNavigate()

  return (fallback = '/') => {
    // react-router stores the position in its own history stack as `idx` (0 = first entry).
    const state: unknown = window.history.state
    const index = typeof state === 'object' && state !== null && 'idx' in state ? Number(state.idx) : 0
    if (index > 0) navigate(-1)
    else navigate(fallback, { replace: true })
  }
}
