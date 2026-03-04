# HTML Attributes & Parameters

## Link Attributes

| Parameter | Type | Description | HTML Output |
|-----------|------|-------------|-------------|
| `href` | String | Link URL | `href="..."` |
| `linkNewWindow` | Boolean | Open in new tab | `target="_blank" rel="noopener"` |
| `linkNoFollow` | Boolean | No follow | `rel="nofollow"` |
| `linkSponsored` | Boolean | Sponsored link | `rel="sponsored"` |
| `title` | String | Title attribute | `title="..."` |

### Link Example

```html
<!-- wp:greenshift-blocks/element {"textContent":"Visit Site","tag":"a","className":"gsbp-abc123","href":"https://example.com","linkNewWindow":true,"linkNoFollow":true} -->
<a class="gsbp-abc123" href="https://example.com" target="_blank" rel="noopener nofollow">Visit Site</a>
<!-- /wp:greenshift-blocks/element -->
```

---

## Image Attributes

| Parameter | Type | Description |
|-----------|------|-------------|
| `src` | String | Image URL |
| `alt` | String | Alt text (accessibility) |
| `originalWidth` | Number | Width in pixels (JSON only) |
| `originalHeight` | Number | Height in pixels (JSON only) |
| `fetchpriority` | String | `"high"` for LCP images |

### Image Rules

1. **Always** add `loading="lazy"` to HTML
2. When using `originalWidth` and `originalHeight` in JSON, you MUST also add matching `width` and `height` HTML attributes to the `<img>` tag


### Image Example

```html
<!-- wp:greenshift-blocks/element {"tag":"img","className":"gsbp-img001","src":"https://placehold.co/800x600","alt":"Hero image","originalWidth":800,"originalHeight":600} -->
<img class="gsbp-img001" src="https://placehold.co/800x600" alt="Hero image" width="800" height="600" loading="lazy"/>
<!-- /wp:greenshift-blocks/element -->
```

---

## Video Attributes

| Parameter | Type | Description |
|-----------|------|-------------|
| `src` | String | Video URL |
| `poster` | String | Poster image URL |
| `loop` | Boolean | Loop video |
| `autoplay` | Boolean | Auto start |
| `muted` | Boolean | Muted audio |
| `playsinline` | Boolean | Inline on mobile |
| `controls` | Boolean | Show controls |

---

## Other HTML Attribute Mapping (JSON Parameters)

| Parameter | Type | Description |
|-----------|------|-------------|
| `className` | String | Add custom CSS classes (duplicate in HTML `class` attribute) |
| `anchor` | String | Sets the HTML `id` attribute |
| `href` | String | For links (`<a>` tags) |
| `linkNewWindow` | Boolean | Sets `target="_blank"` and `rel="noopener"` (automatically adds `noopener`) |
| `linkNoFollow` | Boolean | Adds `rel="nofollow"` |
| `linkSponsored` | Boolean | Adds `rel="sponsored"` |
| `src` | String | URL for `<img>`, `<video>`, etc. |
| `alt` | String | Alt text for `<img>` |
| `title` | String | Title attribute |
| `originalWidth` | Number | Sets `width` attribute for media (`<img>`, `<video>`) |
| `originalHeight` | Number | Sets `height` attribute for media (`<img>`, `<video>`) |
| `fetchpriority` | String | For images/assets (e.g., `"high"`) |
| `loop` | Boolean | Loop video |
| `autoplay` | Boolean | Auto start video |
| `muted` | Boolean | Muted audio |
| `playsinline` | Boolean | Inline video on mobile |
| `controls` | Boolean | Show video controls |
| `poster` | String | URL for video poster image |
| `colSpan` | Number | Column span for `<td>`, `<th>` |
| `rowSpan` | Number | Row span for `<td>`, `<th>` |

---

## Form Attributes (`formAttributes`)

Use for form elements. The `type` attribute must be inside `formAttributes`, not main JSON.

