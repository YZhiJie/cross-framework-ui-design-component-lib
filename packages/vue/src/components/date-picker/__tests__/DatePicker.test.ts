import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DatePicker from '../DatePicker.vue';

describe('DatePicker (vue)', () => {
  it('渲染占位文案与日历图标，点击展开面板', async () => {
    const wrapper = mount(DatePicker);
    expect(wrapper.find('.xui-date-picker__placeholder').text()).toBe('请选择日期');
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(false);

    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(true);
    expect(wrapper.find('.xui-date-picker__panel').attributes('role')).toBe('dialog');
    expect(wrapper.findAll('.xui-date-picker__weekday')).toHaveLength(7);
    expect(wrapper.findAll('.xui-date-picker__day')).toHaveLength(42);
  });

  it('再次点击 / Escape 收起面板', async () => {
    const wrapper = mount(DatePicker);
    const trigger = wrapper.find('.xui-date-picker__trigger');
    await trigger.trigger('click');
    await trigger.trigger('click');
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(false);

    await trigger.trigger('click');
    await trigger.trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(false);
  });

  it('defaultValue 显示选中值并定位视图，选择触发 change / update:value', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: '2026-10-11' } });
    expect(wrapper.find('.xui-date-picker__value').text()).toBe('2026-10-11');

    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    expect(wrapper.find('.xui-date-picker__title').text()).toBe('2026 年 10 月');

    const day = wrapper
      .findAll('.xui-date-picker__day')
      .find((node) => node.attributes('aria-label') === '2026-10-15')!;
    await day.trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-10-15']);
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['2026-10-15']);
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(false);
  });

  it('今天与选中态样式标记', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: '2026-10-11' } });
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    const today = wrapper
      .findAll('.xui-date-picker__day')
      .find((node) => node.classes().includes('is-today'));
    expect(today).toBeDefined();
    const selected = wrapper.find('.xui-date-picker__day.is-selected');
    expect(selected.attributes('aria-label')).toBe('2026-10-11');
  });

  it('上 / 下月切换滚动视图', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: '2026-01-15' } });
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    const navs = wrapper.findAll('.xui-date-picker__nav');
    await navs[0].trigger('click');
    expect(wrapper.find('.xui-date-picker__title').text()).toBe('2025 年 12 月');
    await navs[1].trigger('click');
    expect(wrapper.find('.xui-date-picker__title').text()).toBe('2026 年 01 月');
    await navs[1].trigger('click');
    expect(wrapper.find('.xui-date-picker__title').text()).toBe('2026 年 02 月');
  });

  it('clearable 显示清除图标并触发 clear', async () => {
    const onClear = vi.fn();
    const wrapper = mount(DatePicker, {
      props: { defaultValue: '2026-10-11', clearable: true, onClear },
    });
    const clear = wrapper.find('.xui-date-picker__clear');
    expect(clear.exists()).toBe(true);
    await clear.trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.find('.xui-date-picker__value').exists()).toBe(false);
  });

  it('受控模式：value 变更驱动显示', async () => {
    const wrapper = mount(DatePicker, { props: { value: '2026-10-11' } });
    await wrapper.setProps({ value: '2026-11-01' });
    expect(wrapper.find('.xui-date-picker__value').text()).toBe('2026-11-01');
  });

  it('disabled 时不展开、无清除图标', async () => {
    const wrapper = mount(DatePicker, {
      props: { defaultValue: '2026-10-11', clearable: true, disabled: true },
    });
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(false);
    expect(wrapper.find('.xui-date-picker__clear').exists()).toBe(false);
    expect(wrapper.find('.xui-date-picker__trigger').attributes('tabindex')).toBe('-1');
  });
});
