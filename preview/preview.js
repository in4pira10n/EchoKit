import { upgradeEchoButton } from "../js/echokit.js";
import { upgradeEchoTabs } from "../components/tab/index.js";
import { installEchoIcons, resolveEchoIcon } from "../components/icon.js";
import { mountLibraryDemo } from './library-card-demo.js';
import { mountModalDemo } from './modal-demo.js';
import { getTabPresetOptions } from "./tab-presets.js";

const assetUrl = (name) => resolveEchoIcon(name);

export function initPreview(root = document) {
installEchoIcons(root);
mountLibraryDemo(root);
mountModalDemo(root);
const themeToggle = root.querySelector("#theme-toggle");
const themeGlyph = root.querySelector("#theme-glyph");
const backgroundModeToggle = root.querySelector("#background-mode-toggle");
const backgroundModeGlyph = root.querySelector("#background-mode-glyph");
const componentFilter = root.querySelector("#component-filter");
const filterStatus = root.querySelector("#filter-status");
const componentList = root.querySelector(".echo-kit-components");
const contentScroller = root.querySelector(".echo-kit-content");
const buttonDemoElement = root.querySelector("#button-demo");
const buttonDemo = buttonDemoElement ? upgradeEchoButton(buttonDemoElement) : null;
const mainNavElement = root.querySelector("#main-nav");
const mainNav = mainNavElement ? upgradeEchoTabs(mainNavElement, {
  ...getTabPresetOptions("gallery"),
  id: mainNavElement.id,
  ariaLabel: mainNavElement.getAttribute("aria-label") || "EchoGallery 主视图示例",
}) : null;
const modalDemoForm = root.querySelector("#modal-demo-form");
const modalDemoSubmitLabel = root.querySelector("#modal-demo-submit .echo-button__label");
let modalDemoSubmitTimer;

function scrollToContentTarget(target, { behavior = "smooth", updateHash = true } = {}) {
  if (!target || !contentScroller) return;

  const scrollerRect = contentScroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const mobileInset = window.matchMedia("(max-width: 760px)").matches ? 140 : 16;
  const delta = targetRect.top - scrollerRect.top - mobileInset;

  contentScroller.scrollBy({ top: delta, behavior });
  if (updateHash && target.id) history.pushState(null, "", `#${target.id}`);
}

const buttonDemoStates = [
  {
    key: "default",
    variant: "default",
    icon: "xmark",
    label: "取消",
  },
  {
    key: "danger",
    variant: "danger",
    icon: "trash",
    label: "删除",
  },
  {
    key: "complete",
    variant: "complete",
    icon: "checkmark",
    label: "完成",
  },
];

let buttonDemoStateIndex = 0;

function setButtonDemoState(index) {
  if (!buttonDemo?.echoButton) return;

  const state = buttonDemoStates[index] || buttonDemoStates[0];
  buttonDemoStateIndex = buttonDemoStates.indexOf(state);
  buttonDemo.echoButton.setState(state.key, {
    variant: state.variant,
    color: state.key === 'danger' ? 'red' : state.key === 'complete' ? 'blue' : 'gray',
    icon: state.icon,
    label: state.label,
    ariaLabel: `${state.label}，点击切换按钮状态`,
  });
}

setButtonDemoState(0);
buttonDemo?.addEventListener("click", () => {
  setButtonDemoState((buttonDemoStateIndex + 1) % buttonDemoStates.length);
});

function setTheme(theme, { persist = true } = {}) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("title", `切换到${isDark ? "浅" : "深"}色外观`);
  if (themeGlyph) themeGlyph.src = assetUrl(isDark ? "sun.max.fill" : "moon.fill");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#1a1a1a" : "#f5f5f7");

  if (persist) {
    try {
      localStorage.setItem("echokit-preview-theme", theme);
    } catch {
      // The preview still works when browser storage is unavailable.
    }
  }
}

try {
  const savedTheme = localStorage.getItem("echokit-preview-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme, { persist: false });
  } else {
    setTheme("dark", { persist: false });
  }
} catch {
  setTheme("dark", { persist: false });
}

if (themeToggle?.dataset.echoKitBound !== "true") {
  themeToggle.dataset.echoKitBound = "true";
  themeToggle.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
}

function setBackgroundMode(mode) {
  const isOn = mode !== "off";
  document.documentElement.dataset.stageBackground = mode;
  backgroundModeToggle?.setAttribute("aria-pressed", String(isOn));
  backgroundModeToggle?.setAttribute("aria-label", `切换到${isOn ? "无" : "有"}背景`);
  backgroundModeToggle?.setAttribute("title", `切换到${isOn ? "无" : "有"}背景`);
  if (backgroundModeGlyph) backgroundModeGlyph.src = assetUrl(isOn ? "photo.fill" : "square.slash.fill");
}

setBackgroundMode(document.documentElement.dataset.stageBackground);

if (backgroundModeToggle?.dataset.echoKitBound !== "true") {
  backgroundModeToggle.dataset.echoKitBound = "true";
  backgroundModeToggle.addEventListener("click", () => {
    const mode = document.documentElement.dataset.stageBackground === "off" ? "on" : "off";
    setBackgroundMode(mode);
  });
}

modalDemoForm?.addEventListener("reset", () => {
  window.clearTimeout(modalDemoSubmitTimer);
  if (modalDemoSubmitLabel) modalDemoSubmitLabel.textContent = "完成";
});

modalDemoForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!modalDemoSubmitLabel) return;
  window.clearTimeout(modalDemoSubmitTimer);
  modalDemoSubmitLabel.textContent = "已完成";
  modalDemoSubmitTimer = window.setTimeout(() => {
    modalDemoSubmitLabel.textContent = "完成";
  }, 1400);
});

componentFilter?.addEventListener("input", () => {
  const query = componentFilter.value.trim().toLocaleLowerCase();
  const sections = [...document.querySelectorAll(".echo-kit-component")];
  let visibleCount = 0;

  sections.forEach((section) => {
    const text = `${section.dataset.component} ${section.textContent}`.toLocaleLowerCase();
    const visible = !query || text.includes(query);
    section.hidden = !visible;
    document.querySelector(`[data-category-link="${section.dataset.component}"]`)?.toggleAttribute("hidden", !visible);
    if (visible) visibleCount += 1;
  });

  componentList?.classList.toggle("is-filter-empty", visibleCount === 0);
  if (filterStatus) {
    filterStatus.textContent = query
      ? visibleCount ? `找到 ${visibleCount} 个组件类别` : "没有找到匹配的组件"
      : "显示全部组件类别";
  }
});

const categoryLinks = [...document.querySelectorAll("[data-category-link]")];

function setActiveCategory(component) {
  categoryLinks.forEach((link) => {
    if (link.dataset.categoryLink === component) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    setActiveCategory(link.dataset.categoryLink);
    if (!link.hash || !contentScroller) return;

    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    scrollToContentTarget(target);
  });
});

if ("IntersectionObserver" in window) {
  const categoryObserver = new IntersectionObserver((entries) => {
    const activeSection = entries.find((entry) => entry.isIntersecting)?.target;
    if (activeSection) setActiveCategory(activeSection.dataset.component);
  }, { root: contentScroller, rootMargin: "-18% 0px -64% 0px" });

  document.querySelectorAll(".echo-kit-component").forEach((section) => categoryObserver.observe(section));
}

if (componentList && location.hash) {
  requestAnimationFrame(() => {
  const target = root.getElementById(location.hash.slice(1));
    if (target) scrollToContentTarget(target, { behavior: "auto", updateHash: false });
  });
}
}

window.__echoKitInitPreview = initPreview;
initPreview();
