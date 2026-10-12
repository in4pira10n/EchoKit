import { installPresets } from '../presets.js?v=20261011-complete-blue';
import { createEchoTabs } from "../../../components/tab/index.js";
import { installDetailNavInteractions } from "../detail-nav.js";
import { getTabPreset, getTabPresetOptions, makeTabItems } from "../../tab-presets.js";

installDetailNavInteractions();
installPresets('tab');

const liveDemoMount = document.querySelector("#tab-live-demo");
if (liveDemoMount) {
  liveDemoMount.replaceWith(createEchoTabs({
    ...getTabPresetOptions("gallery"),
    id: liveDemoMount.id,
    ariaLabel: "EchoGallery 主导航示例",
  }));
}

const practiceMount = document.querySelector("#tab-practice-demo");
const practiceTabsInput = document.querySelector("#tab-practice-tabs");
const practiceItemsInput = document.querySelector("#tab-practice-items");
const practiceActiveInput = document.querySelector("#tab-practice-active");
const practiceStatus = document.querySelector("#tab-practice-status");
const practiceCode = document.querySelector("#tab-practice-code");
let practiceTabs = null;

if (practiceMount) {
  const galleryPreset = getTabPreset("gallery");
  practiceTabsInput.value = String(galleryPreset.symbols.length);
  practiceItemsInput.value = galleryPreset.symbols.join(", ");
  practiceActiveInput.value = "0";
  practiceTabs = createEchoTabs({
    ...getTabPresetOptions("gallery"),
    id: "tab-practice-live",
    ariaLabel: "Tabs 快速上手示例",
    onChange: (index) => {
      practiceActiveInput.value = String(index);
      updatePracticeCode();
      practiceStatus.textContent = `当前项目索引：${index}`;
    },
  });
  practiceMount.append(practiceTabs);
}

function getPracticeSymbols() {
  return practiceItemsInput.value.split(/[\n,，]/).map((value) => value.trim()).filter(Boolean);
}

function updatePracticeCode(symbols = getPracticeSymbols(), count = Number(practiceTabsInput.value), activeId = Number(practiceActiveInput.value)) {
  if (!practiceCode) return;
  const items = symbols.slice(0, count);
  const formattedItems = JSON.stringify(items, null, 2).replaceAll("\n", "\n  ");
  practiceCode.textContent = `createEchoTabs({\n  tabs: ${items.length},\n  items: ${formattedItems},\n  activeId: ${activeId}\n});`;
}

function applyPracticeTabs() {
  if (!practiceTabs?.echoTabs) return;
  const symbols = getPracticeSymbols();
  const requestedCount = Math.max(0, Math.floor(Number(practiceTabsInput.value) || 0));
  const count = Math.min(requestedCount, symbols.length);
  const requestedActiveId = Math.floor(Number(practiceActiveInput.value) || 0);
  const activeId = count ? Math.max(0, Math.min(count - 1, requestedActiveId)) : 0;
  const items = makeTabItems(symbols.slice(0, count));

  practiceTabs.echoTabs.update({ tabs: count, items, activeId });
  if (String(activeId) !== practiceActiveInput.value) practiceActiveInput.value = String(activeId);
  updatePracticeCode(symbols, count, activeId);

  if (!symbols.length) {
    practiceStatus.textContent = "请至少输入一个 SF Symbol 名称。";
  } else if (requestedCount > symbols.length) {
    practiceStatus.textContent = `items 只有 ${symbols.length} 项，当前实际显示 ${count} 项。`;
  } else {
    practiceStatus.textContent = "activeId 从 0 开始；切换导航会同步当前索引。";
  }
}

[practiceTabsInput, practiceItemsInput, practiceActiveInput].forEach((input) => {
  input?.addEventListener("input", applyPracticeTabs);
  input?.addEventListener("change", applyPracticeTabs);
});
applyPracticeTabs();

const filter = document.querySelector("#tab-section-filter");
const filterStatus = document.querySelector("#tab-filter-status");
const sections = [...document.querySelectorAll(".echo-kit-detail-section")];
const links = [...document.querySelectorAll("[data-detail-link]")];

function scrollToTarget(target, updateHash = true) {
  const scroller = document.querySelector(".echo-kit-content");
  if (!target || !scroller) return;
  const delta = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 16;
  scroller.scrollBy({ top: delta, behavior: "smooth" });
  if (updateHash) history.pushState(null, "", `#${target.id}`);
}

function applyFilter() {
  const query = filter?.value.trim().toLocaleLowerCase() || "";
  let count = 0;
  sections.forEach((section) => {
    const visible = !query || section.textContent.toLocaleLowerCase().includes(query);
    section.hidden = !visible;
    if (visible) count += 1;
  });
  links.forEach((link) => {
    const target = document.getElementById(link.dataset.detailLink);
    link.hidden = Boolean(target?.hidden);
  });
  if (filterStatus) filterStatus.textContent = query ? `找到 ${count} 个 Tabs 章节` : "显示全部 Tabs 章节";
}

filter?.addEventListener("input", applyFilter);
links.forEach((link) => link.addEventListener("click", (event) => {
  const target = document.getElementById(link.dataset.detailLink);
  if (!target) return;
  event.preventDefault();
  links.forEach((item) => item.removeAttribute("aria-current"));
  link.setAttribute("aria-current", "location");
  scrollToTarget(target);
}));

if (location.hash) {
  requestAnimationFrame(() => scrollToTarget(document.getElementById(location.hash.slice(1)), false));
}
