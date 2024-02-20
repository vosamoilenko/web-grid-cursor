function lerp(from, to, t) {
  return from + t * (to - from)
}

function renderLoop(cb) {
  cb()
  window.requestAnimationFrame(() => renderLoop(cb))
}

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
  static fromMouseEvent(e) {
    return new Vector2(e.clientX, e.clientY)
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

  // Calculate the maximum distance from the center to any corner of the element
  static getElementDiagonalRadius(el) {
    const rect = el.getBoundingClientRect()
    return Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2))
  }
}

class Grid {
  container = null
  cb = () => {}

  map = []

  constructor(selector) {
    this.containerEl = document.querySelector(selector)
  }

  update(cb) {
    this.map.forEach((entry, index) => {
      cb(entry.el, index, entry.bbox)
    })
  }

  refresh(options) {
    this.create({
      size: this.size,
      cb: this.postCreateCb,
      ...options,
    })
  }

  create(options) {
    const { size, width, height, cb } = options
    this.size = size
    this.postCreateCb = cb

    const w = Math.floor(width / size)
    const h = Math.floor(height / size)

    this.containerEl.style.gridTemplateColumns = `repeat(${w}, minmax(0,1fr))`
    this.containerEl.style.gridTemplateRows = `repeat(${h},1fr)`
    this.containerEl.replaceChildren()

    this.createTiles(w * h, (el, index) => {
      // console.log(index);
      this.map.push({ el, bbox: el.getBoundingClientRect() })
      this.containerEl.append(el)
      this.postCreateCb && this.postCreateCb(el, index)
    })
  }

  createTile(index) {
    const el = document.createElement("div")
    el.classList.add("item")
    return el
  }

  createTiles(amount, cb) {
    return Array.from(Array(amount)).map((_, index) => {
      const tile = this.createTile(index)
      cb && cb(tile, index)
      return tile
    })
  }
}

let cursor = {
  x: 0,
  y: 0,
}
document.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX
  cursor.y = e.clientY
})

let timer = undefined
window.onresize = () => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    grid.refresh({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    })
  }, 100)
}

const grid = new Grid(".container")

grid.create({
  size: 50,
  width: document.body.clientWidth,
  height: document.body.clientHeight,
  cb: (el) => {
    el.addEventListener("mousemove", (e) => {
      const mousePos = Vector2.fromMouseEvent(e)

      const center = Vector2.getHTMLElementCenter(el)
      const diagonalRadius = Vector2.getElementDiagonalRadius(el)

      const distance = Vector2.getDistanceBetween2Points(mousePos, center)
      const opacity = 1 - distance / diagonalRadius

      el.style.opacity = lerp(+el.style.opacity + opacity, 0, 0.3)
    })
  },
})

renderLoop(() => {
  const cursorPosition = new Vector2(cursor.x, cursor.y)
  grid.update((el, index, bbox) => {
    // Calculate the center position of the HTML element
    const elementCenter = Vector2.getBboxCenter(bbox)

    // Calculate the diagonal radius of the element, which is half the distance from the center to a corner
    const elementDiagonalRadius = Vector2.getElementDiagonalRadius(el)

    // Determine the distance from a specified point (likely the cursor position) to the center of the element
    const distanceFromPointToCenter = Vector2.getDistanceBetween2Points(
      cursorPosition,
      elementCenter
    )

    // Calculate the ratio of the distance to the element's diagonal radius
    const distanceToRadiusRatio =
      distanceFromPointToCenter / elementDiagonalRadius

    // Calculate a dynamic factor based on the distance from the cursor to the window's width.
    // This could be an attempt to adjust the opacity based on horizontal cursor movement.
    const dynamicOpacityAdjustment =
      0.5 - distanceFromPointToCenter / window.innerWidth

    // Retrieve the current opacity of the element, defaulting to 0 if it's not set or is NaN
    let currentOpacity = parseFloat(el.style.opacity)
    if (isNaN(currentOpacity)) {
      currentOpacity = 0
    }

    // Calculate the new opacity based on the dynamic adjustment factor.
    // This could be intended to reduce the opacity as the cursor moves closer, but the exact behavior
    // depends on how`dynamicOpacityAdjustment` is applied.
    const newOpacity = currentOpacity + dynamicOpacityAdjustment

    // el.style.opacity = newOpacity
    el.style.opacity = lerp(+el.style.opacity, 0, 0.1)
    // el.style.opacity = lerp(newOpacity, 0, 0.1);
  })
})
