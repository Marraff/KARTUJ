/** iPhone / iPad (iPadOS reports itself as a Mac, but has a touch screen). */
export function isIos(): boolean {
  const userAgent = navigator.userAgent
  return /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1)
}

export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent)
}

/** True when the app runs installed (from the home screen), not in a browser tab. */
export function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}
