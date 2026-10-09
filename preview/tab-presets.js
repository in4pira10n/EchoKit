const PRESETS = Object.freeze({
  gallery: {
    label: "EchoGallery 时间线",
    symbols: ["timer", "heart", "shuffle", "photo.stack.fill", "memories", "trash", "gearshape"],
    labels: ["时间线", "个人收藏", "乱序相册", "相册", "回忆", "回收站", "设置"],
    activeSymbols: ["timer", "heart.fill", "shuffle", "photo.stack.fill", "memories", "trash", "gearshape.fill"],
  },
  mediaFilter: {
    label: "媒体筛选器",
    symbols: ["photo.stack.fill", "photo", "video.fill"],
    labels: ["全部媒体", "照片", "视频"],
    activeSymbols: ["photo.stack.fill", "photo", "video.fill"],
  },
});

const DEFAULT_LABELS = Object.freeze({
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

const ACTIVE_SYMBOLS = Object.freeze({ heart: "heart.fill", gearshape: "gearshape.fill" });

export function getTabPreset(name = "gallery") {
  return PRESETS[name] || PRESETS.gallery;
}

export function makeTabItems(symbols, labels = []) {
  return symbols.map((icon, index) => {
    const label = labels[index] || DEFAULT_LABELS[icon] || `导航 ${index + 1}`;
    return { icon, iconActive: ACTIVE_SYMBOLS[icon] || icon, ariaLabel: label, title: label };
  });
}

export function getTabPresetOptions(name = "gallery") {
  const preset = getTabPreset(name);
  return {
    tabs: preset.symbols.length,
    items: preset.symbols.map((icon, index) => ({
      icon,
      iconActive: preset.activeSymbols[index],
      ariaLabel: preset.labels[index],
      title: preset.labels[index],
    })),
    activeId: 0,
  };
}
