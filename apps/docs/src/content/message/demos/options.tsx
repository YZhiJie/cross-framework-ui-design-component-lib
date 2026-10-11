import { Button, message } from '@xui/react';

export default function MessageOptionsDemo() {
  const openPersistent = () => {
    message.open({
      content: '这条消息不会自动关闭，可手动关闭',
      duration: 0,
      closable: true,
    });
  };

  return (
    <div className="demo-row">
      <Button type="primary" onClick={openPersistent}>
        不自动关闭
      </Button>
      <Button onClick={() => message.closeAll()}>关闭全部</Button>
    </div>
  );
}
