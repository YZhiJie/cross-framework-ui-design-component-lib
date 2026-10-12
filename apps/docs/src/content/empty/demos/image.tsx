import { Empty } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function EmptyImageDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <Empty
        description={isZh ? '自定义插画' : 'Custom illustration'}
        renderImage={() => <span style={{ fontSize: 40 }}>🔍</span>}
      />
      <Empty />
    </div>
  );
}
