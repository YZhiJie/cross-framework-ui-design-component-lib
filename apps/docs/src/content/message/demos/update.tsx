import { useRef, useState } from 'react';
import { Button, message } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function MessageUpdateDemo() {
  const isZh = useIsZh();
  const [closed, setClosed] = useState(false);
  const progressRef = useRef(0);

  const startUpload = () => {
    progressRef.current = 0;
    setClosed(false);
    message.open({
      content: isZh ? `上传中 0%` : `Uploading 0%`,
      key: 'upload',
      duration: 0,
    });
  };

  const stepUpload = () => {
    progressRef.current = Math.min(progressRef.current + 25, 100);
    const progress = progressRef.current;
    if (progress < 100) {
      message.open({
        content: isZh ? `上传中 ${progress}%` : `Uploading ${progress}%`,
        key: 'upload',
        duration: 0,
      });
    } else {
      message.open({
        content: isZh ? '上传完成' : 'Upload complete',
        key: 'upload',
        type: 'success',
        duration: 3000,
        onClose: () => setClosed(true),
      });
    }
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={startUpload}>
          {isZh ? '开始上传' : 'Start upload'}
        </Button>
        <Button onClick={stepUpload}>{isZh ? '推进进度' : 'Advance progress'}</Button>
      </div>
      <p className="demo-text">
        {isZh
          ? '同 key 反复 open 原地刷新进度（不堆叠消息）；完成后自动关闭并触发 onClose（已触发：'
          : 'Repeatedly open with the same key to refresh progress in place (no message stacking); auto-closes when done and triggers onClose (triggered: '}
        {closed ? (isZh ? '是' : 'yes') : isZh ? '否' : 'no'})
      </p>
    </div>
  );
}
