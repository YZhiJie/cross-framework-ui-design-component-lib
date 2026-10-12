import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { Table } from '../Table';
import type { TableColumn } from '@xui-design/core';

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

  it('renderSortIcon 按 asc / desc 分别调用，不渲染内置 svg', () => {
    const renderSortIcon = vi.fn((ctx: { order: 'asc' | 'desc' }) => (
      <i className={`custom-sort-${ctx.order}`} />
    ));
    const { container } = render(
      <Table columns={columns} dataSource={rows} renderSortIcon={renderSortIcon} />,
    );
    expect(renderSortIcon).toHaveBeenCalledWith({ order: 'asc' });
    expect(renderSortIcon).toHaveBeenCalledWith({ order: 'desc' });
    const icons = container.querySelector('.xui-table__sort-icons')!;
    expect(icons.querySelector('.custom-sort-asc')).not.toBeNull();
    expect(icons.querySelector('.custom-sort-desc')).not.toBeNull();
    expect(icons.querySelector('svg')).toBeNull();
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

  it('className / style 透传到根节点（含 CSS 变量）', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        className="my-table"
        style={{ '--xui-table-row-height': '48px', margin: '8px' }}
      />,
    );
    const root = container.querySelector('.xui-table') as HTMLElement;
    expect(root.classList.contains('my-table')).toBe(true);
    expect(root.style.getPropertyValue('--xui-table-row-height')).toBe('48px');
    expect(root.style.margin).toBe('8px');
  });

  it('onRowClick 回调行数据与下标，选择列点击不冒泡', () => {
    const onRowClick = vi.fn();
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        rowSelection={{}}
        onRowClick={onRowClick}
      />,
    );

    fireEvent.click(container.querySelectorAll('tbody tr')[1]);
    expect(onRowClick).toHaveBeenCalledWith(rows[1], 1);

    fireEvent.click(container.querySelectorAll('tbody tr')[1].querySelectorAll('td')[0]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it('rowSelection：行勾选 / 全选 / 半选状态联动', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Table columns={columns} dataSource={rows} rowKey="id" rowSelection={{ onChange }} />,
    );

    const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]');
    expect(checkboxes).toHaveLength(3);
    const selectAll = container.querySelector('thead input[type="checkbox"]') as HTMLInputElement;
    expect(selectAll.checked).toBe(false);

    fireEvent.click(checkboxes[0]);
    expect(onChange).toHaveBeenCalledWith([1], [rows[0]]);

    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    expect(selectAll.checked).toBe(true);

    fireEvent.click(selectAll);
    expect(onChange).toHaveBeenLastCalledWith([], []);
  });

  it('rowSelection 受控模式：selectedRowKeys 驱动勾选状态', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        rowSelection={{ selectedRowKeys: [2], onChange }}
      />,
    );

    const checkboxes = () => container.querySelectorAll('tbody input[type="checkbox"]');
    expect((checkboxes()[1] as HTMLInputElement).checked).toBe(true);
    expect((checkboxes()[0] as HTMLInputElement).checked).toBe(false);

    fireEvent.click(checkboxes()[0]);
    // keys 顺序为受控集合 + 新勾行；selectedRows 按 dataSource 顺序
    expect(onChange).toHaveBeenCalledWith([2, 1], [rows[0], rows[1]]);
    // 受控：内部状态未变
    expect((checkboxes()[0] as HTMLInputElement).checked).toBe(false);

    rerender(
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        rowSelection={{ selectedRowKeys: [2, 1], onChange }}
      />,
    );
    expect((checkboxes()[0] as HTMLInputElement).checked).toBe(true);
  });

  it('rowSelection.getCheckboxDisabled：禁用行不可勾选，全选跳过禁用行', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="id"
        rowSelection={{ getCheckboxDisabled: (record) => record.id === 2 }}
      />,
    );

    const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]');
    expect((checkboxes[1] as HTMLInputElement).disabled).toBe(true);

    fireEvent.click(container.querySelector('thead input[type="checkbox"]')!);
    const checked = Array.from(container.querySelectorAll('tbody input[type="checkbox"]')).filter(
      (box) => (box as HTMLInputElement).checked,
    );
    expect(checked).toHaveLength(2);
  });

  it('虚拟模式：默认渲染窗口行 + spacer 占位，滚动更新窗口', () => {
    const bigRows = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `行${i + 1}` }));
    const { container } = render(
      <Table
        columns={[{ key: 'name', title: '名称' }]}
        dataSource={bigRows}
        rowKey="id"
        virtual
        height={300}
        rowHeight={30}
      />,
    );

    const root = container.querySelector('.xui-table') as HTMLElement;
    expect(root.classList.contains('is-virtual')).toBe(true);
    // jsdom 视口高 0：窗口 = rawStart 0 + overscan 5 → 6 行（远小于 100）
    const bodyRows = container.querySelectorAll('tbody tr:not(.xui-table__spacer)');
    expect(bodyRows.length).toBeLessThan(20);
    expect(container.querySelectorAll('.xui-table__spacer').length).toBeGreaterThan(0);

    // 滚动到底部更新窗口（jsdom 无布局，scrollTop 经 defineProperty 注入）
    Object.defineProperty(root, 'scrollTop', { value: 2970, configurable: true, writable: true });
    fireEvent.scroll(root);
    const texts = Array.from(container.querySelectorAll('tbody tr:not(.xui-table__spacer) td')).map(
      (td) => td.textContent,
    );
    expect(texts).toContain('行100');
  });
});
