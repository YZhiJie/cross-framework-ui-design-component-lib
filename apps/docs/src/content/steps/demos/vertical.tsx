import { Steps } from '@xui-design/react';
import type { StepItem } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function StepsVerticalDemo() {
  const isZh = useIsZh();

  const items: StepItem[] = [
    { key: 'order', title: isZh ? '创建订单' : 'Create Order', description: '2026-10-18' },
    { key: 'ship', title: isZh ? '商家发货' : 'Shipped', description: isZh ? '顺丰速运' : 'SF Express' },
    { key: 'transit', title: isZh ? '运输中' : 'In Transit' },
    { key: 'sign', title: isZh ? '签收' : 'Signed' },
  ];

  return (
    <div className="demo-column">
      <Steps items={items} value={2} direction="vertical" style={{ maxWidth: '320px' }} />
    </div>
  );
}
