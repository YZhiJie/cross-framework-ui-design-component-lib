import { Empty, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function EmptyBasicDemo() {
  const isZh = useIsZh();
  return (
    <Empty description={isZh ? '暂无数据，去创建第一条吧' : 'No data yet — create the first one'}>
      <Button type="primary">{isZh ? '立即创建' : 'Create now'}</Button>
    </Empty>
  );
}
