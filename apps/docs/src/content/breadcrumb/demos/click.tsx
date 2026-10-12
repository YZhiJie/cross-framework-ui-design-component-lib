import { useState } from 'react';
import { Breadcrumb } from '@xui-design/react';
import type { BreadcrumbItem } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function BreadcrumbClickDemo() {
  const isZh = useIsZh();
  const [lastClick, setLastClick] = useState(
    isZh ? '（点击前级项试试）' : '(Try clicking a non-last item)',
  );
  const items: BreadcrumbItem[] = isZh
    ? [{ label: '首页' }, { label: '归档（禁用）', disabled: true }, { label: '文章详情' }]
    : [
        { label: 'Home' },
        { label: 'Archive (disabled)', disabled: true },
        { label: 'Article Detail' },
      ];

  return (
    <div className="demo-column">
      <Breadcrumb
        items={items}
        onItemClick={(item, index) =>
          setLastClick(
            isZh ? `点击了第 ${index} 项：${item.label}` : `Clicked item ${index}: ${item.label}`,
          )
        }
      />
      <p className="demo-text">
        {lastClick}
        {isZh ? '（末项为当前页，不可点击）' : ' (last item is the current page, not clickable)'}
      </p>
    </div>
  );
}
