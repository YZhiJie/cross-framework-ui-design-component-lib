import { useState } from 'react';
import { Checkbox } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function CheckboxStateDemo() {
  const isZh = useIsZh();
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <div className="demo-column">
      <Checkbox indeterminate={indeterminate} onChange={() => setIndeterminate(false)}>
        {isZh ? '全选（半选态，点击后变全选）' : 'Select all (indeterminate, click to select all)'}
      </Checkbox>
      <Checkbox value={false} disabled>
        {isZh ? '禁用未选' : 'Disabled unchecked'}
      </Checkbox>
      <Checkbox value disabled>
        {isZh ? '禁用已选' : 'Disabled checked'}
      </Checkbox>
    </div>
  );
}
