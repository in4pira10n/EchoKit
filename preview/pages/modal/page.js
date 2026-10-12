import { mountModalDemo } from '../../modal-demo.js?v=20261011-complete-blue';
import { createEchoField } from "../../../components/input/index.js";
import { createEchoModal } from "../../../components/modal/index.js";
import { installDetailNavInteractions } from "../detail-nav.js";

installDetailNavInteractions();
mountModalDemo();

const practiceMount = document.querySelector("#modal-practice-demo");
const practiceTitleInput = document.querySelector("#modal-practice-title-input");
const practiceCopyInput = document.querySelector("#modal-practice-copy");
const practiceCancelInput = document.querySelector("#modal-practice-cancel");
const practiceConfirmInput = document.querySelector("#modal-practice-confirm");
const practiceStatus = document.querySelector("#modal-practice-status");
let practiceModal = null;

function mountPracticeModal() {
  practiceModal?.echoModal.destroy();

  practiceModal = createEchoModal({
    id: "modal-practice-live",
    embedded: true,
    className: "echo-kit-detail-modal",
    icon: "slider.horizontal.3",
    title: practiceTitleInput?.value.trim() || "编辑资料",
    addition: practiceCopyInput?.value.trim() || "请填写以下信息，完成后即可继续。",
    content: (body) => {
      body.append(
        createEchoField({
          label: "显示名称",
          name: "displayName",
          placeholder: "请输入内容",
        }),
        createEchoField({
          label: "备注说明",
          name: "notes",
          multiline: true,
          placeholder: "请输入内容",
        }),
      );
    },
    actions: [
      {
        label: practiceCancelInput?.value.trim() || "取消",
        icon: "xmark",
        color: "gray",
        close: false,
      },
      {
        label: practiceConfirmInput?.value.trim() || "完成",
        icon: "checkmark",
        variant: "complete",
        close: false,
        onClick: () => {
          if (practiceStatus) practiceStatus.textContent = "确认操作已触发，展示窗口保持打开。";
        },
      },
    ],
  });

  practiceModal.dataset.echoKitRouteArtifact = "true";
  practiceMount.replaceChildren(practiceModal);
  practiceModal.echoModal.open();
}

if (practiceMount) {
  mountPracticeModal();
  [practiceTitleInput, practiceCopyInput, practiceCancelInput, practiceConfirmInput].forEach((input) => {
    input?.addEventListener("input", mountPracticeModal);
  });
}

const filter = document.querySelector("#modal-section-filter");
const filterStatus = document.querySelector("#modal-filter-status");
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
  if (filterStatus) filterStatus.textContent = query ? `找到 ${count} 个 Modal 章节` : "显示全部 Modal 章节";
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
