---
name: greenlight-vibe
description: Generate or edit design for WordPress Gutenberg blocks using Greenshift/GreenLight plugin. Convert any data to wordpress blocks or convert greenshift blocks back to html + css + js. Use when user asks to create design with Greenshift or Greenlight blocks for wordpress site, convert anything to wordpress blocks or build charts in content. Triggers on keywords: wordpress, gutenberg, greenshift, greenlight, convert to wordpress, convert greenshift blocks to vanilla html, build chart.
---

# Greenshift/Greenlight Block Generator and Data Convertor to WordPress blocks

## Purpose

Create production-ready WordPress Gutenberg blocks using Greenshift/GreenLight Element block system. All output is HTML with JSON parameters in block comments - ready to paste directly into WordPress Gutenberg code editor or send code via mcp, rest api to site.

## Workflow to build design and convert it to blocks

### Step 1: Create Clean HTML, CSS, JS first

Always build html first and use there best standards. But keep important rules

1. Make vanilla HTML + JS + CSS
2. Do not use React or Typescript. 
3. Put everything in a single HTML. 
4. Do not use Tailwind or any other CSS frameworks. 
5. Use unique class and id names with prefix, minimum 4 letter for prefix
6. Do not use :root variables, if you need variables, put them in class of parent block.
7. Do not add styles to body tag, add general styles to class of parent block
8. Do not add styles to *{…}
9. Do not generate initial content for design via scripts, it must be added in DOM
10. If you use headings tags or paragraphs, it's required to add margin top and bottom. If you use lists, it's required to disable left margin and spacing
11. Do not use js inline parameters like "onclick"
12. Important!!! All styles add in section `<style data-wp-block-html="css">...</style>`. All scripts add in section `<script data-wp-block-html="js">...</script>`. But if you have `<link>` tags, keep them as they are. 
13. **Never depend on a script for visibility.** Do not give a block a base/initial `opacity:0`, `visibility:hidden` or `display:none` and rely on JavaScript to reveal it. Custom block scripts (`customJs`) do **not** run in the WordPress block editor, so any block that needs a script to appear will be invisible and uneditable while editing. For entrance/reveal animations (fade-in, slide-in, scroll-triggered, etc.) use **CSS animations** — write `@keyframes` and the `animation` property in the `<style data-wp-block-html="css">` block (for scroll-triggered effects use `animation-timeline: view();` with `animation-range`). CSS animations run in both the editor and the frontend with no script. If a hidden→visible transition genuinely must be driven by JS, set the hidden start state **inside the script at runtime** (e.g. `el.style.opacity='0'` or `gsap.set(el,{opacity:0})` immediately before animating to the visible state), so the block stays visible whenever the script does not run.
14. If you use custom font size for specific element, add also line height for this element.

***Important*** When you have centered content inside full width section, use next code for such sections. They must be most parent blocks on page

```html
<section class="wp-section alignfull" data-type="section-component">
    <div class="wp-content-wrap" data-type="content-area-component">
        Your Centered Content
    </div>
</section>
```

Use next styles for sections

```css
.wp-section{display:flex;justify-content:center;flex-direction:column;align-items:center;padding-right:var(--wp--spacing--side, min(3vw, 20px));padding-left:var(--wp--spacing--side, min(3vw, 20px));padding-top:var(--wp--spacing--top, 0px);padding-bottom:var(--wp--spacing--bottom, 0px);margin-top:0px;margin-bottom:0px;position:relative;}
.wp-content-wrap{max-width:100%;width:var(--wp--style--global--wide-size, 1200px);}
```

You can add background and other styles to each section, you can change padding top and bottom, but always keep alignfull class, --wp--style--global--wide-size variable and --wp--spacing--side variables.

When user asks to add dynamic content, read and follow `instructions/dynamic-placeholders.md`.

When user asks to build query loops, dynamic loops, archives, or other query-driven layouts, read and follow both:

- `instructions/dynamic-loops.md`
- `instructions/dynamic-placeholders.md`

Important!!! Add dynamic placeholders ONLY if user asked to make dynamic content or query loops


### Step 2: Convert HTML to Blocks

