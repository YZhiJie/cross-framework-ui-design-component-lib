import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Table from '../Table.vue';
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

const cellTexts = (wrapper: ReturnType<typeof mount>, column: number) =>
  wrapper.findAll('tbody tr').map((row) => row.findAll('td')[column].text());

describe('Table (vue)', () => {
  it('渲染表头与单元格数据', () => {
    const wrapper = mount(Table, { props: { columns, dataSource: rows } });
    expect(wrapper.findAll('thead th').map((th) => th.text())).toEqual(['姓名', '年龄']);
    expect(cellTexts(wrapper, 0)).toEqual(['张三', '李四', '王五']);
  });

  it('stripe / border 映射修饰类', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows, stripe: true, border: true },
    });
    expect(wrapper.classes()).toContain('is-striped');
    expect(wrapper.classes()).toContain('is-bordered');
  });

  it('点击可排序列循环 升序 → 降序 → 取消，aria-sort 同步', async () => {
    const onSortChange = vi.fn();
    const wrapper = mount(Table, { props: { columns, dataSource: rows, onSortChange } });
    const sortButton = wrapper.find('.xui-table__sort');

    await sortButton.trigger('click');
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'age', order: 'asc' });
    expect(cellTexts(wrapper, 1)).toEqual(['25', '28', '30']);
    expect(wrapper.find('thead th[aria-sort="ascending"]').exists()).toBe(true);

    await sortButton.trigger('click');
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'age', order: 'desc' });
    expect(cellTexts(wrapper, 1)).toEqual(['30', '28', '25']);
    expect(wrapper.find('thead th[aria-sort="descending"]').exists()).toBe(true);

    await sortButton.trigger('click');
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'age', order: null });
    expect(cellTexts(wrapper, 0)).toEqual(['张三', '李四', '王五']);
    expect(wrapper.find('thead th[aria-sort]').exists()).toBe(false);
  });

  it('不可排序列点击不触发排序', async () => {
    const onSortChange = vi.fn();
    const wrapper = mount(Table, { props: { columns, dataSource: rows, onSortChange } });
    await wrapper.findAll('thead th')[0].trigger('click');
    expect(onSortChange).not.toHaveBeenCalled();
    // 仅可排序列渲染排序按钮
    expect(wrapper.findAll('thead th')[0].find('.xui-table__sort').exists()).toBe(false);
    expect(wrapper.findAll('thead th')[1].find('.xui-table__sort').exists()).toBe(true);
  });

  it('render 回调覆盖单元格显示', () => {
    const withRender: TableColumn[] = [
      { key: 'name', title: '姓名' },
      { key: 'age', title: '年龄', render: (record) => `${record.age} 岁` },
    ];
    const wrapper = mount(Table, { props: { columns: withRender, dataSource: rows } });
    expect(cellTexts(wrapper, 1)).toEqual(['30 岁', '25 岁', '28 岁']);
  });

  it('空数据渲染空态插槽，自定义插槽覆盖默认文案', () => {
    const wrapper = mount(Table, { props: { columns, dataSource: [] } });
    const empty = wrapper.find('.xui-table__empty');
    expect(empty.text()).toBe('暂无数据');
    expect(empty.attributes('colspan')).toBe('2');
    wrapper.unmount();

    const custom = mount(Table, {
      props: { columns, dataSource: [] },
      slots: { empty: '<em>无记录</em>' },
    });
    expect(custom.find('.xui-table__empty').text()).toBe('无记录');
  });

  it('width / align 透传为内联样式', () => {
    const wrapper = mount(Table, { props: { columns, dataSource: rows } });
    const ageTh = wrapper.findAll('thead th')[1];
    expect(ageTh.attributes('style')).toContain('width: 120px');
    expect(ageTh.attributes('style')).toContain('text-align: center');
  });

  it('rowKey 提供行 key，dataSource 变更保持排序', async () => {
    const wrapper = mount(Table, { props: { columns, dataSource: rows, rowKey: 'id' } });
    await wrapper.find('.xui-table__sort').trigger('click');
    await wrapper.setProps({ dataSource: [{ id: 4, name: '赵六', age: 26 }, ...rows] });
    expect(cellTexts(wrapper, 1)).toEqual(['25', '26', '28', '30']);
  });

  it('className / style 透传到根节点（含 CSS 变量）', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        className: 'my-table',
        style: { '--xui-table-row-height': '48px', margin: '8px' },
      },
    });
    expect(wrapper.classes()).toContain('my-table');
    expect(wrapper.classes()).toContain('xui-table');
    const style = wrapper.attributes('style');
    expect(style).toContain('--xui-table-row-height: 48px');
    expect(style).toContain('margin: 8px');
  });

  it('onRowClick 回调行数据与下标，选择列点击不冒泡', async () => {
    const onRowClick = vi.fn();
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        rowKey: 'id',
        rowSelection: {},
        onRowClick,
      },
    });

    await wrapper.findAll('tbody tr')[1].trigger('click');
    expect(onRowClick).toHaveBeenCalledWith(rows[1], 1);

    // 选择列单元格点击不触发行点击
    await wrapper.findAll('tbody tr')[1].findAll('td')[0].trigger('click');
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it('rowSelection：行勾选 / 全选 / 半选状态联动', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        rowKey: 'id',
        rowSelection: { onChange },
      },
    });

    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]');
    expect(checkboxes).toHaveLength(3);
    // 未选中任何行时全选框未选中且非半选
    const selectAll = wrapper.find('thead input[type="checkbox"]');
    expect((selectAll.element as HTMLInputElement).checked).toBe(false);
    expect((selectAll.element as HTMLInputElement).indeterminate).toBe(false);

    await checkboxes[0].setValue(true);
    expect(onChange).toHaveBeenCalledWith([1], [rows[0]]);
    expect((selectAll.element as HTMLInputElement).indeterminate).toBe(true);

    await checkboxes[1].setValue(true);
    await checkboxes[2].setValue(true);
    expect((selectAll.element as HTMLInputElement).checked).toBe(true);

    await selectAll.setValue(false);
    expect(onChange).toHaveBeenLastCalledWith([], []);
  });

  it('rowSelection 受控模式：selectedRowKeys 驱动勾选状态', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        rowKey: 'id',
        rowSelection: { selectedRowKeys: [2], onChange },
      },
    });

    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]');
    expect((checkboxes[1].element as HTMLInputElement).checked).toBe(true);
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(false);

    await checkboxes[0].setValue(true);
    // keys 顺序为受控集合 + 新勾行；selectedRows 按 dataSource 顺序
    expect(onChange).toHaveBeenCalledWith([2, 1], [rows[0], rows[1]]);
    // 受控：内部状态未变
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(false);

    await wrapper.setProps({ rowSelection: { selectedRowKeys: [2, 1], onChange } });
    expect((checkboxes[0].element as HTMLInputElement).checked).toBe(true);
  });

  it('rowSelection.getCheckboxDisabled：禁用行不可勾选，全选跳过禁用行', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: rows,
        rowKey: 'id',
        rowSelection: { getCheckboxDisabled: (record) => record.id === 2 },
      },
    });

    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]');
    expect((checkboxes[1].element as HTMLInputElement).disabled).toBe(true);

    await wrapper.find('thead input[type="checkbox"]').setValue(true);
    const checked = wrapper
      .findAll('tbody input[type="checkbox"]')
      .filter((box) => (box.element as HTMLInputElement).checked);
    expect(checked).toHaveLength(2);
  });

  it('虚拟模式：默认渲染窗口行 + spacer 占位', async () => {
    const bigRows = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `行${i + 1}` }));
    const wrapper = mount(Table, {
      props: {
        columns: [{ key: 'name', title: '名称' }],
        dataSource: bigRows,
        rowKey: 'id',
        virtual: true,
        height: 300,
        rowHeight: 30,
      },
    });

    expect(wrapper.classes()).toContain('is-virtual');
    // jsdom 视口高 0：窗口 = rawStart 0 + overscan 5 → 6 行（远小于 100）
    const bodyRows = wrapper.findAll('tbody tr');
    expect(bodyRows.length).toBeLessThan(20);
    expect(bodyRows.length).toBeGreaterThan(0);
    // spacer 行存在（filler 占位）
    expect(wrapper.findAll('.xui-table__spacer').length).toBeGreaterThan(0);

    // 滚动到底部更新窗口（jsdom 无布局，scrollTop 经 defineProperty 注入）
    Object.defineProperty(wrapper.element, 'scrollTop', {
      value: 2970,
      configurable: true,
      writable: true,
    });
    await wrapper.trigger('scroll');
    await new Promise((resolve) => setTimeout(resolve, 0));
    const texts = wrapper
      .findAll('tbody tr:not(.xui-table__spacer)')
      .map((row) => row.find('td').text());
    expect(texts).toContain('行100');
  });

  it('sortIcon 作用域插槽替换排序图标（order: asc / desc）', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: rows },
      slots: {
        sortIcon: `<template #sortIcon="{ order }"><i :class="'my-sort-' + order">s</i></template>`,
      },
    });
    const sortIcons = wrapper.find('.xui-table__sort-icons');
    expect(sortIcons.find('.my-sort-asc').exists()).toBe(true);
    expect(sortIcons.find('.my-sort-desc').exists()).toBe(true);
    expect(sortIcons.findAll('svg')).toHaveLength(0);
  });
});
