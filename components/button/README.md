## Quick Configuration

Use `color`, `icon`, and `label`. Color accepts Apple-style system color names (`gray`, `red`, `orange`, `yellow`, `green`, `mint`, `teal`, `cyan`, `blue`, `indigo`, `purple`, `pink`, `brown`) or #RGB / #RRGGBB. Named colors use overridable light/dark CSS tokens; these web tokens are not native UIKit dynamic color APIs. Color does not imply an action or status. Glass, shadows and hover remain built in, and foregrounds stay white. A bare icon string is an SF Symbol name, so `icon: "checkmark"` needs no asset path.

Buttons with icons become compact icon-only controls on narrow screens by default. This responsive behavior is built in rather than a configuration field. Accessible names remain available.

# Echo Button

Button is EchoKit's shared native HTML button. It owns the button structure, semantic visual states, icon/label rendering, and a small imperative controller API.

**Status:** implemented and available in EchoKit `0.1.0`.

## Import

Load the complete EchoKit stylesheet, then import the component entry point:

```html
<link rel="stylesheet" href="/echokit/css/echokit.css">
<script type="module">
  import { createEchoButton } from "/echokit/components/button/index.js";
</script>
```

The package entry points are also available:

```js
import { createEchoButton } from "@echo/kit/button";
```

## Public Interface

### Factory Functions

| Function | Parameters | Returns | Purpose |
| --- | --- | --- | --- |
| `createEchoButton(options)` | `EchoButtonOptions` | `EchoButtonElement` | Creates a new native `<button>` and applies the EchoKit contract. |
| `upgradeEchoButton(element, options)` | `HTMLButtonElement`, optional options | `EchoButtonElement` | Applies the contract to an existing button and replaces its managed children. |
| `updateEchoButton(element, options)` | `HTMLButtonElement`, partial options | `EchoButtonElement` | Convenience alias for updating or upgrading a button. |
| `getEchoButtonController(element)` | `HTMLButtonElement` | `EchoButtonController` | Returns the controller attached to the button, or `null`. |

### `EchoButtonOptions`

| Field | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `""` | No | Visible button text. |
| `icon` | `SF Symbol name \| URL \| { sfSymbol \| url, alt } \| null` | `null` | No | Bare names resolve from EchoKit's `SFSymbols/` assets; URL-like strings and `{ url }` provide custom assets. Icons are decorative; use `ariaLabel` for the button's accessible name. |
| `iconAlt` | `string` | `""` | No | Fallback icon metadata used when `icon` is a string. |
| `variant` | `EchoButtonVariant` | `"default"` | No | Semantic visual treatment. |
| `color` | `EchoSystemColor \| HEX \| null` | `null` | No | System color name or #RGB / #RRGGBB; independent of action semantics. |
| `state` | `string` | `""` | No | State name written to `data-button-state`; `setState()` uses it to select a matching visual variant when available. |
| `size` | `"md" \| "sm" \| "icon"` | `"md"` | No | Standard, compact, or icon-only sizing. `"icon"` renders a circular control at the shared control height. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | No | Native button type. |
| `disabled` | `boolean` | `false` | No | Disables the native button and applies the disabled treatment. |
| `ariaLabel` | `string` | `label` or `"Button"` | No | Accessible name, especially important for icon-only buttons. |
| `title` | `string` | `""` | No | Native tooltip text. |
| `id` | `string` | `""` | No | Native element ID. |
| `name` | `string` | `""` | No | Native form name. |
| `value` | `string` | `""` | No | Native form value. |
| `className` | `string \| string[]` | `""` | No | Additional host-app classes. Do not use this to replace a semantic variant. |
| `attributes` | `Record<string, string \| number \| boolean \| null \| undefined>` | `{}` | No | Additional HTML attributes. Avoid overriding fields managed by the interface. |
| `dataset` | `Record<string, string \| number \| boolean \| null \| undefined>` | `{}` | No | Additional `data-*` values. |
| `onClick` | `(event, button) => void` | `null` | No | EchoKit-owned click handler. External event listeners remain supported. |

### Variants

| Variant | Intended meaning | CSS class |
| --- | --- | --- |
| `default` | Neutral action | `.echo-button` |
| `primary` | Main confirmation or submit action; uses iOS system blue by default | `.echo-button--primary` |
| `complete` | Successful or completed action; uses iOS system blue by default | `.echo-button--complete` |
| `danger` | Destructive action | `.echo-button--danger` |
| `quiet` | Low-emphasis action | `.echo-button--quiet` |
| `switch` | Neutral glass treatment for an icon toggle or switch | `.echo-button--switch` |

Supported semantic aliases are `accent` → `primary`, `destructive` → `danger`, `neutral` → `default`, and `success` → `complete`.

Use `variant: "switch"` with `size: "icon"` for a compact icon-only toggle. The consuming app owns the state and can update the icon and `aria-pressed` value through `onClick` or `button.echoButton.update()`.

### `EchoButtonController`

Every button returned by `createEchoButton()` or `upgradeEchoButton()` exposes `button.echoButton`:

| Method | Returns | Purpose |
| --- | --- | --- |
| `update(options)` | `HTMLButtonElement` | Applies a partial update and rerenders the managed icon/label structure. |
| `setState(state, options)` | `HTMLButtonElement` | Updates the state and optionally changes its label, icon, or variant. |
| `getOptions()` | `EchoButtonOptions` | Returns the current normalized options. |
| `destroy()` | `void` | Removes the EchoKit-owned click handler and controller reference; it does not remove the DOM element. |

## Usage

### Create a Button

```js
import { createEchoButton } from "/echokit/components/button/index.js";

const saveButton = createEchoButton({
  label: "保存",
  icon: "square.and.arrow.down",
  variant: "primary",
  onClick: () => saveChanges(),
});

document.querySelector("#actions").append(saveButton);
```

### Update a Button

```js
saveButton.echoButton.update({
  label: "保存中",
  disabled: true,
});

saveButton.echoButton.setState("complete", {
  label: "已保存",
  icon: "checkmark",
});
```

### Upgrade Existing Markup

```html
<button id="delete-button" type="button">
  删除
</button>
```

```js
import { upgradeEchoButton } from "/echokit/components/button/index.js";

const deleteButton = upgradeEchoButton(
  document.querySelector("#delete-button"),
  {
    variant: "danger",
    icon: "trash",
    ariaLabel: "删除",
  },
);
```

`upgradeEchoButton()` owns the button's direct icon and label children. Existing application event listeners are preserved, but application-specific child markup should be provided through the public options instead of being added inside the button.

## DOM Contract

The managed structure is intentionally stable:

```html
<button class="echo-button">
  <span class="echo-button__icon-wrap">
    <img class="echo-button__icon" alt="" aria-hidden="true">
  </span>
  <span class="echo-button__label">保存</span>
</button>
```

The icon wrapper is omitted when no icon is provided. For `size: "icon"`, the label remains in the DOM for accessibility but is visually clipped.

## Integration Rules

- Use system color names or HEX through `color`; let the component handle materials. Legacy `variant` names remain supported for compatibility, but are not color values.
- Use `ariaLabel` for icon-only buttons and labels whose visible text is not enough to describe the action.
- Use SF Symbol names for shared interface icons, such as `"checkmark"` or `"trash"`. Use an explicit URL (or `{ url }`) only for custom assets; Button does not inline or mutate SVG source.
- Button sizes the icon by height and preserves the asset's natural width-to-height ratio.
- Keep business logic in the consuming app; Button only owns presentation and its local click handler.
- Keep Button styles in `components/button/button.css`; do not duplicate them in app-specific component folders.
