import { createEchoButton } from "../button/index.js";
import { resolveEchoIcon } from "../icon.js";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getModal(root, id) {
  if (!id) return null;
  if (root instanceof Document) return root.getElementById(id);
  return root.querySelector(`#${CSS.escape(id)}`);
}

function openModal(modal, trigger) {
  if (!modal || modal.classList.contains("is-open")) return;
  modal._echoPreviousFocus = trigger || document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  if (modal.classList.contains('echo-modal-overlay--embedded')) return;
  const dialog = modal.querySelector('[role="dialog"]');
  dialog?.focus({ preventScroll: true });
}

function closeModal(modal) {
  if (!modal?.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modal._echoPreviousFocus?.focus?.({ preventScroll: true });
  modal._echoPreviousFocus = null;
}

export function openEchoModal(modalOrId, trigger) {
  const modal = typeof modalOrId === "string" ? document.getElementById(modalOrId) : modalOrId;
  openModal(modal, trigger);
  return modal;
}

export function closeEchoModal(modalOrId) {
  const modal = typeof modalOrId === "string" ? document.getElementById(modalOrId) : modalOrId;
  closeModal(modal);
  return modal;
}

export function installModalInteractions(root = document) {
  if (root.__echoModalInteractionsInstalled) return root;
  root.__echoModalInteractionsInstalled = true;

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-echo-modal-open], [data-echo-dialog-open]");
    if (trigger && root.contains(trigger)) {
      const modalId = trigger.getAttribute("data-echo-modal-open") || trigger.getAttribute("data-echo-dialog-open");
      openModal(getModal(root, modalId), trigger);
      return;
    }

    const closeButton = event.target.closest("[data-echo-modal-close]");
    if (closeButton) {
      closeModal(closeButton.closest(".echo-modal-overlay"));
      return;
    }

    if (event.target.matches(".echo-modal-overlay.is-open")) closeModal(event.target);
  });

  root.addEventListener("keydown", (event) => {
    const modal = root.querySelector(".echo-modal-overlay.is-open:not(.echo-modal-overlay--embedded)");
    if (!modal) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal(modal);
      return;
    }

    if (event.key !== "Tab") return;
    const dialog = modal.querySelector('[role="dialog"]');
    const controls = [...(dialog?.querySelectorAll(FOCUSABLE_SELECTOR) || [])];
    if (!controls.length) {
      event.preventDefault();
      dialog?.focus();
      return;
    }

    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  return root;
}

function appendContent(body, content) {
  if (!content) return;
  const result = typeof content === "function" ? content(body) : content;
  if (Array.isArray(result)) result.forEach((item) => appendContent(body, item));
  else if (result instanceof Node) body.append(result);
  else if (typeof result === "string") body.insertAdjacentHTML("beforeend", result);
}

export function createEchoModal(options = {}) {
  const overlay = document.createElement("div");
  overlay.className = `echo-modal-overlay${options.embedded ? ' echo-modal-overlay--embedded' : ''}`;
  overlay.setAttribute("aria-hidden", "true");
  if (options.id) overlay.id = options.id;

  const dialog = document.createElement("div");
  dialog.className = ["echo-modal", ...(Array.isArray(options.className) ? options.className : [options.className])]
    .filter(Boolean)
    .join(" ");
  dialog.setAttribute("role", "dialog");
  if (!options.embedded) dialog.setAttribute("aria-modal", "true");
  dialog.tabIndex = -1;
  if (options.icon || options.title || options.addition || options.copy) {
    const header = document.createElement("div");
    header.className = "echo-modal__header";
    if (options.icon) {
      const mark = document.createElement("span");
      mark.className = "echo-modal__mark";
      mark.setAttribute("aria-hidden", "true");
      const image = document.createElement("img");
      image.src = resolveEchoIcon(options.icon) || "";
      const source = image.src.split(/[?#]/)[0];
      if (!/\.svg$/i.test(source)) mark.classList.add("echo-modal__mark--image");
      image.alt = "";
      mark.append(image);
      header.append(mark);
    }
    const heading = document.createElement("div");
    if (options.title) {
    const title = document.createElement("h2");
    title.className = "echo-modal__title";
    title.id = options.titleId || `${options.id || "echo-modal"}-title`;
    title.textContent = options.title;
    dialog.setAttribute("aria-labelledby", title.id);
      heading.append(title);
    }
    const addition = options.addition ?? options.copy;
    if (addition) {
      const copy = document.createElement("p");
      copy.className = "echo-modal__copy";
      copy.textContent = addition;
      heading.append(copy);
    }
    header.append(heading);
    dialog.append(header);
  }

  const body = document.createElement("div");
  body.className = "echo-modal__body";
  appendContent(body, options.content);
  dialog.append(body);

  if (options.actions?.length) {
    const footer = document.createElement("div");
    footer.className = "echo-modal__footer";
    options.actions.forEach((action) => {
      if (action instanceof Node) { footer.append(action); return; }
      const button = createEchoButton({
        label: action.label,
        icon: action.icon,
        variant: action.variant,
        color: action.color,
        size: action.size || "md",
        type: action.type || "button",
        disabled: action.disabled,
        ariaLabel: action.ariaLabel || action.label,
        attributes: action.close === false ? {} : { "data-echo-modal-close": "" },
        onClick: (event, element) => action.onClick?.(event, element),
      });
      footer.append(button);
    });
    dialog.append(footer);
  }

  overlay.append(dialog);
  installModalInteractions(document);

  const controller = {
    element: overlay,
    dialog,
    open(trigger) {
      openModal(overlay, trigger);
      return overlay;
    },
    close() {
      closeModal(overlay);
      return overlay;
    },
    toggle(trigger) {
      if (overlay.classList.contains("is-open")) return controller.close();
      return controller.open(trigger);
    },
    destroy() {
      overlay.remove();
      delete overlay.echoModal;
    },
  };
  overlay.echoModal = controller;
  return overlay;
}

export function getEchoModalController(element) {
  return element?.echoModal || null;
}

export const installDialogTriggers = installModalInteractions;
