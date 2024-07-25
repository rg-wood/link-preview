class LinkPreview extends HTMLElement {
  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "link-preview", LinkPreview);
    }
  }

  static popupStyle = `
    position: fixed;
    width: 300px;
    height: 200px;

    border: 1px solid;
    background: white;

    z-index: 1;

    pointer-events: none;
    overflow: hidden;
  `

  get link() {
    this._link = new URL(this.querySelector("a").href)
    return this._link
  }

  get popup() {
    if (!this._popup) {
      this._popup = document.createElement('div')
      this._popup.hidden = true
      this._popup.style.cssText = LinkPreview.popupStyle
      this._popup.setAttribute("part", "popup")
    }
    return this._popup
  }

  connectedCallback() {
    this.addEventListener('mouseover', this.showPreview)
    this.addEventListener('mouseout', this.hidePreview)

    this.append(this.popup)
  }

  async showPreview () {
    if (!this.preview) {
      this.preview =
        await fetch(this.link, {
          method: 'GET',
          mode: 'same-origin',
          cache: 'no-cache'
        })
          .then(response => {
            if (response.status >= 400) {
              throw new Error(`Fetch error: page=[${this.page}], status=[${response.status}]`)
            } else {
              return response
            }
          })
          .then(response => response.text())

      const page = document.createElement('div')
      page.innerHTML = this.preview

      this.popup.innerHTML = this.link.hash ? page.subsection(this.link.hash).innerHTML : this.preview
    }

    this.popup.hidden = false
  }

  hidePreview () {
    this.popup.hidden = true
  }
}

HTMLElement.prototype.subsection = function (hash) {
  const subsection = this.cloneNode(true)

  Array.from(subsection.querySelectorAll('*'))
    .every((node) => {
      if (hash === `#${node.id}`) {
        return false
      } else if (node.querySelector && node.querySelector(hash)) {
        return true
      } else {
        if (node.remove) node.remove()
        return true
      }
    })

  return subsection
}

LinkPreview.register();
