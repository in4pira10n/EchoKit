此文档意在描述组件 `components` 所应遵循的设计原则以及符合的字段约束。

> 1. **标题**是组件的名称，不代表调用时具体名称。
>
> 2. **字段提示**只展示用户必须提供的最小配置。尺寸、响应式、材质、动效、焦点管理和无障碍基础行为由组件统一承担，不作为详情页的可调字段。
> 3. **字段规则**可能在某些复杂组件出现。
> 4. **最佳实践**是指用户快速上手可用的最小实例；**模版**代表组件内置可调用的最小实例。模版并不必须提供，若提供则会展示。

# 0. 通用图标规则

EchoKit 内置 SF Symbols。SF Symbol 与自定义图标都保留资源自身的宽高比。组件只设定图标高度，宽度按资源比例自然计算；不得将图标强制塞入正方形框或拉伸变形。此规则适用于按钮、导航、模态窗口、卡片及预览界面。

---

# 1. 按钮 Button

应保留玻璃质感等基础特性。

## 字段提示

| 字段名 | 变量名 | 类型 |
| :----: | :----: | :--: |
| 图标 | icon | url, sf_symbols_name |
| 文本 | label | text |
| 主色 | color | hex, text |

## 字段规则

| 字段  | 使用规则                                                     |
| :---: | :----------------------------------------------------------- |
| icon  | 使用 SF Symbol 时只填写符号名（例如 `checkmark`）；自定义图标填写 URL。图标用于强化操作含义，不替代无障碍名称。没有图标时按钮只显示文本。 |
| label | 使用简短、明确的动作文本；纯图标按钮由调用方提供无障碍名称。 |
| color | 使用系统颜色名：`gray`、`red`、`orange`、`yellow`、`green`、`mint`、`teal`、`cyan`、`blue`、`indigo`、`purple`、`pink`、`brown`；也允许 `#RGB` / `#RRGGBB`。颜色名称不代表业务含义。 |

按钮的圆角、玻璃材质、阴影、hover、按下反馈和窄屏图标化由组件内建，不在字段提示中配置。

## 模版

| 模版名 | icon | label | color |
| :----: | :--: | :---: | :----: |
| neutral | xmark | 取消 | gray |
| primary | square.and.arrow.down | 保存 | blue |
| complete | checkmark | 完成 | blue |
| danger | trash | 删除 | red |
| switch | sun.max | 切换外观 | gray |

模板名称描述用途，`color` 仅描述颜色。`primary` 与 `complete` 模板默认使用 iOS 系统蓝色；切换模板另设 `variant: 'switch'`，保留无染色玻璃效果。颜色 token 使用 `--echo-color-blue` 等名称，适配深浅色，可由应用覆盖。这是网页调色板，不是 UIKit 原生动态颜色 API；Apple 系统色会随平台和系统版本变化，不将示例 HEX 视为永久规范。遵循 HIG，不仅依赖颜色传达含义，并检查深浅色、半透明背景与对比度。

# 2. 导航 Tabs

应保留手机端变为 1 个、折叠的特性。

## 字段提示

| 字段名 | 变量名 | 类型 |
| :----: | :----: | :--: |
| 导航数 | tabs | number |
| 导航项目 | items | array |
| 当前项目 | activeId | number |

## 最佳实践

| 模版名 | tabs | items | activeId |
| :----: | :---: | :------: | :------: |
| EchoGallery 时间线 | 7 | [ timer, heart, shuffle, photo.stack.fill, memories, trash, gearshape ] | 0 |
| 媒体筛选器 | 3 | [ photo.stack.fill, photo, video.fill ] | 0 |

# 3. 模态窗口 Modal

应保留玻璃质感（背景半透明、边缘高光等），里面的 content 可以使用 EchoKit 的各种组件。

图标位于标题上方，使用 72px 方形底座，SF Symbol 保持原始比例；图片使用相同尺寸并裁切为圆形，不做前景色滤镜。底部操作按钮无论数量均在同一行等分宽度，直接沿用 EchoButton 的语义颜色、玻璃材质与响应式行为；遵循「完成」在最右侧、「取消」最左侧的逻辑。

## 字段提示

| 字段名 | 变量名 | 类型 |
| :----: | :----: | :--: |
|  图标  |   icon   | url, sf_symbols_name |
| 标题 | title | text |
| 说明 | addition | text |
| 内容 | content | Array<Node \| (body: HTMLElement) => Node \| void> |
| 操作 | actions | Array<EchoModalAction \| HTMLButtonElement> |

## 最佳实践

| 模版名 | icon | title | addition | content | actions |
| :----: | :----: | ------ | ------ | ------ | ------ |
| 资料编辑窗口 | slider.horizontal.3 | 编辑资料 | 请填写如下表单以完成申请 | 姓名与年龄两个 EchoField | 取消、完成两个 EchoModalAction |
| EchoGallery 资源库编辑卡 | assets/background.JPG | 编辑资料库 | 点击头像更换图片；您可以在下方填写其他信息。 | 三个 EchoField 与一个颜色选择器 | 保存、切换、取消、完成四个 EchoModalAction |

