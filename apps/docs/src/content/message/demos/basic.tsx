import { Button, message } from '@xui/react';

export default function MessageBasicDemo() {
  return (
    <div className="demo-row">
      <Button onClick={() => message.info('这是一条普通提示')}>Info</Button>
      <Button type="primary" onClick={() => message.success('保存成功')}>
        Success
      </Button>
      <Button onClick={() => message.warning('磁盘空间不足')}>Warning</Button>
      <Button onClick={() => message.error('保存失败，请重试')}>Error</Button>
    </div>
  );
}
