import { createEchoButton, ECHO_SYSTEM_COLORS } from '../../../components/button/index.js?v=20261008-color-export';
import { installDetailNavInteractions } from '../detail-nav.js';
import { installPresets } from '../presets.js';
installDetailNavInteractions();
installPresets('button');

const get = id => document.querySelector('#button-practice-' + id);
const icon = get('icon');
icon.value = 'checkmark';
const status = get('status');
let count = 0;
const button = createEchoButton({
  label: get('label').value,
  icon: icon.value,
  color: get('color').value,
  onClick: () => { status.textContent = '点击回调已触发 ' + (++count) + ' 次。'; },
});
get('demo').append(button);
let applied = { label: get('label').value, icon: icon.value, color: get('color').value };

function apply() {
  const color = get('color').value.trim();
  const hexColor = /^#([\da-f]{3}|[\da-f]{6})$/i.test(color);
  const valid = hexColor || ECHO_SYSTEM_COLORS.includes(color);
  // Invalid color must not block unrelated text or icon updates.
  const patch = { label: get('label').value, icon: icon.value.trim() || null };
  if (valid) {
    patch.color = color;
    if (hexColor) {
      const hex = color.slice(1);
      get('swatch').value = '#' + (hex.length === 3 ? [...hex].map(char => char + char).join('') : hex);
    } else get('swatch').value = getComputedStyle(button).getPropertyValue(`--echo-color-${color}`).trim();
  }
  if (Object.entries(patch).some(([key, value]) => applied[key] !== value)) {
    button.echoButton.update(patch);
    applied = { ...applied, ...patch };
  }
  get('color').setAttribute('aria-invalid', String(!valid));
  status.textContent = valid ? '' : '请输入系统颜色名或 #RGB / #RRGGBB；颜色保留上次有效值。';
}
for (const name of ['icon', 'label', 'color']) {
  get(name).addEventListener('input', apply);
  get(name).addEventListener('change', apply);
}
function applySwatch() { get('color').value = get('swatch').value; apply(); }
get('swatch').addEventListener('input', applySwatch);
get('swatch').addEventListener('change', applySwatch);
apply();
const filter = document.querySelector('#button-section-filter');
filter?.addEventListener('input', () => document.querySelectorAll('.echo-kit-detail-section').forEach(section => {
  section.hidden = !section.textContent.toLowerCase().includes(filter.value.toLowerCase());
}));
