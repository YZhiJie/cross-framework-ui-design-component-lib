import { useState } from 'react';
import { Tabs } from '@xui-design/react';
import type { TabItem } from '@xui-design/core';

const items: TabItem[] = [
  { label: '概览', value: 'overview' },
  { label: '配置', value: 'config' },
  { label: '日志', value: 'logs', disabled: true },
];

export default function TabsBasicDemo() {
  const [active, setActive] = useState('overview');

  return (
    <Tabs
      value={active}
      onChange={setActive}
      items={items}
      renderPanel={(item) => (
        <p className="demo-text">
          {item.label}页的内容（value: {item.value}）
        </p>
      )}
    />
  );
}
