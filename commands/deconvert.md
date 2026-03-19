---
description: Convert Greenshift blocks to HTML
---

# Deconvert Greenshift Blocks to HTML

Convert the provided Greenshift/GreenLight block file back to HTML, CSS, and JS.

## Instructions

1. The user provides a path to a block code file as `$ARGUMENTS`
2. Run the deconverter script:

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/greenlight-vibe/scripts/deconvert.js" "$ARGUMENTS"
```

3. Return the output as the final HTML code.

If `$ARGUMENTS` is empty, ask the user for the path to the block file to deconvert.