| Parameter | Description |
|-----------|-------------|
| `type` | `"button"`, `"submit"`, `"text"`, `"email"`, etc. |
| `name` | Form field name |
| `placeholder` | Placeholder text |
| `required` | Boolean |

### Form Attributes Rules

- Use the `formAttributes` object for HTML form element attributes.
- Crucially, place the `type` attribute (e.g., `"button"`, `"submit"`) inside this object, not directly in the main JSON parameters.

### Button Example

```html
<!-- wp:greenshift-blocks/element {"textContent":"Submit","tag":"button","type":"text","formAttributes":{"type":"submit"}} -->
<button type="submit">Submit</button>
<!-- /wp:greenshift-blocks/element -->
```

### Button Example (type="button")

```html
<!-- wp:greenshift-blocks/element {"textContent":"Go","tag":"button","type":"text","formAttributes":{"type":"button"}} -->
<button type="button">Go</button>
<!-- /wp:greenshift-blocks/element -->
```

---

## Dynamic Attributes (`dynamicAttributes`)

For custom HTML attributes not covered by specific parameters.

### Rules

- For any HTML attributes not covered by specific JSON parameters.
- Use an array of objects, each with `name` and `value`.

### Syntax

```json
{
  "dynamicAttributes": [
    {"name": "data-type", "value": "scroll"},
    {"name": "data-speed", "value": "0.5"},
    {"name": "aria-label", "value": "Navigation"}
  ]
}
```

### Example with Dynamic Attributes

```html
<!-- wp:greenshift-blocks/element {"tag":"nav","type":"inner","dynamicAttributes":[{"name":"data-type","value":"section-component"},{"name":"aria-label","value":"Main navigation"}]} -->
<nav data-type="section-component" aria-label="Main navigation">
  <!-- content -->
</nav>
<!-- /wp:greenshift-blocks/element -->
```

## Icons (`icon` Parameter)

Used with `tag: "svg"` for SVG icons.

### Icon Rules

- Used for SVG icons (`tag: "svg"`).
- Contains an `icon` object with the SVG code (`svg`) or font icon class (`font`).
- **Important**: Remove `xmlns` attributes from `<svg>` and `<path>` tags in final HTML output.
- **CRITICAL**: SVG content inside the JSON `icon.icon.svg` parameter MUST use Unicode escape sequences:

| Character | Escape Sequence |
|-----------|-----------------|
| `<`       | `\u003c`        |
| `>`       | `\u003e`        |
| `"`       | `\u0022`        |

**WRONG:**
```json
"icon":{"icon":{"svg":"<svg viewBox=\"0 0 24 24\"><path d=\"M8 12l2 2\"/></svg>"},...}
```

**CORRECT:**
```json
"icon":{"icon":{"svg":"\u003csvg viewBox=\u00220 0 24 24\u0022\u003e\u003cpath d=\u0022M8 12l2 2\u0022/\u003e\u003c/svg\u003e"},...}
```

### Icon Structure

```json
{
  "tag": "svg",
  "icon": {
    "icon": {
      "svg": "<svg>...</svg>",
      "image": ""
    },
    "fill": "currentColor",
    "fillhover": "currentColor",
    "type": "svg"
  }
}
```

### Icon Example

```html
<!-- wp:greenshift-blocks/element {"tag":"svg","icon":{"icon":{"svg":"<svg viewBox=\"0 0 24 24\"><path d=\"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\"/></svg>","image":""},"fill":"currentColor","fillhover":"#ff0000","type":"svg"},"className":"gsbp-icon01"} -->
<svg viewBox="0 0 24 24" class="gsbp-icon01"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
<!-- /wp:greenshift-blocks/element -->
```

## Table Attributes

| Parameter | Type | Description |
|-----------|------|-------------|
| `colSpan` | Number | Column span for `<td>`, `<th>` |
| `rowSpan` | Number | Row span for `<td>`, `<th>` |
