import { Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function ButtonSizeDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <Button block>{isZh ? 'Block（宽度撑满容器）' : 'Block (full width)'}</Button>
    </div>
  );
}
