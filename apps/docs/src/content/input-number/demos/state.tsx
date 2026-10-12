import { InputNumber } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function InputNumberStateDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <InputNumber
        defaultValue={3}
        min={1}
        max={5}
        placeholder={isZh ? '非受控，1 - 5' : 'Uncontrolled, 1 - 5'}
      />
      <InputNumber defaultValue={8} disabled placeholder={isZh ? '禁用态' : 'Disabled'} />
    </div>
  );
}
