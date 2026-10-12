import { Tooltip, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TooltipBasicDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-row">
      <Tooltip content={isZh ? '上方提示' : 'Top tooltip'} placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content={isZh ? '下方提示' : 'Bottom tooltip'} placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content={isZh ? '左侧提示' : 'Left tooltip'} placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content={isZh ? '右侧提示' : 'Right tooltip'} placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  );
}
