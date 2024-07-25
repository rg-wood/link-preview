import { LitElement, html, css } from 'lit'
import { until } from 'lit-html/directives/until.js'

import '@lion/ui/define/lion-tooltip.js'

class LinkPreview extends LitElement {
  static Headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  static register(tagName) {
    if ('customElements' in window) {
      customElements.define(tagName || 'link-preview', LinkPreview)
    }
  }

  static styles = css`
    #preview {
      width: 300px;
      height: 200px;
      overflow: hidden;
      border: 1px solid;
      background: white;
    }
  `

  _parser = new DOMParser()

  get link() {
    this._link = new URL(this.querySelector('a').href)
    return this._link
  }

  async html() {
    return fetch(this.link)
      .then(response => response.text())
      .then(html => this._parser.parseFromString(html, 'text/html'))
  }

  async title() {
    const html = await this.html()

    if (this.link.hash) {
      const fragmentHeadings = LinkPreview.Headings.map(h => `${h}${this.link.hash}`).join(',')
      const subsectionHeadings = LinkPreview.Headings.map(h => `${this.link.hash} ${h}`).join(',')

      const maybeFirstTitle = html.querySelector(fragmentHeadings)
      const firstTitle = maybeFirstTitle ? maybeFirstTitle : html.querySelector(subsectionHeadings)

      return firstTitle.textContent
    }

    const headings = LinkPreview.Headings.join(',')
    return html.querySelector(headings).textContent
  }

  async description() {
    const html = await this.html()

    if (this.link.hash) {
      const fragments = LinkPreview.Headings.map(h => `${h}${this.link.hash}+*`).join(',')
      const subsections = LinkPreview.Headings.map(h => `${this.link.hash} ${h} + *`).join(',')

      const maybeFirstDescription = html.querySelector(fragments)
      const firstDescription = maybeFirstDescription
        ? maybeFirstDescription
        : html.querySelector(subsections)

      return firstDescription.textContent
    }

    const contents = LinkPreview.Headings.map(h => `${h}+*`).join(',')
    return html.querySelector(contents).textContent
  }

  render() {
    return html`
      <lion-tooltip>
        <div slot="invoker">
          <slot></slot>
        </div>

        <div slot="content">
          <div part="preview" id="preview">
            <h2>${until(this.title())}</h2>
            <p>${until(this.description())}</p>
          </div>
        </div>
      </lion-tooltip>
    `
  }
}

LinkPreview.register()
