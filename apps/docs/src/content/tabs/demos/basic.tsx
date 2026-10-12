import { useState } from 'react';
import { Tabs } from '@xui-design/react';
import type { TabItem } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TabsBasicDemo() {
  const isZh = useIsZh();
  const [active, setActive] = useState('overview');

  const items: TabItem[] = [
    { label: isZh ? '概览' : 'Overview', value: 'overview' },
    { label: isZh ? '配置' : 'Config', value: 'config' },
    { label: isZh ? '日志' : 'Logs', value: 'logs', disabled: true },
  ];

  return (
    <Tabs
      value={active}
      onChange={setActive}
      items={items}
      renderPanel={(item) => (
        <p className="demo-text">
          {isZh
            ? `${item.label}页的内容（value: ${item.value}）`
            : `${item.label} panel content (value: ${item.value})`}
        </p>
      )}
    />
  );
}
