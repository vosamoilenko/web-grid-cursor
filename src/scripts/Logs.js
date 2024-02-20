class Logs {
  container = undefined

  dict = {}
  constructor() {
    this.container = document.querySelector(".logs")
  }

  add(key, text) {
    const maybeEl = document.querySelector(`[data-testid=${key}`)
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
