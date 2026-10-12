import { Button, message } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function MessageBasicDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-row">
      <Button onClick={() => message.info(isZh ? '这是一条普通提示' : 'A normal info message.')}>
        Info
      </Button>
      <Button
        type="primary"
        onClick={() => message.success(isZh ? '保存成功' : 'Saved successfully')}
      >
        Success
      </Button>
      <Button onClick={() => message.warning(isZh ? '磁盘空间不足' : 'Insufficient disk space')}>
        Warning
      </Button>
      <Button
        onClick={() => message.error(isZh ? '保存失败，请重试' : 'Save failed, please retry')}
      >
        Error
      </Button>
    </div>
  );
}
