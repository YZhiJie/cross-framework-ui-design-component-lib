import { Breadcrumb } from '@xui-design/react';
import type { BreadcrumbItem } from '@xui-design/core';

const items: BreadcrumbItem[] = [
  { label: '首页' },
  { label: '组件库' },
  { label: '面包屑 Breadcrumb' },
];

export default function BreadcrumbBasicDemo() {
  return (
    <div className="demo-column">
      <Breadcrumb items={items} />
      <Breadcrumb items={items} separator=">" />
    </div>
  );
}
