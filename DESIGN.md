---
name: TechArchive
description: A programming language archive and museum — an immersive, typographically-driven web experience presenting languages as curated exhibition pieces. Dark-first, monochromatic, scholarly.

colors:
  # Light mode surfaces
  background-light: "#ffffff"
  surface-light: "#f8f9fa"
  border-light: "#e9ecef"
  accent-light: "#dee2e6"

  # Dark mode surfaces
  background-dark: "#131315"
  surface-dark: "#343a40"
  border-dark: "#495057"
  accent-dark: "#6c757d"

  # Absolute constants
  white: "#ffffff"
  black: "#000000"

typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: "700"
    lineHeight: 72px
    letterSpacing: 10px
  display-sm:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: 10px
  heading-xl:
    fontFamily: Space Grotesk
    fontSize: 34px
    fontWeight: "700"
    lineHeight: 40px
  heading-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 38px
  heading-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: "600"
    lineHeight: 34px
  heading-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 26px
  body-lg:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: "500"
    lineHeight: 28px
  body-md:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: "500"
    lineHeight: 22px
  body-sm:
    fontFamily: Space Mono
    fontSize: 8px
    fontWeight: "500"
    lineHeight: 12px
  caption:
    fontFamily: Space Mono
    fontSize: 4px
    fontWeight: "400"
    lineHeight: 8px
  code:
    fontFamily: Space Mono
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 22px

rounded:
  none: 0px
  sm: 6px
  DEFAULT: 6px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

components:
  header:
    backgroundColor: rgba(0, 0, 0, 0)
    backdropFilter: blur(24px)
    paddingInline: 32px
    paddingBlock: 24px
    position: sticky

  navbar:
    backgroundColor: rgba(0, 0, 0, 0.4)
    textColor: "{colors.white}"
    position: sticky

  chip:
    backgroundColor: transparent
    textColor: "{colors.accent-dark}"
    border: 1px solid
    borderColor: "{colors.border-light}"
    paddingInline: 16px
    paddingBlock: 8px
    display: inline

  snackbar:
    backgroundColor: rgba(255, 255, 255, 0.1)
    textColor: "{colors.white}"
    width: 400px
    position: fixed
    placement: bottom-right

  cta-button:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.white}"
    hoverTransform: translateY(-2px)
    transition: 250ms ease

  exhibition-panel:
    height: 100vh
    textColor: "{colors.white}"

  exhibition-bottom-nav:
    progressBarBackground: "{colors.surface-dark}"
    progressBarFill: "{colors.accent-dark}"
    transition: 250ms ease

  author-card:
    backgroundColor: rgba(0, 0, 0, 0.1)
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    minWidth: 400px

  sidebar:
    backgroundColor: "{colors.surface-dark}"
    width: 100px
    opacity: "0.8"

  debug-grid:
    backgroundColor: transparent
    gridSize: 24px
    opacity: "0.15"
    position: fixed
---

## Overview

TechArchive is an archival web experience — a programming language museum that blends the gravitas of a scholarly institution with the atmosphere of a contemporary digital exhibition. Every design decision reinforces a single idea: **programming languages are cultural artifacts**, worthy of thoughtful curation and reverential presentation.

The interface is built around a **dark-first philosophy**. The hero route and all exhibition panels use deep, near-black backgrounds that evoke the hush of a museum after hours. Light mode exists as a functional inverse for readability-first contexts (about pages, reading flows), but the brand lives in the dark.

The palette is deliberately **monochromatic** — no accent hues, no brand color splashes. The chromatic vocabulary is greyscale from `#131315` to `#ffffff`, with translucency layers (frosted glass headers, dark navbar overlays, glass-like snackbars) providing depth without color. This creates an archival, scholarly atmosphere that lets the content — the languages themselves — be the color.

The dual-font system is the typographic backbone of the brand:
- **Space Grotesk** for all headings: geometric, modern, with a slightly quirky personality that nods to the technical world without feeling cold.
- **Space Mono** for all body text, code, and UI labels: a fixed-width humanist mono that reinforces the terminal/archive aesthetic and ensures technical content is always legible.

