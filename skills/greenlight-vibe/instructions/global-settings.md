# Saving to global settings

## Saving to global settings

Write to the GreenShift settings endpoint (Basic auth with the application password or with WP CLI):

| Action | Method & path |
| --- | --- |
| Read current settings (always read before writing) | GET /wp-json/greenshift/v1/figma_settings → { "settings": { "colours": {...}, "elements": {...}, "figma_fonts": [...], ... } } |
| Write settings | POST /wp-json/greenshift/v1/figma_settings (JSON body) |

```bash
# Read existing settings first so you don't clobber colours / elements / existing fonts
curl -sf -u "LOGIN:APP_PASSWORD" "https://example.com/wp-json/greenshift/v1/figma_settings"
```

## CSS global variables

**Export CSS variables** — If code has root variables, register them as GreenShift global variables.

### Prepare CSS variables

1.  Take the CSS from the design's `<style>` tags and extract custom properties declared in `:root`, `body`, or `html` rules only — match `--name: value;` pairs (e.g. `--primary-color: #333333`).
    
2.  Map each one into a GreenShift variable object:
    
```json
{
    "variable": "--primary-color",
    "variable_value": "#333333",
    "label": "primary-color",
    "value": "var(--primary-color)",
    "group": "imported"
}
```

-   `variable` = the raw `--name`; `variable_value` = the literal value; `label` = name without the leading `--`; `value` = `var(--name)`; `group` = `"imported"`.

3.  POST them. The `figma_settings` endpoint shallow-merges top-level keys, so sending a `variables` array **replaces the entire variables list** — GET first and resend the existing entries plus your new ones if you want to preserve them:
    
```bash
curl -sf -u "LOGIN:APP_PASSWORD" -H "Content-Type: application/json" \
    -d '{"variables":[{"variable":"--primary-color","variable_value":"#333333","label":"primary-color","value":"var(--primary-color)","group":"imported"}]}' \
    "https://example.com/wp-json/greenshift/v1/figma_settings"
```
    
## Global Google fonts

**Export fonts** — If code includes Google Fonts (a `<link href="...fonts.googleapis.com/css...">`) register them into GreenShift settings (so you can also drop the `<link>` from the exported code and rely on the locally-hosted fonts).

### Prepare fonts

1.  Find the Google Fonts `<link>` in the HTML and fetch its CSS (the `https://fonts.googleapis.com/css2?...` URL). Parse each `@font-face` block for `font-family`, `font-weight`, `font-style`, and the `src` `url(...)`.
    
2.  Build one entry per (family, weight, italic) combo. Convert the numeric weight to a style name, and append `Italic` when `font-style: italic`:
    
| weight | style |  | weight | style |
| --- | --- | --- | --- | --- |
| 100 | Thin |  | 500 | Medium |
| 200 | Extra Light |  | 600 | Semi Bold |
| 300 | Light |  | 700 | Bold |
| 400 | Regular |  | 800 | Extra Bold |
|  |  |  | 900 | Black |

Each entry is:

```json
{ "fontFamily": "Roboto", "fontStyle": "Bold Italic", "fontFile": "https://fonts.gstatic.com/s/roboto/v32/...woff2" }
```
    
3.  **Read-merge-write:** GET the current settings, look at the existing `figma_fonts` array (if any), and POST back only the new entries (de-duped against existing `fontFamily::fontStyle` keys). The endpoint shallow-merges by top-level key, so **send only `figma_fonts`** — do not include `colours`, `elements`, `variables`, or any other key you aren't intentionally rewriting, because any key present in the body overwrites its existing value wholesale:
    
```bash
curl -sf -u "LOGIN:APP_PASSWORD" -H "Content-Type: application/json" \
    -d '{"figma_fonts":[{"fontFamily":"Roboto","fontStyle":"Regular","fontFile":"https://fonts.gstatic.com/s/roboto/v32/....woff2"},{"fontFamily":"Roboto","fontStyle":"Bold","fontFile":"https://fonts.gstatic.com/s/roboto/v32/....woff2"}]}' \
    "https://example.com/wp-json/greenshift/v1/figma_settings"
```

The GreenShift plugin downloads the font files server-side into `/uploads/GreenShift/` and generates the `localfont` / `localfontcss` settings. After the fonts are saved on the site, you can remove the Google Fonts `<link>` tag from the exported block code.