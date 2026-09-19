// Entrance timelines created while the fullscreen gate is up are held here and played when it closes.
const doc = document
export const fullscreenSupported = () => Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled)
export const isFullscreen = () => Boolean(doc.fullscreenElement || doc.webkitFullscreenElement)

let gated = fullscreenSupported() && !isFullscreen()
const held = new Set()

export const isGated = () => gated

export function setGated(value) {
  gated = value
  if (gated) return
  held.forEach((tl) => tl.play())
  held.clear()
}

export function holdWhileGated(tl) {
  if (!gated) return tl
  tl.pause()
  held.add(tl)
  return tl
}
