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

  it('defaultValue 显示选中值并定位视图，确认后触发 change / update:value', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: '2026-10-11' } });
    expect(wrapper.find('.xui-date-picker__value').text()).toBe('2026-10-11');

    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    expect(wrapper.find('.xui-date-picker__title').text()).toBe('2026 年 10 月');

    const day = wrapper
      .findAll('.xui-date-picker__day')
      .find((node) => node.attributes('aria-label') === '2026-10-15')!;
    await day.trigger('click');
    // 草稿模式：点选仅更新草稿，不收起面板、不触发 change
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(true);

    await wrapper.find('.xui-date-picker__footer-btn--confirm').trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual(['2026-10-15']);
    expect(wrapper.emitted('update:value')?.[0]).toEqual(['2026-10-15']);
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(false);
  });

  it('取消按钮丢弃草稿：值不变、不收起时不触发 change', async () => {
    const wrapper = mount(DatePicker, { props: { defaultValue: '2026-10-11' } });
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    const day = wrapper
      .findAll('.xui-date-picker__day')
      .find((node) => node.attributes('aria-label') === '2026-10-15')!;
    await day.trigger('click');
    // 草稿高亮已切换
    expect(wrapper.find('.xui-date-picker__day.is-selected').attributes('aria-label')).toBe(
      '2026-10-15',
    );

    await wrapper.find('.xui-date-picker__footer-btn--cancel').trigger('click');
    expect(wrapper.find('.xui-date-picker__panel').exists()).toBe(false);
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('.xui-date-picker__value').text()).toBe('2026-10-11');

    // 重新展开：草稿从 value 重新拷贝，高亮回到已确认值
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    expect(wrapper.find('.xui-date-picker__day.is-selected').attributes('aria-label')).toBe(
      '2026-10-11',
    );
  });

  it('无值时确认按钮禁用，选中草稿后可用', async () => {
    const wrapper = mount(DatePicker);
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    const confirm = wrapper.find('.xui-date-picker__footer-btn--confirm');
    expect(confirm.attributes('disabled')).toBeDefined();

    const today = wrapper
      .findAll('.xui-date-picker__day')
      .find((node) => node.classes().includes('is-today'))!;
    await today.trigger('click');
    expect(confirm.attributes('disabled')).toBeUndefined();
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

  it('className / style 透传到根节点', () => {
    const wrapper = mount(DatePicker, {
      props: { className: 'my-x', style: { color: 'red' } },
    });
    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.attributes('style')).toContain('color: red');
  });

  it('clearIcon 插槽替换清除图标', () => {
    const wrapper = mount(DatePicker, {
      props: { defaultValue: '2026-10-11', clearable: true },
      slots: { clearIcon: '<i class="my-clear-x">c</i>' },
    });
    expect(wrapper.find('.xui-date-picker__clear .my-clear-x').exists()).toBe(true);
    expect(wrapper.find('.xui-date-picker__clear svg').exists()).toBe(false);
  });

  it('calendarIcon 插槽替换日历图标', () => {
    const wrapper = mount(DatePicker, {
      slots: { calendarIcon: '<i class="my-cal-x">k</i>' },
    });
    expect(wrapper.find('.xui-date-picker__icon .my-cal-x').exists()).toBe(true);
    expect(wrapper.find('.xui-date-picker__icon svg').exists()).toBe(false);
  });

  it('prevIcon 插槽替换上一月图标', async () => {
    const wrapper = mount(DatePicker, {
      slots: { prevIcon: '<i class="my-prev-x">p</i>' },
    });
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    const prev = wrapper.findAll('.xui-date-picker__nav')[0];
    expect(prev.find('.my-prev-x').exists()).toBe(true);
    expect(prev.find('svg').exists()).toBe(false);
  });

  it('nextIcon 插槽替换下一月图标', async () => {
    const wrapper = mount(DatePicker, {
      slots: { nextIcon: '<i class="my-next-x">n</i>' },
    });
    await wrapper.find('.xui-date-picker__trigger').trigger('click');
    const next = wrapper.findAll('.xui-date-picker__nav')[1];
    expect(next.find('.my-next-x').exists()).toBe(true);
    expect(next.find('svg').exists()).toBe(false);
  });
});
