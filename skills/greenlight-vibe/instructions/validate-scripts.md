# Validate Frontend Scripts

Greenshift blocks use `customJs` and `customJsEnabled` attributes to attach scripts. On the frontend, script content is **not** read from post content — it is read from the `gspb_block_js` WordPress option (stored in `wp_options`). The editor saves scripts to this option automatically on post save. When you insert blocks programmatically, you must save the scripts yourself.

The option value is a flat associative array (JSON object) keyed by block `id`:

```json
{
  "gsbp-abc1234": "console.log('hello');",
  "gsbp-xyz5678": "import gsap from '...'; gsap.to('.el', {opacity:1});"
}
```

## Option A: Save via WP-CLI (preferred)

WP-CLI has direct access to the database with no authentication needed. Use `wp option` commands to read, merge, and update the `gspb_block_js` option.

### Read current value

```bash
wp option get gspb_block_js --format=json
```

Returns the current JSON object, or empty if the option does not exist yet.

### Merge and save

Read the existing option, merge new scripts in, and write it back. Use `wp option update` with `--format=json`:

```bash
# Get existing value (empty object if not set)
EXISTING=$(wp option get gspb_block_js --format=json 2>/dev/null || echo '{}')

# Merge new scripts into existing — use node/jq/php to merge
MERGED=$(node -e "
  const existing = JSON.parse(process.argv[1] || '{}');
  const newScripts = {
    'gsbp-abc1234': 'console.log(\"hello\");',
    'gsbp-xyz5678': 'document.querySelector(\".el\").classList.add(\"active\");'
  };
  const merged = { ...existing, ...newScripts };
  process.stdout.write(JSON.stringify(merged));
" "$EXISTING")

# Save back
wp option update gspb_block_js "$MERGED" --format=json
```

### Remove a script

To remove a block's script, delete its key from the object and save:

```bash
EXISTING=$(wp option get gspb_block_js --format=json)
UPDATED=$(node -e "
  const obj = JSON.parse(process.argv[1]);
  delete obj['gsbp-abc1234'];
  process.stdout.write(JSON.stringify(obj));
" "$EXISTING")
wp option update gspb_block_js "$UPDATED" --format=json
```

## Option B: Save via REST API

If WP-CLI is not available but you have authenticated REST access, use the `greenshift/v1/update-custom-js` endpoint. Requires `manage_options` capability.

```bash
curl -X POST "https://yoursite.com/wp-json/greenshift/v1/update-custom-js" \
  -H "Content-Type: application/json" \
  -H "X-WP-Nonce: YOUR_NONCE" \
  -d '{"js":[{"gsbp-abc1234":"console.log(\"hello\");"}]}'
```

The payload `js` is an array of single-key objects `[{ blockId: scriptContent }, ...]`. The endpoint merges into the existing option. Empty values remove the key.

## Option C: Fallback — use wp:html block

If neither WP-CLI nor the REST endpoint is available, extract scripts from block attributes and place them in `<!-- wp:html -->` blocks. WordPress renders these as raw HTML, so `<script>` tags execute without the site option.

Remove `customJs` and `customJsEnabled` from the original block attributes, then append at the end of the page:

```html
<!-- wp:html -->
<script data-wp-block-html="js">
console.log('hello');
</script>
<!-- /wp:html -->
```

For scripts with `import` statements, add `type="module"`:

```html
<!-- wp:html -->
<script type="module" data-wp-block-html="js">
import gsap from '/wp-content/plugins/greenshift-animation-and-page-builder-blocks/libs/motion/gsap.js';
gsap.to('.el', {opacity: 1});
</script>
<!-- /wp:html -->
```

## Validation checklist

1. Walk all blocks (including nested) and collect those with `customJsEnabled: true`
2. For each, note the `id` attribute — this is the key in `gspb_block_js`
3. Try Option A (WP-CLI `wp option update`)
4. If WP-CLI is not available, try Option B (REST endpoint)
5. If neither works, fall back to Option C (wp:html blocks) and remove `customJs`/`customJsEnabled` from the original blocks
6. Keep `{{PLUGIN_URL}}` placeholders as-is — they are resolved at render time by PHP
