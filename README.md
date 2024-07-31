# `<link-preview>` [![Test](https://github.com/rg-wood/link-preview/actions/workflows/test.yml/badge.svg)](https://github.com/rg-wood/link-preview/actions/workflows/test.yml)

Custom element to hover link previews.

**[Demo](https://rg-wood.github.io/link-preview/)**

## Usage

Include the `<script>` in your markup:

```html
<script
  type="module"
  src="https://www.unpkg.com/@grislyeye/link-preview@0.0.2/link-preview.js"></script>
```

Or, if you host the script as part of your project (recommended):

```html
<script type="module">
  import '@grislyeye/link-preview/link-preview.js'
</script>
```

### Examples

To create link previews within the same page:

```html
<link-preview>
  <a href="#fragment">Link</a>
</link-preview>
```

To create link previews within the
[same origin](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy):

```html
<link-preview>
  <a href="https://same-origin.com/page">Link</a>
</link-preview>
```

Previews for external links are limited. You can only do so for pages with suitable
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) policies:

```html
<link-preview>
  <a href="https://css.winterveil.net/">Link</a>
</link-preview>
```

We do not recommend using `<link-previews>` for external links.

### Styling

`<link-preview>` exposes CSS custom properties and shadow parts that can be used to style the
preview tooltip.

Supports the following
[shadow parts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shadow_parts):

| Part      | Description                                                                              |
| --------- | ---------------------------------------------------------------------------------------- |
| `preview` | The preview content container. You can use this to change the preview border style, etc. |

For example:

```css
link-preview::part(preview) {
  border: none;
  padding-left: 1em;
  padding-right: 1em;
}
```
