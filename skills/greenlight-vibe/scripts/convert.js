#!/usr/bin/env node

// HTML to Greenshift WordPress Blocks Converter
// Zero-dependency. Reads HTML from file path (arg) or stdin.
// Usage:
//   node convert.js input.html
//   cat input.html | node convert.js

'use strict';

// ─── Tiny HTML Parser (no dependencies) ──────────────────────────────────────

const VOID_TAGS = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr'
]);

const SKIP_TAGS = new Set([
  'script','style','meta','link','head','title','noscript','template'
]);

const RAW_TEXT_TAGS = new Set(['script','style']);

function parseHTML(html) {
  let pos = 0;
  const len = html.length;

  function peek() { return html[pos]; }
  function advance(n) { pos += (n || 1); }
  function remaining() { return pos < len; }

  function skipWhitespace() {
    while (remaining() && /\s/.test(html[pos])) pos++;
  }

  function readUntil(stop) {
    const start = pos;
    const idx = html.indexOf(stop, pos);
    if (idx === -1) { pos = len; return html.slice(start); }
    pos = idx;
    return html.slice(start, idx);
  }

  function readAttribute() {
    skipWhitespace();
    let name = '';
    while (remaining() && !/[\s=/>]/.test(html[pos])) {
      name += html[pos]; pos++;
    }
    if (!name) return null;
    name = name.toLowerCase();
    skipWhitespace();
    if (html[pos] !== '=') return { name, value: '' };
    pos++; // skip =
    skipWhitespace();
    let value = '';
    const quote = html[pos];
    if (quote === '"' || quote === "'") {
      pos++;
      while (remaining() && html[pos] !== quote) {
        value += html[pos]; pos++;
      }
      if (remaining()) pos++; // skip closing quote
    } else {
      while (remaining() && !/[\s>]/.test(html[pos])) {
        value += html[pos]; pos++;
      }
    }
    return { name, value };
  }

  function readTag() {
    pos++; // skip <
    // Check for closing tag
    if (html[pos] === '/') {
      pos++;
      const tagName = readUntil('>').trim().toLowerCase();
      pos++; // skip >
      return { type: 'close', tagName };
    }
    // Check for comment
    if (html.slice(pos, pos + 3) === '!--') {
      pos += 3;
      const content = readUntil('-->');
      pos += 3;
      return { type: 'comment', content };
    }
    // Check for doctype
    if (html.slice(pos, pos + 1).toUpperCase() === '!' || html.slice(pos, pos + 7).toLowerCase() === 'doctype') {
      readUntil('>'); pos++;
      return { type: 'doctype' };
    }
    // Open tag
    let tagName = '';
    while (remaining() && !/[\s/>]/.test(html[pos])) {
      tagName += html[pos]; pos++;
    }
    tagName = tagName.toLowerCase();
    const attributes = {};
    while (remaining()) {
      skipWhitespace();
      if (html[pos] === '>' || (html[pos] === '/' && html[pos + 1] === '>')) break;
      const attr = readAttribute();
      if (attr) attributes[attr.name] = attr.value;
      else break;
    }
    let selfClosing = false;
    if (html[pos] === '/') { selfClosing = true; pos++; }
    if (html[pos] === '>') pos++;
    selfClosing = selfClosing || VOID_TAGS.has(tagName);
    return { type: 'open', tagName, attributes, selfClosing };
  }

  function parseNodes() {
    const nodes = [];
    while (remaining()) {
      if (html[pos] === '<') {
        // Check for closing tag without consuming
        if (html[pos + 1] === '/') break;
        const tagStartPos = pos;
        const tag = readTag();
        if (!tag || tag.type === 'comment' || tag.type === 'doctype') continue;
        if (tag.type === 'close') break;
        if (tag.type === 'open') {
          const node = {
            type: 'element',
            tagName: tag.tagName,
            attributes: tag.attributes,
            children: [],
            outerHTML: ''
          };
          if (tag.tagName === 'svg') {
            const svgCloseIdx = html.indexOf('</svg>', pos);
            if (svgCloseIdx !== -1) {
              const innerSvg = html.slice(pos, svgCloseIdx);
              pos = svgCloseIdx + 6;
              node.outerHTML = html.slice(tagStartPos, pos);
              node.rawInner = innerSvg;
            }
            nodes.push(node);
            continue;
          }
          if (RAW_TEXT_TAGS.has(tag.tagName) && !tag.selfClosing) {
            const closeTag = `</${tag.tagName}>`;
            const endIdx = html.toLowerCase().indexOf(closeTag, pos);
            if (endIdx !== -1) {
              node.rawText = html.slice(pos, endIdx);
              pos = endIdx + closeTag.length;
            }
            nodes.push(node);
            continue;
          }
          if (!tag.selfClosing) {
            node.children = parseNodes();
            // Skip closing tag
            if (html[pos] === '<' && html[pos + 1] === '/') {
              readUntil('>'); pos++;
            }
          }
          nodes.push(node);
        }
      } else {
        let text = '';
        while (remaining() && html[pos] !== '<') {
          text += html[pos]; pos++;
        }
        if (text.trim()) {
          nodes.push({ type: 'text', content: text.trim() });
        }
      }
    }
    return nodes;
  }

  return parseNodes();
}