---

## Colors

TechArchive uses a fully **adaptive monochromatic palette** powered by the CSS `light-dark()` function. There are no semantic accent hues — hierarchy and mood are created entirely through lightness contrast and translucency.

### Adaptive Surface Scale

| Role | Light Mode | Dark Mode |
|---|---|---|
| Primary background | `#ffffff` | `#131315` |
| Secondary surface | `#f8f9fa` | `#343a40` |
| Tertiary / borders | `#e9ecef` | `#495057` |
| Interactive accent | `#dee2e6` | `#6c757d` |

The dark primary `#131315` is not pure black — it has a very slight warm tint that reads as ink rather than void, giving the exhibition panels an analogue, archival quality.

### Translucency Layers

Glass effects are used extensively to create depth without opaque interruption:

- **Header / frosted glass:** `rgba(0,0,0,0)` background + `backdrop-filter: blur(24px)` — content scrolls beneath a softly blurred veil
- **Navbar (exhibition back-navigation):** `rgba(0,0,0,0.4)` — a dark scrim that recedes into the panel background
- **Snackbar:** `rgba(255,255,255,0.1)` — a ghost-white glass tile floating above dark content
- **Author metadata card:** `rgba(0,0,0,0.1)` — barely-there frosting on dark panels
- **Hero overlay:** `rgba(0,0,0,0.6)` on `background.png` — dramatic cinematic vignette

### Text

Text always inverts relative to its surface: white on dark backgrounds, near-black on light. There is no mid-grey body text — contrast is kept high to honor the archival intent. The single constant is `--color-white: #ffffff`, used for text and icon strokes on dark exhibition panels.

---

## Typography

TechArchive's typographic system is built on two complementary Space fonts, both by Florian Karsten and DJR. They share geometric DNA while operating in completely different registers.

### Font Families

**Space Grotesk** (`headings, h1–h6`)
A proportional geometric grotesque with subtle quirks (the cut-corner 'a', the pointed terminals) that make it feel designed rather than defaulted. Used exclusively for display and heading roles. Self-hosted as TTF. Weights 400–700.

**Space Mono** (`body, p, div, span, code, labels`)
A fixed-width cousin with the same geometric foundation. Its monospaced nature reinforces the terminal and archive aesthetic — every character occupies the same column width, evoking a database readout or a card catalog. Weights 400 (regular) and 700 (bold).

### Scale

The type scale uses a visual-pixel system. The HTML root is set to `font-size: 0.0625rem` so that `1rem = 1px` — this means all `rem` values in the codebase correspond directly to visual pixel measurements, making the scale highly readable in source.

| Token | Size | Usage |
|---|---|---|
| `display` | 64px | Hero heading (md breakpoint and up) |
| `display-sm` | 48px | Hero heading (base / mobile) |
| `heading-xl` | 34px | Exhibition language name, exhibition year |
| `heading-lg` | 32px | Section titles |
| `heading-md` | 28px | Sub-section headings |
| `heading-sm` | 20px | Card headings, metadata labels |
| `body-lg` | 20px | Large body / introductory copy |
| `body-md` | 16px | Default body text |
| `body-sm` | 8px | Captions, secondary metadata |
| `caption` | 4px | Utility / micro-labels |
| `code` | 16px | Inline code, mono UI labels |

### Special Treatments

**Hero display heading:** Letter-spacing `10px` — an unusually wide tracking that gives the title an exhibition-banner quality. Text shadow `0 4px 4px rgba(255,255,255,0.5)` adds a subtle backlit glow against the hero overlay.

**Exhibition language names:** All-caps, `34px`, Space Grotesk `700`. The uppercase treatment reinforces the museum-label convention.

**Body text rendering:** `text-rendering: geometricPrecision`, `line-height: 1`, `letter-spacing: 0`, `white-space: pre-line`. The tight line-height and geometric rendering prioritize precision over comfort — this is archival output, not editorial prose.

