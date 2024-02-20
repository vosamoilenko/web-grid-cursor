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
      el.setAttribute('data-opacity', 0)
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

window.Grid = Grid
