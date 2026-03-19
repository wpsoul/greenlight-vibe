# Validate Frontend Styles

When blocks are saved programmatically (via MCP, REST API, WP-CLI, or any method that writes post content without going through the Gutenberg editor), CSS from `styleAttributes` and `dynamicGClasses` is not automatically rendered on the frontend.

## CSSRender attribute

Add `"CSSRender": "1"` to every block that has a `styleAttributes` attribute or a `dynamicGClasses` attribute. This tells the PHP renderer to output the CSS inline on the frontend.

**Only add this attribute when saving programmatically.** If you are returning block code for the user to paste into the Gutenberg code editor, do **not** add `CSSRender` — the editor handles CSS rendering on its own.

### Example

Before (missing CSSRender — styles won't render on frontend when saved programmatically):

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-abc","isVariation":"stylemanager","type":"no","dynamicGClasses":[{"id":"my-class","css":".my-class{color:red;}"}]} -->
<div></div>
<!-- /wp:greenshift-blocks/element -->
```

After (styles will render):

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-abc","isVariation":"stylemanager","type":"no","dynamicGClasses":[{"id":"my-class","css":".my-class{color:red;}"}],"CSSRender":"1"} -->
<div></div>
<!-- /wp:greenshift-blocks/element -->
```

### Which blocks need CSSRender

Walk all blocks (including nested) and add `"CSSRender": "1"` to any block whose attributes contain:

- `styleAttributes` (object with CSS properties)
- `dynamicGClasses` (array of class/CSS definitions)
- `inlineCssStyles` with corresponding `styleAttributes` or `dynamicGClasses`

Blocks that only have `inlineCssStyles` without `styleAttributes`/`dynamicGClasses` do not need `CSSRender`.
