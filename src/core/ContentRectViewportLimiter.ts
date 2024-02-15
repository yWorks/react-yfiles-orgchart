import { CanvasComponent, Rect, ViewportLimiter } from 'yfiles'

/**
 * A viewport limiter implementation that limits panning to the client area if the whole
 * graph content rectangle fits and limits the panning to the content rectangle if any of it's
 * dimensions is larger than the suggested viewport
 */
export class ContentRectViewportLimiter extends ViewportLimiter {
  limitViewport(canvas: CanvasComponent, suggestedViewport: Rect): Rect {
    const leftX = canvas.contentRect.x
    const rightX = canvas.contentRect.bottomRight.x
    const suggestedX = suggestedViewport.x
    // we want to be able to pan the graph out of the center, however keep 20% of the viewport displaying graph items
    const limiterPaddingX = canvas.viewport.width * 0.8

    let newX
    if (rightX - leftX + limiterPaddingX > suggestedViewport.width) {
      newX = Math.max(
        leftX - limiterPaddingX,
        Math.min(rightX + limiterPaddingX - suggestedViewport.width, suggestedX)
      )
    } else {
      if (suggestedX > leftX) {
        newX = leftX
      } else if (suggestedViewport.width + suggestedX > rightX) {
        newX = suggestedX
      } else {
        newX = -suggestedViewport.width + rightX
      }
    }

    const topY = canvas.contentRect.y
    const bottomY = canvas.contentRect.bottomLeft.y
    const suggestedY = suggestedViewport.y
    // we want to be able to pan the graph out of the center, however keep 20% of the viewport displaying graph items
    const limiterPaddingY = canvas.viewport.height * 0.8

    let newY
    if (bottomY - topY + limiterPaddingY > suggestedViewport.height) {
      newY = Math.max(
        topY - limiterPaddingY,
        Math.min(bottomY + limiterPaddingY - suggestedViewport.height, suggestedY)
      )
    } else {
      if (suggestedY > topY) {
        newY = topY
      } else if (suggestedViewport.height + suggestedY > bottomY) {
        newY = suggestedY
      } else {
        newY = -suggestedViewport.height + bottomY
      }
    }

    return new Rect(newX, newY, suggestedViewport.width, suggestedViewport.height)
  }
}
