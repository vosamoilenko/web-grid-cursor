class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  // Convert pixel coordinates to a normalized space
  static toNormalizedSpace(pxX, pxY, screenWidth, screenHeight) {
    return new Vector2(
      (pxX - screenWidth / 2) / screenWidth,
      -((pxY - screenHeight / 2) / screenHeight)
    )
  }

  // Calculate the distance between two vectors
  static getDistanceBetween2Points(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
  }

  // Convert normalized coordinates back to pixel space
  static toPixelCoordinates(normX, normY, screenWidth, screenHeight) {
    return new Vector2(
      normX * screenWidth + screenWidth / 2,
      screenHeight / 2 - normY * screenHeight
    )
  }

  // Map event coordinates to a Vector2 instance
  static getCoordinatesfromMouseEvent(e) {
    return new Vector2(e.clientX, e.clientY)
  }

  static length(v) {
    return Math.sqrt(Math.pow(v.x) + Math.pow(v.y))
  }

  // Get the center of an HTML element as a Vector2
  static getHTMLElementCenter(el) {
    const rect = el.getBoundingClientRect()
    return new Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

  // Get the center of an HTML element as a Vector2
  static getBboxCenter(bbox) {
    return new Vector2(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2)
  }

  static getDistanceToCenter(el, targetV2) {
    const center = Vector2.getHTMLOrBboxCenter({ el })
    const distance = Vector2.getDistanceBetween2Points(targetV2, center)
    const diagonalRadius = Vector2.getElementDiagonalRadius(el)

    return distance / diagonalRadius
  }

  static getHTMLOrBboxCenter(options) {
    const { el, bbox } = options

    if (!bbox && !el) {
      throw new Error("one of the value from options must be provided")
    }
    let rect = bbox

    if (!bbox && el) {
      rect = el.getBoundingClientRect()
    }

    return new Vector2(rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

  // Calculate the maximum distance from the center to any corner of the element
  static getElementDiagonalRadius(el) {
    const rect = el.getBoundingClientRect()
    return Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2))
  }
}

// export default Vector2
window.Vector2 = Vector2
