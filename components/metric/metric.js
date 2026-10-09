import { resolveEchoIcon } from "../icon.js";

function isSymbolName(icon) {
  if (typeof icon === "string") {
    const value = icon.trim();
    return Boolean(value) && !/^(?:[a-z][a-z\d+.-]*:|\/|\.\.?\/|#)/i.test(value) && !value.includes("/");
  }
  return Boolean(icon && typeof icon === "object" && (typeof icon.sfSymbol === "string" || typeof icon.name === "string"));
}

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
      if (isSymbolName(value.icon)) icon.dataset.echoSymbol = "true";
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
