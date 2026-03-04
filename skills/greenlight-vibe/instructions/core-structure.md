# Core Block Structure

All Greenshift Element blocks follow this basic structure:

```html
<!-- wp:greenshift-blocks/element {JSON Parameters} -->
<html_tag class="optional classes" ...other_attributes>
  <!-- Inner content (text, other blocks, or empty) -->
</html_tag>
<!-- /wp:greenshift-blocks/element -->
```

### HTML Tag

-   **`tag`**: Specifies the HTML tag for the element (e.g., `"h2"`, `"a"`, `"img"`, `"svg"`).
    -   If omitted, defaults to `"div"`.
    -   For SVG icons, use `tag: "svg"`.
    -   Prefer `tag: "a"` over `tag: "button"` for button-like elements, unless it's part of a form requiring a `<button>`.

Common tags: `"div"`, `"section"`, `"a"`, `"span"`, `"h1"`-`"h6"`, `"p"`, `"img"`, `"svg"`, `"button"`

## Block Content (`type`)

Determines how the block's content is handled:

### `type: "text"` - Text Only

For blocks containing only text content.

-   **Requires `textContent` parameter**: The text content must be duplicated in the `textContent` JSON parameter.
-   Allowed HTML within text: `<strong>`, `<em>`.
-   **Example:**

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-9de47c2","textContent":"My text","localId":"gsbp-9de47c2"} -->
<div>My text</div>
<!-- /wp:greenshift-blocks/element -->
```

### `type: "inner"` - Container/Nested Blocks

For blocks containing other blocks as children.

-   If a block contains **both** simple text and nested blocks, use `type: "inner"` and wrap the simple text in its own `<span>` element block.
-   **Example:**

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-eaf940e","tag":"a","type":"inner","localId":"gsbp-eaf940e"} -->
<a><!-- wp:greenshift-blocks/element {"id":"gsbp-771f6d2","textContent":"Inner block text","tag":"span","localId":"gsbp-771f6d2"} -->
<span>Inner block text</span>
<!-- /wp:greenshift-blocks/element --></a>
<!-- /wp:greenshift-blocks/element -->
```

### `type: "no"` - Empty/Spacer Elements

For blocks with no inner content, typically used as visual spacers or decorative elements defined purely by styles.

-   **Example:**

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-e4f5g6h","type":"no","localId":"gsbp-e4f5g6h","styleAttributes":{"height":["1px"],"backgroundColor":["#0000002b"],"width":["100px"]}} -->
<div class="gsbp-e4f5g6h"></div>
<!-- /wp:greenshift-blocks/element -->
```

---

### Responsive Array Format

Each property is an **array** representing responsive values:

-   `["desktop", "tablet", "mobile_landscape", "mobile_portrait"]`
-   If fewer values are provided, they apply upwards (e.g., `["10px"]` applies to all).
-   If only desktop value provided, use just one value in array, example `["10px"]`. **Do not use** `["10px", null, null, null]` in such cases.

| Values Provided | Behavior |
|-----------------|----------|
| `["10px"]` | Applies to all breakpoints |
| `["20px", "15px"]` | Desktop: 20px, others: 15px |
| `["20px", "15px", "12px", "10px"]` | Each breakpoint specific |


## Other Common Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `anchor` | String | Sets HTML `id` attribute |
| `metadata` | Object | `{"name": "Block Name"}` for editor. Add it with relevant names for logical parts and sections |