// ─── CSS Parser ──────────────────────────────────────────────────────────────

const SUPPORTED_CSS_PROPS = new Set([
  'textShadow','textStroke','textDecoration','textWrap','wordBreak','letterSpacing','lineClamp','fontStyle','writingMode','textOrientation','fontVariationSettings','fontFamily','fontWeight','fontSize','lineHeight','textAlign','textTransform','textOverflow','font',
  'backgroundImage','backgroundColor','backgroundRepeat','backgroundSize','backgroundAttachment','backgroundBlendMode','backgroundClip','backgroundPosition','color','stroke','strokeWidth','fill',
  'marginTop','marginBottom','marginLeft','marginRight','paddingTop','paddingBottom','paddingLeft','paddingRight','overflow','overflowX','overflowY',
  'border','borderRadius','borderTop','borderBottom','borderLeft','borderRight','borderWidth','borderStyle','borderColor','borderTopWidth','borderTopStyle','borderTopColor','borderBottomWidth','borderBottomStyle','borderBottomColor','borderLeftWidth','borderLeftStyle','borderLeftColor','borderRightWidth','borderRightStyle','borderRightColor','borderBottomLeftRadius','borderBottomRightRadius','borderTopLeftRadius','borderTopRightRadius',
  'boxShadow',
  'width','height','minWidth','minHeight','maxWidth','maxHeight','aspectRatio','scrollbarWidth','scrollbarColor','scrollSnapType','scrollSnapAlign','objectFit','objectPosition','touchAction',
  'position','top','right','bottom','left','zIndex','anchorName','inset','positionAnchor','positionArea','positionTryFallbacks','isolation',
  'opacity','mixBlendMode','filter','visibility','cursor','pointerEvents','maskImage','clipPath','maskRepeat','maskClip','maskComposite','maskType','maskSize','maskPosition','maskOrigin','maskMode','backdropFilter','animation','animationTimeline','animationRange','scrollTimeline','viewTimeline','animationComposition','animationDelay','animationDirection','animationDuration','animationFillMode','animationIterationCount','animationName','animationPlayState','animationTimingFunction',
  'transition','transitionProperty','transitionDuration','transitionTimingFunction','transitionDelay','transform','perspective','transformOrigin','transformStyle','backfaceVisibility',
  'display','flexDirection','justifyContent','alignItems','alignContent','flexWrap','columnGap','rowGap','gridTemplateColumns','gridTemplateRows','order','flexGrow','flexShrink','flexBasis','alignSelf','gridTemplate','gridColumn','gridRow','justifySelf','gridAutoFlow','boxSizing',
  'margin','padding','background','gap','outline','outlineColor','outlineStyle','outlineWidth','outlineOffset'
]);

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseSpacingShorthand(value, prefix) {
  const parts = value.split(/\s+/).filter(Boolean);
  const r = {};
  if (parts.length === 1) {
    r[`${prefix}Top`] = [parts[0]]; r[`${prefix}Right`] = [parts[0]];
    r[`${prefix}Bottom`] = [parts[0]]; r[`${prefix}Left`] = [parts[0]];
  } else if (parts.length === 2) {
    r[`${prefix}Top`] = [parts[0]]; r[`${prefix}Bottom`] = [parts[0]];
    r[`${prefix}Right`] = [parts[1]]; r[`${prefix}Left`] = [parts[1]];
  } else if (parts.length === 3) {
    r[`${prefix}Top`] = [parts[0]]; r[`${prefix}Right`] = [parts[1]];
    r[`${prefix}Left`] = [parts[1]]; r[`${prefix}Bottom`] = [parts[2]];
  } else if (parts.length >= 4) {
    r[`${prefix}Top`] = [parts[0]]; r[`${prefix}Right`] = [parts[1]];
    r[`${prefix}Bottom`] = [parts[2]]; r[`${prefix}Left`] = [parts[3]];
  }
  return r;
}