Save the HTML from Step 1 to a temporary `.html` file, then run the converter script located alongside this skill:

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/greenlight-vibe/scripts/convert.js" /path/to/input.html -o /path/to/output.txt
```

If `CLAUDE_PLUGIN_ROOT` is not set (standalone/local install), use the path relative to the skill directory:

```bash
node scripts/convert.js /path/to/input.html -o /path/to/output.txt
```

The script is zero-dependency (pure JS, no npm install). It accepts a full HTML page or snippet and outputs ready-to-paste Greenshift block code.

**What the script does:**
- Parses all `<style>` tags and converts CSS into a Style Manager block with `dynamicGClasses` (local classes), `styleAttributes`, hover/focus states, selectors, media queries, and keyframes
- Parses all `<script>` tags and adds them as `customJs` with `customJsEnabled: true`
- Converts every HTML element into `greenshift-blocks/element` blocks with correct `type` (`inner`, `text`, `no`), proper nesting, and mapped attributes (`href`, `src`, `alt`, `formAttributes`, `dynamicAttributes`, `icon`, `isVariation`, etc.)

**Usage options:**
```bash
node scripts/convert.js input.html                # output to stdout
node scripts/convert.js input.html -o output.txt  # output to file
cat input.html | node scripts/convert.js          # pipe from stdin
```

**Very complex pages:** if the page has more than 10 full-screen sections, or the converted block code of a complex big page does not work correctly, skip per-element conversion and use the fallback described in "Fallback: Export a very complex page as a single HTML block" below.

### Step 3: Fit to inner variable system

Check if we have some values in styles that matches or close to one of our existed variables. If yes, replace value with variable and fallback

**See `instructions/variables.md` for complete list of variables.**

### Step 4: Validate frontend styles and scripts

If you add code as content and save it in wordpress site, read and follow `instructions/validate-styles.md` for CSS rendering and `instructions/validate-scripts.md` if you have custom scripts in blocks.

---

## Output Requirements

- Return **only** the generated block code
- No explanations or surrounding text
- **No HTML comments** - WordPress strips them; use `metadata:{"name":"..."}` for adding relevant titles to blocks.
- Ready to paste directly into WordPress Gutenberg code editor


## Fallback: Export a very complex page as a single HTML block

Use this mode **instead of** the normal per-element conversion when **either**:

- the page is very complex — more than **10 full-screen sections**, or
- something is not working after exporting a complex big page as blocks (converter output breaks, blocks fail to validate in Gutenberg, editor becomes slow/unresponsive, layout or scripts break after export).

In this mode do **not** convert every element to a block. Put the whole page into **one** `greenshift-blocks/element` block with `type: "html"`, dividing the code into three parts: HTML → `textContent`, CSS → `styleAttributes.customCSS_Extra`, JS → `customJs`.

### Format

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-0465cc0","textContent":"\u003cdiv\u003e...Custom HTML\u003c/div\u003e","type":"html","localId":"gsbp-0465cc0","align":"full","styleAttributes":{"customCSS_Extra":".css{color:red}"},"customJs":"console.log();","customJsEnabled":true} -->
<div class="gsbp-0465cc0 alignfull"><div>...Custom HTML</div></div>
<!-- /wp:greenshift-blocks/element -->
```

### Rules

1. Generate one unique block id like `gsbp-0465cc0` and use the same value for `id`, `localId` and the wrapper class.
2. **`textContent`** — the full page body HTML (everything except `<style>` and `<script>` tags), JSON-escaped for the block comment the same way Gutenberg does: backslash → `\\`, `"` → `\u0022`, `<` → `\u003c`, `>` → `\u003e`, `&` → `\u0026`, `--` → `\u002d\u002d`, newline → `\n`. Never leave raw `<`, `>`, `"` or `--` inside the JSON of the block comment — they can break block parsing.
3. The saved markup between the block comments must be the wrapper `<div class="gsbp-XXXXXXX alignfull">` containing the **same HTML, unescaped**.
4. **CSS** — all page CSS as one string of **regular raw CSS** in `styleAttributes.customCSS_Extra` (JSON-escaped the same way; no conversion to structured styleAttributes rules). Keep `"align":"full"` and the `alignfull` wrapper class; keep the `wp-section` / `wp-content-wrap` structure from Step 1 inside the HTML for centered content.
5. **JS** — all page JS as a single string in `customJs`, with `"customJsEnabled": true`.
6. All Step 1 rules still apply (unique class prefixes, no `:root` variables, no body styles, no visibility that depends on JS, etc.).

