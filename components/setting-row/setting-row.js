import { resolveEchoIcon } from "../icon.js";

function isSymbolName(value) {
  return typeof value === "string" && !/^(?:[a-z][a-z\d+.-]*:|\/|\.\.?\/|#)/i.test(value) && !value.includes("/");
}

export function createEchoSettingRow(initial = {}) {
  const element = document.createElement("section");
  const contentId = `echo-setting-row-content-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`;
  let options = { icon: "slider.horizontal.3", title: "设置", description: "", content: null, expanded: false, collapsible: true, disabled: false, ...initial };
  let contentSource = Symbol("unrendered");
  let contentNodes = [];
  let headerElement;
  let contentElement;
  const syncExpanded = expanded => {
    options.expanded = Boolean(expanded);
    const visible = !options.collapsible || options.expanded;
    element.classList.toggle("is-expanded", visible);
    element.classList.toggle("is-collapsed", !visible);
    if (headerElement && options.collapsible) headerElement.setAttribute("aria-expanded", String(options.expanded));
    if (contentElement) {
      contentElement.setAttribute("aria-hidden", String(!visible));
      contentElement.inert = !visible;
    }
  };
  const render = () => {
    element.className = `echo-setting-row${options.disabled ? " is-disabled" : ""}`;
    const header = document.createElement(options.collapsible ? "button" : "div");
    headerElement = header;
    header.className = "echo-setting-row__header";
    if (options.collapsible) {
      header.type = "button";
      header.disabled = options.disabled;
      header.setAttribute("aria-expanded", String(Boolean(options.expanded)));
      header.setAttribute("aria-controls", contentId);
    }
    if (options.ariaLabel) header.setAttribute("aria-label", options.ariaLabel);
    const icon = document.createElement("img");
    icon.className = "echo-setting-row__icon";
    const iconSource = resolveEchoIcon(options.icon);
    if (iconSource) icon.src = iconSource;
    if (isSymbolName(options.icon)) icon.dataset.echoSymbol = "true";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const copy = document.createElement("span");
    copy.className = "echo-setting-row__head-copy";
    const title = document.createElement("span");
    title.className = "echo-setting-row__title";
    title.setAttribute("role", "heading");
    title.setAttribute("aria-level", "3");
    title.textContent = options.title || "";
    copy.append(title);
    if (options.description) {
      const description = document.createElement("span");
      description.className = "echo-setting-row__description";
      description.textContent = options.description;
      copy.append(description);
    }
    header.append(icon, copy);
    if (options.collapsible) {
      const chevron = document.createElement("img");
      chevron.className = "echo-setting-row__chevron";
      chevron.src = resolveEchoIcon("chevron.backward") || "";
      chevron.alt = "";
      chevron.setAttribute("aria-hidden", "true");
      header.append(chevron);
    }
    const content = document.createElement("div");
    contentElement = content;
    content.className = "echo-setting-row__content";
    content.id = contentId;
    const inner = document.createElement("div");
    inner.className = "echo-setting-row__content-inner";
    if (contentSource !== options.content) {
      contentSource = options.content;
      const value = typeof options.content === "function" ? options.content() : options.content;
      const nodes = Array.isArray(value) ? value : [value];
      contentNodes = nodes.flatMap(node => node?.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? [...node.childNodes] : [node])
        .filter(node => node instanceof Node);
    }
    contentNodes.forEach(node => inner.append(node));
    content.append(inner);
    element.replaceChildren(header, content);
    syncExpanded(options.expanded);
  };
  const clickHandler = event => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!options.collapsible || options.disabled || !target?.closest(".echo-setting-row__header")) return;
    syncExpanded(!options.expanded);
    options.onToggle?.(options.expanded, event);
  };
  element.addEventListener("click", clickHandler);
  element.echoSettingRow = {
    update(next = {}) {
      if (Object.keys(next).length === 1 && Object.hasOwn(next, "expanded")) syncExpanded(next.expanded);
      else { options = { ...options, ...next }; render(); }
      return element;
    },
    getOptions() { return { ...options }; },
    setExpanded(expanded) { syncExpanded(expanded); return element; },
    destroy() { element.removeEventListener("click", clickHandler); delete element.echoSettingRow; },
  };
  render();
  return element;
}
