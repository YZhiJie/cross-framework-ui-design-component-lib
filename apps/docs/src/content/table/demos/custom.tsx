import { Table } from '@xui/react';
import type { TableColumn } from '@xui/core';

const columns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  {
    key: 'action',
    title: '操作',
    render: (record) => `查看 ${String(record.name)}`,
  },
];

const dataSource = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
];

export default function TableCustomDemo() {
  return (
    <div className="demo-column">
      <Table columns={columns} dataSource={dataSource} rowKey="id" border />
      <Table
        columns={columns}
        dataSource={[]}
        renderEmpty={() => <span>自定义空态：没有更多数据啦</span>}
      />
    </div>
  );
}
