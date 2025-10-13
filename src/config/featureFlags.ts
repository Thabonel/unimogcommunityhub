export const ENABLE_STRUCTURED_DATA: boolean = (() => {
  const v = (import.meta as any)?.env?.VITE_ENABLE_STRUCTURED_DATA
  // Default ON; set VITE_ENABLE_STRUCTURED_DATA="false" to disable
  if (typeof v === 'string') return v.toLowerCase() !== 'false'
  return true
})()

export function deferIdle(fn: () => void) {
  if (typeof (window as any).requestIdleCallback === 'function') {
    ;(window as any).requestIdleCallback(fn, { timeout: 1500 })
  } else {
    setTimeout(fn, 300)
  }
}

