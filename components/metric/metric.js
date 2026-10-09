import { resolveEchoIcon } from "../icon.js";

export function createEchoMetric(options = {}) {
  const element = document.createElement("div");
  const render = (value) => {
    element.className = ["echo-metric", value.className].filter(Boolean).join(" ");
    element.replaceChildren();
    if (value.icon) {
      const icon = document.createElement("img");
      icon.className = "echo-metric__icon";
      icon.src = resolveEchoIcon(value.icon) || "";
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      element.append(icon);
    }
    const content = document.createElement("span");
    content.className = "echo-metric__value";
    content.textContent = String(value.value ?? "");
    const label = String(value.label ?? "");
    element.append(content);
    element.title = [label, content.textContent].filter(Boolean).join("：");
    element.setAttribute("aria-label", element.title);
  };
  let current = { ...options };
  render(current);
  element.echoMetric = {
    update(patch = {}) { current = { ...current, ...patch }; render(current); return element; },
    getOptions() { return { ...current }; },
  };
  return element;
}
