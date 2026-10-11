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
});
