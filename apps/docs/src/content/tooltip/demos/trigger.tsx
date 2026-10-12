import { Tooltip, Input, Button } from '@xui-design/react';

export default function TooltipTriggerDemo() {
  return (
    <div className="demo-column">
      <Tooltip content="聚焦输入框时显示" trigger="focus">
        <Input placeholder="点击聚焦查看 focus 提示" />
      </Tooltip>
      <Tooltip content="禁用后不再响应" disabled>
        <Button>禁用的 Tooltip</Button>
      </Tooltip>
    </div>
  );
}
