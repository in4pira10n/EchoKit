# EchoModal

`components/modal/` owns the overlay, focus trap, Escape handling, focus restoration, and modal action composition.

```js
import { createEchoModal } from "@echo/kit/modal";
import { createEchoField } from "@echo/kit/input";

const modal = createEchoModal({
  id: "library-modal",
  title: "编辑资源库",
  icon: "slider.horizontal.3",
  addition: "修改完成后即可继续。",
  content: (body) => body.append(createEchoField({ label: "名称", name: "name" })),
  actions: [
    { label: "取消", icon: "xmark", color: "gray" },
    { label: "保存", icon: "square.and.arrow.down", color: "blue" },
  ],
});
document.body.append(modal);
modal.echoModal.open();
```

Static markup is also supported. Add `data-echo-modal-open`, `data-echo-modal-close`, and call `installModalInteractions()` once.
