import { Input } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function InputStateDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <Input value={isZh ? '禁用态' : 'Disabled'} disabled />
      <Input value={isZh ? '只读态' : 'Read-only'} readonly />
      <Input
        placeholder={isZh ? '带前缀内容' : 'With prefix'}
        renderPrefix={() => <span>🔍</span>}
      />
    </div>
  );
}
