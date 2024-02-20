function lerp(from, to, t) {
  return from + t * (to - from)
}

function renderLoop(cb) {
  cb()
  window.requestAnimationFrame(() => renderLoop(cb))
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

const logs = new Logs()

logs.add("default", "Init")
logs.add("add", "Init 2")

let i = 0

const grid = new Grid(".container")

grid.create({
  size: 50,
  width: document.body.clientWidth,
  height: document.body.clientHeight,
  cb: (el) => {
    el.addEventListener("mousemove", (e) => {
      logs.add("m", i++)
      const distance = Vector2.getDistanceToCenter(
        el,
        Vector2.getCoordinatesfromMouseEvent(e)
      )

      const opacity = 1 - distance

      const elOpacity = +el.style.opacity + 1

      el.style.opacity = lerp(elOpacity, 0, 0.3)
    })
  },
})

renderLoop(() => {
  const cursorPosition = new Vector2(cursor.x, cursor.y)
  grid.update((el, index, bbox) => {
    const distanceFromPointToCenter = Vector2.getDistanceToCenter(
      el,
      cursorPosition
    )

    const dynamicOpacityAdjustment =
      0.5 - distanceFromPointToCenter / window.innerWidth

    let currentOpacity = parseFloat(el.style.opacity)
    if (isNaN(currentOpacity)) {
      currentOpacity = 0
    }

    const newOpacity = currentOpacity + dynamicOpacityAdjustment

    // el.style.opacity = newOpacity
    el.style.opacity = lerp(+el.style.opacity, 0, 0.1)
    // el.style.opacity = lerp(newOpacity, 0, 0.3);
  })
})

// function
