import { Table } from '@xui-design/react';
import type { TableColumn } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TableCustomDemo() {
  const isZh = useIsZh();
  const columns: TableColumn[] = [
    { key: 'name', title: isZh ? '姓名' : 'Name' },
    {
      key: 'action',
      title: isZh ? '操作' : 'Action',
      render: (record: Record<string, unknown>) =>
        isZh ? `查看 ${String(record.name)}` : `View ${String(record.name)}`,
    },
  ];

  const dataSource = isZh
    ? [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
      ]
    : [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];

  return (
    <div className="demo-column">
      <Table columns={columns} dataSource={dataSource} rowKey="id" border />
      <Table
        columns={columns}
        dataSource={[]}
        renderEmpty={() => (
          <span>{isZh ? '自定义空态：没有更多数据啦' : 'Custom empty: no more data'}</span>
        )}
      />
    </div>
  );
}
