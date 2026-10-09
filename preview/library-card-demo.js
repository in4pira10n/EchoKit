import { createEchoLibraryCard } from '../components/library-card/index.js';
import { createEchoMetric } from '../components/metric/metric.js?v=20261010-card-interaction-contrast';
// Illustrative preview values, not local-library statistics.
export const libraryDemoOptions = {
  icon: 'photo', logo: new URL('../assets/background.JPG', import.meta.url).href, title: 'EchoGallery', addition: '/home/Pictures/EchoGallery', active: true, primary: true,
  onClick: (_, card) => card.echoLibraryCard.update({ active: !card.echoLibraryCard.getOptions().active }),
  attachment: ['#2f80ff', '#68a7ff', '#9bc7ff', '#c7def8', '#dce9f6', '#f1f5fa'],
  content: [
    () => createEchoMetric({ label: '创建日期', value: '2026-10-08', icon: 'calendar' }),
    () => createEchoMetric({ label: '上次扫描', value: '尚未扫描', icon: 'clock' }),
    () => createEchoMetric({ label: '不支持的媒体', value: '0', icon: 'exclamationmark.triangle' }),
    () => createEchoMetric({ label: '存储', value: '0 B', icon: 'externaldrive' }),
    () => createEchoMetric({ label: '照片', value: '0', icon: 'photo' }),
    () => createEchoMetric({ label: '视频', value: '0', icon: 'video' }),
  ],
};

export const libraryDemoMetrics = [
  { label: '创建日期', value: '2026-10-08', icon: 'calendar' },
  { label: '上次扫描', value: '尚未扫描', icon: 'clock' },
  { label: '不支持的媒体', value: '0', icon: 'exclamationmark.triangle' },
  { label: '存储', value: '0 B', icon: 'externaldrive' },
  { label: '照片', value: '0', icon: 'photo' },
  { label: '视频', value: '0', icon: 'video' },
];
export function mountLibraryDemo(root = document) {
  root.querySelectorAll('[data-library-demo]').forEach(mount => mount.replaceChildren(createEchoLibraryCard(libraryDemoOptions)));
}