function parseGapShorthand(value) {
  const parts = value.split(/\s+/).filter(Boolean);
  const r = {};
  if (parts.length === 1) { r.rowGap = [parts[0]]; r.columnGap = [parts[0]]; }
  else if (parts.length >= 2) { r.rowGap = [parts[0]]; r.columnGap = [parts[1]]; }
  return r;
}

function parseDeclarations(declarations) {
  const styleAttributes = {};
  const unsupportedProps = [];
  const cssProps = declarations.split(';').filter(Boolean);

  cssProps.forEach(prop => {
    const colonIndex = prop.indexOf(':');
    if (colonIndex === -1) return;
    const property = prop.substring(0, colonIndex).trim();
    const value = prop.substring(colonIndex + 1).trim();
    if (!property || !value) return;
    const camel = toCamelCase(property);

    if (camel === 'padding') Object.assign(styleAttributes, parseSpacingShorthand(value, 'padding'));
    else if (camel === 'margin') Object.assign(styleAttributes, parseSpacingShorthand(value, 'margin'));
    else if (camel === 'gap') Object.assign(styleAttributes, parseGapShorthand(value));
    else if (SUPPORTED_CSS_PROPS.has(camel)) styleAttributes[camel] = [value];
    else unsupportedProps.push({ property, value });
  });

  let customCSS = '';
  if (unsupportedProps.length > 0) {
    const decl = unsupportedProps.map(p => `${p.property}:${p.value}`).join(';');
    customCSS = `{CURRENT}{${decl}}`;
  }
  return { styleAttributes, customCSS };
}