### Utility Classes

`.text-xs` · `.text-sm` · `.text-md` · `.text-lg` · `.text-xl` · `.text-xxl`
`.bold` · `.semibold` · `.normal` · `.light`
`.capitalize` · `.uppercase`

---

## Layout & Spacing

### Spacing Scale

All spacing tokens use visual pixel values (stored as `Nrem` where `html { font-size: 0.0625rem }` → `1rem = 1px`):

| Token | Value |
|---|---|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `xxl` | 48px |

### Content Container

- Max-width: `960px` (adjustable at development time via TweakPane: 640px–1440px)
- Horizontal gutter: `clamp(8px, 2vw, 24px)` — fluid, responsive, never crushes or over-pads

### Grid System

| Breakpoint | Columns | Gap |
|---|---|---|
| Mobile (`< 430px`) | 3 | 8px |
| Tablet (`430px–760px`) | 8 | 12px |
| Desktop (`≥ 760px`) | 12 | 20px |

The grid is intentionally lean — 3/8/12 gives precise column math without over-engineering. Exhibition content is primarily full-bleed or single-column; the grid serves the surrounding UI chrome.

### Breakpoints

| Token | Value |
|---|---|
| `tn` | 320px |
| `sm` | 430px |
| `md` | 570px |
| `lg` | 760px |
| `xl` | 1080px |
| `xxl` | 1600px |

### Row & Flex Utilities

`.row`: `display: flex; flex-wrap: wrap; gap: 16px` — the default horizontal composition primitive.

### Chip

Inline tag element. `border: 1px solid var(--color-tertiary)`, `padding: 8px 16px`. No background, no border-radius. Used for language taxonomy tags on exhibition items — deliberately flat and understated.

### Exhibition Panels

Each language panel occupies exactly `100vh` — full-screen, immersive, one language at a time. This is the core exhibition metaphor: you move through rooms, not scroll through content.

### Sidebar

Fixed `100px` wide. `background: var(--color-secondary)`, `opacity: 0.8`. A narrow, almost-hidden navigational rail.

---

## Elevation & Depth

TechArchive's depth system has two distinct layers: **shadow-based elevation** for UI components in light contexts, and **translucency-based depth** for the dark exhibition environment.

### Shadow Scale

