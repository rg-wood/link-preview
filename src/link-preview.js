import { LitElement, html, css } from 'lit'
import { until } from 'lit-html/directives/until.js'

import '@lion/ui/define/lion-tooltip.js'

class LinkPreview extends LitElement {
  static HtmlHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  static subheadingSelectorsFor(hash) {
    return [
      ...LinkPreview.HtmlHeadings.map(h => `${hash} ${h}`),
      ...LinkPreview.HtmlHeadings.map(h => `${h}${hash}`)
    ]
  }

  static FirstContentSelectors = LinkPreview.HtmlHeadings.map(h => `${h}+*`)

  static firstContentSelectorsForSubheading(hash) {
    return [
      ...LinkPreview.HtmlHeadings.map(h => `${hash} ${h}+*`),
      ...LinkPreview.HtmlHeadings.map(h => `${h}${hash}+*`)
    ]
  }

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
      padding-left: 1em;
      padding-right: 1em;
    }
  `

  _parser = new DOMParser()

  get link() {
    return new URL(this.querySelector('a').href)
  }

  get rawLink() {
    return this.querySelector('a').getAttribute('href')
  }

  async html() {
    return fetch(this.link)
      .then(response => response.text())
      .then(html => this._parser.parseFromString(html, 'text/html'))
  }

  async title() {
    const source = this.rawLink.startsWith('#') ? document : await this.html()

    const selectors = this.link.hash
      ? LinkPreview.subheadingSelectorsFor(this.link.hash)
      : LinkPreview.HtmlHeadings

    const heading = source.querySelector(selectors.join(','))
    if (heading) return heading.textContent
  }

  async description() {
    const source = this.rawLink.startsWith('#') ? document : await this.html()

    const selectors = this.link.hash
      ? LinkPreview.firstContentSelectorsForSubheading(this.link.hash)
      : LinkPreview.FirstContentSelectors

    const firstContent = source.querySelector(selectors.join(','))
    if (firstContent) return firstContent.textContent
  }

  render() {
    return html`<lion-tooltip>
      <div slot="invoker">
        <slot></slot>
      </div>

      <div slot="content">
        <div part="preview" id="preview">
          <h2>${until(this.title())}</h2>
          <p>${until(this.description())}</p>
        </div>
      </div>
    </lion-tooltip>`
  }
}

LinkPreview.register()