### Frontend rendering in this mode

- `textContent` is served as the saved raw HTML — nothing extra is needed for the markup.
- `customCSS_Extra` is **not** a structured styleAttributes rule — it is regular **raw CSS**, output as-is with no processing. Write it exactly as you would write a stylesheet (full selectors, media queries, keyframes all allowed). The only transformation is the optional `{CURRENT}` placeholder, which is replaced with the block's own selector. If the user pastes the code into the Gutenberg code editor manually and saves, the editor generates the frontend page CSS itself. For agentic export to pages/posts, include this raw CSS in the `_gspb_post_css` meta string; for patterns, template parts and templates add `"CSSRender":"1"` to the block.
- On the frontend `customJs` is **not** executed from the attribute — it is loaded from the `gspb_block_js` site option keyed by the block `id`. Saving the page in the Gutenberg editor with GreenShift active stores it there automatically. For **agentic export** (REST/WP-CLI, where the editor never opens) do one of the following:

  - save the script to the option via the plugin endpoint (requires an admin-level application password):

    ```bash
    curl -sf -u "LOGIN:APP_PASSWORD" -H "Content-Type: application/json" \
        -d '{"js":[{"gsbp-0465cc0":"console.log();"}]}' \
        "https://example.com/wp-json/greenshift/v1/update-custom-js"
    ```

  - or follow Step 3 of the agentic export workflow: move the script into a `wp:html` block at the end of the content and remove `customJs`/`customJsEnabled` from the element block.


## Workflow to edit existing design of page that is made with greenshift-blocks

If user asked for minimal changes, like color change, try to edit blocks code directly and save updated code

If user asked to make bigger changes, you need to make next steps.

### Step 1: Prepare code

Take raw content of page and check if it has greenshift-blocks/element blocks

### Step 2: Convert Block code back to HTML

Save the blocks code to a temporary `.html` file, then run the deconverter script located alongside this skill:

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/greenlight-vibe/scripts/deconvert.js" /path/to/input.html -o /path/to/output.txt
```

If `CLAUDE_PLUGIN_ROOT` is not set (standalone/local install), use the path relative to the skill directory:

```bash
node scripts/deconvert.js /path/to/input.html -o /path/to/output.txt
```

### Step 3: Edit the converted code and convert it back to blocks

Make the requested changes in the HTML/CSS/JS produced by the deconverter. After editing, run the normal HTML-to-block conversion workflow again and validate the final Greenshift block code.

### Step 4: Replace the full original block content

Return the full updated Greenshift block code and use it as a complete replacement for the original block content. Do not return only a diff or partial fragment. Keep unchanged blocks and attributes as they were unless they must change to support the requested update.

## Agentic Export to WordPress Site with Greenshift/GreenLight Blocks

If user asked you to export html code to wordpress site, use next steps:

### Step 1: Confirm connection to WordPress site

Before converting HTML to blocks or writing anything to a WordPress site, you **must** confirm a working connection to the target site. Do **not** proceed (no conversion, no publishing) until **one** of the following is true:

1.  **REST API with application password** — the user has provided all of:
    
    -   the **site URL** (e.g. `https://example.com`),
    -   a **WordPress login (username)**, and
    -   an **application password** (Users → Profile → Application Passwords),
    
    _and_ you have verified the connection works. Test it, for example:
    
    ```bash
    curl -sf -u "LOGIN:APP_PASSWORD" "https://example.com/wp-json/wp/v2/users/me"
    ```
    
    A `200` response with the expected user means the connection is good. A `401`/`403` means the credentials are wrong — ask the user to re-check.
    
2.  **WP-CLI** — you can reach the site through WP-CLI instead. Verify with, for example:
    
    ```bash
    wp option get siteurl   # (add --path / --ssh / --url as needed for the target site)
    ```
    

If neither path is available, **ask the user** for the missing site URL, login, and application password (or WP-CLI access) and **stop**. Never generate blocks or push content to a site whose connection has not been confirmed.

### Step 2: Convert HTML to Greenshift blocks

Use the normal HTML-to-block conversion workflow to generate the Greenshift block code from the provided HTML design as described in the previous sections.

### Step 3: Move custom scripts into a `wp:html` block

