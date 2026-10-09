import { resolveEchoIcon } from "../icon.js";

const DEFAULT_OPTIONS = Object.freeze({
  tabs: undefined,
  items: [],
  activeId: 0,
  ariaLabel: "Tabs",
  id: "",
  className: "",
  compactMedia: "(max-width: 900px)",
  onChange: null,
});

const SYMBOL_LABELS = Object.freeze({
  timer: "时间线",
  heart: "个人收藏",
  shuffle: "乱序相册",
  "photo.stack.fill": "相册",
  memories: "回忆",
  trash: "回收站",
  gearshape: "设置",
  photo: "照片",
  "video.fill": "视频",
});

function normalizeClassNames(className) {
  if (Array.isArray(className)) return className.flatMap(normalizeClassNames);
  return String(className || "")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function fallbackLabel(icon, index) {
  const name = typeof icon === "string" ? icon.split(/[/?#]/).pop()?.replace(/\.svg$/i, "") : "";
  return SYMBOL_LABELS[name] || name || `导航 ${index + 1}`;
}

function normalizeItems(items, count) {
  const source = Array.isArray(items) ? items : [];
  const requestedCount = Number(count);
  const limit = Number.isInteger(requestedCount) && requestedCount >= 0 ? requestedCount : source.length;

  return source.slice(0, limit).map((value, index) => {
    const item = value && typeof value === "object" && !Array.isArray(value)
      ? value
      : { icon: value };
    const fallback = fallbackLabel(item.icon, index);
    return {
      id: index,
      label: String(item.label ?? ""),
      icon: resolveEchoIcon(item.icon) || "",
      iconActive: resolveEchoIcon(item.iconActive ?? item.icon) || "",
      ariaLabel: String(item.ariaLabel ?? item.label ?? item.title ?? fallback),
      title: String(item.title ?? item.ariaLabel ?? item.label ?? fallback),
      disabled: Boolean(item.disabled),
      dataset: { ...(item.dataset || {}) },
    };
  });
}

function normalizeActiveId(value, items) {
  const index = Number(value);
  return Number.isInteger(index) && index >= 0 && index < items.length ? index : 0;
}

function readElementOptions(element) {
  const buttons = [...element.querySelectorAll(":scope > .echo-main-nav__items > .echo-main-nav__item")];
  return {
    tabs: buttons.length,
    items: buttons.map((button, index) => ({
      id: index,
      label: button.getAttribute("aria-label") || "",
      icon: button.dataset.icon || button.querySelector("img")?.getAttribute("src") || "",
      iconActive: button.dataset.iconActive || button.querySelector("img")?.getAttribute("src") || "",
      ariaLabel: button.getAttribute("aria-label") || "",
      title: button.getAttribute("title") || "",
      disabled: button.disabled,
    })),
    activeId: buttons.findIndex((button) => button.hasAttribute("aria-current")),
    ariaLabel: element.getAttribute("aria-label") || DEFAULT_OPTIONS.ariaLabel,
    id: element.id,
  };
}

function createController(element, initialOptions) {
  let sourceItems = Array.isArray(initialOptions.items) ? initialOptions.items : [];
  const initialItems = normalizeItems(sourceItems, initialOptions.tabs);
  let options = {
    ...DEFAULT_OPTIONS,
    ...initialOptions,
    tabs: initialItems.length,
    activeId: normalizeActiveId(initialOptions.activeId, initialItems),
    items: initialItems,
  };
  let managedClasses = new Set();
  const mediaQuery = window.matchMedia(options.compactMedia);

  function syncCompactState() {
    if (!mediaQuery.matches) element.classList.remove("nav-picker-open");
    const active = element.querySelector('.echo-main-nav__item[aria-current="page"]');
    if (mediaQuery.matches && active) {
      active.setAttribute("aria-expanded", String(element.classList.contains("nav-picker-open")));
      active.setAttribute("aria-controls", `${element.id || "echo-tabs"}-items`);
    } else {
      element.querySelectorAll(".echo-main-nav__item").forEach((button) => {
        button.removeAttribute("aria-expanded");
        button.removeAttribute("aria-controls");
      });
    }
  }

  function render() {
    element.classList.add("echo-main-nav");
    managedClasses.forEach((className) => element.classList.remove(className));
    managedClasses = new Set(normalizeClassNames(options.className));
    managedClasses.forEach((className) => element.classList.add(className));
    if (options.id) element.id = options.id;
    element.setAttribute("aria-label", options.ariaLabel);

    const activeId = normalizeActiveId(options.activeId, options.items);
    options.activeId = activeId;
    const items = document.createElement("div");
    items.className = "echo-main-nav__items";
    items.id = `${element.id || "echo-tabs"}-items`;

    options.items.forEach((item) => {
      const button = document.createElement("button");
      button.className = "echo-main-nav__item";
      button.type = "button";
      button.dataset.view = String(item.id);
      button.dataset.icon = item.icon;
      button.dataset.iconActive = item.iconActive;
      button.setAttribute("aria-label", item.ariaLabel);
      if (item.title) button.title = item.title;
      if (item.disabled) button.disabled = true;
      Object.entries(item.dataset).forEach(([name, value]) => {
        if (value !== undefined && value !== null) button.dataset[name] = String(value);
      });
      const image = document.createElement("img");
      image.src = item.id === activeId ? item.iconActive : item.icon;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      button.append(image);
      if (item.id === activeId) button.setAttribute("aria-current", "page");
      items.append(button);
    });
    element.replaceChildren(items);
    syncCompactState();
  }

  function setActive(index, notify = true) {
    const activeIndex = Number(index);
    if (!Number.isInteger(activeIndex) || !options.items[activeIndex]) return element;
    options.activeId = activeIndex;
    element.querySelectorAll(".echo-main-nav__item").forEach((button) => {
      const itemIndex = Number(button.dataset.view);
      const active = itemIndex === activeIndex;
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
      const item = options.items[itemIndex];
      const image = button.querySelector("img");
      if (image && item) image.src = active ? item.iconActive : item.icon;
    });
    element.classList.remove("nav-picker-open");
    syncCompactState();
    if (notify && typeof options.onChange === "function") {
      options.onChange(activeIndex, options.items[activeIndex], element);
    }
    return element;
  }

  function closePicker(restoreFocus = false) {
    if (!element.classList.contains("nav-picker-open")) return element;
    element.classList.remove("nav-picker-open");
    syncCompactState();
    if (restoreFocus) element.querySelector('.echo-main-nav__item[aria-current="page"]')?.focus();
    return element;
  }

  function handleClick(event) {
    const button = event.target.closest(".echo-main-nav__item");
    if (!button || !element.contains(button) || button.disabled) return;
    const index = Number(button.dataset.view);
    if (mediaQuery.matches && index === options.activeId) {
      element.classList.toggle("nav-picker-open");
      syncCompactState();
      return;
    }
    setActive(index);
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && element.classList.contains("nav-picker-open")) {
      event.preventDefault();
      closePicker(true);
    }
  }

  function handleDocumentClick(event) {
    if (element.classList.contains("nav-picker-open") && !element.contains(event.target)) closePicker();
  }

  function handleMediaChange() {
    syncCompactState();
  }

  element.addEventListener("click", handleClick);
  element.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleDocumentClick);
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleMediaChange);
  } else {
    mediaQuery.addListener?.(handleMediaChange);
  }
  render();

  const controller = {
    element,
    update(nextOptions = {}) {
      const patch = nextOptions && typeof nextOptions === "object" ? nextOptions : {};
      if (Object.prototype.hasOwnProperty.call(patch, "items")) {
        sourceItems = Array.isArray(patch.items) ? patch.items : [];
      }
      options = { ...options, ...patch };
      if (Object.prototype.hasOwnProperty.call(patch, "items") || Object.prototype.hasOwnProperty.call(patch, "tabs")) {
        const requestedCount = Object.prototype.hasOwnProperty.call(patch, "tabs")
          ? options.tabs
          : sourceItems.length;
        options.items = normalizeItems(sourceItems, requestedCount);
        options.tabs = options.items.length;
      }
      options.activeId = normalizeActiveId(options.activeId, options.items);
      render();
      return element;
    },
    setActive,
    closePicker,
    getOptions() {
      return { ...options, items: options.items.map((item) => ({ ...item })) };
    },
    destroy() {
      element.removeEventListener("click", handleClick);
      element.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleDocumentClick);
      mediaQuery.removeEventListener?.("change", handleMediaChange);
      mediaQuery.removeListener?.(handleMediaChange);
      delete element.echoTabs;
    },
  };
  element.echoTabs = controller;
  return controller;
}

export function createEchoTabs(options = {}) {
  return createController(document.createElement("nav"), options).element;
}

export function upgradeEchoTabs(element, options = {}) {
  if (!element) throw new TypeError("upgradeEchoTabs requires a navigation element");
  if (element.echoTabs) return element;
  createController(element, { ...readElementOptions(element), ...options });
  return element;
}

export function getEchoTabsController(element) {
  return element?.echoTabs || null;
}
