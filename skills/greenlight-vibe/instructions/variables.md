# CSS Variables

Always prefer CSS variables over hardcoded values for consistency and theme compatibility.

## Font Sizes

| Variable | Value |
|----------|-------|
| `var(--wp--preset--font-size--mini, 11px)` | 11px |
| `var(--wp--preset--font-size--xs, 0.85rem)` | 0.85rem |
| `var(--wp--preset--font-size--s, 1rem)` | 1rem |
| `var(--wp--preset--font-size--r, 1.2rem)` | 1.2rem |
| `var(--wp--preset--font-size--m, 1.35rem)` | 1.35rem |
| `var(--wp--preset--font-size--l, 1.55rem)` | 1.55rem |
| `var(--wp--preset--font-size--xl, clamp(1.6rem, 2.75vw, 1.9rem))` | clamp(1.6rem, 2.75vw, 1.9rem) |
| `var(--wp--preset--font-size--xxl, clamp(1.75rem, 3vw, 2.2rem))` | clamp(1.75rem, 3vw, 2.2rem) |
| `var(--wp--preset--font-size--high, clamp(1.9rem, 3.2vw, 2.4rem))` | clamp(1.9rem, 3.2vw, 2.4rem) |
| `var(--wp--preset--font-size--grand, clamp(2.2rem, 4vw, 2.8rem))` | clamp(2.2rem, 4vw, 2.8rem) |
| `var(--wp--preset--font-size--giga, clamp(3rem, 5vw, 4.5rem))` | clamp(3rem, 5vw, 4.5rem) |
| `var(--wp--preset--font-size--giant, clamp(3.2rem, 6.2vw, 6.5rem))` | clamp(3.2rem, 6.2vw, 6.5rem) |
| `var(--wp--preset--font-size--colossal, clamp(3.4rem, 9vw, 12rem))` | clamp(3.4rem, 9vw, 12rem) |
| `var(--wp--preset--font-size--god, clamp(3.5rem, 12vw, 15rem))` | clamp(3.5rem, 12vw, 15rem) |

---

## Line Heights

| Variable | Value |
|----------|-------|
| `var(--wp--custom--line-height--mini, 14px)` | 14px |
| `var(--wp--custom--line-height--xs, 1.15rem)` | 1.15rem |
| `var(--wp--custom--line-height--s, 1.4rem)` | 1.4rem |
| `var(--wp--custom--line-height--r, 1.9rem)` | 1.9rem |
| `var(--wp--custom--line-height--m, 2.1rem)` | 2.1rem |
| `var(--wp--custom--line-height--l, 2.37rem)` | 2.37rem |
| `var(--wp--custom--line-height--xl, clamp(2.3rem, 3.45vw, 2.6rem))` | clamp(2.3rem, 3.45vw, 2.6rem) |
| `var(--wp--custom--line-height--xxl, clamp(2.4rem, 3.55vw, 2.75rem))` | clamp(2.4rem, 3.55vw, 2.75rem) |
| `var(--wp--custom--line-height--high, clamp(2.5rem, 3.7vw, 3rem))` | clamp(2.5rem, 3.7vw, 3rem) |
| `var(--wp--custom--line-height--grand, clamp(2.75rem, 4.7vw, 3.5rem))` | clamp(2.75rem, 4.7vw, 3.5rem) |
| `var(--wp--custom--line-height--giga, clamp(4rem, 6vw, 5rem))` | clamp(4rem, 6vw, 5rem) |
| `var(--wp--custom--line-height--giant, clamp(4.2rem, 6.2vw, 7rem))` | clamp(4.2rem, 6.2vw, 7rem) |
| `var(--wp--custom--line-height--colossal, clamp(4.1rem, 9.35vw, 17rem))` | clamp(4.1rem, 9.35vw, 17rem) |
| `var(--wp--custom--line-height--god, clamp(4.2rem, 12.2vw, 20rem))` | clamp(4.2rem, 12.2vw, 20rem) |

---

