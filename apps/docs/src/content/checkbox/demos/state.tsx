import { useState } from 'react';
import { Checkbox } from '@xui-design/react';

export default function CheckboxStateDemo() {
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <div className="demo-column">
      <Checkbox indeterminate={indeterminate} onChange={() => setIndeterminate(false)}>
        全选（半选态，点击后变全选）
      </Checkbox>
      <Checkbox value={false} disabled>
        禁用未选
      </Checkbox>
      <Checkbox value disabled>
        禁用已选
      </Checkbox>
    </div>
  );
}
