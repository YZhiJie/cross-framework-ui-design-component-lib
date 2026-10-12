import { Breadcrumb } from '@xui-design/react';
import type { BreadcrumbItem } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function BreadcrumbBasicDemo() {
  const isZh = useIsZh();
  const items: BreadcrumbItem[] = isZh
    ? [{ label: '首页' }, { label: '组件库' }, { label: '面包屑 Breadcrumb' }]
    : [{ label: 'Home' }, { label: 'Components' }, { label: 'Breadcrumb' }];

  return (
    <div className="demo-column">
      <Breadcrumb items={items} />
      <Breadcrumb items={items} separator=">" />
    </div>
  );
}
