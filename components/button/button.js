import { resolveEchoIcon } from "../icon.js";

const VARIANT_CLASSES = Object.freeze({
  primary: "echo-button--primary",
  complete: "echo-button--complete",
  danger: "echo-button--danger",
  quiet: "echo-button--quiet",
  switch: "echo-button--switch",
});

const SIZE_CLASSES = Object.freeze({
  sm: "echo-button--sm",
  icon: "echo-button--icon",
});

const VARIANT_ALIASES = Object.freeze({
  accent: "primary",
  destructive: "danger",
  neutral: "default",
  success: "complete",
});

const BUTTON_TYPES = new Set(["button", "submit", "reset"]);
export const ECHO_SYSTEM_COLORS = Object.freeze(["gray", "red", "orange", "yellow", "green", "mint", "teal", "cyan", "blue", "indigo", "purple", "pink", "brown"]);

const DEFAULT_OPTIONS = Object.freeze({
  label: "",
  icon: null,
  iconAlt: "",
  variant: "default",
  state: "",
  size: "md",
  type: "button",
  disabled: false,
  color: null,
  ariaLabel: "",
  title: "",
  id: "",
  name: "",
  value: "",
  className: "",
  attributes: {},
  dataset: {},
  onClick: null,
});

const MANAGED_VARIANT_CLASSES = Object.values(VARIANT_CLASSES);
const MANAGED_SIZE_CLASSES = Object.values(SIZE_CLASSES);

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function normalizeVariant(value) {
  const candidate = String(value ?? "default").trim().toLowerCase();
  const variant = VARIANT_ALIASES[candidate] || candidate;
  return variant in VARIANT_CLASSES || variant === "default" ? variant : "default";
}

function normalizeSize(value) {
  const size = String(value ?? "md").trim().toLowerCase();
  return size in SIZE_CLASSES || size === "md" ? size : "md";
}

function normalizeType(value) {
  const type = String(value ?? "button").trim().toLowerCase();
  return BUTTON_TYPES.has(type) ? type : "button";
}

function normalizeIcon(icon, fallbackAlt = "") {
  if (!icon) return null;

  if (typeof icon === "string") {
    const src = resolveEchoIcon(icon);
    return src ? { src, alt: fallbackAlt } : null;
  }

  if (typeof icon === "object") {
    const src = resolveEchoIcon(icon);
    if (!src) return null;
    return {
      src,
      alt: typeof icon.alt === "string" ? icon.alt : fallbackAlt,
    };
  }

  return null;
}

function normalizeClassNames(className) {
  if (Array.isArray(className)) {
    return className.flatMap(normalizeClassNames);
  }

  return String(className || "")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function readElementOptions(element) {
  const icon = element.querySelector(":scope > .echo-button__icon-wrap > .echo-button__icon");
  const label = element.querySelector(":scope > .echo-button__label");
  const variant = Object.entries(VARIANT_CLASSES).find(([, className]) => element.classList.contains(className))?.[0] || "default";
  const size = Object.entries(SIZE_CLASSES).find(([, className]) => element.classList.contains(className))?.[0] || "md";

  return {
    label: label?.textContent || (icon ? "" : element.textContent.trim()),
    icon: icon?.getAttribute("src") || null,
    iconAlt: icon?.getAttribute("alt") || "",
    variant,
    state: element.dataset.buttonState || "",
    size,
    type: normalizeType(element.getAttribute("type") || "button"),
    disabled: element.disabled,
    ariaLabel: element.getAttribute("aria-label") || "",
    title: element.getAttribute("title") || "",
    id: element.id,
    name: element.getAttribute("name") || "",
    value: element.getAttribute("value") || "",
  };
}

function cloneOptions(options) {
  return {
    ...options,
    icon: options.icon ? { ...options.icon } : null,
    attributes: { ...options.attributes },
    dataset: { ...options.dataset },
  };
}

function setOptionalAttribute(element, name, value) {
  if (value === undefined || value === null || value === "") {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, String(value));
  }
}

