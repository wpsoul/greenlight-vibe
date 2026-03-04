---
description: Convert HTML file to WordPress Greenshift blocks
---

# Convert HTML to Greenshift Blocks

Convert the provided HTML file to WordPress Gutenberg blocks using the Greenshift/GreenLight Element block system.

## Instructions

1. The user provides a path to an HTML file as `$ARGUMENTS`
2. Run the converter script:

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/greenlight-vibe/scripts/convert.js" "$ARGUMENTS"
```

3. Return the output as the final block code, ready to paste into WordPress Gutenberg code editor.

If `$ARGUMENTS` is empty, ask the user for the path to the HTML file to convert.
