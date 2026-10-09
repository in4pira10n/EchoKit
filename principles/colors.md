# EchoKit Color System

EchoKit's color system is informed by iOS semantic color roles. [`tokens/ios.css`](../tokens/ios.css) maps those roles to the Web; it does not provide native `UIColor` or SwiftUI `Color` values. Color tokens describe purpose and hierarchy, not business-action names. Host apps may override the actual color values.

## Core Rules

1. Prefer semantic tokens over hard-coded color values in components.
2. Use each color role consistently. Do not use a separator color for text or a secondary-label color for a background.
3. Check light, dark, increased-contrast, and reduced-transparency appearances.
4. Never rely on color alone to communicate state. Provide visible cues such as text or icons, and expose the state programmatically with ARIA when applicable.
5. Reserve glass materials for functional layers. Use layered opaque or translucent surfaces for primary content.
6. Keep important text legible. Color changes, image backgrounds, and translucent materials must not make text difficult to read.

## Files

| File | Purpose |
| --- | --- |
| [`tokens/tokens.css`](../tokens/tokens.css) | EchoKit's shared sizing, brand, and compatibility tokens |
| [`tokens/ios.css`](../tokens/ios.css) | Web mappings for iOS semantic color roles |
| [`css/echokit.css`](../css/echokit.css) | Complete stylesheet entry point for apps |

Apps should load `css/echokit.css` rather than copying color variables from individual components. A host app can override tokens at its root:

```css
:root {
  --echo-color-blue: #0a84ff;
}

[data-theme="dark"] {
  --echo-color-blue: #409cff;
}
```

## System Colors

These color names describe hue only; they do not encode business meanings such as "complete," "danger," or "primary action." Button's `color` option accepts these names or a custom HEX value.

| Name | Token | Typical use |
| --- | --- | --- |
| `gray` | `--echo-color-gray` | Neutral controls, cancel actions, and low-emphasis actions |
| `red` | `--echo-color-red` | Warning-related interface elements; pair with explanatory text |
| `orange` | `--echo-color-orange` | Caution states or secondary emphasis |
| `yellow` | `--echo-color-yellow` | Highlights, reminders, or markers |
| `green` | `--echo-color-green` | Positive states or confirmation feedback |
| `mint` | `--echo-color-mint` | Fresh, secondary emphasis |
| `teal` | `--echo-color-teal` | Secondary emphasis |
| `cyan` | `--echo-color-cyan` | Informational emphasis |
| `blue` | `--echo-color-blue` | EchoKit's default accent, links, and primary-control backgrounds |
| `indigo` | `--echo-color-indigo` | Secondary emphasis |
| `purple` | `--echo-color-purple` | Secondary emphasis |
| `pink` | `--echo-color-pink` | Secondary emphasis |
| `brown` | `--echo-color-brown` | Secondary emphasis |

### Button Example

```js
createEchoButton({ label: "Save", icon: "square.and.arrow.down", color: "blue" });
createEchoButton({ label: "Cancel", icon: "xmark", color: "gray" });
createEchoButton({ label: "Delete", icon: "trash", color: "red" });
```

To express a button's action, use `label`, `icon`, `ariaLabel`, and host-app logic. Do not use `danger` or `complete` as color values. `variant: "switch"` is a material and interaction variant, not a color name.

## Gray Scale

`gray` is the starting point for the system neutral grays; `gray2` through `gray6` provide additional neutral levels. Use them for boundaries, supporting content, and surfaces, not as substitutes for semantic foreground roles.

| Role | Token | Use |
| --- | --- | --- |
| Gray | `--echo-color-gray` | Neutral emphasis or control color |
| Gray 2 | `--echo-color-gray2` | Secondary boundaries or controls |
| Gray 3 | `--echo-color-gray3` | Group boundaries |
| Gray 4 | `--echo-color-gray4` | Subtle separators |
| Gray 5 | `--echo-color-gray5` | Light surface layer |
| Gray 6 | `--echo-color-gray6` | Lightest surface layer |

## Background Hierarchy

Use backgrounds according to their hierarchy: primary for the overall page, secondary for containers, and tertiary for nested content within containers. Prefer grouped backgrounds for grouped lists and forms.

| Level | System background | Grouped background | Use |
| --- | --- | --- | --- |
| Primary | `--echo-color-system-background` | `--echo-color-system-grouped-background` | Page or overall canvas |
| Secondary | `--echo-color-secondary-system-background` | `--echo-color-secondary-system-grouped-background` | Cards and grouped containers |
| Tertiary | `--echo-color-tertiary-system-background` | `--echo-color-tertiary-system-grouped-background` | Inputs and nested content |

EchoGallery library cards use a light surface to preserve clear content hierarchy against the dark showcase background. They communicate state through `active`, text, icons, and shadows together.

## Foreground And Separators

| Role | Token | Use |
| --- | --- | --- |
| Label | `--echo-color-label` | Primary headings, key values, and important text |
| Secondary label | `--echo-color-secondary-label` | Descriptions, paths, and supporting information |
| Tertiary label | `--echo-color-tertiary-label` | Placeholders and low-emphasis hints |
| Quaternary label | `--echo-color-quaternary-label` | Very low-emphasis decoration; not for important content |
| Placeholder | `--echo-color-placeholder-text` | Input placeholder text |
| Link | `--echo-color-link` | Interactive links |
| Separator | `--echo-color-separator` | Separators that allow the background to show through |
| Opaque separator | `--echo-color-opaque-separator` | Separators that need a stable boundary |

An EchoMetric's `label` contributes to its accessible name and tooltip; its value uses the label color role. Metrics inside a card are 40% opaque by default and become fully opaque in Increased Contrast mode.

