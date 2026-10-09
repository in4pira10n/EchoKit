import { resolveEchoIcon } from "../icon.js";

function classes(value) {
  return (Array.isArray(value) ? value : String(value || "").split(/\s+/)).filter(Boolean);
}

function isSymbolName(value) {
  return typeof value === "string" && !/^(?:[a-z][a-z\d+.-]*:|\/|\.\.?\/|#)/i.test(value) && !value.includes("/");
}

export function createEchoSegmented(initial = {}) {
  const element = document.createElement("div");
  let options = { items: [], activeId: 0, ariaLabel: "分段选择器", ...initial, items: Array.isArray(initial.items) ? initial.items : [] };
  let clickHandler;
  let keyHandler;

  const render = () => {
    const requestedIndex = Number(options.activeId);
    const activeItem = options.items[requestedIndex];
    options.activeId = activeItem && !activeItem.disabled ? requestedIndex : options.items.findIndex(item => !item.disabled);
    element.className = ["echo-segmented", ...classes(options.className)].join(" ");
    element.setAttribute("role", "group");
    element.setAttribute("aria-label", options.ariaLabel || "分段选择器");
    element.replaceChildren();
    options.items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "echo-segmented__option";
      button.dataset.segmentedId = String(index);
      button.setAttribute("aria-pressed", String(index === options.activeId));
      button.tabIndex = index === options.activeId ? 0 : -1;
      button.setAttribute("aria-label", item.ariaLabel || item.label || `选项 ${index + 1}`);
      button.disabled = Boolean(item.disabled);
      if (item.icon) {
        const icon = document.createElement("img");
        icon.className = "echo-segmented__icon";
        icon.src = resolveEchoIcon(item.icon) || item.icon;
        if (isSymbolName(item.icon)) icon.dataset.echoSymbol = "true";
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");
        button.append(icon);
      }
      if (item.label) {
        const label = document.createElement("span");
        label.textContent = item.label;
        button.append(label);
      }
      element.append(button);
    });
  };

  clickHandler = event => {
    const button = event.target.closest("button[data-segmented-id]");
    if (!button || button.disabled) return;
    const index = Number(button.dataset.segmentedId);
    options.activeId = index;
    element.querySelectorAll(".echo-segmented__option").forEach((option, optionIndex) => {
      option.setAttribute("aria-pressed", String(optionIndex === index));
      option.tabIndex = optionIndex === index ? 0 : -1;
    });
    options.onChange?.(index, options.items[index], event);
  };
  keyHandler = event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const enabled = options.items.map((item, index) => ({ item, index })).filter(entry => !entry.item.disabled);
    if (!enabled.length) return;
    const activePosition = enabled.findIndex(entry => entry.index === options.activeId);
    const nextPosition = event.key === 'Home' ? 0
      : event.key === 'End' ? enabled.length - 1
      : (activePosition + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
    event.preventDefault();
    options.activeId = enabled[nextPosition].index;
    render();
    element.querySelector(`[data-segmented-id="${options.activeId}"]`)?.focus();
    options.onChange?.(options.activeId, options.items[options.activeId], event);
  };
  element.addEventListener("click", clickHandler);
  element.addEventListener("keydown", keyHandler);
  element.echoSegmented = {
    update(next = {}) { options = { ...options, ...next, items: Array.isArray(next.items) ? next.items : options.items }; render(); return element; },
    getOptions() { return { ...options, items: options.items.map(item => ({ ...item })) }; },
    setActive(index) { if (options.items[index] && !options.items[index].disabled) { options.activeId = index; render(); } return element; },
    destroy() { element.removeEventListener("click", clickHandler); element.removeEventListener("keydown", keyHandler); delete element.echoSegmented; },
  };
  render();
  return element;
}