The converter puts every `<script>` it finds into the **Style Manager block** as `customJs` with `customJsEnabled: true`. But on the frontend the renderer does **not** execute the inline `customJs` value — it loads the script from the `gspb_block_js` site option, keyed by the block's `id`. The converter does not assign an `id`, so an exported script **will not run** unless you also save it to that option *and* add a matching `id` to the block.

For agentic export, do **not** rely on the site option. Instead move each script out of the block and into a `wp:html` block — WordPress outputs `wp:html` as raw HTML, so the `<script>` executes directly with no option write and no `id` required. This is what the GreenLight export feature does.

If the converted blocks contain any `customJsEnabled: true` (the Style Manager block, and any element block that carries its own script), do this for each one:

1. Take the `customJs` value and **unescape** it back into real JavaScript (the block attribute is JSON-escaped — turn `\n` into newlines, `\"` into `"`, `\\` into `\`).
2. Replace every `{{PLUGIN_URL}}` placeholder with the real plugin URL `/wp-content/plugins/greenshift-animation-and-page-builder-blocks`. Raw `wp:html` output is **not** processed by PHP, so the placeholder is not resolved there (unlike option-stored scripts).
3. Append a `wp:html` block at the **end** of the page content:

```html
<!-- wp:html -->
<script data-wp-block-html="js">
/* your script here */
</script>
<!-- /wp:html -->
```

   If the script uses `import` statements, add `type="module"`:

```html
<!-- wp:html -->
<script type="module" data-wp-block-html="js">
import gsap from '/wp-content/plugins/greenshift-animation-and-page-builder-blocks/libs/motion/gsap.js';
/* ... */
</script>
<!-- /wp:html -->
```

4. **Remove** `customJs` and `customJsEnabled` from the original block, so the script is not left dangling on a block that can't run it.

See `instructions/validate-scripts.md` for the full reference, including the WP-CLI / REST option-save alternatives — only use those if you specifically need the script to remain editable in the GreenShift editor.

### Step 4: Prepare CSS for frontend rendering

If you export to pages or post types, prepare all CSS styles of page as single CSS string. You will use it in custom post meta `_gspb_post_css`. If you export to pattern, template part or template, add `"CSSRender": "1"` to every block that has a `styleAttributes` attribute or a `dynamicGClasses` attribute. This tells the PHP renderer to output the CSS inline on the frontend. Read `instructions/validate-styles.md` for details on how to use CSSRender. Do not use CSSRender for blocks that will be saved in pages or posts — it's only needed for patterns, template parts, templates, theme's content hooks. For pages and posts (including custom post types), common CSS must be added as a single string in the `_gspb_post_css` meta field instead.

### Step 5 (optional): Sync CSS variables and fonts to GreenShift settings

If code has root variables or Google Fonts, you can sync them to GreenShift settings. See `instructions/global-settings.md`. This step is optional but can help make the design more editable in the GreenShift editor after export.

### Step 6: Publish the block content and CSS (optional)

Create or update the page/post/template with the generated Greenshift block code as its `content` (REST: `POST /wp-json/wp/v2/{pages|posts}`, or WP-CLI `wp post create` / `wp post update`).

If you have a CSS string from Step 4, save it in the `_gspb_post_css` meta field of the same page/post using **one** of these:

- **Plugin-native endpoint (preferred):**

    ```bash
    curl -sf -u "LOGIN:APP_PASSWORD" -H "Content-Type: application/json" \
        -d '{"id": 123, "css": "<css string>"}' \
        "https://example.com/wp-json/greenshift/v1/css_settings"
    ```

- **Core REST** — embed `meta` in the post payload (the meta is registered with `show_in_rest`, so this works on create or update):

    ```bash
    curl -sf -u "LOGIN:APP_PASSWORD" -H "Content-Type: application/json" \
        -d '{"meta":{"_gspb_post_css":"<css string>"}}' \
        "https://example.com/wp-json/wp/v2/pages/123"
    ```

- **WP-CLI:** `wp post meta update {id} _gspb_post_css "{css_string}"`

Do **not** use `POST /wp-json/wp/v2/{pages|posts}/{id}/meta` — that route does not exist in WordPress core.

If you export to specific page and you export full page content which has also hero section and heading, check if theme has Page without title template. If yes, use it for exported page.