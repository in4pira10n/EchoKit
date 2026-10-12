# EchoKit

Design kit of The Echos™ apps.
## Principles

- Reuse shared interaction and visual foundations; keep app-specific workflows in each app.
- Prefer semantic tokens over hard-coded product colors. Apps may override the accent and other roles at their own root.
- Ship plain CSS and native ES modules with no runtime dependencies or external fonts.
- Keep base styles opt-in and component classes namespaced with `echo-` to avoid changing host-app styles accidentally.
- Support light and dark themes, keyboard use, touch-sized controls, and reduced motion.

## Contents

| Path | Purpose |
| --- | --- |
| `tokens/tokens.css` | Light/dark semantic color, type, spacing, radius, shadow, and motion tokens |
| `components/` | Self-contained component sources; each component owns its implementation, CSS, types, and usage notes |
| `SFSymbols/` | Shared SF Symbol SVG assets resolved by their official symbol names |
| `components/icon.js` | Shared icon resolver for SF Symbol names and explicit custom URLs |
| `css/echokit.css` | Single CSS entry point |
| `css/` | Global stylesheet entry point and base opt-in styles |
| `js/echokit.js` | Framework-free JavaScript entry point for the shared component APIs |
| `components/button/` | Canonical Button factory, CSS, type declarations, and usage notes |
| `components/input/` | Labeled Input and Field factory, CSS, types, and usage notes |
| `components/segmented/` | Accessible mutually exclusive selection control, CSS, types, and usage notes |
| `components/setting-row/` | Collapsible settings-panel container, CSS, types, and usage notes |
| `components/tab/` | EchoGallery-style icon navigation factory, CSS, types, and usage notes |
| `components/modal/` | Modal overlay factory, focus handling, Button actions, and usage notes |
| `js/dialog.js` | Optional delegated open, close, Escape, and focus handling for modal overlays |
| `package.json` | Local/package-manager exports for CSS, JavaScript, types, and SF Symbol assets |
| `preview/` | Responsive interactive component preview |

## Preview

From this directory, run:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/preview/`. The preview has a light/dark switch, responsive layouts, the seven-view EchoGallery main navigation (which collapses to a picker on narrow screens), and an accessible overlay modal with focus trapping and restoration. The home page also demonstrates Segmented Control, Input, and Setting Row. Component detail pages live at `/preview/pages/button/`, `/preview/pages/tab/`, `/preview/pages/modal/`, and `/preview/pages/library-card/`. The `/preview/pages/` directory redirects to the preview home. On each detail page, the expanded component title returns to the home page and collapses its secondary navigation; the other component titles remain available for navigation.

## Add EchoKit to a web app

Load `css/echokit.css`, add the `echo-root` class to the component scope, and choose a theme on the document root. EchoKit is framework-free and has no runtime dependencies:

```html
<html data-theme="light">
  <body class="echo-root">
    <div id="actions"></div>
    <label class="echo-field">
      <span class="echo-field__label">Library name</span>
      <input class="echo-input" type="text" placeholder="Name">
    </label>
  </body>
</html>
```

```html
<link rel="stylesheet" href="/echokit/css/echokit.css">
<script type="module">
  import { createEchoButton, installModalInteractions } from "/echokit/js/echokit.js";

  const saveButton = createEchoButton({
    label: "保存",
    icon: "square.and.arrow.down",
    variant: "primary",
    onClick: () => console.log("saved"),
  });
  document.querySelector("#actions").append(saveButton);

  installModalInteractions();
</script>
```

Set `data-theme="dark"` for the dark token mode. If no theme is specified, the token defaults to light. Button and Tabs icons accept a bare SF Symbol name, for example `icon: "checkmark"`; use `{ url: "/assets/custom.svg" }` for a custom icon URL. To give an app its own brand accent, override only the semantic roles it needs:

```css
:root[data-app="manager"] {
  --echo-color-accent: #39816a;
  --echo-color-accent-hover: #2f6c58;
  --echo-color-accent-soft: #eaf5ef;
}
```

## Component API

- Buttons: `.echo-button`, `.echo-button--primary`, `.echo-button--complete`, `.echo-button--quiet`, `.echo-button--danger`, `.echo-button--sm`, `.echo-button--icon`. The default, complete, and primary styles use EchoGallery's glass-like modal action treatment. Add `.echo-button--fit` or pass `fullWidth: false` when the button should size to its content.
- Button interface: see [`components/button/README.md`](components/button/README.md) for the complete field, state, method, DOM, and integration contract.
- Fields: `.echo-field`, `.echo-field__label`, `.echo-input`, `.echo-field__hint`, `.echo-field--error`.
- Surfaces: `.echo-card`, `.echo-card--padded`, `.echo-card--interactive`.
- Segmented controls: `.echo-segmented` with `.echo-segmented__option` buttons and `aria-pressed` state.
- Segmented Control API: see [`components/segmented/README.md`](components/segmented/README.md) for item configuration, selection updates, keyboard navigation, and change events.
- Setting Row API: see [`components/setting-row/README.md`](components/setting-row/README.md) for collapsible settings panels and content composition.
- Main navigation: `.echo-main-nav` with icon-only `.echo-main-nav__item` buttons; mark the active item with `aria-current="page"`.
- Modals: `.echo-modal-overlay` contains a `.echo-modal[role="dialog"][aria-modal="true"]` panel. Add `data-echo-modal-open="modal-id"` to an opener and `data-echo-modal-close` to close controls, then call `installModalInteractions()` for overlay, Escape, focus trapping, and focus restoration. The initial `installDialogTriggers()` export and `data-echo-dialog-open` attribute remain supported as aliases.
- Tabs API: see [`components/tab/README.md`](components/tab/README.md) for `createEchoTabs()`, `upgradeEchoTabs()`, and the compact mobile picker contract.
- Modal API: see [`components/modal/README.md`](components/modal/README.md) for content composition, Echo Button actions, and focus behavior.
- Input API: see [`components/input/README.md`](components/input/README.md) for labeled fields, textarea support, hints, errors, and controlled updates.

For a package-manager or local workspace consumer, import `@echo/kit` from the package root or `@echo/kit/button` for the Button-only entry. For a static app, use the `/js/echokit.js` entry shown above, or import `/components/button/index.js` directly. Both paths expose the same native API, so an app can start with static files and move to a package workflow later without changing component code.

The current extraction is intentionally small. Promote another component to the shared API only after it has a clear cross-app use case and passes light/dark, narrow-screen, keyboard, and reduced-motion checks.
