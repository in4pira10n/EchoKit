export function installDetailNavInteractions(root = document) {
  const group = root.querySelector(".echo-kit-detail-nav-group");
  const title = group?.querySelector(".echo-kit-detail-nav-group-title");
  if (!group || !title) return;

  title.addEventListener("click", (event) => {
    if (!group.classList.contains("is-open")) return;

    event.preventDefault();
    group.classList.remove("is-open");
    title.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
      if (typeof window.__echoKitNavigate === "function") {
        window.__echoKitNavigate(title.href);
      } else {
        window.location.assign(title.href);
      }
    }, 220);
  });
}
