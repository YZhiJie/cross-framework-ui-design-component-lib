import { Popconfirm, Button } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function PopconfirmVariantsDemo() {
  const isZh = useIsZh();
  return (
    <div className="demo-row">
      <Popconfirm
        content={isZh ? '右侧弹出的气泡确认' : 'Popover confirm on the right'}
        placement="right"
        confirmText={isZh ? '好的' : 'OK'}
        cancelText={isZh ? '再想想' : 'Think again'}
      >
        <Button>{isZh ? '右侧 + 自定义按钮' : 'Right + custom buttons'}</Button>
      </Popconfirm>
      <Popconfirm content={isZh ? '禁用后点击无效' : 'No effect when disabled'} disabled>
        <Button>{isZh ? '禁用' : 'Disabled'}</Button>
      </Popconfirm>
    </div>
  );
}
