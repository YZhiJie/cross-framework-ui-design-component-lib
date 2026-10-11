import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Checkbox from '../Checkbox.vue';

describe('Checkbox (vue)', () => {
  it('渲染结构与默认状态', () => {
    const wrapper = mount(Checkbox, { slots: { default: '同意协议' } });
    expect(wrapper.classes()).toContain('xui-checkbox');
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('同意协议');
  });

  it('非受控模式：点击切换并触发 change 事件', async () => {
    const wrapper = mount(Checkbox);
    await wrapper.find('input').setValue();
    expect(wrapper.find('input').element.checked).toBe(true);
    expect(wrapper.emitted('change')![0]).toEqual([true]);
    await wrapper.find('input').setValue(false);
    expect(wrapper.emitted('change')![1]).toEqual([false]);
  });

  it('受控模式：value 驱动选中态', () => {
    const wrapper = mount(Checkbox, { props: { value: true } });
    expect(wrapper.find('input').element.checked).toBe(true);
    expect(wrapper.classes()).toContain('is-checked');
  });

  it('defaultValue 提供非受控初始状态', () => {
    const wrapper = mount(Checkbox, { props: { defaultValue: true } });
    expect(wrapper.find('input').element.checked).toBe(true);
  });

  it('indeterminate 渲染半选并同步原生属性', async () => {
    const wrapper = mount(Checkbox, { props: { indeterminate: true } });
    const input = wrapper.find('input').element as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(wrapper.classes()).toContain('is-indeterminate');
    expect(wrapper.find('.xui-checkbox__icon').exists()).toBe(true);
  });

  it('disabled 时不触发 change 事件', async () => {
    const wrapper = mount(Checkbox, { props: { disabled: true } });
    await wrapper.find('input').setValue();
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.classes()).toContain('is-disabled');
  });

  it('modelValue 双向绑定', async () => {
    const wrapper = mount(Checkbox, { props: { value: false } });
    await wrapper.find('input').setValue();
    expect(wrapper.emitted('update:value')![0]).toEqual([true]);
  });
});
