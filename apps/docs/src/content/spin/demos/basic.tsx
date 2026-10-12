import { Spin } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SpinBasicDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-row">
      <Spin size="sm" />
      <Spin />
      <Spin size="lg" />
      <Spin size="lg" tip={isZh ? '加载中...' : 'Loading...'} />
    </div>
  );
}
