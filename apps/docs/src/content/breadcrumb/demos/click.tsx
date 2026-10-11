import { useState } from 'react';
import { Breadcrumb } from '@xui/react';
import type { BreadcrumbItem } from '@xui/core';

const items: BreadcrumbItem[] = [
  { label: '首页' },
  { label: '归档（禁用）', disabled: true },
  { label: '文章详情' },
];

export default function BreadcrumbClickDemo() {
  const [lastClick, setLastClick] = useState('（点击前级项试试）');

  return (
    <div className="demo-column">
      <Breadcrumb
        items={items}
        onItemClick={(item, index) => setLastClick(`点击了第 ${index} 项：${item.label}`)}
      />
      <p className="demo-text">{lastClick}（末项为当前页，不可点击）</p>
    </div>
  );
}
