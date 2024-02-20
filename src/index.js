// const Vector2 = require("./scripts/Vector2.js")
// const Grid = require("./scripts/Grid.js")
console.log('index.js')

function lerp(from, to, t) {
  return from + t * (to - from)
}

function renderLoop(cb) {
  cb()
  window.requestAnimationFrame(() => renderLoop(cb))
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
