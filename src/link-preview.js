import { LitElement, html, css } from 'lit'
import { until } from 'lit-html/directives/until.js';

import '@lion/ui/define/lion-tooltip.js'

class LinkPreview extends LitElement {

  static Headers = ["h1", "h2", "h3", "h4", "h5", "h6"]

  static register(tagName) {
    if ("customElements" in window) {
      customElements.define(tagName || "link-preview", LinkPreview);
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
    this._link = new URL(this.querySelector("a").href)
    return this._link
  }

  async html() {
    return fetch(this.link)
      .then(response => response.text())
      .then(html => this._parser.parseFromString(html, "text/html"))
  }

  async title() {
    const html = await this.html()

    if(this.link.hash) {
      const maybeFirstTitle = html.querySelector(LinkPreview.Headers.map(h => `${h}${this.link.hash}`).join(','))
      const firstTitle = maybeFirstTitle ? maybeFirstTitle : html.querySelector(LinkPreview.Headers.map(h => `${this.link.hash} ${h}`).join(','))
      return firstTitle.textContent
    }

    const headersSelector = LinkPreview.Headers.join(',');
    return html.querySelector(headersSelector).textContent
  }

  async description() {
    const html = await this.html()

    if(this.link.hash) {
      const maybeFirstContent = html.querySelector(LinkPreview.Headers.map(h => `${h}${this.link.hash}+*`).join(','))
      const firstContent = maybeFirstContent ? maybeFirstContent : html.querySelector(LinkPreview.Headers.map(h => `${this.link.hash} ${h} + *`).join(','))
      return firstContent.textContent
    }

    const descriptionsSelector = LinkPreview.Headers.map(h => `${h}+*`).join(',');
    return html.querySelector(descriptionsSelector).textContent
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

LinkPreview.register();
