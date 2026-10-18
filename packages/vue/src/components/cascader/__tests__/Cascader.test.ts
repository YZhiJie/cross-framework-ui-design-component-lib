import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Cascader from '../Cascader.vue';
import type { CascaderOption } from '@xui-design/core';

const options: CascaderOption[] = [
  {
    label: '浙江',
    value: 'zj',
    children: [
      {
        label: '杭州',
        value: 'hz',
        children: [
          { label: '西湖区', value: 'xh' },
          { label: '余杭区', value: 'yh' },
        ],
      },
      { label: '宁波', value: 'nb' },
    ],
  },
  {
    label: '江苏',
    value: 'js',
    children: [{ label: '南京', value: 'nj' }],
  },
];

describe('Cascader (vue)', () => {
  it('渲染占位文案与 BEM 类名', () => {
    const wrapper = mount(Cascader, { props: { options } });
    expect(wrapper.classes()).toContain('xui-cascader');
    expect(wrapper.text()).toContain('请选择');
  });

  it('defaultValue 显示选中路径文案', () => {
    const wrapper = mount(Cascader, {
      props: { options, defaultValue: ['zj', 'hz', 'xh'] },
    });
    expect(wrapper.text()).toContain('浙江 / 杭州 / 西湖区');
  });

  it('点击触发器展开第一列', async () => {
    const wrapper = mount(Cascader, { props: { options } });
    await wrapper.find('.xui-cascader__trigger').trigger('click');
    expect(wrapper.findAll('.xui-cascader__column')).toHaveLength(1);
  });

  it('逐级选择触发 change 事件', async () => {
    const wrapper = mount(Cascader, { props: { options } });
    await wrapper.find('.xui-cascader__trigger').trigger('click');
    // 浙江
    await wrapper.findAll('.xui-cascader__item')[0].trigger('click');
    expect(wrapper.findAll('.xui-cascader__column')).toHaveLength(2);
    // 杭州
    await wrapper
      .findAll('.xui-cascader__column')[1]
      .findAll('.xui-cascader__item')[0]
      .trigger('click');
    expect(wrapper.findAll('.xui-cascader__column')).toHaveLength(3);
    // 西湖区
    await wrapper
      .findAll('.xui-cascader__column')[2]
      .findAll('.xui-cascader__item')[0]
      .trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([
      ['zj', 'hz', 'xh'],
      ['浙江', '杭州', '西湖区'],
    ]);
  });

  it('changeOnSelect 选中任意层级即触发', async () => {
    const wrapper = mount(Cascader, { props: { options, changeOnSelect: true } });
    await wrapper.find('.xui-cascader__trigger').trigger('click');
    await wrapper.findAll('.xui-cascader__item')[0].trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([['zj'], ['浙江']]);
  });

  it('disabled 时点击不展开', async () => {
    const wrapper = mount(Cascader, { props: { options, disabled: true } });
    await wrapper.find('.xui-cascader__trigger').trigger('click');
    expect(wrapper.findAll('.xui-cascader__column')).toHaveLength(0);
  });

  it('clearable 时点击清除触发 clear 事件', async () => {
    const wrapper = mount(Cascader, {
      props: { options, defaultValue: ['zj'], clearable: true },
    });
    await wrapper.find('.xui-cascader__clear').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });
});
