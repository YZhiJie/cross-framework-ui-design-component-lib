import { useRef, useState } from 'react';
import { Button, message } from '@xui/react';

export default function MessageUpdateDemo() {
  const [closed, setClosed] = useState(false);
  const progressRef = useRef(0);

  const startUpload = () => {
    progressRef.current = 0;
    setClosed(false);
    message.open({ content: '上传中 0%', key: 'upload', duration: 0 });
  };

  const stepUpload = () => {
    progressRef.current = Math.min(progressRef.current + 25, 100);
    const progress = progressRef.current;
    if (progress < 100) {
      message.open({ content: `上传中 ${progress}%`, key: 'upload', duration: 0 });
    } else {
      message.open({
        content: '上传完成',
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
          开始上传
        </Button>
        <Button onClick={stepUpload}>推进进度</Button>
      </div>
      <p className="demo-text">
        同 key 反复 open 原地刷新进度（不堆叠消息）；完成后自动关闭并触发 onClose（已触发：
        {closed ? '是' : '否'}）
      </p>
    </div>
  );
}
