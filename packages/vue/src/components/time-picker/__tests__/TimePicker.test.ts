import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TimePicker from '../TimePicker.vue';

describe('TimePicker (vue)', () => {
  it('渲染占位符与 BEM 类名', () => {
    const wrapper = mount(TimePicker);
    expect(wrapper.classes()).toContain('xui-time-picker');
    expect(wrapper.text()).toContain('请选择时间');
  });

  it('渲染选中值', () => {
    const wrapper = mount(TimePicker, { props: { defaultValue: '09:30:00' } });
    expect(wrapper.text()).toContain('09:30:00');
  });

  it('format=HH:mm 不显示秒', () => {
    const wrapper = mount(TimePicker, {
      props: { defaultValue: '09:30:45', format: 'HH:mm' },
    });
    expect(wrapper.text()).toContain('09:30');
    expect(wrapper.text()).not.toContain('09:30:45');
  });

  it('点击触发器展开面板', async () => {
    const wrapper = mount(TimePicker);
    await wrapper.find('.xui-time-picker__trigger').trigger('click');
    expect(wrapper.find('[aria-label="hour"]').exists()).toBe(true);
  });

  it('点击时间项触发 change 事件', async () => {
    const wrapper = mount(TimePicker);
    await wrapper.find('.xui-time-picker__trigger').trigger('click');
    // 点击 08 时（第一个时列中值为 8 的项）
    const hourItems = wrapper.findAll('[aria-label="hour"] .xui-time-picker__item');
    const target = hourItems.find((el) => el.text() === '08');
    await target?.trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual(['08:00:00']);
  });

  it('disabled 时点击不展开面板', async () => {
    const wrapper = mount(TimePicker, { props: { disabled: true } });
    await wrapper.find('.xui-time-picker__trigger').trigger('click');
    expect(wrapper.find('[aria-label="hour"]').exists()).toBe(false);
  });

  it('clearable 时点击清除触发 clear 事件', async () => {
    const wrapper = mount(TimePicker, {
      props: { defaultValue: '12:00:00', clearable: true },
    });
    await wrapper.find('.xui-time-picker__clear').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });
});
