import { useState } from 'react';
import { Table } from '@xui/react';
import type { TableColumn, TableRowKey } from '@xui/core';

type UserRow = {
  id: number;
  name: string;
  age: number;
  city: string;
};

const bigRows: UserRow[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: 20 + (i % 40),
  city: `城市${(i % 20) + 1}`,
}));

const columns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', width: 100, align: 'center' },
  { key: 'city', title: '城市' },
];

export default function TableVirtualDemo() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<TableRowKey[]>([]);

  return (
    <div className="demo-column">
      <Table
        columns={columns}
        dataSource={bigRows}
        rowKey="id"
        virtual
        height={320}
        rowHeight={40}
        stripe
        rowSelection={{ onChange: (keys) => setSelectedRowKeys([...keys]) }}
      />
      <p className="demo-text">
        虚拟滚动 · 1000 行仅渲染可视窗口；当前选中 {selectedRowKeys.length}{' '}
        行（滚动时勾选状态保持）。
      </p>
    </div>
  );
}
