# EchoInput

`components/input/` owns the reusable labeled field used by forms and Modal content.

```js
import { createEchoField } from "@echo/kit/input";

const field = createEchoField({
  label: "资源库名称",
  name: "libraryName",
  placeholder: "请输入名称",
  hint: "名称会显示在资源库列表中。",
});
form.append(field);
```

The returned field exposes `field.echoField.input` and supports `update()`, `getOptions()`, and `destroy()`. Use `createEchoInput()` when a bare input element is needed. Supported types include text, search, number, email, password, tel, and url; number steppers are hidden by the shared stylesheet.
