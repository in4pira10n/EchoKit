import { createEchoLibraryCard } from '../../../components/library-card/index.js';
import { createEchoMetric } from '../../../components/metric/metric.js?v=20261010-card-interaction-contrast';
import { installDetailNavInteractions } from '../detail-nav.js';

installDetailNavInteractions();

const status = document.querySelector('#library-card-practice-status');
const activeField = document.querySelector('[data-card-field="active"]');
const defaultContent = [
  { label: '类型', value: '灵感集合', icon: 'square.grid.2x2' },
  { label: '内容', value: '24 项', icon: 'square.stack.3d.up' },
  { label: '最近更新', value: '今天', icon: 'clock' },
  { label: '参与者', value: '3 人', icon: 'person.2' },
];

const card = createEchoLibraryCard({
  icon: 'square.grid.2x2',
  logo: new URL('../../../assets/background.JPG', import.meta.url).href,
  title: 'EchoKit 设计卡片',
  addition: '一张可以承载多种内容的卡片',
  accent: '#2f80ff',
  active: true,
  attachment: [],
  content: defaultContent.map(metric => () => createEchoMetric(metric)),
  onClick: () => {
    const active = !card.echoLibraryCard.getOptions().active;
    card.echoLibraryCard.update({ active });
    activeField.value = String(active);
    status.textContent = `卡片交互已触发，当前${active ? '选中' : '未选中'}。`;
  },
});
document.querySelector('#library-card-practice-demo').append(card);

document.querySelectorAll('[data-card-field]').forEach(field => field.addEventListener('input', () => {
  const patch = {};
  document.querySelectorAll('[data-card-field]').forEach(input => {
    patch[input.dataset.cardField] = input.dataset.cardType === 'boolean'
      ? input.value === 'true'
      : input.value.trim();
  });

  const accent = document.querySelector('[data-card-field="accent"]');
  const validAccent = /^#[\da-f]{6}$/i.test(accent.value);
  accent.setAttribute('aria-invalid', String(!validAccent));
  if (!validAccent) {
    delete patch.accent;
    status.textContent = '请输入 #RRGGBB 格式的强调色；卡片保留上次有效颜色。';
  } else {
    status.textContent = '卡片基础字段已实时更新。';
  }

  card.echoLibraryCard.update(patch);
}));

const accentInput = document.querySelector('[data-card-field="accent"]');
const accentPicker = document.querySelector('[data-card-color-picker]');
accentPicker.addEventListener('input', () => {
  accentInput.value = accentPicker.value;
  accentInput.dispatchEvent(new Event('input', { bubbles: true }));
});

const defaultContentField = document.createElement('label');
defaultContentField.className = 'echo-kit-practice-field';
const contentMeta = document.createElement('span');
contentMeta.className = 'echo-kit-practice-field-meta';
const contentLabel = document.createElement('span');
contentLabel.textContent = '内容组件示例';
const contentCode = document.createElement('code');
contentCode.textContent = 'content';
contentMeta.append(contentLabel, contentCode);

const contentInput = document.createElement('textarea');
contentInput.id = 'library-card-practice-content';
contentInput.className = 'echo-input echo-kit-practice-input';
contentInput.setAttribute('aria-label', '卡片内容组件 JSON');
contentInput.rows = 6;
contentInput.value = JSON.stringify(defaultContent, null, 2);
defaultContentField.append(contentMeta, contentInput);
document.querySelector('.echo-kit-practice-fields').append(defaultContentField);

contentInput.addEventListener('input', () => {
  try {
    const content = JSON.parse(contentInput.value);
    if (!Array.isArray(content) || content.some(item => !item || typeof item.label !== 'string' || !['string', 'number'].includes(typeof item.value))) {
      throw new Error('invalid content');
    }
    card.echoLibraryCard.update({ content: content.map(item => () => createEchoMetric(item)) });
    status.textContent = '卡片内容组件已更新。';
  } catch {
    status.textContent = '请输入由 label、value 组成的组件数组；卡片保留上次有效内容。';
  }
});

document.querySelector('#library-card-section-filter').addEventListener('input', event => {
  document.querySelectorAll('.echo-kit-detail-section').forEach(section => {
    section.hidden = !section.textContent.toLowerCase().includes(event.target.value.toLowerCase());
  });
});