function createController(element, initialOptions) {
  let options = {
    ...DEFAULT_OPTIONS,
    ...readElementOptions(element),
    ...initialOptions,
  };
  let clickHandler = null;
  let managedCustomClasses = new Set();
  let managedAttributeNames = new Set();
  let managedDatasetKeys = new Set();

  function applyColor(value) {
    const named = ECHO_SYSTEM_COLORS.includes(value);
    const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(String(value || ''));
    const tinted = (named || Boolean(match)) && options.variant !== 'switch';
    element.classList.toggle('echo-button--custom', tinted);
    if (!tinted) {
      element.style.removeProperty('--echo-button-color');
      return;
    }
    if (named) {
      element.style.setProperty('--echo-button-color', `var(--echo-color-${value})`);
      return;
    }
    const hex = match[1].length === 3 ? [...match[1]].map(char => char + char).join('') : match[1];
    element.style.setProperty('--echo-button-color', `#${hex}`);
  }

  function render() {
    element.classList.add("echo-button");
    MANAGED_VARIANT_CLASSES.forEach((className) => element.classList.remove(className));
    MANAGED_SIZE_CLASSES.forEach((className) => element.classList.remove(className));
    managedCustomClasses.forEach((className) => element.classList.remove(className));
    managedCustomClasses = new Set(normalizeClassNames(options.className));

    const variantClass = VARIANT_CLASSES[options.variant];
    if (variantClass) element.classList.add(variantClass);

    const sizeClass = SIZE_CLASSES[options.size];
    if (sizeClass) element.classList.add(sizeClass);
    managedCustomClasses.forEach((className) => element.classList.add(className));
    applyColor(options.color);

    element.type = normalizeType(options.type);
    element.disabled = Boolean(options.disabled);
    setOptionalAttribute(element, "id", options.id);
    setOptionalAttribute(element, "name", options.name);
    setOptionalAttribute(element, "value", options.value);
    setOptionalAttribute(element, "title", options.title);

    const label = String(options.label ?? "");
    const ariaLabel = String(options.ariaLabel || label || "Button");
    element.setAttribute("aria-label", ariaLabel);
    element.dataset.buttonState = String(options.state || options.variant || "default");

    managedDatasetKeys.forEach((key) => delete element.dataset[key]);
    managedDatasetKeys = new Set();
    Object.entries(options.dataset || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      element.dataset[key] = String(value);
      managedDatasetKeys.add(key);
    });

    managedAttributeNames.forEach((name) => element.removeAttribute(name));
    managedAttributeNames = new Set();
    Object.entries(options.attributes || {}).forEach(([name, value]) => {
      if (!name || value === undefined || value === null) return;
      element.setAttribute(name, String(value));
      managedAttributeNames.add(name);
    });

    const icon = normalizeIcon(options.icon, options.iconAlt);
    const iconWrap = document.createElement("span");
    const iconImage = document.createElement("img");
    const labelNode = document.createElement("span");

    if (icon) {
      iconWrap.className = "echo-button__icon-wrap";
      iconImage.className = "echo-button__icon";
      iconImage.src = icon.src;
      iconImage.alt = icon.alt || "";
      iconImage.setAttribute("aria-hidden", "true");
      iconWrap.append(iconImage);
    }

    labelNode.className = "echo-button__label";
    labelNode.textContent = label;
    element.replaceChildren(...(icon ? [iconWrap, labelNode] : [labelNode]));

    if (clickHandler) {
      element.removeEventListener("click", clickHandler);
      clickHandler = null;
    }
    if (typeof options.onClick === "function") {
      clickHandler = (event) => options.onClick(event, element);
      element.addEventListener("click", clickHandler);
    }
  }

  const controller = {
    element,
    update(nextOptions = {}) {
      const patch = nextOptions && typeof nextOptions === "object" ? nextOptions : {};

      if (hasOwn(patch, "variant")) options.variant = normalizeVariant(patch.variant);
      else if (hasOwn(patch, "color")) options.variant = normalizeVariant(patch.color);
      else if (hasOwn(patch, "state")) options.variant = normalizeVariant(patch.state);

      if (hasOwn(patch, "state")) options.state = String(patch.state ?? "");
      if (hasOwn(patch, "label")) options.label = String(patch.label ?? "");
      if (hasOwn(patch, "icon")) options.icon = normalizeIcon(patch.icon, options.iconAlt);
      if (hasOwn(patch, "iconAlt")) options.iconAlt = String(patch.iconAlt ?? "");
      if (hasOwn(patch, "size")) options.size = normalizeSize(patch.size);
      if (hasOwn(patch, "type")) options.type = normalizeType(patch.type);
      if (hasOwn(patch, "disabled")) options.disabled = Boolean(patch.disabled);
      if (hasOwn(patch, 'color')) options.color = patch.color;
      else if (hasOwn(patch, 'variant') || hasOwn(patch, 'state')) options.color = null;
      if (hasOwn(patch, "ariaLabel")) options.ariaLabel = String(patch.ariaLabel ?? "");
      if (hasOwn(patch, "title")) options.title = String(patch.title ?? "");
      if (hasOwn(patch, "id")) options.id = String(patch.id ?? "");
      if (hasOwn(patch, "name")) options.name = String(patch.name ?? "");
      if (hasOwn(patch, "value")) options.value = String(patch.value ?? "");
      if (hasOwn(patch, "className")) options.className = patch.className || "";
      if (hasOwn(patch, "attributes")) options.attributes = { ...options.attributes, ...(patch.attributes || {}) };
      if (hasOwn(patch, "dataset")) options.dataset = { ...options.dataset, ...(patch.dataset || {}) };
      if (hasOwn(patch, "onClick")) options.onClick = typeof patch.onClick === "function" ? patch.onClick : null;

      render();
      return element;
    },
    setState(nextState, overrides = {}) {
      const variant = hasOwn(overrides, "variant") ? overrides.variant : nextState;
      return controller.update({ ...overrides, state: nextState, variant });
    },
    getOptions() {
      return cloneOptions(options);
    },
    destroy() {
      if (clickHandler) element.removeEventListener("click", clickHandler);
      delete element.echoButton;
    },
  };

  Object.defineProperty(element, "echoButton", {
    configurable: true,
    enumerable: false,
    value: controller,
  });

  if (initialOptions.color && !initialOptions.variant) options.variant = normalizeVariant(initialOptions.color);
  options.icon = normalizeIcon(options.icon, options.iconAlt);
  render();
  return controller;
}

/** Create a native button using EchoKit's shared structure and semantics. */
export function createEchoButton(options = {}) {
  if (typeof document === "undefined") {
    throw new Error("createEchoButton requires a browser document.");
  }

  const element = document.createElement("button");
  createController(element, options);
  return element;
}

/** Apply the EchoKit Button contract to an existing native button. */
export function upgradeEchoButton(element, options = {}) {
  if (!(element instanceof HTMLButtonElement)) {
    throw new TypeError("upgradeEchoButton expects an HTMLButtonElement.");
  }

  if (element.echoButton) {
    element.echoButton.update(options);
    return element;
  }

  createController(element, options);
  return element;
}

/** Update a button without needing to access its controller directly. */
export function updateEchoButton(element, options = {}) {
  return upgradeEchoButton(element, options);
}

/** Return the controller attached by createEchoButton or upgradeEchoButton. */
export function getEchoButtonController(element) {
  return element?.echoButton || null;
}
