# EchoSettingRow

`EchoSettingRow` recreates EchoGallery's application settings panel: a 44px icon, title and supporting description, disclosure chevron, inset content area, and animated collapse. It starts collapsed. The host app supplies the panel content and any persistence policy.

```js
import { createEchoField } from "@echo/kit/input";
import { createEchoSettingRow } from "@echo/kit/setting-row";

const row = createEchoSettingRow({
  icon: "gearshape",
  title: "应用设置",
  description: "调整应用偏好。",
  expanded: false,
  content: createEchoField({ label: "显示名称", value: "Echo" }),
});
container.append(row);
```

Options include `icon`, `title`, `description`, `content`, `expanded`, `collapsible`, `disabled`, `ariaLabel`, and `onToggle`. Icons accept SF Symbol names or custom URLs, including `{ url }` descriptors. `content` accepts a node, a list of nodes, or a function that returns nodes. The controller exposes `update()`, `setExpanded()`, `getOptions()`, and `destroy()`.
