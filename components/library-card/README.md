# Library Card

`echo-library-card` extracts EchoGallery's `settings-library-row active` presentation. Scanning, persistence, drag sorting and switching remain host-app responsibilities.

## Interface

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| icon | SF Symbol name / URL | none | Avatar symbol or custom icon |
| title | string | empty | Library display name |
| addition | string | empty | Supporting text, commonly the library path |
| attachment | Node[] | generated color dots | Small supplementary content such as accent swatches |
| content | Node[] | [] | Independent components such as `EchoMetric` |
| name | string | empty | Legacy alias for `title` |
| path | string | empty | Legacy alias for `addition` |
| logo | string | empty | Image URL; empty or failed image shows the shared SF Symbol gallery icon |
| accent | string | #636366 | Six-digit hex accent; the default is neutral graphite |
| active | boolean | true | Current-library treatment |
| primary | boolean | false | Primary-library mark |
| available | boolean | true | Availability badge and opacity |
| rebuildRequired | boolean | false | Rebuild-needed badge |
| metrics | Array<{label, value, icon?}> | [] | Legacy metric data; prefer `content` with `EchoMetric` elements |
| onClick | (event, card) => void | null | Optional action, with Enter/Space support |
| draggable | boolean | false | Native drag with dragging appearance; host owns ordering |
| onDragStart / onDragEnd | (event, card) => void | null | Host drag lifecycle callbacks |

## Controller

`card.echoLibraryCard.update(options)` applies partial updates. `getOptions()` returns fields with copied metrics. `destroy()` removes owned listeners and controller, leaving the DOM.


## Template

```js
import { createEchoLibraryCard } from '@echo/kit/library-card';
import { createEchoMetric } from '@echo/kit/metric';
const card = createEchoLibraryCard({
  icon: "photo",
  title: library.name,
  addition: library.path,
  attachment: ["#636366", "#79797e", "#929297", "#aaaab0", "#c4c4ca", "#dedee3"],
  content: [createEchoMetric({ icon: "calendar", label: "创建日期", value: "2026-10-08" })],
  active: library.id === activeLibraryId,
  metrics: [{ label: '照片', value: String(library.photoCount) }],
  onClick: () => selectLibrary(library.id),
});
container.append(card);
```

Load `@echo/kit/css` once. The card uses a neutral surface with neutral hover, selected, and pressed states in both appearances; the circular avatar has no border. Metrics keep full contrast with secondary-label captions and primary-label values. System fonts only; stacked layout below 900px. Preview values are illustrative, not local-library statistics.

## States And Composition

`active` is controlled by the host, exposed as `aria-pressed` on interactive cards. Provide `onClick` for pointer and Enter/Space activation; unavailable cards expose `aria-disabled` and suppress activation. A demo may toggle active, but real library switching remains an application operation.

Hover raises an interactive card; the controlled `active` state uses a stronger neutral surface, and pointer press adds a distinct neutral treatment with slight scale feedback. Keyboard focus uses a neutral focus indicator. Reduced Motion removes transitions. Metrics remain fully legible in both light and dark appearances; SF Symbol glyphs adapt to the dark appearance while custom image icons retain their original colors.

Use factories (`() => createEchoMetric(...)`) to compose reusable card content, so each card owns separate DOM nodes. Attachment accepts HEX swatches or nodes; an empty array deliberately hides swatches. `getOptions()` copies content and attachment arrays. SF avatar symbols use a fixed width and natural height; image avatars retain circular cropping.
