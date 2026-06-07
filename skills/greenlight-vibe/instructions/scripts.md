# Custom Scripts

Add custom JavaScript to blocks using `customJs` and `customJsEnabled` parameters.

## Basic Parameters

To add custom scripts to any Greenshift block, you need two parameters:

- **`customJs`**: String containing your JavaScript code
- **`customJsEnabled`**: Boolean, set to `true` to enable the script

## Basic Structure

```json
{
  "customJs": "console.log('Hello from block');",
  "customJsEnabled": true
}
```

## Simple Example

```html
<!-- wp:greenshift-blocks/element {"textContent":"Interactive Block","customJs":"console.log('Block loaded');","customJsEnabled":true} -->
<div>Interactive Block</div>
<!-- /wp:greenshift-blocks/element -->
```

## Script Best Practices

1. **Scope your selectors** - Use the block's unique class (localId)
2. **Use ES modules** - Import statements work
3. **Check element existence** - Elements might not be in DOM yet
4. **Avoid global namespace pollution** - Use IIFEs or modules
5. **Never depend on the script for visibility** - Scripts do **not** run in the WordPress block editor. Do not hide a block with base CSS (`opacity:0`, `visibility:hidden`, `display:none`) and then reveal it with a script — the block would stay invisible while editing. Prefer CSS animations for entrance effects. If you must animate from a hidden state with JS, set that hidden state **inside the script** (e.g. `el.style.opacity='0'`) right before animating, so the block is still visible when the script does not run.

## JSON Escaping

When including JavaScript in JSON, escape:
- Double quotes: `\"`
- Newlines: `\n`
- Backslashes: `\\`

### Multi-line Script Example

Set the hidden start state inside the script (not in CSS), then animate to visible. This way the block stays visible if the script does not run — for example in the editor, where scripts are not executed.

```json
{
  "customJs": "import gsap from \"{{PLUGIN_URL}}/libs/motion/gsap.js\";\n\nconst el = document.querySelector('.my-class');\nif (el) {\n  gsap.set(el, { opacity: 0 });\n  gsap.to(el, { opacity: 1, duration: 0.6 });\n}",
  "customJsEnabled": true
}
```

## Script Variables

If script has some variables for controllers, that user can change, register them as placeholders via customJsControllers array, then you can use these controllers directly in scripts with next syntax {{VARIABLE_NAME}}

Example 

```json
{
  "customJs":"var myVar = {{VARIABLE_NAME}};\nconsole.log(myVar)",
  "customJsEnabled":true,
  "customJsControllers":[
    {"name":"VARIABLE_NAME","value":"22"}
  ]
}
```

---

## How Scripts Work on the Frontend

Scripts in `customJs` are **not** read from post content at render time. The PHP renderer reads them from the `gspb_block_js` WordPress option (`wp_options` table), keyed by the block's `id` attribute. The normal editor save flow writes to this option automatically. When inserting blocks programmatically, you must save scripts yourself.

For full details on saving scripts to the site option (via WP-CLI, REST API, or wp:html fallback), see `instructions/validate-scripts.md`.

---

## Important Notes

- Use native script support via `customJs` and `customJsEnabled` parameters
- The `{{PLUGIN_URL}}` placeholder is automatically replaced with the correct plugin path
- Always ensure `customJsEnabled` is set to `true` for scripts to run
- On the frontend, the actual script content is loaded from the `gspb_block_js` site option, not from post content
