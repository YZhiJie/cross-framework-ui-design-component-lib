import { useState } from 'react';
import { getLocale, setLocale } from '@xui-design/react';
import { Button, DatePicker, Modal, Table, Tag } from '@xui-design/react';

const columns = [
  { key: 'name', title: '名称' },
  { key: 'age', title: '年龄' },
];

export default function I18nSwitchDemo() {
  const [current, setCurrent] = useState(getLocale());
  const [visible, setVisible] = useState(false);

  const apply = (locale: string) => {
    setLocale(locale);
    setCurrent(getLocale());
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={() => apply('zh-CN')}>
          中文
        </Button>
        <Button onClick={() => apply('en-US')}>English</Button>
        <Tag type="primary">{current}</Tag>
      </div>
      <div className="demo-row">
        <Button type="link" onClick={() => setVisible(true)}>
          打开 Modal
        </Button>
      </div>
      <Modal
        visible={visible}
        title="国际化演示"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        底部按钮文案随全局语言切换；点击确认或取消关闭。
      </Modal>
      <Table columns={columns} dataSource={[]} />
      <DatePicker style={{ width: '240px' }} />
    </div>
  );
}