```js
const profileModal = createEchoModal({
  icon: 'slider.horizontal.3',
  title: '编辑资料',
  addition: '请填写如下表单以完成申请',
  content: [
    createEchoField({ label: '姓名', name: 'name' }),
    createEchoField({ label: '年龄', name: 'age', type: 'number' }),
  ],
  actions: [
    { icon: 'xmark', label: '取消', color: 'gray' },
    { icon: 'checkmark', label: '完成', variant: 'complete' },
  ],
});
```

资源库编辑卡的颜色选择器使用 `input[type="color"]` 节点，通过 `content` 插入；应用负责同步颜色值及头像上传逻辑。预览使用 `embedded: true` 直接展示窗口，操作配置 `close: false` 保持窗口显示；正常应用由 `echoModal.open()` 打开窗口。

# 4. 资源库卡片 Card

应保留其适应性以及 hover、active 的不同特性；这里 SF Symbol 宽度应该统一，不要限制高度。

## 字段提示

| 字段名 | 变量名 | 类型 |
| :----: | :----: | :--: |
|   图标   |    icon    | url, sf_symbols_name  |
|   标题   |   title    |         text          |
|   说明   |  addition  |         text          |
| 补充信息 | attachment |         array         |
|   内容   |  content   | Array<Node \| () => Node> |

## 最佳实践

| 模版名 | icon | title | addition | attachment | content |
| :----: | :--: | :----: | :-------: | --------- | --------- |
| EchoGallery 资料库卡片 | photo | EchoGallery | /home/Pictures/EchoGallery | 六个 HEX 色值 | 六个独立 EchoMetric 组件 |

```js
const card = createEchoLibraryCard({
  icon: 'photo',
  title: 'EchoGallery',
  addition: '/home/Pictures/EchoGallery',
  attachment: ['#636366', '#79797e', '#929297', '#aaaab0', '#c4c4ca', '#dedee3'],
  content: [
    () => createEchoMetric({ icon: 'calendar', label: '创建日期', value: '2026-10-08' }),
    () => createEchoMetric({ icon: 'clock', label: '上次扫描', value: '尚未扫描' }),
    () => createEchoMetric({ icon: 'exclamationmark.triangle', label: '不支持的媒体', value: 0 }),
    () => createEchoMetric({ icon: 'externaldrive', label: '存储', value: '0 B' }),
    () => createEchoMetric({ icon: 'photo', label: '照片', value: 0 }),
    () => createEchoMetric({ icon: 'video', label: '视频', value: 0 }),
  ],
  active: true,
  onClick: (_, element) => {
    element.echoLibraryCard.update({ active: !element.echoLibraryCard.getOptions().active });
  },
});
```

Metric 是独立组件，呈现图标与数值；`label` 用于无障碍名称与悬浮说明。卡片内 Metric 的透明度为 40%。重复展示时使用内容工厂函数，避免同一个 DOM 节点被移动到另一张卡片。卡片 hover 上移 1px；`active` 表示选中状态，不是鼠标按下状态。

卡片交互由 `onClick` 启用，支持 Enter / Space，`active` 同步 `aria-pressed`；`available: false` 时禁用激活并显示文字状态。增强对比度时 Metric 恢复不透明；默认 40% 透明度不保证重要统计文字达到可读性对比度要求。浅色卡片表面在深浅外观中保持一致，前景使用卡片内部的 label 角色，避免继承白色文字。

# 5. iOS 颜色角色（Web 映射）

`tokens/ios.css` 定义可覆盖的网页颜色角色，不代表原生 UIColor，也不保证跟随每一版 iOS 数值。命名与用途遵循 iOS：

| 角色 | Token 示例 | 用途 |
| --- | --- | --- |
| 系统灰阶 | `--echo-color-gray2` 至 `--echo-color-gray6` | 六级中性灰（第一级为 gray） |
| 系统背景 | `--echo-color-system-background`、`--echo-color-secondary-system-background`、`--echo-color-tertiary-system-background` | 页面、组、组内内容 |
| 分组背景 | `--echo-color-system-grouped-background` 及 secondary / tertiary 对应项 | 分组表单和列表 |
| 前景 | `--echo-color-label`、secondary / tertiary / quaternary label | 文字重要性层级，不用于背景 |
| 占位与链接 | `--echo-color-placeholder-text`、`--echo-color-link` | 占位提示和可点击链接 |
| 分隔线 | `--echo-color-separator`、`--echo-color-opaque-separator` | 透明与不透明分隔线，不用于文字 |
| 填充 | `--echo-color-fill` 及 secondary / tertiary / quaternary fill | 控件与内容填充 |
| 标准材质 | `--echo-material-ultra-thin` / thin / regular / thick | 从薄到厚的材质表面 |

提供深浅色值、`prefers-contrast: more` 与 `prefers-reduced-transparency: reduce` 回退。原生 Liquid Glass 与网页 backdrop-filter 并非同一种实现。当前展示页保留手动切换外观用于验收；宿主应用自行绑定系统外观。自定义 HEX 不会自动产生深色与高对比度变体，宿主仍需验证，不能只通过颜色传达状态。
