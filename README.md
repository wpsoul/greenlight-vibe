# GreenLight Vibe - Claude Code Plugin

Convert HTML to WordPress Gutenberg blocks using the Greenshift/GreenLight system. Build designs, convert any format to blocks, add charts, tables, and dynamic content.

## Installation

### Via marketplace

```bash
claude plugin install greenlight-vibe@<marketplace-name>
```

### Local development

```bash
claude --plugin-dir ./greenlight-vibe
```

### As project skill (without plugin system)

Copy `skills/greenlight-vibe/` to `.claude/skills/` in your project:

```bash
cp -r skills/greenlight-vibe .claude/skills/
```

## Commands

| Command | Description |
|---------|-------------|
| `/greenlight-vibe:convert <file.html>` | Convert an HTML file to Greenshift blocks |

## Skill

The `greenlight-vibe` skill activates automatically when you use keywords like:
**wordpress**, **gutenberg**, **greenshift**, **greenlight**, **convert to blocks**, **chart**

### Workflow

1. **Build HTML** -- Claude creates clean vanilla HTML + CSS + JS following Greenshift conventions
2. **Convert** -- The zero-dependency `scripts/convert.js` transforms HTML into block code (parses CSS into local classes with `styleAttributes`, extracts JS, maps all HTML attributes)
3. **Validate** -- Claude checks output against block syntax rules
4. **Variable fitting** -- Replaces hardcoded values with WordPress CSS variables

## File Structure

```
greenlight-vibe/
├── .claude-plugin/
│   └── plugin.json                  # Plugin manifest
├── commands/
│   └── convert.md                   # /greenlight-vibe:convert
├── skills/
│   └── greenlight-vibe/
│       ├── SKILL.md                 # Main skill (auto-invoked)
│       ├── scripts/
│       │   └── convert.js           # HTML-to-blocks converter (zero-dependency)
│       └── instructions/
│           ├── core-structure.md    # Block format, JSON parameters
│           ├── attributes.md        # HTML attributes, links, images, icons
│           ├── variables.md         # CSS variables (fonts, spacing, shadows)
│           ├── scripts.md           # Custom JavaScript
│           ├── charts.md            # ApexCharts integration
│           ├── dynamic-content.md   # Dynamic placeholders
│           └── dynamic-loops.md     # Query loop syntax
└── README.md
```

## Converter Script

The `scripts/convert.js` is a standalone, zero-dependency Node.js script that converts full HTML pages or snippets into Greenshift block code:

```bash
node scripts/convert.js input.html                # stdout
node scripts/convert.js input.html -o output.txt  # file
cat input.html | node scripts/convert.js          # stdin
```

**Features:**
- Custom HTML parser (no npm packages required)
- CSS parsed into `dynamicGClasses` with `styleAttributes`, hover/focus states, sub-selectors, media queries, keyframes
- JS extracted into `customJs` / `customJsEnabled`
- Full element mapping: links, images, SVGs, videos, forms, tables, section/content-area variations

## Author

**WPsoul** - [@mr_igor_sanz](https://x.com/mr_igor_sanz)

## License

MIT