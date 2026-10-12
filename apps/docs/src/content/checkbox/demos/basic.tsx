import { useState } from 'react';
import { Checkbox } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function CheckboxBasicDemo() {
  const isZh = useIsZh();
  const [checked, setChecked] = useState(true);

  return (
    <div className="demo-column">
      <Checkbox value={checked} onChange={setChecked}>
        {isZh ? '我已阅读并同意用户协议' : 'I have read and agree to the user agreement'}
      </Checkbox>
      <p className="demo-text">
        {isZh ? '当前选中' : 'Selected'}：{isZh ? (checked ? '是' : '否') : checked ? 'Yes' : 'No'}
      </p>
    </div>
  );
}
