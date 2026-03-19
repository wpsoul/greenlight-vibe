#!/usr/bin/env node

// Greenshift WordPress Blocks to HTML/CSS/JS Converter (Reverse of convert.js)
// Zero-dependency. Reads block markup from file path (arg) or stdin.
// Usage:
//   node deconvert.js input.txt
//   node deconvert.js input.txt -o output.html
//   cat blocks.txt | node deconvert.js

'use strict';

// ─── Unicode Unescape ───────────────────────────────────────────────────────

function wpJsonDecode(str) {
  return str
    .replace(/\\u002d/g, '-')
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>')
    .replace(/\\u0026/g, '&')
    .replace(/\\u0022/g, '"');
}

// ─── Block Comment Parser ───────────────────────────────────────────────────

function parseBlocks(input) {
  const blocks = [];
  let pos = 0;
  const len = input.length;

  while (pos < len) {
    const openStart = input.indexOf('<!-- wp:', pos);
    if (openStart === -1) break;

    const openEnd = input.indexOf('-->', openStart);
    if (openEnd === -1) break;

    const commentContent = input.slice(openStart + 5, openEnd).trim();

    if (commentContent.endsWith('/')) {
      const spaceIdx = commentContent.indexOf(' ');
      const slashIdx = commentContent.lastIndexOf('/');
      let blockName, attrs;
      if (spaceIdx !== -1 && spaceIdx < slashIdx) {
        blockName = commentContent.substring(3, spaceIdx);
        const jsonStr = commentContent.substring(spaceIdx + 1, slashIdx).trim();
        try { attrs = JSON.parse(wpJsonDecode(jsonStr)); } catch { attrs = {}; }
      } else {
        blockName = commentContent.substring(3, slashIdx).trim();
        attrs = {};
      }
      blocks.push({ name: blockName, attributes: attrs, innerBlocks: [], innerHTML: '', selfClosing: true });
      pos = openEnd + 3;
      continue;
    }

    const spaceIdx = commentContent.indexOf(' ');
    let blockName, attrs;
    if (spaceIdx !== -1) {
      blockName = commentContent.substring(3, spaceIdx);
      const jsonStr = commentContent.substring(spaceIdx + 1);
      try { attrs = JSON.parse(wpJsonDecode(jsonStr)); } catch { attrs = {}; }
    } else {
      blockName = commentContent.substring(3);
      attrs = {};
    }

    const closeTag = `<!-- /wp:${blockName} -->`;
    pos = openEnd + 3;

    const closeIdx = findMatchingClose(input, pos, blockName);
    if (closeIdx === -1) break;

    const innerContent = input.slice(pos, closeIdx);
    const innerBlocks = parseBlocks(innerContent);

    let innerHTML = innerContent;
    if (innerBlocks.length > 0) {
      innerHTML = stripInnerBlockMarkup(innerContent, blockName);
    }

    blocks.push({
      name: blockName,
      attributes: attrs,
      innerBlocks,
      innerHTML: innerHTML.trim(),
    });

    pos = closeIdx + closeTag.length;
  }

  return blocks;
}

function findMatchingClose(input, startPos, blockName) {
  const openTag = `<!-- wp:${blockName}`;
  const closeTag = `<!-- /wp:${blockName} -->`;
  let depth = 1;
  let pos = startPos;

  while (depth > 0 && pos < input.length) {
    const nextOpen = input.indexOf(openTag, pos);
    const nextClose = input.indexOf(closeTag, pos);

    if (nextClose === -1) return -1;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      const afterOpen = input.indexOf('-->', nextOpen);
      if (afterOpen === -1) return -1;
      const commentSlice = input.slice(nextOpen + 5, afterOpen).trim();
      if (commentSlice.endsWith('/')) {
        pos = afterOpen + 3;
        continue;
      }
      depth++;
      pos = afterOpen + 3;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      pos = nextClose + closeTag.length;
    }
  }

  return -1;
}

function stripInnerBlockMarkup(content, parentBlockName) {
  let result = content;
  const openRegex = /<!-- wp:[^\s]+ /g;
  let m;
  while ((m = openRegex.exec(content)) !== null) {
    const blockStart = m.index;
    const commentEnd = content.indexOf('-->', blockStart);
    if (commentEnd === -1) continue;
    const commentContent = content.slice(blockStart + 5, commentEnd).trim();

    if (commentContent.endsWith('/wp')) continue;

    const innerBlockName = commentContent.substring(3, commentContent.indexOf(' '));
    const closeTag = `<!-- /wp:${innerBlockName} -->`;
    const closeIdx = findMatchingClose(content, commentEnd + 3, innerBlockName);
    if (closeIdx === -1) continue;
    const fullBlock = content.slice(blockStart, closeIdx + closeTag.length);
    result = result.replace(fullBlock, '');
  }
  return result.replace(/<!--[^>]*-->/g, '').trim();
}

