class Logs {
  container = undefined
  disable = false

  dict = {}
  constructor(disable) {
    const parent = document.querySelector(".logs")
    this.disable = disable
    if (disable) {
      return
    }
    this.container = document.createElement("div")
    this.container.classList.add('logs-container')
    parent.append(this.container)
  }

  add(key, text) {
    if (this.disable) {
      return
    }
    const maybeEl = document.querySelector(`[data-testid=${key}]`)
    if (maybeEl) {
      this.setText(maybeEl, key, text)
      return
    }

    const el = document.createElement("div")
    el.setAttribute("data-testid", key)
    this.setText(el, key, text)

    this.container.append(el)
  }

  setText(el, key, text) {
    const innerText = `${key}: ${text}`
    el.innerText = innerText
  }
}

window.Logs = Logs
