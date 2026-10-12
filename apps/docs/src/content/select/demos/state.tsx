import { Select } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function SelectStateDemo() {
  const isZh = useIsZh();
  const options = [
    { label: isZh ? '选项一' : 'Option 1', value: '1' },
    { label: isZh ? '选项二' : 'Option 2', value: '2' },
  ];

  return (
    <div className="demo-column">
      <Select options={options} defaultValue="1" />
      <Select options={options} defaultValue="1" disabled />
    </div>
  );
}
