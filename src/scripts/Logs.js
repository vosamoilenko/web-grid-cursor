class Logs {
    container = undefined
    constructor() {
        this.container = document.querySelector('.logs')
    }

    add(text) {
        const el = document.createElement('div')
        el.innerText = text
        this.container.replaceChildren([...this.container.children, el])
    }
}

window.Logs = Logs
