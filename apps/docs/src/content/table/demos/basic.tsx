import { Table } from '@xui-design/react';
import type { TableColumn } from '@xui-design/core';

const columns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', sortable: true, width: 100, align: 'center' },
  { key: 'city', title: '城市' },
];

const dataSource = [
  { id: 1, name: '张三', age: 30, city: 'Beijing' },
  { id: 2, name: '李四', age: 25, city: 'Shanghai' },
  { id: 3, name: '王五', age: 28, city: 'Guangzhou' },
  { id: 4, name: '赵六', age: 32, city: 'Shenzhen' },
];

export default function TableBasicDemo() {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      stripe
      border
      onSortChange={(sort) => console.log('sort-change:', sort.key, sort.order)}
    />
  );
}