## Fills And Materials

| Role | Token | Use |
| --- | --- | --- |
| Fill | `--echo-color-fill` | Base fill for controls or selected content |
| Secondary fill | `--echo-color-secondary-fill` | Fill for secondary controls |
| Tertiary fill | `--echo-color-tertiary-fill` | Subtle fill or an inner input layer |
| Quaternary fill | `--echo-color-quaternary-fill` | Nonessential decorative layer |
| Ultra thin | `--echo-material-ultra-thin` | Thin material that preserves background detail |
| Thin | `--echo-material-thin` | Lightweight overlays |
| Regular | `--echo-material-regular` | Default glass and standard overlays |
| Thick | `--echo-material-thick` | Overlays that need greater legibility |

Glass does not carry a fixed semantic color. Tint only primary actions or controls that genuinely need emphasis. Avoid tinting every button in the same toolbar or modal.

## Existing Compatibility Tokens

The following names are still used by existing components; they are not values in Button's `color` enum. When the complete CSS entry point is loaded, `ios.css` maps some legacy roles to iOS roles. Loading only the legacy `tokens.css` preserves its existing values.

| Token | Role or mapping |
| --- | --- |
| `--echo-color-canvas` | Grouped page background |
| `--echo-color-surface` | Secondary grouped background |
| `--echo-color-surface-raised` | Tertiary system background |
| `--echo-color-surface-muted` | Tertiary grouped background |
| `--echo-color-surface-hover` | Legacy surface hover color; still independently defined and not yet mapped |
| `--echo-color-text` | Label |
| `--echo-color-text-secondary` | Secondary label |
| `--echo-color-text-tertiary` | Tertiary label |
| `--echo-color-border` | Separator |
| `--echo-color-border-strong` | Opaque separator |
| `--echo-color-accent` / `--echo-color-accent-hover` / `--echo-color-accent-soft` | Brand accent, hover, and subtle fill; host overrides are preserved |
| `--echo-color-on-accent` | Foreground on a brand-accent surface; Buttons remain white by design and do not use this token directly |
| `--echo-color-danger` / `--echo-color-danger-soft` | Legacy roles for error text and subtle error backgrounds; not valid Button `color` values |
| `--echo-color-action-primary` / `--echo-color-action-primary-hover` | Legacy button-style aliases, currently mapped to blue |
| `--echo-color-action-danger` | Legacy button-style alias, currently mapped to red |
| `--echo-color-modal-surface` / `--echo-color-modal-text` | Secondary grouped background / label |
| `--echo-color-modal-field-surface` / `--echo-color-modal-field-border` | Tertiary grouped background / separator |
| `--echo-color-modal-border` / `--echo-color-modal-focus` | Legacy modal boundary and focus colors; not yet mapped |
| `--echo-color-success` / `--echo-color-warning` | Legacy status-feedback roles; not valid Button `color` values |
| `--echo-color-focus` | Keyboard focus indicator |

Component-local colors: Button uses `--echo-button-color` for a named-token reference or HEX value. Card uses `--library-accent`, `--card`, `--swatch-color`, and `--swatch-mix` for its light surface and swatches, with dark local labels. Icon masks inherit the foreground by default. Some existing styles still contain fixed color values, so the Kit has not completed a full hard-coded-color migration.

Preview-only tokens include `--echo-showcase-background`, `--echo-showcase-header`, `--echo-showcase-stage`, `--echo-showcase-muted`, `--echo-nav-hover`, and `--echo-nav-active`, as well as text, surface, and accent tokens overridden by the preview. These are for the showcase and navigation, not system color names that apps should select.

Shadow tokens `--echo-shadow-card`, `--echo-shadow-floating`, and `--echo-shadow-modal` are complete shadow expressions that include color. Do not use them directly as foreground or background colors.

## Appearance And Accessibility

[`tokens/ios.css`](../tokens/ios.css) provides separate tokens for light and dark appearances. Dark mode is not a simple inversion of light mode: page backgrounds become darker, while elevated containers use lighter levels.

```css
@media (prefers-contrast: more) {
  /* ios.css increases label and separator contrast. */
}

@media (prefers-reduced-transparency: reduce) {
  /* ios.css replaces translucent materials with opaque surfaces. */
}
```

When a host app provides custom colors, validate them separately in light, dark, and Increased Contrast appearances. Custom HEX values do not generate these variants automatically. For glass over complex image backgrounds, prefer a thicker material or an opaque surface instead of reducing text opacity further.

The current Increased Contrast media query raises contrast for label and separator roles, and card metrics return to full opacity. It does not define a separate Increased Contrast value for every named color. Material tokens define surface colors; they do not enable blur or affect components that do not reference them. Reduced-transparency fallbacks apply only to surfaces that use these tokens. Verify support for the relevant media queries on target browsers and devices.

Buttons currently use white foregrounds. Bright colors such as `yellow` and `mint` may not provide enough contrast with white text; do not assume every system color is suitable for a filled text button. As a general WCAG reference, normal text should meet at least 4.5:1 contrast, while large text and essential graphical controls should meet at least 3:1. Do not rely on the default 40% opacity for important content.

## Naming Boundary

Keep color names separate from component-state names:

| Do not use as `color` | Use instead |
| --- | --- |
| `neutral` | `gray` |
| `primary` | `blue` or a host-defined custom color |
| `complete` | `blue` or `green`, with text and an icon communicating completion |
| `danger` | `red`, with a clear action label and a trash icon |
| `switch` | `gray`, with `variant: "switch"` set separately |

This prevents a color from being mistaken for a business state and makes it easier to replace brand colors and support dark and Increased Contrast appearances.