## Spacing

| Variable | Value |
|----------|-------|
| `var(--wp--preset--spacing--20, 0.44rem)` | 0.44rem |
| `var(--wp--preset--spacing--30, 0.67rem)` | 0.67rem |
| `var(--wp--preset--spacing--40, 1rem)` | 1rem |
| `var(--wp--preset--spacing--50, 1.5rem)` | 1.5rem |
| `var(--wp--preset--spacing--60, 2.25rem)` | 2.25rem |
| `var(--wp--preset--spacing--70, 3.38rem)` | 3.38rem |
| `var(--wp--preset--spacing--80, 5.06rem)` | 5.06rem |
| `var(--wp--preset--spacing--90, 7.59rem)` | 7.59rem |
| `var(--wp--preset--spacing--100, 11.39rem)` | 11.39rem |
| `var(--wp--preset--spacing--110, 17.09rem)` | 17.09rem |

### Button Spacing

| Variable | Value |
|----------|-------|
| `var(--wp--custom--button--spacing--horizontal, 2.25rem)` | 2.25rem |
| `var(--wp--custom--button--spacing--vertical, 1rem)` | 1rem |

---

## Border Radius

| Variable | Value |
|----------|-------|
| `var(--wp--custom--border-radius--mini, 5px)` | 5px |
| `var(--wp--custom--border-radius--small, 10px)` | 10px |
| `var(--wp--custom--border-radius--medium, 15px)` | 15px |
| `var(--wp--custom--border-radius--large, 20px)` | 20px |
| `var(--wp--custom--border-radius--xlarge, 35px)` | 35px |
| `var(--wp--custom--border-radius--circle, 50%)` | 50% |
| `var(--wp--custom--button--border-radius, 15px)` | 15px |

---

## Shadows

| Variable | Value |
|----------|-------|
| `var(--wp--preset--shadow--accent, 0px 15px 25px 0px rgba(0, 0, 0, 0.1))` | `0px 15px 25px 0px rgba(0, 0, 0, 0.1)` |
| `var(--wp--preset--shadow--mild, 0px 5px 20px 0px rgba(0, 0, 0, 0.03))` | `0px 5px 20px 0px rgba(0, 0, 0, 0.03)` |
| `var(--wp--preset--shadow--soft, 0px 15px 30px 0px rgba(119, 123, 146, 0.1))` | `0px 15px 30px 0px rgba(119, 123, 146, 0.1)` |
| `var(--wp--preset--shadow--elegant, 0px 5px 23px 0px rgba(188, 207, 219, 0.35))` | `0px 5px 23px 0px rgba(188, 207, 219, 0.35)` |
| `var(--wp--preset--shadow--focus, 0px 2px 4px 0px rgba(0, 0, 0, 0.07))` | `0px 2px 4px 0px rgba(0, 0, 0, 0.07)` |
| `var(--wp--preset--shadow--highlight, 0px 32px 48px 0px rgba(0, 0, 0, 0.15))` | `0px 32px 48px 0px rgba(0, 0, 0, 0.15)` |

---

## Transitions

| Variable | Value |
|----------|-------|
| `var(--wp--custom--transition--ease, all 0.5s ease)` | `all 0.5s ease` |
| `var(--wp--custom--transition--ease-in-out, all 0.3s ease-in-out)` | `all 0.3s ease-in-out` |
| `var(--wp--custom--transition--creative, all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1))` | `all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)` |
| `var(--wp--custom--transition--soft, all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1))` | `all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)` |
| `var(--wp--custom--transition--mild, all 0.5s cubic-bezier(0.47, 0, 0.07, 1))` | `all 0.5s cubic-bezier(0.47, 0, 0.07, 1)` |
| `var(--wp--custom--transition--elegant, all 0.5s cubic-bezier(0.35, 0.11, 0.22, 1.16))` | `all 0.5s cubic-bezier(0.35, 0.11, 0.22, 1.16)` |
| `var(--wp--custom--transition--smooth, all 1s cubic-bezier(0.66, 0, 0.34, 1))` | `all 1s cubic-bezier(0.66, 0, 0.34, 1)` |
| `var(--wp--custom--transition--accent, all 1s cubic-bezier(0.48, 0.04, 0.52, 0.96))` | `all 1s cubic-bezier(0.48, 0.04, 0.52, 0.96)` |
| `var(--wp--custom--transition--motion, all 1s cubic-bezier(0.84, 0, 0.16, 1))` | `all 1s cubic-bezier(0.84, 0, 0.16, 1)` |
| `var(--wp--custom--transition--light, all 1s cubic-bezier(0.4, 0.8, 0.74, 1))` | `all 1s cubic-bezier(0.4, 0.8, 0.74, 1)` |

