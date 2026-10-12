import { Tooltip, Input, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TooltipTriggerDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-column">
      <Tooltip
        content={isZh ? '聚焦输入框时显示' : 'Shown when the input is focused'}
        trigger="focus"
      >
        <Input
          placeholder={
            isZh ? '点击聚焦查看 focus 提示' : 'Click to focus and see the focus tooltip'
          }
        />
      </Tooltip>
      <Tooltip content={isZh ? '禁用后不再响应' : 'No response when disabled'} disabled>
        <Button>{isZh ? '禁用的 Tooltip' : 'Disabled Tooltip'}</Button>
      </Tooltip>
    </div>
  );
}
