const ROUTE_STYLE_SELECTOR = 'link[rel="stylesheet"][href*="page.css"]';

function canonicalPath(url) {
  return url.pathname.replace(/\/index\.html$/, "/").replace(/\/{2,}/g, "/");
}

function isPreviewRoute(url) {
  return url.origin === window.location.origin && url.pathname.startsWith("/preview/");
}

function absolutizeRouteAssets(root, routeUrl) {
  root.querySelectorAll("[src]").forEach((element) => {
    const source = element.getAttribute("src");
    if (!source || source.startsWith("data:") || source.startsWith("blob:")) return;
    element.setAttribute("src", new URL(source, routeUrl).href);
  });

  root.querySelectorAll("a[href]").forEach((element) => {
    const href = element.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    element.setAttribute("href", new URL(href, routeUrl).href);
  });
}

function replaceRouteStyle(documentFragment, routeUrl) {
  document.querySelectorAll("link[data-echo-kit-route-style]").forEach((link) => link.remove());

  const style = [...documentFragment.querySelectorAll(ROUTE_STYLE_SELECTOR)][0];
  if (!style) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = new URL(style.getAttribute("href"), routeUrl).href;
  link.dataset.echoKitRouteStyle = "true";
  document.head.append(link);
}

function cleanupRouteArtifacts() {
  document.querySelectorAll("[data-echo-kit-route-artifact]").forEach((node) => node.remove());
}

function scrollToHash(hash) {
  if (!hash) return;
  const target = document.getElementById(hash.slice(1));
  const scroller = document.querySelector(".echo-kit-content");
  if (!target || !scroller) return;

  const delta = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 16;
  scroller.scrollBy({ top: delta, behavior: "auto" });
}

async function loadPageScript(documentFragment, routeUrl) {
  const scripts = [...documentFragment.querySelectorAll('script[type="module"][src]')]
    .map((script) => new URL(script.getAttribute("src"), routeUrl).href)
    .filter((src) => !src.includes("/preview.js") && !src.includes("/router.js"));

  for (const source of scripts) {
    await import(`${source}${source.includes("?") ? "&" : "?"}route=${Date.now()}`);
  }
}

async function navigateTo(target, { replace = false } = {}) {
  const routeUrl = new URL(target, window.location.href);
  if (!isPreviewRoute(routeUrl)) {
    window.location.assign(routeUrl.href);
    return;
  }

  const currentUrl = new URL(window.location.href);
  if (canonicalPath(routeUrl) === canonicalPath(currentUrl)) {
    if (routeUrl.hash !== currentUrl.hash) {
      const method = replace ? "replaceState" : "pushState";
      window.history[method]({}, "", `${routeUrl.pathname}${routeUrl.search}${routeUrl.hash}`);
      scrollToHash(routeUrl.hash);
    }
    return;
  }

  if (window.__echoKitRouteLoading) return;
  window.__echoKitRouteLoading = true;

  try {
    const response = await fetch(routeUrl.href, {
      cache: "no-store",
      headers: { Accept: "text/html" },
    });
    if (!response.ok) throw new Error(`Route request failed: ${response.status}`);

    const markup = await response.text();
    const parsed = new DOMParser().parseFromString(markup, "text/html");
    const nextTop = parsed.querySelector("#top");
    const currentTop = document.querySelector("#top");
    if (!nextTop || !currentTop) throw new Error("Route does not contain #top");

    absolutizeRouteAssets(nextTop, routeUrl.href);
    replaceRouteStyle(parsed, routeUrl.href);
    cleanupRouteArtifacts();

    currentTop.replaceWith(nextTop);
    document.title = parsed.title || document.title;
    const method = replace ? "replaceState" : "pushState";
    window.history[method]({}, "", `${routeUrl.pathname}${routeUrl.search}${routeUrl.hash}`);

    window.__echoKitInitPreview?.(document);
    await loadPageScript(parsed, routeUrl.href);
    if (routeUrl.hash) requestAnimationFrame(() => scrollToHash(routeUrl.hash));
  } catch (error) {
    console.warn("EchoKit route fallback:", error);
    window.location.assign(routeUrl.href);
  } finally {
    window.__echoKitRouteLoading = false;
  }
}

function handleRouteClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = event.target.closest("a[href]");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
  if (link.classList.contains("echo-kit-detail-nav-group-title")) return;

  const url = new URL(link.href, window.location.href);
  if (!isPreviewRoute(url)) return;
  if (canonicalPath(url) === canonicalPath(new URL(window.location.href))) return;

  event.preventDefault();
  navigateTo(url.href);
}

document.querySelectorAll(ROUTE_STYLE_SELECTOR).forEach((link) => {
  link.dataset.echoKitRouteStyle = "true";
});

document.addEventListener("click", handleRouteClick);
window.addEventListener("popstate", () => navigateTo(window.location.href, { replace: true }));
window.__echoKitNavigate = navigateTo;
