import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Switch from '../Switch.vue';

describe('Switch (vue)', () => {
  it('渲染 role="switch" 与默认状态', () => {
    const wrapper = mount(Switch);
    expect(wrapper.attributes('role')).toBe('switch');
    expect(wrapper.attributes('aria-checked')).toBe('false');
    expect(wrapper.classes()).toContain('xui-switch');
    expect(wrapper.classes()).toContain('xui-switch--md');
  });

  it('非受控模式：点击切换并触发 change 事件', async () => {
    const wrapper = mount(Switch);
    await wrapper.trigger('click');
    expect(wrapper.attributes('aria-checked')).toBe('true');
    expect(wrapper.emitted('change')![0]).toEqual([true]);
    await wrapper.trigger('click');
    expect(wrapper.emitted('change')![1]).toEqual([false]);
  });

  it('受控模式：value 驱动选中态', async () => {
    const wrapper = mount(Switch, { props: { value: true } });
    expect(wrapper.attributes('aria-checked')).toBe('true');
    await wrapper.trigger('click');
    // 受控模式下组件不发起新值，仅通知外部
    expect(wrapper.emitted('change')![0]).toEqual([false]);
  });

  it('defaultValue 提供非受控初始状态', () => {
    const wrapper = mount(Switch, { props: { defaultValue: true } });
    expect(wrapper.attributes('aria-checked')).toBe('true');
  });

  it('disabled 时不触发 change 事件', async () => {
    const wrapper = mount(Switch, { props: { disabled: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.classes()).toContain('is-disabled');
  });

  it('loading 时切换被忽略并渲染 spinner', async () => {
    const wrapper = mount(Switch, { props: { loading: true } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.classes()).toContain('is-loading');
    expect(wrapper.find('.xui-switch__spinner').exists()).toBe(true);
  });

  it('size 类名与 modelValue 双向绑定', async () => {
    const wrapper = mount(Switch, { props: { size: 'sm', value: false } });
    expect(wrapper.classes()).toContain('xui-switch--sm');
    await wrapper.trigger('click');
    expect(wrapper.emitted('update:value')![0]).toEqual([true]);
  });
});
