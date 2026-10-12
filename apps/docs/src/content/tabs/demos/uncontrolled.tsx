import { Tabs } from '@xui-design/react';

const items = [
  { label: '章节一', value: 'ch1' },
  { label: '章节二', value: 'ch2' },
  { label: '章节三', value: 'ch3' },
];

export default function TabsUncontrolledDemo() {
  return (
    <Tabs
      defaultValue="ch2"
      items={items}
      renderPanel={(item) => <p className="demo-text">当前激活：{item.label}</p>}
    />
  );
}