function parseCss(cssText) {
  const result = {
    classes: {},
    allClasses: new Set(),
    nonClassCss: ''
  };

  let clean = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  const kfRegex = /@keyframes\s+[a-zA-Z0-9_-]+\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
  let m;
  while ((m = kfRegex.exec(clean)) !== null) result.nonClassCss += m[0];
  clean = clean.replace(kfRegex, '');

  const ffRegex = /@font-face\s*\{[^}]*\}/g;
  while ((m = ffRegex.exec(clean)) !== null) result.nonClassCss += m[0];
  clean = clean.replace(ffRegex, '');

  const mqRegex = /@media[^{]+\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/g;
  const mediaQueries = [];
  while ((m = mqRegex.exec(clean)) !== null) mediaQueries.push(m[0]);
  let cssNoMedia = clean;
  mediaQueries.forEach(mq => { cssNoMedia = cssNoMedia.replace(mq, ''); });

  const ruleRegex = /([^{]+)\{([^}]*)\}/g;
  while ((m = ruleRegex.exec(cssNoMedia)) !== null) {
    const fullSelector = m[1].trim();
    const declarations = m[2].trim();
    if (!fullSelector || !declarations) continue;

    const firstClassMatch = fullSelector.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/);
    if (!firstClassMatch) {
      if (/^\*(\s*,|\s*\{|$|:)/.test(fullSelector) || fullSelector === '*') continue;
      result.nonClassCss += `${fullSelector}{${declarations}}`;
      continue;
    }

    const baseClassName = firstClassMatch[1];
    result.allClasses.add(baseClassName);

    if (!result.classes[baseClassName]) {
      result.classes[baseClassName] = { baseStyles: {}, baseCSS: '', selectors: [], mediaCSS: '', customCSS_Extra: '' };
    }

    const classData = result.classes[baseClassName];
    const { styleAttributes, customCSS } = parseDeclarations(declarations);
    if (customCSS) classData.customCSS_Extra += customCSS;

    const baseRe = new RegExp(`^\\.${escRegex(baseClassName)}(:[a-zA-Z-]+)?$`);
    const isBase = baseRe.test(fullSelector);

    if (isBase) {
      if (fullSelector.includes(':hover')) {
        for (const [k, v] of Object.entries(styleAttributes)) classData.baseStyles[`${k}_hover`] = v;
      } else if (fullSelector.includes(':focus')) {
        for (const [k, v] of Object.entries(styleAttributes)) classData.baseStyles[`${k}_focus`] = v;
      } else {
        Object.assign(classData.baseStyles, styleAttributes);
      }
      classData.baseCSS += `${fullSelector}{${declarations}}`;
    } else {
      const selectorParts = fullSelector.split(',').map(s => s.trim());
      selectorParts.forEach(part => {
        if (!part.match(new RegExp(`\\.${escRegex(baseClassName)}`))) return;
        const subMatch = part.match(new RegExp(`\\.${escRegex(baseClassName)}(.*)$`));
        const subVal = subMatch ? subMatch[1] : '';
        if (!subVal) return;

        let existing = classData.selectors.find(s => s.value === subVal);
        const selectorAttrs = { ...styleAttributes };
        if (customCSS) selectorAttrs.customCSS_Extra = customCSS.replace('{CURRENT}', `{CURRENT}${subVal}`);

        if (existing) {
          Object.assign(existing.attributes.styleAttributes, styleAttributes);
          if (customCSS && selectorAttrs.customCSS_Extra) {
            existing.attributes.styleAttributes.customCSS_Extra =
              (existing.attributes.styleAttributes.customCSS_Extra || '') + selectorAttrs.customCSS_Extra;
          }
          existing.css += `.${baseClassName}${subVal}{${declarations}}`;
        } else {
          classData.selectors.push({
            value: subVal,
            attributes: { styleAttributes: selectorAttrs },
            css: `.${baseClassName}${subVal}{${declarations}}`
          });
        }
      });
    }
  }

  mediaQueries.forEach(mq => {
    const cond = mq.match(/@media[^{]+/)[0].trim();
    const openIdx = mq.indexOf('{');
    const content = mq.slice(openIdx + 1, -1).trim();
    const innerRe = /([^{]+)\{([^}]*)\}/g;
    let im;
    let hasNonClass = false;
    let nonClassContent = '';
    while ((im = innerRe.exec(content)) !== null) {
      const sel = im[1].trim();
      const decl = im[2].trim();
      const fc = sel.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/);
      if (!fc) {
        if (/^\*(\s*,|\s*\{|$|:)/.test(sel) || sel === '*') continue;
        hasNonClass = true; nonClassContent += `${sel}{${decl}}`; continue;
      }
      const cn = fc[1];
      result.allClasses.add(cn);
      if (!result.classes[cn]) {
        result.classes[cn] = { baseStyles: {}, baseCSS: '', selectors: [], mediaCSS: '', customCSS_Extra: '' };
      }
      const mqCSS = `${cond}{${sel}{${decl}}}`;
      result.classes[cn].customCSS_Extra += mqCSS;
      result.classes[cn].mediaCSS += mqCSS;
    }
    if (hasNonClass && nonClassContent) result.nonClassCss += `${cond}{${nonClassContent}}`;
  });

  return result;
}

function escRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ─── HTML Node to Block Conversion ──────────────────────────────────────────

const INNER_TAGS = new Set(['div','section','article','header','footer','nav','aside','main','ul','ol','li','table','thead','tbody','tfoot','tr','form','fieldset','figure','figcaption','details','summary','dialog','menu']);
const TEXT_TAGS = new Set(['p','h1','h2','h3','h4','h5','h6','span','a','strong','em','b','i','u','small','mark','del','ins','sub','sup','label','legend','th','td','dt','dd','caption','blockquote','cite','code','pre','abbr','time','address','button']);

function getTypeFromTag(tag) {
  if (INNER_TAGS.has(tag)) return 'inner';
  if (TEXT_TAGS.has(tag)) return 'text';
  if (tag === 'img') return 'image';
  if (tag === 'video') return 'video';
  if (tag === 'audio') return 'audio';
  if (tag === 'iframe') return 'iframe';
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'form';
  return 'inner';
}

function getDirectTextContent(node) {
  if (!node.children) return '';
  return node.children
    .filter(c => c.type === 'text')
    .map(c => c.content)
    .join(' ')
    .trim();
}

function hasElementChildren(node) {
  if (!node.children) return false;
  return node.children.some(c => c.type === 'element');
}

function convertNodeToBlock(node) {
  if (node.type === 'text') {
    const text = node.content.trim();
    if (!text) return null;
    const params = { textContent: text, tag: 'span' };
    const json = wpJsonEncode(params);
    return `<!-- wp:greenshift-blocks/element ${json} -->\n<span>${escHtml(text)}</span>\n<!-- /wp:greenshift-blocks/element -->`;
  }

  if (node.type !== 'element') return null;
  const tag = node.tagName;

  if (SKIP_TAGS.has(tag)) return null;

  // Handle br
  if (tag === 'br') {
    const params = { tag: 'span', type: 'html', textContent: '<br />' };
    return `<!-- wp:greenshift-blocks/element ${wpJsonEncode(params)} -->\n<span><br /></span>\n<!-- /wp:greenshift-blocks/element -->`;
  }

  // Handle hr
  if (tag === 'hr') {
    const params = { tag: 'span', type: 'html', textContent: '<hr />' };
    return `<!-- wp:greenshift-blocks/element ${wpJsonEncode(params)} -->\n<span><hr /></span>\n<!-- /wp:greenshift-blocks/element -->`;
  }

  // Handle SVG
  if (tag === 'svg') {
    let svgHTML = node.outerHTML || '<svg></svg>';
    const params = {
      tag: 'svg',
      icon: { icon: { svgRaw: svgHTML, image: '' }, type: 'svg' }
    };
    const w = node.attributes['width'];
    const h = node.attributes['height'];
    if (w || h) {
      params.styleAttributes = {};
      if (w) params.styleAttributes.width = [w.includes('px') ? w : `${w}px`];
      if (h) params.styleAttributes.height = [h.includes('px') ? h : `${h}px`];
    }

    return `<!-- wp:greenshift-blocks/element ${wpJsonEncode(params)} -->\n${svgHTML}\n<!-- /wp:greenshift-blocks/element -->`;
  }

  const type = getTypeFromTag(tag);
  const params = { tag };
  let effectiveType = type;

  // className
  const cls = node.attributes['class'];
  if (cls) params.className = cls;

  // anchor (id)
  const idAttr = node.attributes['id'];
  if (idAttr) params.anchor = idAttr;

  // Section/content-area component variations (check before building dynAttrs)
  const dataType = node.attributes['data-type'];
  if (dataType === 'content-area-component') params.isVariation = 'nocolumncontent';
  else if (dataType === 'section-component') params.isVariation = 'contentwrapper';
  if (cls && cls.split(/\s+/).includes('alignfull')) params.align = 'full';

  // data-*, on*, style attributes -> dynamicAttributes
  // Skip data-type if already consumed by isVariation
  const consumedDataType = (dataType === 'content-area-component' || dataType === 'section-component');
  const dynAttrs = [];
  for (const [name, value] of Object.entries(node.attributes)) {
    if (name === 'data-type' && consumedDataType) continue;
    if (name.startsWith('data-') || name.startsWith('on') || name === 'style') {
      dynAttrs.push({ name, value });
    }
  }
  if (dynAttrs.length > 0) params.dynamicAttributes = dynAttrs;

  // Check children
  const hasElChildren = hasElementChildren(node);
  const directText = getDirectTextContent(node);

  // Text content handling
  if (type === 'text') {
    if (directText) params.textContent = directText;
  }

  if (type === 'inner' && !hasElChildren && directText) {
    effectiveType = 'text';
    params.textContent = directText;
  }

  if (type === 'text' && !directText && !hasElChildren) {
    effectiveType = 'no';
  }

  if (type === 'inner' && !hasElChildren && !directText) {
    effectiveType = 'no';
  }

  // Link attributes
  if (tag === 'a') {
    const href = node.attributes['href'];
    if (href) params.href = href;
    if (node.attributes['target'] === '_blank') params.linkNewWindow = true;
    const rel = node.attributes['rel'] || '';
    if (rel.includes('nofollow')) params.linkNoFollow = true;
    if (rel.includes('sponsored')) params.linkSponsored = true;
    const title = node.attributes['title'];
    if (title) params.title = title;
  }

  // Image attributes
  if (tag === 'img') {
    const src = node.attributes['src'];
    if (src) params.src = src;
    const alt = node.attributes['alt'];
    if (alt) params.alt = alt;
    const origW = node.attributes['width'];
    const origH = node.attributes['height'];
    if (origW) params.originalWidth = parseInt(origW, 10) || undefined;
    if (origH) params.originalHeight = parseInt(origH, 10) || undefined;
    effectiveType = 'no';
  }

  // Video attributes
  if (tag === 'video') {
    const src = node.attributes['src'];
    if (src) params.src = src;
    const poster = node.attributes['poster'];
    if (poster) params.poster = poster;
    if ('loop' in node.attributes) params.loop = true;
    if ('autoplay' in node.attributes) params.autoplay = true;
    if ('muted' in node.attributes) params.muted = true;
    if ('controls' in node.attributes) params.controls = true;
    if ('playsinline' in node.attributes) params.playsinline = true;
  }

  // Form element attributes
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') {
    const fa = {};
    const inputType = node.attributes['type'];
    if (inputType) fa.type = inputType;
    const name = node.attributes['name'];
    if (name) fa.name = name;
    const placeholder = node.attributes['placeholder'];
    if (placeholder) fa.placeholder = placeholder;
    const value = node.attributes['value'];
    if (value) fa.value = value;
    if ('required' in node.attributes) fa.required = true;
    if ('disabled' in node.attributes) fa.disabled = true;
    if (Object.keys(fa).length > 0) params.formAttributes = fa;
  }

  // Form tag attributes (method, action) – match elementcontainer.js blockProps
  if (tag === 'form') {
    const fa = {};
    const method = node.attributes['method'];
    fa.method = (method && method.toLowerCase() === 'post') ? 'post' : 'get';
    const action = node.attributes['action'];
    if (action) fa.action = action;
    else fa.action = '';
    params.formAttributes = fa;
  }

  // Table cell attributes
  if (tag === 'td' || tag === 'th') {
    const colspan = node.attributes['colspan'];
    if (colspan) params.colSpan = parseInt(colspan, 10);
    const rowspan = node.attributes['rowspan'];
    if (rowspan) params.rowSpan = parseInt(rowspan, 10);
  }

  // Always set type explicitly
  params.type = effectiveType;

  // Convert child elements to inner blocks
  let innerBlocksStr = '';
  if (effectiveType === 'text' && !hasElChildren) {
    // text-only, no inner blocks
  } else if (effectiveType !== 'no') {
    const childBlocks = [];
    if (node.children) {
      for (const child of node.children) {
        const childBlock = convertNodeToBlock(child);
        if (childBlock) childBlocks.push(childBlock);
      }
    }
    if (childBlocks.length > 0) {
      // If text-type with inner blocks, change to inner
      if (effectiveType === 'text') {
        effectiveType = 'inner';
        params.type = 'inner';
        delete params.textContent;
      }
      innerBlocksStr = childBlocks.join('\n');
    }
  }

  // Build HTML output
  const json = wpJsonEncode(params);
  let htmlAttrs = '';
  if (cls) htmlAttrs += ` class="${cls}"`;
  if (idAttr) htmlAttrs += ` id="${idAttr}"`;

  // Add specific HTML attributes based on tag
  if (tag === 'a') {
    if (params.href) htmlAttrs += ` href="${escHtml(params.href)}"`;
    if (params.linkNewWindow) htmlAttrs += ` target="_blank" rel="noopener${params.linkNoFollow ? ' nofollow' : ''}${params.linkSponsored ? ' sponsored' : ''}"`;
    else if (params.linkNoFollow || params.linkSponsored) {
      const rels = [];
      if (params.linkNoFollow) rels.push('nofollow');
      if (params.linkSponsored) rels.push('sponsored');
      htmlAttrs += ` rel="${rels.join(' ')}"`;
    }
    if (params.title) htmlAttrs += ` title="${escHtml(params.title)}"`;
  }
  if (tag === 'img') {
    if (params.src) htmlAttrs += ` src="${escHtml(params.src)}"`;
    if (params.alt) htmlAttrs += ` alt="${escHtml(params.alt)}"`;
    if (params.originalWidth) htmlAttrs += ` width="${params.originalWidth}"`;
    if (params.originalHeight) htmlAttrs += ` height="${params.originalHeight}"`;
    htmlAttrs += ` loading="lazy"`;
  }
  if (tag === 'video') {
    if (params.src) htmlAttrs += ` src="${escHtml(params.src)}"`;
    if (params.poster) htmlAttrs += ` poster="${escHtml(params.poster)}"`;
    if (params.loop) htmlAttrs += ` loop`;
    if (params.autoplay) htmlAttrs += ` autoplay`;
    if (params.muted) htmlAttrs += ` muted`;
    if (params.controls) htmlAttrs += ` controls`;
    if (params.playsinline) htmlAttrs += ` playsinline`;
  }
  if ((tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button') && params.formAttributes) {
    const fa = params.formAttributes;
    if (fa.type) htmlAttrs += ` type="${fa.type}"`;
    if (fa.name) htmlAttrs += ` name="${fa.name}"`;
    if (fa.placeholder) htmlAttrs += ` placeholder="${escHtml(fa.placeholder)}"`;
    if (fa.value) htmlAttrs += ` value="${escHtml(fa.value)}"`;
    if (fa.required) htmlAttrs += ` required`;
    if (fa.disabled) htmlAttrs += ` disabled`;
  }
  if (tag === 'form' && params.formAttributes) {
    const fa = params.formAttributes;
    htmlAttrs += ` method="${escHtml(fa.method || 'get')}"`;
    htmlAttrs += ` action="${escHtml(fa.action != null ? fa.action : '')}"`;
  }
  if (tag === 'td' || tag === 'th') {
    if (params.colSpan) htmlAttrs += ` colspan="${params.colSpan}"`;
    if (params.rowSpan) htmlAttrs += ` rowspan="${params.rowSpan}"`;
  }

  if (dynAttrs.length > 0) {
    for (const da of dynAttrs) {
      htmlAttrs += ` ${da.name}="${escHtml(da.value)}"`;
    }
  }

  // Build the block
  if (VOID_TAGS.has(tag)) {
    return `<!-- wp:greenshift-blocks/element ${json} -->\n<${tag}${htmlAttrs}/>\n<!-- /wp:greenshift-blocks/element -->`;
  }

  const textContent = params.textContent || '';
  if (innerBlocksStr) {
    return `<!-- wp:greenshift-blocks/element ${json} -->\n<${tag}${htmlAttrs}>${innerBlocksStr}</${tag}>\n<!-- /wp:greenshift-blocks/element -->`;
  } else if (textContent) {
    return `<!-- wp:greenshift-blocks/element ${json} -->\n<${tag}${htmlAttrs}>${escHtml(textContent)}</${tag}>\n<!-- /wp:greenshift-blocks/element -->`;
  } else {
    return `<!-- wp:greenshift-blocks/element ${json} -->\n<${tag}${htmlAttrs}></${tag}>\n<!-- /wp:greenshift-blocks/element -->`;
  }
}

function escHtml(s) {
  return s.replace(/&(?!#?\w+;)/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wpJsonEncode(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

// ─── CSS to Local Classes Block Builder ─────────────────────────────────────

function buildStyleManagerBlock(parsedCss, customJs, customJsEnabled) {
  const params = { tag: 'div', type: 'no', isVariation: 'stylemanager' };

  const dynamicGClasses = [];

  parsedCss.allClasses.forEach(className => {
    const classData = parsedCss.classes[className];
    const classAttributes = { styleAttributes: classData.baseStyles || {} };
    if (classData.customCSS_Extra) {
      classAttributes.styleAttributes.customCSS_Extra = classData.customCSS_Extra;
    }
    const localClass = {
      value: className,
      type: 'local',
      label: className,
      localed: false,
      css: (classData.baseCSS || '') + (classData.mediaCSS || ''),
      attributes: classAttributes,
      originalBlock: 'greenshift-blocks/element',
      selectors: classData.selectors || []
    };
    dynamicGClasses.push(localClass);
  });

  if (dynamicGClasses.length > 0) {
    params.dynamicGClasses = dynamicGClasses;
  }

  if (parsedCss.nonClassCss) {
    params.customCss = parsedCss.nonClassCss;
  }

  if (customJs) {
    params.customJs = customJs;
    params.customJsEnabled = true;
  }

  const allClassNames = Array.from(parsedCss.allClasses).join(' ');
  const classAttr = allClassNames ? ` class="${allClassNames}"` : '';
  if (allClassNames) params.className = allClassNames;

  const json = wpJsonEncode(params);
  return `<!-- wp:greenshift-blocks/element ${json} -->\n<div${classAttr}></div>\n<!-- /wp:greenshift-blocks/element -->`;
}

// ─── Main Pipeline ──────────────────────────────────────────────────────────

function convert(htmlInput) {
  const nodes = parseHTML(htmlInput);

  // Extract <style> and <script> content
  const styles = [];
  const scripts = [];

  function collectMeta(nodeList) {
    for (const node of nodeList) {
      if (node.type === 'element') {
        if (node.tagName === 'style' && node.rawText && node.rawText.trim()) {
          styles.push(node.rawText.trim());
        }
        if (node.tagName === 'script' && !node.attributes['src'] && node.rawText && node.rawText.trim()) {
          scripts.push(node.rawText.trim());
        }
        // Recurse into children to find nested style/script (e.g. inside <head>)
        if (node.children) collectMeta(node.children);
      }
    }
  }
  collectMeta(nodes);

  // Find body content - if there's a <body> or <html>, use their children
  function findBodyNodes(nodeList) {
    for (const node of nodeList) {
      if (node.type === 'element') {
        if (node.tagName === 'body') return node.children || [];
        if (node.tagName === 'html' && node.children) {
          const bodyResult = findBodyNodes(node.children);
          if (bodyResult) return bodyResult;
          // If no explicit body, return html's children (skip head)
          return node.children.filter(c => c.type !== 'element' || c.tagName !== 'head');
        }
      }
    }
    return null;
  }

  const bodyNodes = findBodyNodes(nodes) || nodes;

  // Convert visible nodes to blocks
  const blocks = [];
  for (const node of bodyNodes) {
    if (node.type === 'element' && SKIP_TAGS.has(node.tagName)) continue;
    const block = convertNodeToBlock(node);
    if (block) blocks.push(block);
  }

  // Build Style Manager block with CSS + JS
  let styleManagerBlock = '';
  const combinedCss = styles.join('\n\n');
  const combinedJs = scripts.join('\n\n');

  if (combinedCss || combinedJs) {
    const parsedCss = combinedCss ? parseCss(combinedCss) : { classes: {}, allClasses: new Set(), nonClassCss: '' };
    styleManagerBlock = buildStyleManagerBlock(parsedCss, combinedJs, !!combinedJs);
  }

  // Output: Style Manager first (if any), then content blocks
  const output = [];
  if (styleManagerBlock) output.push(styleManagerBlock);
  output.push(...blocks);

  return output.join('\n\n');
}

// ─── CLI Entry Point ────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage:
  node convert.js <input.html>              Convert file, output to stdout
  node convert.js <input.html> -o out.txt   Convert file, write to out.txt
  cat file.html | node convert.js           Convert from stdin`);
  process.exit(0);
}

function run(html) {
  const result = convert(html);
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