---

## Animation

| Variable | Value |
|----------|-------|
| `var(--gs-root-animation-easing, cubic-bezier(0.42, 0, 0.58, 1))` | `cubic-bezier(0.42, 0, 0.58, 1)` |

---

## Sizes (Width/Height)

| Variable | Value |
|----------|-------|
| `var(--wp--custom--size--dot, 6px)` | 6px |
| `var(--wp--custom--size--mini, 11px)` | 11px |
| `var(--wp--custom--size--xs, 17px)` | 17px |
| `var(--wp--custom--size--s, 26px)` | 26px |
| `var(--wp--custom--size--r, 40px)` | 40px |
| `var(--wp--custom--size--m, 56px)` | 56px |
| `var(--wp--custom--size--l, 74px)` | 74px |
| `var(--wp--custom--size--xl, 100px)` | 100px |
| `var(--wp--custom--size--xxl, 150px)` | 150px |
| `var(--wp--custom--size--high, 220px)` | 220px |
| `var(--wp--custom--size--grand, 300px)` | 300px |
| `var(--wp--custom--size--huge, 385px)` | 385px |
| `var(--wp--custom--size--giant, 500px)` | 500px |
| `var(--wp--custom--size--colossal, 700px)` | 700px |
| `var(--wp--custom--size--god, 1000px)` | 1000px |

---

## Layout Variables

| Variable | Description |
|----------|-------------|
| `var(--wp--style--global--content-size, 1290px)` | **Preferred** - Main content width |
| `var(--wp--style--global--wide-size, 1200px)` | Wide content width (use sparingly) |
| `var(--wp--custom--spacing--side, min(3vw, 20px))` | Side padding |
| `var(--wp--custom--spacing--top, 0px)` | Top padding |
| `var(--wp--custom--spacing--bottom, 0px)` | Bottom padding |

**IMPORTANT:** Use `content-size` (not `wide-size`) for content area widths:
```json
"width": ["var(--wp--style--global--content-size, 1290px)"]
```

---

## Usage Example

```html
<!-- wp:greenshift-blocks/element {"id":"gsbp-example","textContent":"Styled Text","localId":"gsbp-example","styleAttributes":{"fontSize":["var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dfont-size\u002d\u002dl, 1.55rem)"],"lineHeight":["var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dline-height\u002d\u002dl, 2.37rem)"],"paddingTop":["var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dspacing\u002d\u002d50, 1.5rem)"],"paddingBottom":["var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dspacing\u002d\u002d50, 1.5rem)"],"borderRadius":["var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dborder-radius\u002d\u002dmedium, 15px)"],"boxShadow":["var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dshadow\u002d\u002dsoft)"],"transition":["var(\u002d\u002dwp\u002d\u002dcustom\u002d\u002dtransition\u002d\u002dease)"]}} -->
<div class="gsbp-example">Styled Text</div>
<!-- /wp:greenshift-blocks/element -->
```

## Note on Unicode Escaping

In JSON, double dashes `--` are escaped as `\u002d\u002d`:
- `var(--wp--preset--font-size--l)` becomes `var(\u002d\u002dwp\u002d\u002dpreset\u002d\u002dfont-size\u002d\u002dl)`
