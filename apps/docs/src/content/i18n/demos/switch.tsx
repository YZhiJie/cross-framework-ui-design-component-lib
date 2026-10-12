import { useState } from 'react';
import { getLocale, setLocale } from '@xui-design/react';
import { Button, DatePicker, Modal, Table, Tag } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function I18nSwitchDemo() {
  const isZh = useIsZh();
  const [current, setCurrent] = useState(getLocale());
  const [visible, setVisible] = useState(false);

  const columns = [
    { key: 'name', title: isZh ? '名称' : 'Name' },
    { key: 'age', title: isZh ? '年龄' : 'Age' },
  ];

  const apply = (locale: string) => {
    setLocale(locale);
    setCurrent(getLocale());
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" onClick={() => apply('zh-CN')}>
          {isZh ? '中文' : 'Chinese'}
        </Button>
        <Button onClick={() => apply('en-US')}>English</Button>
        <Tag type="primary">{current}</Tag>
      </div>
      <div className="demo-row">
        <Button type="link" onClick={() => setVisible(true)}>
          {isZh ? '打开 Modal' : 'Open Modal'}
        </Button>
      </div>
      <Modal
        visible={visible}
        title={isZh ? '国际化演示' : 'i18n Demo'}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        {isZh
          ? '底部按钮文案随全局语言切换；点击确认或取消关闭。'
          : 'Footer button text follows the global locale; click OK or Cancel to close.'}
      </Modal>
      <Table columns={columns} dataSource={[]} />
      <DatePicker style={{ width: '240px' }} />
    </div>
  );
}
