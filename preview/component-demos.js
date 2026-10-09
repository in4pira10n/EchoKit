import { createEchoInput } from "../components/input/index.js";
import { createEchoButton } from "../components/button/index.js";
import { createEchoLibraryCard } from "../components/library-card/index.js";
import { createEchoSegmented } from "../components/segmented/index.js";
import { createEchoSettingRow } from "../components/setting-row/index.js";
import { libraryDemoOptions } from "./library-card-demo.js?v=20261010-card-interaction-contrast";

export function mountPrimitiveDemos(root = document) {
  const segmentedMount = root.querySelector("#segmented-demo");
  if (segmentedMount) {
    const status = root.querySelector("#segmented-demo-status");
    const segmented = createEchoSegmented({
      ariaLabel: "外观模式",
      activeId: 0,
      items: ["系统", "浅色", "深色"].map(label => ({ label })),
      onChange: index => { if (status) status.textContent = `已选择「${["系统", "浅色", "深色"][index]}」。`; },
    });
    segmentedMount.replaceChildren(segmented);
  }

  const inputMount = root.querySelector("#input-demo");
  if (inputMount) {
    const fields = document.createElement("div");
    fields.className = "echo-kit-practice-fields echo-kit-input-demo-fields";
    fields.setAttribute("role", "group");
    fields.setAttribute("aria-label", "Input 组件示例");
    const field = document.createElement("label");
    field.className = "echo-kit-practice-field";
    const meta = document.createElement("span");
    meta.className = "echo-kit-practice-field-meta";
    const label = document.createElement("span");
    label.textContent = "显示名称";
    const property = document.createElement("code");
    property.textContent = "value";
    meta.append(label, property);
    const input = createEchoInput({ id: "echo-kit-input-demo-field", value: "EchoGallery", placeholder: "请输入名称", ariaLabel: "显示名称示例" });
    input.classList.add("echo-kit-practice-input");
    field.append(meta, input);
    const note = document.createElement("p");
    note.className = "echo-kit-component-copy echo-kit-input-demo-note";
    note.textContent = "输入框可独立使用，也可与标签、注释和校验状态组合成完整字段。";
    fields.append(field, note);
    inputMount.replaceChildren(fields);
  }

  const rowMount = root.querySelector("#setting-row-demo");
  if (rowMount) {
    const content = document.createElement("div");
    content.className = "echo-setting-row__application-grid";
    const cardOptions = {
      ...libraryDemoOptions,
      onClick: (_, card) => card.echoLibraryCard.update({ active: !card.echoLibraryCard.getOptions().active }),
    };
    const libraryCard = createEchoLibraryCard(cardOptions);
    const actions = document.createElement("div");
    actions.className = "echo-setting-row__demo-actions";
    const note = document.createElement("p");
    note.className = "echo-setting-row__demo-note";
    note.setAttribute("aria-live", "polite");
    note.textContent = "点击资源库卡片可切换选中态。";
    const addButton = createEchoButton({
      label: "添加资源库",
      icon: "plus",
      variant: "primary",
      className: "echo-setting-row__add-action",
      ariaLabel: "添加资源库示例",
      onClick: () => { note.textContent = "应用可在这里接入添加资源库流程。"; },
    });
    actions.append(addButton);
    content.append(libraryCard, actions, note);
    rowMount.replaceChildren(createEchoSettingRow({
      icon: "square.grid.2x2",
      title: "资源库",
      description: "管理当前用户可用资源库；切换后保存并重启生效。",
      content,
      expanded: false,
      ariaLabel: "资源库设置面板",
    }));
  }
}
