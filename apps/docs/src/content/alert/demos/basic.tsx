import { Alert } from '@xui/react';

export default function AlertBasicDemo() {
  return (
    <div className="demo-column">
      <Alert type="info" title="信息提示" description="这是一条普通的信息性说明。" />
      <Alert type="success" title="成功提示" description="操作已成功完成。" />
      <Alert type="warning" title="警告提示" description="请注意当前操作可能产生的影响。" />
      <Alert type="error" title="错误提示" description="操作失败，请稍后重试。" />
    </div>
  );
}