| Token | Value |
|---|---|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)` |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)` |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)` |

Shadows are used sparingly — primarily for cards and interactive surfaces in light-mode contexts. In dark exhibition panels, depth is communicated through translucency and blur rather than drop shadows.

### Frosted Glass System

The header is the most prominent use of the glass system: transparent background + `backdrop-filter: blur(24px)`. This allows exhibition content to drift beneath the chrome without full occlusion, maintaining immersion. The same principle applies to the snackbar (`rgba(255,255,255,0.1)`) and dark navbar overlay (`rgba(0,0,0,0.4)`).

### Motion & Transitions

| Token | Value | Usage |
|---|---|---|
| `transition-fast` | `150ms ease` | Micro-interactions, hover states |
| `transition-base` | `250ms ease` | Background, color, CTA hover, progress bar |
| `transition-slow` | `350ms ease` | Panel transitions, larger layout shifts |

**CTA button hover:** `translateY(-2px)` at `250ms ease` — a subtle physical lift that confirms interactivity without theatrics.

**Snackbar entry:** animated slide-in from bottom-right. Reinforces the fixed-position placement and gives the notification a physical origin.

**Exhibition navigation:** progress bar fill and arrow transitions all run at `250ms ease` — consistent pacing across the bottom navigation chrome.

---

## Shapes

TechArchive's shape language is **emphatically rectangular**. This is a deliberate editorial choice — the interface reads as a system of cards, panels, labels, and frames, not rounded buttons and pill badges.

### Border Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `none` | `0px` | Default for all exhibition panels, chips, most UI surfaces |
| `sm` | `6px` | Author metadata card — the only prominent use of rounding |
| `DEFAULT` | `6px` | Fallback for any component requiring minimal softening |

The sole use of rounding is the author card at `6px` — barely perceptible, functional rather than decorative. Everything else is sharp-cornered. This reinforces the archival, catalogue aesthetic: information is shelved in boxes, not bubbles.

No pill shapes. No circular badges. No organic curves.

---

## Components

### Header

The primary navigation chrome. Sticky-positioned, sitting above all content with a frosted glass effect.

- `padding-inline: 32px`, `padding-block: 24px`
- `backdrop-filter: blur(24px)` — the defining visual treatment
- Background is transparent (`rgba(0,0,0,0)`) — the blur operates on whatever is beneath
- Contains the TechArchive logotype (custom SVG) and primary navigation links

### Navbar (Exhibition Back Navigation)

A secondary sticky bar used within exhibition routes for back-navigation.

- `background: rgba(0,0,0,0.4)` — dark scrim that integrates with panel backgrounds
- Contains a left-arrow Lucide icon (`stroke="currentColor"`, `stroke-width="2"`, `24×24`)
- Recedes into the dark exhibition environment without competing with content

### Chip

Inline taxonomy tag used to classify exhibition items.

- Transparent background, no border-radius
- `border: 1px solid var(--color-tertiary)` — thin single-pixel rule
- `padding: 8px 16px`
- Styled as a label impression on paper — flat, textual, archival

### Snackbar

Toast notification, fixed to the bottom-right corner.

- `width: 400px`, `background: rgba(255,255,255,0.1)` — ghost glass tile
- Grid layout: icon column + title/description column
- Animated slide-in from bottom-right on mount
- Positioned to avoid interfering with exhibition bottom navigation

### CTA Button ("Read More")

Primary call-to-action used at the base of hero and teaser sections.

- `background: var(--color-accent)` — the mid-grey accent, the closest thing to a brand color
- Hover: `transform: translateY(-2px)` at `250ms ease` — a restrained physical lift
- No border-radius — consistent with the sharp-edged shape language

### Exhibition Panel

Full-screen container, one per programming language.

- `height: 100vh` — each language occupies exactly one screen
- Dark background with hero imagery and overlay
- Contains: language name (heading-xl, uppercase), year (heading-xl), description, author card, chip tags, CTA button

### Exhibition Bottom Navigation

The progress and navigation chrome at the base of exhibition routes.

- Prev/next arrow controls (Lucide, `stroke="currentColor"`)
- Timeline progress bar: `background: var(--color-secondary)`, fill `var(--color-accent)`, transitions at `250ms ease`
- Communicates position within the full language archive

### Author Metadata Card

A structured information panel within each exhibition panel, showing creator, maintainer, difficulty, and status.

- `background: rgba(0,0,0,0.1)` — barely-visible frosting
- `border-radius: 6px` — the only rounded surface in the exhibition UI
- `min-width: 400px` at the `lg` breakpoint and above
- Text in white against the dark panel background

### Sidebar

A narrow navigational rail, always visible in exhibition routes.

- `width: 100px` (fixed)
- `background: var(--color-secondary)`, `opacity: 0.8`
- Understated, nearly invisible — a structural guide rather than a featured element

### Debug Grid Overlay

A developer tool rendered at `opacity: 0.15` over the full viewport.

- Fixed full-screen, `24px` crosshatch grid
- Used during layout development to verify alignment and column structure
- Not visible in production builds

### Icons

All icons are SVG-based, consistent with the Lucide icon system:

- `stroke="currentColor"` — inherits text color, adapts to light/dark contexts automatically
- `stroke-width="2"` — consistent 2px stroke weight throughout
- `24×24` viewBox — uniform sizing
- Exception: the Search icon uses `fill="white" fill-opacity="0.6"` — a semi-opaque fill treatment that distinguishes it from navigation icons
- Custom TechArchive logotype SVG, unique to the brand