// ─── CSS Collector ──────────────────────────────────────────────────────────

function collectCss(blocks) {
  const cssChunks = [];

  for (const block of blocks) {
    const attrs = block.attributes || {};

    if (attrs.inlineCssStyles) {
      cssChunks.push(attrs.inlineCssStyles);
    }

    if (attrs.customCss) {
      cssChunks.push(attrs.customCss);
    }

    if (block.innerBlocks && block.innerBlocks.length > 0) {
      cssChunks.push(...collectCss(block.innerBlocks));
    }
  }

  return cssChunks;
}

// ─── JS Collector ───────────────────────────────────────────────────────────

function collectJs(blocks) {
  const jsChunks = [];

  for (const block of blocks) {
    const attrs = block.attributes || {};

    if (attrs.customJs && attrs.customJsEnabled) {
      jsChunks.push(attrs.customJs);
    }

    if (block.name === 'html' && block.innerHTML) {
      const scripts = extractScriptsFromHtml(block.innerHTML);
      jsChunks.push(...scripts);
    }

    if (block.innerBlocks && block.innerBlocks.length > 0) {
      jsChunks.push(...collectJs(block.innerBlocks));
    }
  }

  return jsChunks;
}

function extractScriptsFromHtml(html) {
  const scripts = [];
  const re = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const content = m[1].trim();
    if (content) scripts.push(content);
  }
  return scripts;
}

// ─── Block to HTML Conversion ───────────────────────────────────────────────

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

const SKIP_BLOCK_TYPES = new Set([
  'greenshift-blocks/stylemanager',
]);

function isStyleManagerBlock(block) {
  const attrs = block.attributes || {};
  return attrs.isVariation === 'stylemanager' ||
    attrs.type === 'no' && attrs.dynamicGClasses && attrs.dynamicGClasses.length > 0 && !attrs.textContent && !attrs.src;
}

function blockToHtml(block, indent) {
  indent = indent || '';
  const attrs = block.attributes || {};
  const blockName = block.name || '';

  if (block.selfClosing) return '';
  if (isStyleManagerBlock(block)) return '';

  if (blockName === 'template-part') return '';

  if (!blockName.startsWith('greenshift-blocks/')) {
    if (blockName.startsWith('core/')) return '';
    const childHtml = (block.innerBlocks || [])
      .map(b => blockToHtml(b, indent))
      .filter(Boolean)
      .join('\n');
    return childHtml;
  }

  const subBlock = blockName.replace('greenshift-blocks/', '');

  if (subBlock === 'swiper') {
    return swiperBlockToHtml(block, indent);
  }
  if (subBlock === 'swipe') {
    return swipeBlockToHtml(block, indent);
  }

  const tag = attrs.tag || 'div';
  const type = attrs.type || 'inner';

  if (tag === 'svg') {
    return svgBlockToHtml(block, indent);
  }

  const htmlAttrs = buildHtmlAttributes(tag, attrs);
  const childIndent = indent + '  ';

  if (type === 'unicorn') {
    return `${indent}<div${htmlAttrs}></div>`;
  }

  if (VOID_TAGS.has(tag)) {
    if (tag === 'img') return `${indent}<img${htmlAttrs} />`;
    if (tag === 'input') return `${indent}<input${htmlAttrs} />`;
    return `${indent}<${tag}${htmlAttrs} />`;
  }

  if (tag === 'video') {
    return videoBlockToHtml(block, indent);
  }

  const innerBlocks = block.innerBlocks || [];
  const textContent = attrs.textContent || '';

  if (type === 'no' && !textContent && innerBlocks.length === 0) {
    return `${indent}<${tag}${htmlAttrs}></${tag}>`;
  }

  if (type === 'html' || (type === 'text' && textContent && textContent.includes('<'))) {
    return `${indent}<${tag}${htmlAttrs}>${unescapeHtml(textContent)}</${tag}>`;
  }

  if ((type === 'text' || type === 'no') && textContent && innerBlocks.length === 0) {
    return `${indent}<${tag}${htmlAttrs}>${unescapeHtml(textContent)}</${tag}>`;
  }

  if (innerBlocks.length > 0) {
    const childrenHtml = innerBlocks
      .map(b => blockToHtml(b, childIndent))
      .filter(Boolean)
      .join('\n');
    return `${indent}<${tag}${htmlAttrs}>\n${childrenHtml}\n${indent}</${tag}>`;
  }

  if (textContent) {
    return `${indent}<${tag}${htmlAttrs}>${unescapeHtml(textContent)}</${tag}>`;
  }

  return `${indent}<${tag}${htmlAttrs}></${tag}>`;
}

