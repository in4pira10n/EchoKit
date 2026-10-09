import { resolveEchoIcon } from "../icon.js";

const defaults = { icon: null, title: '', addition: '', attachment: [100, 80, 60, 40, 20], content: [], name: '', path: '', logo: '', accent: '#2f80ff', active: true, primary: false, available: true, rebuildRequired: false, draggable: false, metrics: [], onClick: null, onDragStart: null, onDragEnd: null };
const iconRatios = new Map();

function setMaskIcon(element, iconName, height, fixedWidth = false) {
  const url = resolveEchoIcon(iconName);
  if (!url) return;
  element.style.setProperty('--icon-url', `url(${JSON.stringify(url)})`);
  element.style.width = `${height}px`;

  const cachedRatio = iconRatios.get(url);
  if (cachedRatio) {
    element.style[fixedWidth ? 'height' : 'width'] = `${fixedWidth ? height / cachedRatio : height * cachedRatio}px`;
    return;
  }

  const probe = new Image();
  probe.onload = () => {
    if (!probe.naturalWidth || !probe.naturalHeight) return;
    const ratio = probe.naturalWidth / probe.naturalHeight;
    iconRatios.set(url, ratio);
    element.style[fixedWidth ? 'height' : 'width'] = `${fixedWidth ? height / ratio : height * ratio}px`;
  };
  probe.src = url;
}

