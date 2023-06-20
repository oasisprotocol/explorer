export const getElementViewportOffset = (el: HTMLElement, elementHeight = el.clientHeight) => {
  const windowHeight = window.outerHeight,
    elRect = el.getBoundingClientRect(),
    top = elRect.top,
    bottom = elRect.bottom
  return Math.max(0, top > 0 ? Math.min(elementHeight, windowHeight - top) : Math.min(bottom, windowHeight))
}
