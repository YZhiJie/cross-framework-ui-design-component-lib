import { useState } from 'react';
import { Checkbox } from '@xui/react';

export default function CheckboxBasicDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="demo-column">
      <Checkbox value={checked} onChange={setChecked}>
        我已阅读并同意用户协议
      </Checkbox>
      <p className="demo-text">当前选中：{checked ? '是' : '否'}</p>
    </div>
  );
}