function svgBlockToHtml(block, indent) {
  const attrs = block.attributes || {};
  const icon = attrs.icon;
  const htmlAttrs = buildHtmlAttributes('svg', attrs);

  if (icon && icon.icon) {
    if (icon.icon.svgRaw) {
      return `${indent}${icon.icon.svgRaw}`;
    }
    if (icon.icon.svg) {
      return `${indent}${icon.icon.svg}`;
    }
  }

  const innerHTML = block.innerHTML || '';
  if (innerHTML) {
    const svgContent = extractSvgFromHtml(innerHTML);
    if (svgContent) return `${indent}${svgContent}`;
  }

  return `${indent}<svg${htmlAttrs}></svg>`;
}

function extractSvgFromHtml(html) {
  const svgStart = html.indexOf('<svg');
  if (svgStart === -1) return null;
  const svgEnd = html.lastIndexOf('</svg>');
  if (svgEnd === -1) return null;
  return html.slice(svgStart, svgEnd + 6);
}

function videoBlockToHtml(block, indent) {
  const attrs = block.attributes || {};
  const htmlAttrs = buildHtmlAttributes('video', attrs);
  const src = attrs.src || '';

  const innerBlocks = block.innerBlocks || [];
  if (innerBlocks.length > 0) {
    const childrenHtml = innerBlocks
      .map(b => blockToHtml(b, indent + '  '))
      .filter(Boolean)
      .join('\n');
    return `${indent}<video${htmlAttrs}>\n${childrenHtml}\n${indent}</video>`;
  }

  if (src && attrs.lazyLoadVideo) {
    return `${indent}<video${htmlAttrs}><source data-src="${escAttr(src)}" type="video/mp4" /></video>`;
  }

  if (src) {
    return `${indent}<video${htmlAttrs}><source src="${escAttr(src)}" type="video/mp4" /></video>`;
  }

  return `${indent}<video${htmlAttrs}></video>`;
}

function swiperBlockToHtml(block, indent) {
  const attrs = block.attributes || {};
  const childIndent = indent + '  ';
  const wrapperIndent = childIndent + '  ';

  const swiperClasses = ['swiper'];
  const wrapperClasses = ['swiper-wrapper'];

  const slides = (block.innerBlocks || [])
    .map(b => blockToHtml(b, wrapperIndent + '  '))
    .filter(Boolean)
    .join('\n');

  const containerId = attrs.id ? `gspb_slider-id-${attrs.id}` : '';
  const containerClasses = ['wp-block-greenshift-blocks-swiper', 'gs-swiper'];
  if (containerId) containerClasses.push(containerId);

  let dataAttrs = '';
  if (attrs.slidesPerView) {
    const spv = Array.isArray(attrs.slidesPerView) ? attrs.slidesPerView[0] : attrs.slidesPerView;
    dataAttrs += ` data-slidesperview="${spv || 1}"`;
  }
  if (attrs.speed) dataAttrs += ` data-speed="${attrs.speed}"`;
  if (attrs.autoplay) dataAttrs += ` data-autoplay="true"`;

  return `${indent}<div class="${containerClasses.join(' ')}" style="position:relative"${dataAttrs}>
${childIndent}<div class="swiper">
${wrapperIndent}<div class="swiper-wrapper">
${slides}
${wrapperIndent}</div>
${childIndent}</div>
${childIndent}<div class="swiper-pagination"></div>
${childIndent}<div class="swiper-button-prev"></div>
${childIndent}<div class="swiper-button-next"></div>
${indent}</div>`;
}

function swipeBlockToHtml(block, indent) {
  const attrs = block.attributes || {};
  const childIndent = indent + '  ';
  const innerClasses = ['wp-block-greenshift-blocks-swipe', 'swiper-slide-inner'];
  if (attrs.id) innerClasses.push(`gspb_sliderinner-id-${attrs.id}`);

  const childrenHtml = (block.innerBlocks || [])
    .map(b => blockToHtml(b, childIndent + '  '))
    .filter(Boolean)
    .join('\n');

  return `${indent}<div class="swiper-slide">
${childIndent}<div class="${innerClasses.join(' ')}">
${childrenHtml}
${childIndent}</div>
${indent}</div>`;
}

