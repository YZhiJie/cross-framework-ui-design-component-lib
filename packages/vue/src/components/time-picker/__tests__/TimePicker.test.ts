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

  it('点击时间项仅更新草稿，确认后触发 change 事件', async () => {
    const wrapper = mount(TimePicker);
    await wrapper.find('.xui-time-picker__trigger').trigger('click');
    // 点击 08 时（第一个时列中值为 8 的项）
    const hourItems = wrapper.findAll('[aria-label="hour"] .xui-time-picker__item');
    const target = hourItems.find((el) => el.text() === '08');
    await target?.trigger('click');
    // 草稿阶段不触发 change，面板保持展开
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('.xui-time-picker__panel').exists()).toBe(true);
    // 点击确认提交
    await wrapper.find('.xui-time-picker__footer-btn--confirm').trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual(['08:00:00']);
    expect(wrapper.find('.xui-time-picker__panel').exists()).toBe(false);
  });

  it('点击取消丢弃草稿，不触发 change', async () => {
    const wrapper = mount(TimePicker, { props: { defaultValue: '09:30:00' } });
    await wrapper.find('.xui-time-picker__trigger').trigger('click');
    const hourItems = wrapper.findAll('[aria-label="hour"] .xui-time-picker__item');
    const target = hourItems.find((el) => el.text() === '08');
    await target?.trigger('click');
    await wrapper.find('.xui-time-picker__footer-btn--cancel').trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('.xui-time-picker__panel').exists()).toBe(false);
    // 重新展开后面板高亮回退到已选值
    await wrapper.find('.xui-time-picker__trigger').trigger('click');
    const selected = wrapper.find('[aria-label="hour"] .xui-time-picker__item.is-selected');
    expect(selected.text()).toBe('09');
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
