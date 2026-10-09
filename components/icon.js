const SYMBOL_DIRECTORY = new URL("../SFSymbols/", import.meta.url);
const SYMBOL_ASSET_VERSION = "2026-10-08";

function isUrl(value) {
  return /^(?:[a-z][a-z\d+.-]*:|\/|\.\.?\/|#)/i.test(value) || value.includes("/");
}

function symbolUrl(name) {
  const normalized = String(name || "").trim().replace(/\.svg$/i, "");
  if (!normalized) return null;
  const url = new URL(`${encodeURIComponent(normalized)}.svg`, SYMBOL_DIRECTORY);
  url.searchParams.set("v", SYMBOL_ASSET_VERSION);
  return url.href;
}

/** Resolve a SF Symbol name or an explicit custom icon URL to a browser URL. */
export function resolveEchoIcon(icon) {
  if (typeof icon === "string") {
    const value = icon.trim();
    if (!value) return null;
    return isUrl(value) ? value : symbolUrl(value);
  }

  if (!icon || typeof icon !== "object") return null;
  if (typeof icon.sfSymbol === "string" || typeof icon.name === "string") {
    return symbolUrl(icon.sfSymbol ?? icon.name);
  }
  const url = icon.url ?? icon.src;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

/** Hydrate static preview images declared with data-echo-icon names. */
export function installEchoIcons(root = document) {
  root.querySelectorAll("img[data-echo-icon]").forEach((image) => {
    const source = resolveEchoIcon(image.dataset.echoIcon);
    if (source) image.src = source;
  });
  return root;
}
