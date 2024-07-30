# `<link-preview>`

Custom element to hover link previews.

**[Demo](https://rg-wood.github.io/link-preview/)**

## Usage

Include the `<script>` in your markup:

```html
<script type="module" src="https://www.unpkg.com/@grislyeye/link-preview@0.0.0/link-preview.js"></script>
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
