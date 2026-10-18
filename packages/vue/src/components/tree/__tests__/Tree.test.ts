import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Tree from '../Tree.vue';
import type { TreeNode } from '@xui-design/core';

const data: TreeNode[] = [
  {
    key: 'a',
    label: 'A',
    children: [
      { key: 'a-1', label: 'A-1' },
      {
        key: 'a-2',
        label: 'A-2',
        children: [
          { key: 'a-2-1', label: 'A-2-1' },
          { key: 'a-2-2', label: 'A-2-2', disabled: true },
        ],
      },
    ],
  },
  { key: 'b', label: 'B' },
];

describe('Tree (vue)', () => {
  it('渲染根节点与 BEM 类名，子节点默认收起', () => {
    const wrapper = mount(Tree, { props: { data } });
    expect(wrapper.classes()).toContain('xui-tree');
    expect(wrapper.find('[role="tree"]').exists()).toBe(true);
    // 仅根节点可见
    const titles = wrapper.findAll('.xui-tree__title');
    expect(titles.map((t) => t.text())).toEqual(['A', 'B']);
  });

  it('点击 switcher 展开/收起子节点', async () => {
    const wrapper = mount(Tree, { props: { data } });
    const switcher = wrapper.find('.xui-tree__switcher');
    await switcher.trigger('click');
    expect(wrapper.findAll('.xui-tree__title').map((t) => t.text())).toEqual([
      'A',
      'A-1',
      'A-2',
      'B',
    ]);
    expect(wrapper.emitted('expand')?.[0]).toEqual([['a'], { key: 'a', expanded: true }]);

    await wrapper.find('.xui-tree__switcher').trigger('click');
    expect(wrapper.findAll('.xui-tree__title').map((t) => t.text())).toEqual(['A', 'B']);
  });

  it('defaultExpandAll 展开全部非叶子节点', () => {
    const wrapper = mount(Tree, { props: { data, defaultExpandAll: true } });
    expect(wrapper.findAll('.xui-tree__title').map((t) => t.text())).toEqual([
      'A',
      'A-1',
      'A-2',
      'A-2-1',
      'A-2-2',
      'B',
    ]);
  });

  it('点击标题选中节点并触发 select 事件', async () => {
    const onSelect = vi.fn();
    const wrapper = mount(Tree, { props: { data, onSelect } });
    await wrapper.findAll('.xui-tree__title')[0].trigger('click');
    expect(onSelect).toHaveBeenCalledWith('a', { key: 'a' });
    expect(wrapper.find('.xui-tree__node').classes()).toContain('is-selected');
  });

  it('禁用节点点击标题不触发 select', async () => {
    const onSelect = vi.fn();
    const disabledData: TreeNode[] = [{ key: 'x', label: 'X', disabled: true }];
    const wrapper = mount(Tree, { props: { data: disabledData, onSelect } });
    await wrapper.find('.xui-tree__title').trigger('click');
    expect(onSelect).not.toHaveBeenCalled();
    expect(wrapper.find('.xui-tree__node').classes()).toContain('is-disabled');
  });

  it('checkable 渲染勾选框，点击父级级联勾选非禁用后代', async () => {
    const wrapper = mount(Tree, { props: { data, checkable: true, defaultExpandAll: true } });
    const checkboxes = wrapper.findAll('.xui-tree__checkbox');
    expect(checkboxes.length).toBe(6);

    await checkboxes[0].trigger('click');
    const emitted = wrapper.emitted('check');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0][0]).toEqual(['a', 'a-1', 'a-2', 'a-2-1']);
  });

  it('勾选部分后代父级显示半选态', async () => {
    const wrapper = mount(Tree, {
      props: { data, checkable: true, defaultExpandAll: true, defaultCheckedKeys: ['a-1'] },
    });
    const inners = wrapper.findAll('.xui-tree__checkbox-inner');
    expect(inners[0].classes()).toContain('is-indeterminate');
    expect(inners[1].classes()).toContain('is-checked');
  });

  it('受控 checkedKeys：勾选仅派发事件，内部状态由外部更新', async () => {
    const wrapper = mount(Tree, {
      props: { data, checkable: true, defaultExpandAll: true, checkedKeys: [] },
    });
    await wrapper.findAll('.xui-tree__checkbox')[5].trigger('click'); // 点击 b
    expect(wrapper.emitted('update:checkedKeys')?.[0]).toEqual([['b']]);
    // 内部未更新，无 is-checked
    expect(wrapper.findAll('.xui-tree__checkbox-inner.is-checked').length).toBe(0);

    await wrapper.setProps({ checkedKeys: ['b'] });
    const inners = wrapper.findAll('.xui-tree__checkbox-inner');
    expect(inners[5].classes()).toContain('is-checked');
  });

  it('受控 selectedKey 与 update:selectedKey', async () => {
    const wrapper = mount(Tree, { props: { data, selectedKey: null } });
    await wrapper.findAll('.xui-tree__title')[1].trigger('click');
    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['b']);
    expect(wrapper.findAll('.xui-tree__node.is-selected').length).toBe(0);

    await wrapper.setProps({ selectedKey: 'b' });
    const nodes = wrapper.findAll('.xui-tree__node');
    expect(nodes[1].classes()).toContain('is-selected');
  });

  it('title 插槽自定义节点渲染', () => {
    const wrapper = mount(Tree, {
      props: { data },
      slots: { title: `<template #title="{ node }">★{{ node.label }}</template>` },
    });
    expect(wrapper.findAll('.xui-tree__title')[0].text()).toBe('★A');
  });

  it('ref 命令式 API：expandAll / collapseAll / checkAll / uncheckAll', async () => {
    const wrapper = mount(Tree, { props: { data, checkable: true } });
    const vm = wrapper.vm as unknown as {
      expandAll: () => void;
      collapseAll: () => void;
      checkAll: () => void;
      uncheckAll: () => void;
    };

    vm.expandAll();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-tree__title').length).toBe(6);

    vm.collapseAll();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-tree__title').length).toBe(2);

    vm.expandAll();
    vm.checkAll();
    await wrapper.vm.$nextTick();
    // 禁用叶子 a-2-2 不勾选 → 父级 a 与 a-2 均为半选；叶子 a-1/a-2-1/b 为全选
    expect(wrapper.findAll('.xui-tree__checkbox-inner.is-checked').length).toBe(3);
    expect(wrapper.findAll('.xui-tree__checkbox-inner.is-indeterminate').length).toBe(2);

    vm.uncheckAll();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.xui-tree__checkbox-inner.is-checked').length).toBe(0);
  });

  it('disabled 整棵树：switcher/checkbox/title 均不响应', async () => {
    const wrapper = mount(Tree, { props: { data, checkable: true, disabled: true } });
    await wrapper.find('.xui-tree__switcher').trigger('click');
    expect(wrapper.findAll('.xui-tree__title').length).toBe(2);
    await wrapper.find('.xui-tree__checkbox').trigger('click');
    expect(wrapper.emitted('check')).toBeFalsy();
    await wrapper.find('.xui-tree__title').trigger('click');
    expect(wrapper.emitted('select')).toBeFalsy();
  });
});
