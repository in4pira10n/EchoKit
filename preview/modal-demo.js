import { createEchoModal } from '../components/modal/index.js';
import { createEchoField } from '../components/input/index.js';

export function createModalDemo(kind = 'profile', id = 'modal-demo') {
  const library = kind === 'library';
  const fields = library ? ['资料库名称', '资料库路径', '主色'] : ['姓名', '年龄'];
  const content = fields.map((label, index) => createEchoField({ label, name: `field-${index}`, type: label === '年龄' ? 'number' : 'text', placeholder: label === '主色' ? '#636366' : '请输入内容' }));
  if (library) {
    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = '#636366';
    picker.setAttribute('aria-label', '选择主色');
    picker.className = 'echo-modal__color-picker';
    const field = content[2];
    const text = field.echoInput;
    text.value = picker.value;
    text.maxLength = 7;
    const row = document.createElement('div');
    row.className = 'echo-modal__color-row';
    field.append(row);
    row.append(text, picker);
    picker.addEventListener('input', () => { text.value = picker.value; text.removeAttribute('aria-invalid'); });
    text.addEventListener('input', () => {
      const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(text.value.trim());
      text.setAttribute('aria-invalid', String(!match));
      if (match) picker.value = '#' + (match[1].length === 3 ? [...match[1]].map(char => char + char).join('') : match[1]);
    });
  }
  const actions = library ? [
    { label: '保存', icon: 'square.and.arrow.down', variant: 'primary' },
    { label: '切换', icon: 'arrow.left.arrow.right', color: 'gray' },
    { label: '取消', icon: 'xmark', color: 'gray' },
    { label: '完成', icon: 'checkmark', variant: 'complete' },
  ] : [{ label: '取消', icon: 'xmark', color: 'gray' }, { label: '完成', icon: 'checkmark', variant: 'complete' }];
  const modal = createEchoModal({
    id, embedded: true,
    icon: library ? new URL('../assets/background.JPG', import.meta.url).href : 'macwindow',
    title: library ? '编辑资料库' : '编辑资料',
    addition: library ? '点击头像更换图片；您可以在下方填写其他信息。' : '请填写如下表单以完成申请',
    content,
    actions: actions.map(action => ({ ...action, close: false })),
  });
  modal.echoModal.open();
  return modal;
}

export function mountModalDemo(root = document) {
  const form = root.querySelector('#modal-demo-form');
  if (form) form.replaceWith(createModalDemo());
  root.querySelectorAll('[data-modal-example]').forEach((mount, index) => {
    mount.replaceChildren(createModalDemo(mount.dataset.modalExample, `modal-example-${index}`));
  });
}
