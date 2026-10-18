import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeSelect from '../TreeSelect.vue';
import type { TreeNode } from '@xui-design/core';

const treeData: TreeNode[] = [
  {
    key: '1',
    label: '节点 1',
    children: [
      { key: '1-1', label: '节点 1-1' },
      {
        key: '1-2',
        label: '节点 1-2',
        children: [{ key: '1-2-1', label: '节点 1-2-1' }],
      },
    ],
  },
  { key: '2', label: '节点 2', disabled: true },
  { key: '3', label: '节点 3' },
];

describe('TreeSelect (vue)', () => {
  it('渲染占位文案与 BEM 类名', () => {
    const wrapper = mount(TreeSelect, { props: { treeData } });
    expect(wrapper.classes()).toContain('xui-tree-select');
    expect(wrapper.text()).toContain('请选择');
  });

  it('defaultValue 显示选中节点文案', () => {
    const wrapper = mount(TreeSelect, { props: { treeData, defaultValue: '3' } });
    expect(wrapper.find('.xui-tree-select__value').text()).toBe('节点 3');
  });

  it('点击触发器展开面板并渲染树节点', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData } });
    await wrapper.find('.xui-tree-select__trigger').trigger('click');
    expect(wrapper.find('.xui-tree-select__panel').exists()).toBe(true);
    expect(wrapper.findAll('.xui-tree-select__node')).toHaveLength(3);
  });

  it('单选：点击叶子选中并收起面板，触发 change 与 update:value', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData } });
    await wrapper.find('.xui-tree-select__trigger').trigger('click');
    // 展开节点 1
    await wrapper.findAll('.xui-tree-select__switcher')[0].trigger('click');
    const titles = wrapper.findAll('.xui-tree-select__title');
    // 节点 1-1
    await titles[1].trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual(['1-1']);
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['1-1']);
    expect(wrapper.find('.xui-tree-select__panel').exists()).toBe(false);
    expect(wrapper.find('.xui-tree-select__value').text()).toBe('节点 1-1');
  });

  it('单选：点击节点 1 展开子级（再次点击子级选中）', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, defaultExpandAll: true } });
    await wrapper.find('.xui-tree-select__trigger').trigger('click');
    await wrapper.findAll('.xui-tree-select__title')[0].trigger('click');
    // 父节点点击即选中（与 antd TreeSelect 口径一致），面板收起
    expect(wrapper.emitted('change')?.[0]).toEqual(['1']);
    expect(wrapper.find('.xui-tree-select__panel').exists()).toBe(false);
  });

  it('disabled 节点不可选中，disabled 时点击不展开', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, defaultExpandAll: true } });
    await wrapper.find('.xui-tree-select__trigger').trigger('click');
    // 展开顺序：节点1, 1-1, 1-2, 1-2-1, 节点2(disabled), 节点3
    await wrapper.findAll('.xui-tree-select__title')[4].trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('.xui-tree-select__panel').exists()).toBe(true);

    const disabled = mount(TreeSelect, { props: { treeData, disabled: true } });
    await disabled.find('.xui-tree-select__trigger').trigger('click');
    expect(disabled.find('.xui-tree-select__panel').exists()).toBe(false);
  });

  it('多选：勾选父级级联后代并渲染标签', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, multiple: true } });
    await wrapper.find('.xui-tree-select__trigger').trigger('click');
    await wrapper.findAll('.xui-tree-select__switcher')[0].trigger('click');
    // 勾选节点 1 复选框
    await wrapper.find('.xui-tree-select__checkbox').trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([['1', '1-1', '1-2', '1-2-1']]);
    // 标签渲染
    const tags = wrapper.findAll('.xui-tree-select__tag');
    expect(tags).toHaveLength(4);
    expect(tags[0].text()).toContain('节点 1');
  });

  it('多选：面板保持展开，标签移除回调 change', async () => {
    const wrapper = mount(TreeSelect, {
      props: { treeData, multiple: true, defaultValue: ['3'] },
    });
    await wrapper.find('.xui-tree-select__trigger').trigger('click');
    expect(wrapper.find('.xui-tree-select__panel').exists()).toBe(true);
    await wrapper.find('.xui-tree-select__tag-close').trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([[]]);
    expect(wrapper.findAll('.xui-tree-select__tag')).toHaveLength(0);
  });

  it('clearable 清空触发 clear 与 update:value', async () => {
    const wrapper = mount(TreeSelect, {
      props: { treeData, defaultValue: '3', clearable: true },
    });
    await wrapper.find('.xui-tree-select__clear').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['']);
    expect(wrapper.find('.xui-tree-select__value').exists()).toBe(false);
  });

  it('defaultExpandAll 展开全部节点', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, defaultExpandAll: true } });
    await wrapper.find('.xui-tree-select__trigger').trigger('click');
    expect(wrapper.findAll('.xui-tree-select__node')).toHaveLength(6);
  });

  it('受控 value 变更同步展示', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData, value: '3' } });
    expect(wrapper.find('.xui-tree-select__value').text()).toBe('节点 3');
    await wrapper.setProps({ value: '1-1' });
    expect(wrapper.find('.xui-tree-select__value').text()).toBe('节点 1-1');
  });

  it('暴露 focus / toggleOpen / close 命令式 API', async () => {
    const wrapper = mount(TreeSelect, { props: { treeData } });
    wrapper.vm.toggleOpen();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-tree-select__panel').exists()).toBe(true);
    wrapper.vm.close();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xui-tree-select__panel').exists()).toBe(false);
  });
});