/** Presentation only: scanning, persistence and switching belong to the host app. */
export function createEchoLibraryCard(initial = {}) {
  const element = document.createElement('div');
  const normalize = value => ({
    ...value,
    title: String(value.title ?? value.name ?? ''),
    addition: String(value.addition ?? value.path ?? ''),
    name: String(value.name ?? value.title ?? ''),
    path: String(value.path ?? value.addition ?? ''),
    attachment: Array.isArray(value.attachment) ? value.attachment : [],
    content: Array.isArray(value.content) ? value.content : [],
    metrics: Array.isArray(value.metrics) ? value.metrics.filter(metric => metric && typeof metric === 'object').map(metric => ({ ...metric, label: String(metric.label ?? ''), value: String(metric.value ?? '') })) : [],
  });
  const aliases = patch => ({ ...patch,
    ...(Object.hasOwn(patch, 'name') && !Object.hasOwn(patch, 'title') ? { title: patch.name } : {}),
    ...(Object.hasOwn(patch, 'path') && !Object.hasOwn(patch, 'addition') ? { addition: patch.path } : {}),
  });
  let options = normalize({ ...defaults, ...aliases(initial) });
  const node = (tag, className, text) => {
    const child = document.createElement(tag);
    child.className = className;
    if (text !== undefined) child.textContent = text;
    return child;
  };
  const render = () => {
    element.className = `echo-library-card${options.active ? ' active' : ''}${options.available ? '' : ' is-unavailable'}`;
    element.draggable = Boolean(options.draggable && options.available);
    element.style.setProperty('--library-accent', /^#[\da-f]{6}$/i.test(options.accent) ? options.accent : defaults.accent);
    element.setAttribute('role', options.onClick ? 'button' : 'group');
    if (options.onClick) {
      element.setAttribute('aria-pressed', String(Boolean(options.active)));
      element.setAttribute('aria-disabled', String(!options.available));
    } else {
      element.removeAttribute('aria-pressed');
      element.removeAttribute('aria-disabled');
    }
    element.tabIndex = options.onClick ? 0 : -1;
    element.setAttribute('aria-label', `${options.title}${options.active ? '，已选中' : ''}${options.available ? '' : '，不可用'}`);
    const main = node('div', 'echo-library-card__main');
    const logo = node('div', 'echo-library-card__logo');
    if (options.logo || options.icon) {
      if (options.logo) {
        const image = node('img', '', '');
        image.src = options.logo;
        image.alt = '';
        image.onerror = () => {
          const placeholder = node('span', 'echo-library-card__logo-icon');
          setMaskIcon(placeholder, options.icon || 'rectangle.stack.fill', 26);
          logo.replaceChildren(placeholder);
        };
        logo.append(image);
      } else {
        const placeholder = node('span', 'echo-library-card__logo-icon');
        setMaskIcon(placeholder, options.icon || 'rectangle.stack.fill', 26, true);
        logo.append(placeholder);
      }
    } else {
      const placeholder = node('span', 'echo-library-card__logo-icon');
      setMaskIcon(placeholder, options.icon || 'rectangle.stack.fill', 26, true);
      logo.append(placeholder);
    }
    const fields = node('div', 'echo-library-card__fields');
    const title = node('div', 'echo-library-card__title');
    title.append(node('span', 'echo-library-card__name', options.title));
    if (options.primary) {
      const mark = node('span', 'echo-library-card__primary');
      setMaskIcon(mark, 'star.fill', 16);
      mark.setAttribute('role', 'img');
      mark.setAttribute('aria-label', '主要卡片');
      title.append(mark);
    }
    if (!options.available || options.rebuildRequired) title.append(node('span', 'echo-library-card__badge', !options.available ? '不可用' : '需要重建'));
    const path = node('div', 'echo-library-card__path', options.addition || '尚未设置说明');
    path.title = options.addition;
    const swatches = node('div', 'echo-library-card__swatches');
    swatches.setAttribute('aria-hidden', 'true');
    const attachments = options.attachment;
    attachments.forEach((attachment, index) => {
      const dot = node('span', '');
      const mix = typeof attachment === 'number' ? attachment : Number(attachment?.mix ?? 100 - index * 16);
      dot.style.setProperty('--swatch-mix', `${Math.max(0, Math.min(100, mix))}%`);
      if (attachment instanceof Node) swatches.append(attachment);
      else {
        if (typeof attachment === 'string' && /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(attachment)) dot.style.setProperty('--swatch-color', attachment);
        swatches.append(dot);
      }
    });
    fields.append(title, path, swatches);
    main.append(logo, fields);
    const metrics = node('div', 'echo-library-card__metrics');
    options.content.forEach(entry => {
      if (entry instanceof Node) metrics.append(entry);
      else if (typeof entry === 'function') {
        const result = entry();
        if (result instanceof Node) metrics.append(result);
        else if (Array.isArray(result)) result.filter(item => item instanceof Node).forEach(item => metrics.append(item));
      }
    });
    if (!options.content.length) options.metrics.forEach(metric => {
      const item = node('div', 'echo-library-card__metric');
      item.title = `${metric.label}：${metric.value}`;
      const icon = node('span', 'echo-library-card__metric-icon');
      setMaskIcon(icon, metric.icon || 'externaldrive', 16);
      icon.setAttribute('aria-hidden', 'true');
      item.append(icon, node('span', 'echo-library-card__metric-label', metric.label), node('span', 'echo-library-card__metric-value', metric.value));
      metrics.append(item);
    });
    element.replaceChildren(main, metrics);
  };
  const click = event => { if (options.available) options.onClick?.(event, element); };
  const key = event => {
    if (event.target === element && options.onClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); element.click(); }
  };
  const dragStart = event => { element.classList.add('dragging'); options.onDragStart?.(event, element); };
  const dragEnd = event => { element.classList.remove('dragging'); options.onDragEnd?.(event, element); };
  element.addEventListener('dragstart', dragStart);
  element.addEventListener('dragend', dragEnd);
  element.addEventListener('click', click);
  element.addEventListener('keydown', key);
  element.echoLibraryCard = {
    update(patch = {}) { options = normalize({ ...options, ...aliases(patch) }); render(); return element; },
    getOptions() { return { ...options, attachment: [...options.attachment], content: [...options.content], metrics: options.metrics.map(metric => ({ ...metric })) }; },
    destroy() { element.removeEventListener('click', click); element.removeEventListener('keydown', key); element.removeEventListener('dragstart', dragStart); element.removeEventListener('dragend', dragEnd); delete element.echoLibraryCard; },
  };
  render();
  return element;
}
