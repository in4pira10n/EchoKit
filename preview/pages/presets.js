import { createEchoButton } from '../../components/button/index.js';
import { createEchoTabs } from '../../components/tab/index.js';
import { createEchoModal } from '../../components/modal/index.js';
import { createEchoLibraryCard } from '../../components/library-card/index.js';
import { libraryDemoOptions } from '../library-card-demo.js';
import { getTabPreset, getTabPresetOptions } from '../tab-presets.js';

export function installPresets(kind) {
  const select = document.querySelector(`#${kind}-preset`);
  const mount = document.querySelector(`#${kind}-preset-demo`);
  const code = document.querySelector(`#${kind}-preset-code`);
  if (!select || !mount) return;
  let modal = null;
  const render = () => {
    modal?.echoModal?.destroy();
    modal = null;
    mount.firstElementChild?.echoButton?.destroy();
    mount.firstElementChild?.echoTabs?.destroy();
    mount.firstElementChild?.echoLibraryCard?.destroy();
    const value = select.value;
    let options;
    let component;
    if (kind === 'button') {
      const presets = {
        default: { color: 'gray', label: '取消', icon: 'xmark' },
        complete: { variant: 'complete', label: '完成', icon: 'checkmark' },
        primary: { variant: 'primary', label: '保存', icon: 'square.and.arrow.down' },
        danger: { color: 'red', label: '删除', icon: 'trash' },
        switch: { color: 'gray', variant: 'switch', label: '切换外观', icon: 'sun.max', size: 'icon' },
      };
      options = presets[value];
      component = createEchoButton(options);
      if (value === 'switch') component.echoButton.update({ onClick: (_, button) => {
        const active = button.getAttribute('aria-pressed') === 'true';
        button.echoButton.update({ icon: active ? 'sun.max' : 'moon', attributes: { 'aria-pressed': String(!active) } });
      } });
    } else if (kind === 'tab') {
      options = getTabPresetOptions(value);
      component = createEchoTabs(options);
    } else if (kind === 'modal') {
      options = { icon: value === 'danger' ? 'exclamationmark.triangle' : 'slider.horizontal.3', title: { edit: '编辑资料', confirm: '确认操作', danger: '删除确认' }[value], addition: value === 'danger' ? '此操作不可撤销。' : '确认后继续。', content: (body) => body.append(document.createElement('p')), actions: [{ label: '取消', close: false }, { label: value === 'danger' ? '删除' : '完成', variant: value === 'danger' ? 'danger' : 'complete', close: false }] };
      modal = createEchoModal(options);
      modal.dataset.echoKitRouteArtifact = 'true';
      mount.replaceChildren(modal);
      modal.echoModal.open();
      component = modal;
    } else {
      options = { name: libraryDemoOptions.name, path: libraryDemoOptions.path, active: value === 'active', available: value !== 'unavailable', rebuildRequired: value === 'rebuild' };
      component = createEchoLibraryCard({ ...libraryDemoOptions, ...options });
    }
    mount.replaceChildren(component);
    if (kind === 'tab') {
      const symbols = getTabPreset(value).symbols;
      code.textContent = `createEchoTabs({\n  tabs: ${options.tabs},\n  items: ${JSON.stringify(symbols, null, 2).replaceAll('\n', '\n  ')},\n  activeId: ${options.activeId}\n});`;
    } else {
      code.textContent = `createEcho${{ button: 'Button', modal: 'Modal', 'library-card': 'LibraryCard' }[kind]}(${JSON.stringify(options, null, 2)});`;
    }
  };
  select.addEventListener('change', render);
  select.addEventListener('input', render);
  render();
}
