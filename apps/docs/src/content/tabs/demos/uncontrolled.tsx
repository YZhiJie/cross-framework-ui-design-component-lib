import { Tabs } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TabsUncontrolledDemo() {
  const isZh = useIsZh();
  const items = [
    { label: isZh ? '章节一' : 'Chapter 1', value: 'ch1' },
    { label: isZh ? '章节二' : 'Chapter 2', value: 'ch2' },
    { label: isZh ? '章节三' : 'Chapter 3', value: 'ch3' },
  ];

  return (
    <Tabs
      defaultValue="ch2"
      items={items}
      renderPanel={(item) => (
        <p className="demo-text">{isZh ? `当前激活：${item.label}` : `Active: ${item.label}`}</p>
      )}
    />
  );
}
