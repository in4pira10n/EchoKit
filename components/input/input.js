const INPUT_TYPES = new Set([
  "email",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "url",
]);

function normalizeClassNames(className) {
  if (Array.isArray(className)) return className.flatMap(normalizeClassNames);
  return String(className || "")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function setOptionalAttribute(element, name, value) {
  if (value === undefined || value === null || value === "") {
    element.removeAttribute(name);
    return;
  }
  element.setAttribute(name, String(value));
}

function normalizeControlType(type) {
  const value = String(type || "text").toLowerCase();
  return INPUT_TYPES.has(value) ? value : "text";
}

function applyInputOptions(element, options = {}) {
  element.className = ["echo-input", ...normalizeClassNames(options.className)].join(" ");
  if (element instanceof HTMLInputElement) element.type = normalizeControlType(options.type);
  setOptionalAttribute(element, "id", options.id);
  setOptionalAttribute(element, "name", options.name);
  setOptionalAttribute(element, "placeholder", options.placeholder);
  setOptionalAttribute(element, "autocomplete", options.autocomplete);
  setOptionalAttribute(element, "aria-label", options.ariaLabel);
  element.disabled = Boolean(options.disabled);
  element.readOnly = Boolean(options.readOnly);
  element.required = Boolean(options.required);
  if (options.value !== undefined) element.value = String(options.value ?? "");

  Object.entries(options.attributes || {}).forEach(([name, value]) => {
    if (value === undefined || value === null) return;
    element.setAttribute(name, String(value));
  });
  Object.entries(options.dataset || {}).forEach(([name, value]) => {
    if (value === undefined || value === null) return;
    element.dataset[name] = String(value);
  });
}

export function createEchoInput(options = {}) {
  const element = document.createElement(options.multiline ? "textarea" : "input");
  applyInputOptions(element, options);
  if (options.multiline) {
    if (options.rows) element.rows = Number(options.rows);
    if (options.cols) element.cols = Number(options.cols);
  }
  if (typeof options.onInput === "function") element.addEventListener("input", options.onInput);
  if (typeof options.onChange === "function") element.addEventListener("change", options.onChange);
  return element;
}

function renderField(element, options) {
  element.className = ["echo-field", options.error ? "echo-field--error" : "", ...normalizeClassNames(options.className)]
    .filter(Boolean)
    .join(" ");
  element.replaceChildren();

  if (options.label) {
    const label = document.createElement("span");
    label.className = "echo-field__label";
    label.textContent = options.label;
    element.append(label);
  }

  const input = createEchoInput(options);
  element.append(input);

  const hintText = options.error || options.hint;
  if (hintText) {
    const hint = document.createElement("span");
    hint.className = "echo-field__hint";
    hint.textContent = hintText;
    element.append(hint);
  }

  element.echoInput = input;
  return input;
}

export function createEchoField(options = {}) {
  const element = document.createElement(options.wrapperTag === "div" ? "div" : "label");
  let currentOptions = { ...options };
  let input = renderField(element, currentOptions);

  const controller = {
    element,
    get input() {
      return input;
    },
    update(nextOptions = {}) {
      currentOptions = { ...currentOptions, ...nextOptions };
      input = renderField(element, currentOptions);
      return element;
    },
    getOptions() {
      return { ...currentOptions };
    },
    destroy() {
      delete element.echoField;
      delete element.echoInput;
    },
  };

  element.echoField = controller;
  return element;
}

export function getEchoFieldController(element) {
  return element?.echoField || null;
}
