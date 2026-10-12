import { useState } from 'react';
import { getLocale, registerLocale, setLocale } from '@xui-design/react';
import { Button, Modal, Popconfirm, Table, Tag } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function I18nCustomDemo() {
  const isZh = useIsZh();
  const [current, setCurrent] = useState(getLocale());
  const [visible, setVisible] = useState(false);
  const [registered, setRegistered] = useState(false);

  const columns = [
    { key: 'name', title: isZh ? '名称' : 'Name' },
    { key: 'age', title: isZh ? '年龄' : 'Age' },
  ];

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
          {registered
            ? isZh
              ? '已注册 ja-JP'
              : 'ja-JP registered'
            : isZh
              ? '注册日语语言包'
              : 'Register Japanese locale'}
        </Button>
        <Button onClick={() => apply('zh-CN')}>{isZh ? '回到中文' : 'Back to Chinese'}</Button>
        <Tag type="primary">{current}</Tag>
      </div>
      <div className="demo-row">
        <Button type="link" onClick={() => setVisible(true)}>
          {isZh ? '打开 Modal' : 'Open Modal'}
        </Button>
        <Popconfirm
          content={isZh ? '确认删除这条数据吗？' : 'Are you sure you want to delete this record?'}
        >
          <Button>{isZh ? '删除' : 'Delete'}</Button>
        </Popconfirm>
      </div>
      <Modal
        visible={visible}
        title={isZh ? '自定义语言包' : 'Custom Locale'}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        {isZh
          ? '注册后所有组件文案按新语言渲染，未覆盖的分组回退注册时的基底包。'
          : 'After registration, all component text renders in the new language; uncovered groups fall back to the base pack at registration time.'}
      </Modal>
      <Table columns={columns} dataSource={[]} />
    </div>
  );
}
