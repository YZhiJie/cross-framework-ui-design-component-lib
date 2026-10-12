import { Table } from '@xui-design/react';
import type { TableColumn } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TableBasicDemo() {
  const isZh = useIsZh();
  const columns: TableColumn[] = [
    { key: 'name', title: isZh ? '姓名' : 'Name' },
    { key: 'age', title: isZh ? '年龄' : 'Age', sortable: true, width: 100, align: 'center' },
    { key: 'city', title: isZh ? '城市' : 'City' },
  ];

  const dataSource = isZh
    ? [
        { id: 1, name: '张三', age: 30, city: 'Beijing' },
        { id: 2, name: '李四', age: 25, city: 'Shanghai' },
        { id: 3, name: '王五', age: 28, city: 'Guangzhou' },
        { id: 4, name: '赵六', age: 32, city: 'Shenzhen' },
      ]
    : [
        { id: 1, name: 'John', age: 30, city: 'Beijing' },
        { id: 2, name: 'Jane', age: 25, city: 'Shanghai' },
        { id: 3, name: 'Mike', age: 28, city: 'Guangzhou' },
        { id: 4, name: 'Lily', age: 32, city: 'Shenzhen' },
      ];

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
