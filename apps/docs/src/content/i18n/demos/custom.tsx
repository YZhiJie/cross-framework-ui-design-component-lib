import { useState } from 'react';
import { getLocale, registerLocale, setLocale } from '@xui-design/react';
import { Button, Modal, Popconfirm, Table, Tag } from '@xui-design/react';

const columns = [
  { key: 'name', title: '名称' },
  { key: 'age', title: '年龄' },
];

export default function I18nCustomDemo() {
  const [current, setCurrent] = useState(getLocale());
  const [visible, setVisible] = useState(false);
  const [registered, setRegistered] = useState(false);

  const apply = (locale: string) => {
    setLocale(locale);
    setCurrent(getLocale());
  };

  const registerJapanese = () => {
    registerLocale('ja-JP', {
      modal: { ok: 'OK', cancel: 'キャンセル' },
      popconfirm: { confirm: 'OK', cancel: 'キャンセル' },
      table: { empty: 'データがありません' },
    });
    setRegistered(true);
    apply('ja-JP');
  };

  return (
    <div className="demo-column">
      <div className="demo-row">
        <Button type="primary" disabled={registered} onClick={registerJapanese}>
          {registered ? '已注册 ja-JP' : '注册日语语言包'}
        </Button>
        <Button onClick={() => apply('zh-CN')}>回到中文</Button>
        <Tag type="primary">{current}</Tag>
      </div>
      <div className="demo-row">
        <Button type="link" onClick={() => setVisible(true)}>
          打开 Modal
        </Button>
        <Popconfirm content="确认删除这条数据吗？">
          <Button>删除</Button>
        </Popconfirm>
      </div>
      <Modal
        visible={visible}
        title="自定义语言包"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        注册后所有组件文案按新语言渲染，未覆盖的分组回退注册时的基底包。
      </Modal>
      <Table columns={columns} dataSource={[]} />
    </div>
  );
}