// ─── HTML Attribute Builder ─────────────────────────────────────────────────

function buildHtmlAttributes(tag, attrs) {
  let html = '';

  const className = attrs.className || '';
  const localId = attrs.localId || attrs.id || '';
  const idClasses = [];
  if (localId && !attrs.staticLocalId && !className.includes(localId)) {
    idClasses.push(localId);
  }

  let allClasses = className;
  if (attrs.align === 'full' && !allClasses.includes('alignfull')) {
    allClasses = allClasses ? `${allClasses} alignfull` : 'alignfull';
  }
  if (idClasses.length > 0) {
    allClasses = allClasses ? `${allClasses} ${idClasses.join(' ')}` : idClasses.join(' ');
  }
  if (allClasses) html += ` class="${allClasses}"`;

  const anchor = attrs.anchor;
  if (anchor) html += ` id="${escAttr(anchor)}"`;

  if (tag === 'a') {
    if (attrs.href) html += ` href="${escAttr(attrs.href)}"`;
    if (attrs.linkNewWindow) {
      const rels = ['noopener'];
      if (attrs.linkNoFollow) rels.push('nofollow');
      if (attrs.linkSponsored) rels.push('sponsored');
      html += ` target="_blank" rel="${rels.join(' ')}"`;
    } else {
      const rels = [];
      if (attrs.linkNoFollow) rels.push('nofollow');
      if (attrs.linkSponsored) rels.push('sponsored');
      if (rels.length) html += ` rel="${rels.join(' ')}"`;
    }
    if (attrs.title) html += ` title="${escAttr(attrs.title)}"`;
  }

  if (tag === 'img') {
    if (attrs.src) html += ` src="${escAttr(attrs.src)}"`;
    if (attrs.alt != null) html += ` alt="${escAttr(attrs.alt)}"`;
    if (attrs.originalWidth) html += ` width="${attrs.originalWidth}"`;
    if (attrs.originalHeight) html += ` height="${attrs.originalHeight}"`;
    html += ` loading="lazy"`;
  }

  if (tag === 'video') {
    if (attrs.loop) html += ` loop`;
    if (attrs.autoplay) html += ` autoplay`;
    if (attrs.muted) html += ` muted`;
    if (attrs.controls) html += ` controls`;
    if (attrs.playsinline) html += ` playsinline`;
    if (attrs.lazyLoadVideo) html += ` data-video-lazy="true"`;
  }

  if (tag === 'form' && attrs.formAttributes) {
    const fa = attrs.formAttributes;
    html += ` method="${escAttr(fa.method || 'get')}"`;
    html += ` action="${escAttr(fa.action || '')}"`;
  }

  if ((tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') && attrs.formAttributes) {
    const fa = attrs.formAttributes;
    if (fa.type) html += ` type="${escAttr(fa.type)}"`;
    if (fa.name) html += ` name="${escAttr(fa.name)}"`;
    if (fa.placeholder) html += ` placeholder="${escAttr(fa.placeholder)}"`;
    if (fa.value) html += ` value="${escAttr(fa.value)}"`;
    if (fa.required) html += ` required`;
    if (fa.disabled) html += ` disabled`;
  }

  if ((tag === 'td' || tag === 'th') && attrs.colSpan) html += ` colspan="${attrs.colSpan}"`;
  if ((tag === 'td' || tag === 'th') && attrs.rowSpan) html += ` rowspan="${attrs.rowSpan}"`;

  if (attrs.dynamicAttributes && Array.isArray(attrs.dynamicAttributes)) {
    for (const da of attrs.dynamicAttributes) {
      if (da.name === 'style') continue;
      html += ` ${da.name}="${escAttr(da.value)}"`;
    }
  }

  if (tag === 'div' && attrs.type === 'unicorn') {
    if (attrs.id) html += ` data-canvas-id="${escAttr(attrs.id)}"`;
    if (attrs.smartLazyLoad) html += ` data-canvas-smart-lazy-load="true"`;
    html += ` data-canvas-type="unicorn"`;
    if (attrs.href) html += ` data-canvas-project-id="${escAttr(attrs.href)}"`;
    if (attrs.id) html += ` id="${escAttr(attrs.id)}"`;
  }

  if (attrs.animation && typeof attrs.animation === 'object' && !Array.isArray(attrs.animation)) {
    const anim = attrs.animation;
    if (anim.type && anim.type !== 'none') {
      html += ` data-aos="${escAttr(anim.type)}"`;
      if (anim.easing) html += ` data-aos-easing="${escAttr(anim.easing)}"`;
      if (anim.duration) html += ` data-aos-duration="${anim.duration}"`;
    }
  }

  return html;
}

// ─── CSS Deduplication ──────────────────────────────────────────────────────

function deduplicateCss(cssText) {
  const seen = new Set();
  const rules = [];
  const regex = /([^{}]+)\{([^{}]*)\}/g;
  let m;

  const keyframeRegex = /@keyframes\s+[a-zA-Z0-9_-]+\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
  const keyframes = [];
  let km;
  while ((km = keyframeRegex.exec(cssText)) !== null) {
    const kfName = km[0].match(/@keyframes\s+([a-zA-Z0-9_-]+)/)?.[1];
    if (kfName && !seen.has(`@keyframes ${kfName}`)) {
      seen.add(`@keyframes ${kfName}`);
      keyframes.push(km[0]);
    }
  }

  const noKf = cssText.replace(keyframeRegex, '');

  const mediaRegex = /@media[^{]+\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/g;
  const mediaBlocks = [];
  while ((m = mediaRegex.exec(noKf)) !== null) {
    const key = m[0].replace(/\s+/g, ' ').trim();
    if (!seen.has(key)) {
      seen.add(key);
      mediaBlocks.push(m[0]);
    }
  }

  const noMedia = noKf.replace(mediaRegex, '');
  while ((m = regex.exec(noMedia)) !== null) {
    const selector = m[1].trim();
    const declarations = m[2].trim();
    const key = `${selector}{${declarations}}`;
    if (!seen.has(key)) {
      seen.add(key);
      rules.push(key);
    }
  }

  return [...rules, ...mediaBlocks, ...keyframes].join('\n');
}

// ─── Utility ────────────────────────────────────────────────────────────────

function escAttr(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function unescapeHtml(s) {
  if (!s) return '';
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

// ─── Main Pipeline ──────────────────────────────────────────────────────────

function deconvert(blockMarkup) {
  const blocks = parseBlocks(blockMarkup);

  const cssChunks = collectCss(blocks);
  const jsChunks = collectJs(blocks);

  const htmlParts = [];
  for (const block of blocks) {
    const html = blockToHtml(block, '  ');
    if (html) htmlParts.push(html);
  }

  const combinedCss = deduplicateCss(cssChunks.join('\n'));
  const combinedJs = jsChunks.join('\n\n');
  const bodyHtml = htmlParts.join('\n\n');

  const output = [];
  output.push('<!DOCTYPE html>');
  output.push('<html lang="en">');
  output.push('<head>');
  output.push('  <meta charset="UTF-8" />');
  output.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
  output.push('  <title>Exported Page</title>');

  if (combinedCss) {
    output.push('  <style>');
    output.push(combinedCss);
    output.push('  </style>');
  }

  output.push('</head>');
  output.push('<body>');
  output.push(bodyHtml);

  if (combinedJs) {
    output.push('  <script>');
    output.push(combinedJs);
    output.push('  </script>');
  }

  output.push('</body>');
  output.push('</html>');

  return output.join('\n');
}

// ─── CLI Entry Point ────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Greenshift Blocks → HTML/CSS/JS Converter (reverse of convert.js)

Usage:
  node deconvert.js <input.txt>              Convert file, output to stdout
  node deconvert.js <input.txt> -o out.html  Convert file, write to out.html
  cat blocks.txt | node deconvert.js         Convert from stdin`);
  process.exit(0);
}

function run(input) {
  const result = deconvert(input);
  const outIdx = args.indexOf('-o');
  if (outIdx !== -1 && args[outIdx + 1]) {
    const outPath = path.resolve(args[outIdx + 1]);
    fs.writeFileSync(outPath, result, 'utf8');
    console.error(`Written to ${outPath}`);
  } else {
    process.stdout.write(result + '\n');
  }
}

if (args.length > 0 && args[0] !== '-o' && !args[0].startsWith('-')) {
  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  run(fs.readFileSync(filePath, 'utf8'));
} else {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { input += chunk; });
  process.stdin.on('end', () => { run(input); });
}
