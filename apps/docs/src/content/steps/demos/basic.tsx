import { useState } from 'react';
import { Steps, Button } from '@xui-design/react';
import type { StepItem } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function StepsBasicDemo() {
  const isZh = useIsZh();
  const [current, setCurrent] = useState(1);

  const items: StepItem[] = [
    { key: 'info', title: isZh ? '填写信息' : 'Fill Info', description: isZh ? '完善基本资料' : 'Complete profile' },
    { key: 'verify', title: isZh ? '身份验证' : 'Verify' },
    { key: 'pay', title: isZh ? '确认下单' : 'Confirm' },
    { key: 'done', title: isZh ? '完成' : 'Done' },
  ];

  const errorItems: StepItem[] = [
    { key: 'upload', title: isZh ? '上传文件' : 'Upload' },
    { key: 'check', title: isZh ? '校验中' : 'Checking' },
    { key: 'publish', title: isZh ? '发布' : 'Publish' },
  ];

  return (
    <div className="demo-column">
      <Steps
        items={items}
        value={current}
        onChange={setCurrent}
      />
      <div className="demo-row">
        <Button onClick={() => setCurrent((v) => Math.max(0, v - 1))}>{isZh ? '上一步' : 'Prev'}</Button>
        <Button onClick={() => setCurrent((v) => Math.min(items.length - 1, v + 1))}>
          {isZh ? '下一步' : 'Next'}
        </Button>
        <span className="demo-text">{isZh ? `当前：第 ${current + 1} 步` : `Current: ${current + 1}`}</span>
      </div>
      <Steps items={errorItems} value={1} status="error" />
    </div>
  );
}
