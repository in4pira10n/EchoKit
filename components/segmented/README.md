# EchoSegmented

`createEchoSegmented` renders a mutually exclusive set of choices with selected state, click handling, and arrow-key navigation.

```js
import { createEchoSegmented } from "@echo/kit/segmented";

const appearance = createEchoSegmented({
  ariaLabel: "外观",
  items: [{ label: "系统" }, { label: "浅色" }, { label: "深色" }],
  activeId: 0,
  onChange(index, item) {
    console.log(index, item.label);
  },
});
container.append(appearance);
```

`activeId` is a zero-based index. Each item may define `label`, `icon`, `ariaLabel`, and `disabled`. Icon strings can be SF Symbol names or custom URLs; descriptor objects such as `{ url: "/icons/example.svg" }` are also supported. The returned element exposes `echoSegmented.update()`, `setActive()`, `getOptions()`, and `destroy()`.
