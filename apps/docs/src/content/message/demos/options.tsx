import { Button, message } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function MessageOptionsDemo() {
  const isZh = useIsZh();
  const openPersistent = () => {
    message.open({
      content: isZh
        ? '这条消息不会自动关闭，可手动关闭'
        : 'This message will not auto-close, close it manually',
      duration: 0,
      closable: true,
    });
  };

  return (
    <div className="demo-row">
      <Button type="primary" onClick={openPersistent}>
        {isZh ? '不自动关闭' : 'No auto-close'}
      </Button>
      <Button onClick={() => message.closeAll()}>{isZh ? '关闭全部' : 'Close all'}</Button>
    </div>
  );
}
