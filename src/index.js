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

let i = 0

const logs = new Logs(true)
const grid = new Grid(".container")

grid.create({
  size: 50,
  width: document.body.clientWidth,
  height: document.body.clientHeight,
  cb: (el, index) => {
    el.innerText = `${index}`

    el.addEventListener("mousemove", (e) => {
      const elOpacity = getOpacity(el) + 2
      setOpacity(el, elOpacity)
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

    const opacity = getOpacity(el)
    const value = lerp(opacity, 0, 0.1)
    setOpacity(el, value)
  })
})

function getOpacity(el) {
  console.log(el.getAttribute("data-opacity"))
  const opacity = parseFloat(el.getAttribute("data-opacity"))
  return opacity
  try {
    const currentColor = window
      .getComputedStyle(el)
      .getPropertyValue("background-color")

    const match =
      /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/g.exec(
        currentColor
      )

    if (!match) {
      debugger
    }
    const maybeString = parseFloat(match && match[4])
    if (isNaN(maybeString)) {
      return 0
    }
    return maybeString
  } catch (e) {
    debugger
  }
}

function setOpacity(el, value) {
  el.setAttribute("data-opacity", value)
  el.style.backgroundColor = "rgba(" + [255, 0, 255, value].join(",") + ")"
}
