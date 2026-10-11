import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Table } from '../Table';
import type { TableColumn } from '@xui/core';

const rows = [
  { id: 1, name: '张三', age: 30 },
  { id: 2, name: '李四', age: 25 },
  { id: 3, name: '王五', age: 28 },
];

const columns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', sortable: true, width: 120, align: 'center' },
];

const cellTexts = (container: HTMLElement, column: number) =>
  Array.from(container.querySelectorAll('tbody tr')).map(
    (row) => row.querySelectorAll('td')[column].textContent,
  );

describe('Table (react)', () => {
  it('渲染表头与单元格数据', () => {
    const { container } = render(<Table columns={columns} dataSource={rows} />);
    const headers = Array.from(container.querySelectorAll('thead th')).map((th) => th.textContent);
    expect(headers).toEqual(['姓名', '年龄']);
    expect(cellTexts(container, 0)).toEqual(['张三', '李四', '王五']);
  });

  it('stripe / border 映射修饰类', () => {
    const { container } = render(<Table columns={columns} dataSource={rows} stripe border />);
    expect(container.querySelector('.xui-table')?.classList.contains('is-striped')).toBe(true);
    expect(container.querySelector('.xui-table')?.classList.contains('is-bordered')).toBe(true);
  });

  it('点击可排序列循环 升序 → 降序 → 取消，aria-sort 同步', () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <Table columns={columns} dataSource={rows} onSortChange={onSortChange} />,
    );
    const sortButton = container.querySelector('.xui-table__sort')!;

    fireEvent.click(sortButton);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'age', order: 'asc' });
    expect(cellTexts(container, 1)).toEqual(['25', '28', '30']);
    expect(container.querySelector('th[aria-sort="ascending"]')).not.toBeNull();

    fireEvent.click(sortButton);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'age', order: 'desc' });
    expect(cellTexts(container, 1)).toEqual(['30', '28', '25']);
    expect(container.querySelector('th[aria-sort="descending"]')).not.toBeNull();

    fireEvent.click(sortButton);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'age', order: null });
    expect(cellTexts(container, 0)).toEqual(['张三', '李四', '王五']);
    expect(container.querySelector('th[aria-sort]')).toBeNull();
  });

  it('不可排序列点击不触发排序', () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <Table columns={columns} dataSource={rows} onSortChange={onSortChange} />,
    );
    fireEvent.click(container.querySelectorAll('thead th')[0]);
    expect(onSortChange).not.toHaveBeenCalled();
    // 仅可排序列渲染排序按钮
    expect(container.querySelectorAll('thead th')[0].querySelector('.xui-table__sort')).toBeNull();
    expect(
      container.querySelectorAll('thead th')[1].querySelector('.xui-table__sort'),
    ).not.toBeNull();
  });

  it('render 回调覆盖单元格显示', () => {
    const withRender: TableColumn[] = [
      { key: 'name', title: '姓名' },
      { key: 'age', title: '年龄', render: (record) => `${record.age} 岁` },
    ];
    const { container } = render(<Table columns={withRender} dataSource={rows} />);
    expect(cellTexts(container, 1)).toEqual(['30 岁', '25 岁', '28 岁']);
  });

  it('空数据渲染默认空态，renderEmpty 覆盖', () => {
    const { container } = render(<Table columns={columns} dataSource={[]} />);
    const empty = container.querySelector('.xui-table__empty');
    expect(empty?.textContent).toBe('暂无数据');
    expect(empty?.getAttribute('colspan')).toBe('2');

    const { container: custom } = render(
      <Table columns={columns} dataSource={[]} renderEmpty={() => <em>无记录</em>} />,
    );
    expect(custom.querySelector('.xui-table__empty')?.textContent).toBe('无记录');
  });

  it('width / align 透传为内联样式', () => {
    const { container } = render(<Table columns={columns} dataSource={rows} />);
    const ageTh = container.querySelectorAll('thead th')[1] as HTMLElement;
    expect(ageTh.style.width).toBe('120px');
    expect(ageTh.style.textAlign).toBe('center');
  });

  it('dataSource 变更保持排序', () => {
    const { container, rerender } = render(<Table columns={columns} dataSource={rows} />);
    fireEvent.click(container.querySelector('.xui-table__sort')!);
    rerender(<Table columns={columns} dataSource={[{ id: 4, name: '赵六', age: 26 }, ...rows]} />);
    expect(cellTexts(container, 1)).toEqual(['25', '26', '28', '30']);
  });
});
