console.log('class Grid')
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

// export default Grid

window.Grid = Grid
