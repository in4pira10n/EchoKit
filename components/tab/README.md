# EchoTabs

`components/tab/` owns the icon-only EchoGallery main navigation and its compact mobile picker behavior. Use SF Symbol names directly for each item; custom icon URLs are also supported. Item IDs are their zero-based array indexes, and `activeId` uses the same numeric index.

```js
import { createEchoTabs } from "@echo/kit/tab";

const tabs = createEchoTabs({
  id: "main-nav",
  tabs: 2,
  activeId: 0,
  items: [
    { icon: "timer", iconActive: "timer", ariaLabel: "时间线" },
    { icon: "photo.stack.fill", ariaLabel: "相册" },
  ],
  onChange: (index) => console.log(index),
});
document.querySelector("#navigation").append(tabs);
```

On narrow screens the active icon becomes the picker trigger. Clicking it opens the remaining items without changing the active view.

`items` may also be a simple array of SF Symbol names, such as `["timer", "heart", "shuffle"]`. If `tabs` is supplied, it limits the displayed item count; normally keep it equal to `items.length`. Use item objects with `ariaLabel` when the symbol alone does not provide a clear accessible name.
